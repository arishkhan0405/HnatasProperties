/**
 * ============================================================================
 * HANTAS PROPERTIES - PRODUCTION BUILD SCRIPT FOR HOSTINGER DEPLOYMENT
 * ============================================================================
 * Generates an ultra-compatible, POSIX-standard ZIP archive for Hostinger hPanel
 * File Manager (`public_html/`) using `archiver`.
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const { ZipArchive } = require('archiver');

const ROOT_DIR = __dirname;
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const ZIP_NAME = 'hantasproperties-deploy.zip';
const ZIP_PATH = path.join(ROOT_DIR, ZIP_NAME);

console.log('🏛️  Starting HantasProperties Production Build for Hostinger...\n');

// 1. Clean existing dist directory and previous zip
if (fs.existsSync(DIST_DIR)) {
  console.log('🧹 Cleaning existing dist/ directory...');
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
}
if (fs.existsSync(ZIP_PATH)) {
  fs.unlinkSync(ZIP_PATH);
}
fs.mkdirSync(DIST_DIR, { recursive: true });

// 2. Directories & Files to include in the production build
const DIRS_TO_COPY = ['css', 'js', 'Images'];
const FILES_TO_COPY = ['index.html', 'robots.txt', 'sitemap.xml', 'favicon.ico'];

// Helper: Recursive copy directory
function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 3. Copy Production Files
console.log('📦 Copying production files to dist/...');
for (const file of FILES_TO_COPY) {
  const src = path.join(ROOT_DIR, file);
  const dest = path.join(DIST_DIR, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`  ✓ ${file}`);
  } else {
    console.warn(`  ⚠️ Warning: File not found: ${file}`);
  }
}

// 4. Copy Production Directories
for (const dir of DIRS_TO_COPY) {
  const src = path.join(ROOT_DIR, dir);
  const dest = path.join(DIST_DIR, dir);
  if (fs.existsSync(src)) {
    console.log(`  📂 Copying ${dir}/ ...`);
    copyDirSync(src, dest);
  } else {
    console.warn(`  ⚠️ Warning: Directory not found: ${dir}`);
  }
}

// 5. Generate Hostinger Production .htaccess
console.log('⚙️  Generating Hostinger-optimized .htaccess file...');
const htaccessContent = `# ==============================================================================
# HANTAS PROPERTIES - HOSTINGER / LITESPEED / APACHE CONFIGURATION
# ==============================================================================

# 1. Force HTTPS (SSL)
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>

# 2. Disable Directory Indexing
Options -Indexes

# 3. Protect Hidden and Sensitive Files
<FilesMatch "^\\.(.*)$">
  Order allow,deny
  Deny from all
</FilesMatch>

<FilesMatch "(inquiries\\.json|inquiries\\.log|smtp\\.config\\.json|\\.env|composer\\.json|package\\.json|package-lock\\.json)$">
  Order allow,deny
  Deny from all
</FilesMatch>

# 4. Enable Gzip / Deflate Compression (High Speed Performance)
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/plain
  AddOutputFilterByType DEFLATE text/xml
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE text/javascript
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/x-javascript
  AddOutputFilterByType DEFLATE application/json
  AddOutputFilterByType DEFLATE application/xml
  AddOutputFilterByType DEFLATE image/svg+xml
</IfModule>

# 5. Leverage Browser Caching (Cache-Control & Expires)
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresDefault "access plus 1 month"

  # HTML
  ExpiresByType text/html "access plus 1 hour"

  # CSS & JavaScript
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType text/javascript "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType application/x-javascript "access plus 1 year"

  # Images & Media
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/x-icon "access plus 1 year"
  ExpiresByType video/mp4 "access plus 1 year"
  ExpiresByType video/webm "access plus 1 year"

  # Fonts
  ExpiresByType font/woff "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType font/ttf "access plus 1 year"
</IfModule>

# 6. Security Headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# 7. Fallback Routing (Single Page Application Friendly)
ErrorDocument 404 /index.html

# 8. Character Encoding
AddDefaultCharset UTF-8
`;

fs.writeFileSync(path.join(DIST_DIR, '.htaccess'), htaccessContent, 'utf8');
console.log('  ✓ .htaccess created');

// 6. Calculate Dist Statistics
function getDirectoryStats(dirPath) {
  let count = 0;
  let totalBytes = 0;

  function scan(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(currentPath, entry.name);
      if (entry.isDirectory()) {
        scan(full);
      } else {
        count++;
        totalBytes += fs.statSync(full).size;
      }
    }
  }

  scan(dirPath);
  return { count, totalMB: (totalBytes / (1024 * 1024)).toFixed(2) };
}

const stats = getDirectoryStats(DIST_DIR);
console.log(`\n📊 Production Build Summary:`);
console.log(`   - Total Files in dist/: ${stats.count}`);
console.log(`   - Total Uncompressed Size: ${stats.totalMB} MB`);

// 7. Create 100% Linux-Compatible ZIP Archive using archiver
console.log(`\n🗜️  Creating deployment ZIP archive: ${ZIP_NAME} with archiver (POSIX forward-slashes)...`);

const output = fs.createWriteStream(ZIP_PATH);
const archive = new ZipArchive({
  zlib: { level: 9 }
});

output.on('close', function() {
  const actualSizeBytes = fs.statSync(ZIP_PATH).size;
  const zipSizeMB = (actualSizeBytes / (1024 * 1024)).toFixed(2);
  console.log(`\n🎉 BUILD SUCCESSFUL!`);
  console.log(`📁 Source Directory: ${DIST_DIR}`);
  console.log(`📦 Deployment Package: ${ZIP_PATH} (${zipSizeMB} MB)`);
  console.log(`\n------------------------------------------------------------`);
  console.log(`🚀 HOSTINGER DEPLOYMENT INSTRUCTIONS:`);
  console.log(`1. Login to Hostinger hPanel (https://hpanel.hostinger.com)`);
  console.log(`2. Go to Websites -> Manage -> File Manager`);
  console.log(`3. ⚠️ IMPORTANT: Double-click to OPEN the "public_html" directory!`);
  console.log(`   (DO NOT upload in the root folder next to DO_NOT_UPLOAD_HERE)`);
  console.log(`4. Inside public_html, click the "Upload" button -> Select "${ZIP_NAME}"`);
  console.log(`5. Wait for the upload to complete 100% (file size should be ~${zipSizeMB} MB, NOT 22 B!)`);
  console.log(`6. Right-click on "${ZIP_NAME}" in File Manager -> Click "Extract"`);
  console.log(`7. Choose extract location as current folder and extract.`);
  console.log(`8. Delete the .zip file and your website is LIVE!`);
  console.log(`------------------------------------------------------------\n`);
});

archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);

// Append all files from dist directory with clean POSIX forward-slashes
archive.directory(DIST_DIR, false);

archive.finalize();
