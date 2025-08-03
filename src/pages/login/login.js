import { Card, Text, BlockStack, TextField, Button, InlineStack, Page, Grid, Box } from '@shopify/polaris';import { useState, useCallback } from 'react';
import { http } from '../../utils/http';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../../utils/userActions';
import LoginImg from '../../asset/reviewInLogin.png';
import './login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [invalidOTP, setInValidOTP] = useState('');
  const [showOTPInput, setOTPInput] = useState(false);
  const navigate = useNavigate();

  const validateEmail = useCallback((email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }, []);

  const handleChange = useCallback((input) => {
    // const input = e.target.value;
    setEmail(input);
    setIsValid(validateEmail(input));
    setErrorEmail('');
  }, []);

  const handleOTPChange = useCallback((input) => {
    // const input = e.target.value;
    setOTP(input);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!isValid) {
      setErrorEmail('Enter a valid email address');
      return;
    }
    http
      .get(`api/public/review-dashboard/generate-otp?email=${email}`)
      .then((res) => {
        const { status, message } = res;
        if (status === 'success') {
          setOTPInput(true);
        } else {
          setErrorEmail(message);
        }
      })
      .catch(() => {
        setOTPInput(true);
      });
  }, [isValid, email]);

  const validateOTP = useCallback(() => {
    http
      .get(`api/public/review-dashboard/validate-otp?email=${email}&otp=${otp}`)
      .then((res) => {
        const { status, token } = res;
        if (status === 'success') {
          localStorage.setItem('squidToken', token);
          const user = {
            email,
          };
          setUser(user);
          /**
           * Redirect to the review listing page
           */
          navigate('/');
        } else {
          setInValidOTP('Invalid OTP');
        }
      })
      .catch(() => {
        /**
         * Show an error message like something went wrong
         */
      });
  }, [otp, email]);

  return (
    <Page fullWidth>
      <Box className="sq-login__container">
        <Box className="sq-login__content-container">
          <Box className="sq-login__content">
            <Box>
              <img src={LoginImg} alt="SquidApps Logo" style={{ width: '100%' }} />
            </Box>
            <Box className="sq-login__content-text">
              <Text variant="heading2xl" as="h3">
                Your Voice, Your Control
              </Text>
              <Text variant="headingXs" as="h6">
                Easily manage, edit, or remove your product reviews anytime. Your experience matters — and you stay in charge.
              </Text>
            </Box>
          </Box>
        </Box>

        <Box className="sq-login__form-container">
          {/* <Card sectioned> */}
          <Box className="sq-login__form">
            {/* <BlockStack gap="400"> */}
            <Box className="sq-fullwidth">
              <Text as="h2" variant="heading3xl">
                Login
              </Text>
            </Box>
            <Box className="sq-fullwidth sq-login__form-inputs">
              <Box className="sq-fullwidth">
                <TextField
                  label="Enter your email"
                  value={email}
                  onChange={handleChange}
                  autoComplete="off"
                  placeholder="support@squidapps.co"
                  error={errorEmail}
                />
              </Box>
              {showOTPInput && (
                <Box className="sq-fullwidth">
                  <TextField
                    label="Enter OTP"
                    value={otp}
                    onChange={handleOTPChange}
                    autoComplete="off"
                    placeholder="OTP"
                    error={invalidOTP}
                  />
                </Box>
              )}
              {showOTPInput ? (
                <Box className="sq-fullwidth">
                  <Text tone="success" as="h2">
                    <InlineStack gap={100}>
                      {`OTP has been sent to`} <Text fontWeight="bold">{`${email}`}</Text>
                    </InlineStack>
                  </Text>
                </Box>
              ) : (
                ''
              )}
              {!showOTPInput ? (
                <Box className="sq-fullwidth">
                  <Button fullWidth variant="primary" onClick={handleSubmit}>
                    Submit
                  </Button>
                </Box>
              ) : (
                ''
              )}
              {showOTPInput ? (
                <Box className="sq-fullwidth">
                  <Button fullWidth variant="primary" onClick={validateOTP}>
                    Validate OTP
                  </Button>
                </Box>
              ) : (
                ''
              )}
              {/* </BlockStack> */}
            </Box>
          </Box>
          {/* </Card> */}
        </Box>
      </Box>
    </Page>
  );
}
