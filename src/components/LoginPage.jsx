// src/components/LoginPage.jsx

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import epicLogo from '../assets/epic_logo.png'; // Import the logo
import { generateCodeVerifier, generateCodeChallenge } from '../utils/pkce'; // Ensure correct path
import { exchangeCodeForToken } from '../utils/TokenExchange'; // Ensure correct path
import { createAvatar } from '@dicebear/core';
import { dylan } from '@dicebear/collection';

// Define styled components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #1cbb9b;
  margin: 0;
`;

const LoginBox = styled.div`
  position: relative;
  width: 500px;
  height: 520px;
  background-color: #fff;
  padding: 10px;
  border-radius: 3px;
  box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.33);
`;

const Header = styled.div`
  color: #00415d;
  margin: 5px 5px 10px 5px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  text-align: center;
  height: 28px;
`;

const HeaderLink = styled.div`
  display: inline-block;
  margin: 0 25px;
  padding: 10px;
  color: ${props => (props.active ? '#029f5b' : '#666')};
  font-family: 'Roboto', sans-serif;
  font-weight: ${props => (props.active ? '700' : '400')};
  font-size: ${props => (props.active ? '18px' : '15px')};
  border-bottom: ${props => (props.active ? '2px solid #029f5b' : 'none')};
  transition: color 0.3s ease, font-size 0.3s ease, font-weight 0.3s ease, border-bottom 0.3s ease;
  cursor: default;
`;

const SocialLogin = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px 0 15px 0;

`;

const SocialButton = styled.a`
//   display: flex;
  align-items: center;
  width: 45%;
  max-width: 400px;
  text-decoration: none;
  color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.05);
  padding: 12px;
  border-radius: 2px;
  font-size: 12px;
  text-transform: uppercase;
  margin: 0 3%;
  text-align: center;
  background-color: ${props => props.bgColor};
  position: relative;
`;

const SocialIcon = styled.img`
  height: 20px;
  margin-right: 8px;
  vertical-align: middle;
`;

const Avatar = styled.img`
  display: block;
  margin: 20px auto;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid #ddd;
`;

const Form = styled.form`
  margin-top: 20px;
  text-align: center;
`;

const FormGroup = styled.div`
  width: 100%;
  margin-bottom: 10px;
`;

const Input = styled.input`
  width: calc(50% - 22px);
  height: 45px;
  outline: none;
  border: 1px solid #ddd;
  padding: 0 10px;
  border-radius: 2px;
  color: #333;
  font-size: 0.8rem;

  &:focus {
    border-color: #358efb;
  }
`;

const Button = styled.button`
  width: 50%;
  background-color: #1cb94e;
  border: none;
  outline: none;
  color: #fff;
  font-size: 14px;
  font-weight: normal;
  padding: 14px 0;
  border-radius: 2px;
  text-transform: uppercase;
`;

const ForgotPassword = styled.a`
  width: 50%;
  text-align: left;
  text-decoration: underline;
  color: #888;
  font-size: 0.75rem;

`;
const Fieldset = styled.fieldset`
  border: 0;
  padding: 10px;
  margin: 20px 0;
  position: relative;
  justify-content: center;
  border-top: 1px solid #ddd;
`;

const Legend = styled.legend`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  padding: 0 10px;
  font-size: 14px;
  color: #888;

  font-family: 'Roboto', sans-serif;


`;

// Define handleLogin function
const handleLogin = async () => {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  localStorage.setItem('code_verifier', codeVerifier); // Store code verifier

  const authURL = `https://fhir.epic.com/interconnect-fhir-oauth/oauth2/authorize?response_type=code&client_id=1fc921da-dc6d-4db1-9ecd-74c56d6f7940&redirect_uri=http://localhost:911&scope=openid fhiruser&code_challenge=${codeChallenge}&code_challenge_method=S256`;

  window.location.href = authURL;
};

const handleRedirect = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const codeVerifier = localStorage.getItem('code_verifier');

  if (code && codeVerifier) {
    try {
      const tokenResponse = await exchangeCodeForToken(code, codeVerifier);
      console.log('Token Response:', tokenResponse);
      localStorage.setItem('access_token', tokenResponse.access_token);
      // Proceed to fetch patient data or navigate to a different page
    } catch (error) {
      console.error('Error exchanging code for token:', error);
    }
  }
};

// Generate avatar URL
const generateAvatarUrl = () => {
  const avatar = createAvatar(dylan, {
    seed: 'unique-seed', // Replace with your custom seed or any unique identifier
    // Add other options here if needed
  });
  return avatar.toDataUri(); // Use `toDataUri` method instead of `toDataUriSync`
};

const LoginPage = () => {
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    handleRedirect();
    setAvatarUrl(generateAvatarUrl());
  }, []);
  useEffect(async()=>{
    const code = new URL(window.location.href).searchParams.get('code');
    if (code && codeVerifier) {
        await exchangeCodeForToken(code, codeVerifier)}

  },[])

  return (
    <Container>        
      <LoginBox>
      <Avatar src={avatarUrl} alt="User Avatar" />
        <Header>
          <HeaderLink active>
            Login
          </HeaderLink>
        </Header>
       
        
        <Form>
          <FormGroup>
            <Input type="email" placeholder="Email" />
          </FormGroup>
          <FormGroup>
            <Input type="password" placeholder="Password" />
          </FormGroup>
          <FormGroup>
            <Button>Log in</Button>
          </FormGroup>
          <FormGroup>
            <ForgotPassword href="#">Forgot password?</ForgotPassword>
          </FormGroup>
          <Fieldset>
            <Legend>or Log In with</Legend>
            <SocialLogin>
          <SocialButton bgColor="#DF4A32" href="#" onClick={handleLogin}>
            <SocialIcon src={epicLogo} alt="Epic Logo" />
            Login with Epic
          </SocialButton>
        </SocialLogin>
          </Fieldset>
         
        </Form>
      </LoginBox>
    </Container>
  );
};

export default LoginPage;
