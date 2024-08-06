// src/utils/pkce.js

export function generateCodeVerifier() {
    const array = new Uint8Array(32); // 32 bytes = 256 bits
    window.crypto.getRandomValues(array);
    return base64urlEncode(array);
  }
  
  export function generateCodeChallenge(codeVerifier) {
    return crypto.subtle
      .digest('SHA-256', new TextEncoder().encode(codeVerifier))
      .then(buffer => base64urlEncode(new Uint8Array(buffer)));
  }
  
  // Helper function to convert to Base64 URL encoding
  function base64urlEncode(arrayBuffer) {
    let base64 = '';
    const bytes = new Uint8Array(arrayBuffer);
    const len = bytes.byteLength;
  
    for (let i = 0; i < len; i++) {
      base64 += String.fromCharCode(bytes[i]);
    }
  
    return btoa(base64)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
  