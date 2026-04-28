import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useCaptcha } from '../context/CaptchaContext';
import { Box } from '@mui/material';

const CaptchaWrapper = ({ onVerify, sitekey }) => {
  const { isVerified } = useCaptcha();

  if (isVerified) return null;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
      <ReCAPTCHA
        sitekey={sitekey || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
        onChange={onVerify}
      />
    </Box>
  );
};

export default CaptchaWrapper;
