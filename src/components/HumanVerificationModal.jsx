// import React, { useState, useEffect } from 'react';
// import { 
//   Dialog, 
//   DialogContent, 
//   Typography, 
//   Box, 
//   IconButton, 
//   Fade,
//   Grow,
//   alpha 
// } from '@mui/material';
// import ReCAPTCHA from 'react-google-recaptcha';
// import { useCaptcha } from '../context/CaptchaContext';
// import ShieldMoonIcon from '@mui/icons-material/ShieldMoon';
// import CloseIcon from '@mui/icons-material/Close';

// const HumanVerificationModal = () => {
//   const { isVerified, setVerified, showModal, setShowModal } = useCaptcha();

//   useEffect(() => {
//     // If already verified, don't show
//     if (isVerified) return;

//     // Wait 10 seconds after visit to show modal
//     const timer = setTimeout(() => {
//       setShowModal(true);
//     }, 10000);

//     return () => clearTimeout(timer);
//   }, [isVerified, setShowModal]);

//   const handleVerify = (token) => {
//     if (token) {
//       setVerified("SESSION_VERIFIED");
//     }
//   };

//   return (
//     <Dialog 
//       open={showModal && !isVerified} 
//       maxWidth="xs" 
//       fullWidth
//       sx={{
//         '& .MuiDialog-paper': {
//           borderRadius: '24px',
//           padding: '24px',
//           background: 'rgba(255, 255, 255, 0.95)',
//           backdropFilter: 'blur(10px)',
//           border: '1px solid rgba(61, 184, 67, 0.1)',
//           boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
//         }
//       }}
//     >
//        {/* Close Button removed to force verification as per "one time to use site" */}
       
//       <DialogContent sx={{ textAlign: 'center', p: 0 }}>
//         <Box sx={{ mb: 3 }}>
//           <Box sx={{ 
//             width: 70, 
//             height: 70, 
//             bgcolor: alpha('#3DB843', 0.1), 
//             borderRadius: '50%', 
//             display: 'flex', 
//             alignItems: 'center', 
//             justifyContent: 'center',
//             margin: '0 auto',
//             mb: 2,
//             border: '1px solid rgba(61, 184, 67, 0.2)'
//           }}>
//             <ShieldMoonIcon sx={{ fontSize: 35, color: '#3DB843' }} />
//           </Box>
//           <Typography variant="h5" sx={{ fontWeight: 800, color: '#1a2b1b', mb: 1 }}>
//             Security Verification
//           </Typography>
//           <Typography variant="body2" sx={{ color: '#6b8f6d', mb: 3 }}>
//             To protect our community, please verify that you are a human.
//           </Typography>
//         </Box>

//         <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
//           <ReCAPTCHA
//             sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
//             onChange={handleVerify}
//           />
//         </Box>
        
//         <Typography variant="caption" sx={{ color: '#999', display: 'block', mt: 1 }}>
//           This check keeps our platform safe and secure.
//         </Typography>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default HumanVerificationModal;
