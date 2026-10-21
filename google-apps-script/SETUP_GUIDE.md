# Hantas Properties — Lead Management & Automated WhatsApp Nurturing Setup Guide

This guide provides simple, step-by-step instructions to set up your complete lead management system using **Google Sheets**, **Google Apps Script**, and the **Meta WhatsApp Cloud API**.

---

## Architecture Overview

```mermaid
flowchart TD
    A[Visitor Submits Site Visit Form] --> B[Frontend Validation & Indian Phone Normalization]
    B --> C[POST to Google Apps Script Web App]
    C --> D[Lock & Idempotency Duplicate Check]
    D --> E[Save Lead in Google Sheets with Unique Lead ID]
    E --> F[Send Email Notification to arish@hantasai.com]
    E --> G[Send Confirmation Auto-Reply to Customer]
    E --> H{WhatsApp Consent Granted?}
    H -- Yes --> I[Meta WhatsApp Cloud API: Welcome Acknowledgement]
    H -- No --> J[Mark WhatsApp Status: No Consent]
    E --> K[Daily Time-Driven Trigger at 9:00 AM IST]
    K --> L{Due for Nurturing?}
    L -- Day 3, 6, 9, 12, 15 --> M[Send 1 of 5 Distinct WhatsApp Nurturing Templates]
    L -- Converted / Opted Out / Max 5 --> N[Stop Nurturing]
```

---

## Step 1: Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.new) and create a new blank spreadsheet.
2. Rename the spreadsheet at the top left to:  
   **`Hantas Properties - Leads Database`**
3. Rename the first tab at the bottom to:  
   **`Leads`**

---

## Step 2: Open Google Apps Script & Paste Updated Code

1. Open your Apps Script project at [script.google.com](https://script.google.com) (or via **Extensions > Apps Script** from your spreadsheet).
2. Select everything in the editor's `Code.gs` file and delete it.
3. Open [`google-apps-script/Code.gs`](file:///d:/HantasProperties/google-apps-script/Code.gs) in this workspace, copy the entire code, and paste it into the Apps Script editor.
4. Click the **Save** icon (`Ctrl + S`).

---

## Step 3: Configure Script Property SPREADSHEET_ID

1. In the Apps Script left sidebar, click **Project Settings** (gear icon ⚙️).
2. Scroll down to the **Script Properties** section.
3. Click **Edit script properties** -> click **Add script property**.
4. Add your spreadsheet ID:
   | Property | Value | Description |
   | :--- | :--- | :--- |
   | `SPREADSHEET_ID` | `YOUR_SPREADSHEET_ID` | Extracted from `https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit` |
5. Click **Save script properties**.

---

## Step 4: Run 1-Click Sheet Initialization & Verification

1. At the top of the Apps Script editor, locate the **Run** dropdown menu.
2. Select **`initializeSheet`** and click **Run**.
3. If Google requests authorization, click **Review permissions** -> select your Google account -> **Advanced** -> **Go to Hantas Lead Engine** -> **Allow**.
4. Check your Google Sheet:
   - The **Leads** tab will have the luxury navy & gold header row with all 18 columns.
   - Column widths and dropdown data validations are configured.
5. In Apps Script, select **`testFormSubmission`** and click **Run**.
   - Check the Apps Script execution log: it will verify that the lead row was appended and matched in the spreadsheet, and that the notification email was dispatched to `arish@hantasai.com`.

---

## Step 5: Deploy Updated Code as "New Version" (Preserving Web App URL)

> [!IMPORTANT]
> To update an existing Web App deployment without changing its URL, you must publish a **New version**:

1. In the Apps Script editor, click **Deploy** (top right) -> select **Manage deployments**.
2. Select your active Web App deployment (`AKfycbwgS4GIc2JIBb8djZGQBoII93dHMTutBJUY5MwGQ_-vwOl9INSADXaZ2ubYPVwMbaykaQ`).
3. Click the **pencil icon (Edit)** at the top right of the modal.
4. Under **Version**, click the dropdown and select **New version**.
5. Ensure:
   - **Execute as**: `Me (your email)`
   - **Who has access**: `Anyone`
6. Click **Deploy**.
7. The Web App URL remains:
   `https://script.google.com/macros/s/AKfycbwgS4GIc2JIBb8djZGQBoII93dHMTutBJUY5MwGQ_-vwOl9INSADXaZ2ubYPVwMbaykaQ/exec`

---

## Step 6: Connect Web App URL to Website

1. In your project workspace, open [`js/lead-config.js`](file:///d:/HantasProperties/js/lead-config.js).
2. Verify that `GOOGLE_APPS_SCRIPT_URL` matches your deployed URL:
   ```javascript
   window.HANTAS_LEAD_CONFIG = {
     GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwgS4GIc2JIBb8djZGQBoII93dHMTutBJUY5MwGQ_-vwOl9INSADXaZ2ubYPVwMbaykaQ/exec',
     ADMIN_EMAIL: 'arish@hantasai.com',
     ADVISORY_PHONE: '+91 96002 69317',
     DEFAULT_PROJECT: 'Grand Empire (395 Plots @ Manikandam)'
   };
   ```
3. Website forms (`#luxury-inquiry-form` and `#modal-vip-form`) now securely submit leads directly to your Google Sheet!

## Step 6: Activate Automated Daily 3-Day Nurturing Trigger

1. In the Apps Script editor, select **`setupDailyTrigger`** from the function dropdown.
2. Click **Run**.
3. In the execution log, you will see:  
   `✓ Successfully scheduled processDailyLeadNurturing to run daily at 9:00 AM IST!`
4. The system will now check every morning for leads due for their 3-day follow-up and nurture them automatically.

---

## Step 7: Meta WhatsApp Cloud API Setup

### A. Create a Meta Developer App (Free)
1. Go to [developers.facebook.com](https://developers.facebook.com) and log in.
2. Click **My Apps** -> **Create App**.
3. Select **Other** -> choose **Business** as the app type -> click **Next**.
4. Set App Name to: `Hantas Properties Lead Advisory`.
5. Under **Add products to your app**, locate **WhatsApp** and click **Set up**.
6. You will be taken to the **API Setup** page where Meta gives you:
   - **Temporary Access Token** (or Permanent System User Token)
   - **Phone Number ID** (e.g. `102938475612345`)
   - **WhatsApp Business Account ID**

### B. Store Secrets Securely in Google Apps Script
1. In your Apps Script editor, click **Project Settings** (gear icon on the left sidebar).
2. Scroll down to **Script Properties** -> click **Edit script properties** -> click **Add script property**.
3. Add the following keys:
   | Property Key | Value | Description |
   | :--- | :--- | :--- |
   | `WHATSAPP_ACCESS_TOKEN` | `EAAB...` | Your Meta Cloud API Access Token |
   | `WHATSAPP_PHONE_NUMBER_ID` | `102938475...` | Your WhatsApp Business Phone Number ID |
   | `WHATSAPP_VERIFY_TOKEN` | `hantas_webhook_secret_2026` | Webhook verification token |
   | `WHATSAPP_TEST_MODE` | `false` | Set to `true` to test without sending live messages |
4. Click **Save script properties**.

> [!NOTE]
> **Graceful Unconfigured Fallback**: If you do not yet have a Meta WhatsApp API token, Google Sheets saving and Email notifications will still work 100%. The system will mark the WhatsApp column as `Config Required (API Token Missing)` rather than failing or faking delivery.

---

## Step 8: Approved Meta WhatsApp Message Templates

Meta requires message templates for business-initiated conversations. Create these 6 templates in your **WhatsApp Manager -> Message Templates**:

### 1. Welcome Acknowledgement (`hantas_site_visit_acknowledgement`)
- **Category**: `UTILITY`
- **Language**: `English (en)`
- **Body**:  
  `Hi {{1}}, thank you for your interest in {{2}}. We have received your site visit request. Our team will contact you to assist with your visit. Thank you for choosing Hantas Properties.`

### 2. Follow-up 1 — Day 3 (`hantas_followup_1`)
- **Category**: `MARKETING`
- **Body**:  
  `Hi {{1}}, this is the Site Advisory Team at Hantas Properties. Following up on your inquiry for {{2}} in Trichy. Would you like to schedule your site visit this week? We offer complimentary vehicle pick-up from Trichy Railway Station, Bus Stand, or Airport at your convenience. Please reply with your preferred day or time!`

### 3. Follow-up 2 — Day 6 (`hantas_followup_2`)
- **Category**: `MARKETING`
- **Body**:  
  `Hello {{1}}, we hope you're having a great week! For {{2}}, our master layout blueprints and DTCP approval documents are ready. North and East facing plots are currently available. Would you like us to share the master blueprint and plot dimension charts with you here on WhatsApp? Reply YES to receive them.`

### 4. Follow-up 3 — Day 9 (`hantas_followup_3`)
- **Category**: `MARKETING`
- **Body**:  
  `Hi {{1}}, regarding {{2}}, our township features 33ft wide blacktop avenues, dedicated park zones, sweet potable ground water, and 24/7 security with rapid connectivity to the Trichy-Madurai NH. Would you like our 2-minute project walkthrough video or brochure? Reply YES to view.`

### 5. Follow-up 4 — Day 12 (`hantas_followup_4`)
- **Category**: `MARKETING`
- **Body**:  
  `Hello {{1}}, many plot buyers at {{2}} take advantage of our hassle-free bank loan assistance with leading nationalized banks (up to 80% loan approval with clear parent document verification). Would you like our advisory team to guide you through loan eligibility or title clearance certificates?`

### 6. Follow-up 5 — Day 15 (`hantas_followup_5`)
- **Category**: `MARKETING`
- **Body**:  
  `Hi {{1}}, this is our final follow-up regarding your site visit request for {{2}}. We want to ensure you find the right property for your family's future. Are you still planning a visit, or would you prefer us to pause updates for now? You can reply anytime or call us directly at +91 96002 69317. Wishing you the best from Hantas Properties!`

---

## Step 9: Testing Checklist

| Checkpoint | Action | Expected Result |
| :--- | :--- | :--- |
| **1. Self-Test in Apps Script** | Run `testFormSubmission()` in Apps Script | Row added to Google Sheet, Admin Email sent to `arish@hantasai.com`, returns `{ success: true, leadId: 'HP-...' }` |
| **2. Website Main Form** | Submit `#luxury-inquiry-form` on landing page | Button shows spinner, returns luxury toast with Lead ID, form clears |
| **3. VIP Modal Form** | Click "Book Free Site Visit" and submit `#modal-vip-form` | Modal closes smoothly after confirmation toast, form resets |
| **4. Phone Normalization** | Enter `9876543210` or `09876543210` | Google Sheet stores `+919876543210` |
| **5. WhatsApp Consent** | Leave checkbox unchecked vs checked | Stored as `NO` (no messages sent) or `YES` (eligible for nurturing) |
| **6. Duplicate Prevention** | Rapidly click submit twice | Button is locked; script cache prevents duplicate sheet rows |
| **7. Email Delivery** | Check inbox at `arish@hantasai.com` | Received branded HTML email with subject: `New Real Estate Lead - [Name] - [Project]` |
| **8. Customer Auto-reply** | Check submitted client email inbox | Received booking summary and advisory contact details |
| **9. Pause & Opt-out** | Change lead status to `Paused`, `Closed`, or `Opted Out` | Nurturing scheduler automatically skips this lead |
| **10. 3-Day Interval** | Inspect `Next Follow-up Date` column | Correctly set to current date + 3 days in `Asia/Kolkata` timezone |
