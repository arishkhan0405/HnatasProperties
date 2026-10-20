param(
    [int]$Port = 8080
)

$rootDir = $PSScriptRoot
if (-not $rootDir) {
    $rootDir = Get-Location
}

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".webp" = "image/webp"
    ".ico"  = "image/x-icon"
    ".mp4"  = "video/mp4"
    ".webm" = "video/webm"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
    ".ttf"  = "font/ttf"
}

function Get-AdminEmailHtml($record) {
    return @"
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; background-color: #0c1017; color: #ffffff; padding: 24px; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #121824; border-radius: 14px; border: 1px solid #d4af37; overflow: hidden;">
    <div style="background: linear-gradient(135deg, #1a2234, #0b0f19); padding: 24px; text-align: center; border-bottom: 2px solid #d4af37;">
      <h2 style="color: #ffd700; margin: 0; font-size: 22px; letter-spacing: 1px;">HANTAS PROPERTIES</h2>
      <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 13px;">NEW SITE VISIT INQUIRY RECEIVED</p>
    </div>
    <div style="padding: 24px;">
      <p style="color: #cbd5e1; font-size: 15px;">A new plot inquiry / site visit request has been submitted on the website:</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);"><td style="padding: 10px; color: #94a3b8; font-weight: bold; width: 35%;">Client Name:</td><td style="padding: 10px; color: #ffffff; font-weight: bold;">$($record.client_name)</td></tr>
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);"><td style="padding: 10px; color: #94a3b8; font-weight: bold;">Phone Number:</td><td style="padding: 10px; color: #10b981; font-weight: bold;"><a href="tel:$($record.client_phone)" style="color: #10b981; text-decoration: none;">$($record.client_phone)</a></td></tr>
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);"><td style="padding: 10px; color: #94a3b8; font-weight: bold;">Email Address:</td><td style="padding: 10px; color: #ffd700;"><a href="mailto:$($record.client_email)" style="color: #ffd700; text-decoration: none;">$($record.client_email)</a></td></tr>
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);"><td style="padding: 10px; color: #94a3b8; font-weight: bold;">Selected Project:</td><td style="padding: 10px; color: #ffffff; font-weight: bold;">$($record.project)</td></tr>
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);"><td style="padding: 10px; color: #94a3b8; font-weight: bold;">Preferred Date:</td><td style="padding: 10px; color: #ffffff;">$($record.preferred_visit_date)</td></tr>
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);"><td style="padding: 10px; color: #94a3b8; font-weight: bold;">Pick-Up Service:</td><td style="padding: 10px; color: #ffffff;">$($record.vehicle_pickup_service)</td></tr>
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);"><td style="padding: 10px; color: #94a3b8; font-weight: bold;">City / Location:</td><td style="padding: 10px; color: #ffffff;">$($record.client_city)</td></tr>
        <tr><td style="padding: 10px; color: #94a3b8; font-weight: bold;">Special Requests:</td><td style="padding: 10px; color: #ffffff;">$($record.special_requests)</td></tr>
      </table>
      <div style="margin-top: 24px; text-align: center;">
        <a href="tel:$($record.client_phone)" style="background-color: #ffd700; color: #080b11; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; margin-right: 10px;">Call Client</a>
        <a href="https://wa.me/91$($record.client_phone -replace '\D','')" style="background-color: #10b981; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">WhatsApp Client</a>
      </div>
    </div>
  </div>
</body>
</html>
"@
}

function Get-CustomerEmailHtml($record) {
    return @"
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; background-color: #0c1017; color: #ffffff; padding: 24px; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #121824; border-radius: 14px; border: 1px solid #d4af37; overflow: hidden;">
    <div style="background: linear-gradient(135deg, #1a2234, #0b0f19); padding: 28px 24px; text-align: center; border-bottom: 2px solid #d4af37;">
      <h2 style="color: #ffd700; margin: 0; font-size: 24px; letter-spacing: 1px;">HANTAS PROPERTIES</h2>
      <p style="color: #94a3b8; margin: 6px 0 0 0; font-size: 13px; letter-spacing: 2px;">PREMIER REAL ESTATE TRICHY</p>
    </div>
    <div style="padding: 30px 24px;">
      <h3 style="color: #ffffff; margin-top: 0; font-size: 18px;">Vanakkam &amp; Greetings, $($record.client_name)! 🙏</h3>
      <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">
        Thank you for choosing Hantas Properties. We have successfully received your site visit booking request. Our dedicated Site Advisory Team is preparing your layout documents and will contact you shortly to coordinate your visit.
      </p>

      <div style="background-color: rgba(212, 175, 55, 0.08); border-left: 4px solid #d4af37; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <h4 style="color: #ffd700; margin: 0 0 10px 0; font-size: 15px;">Your Booking Summary:</h4>
        <p style="margin: 4px 0; color: #e2e8f0; font-size: 14px;"><strong>Project:</strong> $($record.project)</p>
        <p style="margin: 4px 0; color: #e2e8f0; font-size: 14px;"><strong>Preferred Visit Date:</strong> $($record.preferred_visit_date)</p>
        <p style="margin: 4px 0; color: #e2e8f0; font-size: 14px;"><strong>Complimentary Pick-Up:</strong> $($record.vehicle_pickup_service)</p>
        <p style="margin: 4px 0; color: #e2e8f0; font-size: 14px;"><strong>Contact Phone:</strong> $($record.client_phone)</p>
      </div>

      <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">
        Our site representative will arrange a comfortable vehicle pick-up from your selected location in Trichy. If you have any urgent questions or require layout blueprints immediately, feel free to call us or chat with us on WhatsApp.
      </p>

      <div style="margin-top: 24px; text-align: center;">
        <a href="https://wa.me/919600269317" style="background-color: #10b981; color: #ffffff; padding: 12px 26px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Chat with Advisory on WhatsApp</a>
      </div>

      <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 30px 0 20px 0;">

      <div style="font-size: 12px; color: #64748b; line-height: 1.6;">
        <p style="margin: 2px 0;"><strong>Hantas Properties</strong> — Your Future Begins with the Right Property</p>
        <p style="margin: 2px 0;">Hotline: +91 96002 69317 | Email: arish@hantasai.com</p>
        <p style="margin: 2px 0;">Address: No.47A, Regiment Bazar, Renganathapuram, Thennur, Trichy, Tamil Nadu - 620017</p>
      </div>
    </div>
  </div>
</body>
</html>
"@
}

function Send-InquiryEmails($record, $smtpConfig) {
    if (-not $smtpConfig -or -not $smtpConfig.enabled) {
        Write-Host ">>> [SMTP NOTICE] SMTP is not enabled in smtp.config.json." -ForegroundColor Yellow
        return $false
    }

    try {
        $smtp = New-Object System.Net.Mail.SmtpClient($smtpConfig.host, [int]$smtpConfig.port)
        $smtp.EnableSsl = $true
        $smtp.Timeout = 15000
        $smtp.Credentials = New-Object System.Net.NetworkCredential($smtpConfig.user, $smtpConfig.pass)

        $fromAddr = New-Object System.Net.Mail.MailAddress($smtpConfig.user, $smtpConfig.fromName)
        $adminRecipient = if ($smtpConfig.adminEmail) { $smtpConfig.adminEmail } else { "arish@hantasai.com" }

        # 1. Admin Email (Notification to arish@hantasai.com)
        $adminMail = New-Object System.Net.Mail.MailMessage
        $adminMail.From = $fromAddr
        $adminMail.To.Add($adminRecipient)
        $adminMail.Subject = "New Site Visit Inquiry: $($record.project) from $($record.client_name)"
        $adminMail.IsBodyHtml = $true
        $adminMail.Body = Get-AdminEmailHtml $record
        $smtp.Send($adminMail)
        Write-Host ">>> [EMAIL SENT] Admin notification sent to $adminRecipient" -ForegroundColor Green

        # 2. Customer Email (Confirmation / Auto-reply to customer)
        if ($record.client_email -and $record.client_email -match "@") {
            try {
                $custMail = New-Object System.Net.Mail.MailMessage
                $custMail.From = $fromAddr
                $custMail.To.Add($record.client_email)
                $custMail.Subject = "Site Visit Inquiry Received - Hantas Properties Trichy"
                $custMail.IsBodyHtml = $true
                $custMail.Body = Get-CustomerEmailHtml $record
                $smtp.Send($custMail)
                Write-Host ">>> [EMAIL SENT] Confirmation auto-reply sent to customer ($($record.client_email))" -ForegroundColor Green
            } catch {
                Write-Host ">>> [SMTP WARNING] Could not send customer auto-reply: $($_.Exception.Message)" -ForegroundColor Yellow
            }
        }

        return $true
    } catch {
        Write-Host ">>> [SMTP ERROR] Failed to send email: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host "  HantasProperties Local Web Server Running!" -ForegroundColor Green
    Write-Host "  URL: $prefix" -ForegroundColor Yellow
    Write-Host "  Folder: $rootDir" -ForegroundColor Gray
    Write-Host "  Press Ctrl+C to stop the server" -ForegroundColor Gray
    Write-Host "==========================================================" -ForegroundColor Cyan

    # Open default browser
    try {
        Start-Process $prefix -ErrorAction SilentlyContinue
    } catch {}

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $response.AddHeader("Access-Control-Allow-Origin", "*")
        $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        $response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Accept")

        if ($request.HttpMethod -eq "OPTIONS") {
            $response.StatusCode = 204
            $response.OutputStream.Close()
            continue
        }

        $urlPath = [System.Uri]::UnescapeDataString($request.Url.LocalPath.TrimStart('/'))
        if ([string]::IsNullOrWhiteSpace($urlPath)) {
            $urlPath = "index.html"
        }

        # API: Record Site Visit & Plot Inquiry and Send 2-Way Emails
        if ($urlPath -eq "api/inquiry" -and $request.HttpMethod -eq "POST") {
            try {
                $reader = New-Object System.IO.StreamReader($request.InputStream, $request.ContentEncoding)
                $jsonBody = $reader.ReadToEnd()
                $inquiryData = $jsonBody | ConvertFrom-Json

                # Append to inquiries.json
                $inquiriesJsonFile = Join-Path $rootDir "inquiries.json"
                $allInquiries = @()
                if (Test-Path $inquiriesJsonFile) {
                    try {
                        $existingJson = Get-Content $inquiriesJsonFile -Raw
                        if ($existingJson) {
                            $allInquiries = @($existingJson | ConvertFrom-Json)
                        }
                    } catch {}
                }
                
                $record = [PSCustomObject]@{
                    timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
                    lead_id = "HP-" + (Get-Date).ToString("yyyyMMdd") + "-" + (Get-Random -Minimum 1000 -Maximum 9999)
                    submission_id = $inquiryData.submission_id
                    client_name = $inquiryData.client_name
                    client_phone = $inquiryData.client_phone
                    client_email = $inquiryData.client_email
                    project = if ($inquiryData.project_of_interest) { $inquiryData.project_of_interest } else { $inquiryData.selected_project }
                    preferred_visit_date = $inquiryData.preferred_visit_date
                    vehicle_pickup_service = $inquiryData.vehicle_pickup_service
                    special_requests = $inquiryData.special_requests
                    whatsapp_consent = if ($inquiryData.whatsapp_consent) { $inquiryData.whatsapp_consent } else { "NO" }
                    client_city = $inquiryData.client_city
                    recipient_email = "arish@hantasai.com"
                }

                $allInquiries += $record
                $allInquiries | ConvertTo-Json -Depth 5 | Set-Content $inquiriesJsonFile -Encoding UTF8

                # Append to human-readable inquiries.log
                $logFile = Join-Path $rootDir "inquiries.log"
                $logEntry = "[$($record.timestamp)] NEW INQUIRY for arish@hantasai.com`n  Name: $($record.client_name)`n  Phone: $($record.client_phone)`n  Email: $($record.client_email)`n  Project: $($record.project)`n  Date: $($record.preferred_visit_date)`n  Pick-up: $($record.vehicle_pickup_service)`n  Notes: $($record.special_requests)`n--------------------------------------------------"
                Add-Content -Path $logFile -Value $logEntry -Encoding UTF8

                Write-Host ""
                Write-Host ">>> [NEW INQUIRY SAVED] from $($record.client_name) ($($record.client_phone)) for $($record.project)" -ForegroundColor Green

                # Check SMTP Config and Send 2-Way Emails
                $smtpConfigFile = Join-Path $rootDir "smtp.config.json"
                $emailSent = $false
                $smtpStatusMsg = "Saved to local inquiry log"

                if (Test-Path $smtpConfigFile) {
                    try {
                        $smtpConfig = Get-Content $smtpConfigFile -Raw | ConvertFrom-Json
                        if ($smtpConfig.enabled -and $smtpConfig.user -ne "your-email@gmail.com") {
                            Write-Host ">>> [SMTP] Sending 2-way automated emails..." -ForegroundColor Cyan
                            $emailSent = Send-InquiryEmails $record $smtpConfig
                            if ($emailSent) {
                                $smtpStatusMsg = "Emails sent to arish@hantasai.com and customer ($($record.client_email))"
                            }
                        } else {
                            Write-Host ">>> [SMTP NOTICE] SMTP disabled or default credentials in smtp.config.json. Fill in credentials to send live emails." -ForegroundColor Yellow
                            $smtpStatusMsg = "Inquiry logged. Set credentials in smtp.config.json to dispatch live emails."
                        }
                    } catch {
                        Write-Host ">>> [SMTP CONFIG ERROR] $($_.Exception.Message)" -ForegroundColor Red
                    }
                }

                $respObj = @{
                    success = $true
                    emailSent = $emailSent
                    message = $smtpStatusMsg
                    timestamp = $record.timestamp
                } | ConvertTo-Json

                $respBytes = [System.Text.Encoding]::UTF8.GetBytes($respObj)
                $response.ContentType = "application/json; charset=utf-8"
                $response.StatusCode = 200
                $response.ContentLength64 = $respBytes.Length
                $response.OutputStream.Write($respBytes, 0, $respBytes.Length)
            } catch {
                $errObj = @{ success = $false; error = $_.Exception.Message } | ConvertTo-Json
                $errBytes = [System.Text.Encoding]::UTF8.GetBytes($errObj)
                $response.ContentType = "application/json; charset=utf-8"
                $response.StatusCode = 500
                $response.ContentLength64 = $errBytes.Length
                $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
            }
            $response.OutputStream.Close()
            continue
        }

        # Normalize directory separators
        $relPath = $urlPath -replace '/', [System.IO.Path]::DirectorySeparatorChar
        $filePath = Join-Path $rootDir $relPath

        if (Test-Path -Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLowerInvariant()
            $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $response.ContentType = $contentType
            $response.AddHeader("Access-Control-Allow-Origin", "*")

            if ($request.QueryString["download"] -eq "1") {
                $downloadName = [System.IO.Path]::GetFileName($filePath)
                $response.AddHeader("Content-Disposition", "attachment; filename=`"$downloadName`"")
            }

            try {
                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
                $response.StatusCode = 200
            } catch {
                $response.StatusCode = 500
            }
        } else {
            $response.StatusCode = 404
            $notFoundBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $urlPath")
            $response.ContentLength64 = $notFoundBytes.Length
            $response.OutputStream.Write($notFoundBytes, 0, $notFoundBytes.Length)
        }

        $response.OutputStream.Close()
    }
} catch {
    Write-Host "Server stopped: $_" -ForegroundColor Red
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
    $listener.Close()
}
