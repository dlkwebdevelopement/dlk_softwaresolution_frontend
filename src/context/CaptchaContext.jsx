import React, { createContext, useContext, useState, useEffect } from 'react';

const CaptchaContext = createContext();

export const CaptchaProvider = ({ children }) => {
  const [isVerified, setIsVerified] = useState(
    sessionStorage.getItem('human_verified') === 'true'
  );
  const [sessionToken, setSessionToken] = useState(
    sessionStorage.getItem('human_token') || ''
  );
  const [showModal, setShowModal] = useState(false);

  const setVerified = (token) => {
    setIsVerified(true);
    setSessionToken(token);
    setShowModal(false);
    sessionStorage.setItem('human_verified', 'true');
    sessionStorage.setItem('human_token', token);
  };

  const triggerModal = () => {
    if (!isVerified) setShowModal(true);
  };

  return (
    <CaptchaContext.Provider value={{ isVerified, sessionToken, setVerified, showModal, setShowModal, triggerModal }}>
      {children}
    </CaptchaContext.Provider>
  );
};

export const useCaptcha = () => useContext(CaptchaContext);
