// src/utils/TokenExchange.js

export const exchangeCodeForToken = async (code, codeVerifier) => {
    const tokenEndpoint = 'https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token';
    const clientId = '1fc921da-dc6d-4db1-9ecd-74c56d6f7940';
    const redirectUri = 'http://localhost:911'; // Ensure this matches exactly
    const grantType = 'authorization_code';
    // const clientSecret = ''; // Add client secret if required by Epic
  
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: grantType,
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        code_verifier: codeVerifier,
        
      }),
    });
  
    if (!response.ok) {
      const errorText = await response.text(); // Get more details on the error
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
  
    const data = await response.json();
    return data;
  };
  