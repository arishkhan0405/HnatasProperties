/**
 * ============================================================================
 * HANTAS PROPERTIES - LEAD MANAGEMENT & AUTOMATED NURTURING SYSTEM
 * ============================================================================
 * Central Google Apps Script Backend for:
 * 1. Capturing Website Site Visit & Plot Inquiries
 * 2. Storing Leads in Google Sheets with Unique Lead IDs & Full Metadata
 * 3. Instant Email Notification to arish@hantasai.com & Customer Auto-Reply
 * 4. Meta WhatsApp Cloud API Integration (Instant Welcome Acknowledgement)
 * 5. Automatic WhatsApp Lead Nurturing every 3 days (Max 5 Follow-ups)
 * 6. Daily Time-Driven Triggers & Concurrency Locking (LockService)
 * 7. Opt-Out & Stop Handling for Regulatory Compliance
 * ============================================================================
 */

// Global Configuration
const CONFIG = {
  ADMIN_EMAIL: 'arish@hantasai.com',
  TIMEZONE: 'Asia/Kolkata',
  SHEET_NAME: 'Leads',
  COMPANY_NAME: 'Hantas Properties',
  HOTLINE: '+91 96002 69317',
  MAX_FOLLOW_UPS: 5,
  FOLLOW_UP_INTERVAL_DAYS: 3,
  COLUMNS: [
    'Lead ID',
    'Created At',
    'Full Name',
    'Email',
    'Phone Number',
    'Project of Interest',
    'Preferred Visit Date',
    'Vehicle Pick-up Service',
    'Special Requests',
    'WhatsApp Consent',
    'Lead Status',
    'Email Status',
    'WhatsApp Status',
    'Last Follow-up Date',
    'Next Follow-up Date',
    'Follow-up Count',
    'Opt-out Status',
    'Last Error'
  ],
  LEAD_STATUSES: [
    'New',
    'Contacted',
    'Site Visit Scheduled',
    'Site Visit Completed',
    'Interested',
    'Converted',
    'Closed',
    'Do Not Contact',
    'Paused'
  ],
  STOP_STATUSES: [
    'Converted',
    'Closed',
    'Do Not Contact',
    'Paused',
    'Opted Out'
  ]
};

/**
 * ----------------------------------------------------------------------------
 * 1. WEB APP HTTP POST HANDLER (doPost)
 * Handles incoming form submissions from the website and WhatsApp webhooks.
 * ----------------------------------------------------------------------------
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    // Acquire lock with 25-second wait to prevent concurrent race conditions
    lock.waitLock(25000);

    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse({ success: false, error: 'Empty request payload received.' });
    }

    let payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return createJsonResponse({ success: false, error: 'Invalid JSON payload: ' + parseErr.message });
    }

    // A. Check if this is an incoming Meta WhatsApp Webhook event (e.g. customer replied "STOP")
    if (payload.object === 'whatsapp_business_account' || payload.entry) {
      return handleIncomingWhatsAppWebhook(payload);
    }

    // B. Handle Website Lead Submission
    return processWebsiteLeadSubmission(payload);

  } catch (err) {
    Logger.log('Critical error in doPost: ' + err.toString());
    return createJsonResponse({
      success: false,
      error: 'Server error processing inquiry: ' + err.message
    });
  } finally {
    try {
      lock.releaseLock();
    } catch (ignore) {}
  }
}

/**
 * ----------------------------------------------------------------------------
 * 2. WEB APP HTTP GET HANDLER (doGet)
 * Handles Meta Webhook verification challenge & Health Check.
 * ----------------------------------------------------------------------------
 */
function doGet(e) {
  // Meta WhatsApp Cloud API Webhook Verification
  if (e && e.parameter) {
    const mode = e.parameter['hub.mode'];
    const token = e.parameter['hub.verify_token'];
    const challenge = e.parameter['hub.challenge'];

    const storedVerifyToken = getSecret('WHATSAPP_VERIFY_TOKEN') || 'hantas_webhook_secret_2026';

    if (mode === 'subscribe' && token === storedVerifyToken) {
      Logger.log('Meta Webhook verified successfully!');
      return ContentService.createTextOutput(challenge).setMimeType(ContentService.MimeType.TEXT);
    }
  }

  // General Health Check
  const status = {
    status: 'ONLINE',
    system: 'Hantas Properties Lead Management Engine',
    timezone: CONFIG.TIMEZONE,
    timestamp: getKolkataTimestamp(),
    spreadsheetId: SpreadsheetApp.getActiveSpreadsheet().getId()
  };
  return createJsonResponse(status);
}

/**
 * ----------------------------------------------------------------------------
 * 3. PROCESS WEBSITE LEAD SUBMISSION
 * ----------------------------------------------------------------------------
 */
function processWebsiteLeadSubmission(data) {
  // 1. Validate & sanitize required fields (supports both camelCase and snake_case)
  const clientName = sanitize(data.fullName || data.client_name || data.name || '');
  const clientEmail = sanitize(data.email || data.client_email || '').toLowerCase();
  const rawPhone = sanitize(data.phone || data.client_phone || '');
  const project = sanitize(data.projectOfInterest || data.project_of_interest || data.project || data.selected_project || 'General Plot Layout');
  const visitDate = sanitize(data.preferredVisitDate || data.preferred_visit_date || data.visit_date || 'Flexible');
  const transport = sanitize(data.vehiclePickupService || data.vehicle_pickup_service || data.transport || 'Self Vehicle Arrival');
  const requests = sanitize(data.specialRequests || data.special_requests || data.notes || 'None');
  const submissionId = sanitize(data.submissionId || data.submission_id || '');
  const consentRaw = String(data.whatsappConsent || data.whatsapp_consent || '').toLowerCase();
  const waConsent = (consentRaw === 'yes' || consentRaw === 'true' || consentRaw === '1') ? 'YES' : 'NO';

  if (!clientName) {
    return createJsonResponse({ success: false, error: 'Full Name is required.' });
  }

  if (!clientEmail || !validateEmail(clientEmail)) {
    return createJsonResponse({ success: false, error: 'A valid Email Address is required.' });
  }

  const normalizedPhone = normalizeIndianPhone(rawPhone);
  if (!normalizedPhone) {
    return createJsonResponse({
      success: false,
      error: 'Please enter a valid 10-digit Indian phone number (e.g. +91 98765 43210).'
    });
  }

  // 2. Duplicate prevention using CacheService (10-minute cache window)
  const cache = CacheService.getScriptCache();
  if (submissionId) {
    const cachedLeadId = cache.get('sub_' + submissionId);
    if (cachedLeadId) {
      Logger.log('Duplicate submission ID detected: ' + submissionId);
      return createJsonResponse({
        success: true,
        leadId: cachedLeadId,
        message: 'Your inquiry has already been registered.',
        duplicate: true
      });
    }
  }

  // 3. Open or Initialize the Google Sheet
  const sheet = getOrCreateLeadsSheet();
  const leadId = generateLeadId();
  const createdAt = getKolkataTimestamp();
  const nextFollowUpDate = calculateNextFollowUpDate(3); // First follow-up in 3 days

  let emailStatus = 'Pending';
  let whatsappStatus = (waConsent === 'YES') ? 'Pending' : 'No Consent';
  let lastError = 'None';

  // 4. Append row to Google Sheets
  const newRow = [
    leadId,
    createdAt,
    clientName,
    clientEmail,
    normalizedPhone,
    project,
    visitDate,
    transport,
    requests,
    waConsent,
    'New',                  // Lead Status
    emailStatus,            // Email Status
    whatsappStatus,         // WhatsApp Status
    '',                     // Last Follow-up Date
    (waConsent === 'YES') ? nextFollowUpDate : 'No Consent', // Next Follow-up Date
    0,                      // Follow-up Count
    'Active',               // Opt-out Status
    lastError               // Last Error
  ];

  sheet.appendRow(newRow);
  SpreadsheetApp.flush();
  const rowIndex = sheet.getLastRow();

  // Cache submission ID to prevent double insertion
  if (submissionId) {
    cache.put('sub_' + submissionId, leadId, 600); // 10 minutes
  }

  // 5. Send Admin Email Notification to arish@hantasai.com
  const leadData = {
    leadId: leadId,
    createdAt: createdAt,
    clientName: clientName,
    clientEmail: clientEmail,
    clientPhone: normalizedPhone,
    project: project,
    visitDate: visitDate,
    transport: transport,
    specialRequests: requests,
    waConsent: waConsent
  };

  try {
    sendAdminNotificationEmail(leadData);
    emailStatus = 'Sent (Admin)';
  } catch (emailErr) {
    emailStatus = 'Failed: ' + emailErr.message;
    lastError = 'Admin Email error: ' + emailErr.message;
    Logger.log('Admin email failed: ' + emailErr.toString());
  }

  // 6. Send Customer Confirmation Auto-reply (Safe failure handling)
  try {
    sendCustomerConfirmationEmail(leadData);
    if (emailStatus === 'Sent (Admin)') {
      emailStatus = 'Sent (Admin & Customer)';
    }
  } catch (custErr) {
    Logger.log('Customer email notice: ' + custErr.toString());
  }

  // 7. Send Immediate WhatsApp Acknowledgement if customer consented
  if (waConsent === 'YES') {
    try {
      const waResult = sendInitialWhatsAppAcknowledgement(leadData);
      whatsappStatus = waResult.status;
      if (!waResult.success && waResult.error) {
        lastError = (lastError === 'None') ? waResult.error : lastError + ' | ' + waResult.error;
      }
    } catch (waErr) {
      whatsappStatus = 'Failed: ' + waErr.message;
      lastError = (lastError === 'None') ? waErr.message : lastError + ' | ' + waErr.message;
      Logger.log('WhatsApp send error: ' + waErr.toString());
    }
  }

  // 8. Update Sheet with Email Status, WhatsApp Status, and Last Error
  try {
    sheet.getRange(rowIndex, 12).setValue(emailStatus);    // Col 12: Email Status
    sheet.getRange(rowIndex, 13).setValue(whatsappStatus); // Col 13: WhatsApp Status
    sheet.getRange(rowIndex, 18).setValue(lastError);      // Col 18: Last Error
  } catch (updateErr) {
    Logger.log('Status update error: ' + updateErr.toString());
  }

  return createJsonResponse({
    success: true,
    leadId: leadId,
    message: 'Site visit request registered successfully. Our team will contact you shortly.',
    emailStatus: emailStatus,
    whatsappStatus: whatsappStatus
  });
}

/**
 * ----------------------------------------------------------------------------
 * 4. EMAIL DISPATCH MODULE (Using Google Apps Script MailApp / GmailApp)
 * ----------------------------------------------------------------------------
 */
function sendAdminNotificationEmail(lead) {
  const subject = `New Real Estate Lead - ${lead.clientName} - ${lead.project}`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #080c14; color: #ffffff; padding: 24px; margin: 0;">
  <div style="max-width: 640px; margin: 0 auto; background-color: #0f172a; border-radius: 14px; border: 1px solid #d4af37; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1e293b, #090d16); padding: 26px 24px; text-align: center; border-bottom: 2px solid #d4af37;">
      <h2 style="color: #ffd700; margin: 0; font-size: 22px; letter-spacing: 1.5px; text-transform: uppercase;">HANTAS PROPERTIES</h2>
      <p style="color: #94a3b8; margin: 6px 0 0 0; font-size: 13px; letter-spacing: 2px;">NEW SITE VISIT INQUIRY</p>
      <div style="display: inline-block; margin-top: 10px; background: rgba(212,175,55,0.15); border: 1px solid #d4af37; padding: 4px 12px; border-radius: 20px; font-size: 12px; color: #ffd700; font-weight: bold;">
        Lead ID: ${lead.leadId}
      </div>
    </div>

    <!-- Body Content -->
    <div style="padding: 26px 24px;">
      <p style="color: #cbd5e1; font-size: 15px; margin-top: 0; line-height: 1.6;">
        A new site visit request has been submitted on the Hantas Properties website. All inquiry details have been saved to Google Sheets:
      </p>

      <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px;">
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
          <td style="padding: 10px 8px; color: #94a3b8; font-weight: 600; width: 38%;">Client Full Name:</td>
          <td style="padding: 10px 8px; color: #ffffff; font-weight: 700; font-size: 15px;">${lead.clientName}</td>
        </tr>
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
          <td style="padding: 10px 8px; color: #94a3b8; font-weight: 600;">Phone Number:</td>
          <td style="padding: 10px 8px; color: #10b981; font-weight: 700;">
            <a href="tel:${lead.clientPhone}" style="color: #10b981; text-decoration: none;">${lead.clientPhone}</a>
          </td>
        </tr>
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
          <td style="padding: 10px 8px; color: #94a3b8; font-weight: 600;">Email Address:</td>
          <td style="padding: 10px 8px; color: #ffd700;">
            <a href="mailto:${lead.clientEmail}" style="color: #ffd700; text-decoration: none;">${lead.clientEmail}</a>
          </td>
        </tr>
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
          <td style="padding: 10px 8px; color: #94a3b8; font-weight: 600;">Project of Interest:</td>
          <td style="padding: 10px 8px; color: #ffffff; font-weight: 700;">${lead.project}</td>
        </tr>
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
          <td style="padding: 10px 8px; color: #94a3b8; font-weight: 600;">Preferred Visit Date:</td>
          <td style="padding: 10px 8px; color: #ffffff;">${lead.visitDate}</td>
        </tr>
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
          <td style="padding: 10px 8px; color: #94a3b8; font-weight: 600;">Vehicle Pick-Up Service:</td>
          <td style="padding: 10px 8px; color: #38bdf8; font-weight: 600;">${lead.transport}</td>
        </tr>
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
          <td style="padding: 10px 8px; color: #94a3b8; font-weight: 600;">Special Requests / Loan:</td>
          <td style="padding: 10px 8px; color: #e2e8f0;">${lead.specialRequests}</td>
        </tr>
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
          <td style="padding: 10px 8px; color: #94a3b8; font-weight: 600;">WhatsApp Consent:</td>
          <td style="padding: 10px 8px; color: ${lead.waConsent === 'YES' ? '#10b981' : '#f87171'}; font-weight: 700;">
            ${lead.waConsent === 'YES' ? '✓ CONSENT GRANTED' : '✗ NOT GRANTED'}
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 8px; color: #94a3b8; font-weight: 600;">Submission Timestamp:</td>
          <td style="padding: 10px 8px; color: #94a3b8;">${lead.createdAt} (IST)</td>
        </tr>
      </table>

      <!-- Action Buttons -->
      <div style="margin-top: 26px; text-align: center;">
        <a href="tel:${lead.clientPhone}" style="background-color: #ffd700; color: #080b11; padding: 12px 22px; border-radius: 8px; text-decoration: none; font-weight: 700; display: inline-block; margin: 4px;">
          Call Client
        </a>
        <a href="https://wa.me/${lead.clientPhone.replace(/\D/g, '')}" style="background-color: #10b981; color: #ffffff; padding: 12px 22px; border-radius: 8px; text-decoration: none; font-weight: 700; display: inline-block; margin: 4px;">
          Open WhatsApp
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #0b0f19; padding: 16px 24px; text-align: center; border-top: 1px solid rgba(255,255,255,0.08); font-size: 12px; color: #64748b;">
      Hantas Properties Lead Management Engine • Sent to ${CONFIG.ADMIN_EMAIL}
    </div>
  </div>
</body>
</html>
  `;

  MailApp.sendEmail({
    to: CONFIG.ADMIN_EMAIL,
    subject: subject,
    htmlBody: htmlBody
  });
}

function sendCustomerConfirmationEmail(lead) {
  if (!lead.clientEmail || !validateEmail(lead.clientEmail)) return;

  const subject = `Site Visit Request Confirmed - ${lead.project} | Hantas Properties Trichy`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #080c14; color: #ffffff; padding: 24px; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #0f172a; border-radius: 14px; border: 1px solid #d4af37; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
    
    <div style="background: linear-gradient(135deg, #1e293b, #090d16); padding: 26px 24px; text-align: center; border-bottom: 2px solid #d4af37;">
      <h2 style="color: #ffd700; margin: 0; font-size: 22px; letter-spacing: 1.5px;">HANTAS PROPERTIES</h2>
      <p style="color: #94a3b8; margin: 6px 0 0 0; font-size: 12px; letter-spacing: 2px;">PREMIER REAL ESTATE TRICHY</p>
    </div>

    <div style="padding: 26px 24px;">
      <h3 style="color: #ffffff; margin-top: 0; font-size: 18px;">Vanakkam &amp; Greetings, ${lead.clientName}! 🙏</h3>
      <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
        Thank you for choosing Hantas Properties. We have successfully received your site visit booking request. Our dedicated Site Advisory Team is preparing your layout documents and will contact you shortly to coordinate your visit.
      </p>

      <div style="background-color: rgba(212, 175, 55, 0.08); border-left: 4px solid #d4af37; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <h4 style="color: #ffd700; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase;">Your Booking Summary:</h4>
        <p style="margin: 4px 0; color: #e2e8f0; font-size: 13px;"><strong>Project:</strong> ${lead.project}</p>
        <p style="margin: 4px 0; color: #e2e8f0; font-size: 13px;"><strong>Preferred Visit Date:</strong> ${lead.visitDate}</p>
        <p style="margin: 4px 0; color: #e2e8f0; font-size: 13px;"><strong>Pick-Up Service:</strong> ${lead.transport}</p>
        <p style="margin: 4px 0; color: #e2e8f0; font-size: 13px;"><strong>Reference ID:</strong> ${lead.leadId}</p>
      </div>

      <p style="color: #94a3b8; font-size: 13px; line-height: 1.6;">
        Our site representative will coordinate your complimentary vehicle pick-up from your selected location in Trichy. If you need immediate assistance or layout blueprints, feel free to contact our advisory team directly:
      </p>

      <div style="margin-top: 22px; text-align: center;">
        <a href="https://wa.me/919600269317" style="background-color: #10b981; color: #ffffff; padding: 11px 22px; border-radius: 8px; text-decoration: none; font-weight: 700; display: inline-block;">
          Chat with Advisory on WhatsApp
        </a>
      </div>

      <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 24px 0 16px 0;">

      <div style="font-size: 11px; color: #64748b; line-height: 1.6;">
        <p style="margin: 2px 0;"><strong>Hantas Properties</strong> — Your Future Begins with the Right Property</p>
        <p style="margin: 2px 0;">Hotline: +91 96002 69317 | Email: arish@hantasai.com</p>
        <p style="margin: 2px 0;">No.47A, Regiment Bazar, Renganathapuram, Thennur, Trichy, Tamil Nadu - 620017</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  MailApp.sendEmail({
    to: lead.clientEmail,
    subject: subject,
    htmlBody: htmlBody
  });
}

/**
 * ----------------------------------------------------------------------------
 * 5. META WHATSAPP CLOUD API INTEGRATION
 * Official WhatsApp Business Platform API.
 * ----------------------------------------------------------------------------
 */
function sendInitialWhatsAppAcknowledgement(lead) {
  const customerName = lead.clientName;
  const projectName = lead.project;
  const phoneNumber = lead.clientPhone;

  // Exact acknowledgement message required
  const messageText = `Hi ${customerName}, thank you for your interest in ${projectName}. We have received your site visit request. Our team will contact you to assist with your visit. Thank you for choosing Hantas Properties.`;

  const templateName = getSecret('WHATSAPP_TEMPLATE_WELCOME') || 'hantas_site_visit_acknowledgement';
  const templateParams = [customerName, projectName];

  return sendWhatsAppMessage(phoneNumber, messageText, templateName, templateParams);
}

/**
 * Universal Meta WhatsApp Cloud API dispatcher.
 * Supports official template messaging and graceful test mode / unconfigured fallback.
 */
function sendWhatsAppMessage(toPhoneNumber, messageText, templateName, templateParams) {
  const token = getSecret('WHATSAPP_ACCESS_TOKEN');
  const phoneId = getSecret('WHATSAPP_PHONE_NUMBER_ID');
  const isTestMode = (getSecret('WHATSAPP_TEST_MODE') || 'false').toLowerCase() === 'true';

  // 1. If credentials not yet configured, record clean status (Do not pretend message sent!)
  if (!token || !phoneId) {
    Logger.log('>>> [WHATSAPP NOTICE] WhatsApp Cloud API credentials not configured in Script Properties.');
    return {
      success: false,
      status: 'Config Required (API Token Missing)',
      error: 'WhatsApp Cloud API credentials not set in Script Properties.'
    };
  }

  // Clean phone number (digits only, e.g. 919600269317)
  const cleanPhone = toPhoneNumber.replace(/\D/g, '');

  // 2. Test Mode simulation
  if (isTestMode) {
    Logger.log(`>>> [WHATSAPP TEST MODE] Simulated send to ${cleanPhone}: "${messageText}"`);
    return {
      success: true,
      status: 'Test Mode Simulated',
      error: null
    };
  }

  // 3. Live Meta Cloud API Request
  const url = `https://graph.facebook.com/v21.0/${phoneId}/messages`;

  // Payload: If templateName is provided, use Meta Cloud API Template format (Standard for business initiation)
  let payload;
  if (templateName) {
    const parameters = (templateParams || []).map(p => ({ type: 'text', text: String(p) }));
    payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: cleanPhone,
      type: 'template',
      template: {
        name: templateName,
        language: { code: 'en' },
        components: [
          {
            type: 'body',
            parameters: parameters
          }
        ]
      }
    };
  } else {
    // Freeform text format (valid inside 24-hour customer window or test numbers)
    payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: cleanPhone,
      type: 'text',
      text: { body: messageText }
    };
  }

  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'Authorization': 'Bearer ' + token
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const code = response.getResponseCode();
    const respText = response.getContentText();
    const respJson = JSON.parse(respText);

    if (code >= 200 && code < 300) {
      Logger.log(`WhatsApp message sent to ${cleanPhone}. Message ID: ${respJson.messages ? respJson.messages[0].id : 'OK'}`);
      return {
        success: true,
        status: 'Sent (Meta API)',
        messageId: respJson.messages ? respJson.messages[0].id : 'OK'
      };
    } else {
      const errMsg = respJson.error ? respJson.error.message : respText;
      Logger.log(`WhatsApp API Error (${code}): ${errMsg}`);
      return {
        success: false,
        status: 'Failed (Meta Error: ' + code + ')',
        error: errMsg
      };
    }
  } catch (err) {
    Logger.log('UrlFetchApp exception: ' + err.toString());
    return {
      success: false,
      status: 'Failed (Network Error)',
      error: err.message
    };
  }
}

/**
 * ----------------------------------------------------------------------------
 * 6. AUTOMATED NURTURING ENGINE (Runs Daily via Time-Driven Trigger)
 * Follows up every 3 days, up to a maximum of 5 distinct messages.
 * ----------------------------------------------------------------------------
 */
function processDailyLeadNurturing() {
  const lock = LockService.getScriptLock();
  try {
    // Acquire lock to ensure only one instance executes
    if (!lock.tryLock(20000)) {
      Logger.log('processDailyLeadNurturing is already running in another thread.');
      return;
    }

    const sheet = getOrCreateLeadsSheet();
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      Logger.log('No leads found in sheet.');
      return;
    }

    const todayStr = getKolkataDateString(new Date());
    let processedCount = 0;

    Logger.log(`>>> [NURTURING RUN START] Date: ${todayStr}`);

    // Iterate through lead rows (skipping header row 0)
    for (let r = 1; r < data.length; r++) {
      const row = data[r];
      const leadId = row[0];
      const clientName = row[2];
      const phone = String(row[4]);
      const project = row[5] || 'General Plot Layout';
      const waConsent = String(row[9]).toUpperCase();
      const leadStatus = String(row[10]).trim();
      const lastFollowUpDate = String(row[13]).trim();
      const nextFollowUpDate = String(row[14]).trim();
      let followUpCount = parseInt(row[15], 10) || 0;
      const optOutStatus = String(row[16]).trim().toUpperCase();

      // Check Stop Conditions:
      // 1. WhatsApp Consent must be YES
      if (waConsent !== 'YES') continue;

      // 2. Opt-out status must be Active
      if (optOutStatus === 'OPTED OUT' || optOutStatus === 'YES') continue;

      // 3. Lead status must not be in stop statuses
      if (CONFIG.STOP_STATUSES.indexOf(leadStatus) !== -1) continue;

      // 4. Max follow-ups reached
      if (followUpCount >= CONFIG.MAX_FOLLOW_UPS) continue;

      // 5. Must not have already received a message today (Idempotency)
      if (lastFollowUpDate === todayStr) continue;

      // 6. Check if due date has arrived (nextFollowUpDate <= todayStr)
      if (!nextFollowUpDate || nextFollowUpDate.length < 10 || nextFollowUpDate > todayStr) {
        continue;
      }

      // Lead is DUE for nurturing!
      const currentStep = followUpCount + 1;
      const nurtureMsg = getNurturingMessage(currentStep, clientName, project);
      const templateName = getSecret(`WHATSAPP_TEMPLATE_NURTURE_${currentStep}`) || `hantas_followup_${currentStep}`;

      Logger.log(`>>> Sending Follow-up #${currentStep} to Lead ${leadId} (${clientName}) for project ${project}...`);

      const sendResult = sendWhatsAppMessage(
        phone,
        nurtureMsg,
        templateName,
        [clientName, project]
      );

      const sheetRowIndex = r + 1; // 1-indexed

      if (sendResult.success) {
        followUpCount = currentStep;
        const newNextDate = (followUpCount >= CONFIG.MAX_FOLLOW_UPS)
          ? 'Completed (Max 5 Reached)'
          : calculateNextFollowUpDate(CONFIG.FOLLOW_UP_INTERVAL_DAYS);

        sheet.getRange(sheetRowIndex, 13).setValue(`Follow-up #${currentStep} Sent`); // Col 13: WhatsApp Status
        sheet.getRange(sheetRowIndex, 14).setValue(todayStr);                         // Col 14: Last Follow-up Date
        sheet.getRange(sheetRowIndex, 15).setValue(newNextDate);                      // Col 15: Next Follow-up Date
        sheet.getRange(sheetRowIndex, 16).setValue(followUpCount);                    // Col 16: Follow-up Count
        sheet.getRange(sheetRowIndex, 18).setValue('None');                           // Col 18: Last Error
        processedCount++;
      } else {
        // Record failure without infinite retries
        sheet.getRange(sheetRowIndex, 13).setValue(`Follow-up #${currentStep} Failed`);
        sheet.getRange(sheetRowIndex, 18).setValue(`Follow-up #${currentStep} Error: ${sendResult.error}`);
        Logger.log(`Follow-up #${currentStep} failed for Lead ${leadId}: ${sendResult.error}`);
      }

      // Small pause between messages to stay within API rate limits
      Utilities.sleep(1000);
    }

    Logger.log(`>>> [NURTURING RUN FINISHED] Processed ${processedCount} due follow-up messages.`);

  } catch (err) {
    Logger.log('Critical error in processDailyLeadNurturing: ' + err.toString());
  } finally {
    try {
      lock.releaseLock();
    } catch (ignore) {}
  }
}

/**
 * ----------------------------------------------------------------------------
 * 7. FIVE DISTINCT NURTURING MESSAGE TEMPLATES
 * Grounded strictly in verified website project details for Hantas Properties.
 * ----------------------------------------------------------------------------
 */
function getNurturingMessage(step, name, project) {
  switch (step) {
    case 1:
      // Day 3 Follow-up: Site Visit Scheduling & Complimentary Pick-up
      return `Hi ${name}, this is the Site Advisory Team at Hantas Properties. Following up on your inquiry for ${project} in Trichy. Would you like to schedule your site visit this week? We offer complimentary vehicle pick-up from Trichy Railway Station, Bus Stand, or Airport at your convenience. Please reply with your preferred day or time!`;

    case 2:
      // Day 6 Follow-up: Master Layout Blueprint & DTCP Approval
      return `Hello ${name}, we hope you're having a great week! For ${project}, our master layout blueprints and DTCP approval documents are ready. North and East facing plots are currently available. Would you like us to share the master blueprint and plot dimension charts with you here on WhatsApp? Reply YES to receive them.`;

    case 3:
      // Day 9 Follow-up: Location Highlights, 33ft Roads & Township Amenities
      return `Hi ${name}, regarding ${project}, our township features 33ft wide blacktop avenues, dedicated park zones, sweet potable ground water, and 24/7 security with rapid connectivity to the Trichy-Madurai NH. Would you like our 2-minute project walkthrough video or brochure? Reply YES to view.`;

    case 4:
      // Day 12 Follow-up: Bank Loan Assistance (up to 80%) & Title Documentation
      return `Hello ${name}, many plot buyers at ${project} take advantage of our hassle-free bank loan assistance with leading nationalized banks (up to 80% loan approval with clear parent document verification). Would you like our advisory team to guide you through loan eligibility or title clearance certificates?`;

    case 5:
      // Day 15 Follow-up: Final Friendly Site Visit Check-in
      return `Hi ${name}, this is our final follow-up regarding your site visit request for ${project}. We want to ensure you find the right property for your family's future. Are you still planning a visit, or would you prefer us to pause updates for now? You can reply anytime or call us directly at ${CONFIG.HOTLINE}. Wishing you the best from Hantas Properties!`;

    default:
      return `Hi ${name}, thank you for your interest in ${project}. Our advisory team is at your service at ${CONFIG.HOTLINE}.`;
  }
}

/**
 * ----------------------------------------------------------------------------
 * 8. INCOMING WHATSAPP WEBHOOK HANDLER (OPT-OUT & STOP DETECTION)
 * ----------------------------------------------------------------------------
 */
function handleIncomingWhatsAppWebhook(payload) {
  try {
    const entry = payload.entry && payload.entry[0];
    const changes = entry && entry.changes && entry.changes[0];
    const value = changes && changes.value;
    const messages = value && value.messages;

    if (messages && messages.length > 0) {
      const msg = messages[0];
      const fromPhone = msg.from; // e.g. "919600269317"
      const body = (msg.text && msg.text.body) ? msg.text.body.trim().toUpperCase() : '';

      Logger.log(`Incoming WhatsApp message from ${fromPhone}: "${body}"`);

      // Check if user requested to stop / opt out
      if (body === 'STOP' || body === 'UNSUBSCRIBE' || body === 'CANCEL' || body === 'OPT OUT') {
        optOutCustomerByPhone(fromPhone);
      }
    }

    return ContentService.createTextOutput('EVENT_RECEIVED').setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    Logger.log('Webhook handling error: ' + err.toString());
    return ContentService.createTextOutput('ERROR').setMimeType(ContentService.MimeType.TEXT);
  }
}

function optOutCustomerByPhone(cleanPhone) {
  const sheet = getOrCreateLeadsSheet();
  const data = sheet.getDataRange().getValues();

  for (let r = 1; r < data.length; r++) {
    const rowPhone = String(data[r][4]).replace(/\D/g, '');
    if (rowPhone === cleanPhone || rowPhone.endsWith(cleanPhone) || cleanPhone.endsWith(rowPhone)) {
      const rowIndex = r + 1;
      sheet.getRange(rowIndex, 11).setValue('Do Not Contact'); // Col 11: Lead Status
      sheet.getRange(rowIndex, 15).setValue('Opted Out');       // Col 15: Next Follow-up Date
      sheet.getRange(rowIndex, 17).setValue('Opted Out');       // Col 17: Opt-out Status
      sheet.getRange(rowIndex, 18).setValue('Customer replied STOP on WhatsApp');
      Logger.log(`Successfully opted out Lead row ${rowIndex} (${cleanPhone}).`);
    }
  }
}

/**
 * ----------------------------------------------------------------------------
 * 9. GOOGLE SHEETS SETUP & DATA VALIDATION INITIALIZER
 * Run this function once from the Apps Script editor to format the sheet.
 * ----------------------------------------------------------------------------
 */
function initializeSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME, 0);
  }

  // Set Headers
  const headerRange = sheet.getRange(1, 1, 1, CONFIG.COLUMNS.length);
  headerRange.setValues([CONFIG.COLUMNS]);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#1a2234');
  headerRange.setFontColor('#ffd700');
  headerRange.setHorizontalAlignment('center');
  headerRange.setVerticalAlignment('middle');
  sheet.setRowHeight(1, 38);
  sheet.setFrozenRows(1);

  // Set Column Widths
  const widths = [130, 160, 180, 220, 150, 240, 140, 210, 240, 130, 170, 150, 170, 150, 160, 130, 130, 260];
  widths.forEach((w, i) => sheet.setColumnWidth(i + 1, w));

  // Add Data Validation: Lead Status (Col 11 / K)
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(CONFIG.LEAD_STATUSES, true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('K2:K5000').setDataValidation(statusRule);

  // Add Data Validation: WhatsApp Consent (Col 10 / J)
  const consentRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['YES', 'NO'], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('J2:J5000').setDataValidation(consentRule);

  // Add Data Validation: Opt-out Status (Col 17 / Q)
  const optOutRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Active', 'Opted Out'], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('Q2:Q5000').setDataValidation(optOutRule);

  // Add Data Validation: Vehicle Pick-up Service (Col 8 / H)
  const transportRule = SpreadsheetApp.newDataValidation()
    .requireValueInList([
      'Self Vehicle Arrival',
      'Trichy Bus Terminal Pick Up',
      'Trichy Railway Station Pick Up',
      'Trichy Airport Pick Up'
    ], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('H2:H5000').setDataValidation(transportRule);

  Logger.log('✓ Google Sheet "Leads" initialized with gold header styling & dropdown validations!');
}

/**
 * ----------------------------------------------------------------------------
 * 10. AUTOMATIC TRIGGER INSTALLER
 * Creates the daily 9:00 AM - 10:00 AM Asia/Kolkata time-driven trigger.
 * ----------------------------------------------------------------------------
 */
function setupDailyTrigger() {
  const functionName = 'processDailyLeadNurturing';
  const triggers = ScriptApp.getProjectTriggers();

  // Remove existing triggers for this function to prevent duplicate schedules
  for (let i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === functionName) {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }

  // Create new daily trigger between 9 AM and 10 AM
  ScriptApp.newTrigger(functionName)
    .timeBased()
    .everyDays(1)
    .atHour(9)
    .inTimezone(CONFIG.TIMEZONE)
    .create();

  Logger.log('✓ Successfully scheduled processDailyLeadNurturing to run daily at 9:00 AM IST!');
}

/**
 * ----------------------------------------------------------------------------
 * 11. TESTING & VERIFICATION FUNCTIONS
 * ----------------------------------------------------------------------------
 */
function testFormSubmission() {
  const testPayload = {
    client_name: 'Test Client (Arish)',
    client_email: 'arish@hantasai.com',
    client_phone: '+91 96002 69317',
    project_of_interest: 'Grand Empire Project',
    preferred_visit_date: '2026-10-25',
    vehicle_pickup_service: 'Trichy Railway Station Pick Up',
    special_requests: 'East facing plot test with bank loan assistance',
    whatsapp_consent: 'yes',
    submission_id: 'test_' + new Date().getTime()
  };

  const fakeEvent = {
    postData: {
      contents: JSON.stringify(testPayload)
    }
  };

  const response = doPost(fakeEvent);
  Logger.log('Test Submission Response: ' + response.getContent());
}

function testWhatsAppApi() {
  const testPhone = '+91 96002 69317';
  const testMsg = 'Namaste from Hantas Properties! This is a test message from your Google Apps Script lead engine.';
  const res = sendWhatsAppMessage(testPhone, testMsg, null, null);
  Logger.log('WhatsApp Test Result: ' + JSON.stringify(res));
}

/**
 * ----------------------------------------------------------------------------
 * 12. HELPER UTILITIES
 * ----------------------------------------------------------------------------
 */
function getOrCreateLeadsSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    initializeSheet();
    sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  }
  return sheet;
}

function generateLeadId() {
  const d = new Date();
  const datePart = Utilities.formatDate(d, CONFIG.TIMEZONE, 'yyyyMMdd');
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `HP-${datePart}-${randomPart}`;
}

function getKolkataTimestamp() {
  return Utilities.formatDate(new Date(), CONFIG.TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
}

function getKolkataDateString(dateObj) {
  return Utilities.formatDate(dateObj, CONFIG.TIMEZONE, 'yyyy-MM-dd');
}

function calculateNextFollowUpDate(daysToAdd) {
  const d = new Date();
  d.setDate(d.getDate() + daysToAdd);
  return getKolkataDateString(d);
}

function normalizeIndianPhone(phoneStr) {
  if (!phoneStr) return null;
  let digits = String(phoneStr).replace(/\D/g, '');

  if (digits.startsWith('91') && digits.length === 12) {
    digits = digits.substring(2);
  } else if (digits.startsWith('0') && digits.length === 11) {
    digits = digits.substring(1);
  }

  if (digits.length === 10 && /^[6-9]\d{9}$/.test(digits)) {
    return '+91' + digits;
  }
  return null;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>?/gm, '').trim();
}

function getSecret(key) {
  try {
    return PropertiesService.getScriptProperties().getProperty(key);
  } catch (e) {
    return null;
  }
}

function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
