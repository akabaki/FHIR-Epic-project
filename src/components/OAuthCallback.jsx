import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccessToken = async () => {
      const code = new URLSearchParams(window.location.search).get('code');
      const code_verifier = sessionStorage.getItem('code_verifier');
      
      try {
        const response = await axios.post(import.meta.env.VITE_ACCESS_TOKEN_URL, {
          grant_type: 'authorization_code',
          code,
          redirect_uri: import.meta.env.VITE_CALLBACK_URL,
          client_id: import.meta.env.VITE_CLIENT_ID,
          code_verifier
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });

        // Save the access token and navigate to the dashboard
        sessionStorage.setItem('access_token', response.data.access_token);
        navigate('/dashboard');
      } catch (error) {
        console.error('Error fetching access token', error);
      }
    };

    fetchAccessToken();
  }, [navigate]);

  return <div>Loading...</div>;
};

export default OAuthCallback;
