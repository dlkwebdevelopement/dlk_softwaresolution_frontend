import React, { useEffect } from "react";
import { Dialog, Box, Typography, Fade, Zoom, alpha } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const SuccessPopup = ({ open, onClose, message = "Enquiry Submitted Successfully" }) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  return (
    <Dialog
      open={open}
      TransitionComponent={Fade}
      transitionDuration={500}
      PaperProps={{
        sx: {
          borderRadius: "32px",
          padding: "40px",
          textAlign: "center",
          maxWidth: "400px",
          width: "90%",
          boxShadow: "0 25px 70px rgba(0, 0, 0, 0.2)",
          background: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(61, 184, 67, 0.1)",
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        {/* Background glow */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "120px",
            height: "120px",
            background: alpha("#3DB843", 0.15),
            borderRadius: "50%",
            filter: "blur(30px)",
            zIndex: 0,
          }}
        />
        
        <Zoom in={open} style={{ transitionDelay: "200ms" }}>
          <Box sx={{ position: "relative", zIndex: 1, mb: 3 }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 90, color: "#3DB843" }} />
          </Box>
        </Zoom>
        
        <Fade in={open} style={{ transitionDelay: "400ms" }}>
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 900, 
                color: "#111c12", 
                mb: 1.5, 
                letterSpacing: "-1px",
                fontFamily: '"Poppins", sans-serif'
              }}
            >
              Success!
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: "#2e9133", 
                fontWeight: 600,
                fontSize: "1.1rem",
                lineHeight: 1.5
              }}
            >
              {message}
            </Typography>
          </Box>
        </Fade>
      </Box>
    </Dialog>
  );
};

export default SuccessPopup;
