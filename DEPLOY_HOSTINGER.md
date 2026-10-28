# 🚀 Hostinger Deployment Guide - HantasProperties

HantasProperties website-ஐ **Hostinger**-ல் deploy செய்வதற்குத் தேவையான production build உருவாக்கப்பட்டுள்ளது.

---

## 📦 Ready-to-Upload Build File

- **File Name:** `hantasproperties-deploy.zip`
- **Location:** `d:\HantasProperties\hantasproperties-deploy.zip`
- **File Size:** ~28 MB (முன்பு 78.5 MB ஆக இருந்தது, இப்போது 50.5 MB unused images நீக்கப்பட்டு ultra-lightweight-ஆக மாற்றப்பட்டுள்ளது)
- **Total Files:** 42 clean production files
- **Included Configurations:**
  - Automated HTTPS SSL Redirect
  - LiteSpeed / Gzip / Brotli Compression
  - High-performance Browser Caching
  - Sensitive files protection (`.json`, `.log`, `.env`)
  - Direct Google Apps Script CRM integration for inquiries

---

## 🛠️ How to Deploy on Hostinger (Step-by-Step)

### Method 1: Hostinger File Manager (Recommended & Fastest - 2 Mins)

1. **Hostinger hPanel-ல் Login செய்யுங்கள்:**
   - [https://hpanel.hostinger.com](https://hpanel.hostinger.com) செல்லவும்.

2. **Websites பகுதிக்குச் செல்லவும்:**
   - உங்கள் Domain / Website-க்கு நேராக உள்ள **Manage** பட்டனைக் கிளிக் செய்யவும்.

3. **File Manager திறக்கவும்:**
   - இடது பக்க மெனுவில் **Files** -> **File Manager** (அல்லது "Access files of your website") கிளிக் செய்யவும்.

4. **public_html போல்டரைத் திறக்கவும்:**
   - File Manager-ல் உள்ள **`public_html`** போல்டரை double-click செய்து திறக்கவும்.
   - *குறிப்பு:* அங்கு Hostinger-ன் பழைய `default.php` அல்லது placeholder பைல்கள் இருந்தால், அவற்றை Delete செய்துவிடலாம்.

5. **Zip பைலை Upload செய்யவும்:**
   - மேல் வலது மூலையில் உள்ள **Upload** ஐகானைக் கிளிக் செய்யவும் (`Upload Files / Folder`).
   - உங்கள் கம்ப்யூட்டரில் உள்ள:
     `d:\HantasProperties\hantasproperties-deploy.zip`
     பைலைத் தேர்ந்தெடுத்து Upload செய்யவும்.

6. **Extract செய்யவும்:**
   - Upload முடிந்ததும், File Manager-ல் `hantasproperties-deploy.zip` மீது **Right-Click** செய்து **Extract** கிளிக் செய்யவும்.
   - Destination Path-ல் `/public_html` உள்ளதா என உறுதிசெய்துவிட்டு **Extract** பட்டனை அழுத்தவும்.
   - அனைத்து பைல்களும் (`index.html`, `css/`, `js/`, `Images/`, `.htaccess`, etc.) நேரடியாக `public_html`-ல் வந்துவிடும்.

7. **Clean-up:**
   - Extract செய்த பிறகு `hantasproperties-deploy.zip` பைலை delete செய்துவிடலாம் (storage சேமிக்க).

8. **SSL Check (HTTPS):**
   - Hostinger hPanel-ல் **Security** -> **SSL** சென்று Lifetime Free SSL Active-ஆக உள்ளதா எனப் பார்க்கவும்.

9. **Live Website பரிசோதிக்கவும்:**
   - பிரவுசரில் உங்கள் domain-ஐ (`https://hantasproperties.com` அல்லது உங்கள் domain) திறந்து பார்க்கவும். Site Visit Booking Form-ஐ ஒரு முறை test செய்து பார்க்கவும்!

---

## 🔄 எதிர்காலத்தில் Code மாற்றினால் மீண்டும் Build செய்வது எப்படி?

எப்போதாவது HTML/CSS/JS அல்லது Images-ல் மாற்றம் செய்தால்:

### Option A: Batch File (1-Click)
- `d:\HantasProperties\build.bat` பைலை double-click செய்தால் போதும். தானாக build ஆகி புதிய `hantasproperties-deploy.zip` உருவாகிவிடும்!

### Option B: Terminal / Command Prompt
```bash
node build.js
# அல்லது
npm run build
```
Build முடிந்ததும், உருவான புதிய `hantasproperties-deploy.zip`-ஐ Hostinger-ல் மீண்டும் upload செய்து extract செய்து கொள்ளலாம்.

