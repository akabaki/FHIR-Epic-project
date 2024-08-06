// src/pkceUtils.js
export function generateCodeVerifier() {
    const array = new Uint32Array(56 / 2);
    window.crypto.getRandomValues(array);
    return Array.from(array, decToHex).join('');
  }
  
  function decToHex(dec) {
    return ('0' + dec.toString(16)).substr(-2);
  }
  
  export function generateCodeChallenge(codeVerifier) {
    return crypto.subtle
      .digest('SHA-256', new TextEncoder().encode(codeVerifier))
      .then(hash => {
        const base64Url = bufferToBase64Url(hash);
        return base64Url;
      });
  }
  
  function bufferToBase64Url(buffer) {
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  