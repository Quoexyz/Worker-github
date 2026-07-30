/**
 * GitHub Accelerator - Cloudflare Worker
 * ✅ Fixed releases/download 404
 * ✅ Raw / Archive caching
 * ✅ Release downloads fully passthrough
 * ✅ Password authentication
 * ✅ Fixed password eye icon position
 */

const UPSTREAM_HOST = 'https://github.com';
const RAW_HOST = 'https://raw.githubusercontent.com';

// Password configuration - change this to your desired password
const PASSWORD = 'your-password-here'; // Please change to your password

// Cache configuration (only for raw / archive)
const CACHE_CONFIG = {
  browserTTL: 60 * 60 * 24 * 1, // 1 day
  edgeTTL: 60 * 60 * 24 * 7,    // 7 days
};

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event));
});

/* ================= HTML Pages ================= */

// Password verification page (eye icon style fixed)
function getPasswordHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Access Verification - GitHub Accelerator</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{min-height:100vh;display:flex;align-items:center;justify-content:center;
background:url(https://t.alcy.cc/ycy) center/cover no-repeat fixed;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;
padding:20px}
.container{background:rgba(255,255,255,0.15);border-radius:12px;
box-shadow:0 8px 24px rgba(0,0,0,0.15);width:100%;max-width:400px;padding:36px;
backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.2)}
.header{text-align:center;margin-bottom:28px}
.logo{width:72px;height:72px;background:#24292e;
border-radius:8px;margin:0 auto 16px;display:flex;align-items:center;justify-content:center}
.logo i{font-size:36px;color:#fff}
.title{font-size:24px;font-weight:600;color:#24292e;margin-bottom:6px}
.subtitle{font-size:14px;color:#586069}

.password-group {
  position: relative;
  margin-bottom: 16px;
}
.password-group > i {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #959da5;
  font-size: 16px;
  z-index: 2;
}
.password-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  background: #fafbfc;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  transition: border-color 0.15s ease-in-out, background 0.15s ease-in-out;
}
.password-wrapper:focus-within {
  border-color: #0366d6;
  background: #fff;
}
.password-wrapper input {
  flex: 1;
  padding: 14px 10px 14px 44px;
  border: none;
  outline: none;
  font-size: 15px;
  background: transparent;
  color: #24292e;
  min-width: 0;
}
.password-wrapper input::placeholder {
  color: #959da5;
}
.toggle-pwd {
  flex-shrink: 0;
  padding: 0 14px;
  background: none;
  border: none;
  color: #959da5;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  height: 100%;
}
.toggle-pwd:hover {
  color: #586069;
}

.btn{width:100%;padding:14px;border:none;border-radius:6px;
font-size:16px;font-weight:500;cursor:pointer;
display:flex;align-items:center;justify-content:center;gap:8px;
background:#0366d6;color:#fff}
.btn:hover{background:#0256c3}
.error{color:#d73a49;font-size:14px;margin-top:12px;display:none}
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <div class="logo">
      <i class="fas fa-lock"></i>
    </div>
    <h1 class="title">Hold on...</h1>
    <p class="subtitle">Passphrase required for access!</p>
  </div>

  <div class="password-group">
    <i class="fas fa-key"></i>
    <div class="password-wrapper">
      <input type="password" id="passwordInput" placeholder="Enter passphrase..." />
      <button class="toggle-pwd" onclick="togglePassword()">
        <i class="fas fa-eye" id="eyeIcon"></i>
      </button>
    </div>
  </div>

  <button class="btn" onclick="verifyPassword()">
    <i class="fas fa-arrow-right"></i> Verify Access
  </button>

  <div class="error" id="errorMsg">
    <i class="fas fa-exclamation-circle"></i> Incorrect password, please try again
  </div>
</div>

<script>
function togglePassword() {
  const input = document.getElementById('passwordInput');
  const icon = document.getElementById('eyeIcon');
  if (input.type === 'password') {
    input.type = 'text';
    icon.className = 'fas fa-eye-slash';
  } else {
    input.type = 'password';
    icon.className = 'fas fa-eye';
  }
}

function verifyPassword() {
  const password = document.getElementById('passwordInput').value;
  const errorMsg = document.getElementById('errorMsg');
  
  if (!password) {
    errorMsg.style.display = 'block';
    errorMsg.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please enter the password';
    return;
  }
  
  fetch('/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      document.cookie = 'auth_token=verified; path=/; max-age=86400';
      window.location.reload();
    } else {
      errorMsg.style.display = 'block';
      errorMsg.innerHTML = '<i class="fas fa-exclamation-circle"></i> Incorrect password, please try again';
      document.getElementById('passwordInput').value = '';
      document.getElementById('passwordInput').focus();
    }
  })
  .catch(() => {
    errorMsg.style.display = 'block';
    errorMsg.innerHTML = '<i class="fas fa-exclamation-circle"></i> Verification failed, please retry';
  });
}

document.getElementById('passwordInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    verifyPassword();
  }
});
</script>
<script src="https://baf.quoex.moe/mouse-spark-trail.js"></script>
</body>
</html>`;
}

// Main functional page
function getMainHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>GitHub Accelerated Download</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{min-height:100vh;display:flex;align-items:center;justify-content:center;
background:url(https://t.alcy.cc/ycy) center/cover no-repeat fixed;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;
padding:20px}
.container{background:rgba(255,255,255,0.15);border-radius:12px;
box-shadow:0 8px 24px rgba(0,0,0,0.15);width:100%;max-width:560px;padding:36px;
backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.2)}
.header{text-align:center;margin-bottom:28px}
.logo{width:72px;height:72px;background:#24292e;
border-radius:8px;margin:0 auto 16px;display:flex;align-items:center;justify-content:center}
.logo i{font-size:36px;color:#fff}
.title{font-size:26px;font-weight:600;color:#24292e;margin-bottom:6px}
.subtitle{font-size:14px;color:#586069}
.input-group{position:relative;margin-bottom:16px}
.input-group i{position:absolute;left:14px;top:50%;transform:translateY(-50%);
color:#959da5;font-size:16px}
.input-group input{width:100%;padding:14px 14px 14px 44px;border:1px solid #e1e4e8;
border-radius:6px;font-size:15px;outline:none;background:#fafbfc;color:#24292e}
.input-group input:focus{border-color:#0366d6;background:#fff}
.button-group{display:flex;gap:10px;margin-bottom:20px}
.btn{flex:1;padding:12px 18px;border:none;border-radius:6px;
font-size:15px;font-weight:500;cursor:pointer;
display:flex;align-items:center;justify-content:center;gap:8px}
.btn-primary{background:#0366d6;color:#fff}
.btn-primary:hover{background:#0256c3}
.btn-secondary{background:#fff;color:#24292e;border:1px solid #e1e4e8}
.btn-secondary:hover{background:#f3f4f6}
.btn-logout{background:#dc3545;color:#fff}
.btn-logout:hover{background:#c82333}
.features{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:20px}
.feature-item{text-align:center;padding:12px;background:#f6f8fa;border-radius:6px}
.feature-item i{font-size:20px;color:#0366d6;margin-bottom:6px}
.feature-item span{font-size:13px;color:#586069}
.loading{display:none;position:fixed;top:0;left:0;right:0;bottom:0;
background:rgba(0,0,0,0.6);z-index:999;align-items:center;justify-content:center}
.loading-spinner{width:40px;height:40px;border:3px solid #fff;
border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
@media(max-width:480px){
  .container{padding:20px}
  .title{font-size:22px}
  .features{grid-template-columns:1fr}
}
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <div class="logo">
      <i class="fab fa-github"></i>
    </div>
    <h1 class="title">GitHub Accelerated Download</h1>
    <p class="subtitle">Fast, stable, and reliable GitHub resource acceleration service</p>
  </div>

  <div class="input-group">
    <i class="fas fa-link"></i>
    <input type="text" id="url" placeholder="Enter GitHub resource link..." />
  </div>

  <div class="button-group">
    <button class="btn btn-primary" onclick="go()">
      <i class="fas fa-bolt"></i> Accelerate Now
    </button>
    <button class="btn btn-secondary" onclick="pasteUrl()">
      <i class="fas fa-paste"></i> Paste Link
    </button>
  </div>

  <div style="margin-top: 12px;">
    <button class="btn btn-logout" onclick="logout()" style="width:100%;">
      <i class="fas fa-sign-out-alt"></i> Log Out
    </button>
  </div>

  <div class="features">
    <div class="feature-item">
      <i class="fas fa-download"></i>
      <span>Release Assets</span>
    </div>
    <div class="feature-item">
      <i class="fas fa-file-code"></i>
      <span>Raw Files</span>
    </div>
    <div class="feature-item">
      <i class="fas fa-archive"></i>
      <span>Archive Packages</span>
    </div>
  </div>
</div>

<div class="loading" id="loading">
  <div class="loading-spinner"></div>
</div>

<script>
async function pasteUrl(){
  try{
    const text=await navigator.clipboard.readText();
    document.getElementById('url').value=text;
  }catch(e){
    alert('Unable to access clipboard, please paste manually');
  }
}

function showLoading(){
  document.getElementById('loading').style.display='flex';
}

function hideLoading(){
  document.getElementById('loading').style.display='none';
}

function go(){
  const v=document.getElementById('url').value.trim();
  if(!v)return alert('Please enter a GitHub link');
  try{
    const u=new URL(v);
    const base=location.origin;
    let targetUrl;
    if(u.hostname==='raw.githubusercontent.com'){
      targetUrl=base+'/raw'+u.pathname;
    }else if(u.hostname==='github.com'){
      targetUrl=base+u.pathname;
    }else{
      return alert('Please enter a valid GitHub link');
    }
    const newWindow = window.open(targetUrl, '_blank');
    if(!newWindow){
      alert('Please allow pop-up windows to continue the download');
    }
  }catch(e){
    alert('Invalid link format, please check and try again');
  }
}

function logout() {
  document.cookie = 'auth_token=; path=/; max-age=0';
  window.location.reload();
}
</script>
<script src="https://baf.quoex.moe/mouse-spark-trail.js"></script>
</body>
</html>`;
}

/* ================= Core Logic ================= */

async function handleRequest(event) {
  const request = event.request;
  const url = new URL(request.url);
  const path = url.pathname;

  // Handle verification request
  if (path === '/verify' && request.method === 'POST') {
    try {
      const data = await request.json();
      const success = data.password === PASSWORD;
      return new Response(JSON.stringify({ success }), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      });
    } catch (e) {
      return new Response(JSON.stringify({ success: false }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // Check authentication status
  const cookie = request.headers.get('Cookie') || '';
  const hasAuth = cookie.includes('auth_token=verified');

  // Home page - show different pages based on auth status
  if (path === '/' || path === '') {
    if (!hasAuth) {
      return new Response(getPasswordHTML(), {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' },
      });
    }
    return new Response(getMainHTML(), {
      headers: { 'Content-Type': 'text/html;charset=UTF-8' },
    });
  }

  // If not authenticated, return password page for all other paths
  if (!hasAuth) {
    // For static asset requests, return 403
    if (path.includes('.') && !path.startsWith('/raw') && !path.startsWith('/archive')) {
      return new Response('Forbidden', { status: 403 });
    }
    return new Response(getPasswordHTML(), {
      headers: { 'Content-Type': 'text/html;charset=UTF-8' },
    });
  }

  /* ===== Path type detection ===== */
  const isRaw = path.startsWith('/raw/');
  const isReleaseAsset = path.includes('/releases/download/');
  const isArchive =
    path.startsWith('/archive/') ||
    path.endsWith('.zip') ||
    path.endsWith('.tar.gz');

  /* ===== Upstream URL ===== */
  let upstreamUrl;
  if (isRaw) {
    upstreamUrl = RAW_HOST + path.replace('/raw', '');
  } else {
    upstreamUrl = UPSTREAM_HOST + path;
  }

  /* =================================================
     🔥 Critical fix: Release download files 【Full passthrough】
     ================================================= */
  if (isReleaseAsset) {
    return fetch(upstreamUrl, {
      method: request.method,
      headers: request.headers,
      redirect: 'follow',
    });
  }

  /* ================== Cachable Resources ================== */

  const cache = caches.default;
  const cacheKey = new Request(url.toString(), request);

  let response = await cache.match(cacheKey);
  if (response) return response;

  response = await fetch(upstreamUrl, {
    method: request.method,
    headers: request.headers,
    redirect: 'follow',
  });

  if (!response.ok) {
    return new Response(`Upstream error: ${response.status}`, {
      status: response.status,
    });
  }

  // Clone only non-stream responses
  const newResp = new Response(response.body, response);
  newResp.headers.set(
    'Cache-Control',
    `public, max-age=${CACHE_CONFIG.browserTTL}`
  );
  newResp.headers.set(
    'CDN-Cache-Control',
    `public, max-age=${CACHE_CONFIG.edgeTTL}`
  );
  newResp.headers.set('Access-Control-Allow-Origin', '*');

  event.waitUntil(cache.put(cacheKey, newResp.clone()));
  return newResp;
}
