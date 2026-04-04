import React, { useState, useEffect } from "react";
import {
  Box,
  Fab,
  Stack,
  IconButton,
  Typography,
  Fade,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CloseIcon from "@mui/icons-material/Close";
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';

export default function FloatingEnquiry() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Show banner after 3 seconds if chat is not already open
    const timer = setTimeout(() => {
      if (!isChatOpen) {
        setShowBanner(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [isChatOpen]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) setShowBanner(false);
  };

  return (
    <>
      {/* Chatbot Iframe Container */}
      {isChatOpen && (
        <Box
          sx={{
            position: "fixed",
            bottom: { xs: 90, sm: 100 },
            right: { xs: 15, sm: 20 },
            width: { xs: "calc(100% - 30px)", sm: "400px" },
            height: { xs: "60vh", sm: "600px" },
            maxHeight: "calc(100vh - 120px)",
            bgcolor: "white",
            boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
            borderRadius: "20px",
            overflow: "hidden",
            zIndex: 1500,
            display: "flex",
            flexDirection: "column",
            animation: "slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            "@keyframes slideUp": {
              from: { opacity: 0, transform: "translateY(50px) scale(0.9)" },
              to: { opacity: 1, transform: "translateY(0) scale(1)" },
            },
          }}
        >
          {/* Header */}
          <Box sx={{
            bgcolor: "#3DB843",
            color: "white",
            p: 1.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
          }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box
                component="img"
                src="/photos/lakshmi_bot.png"
                sx={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover" }}
              />
              <Box sx={{ fontWeight: 600, fontSize: "1.1rem" }}>Lakshmi</Box>
            </Stack>
            <IconButton size="small" onClick={toggleChat} sx={{ color: "white", "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <iframe
            src="https://chatbot.dlksoftwaresolutions.co.in/"
            style={{ width: "100%", height: "100%", border: "none" }}
            title="DLK Chatbot"
          />
        </Box>
      )}

      {/* Floating Buttons */}
      <Box
        sx={{
          position: "fixed",
          bottom: { xs: 80, sm: 90, md: 60 },
          right: { xs: 20, sm: 20 },
          zIndex: 1300
        }}
      >
        <Stack spacing={2}>
          {/* Chatbot Button (3D Icon) */}
          <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Notification Bubble */}
            <Fade in={showBanner && !isChatOpen} timeout={500}>
              <Box
                sx={{
                  position: "absolute",
                  bottom: 95,
                  right: 0,
                  bgcolor: "#3DB843",
                  color: "white",
                  py: 1.5,
                  px: 2,
                  borderRadius: "16px",
                  boxShadow: "0 8px 25px rgba(61, 184, 67, 0.4)",
                  width: { xs: "180px", sm: "200px" },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  zIndex: 1400,
                  animation: "bgPulse 2s ease-in-out infinite",
                  "@keyframes bgPulse": {
                    "0%, 100%": {
                      boxShadow: "0 8px 15px rgba(61, 184, 67, 0.4)",
                      transform: "scale(1)"
                    },
                    "50%": {
                      boxShadow: "0 8px 30px rgba(61, 184, 67, 0.8), 0 0 20px rgba(61, 184, 67, 0.6)",
                      transform: "scale(1.02)"
                    }
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: -8,
                    right: { xs: 25, sm: 30 },
                    width: 0,
                    height: 0,
                    borderLeft: "10px solid transparent",
                    borderRight: "10px solid transparent",
                    borderTop: "10px solid #3DB843",
                  },
                }}
              >
                <Typography sx={{ fontSize: "0.9rem", fontWeight: 600, lineHeight: 1.2 }}>
                  Need help? Chat with Lakshmi AI
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setShowBanner(false)}
                  sx={{ color: "white", ml: 1, p: 0.2 }}
                >
                  <CloseIcon sx={{ fontSize: "14px" }} />
                </IconButton>
              </Box>
            </Fade>

            <Fab
              onClick={toggleChat}
              sx={{
                overflow: 'hidden',
                padding: 0,
                width: { xs: 75, sm: 85 },
                height: { xs: 75, sm: 85 },
                bgcolor: "transparent",
                boxShadow: "none",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.1) rotate(5deg)",
                  bgcolor: "transparent",
                }
              }}
            >
              <img
                src="/photos/lakshmi_bot.png"
                alt="Chatbot"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
              />
            </Fab>
          </Box>
        </Stack>
      </Box>

      {/* Left-side Social Buttons (Centered, Flush Left) */}
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          transform: "translateY(-50%)",
          left: 0,
          zIndex: 900,
          display: "flex",
          flexDirection: "column",
          // gap: "4px",
        }}
      >
        {/* Facebook */}
        <Box
          component="a"
          href="https://www.facebook.com/profile.php?id=61569333069634"
          target="_blank"
          sx={{
            width: 48,
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            overflow: "hidden",
            bgcolor: "#3b5998",
            color: "white",
            textDecoration: "none",
            transition: "width 0.3s ease, box-shadow 0.3s ease",
            boxShadow: "2px 2px 8px rgba(0,0,0,0.25)",
            "&:hover": {
              width: 140,
              bgcolor: "#3b5998",
              boxShadow: "4px 4px 16px rgba(59,89,152,0.5)",
            }
          }}
        >
          <Box sx={{ minWidth: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FacebookIcon />
          </Box>
          <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", whiteSpace: "nowrap" }}>
            Facebook
          </Typography>
        </Box>

        {/* Instagram */}
        <Box
          component="a"
          href="https://instagram.com"
          target="_blank"
          sx={{
            width: 48,
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            overflow: "hidden",
            bgcolor: "#E1306C",
            color: "white",
            textDecoration: "none",
            transition: "width 0.3s ease, box-shadow 0.3s ease",
            boxShadow: "2px 2px 8px rgba(0,0,0,0.25)",
            "&:hover": {
              width: 140,
              bgcolor: "#E1306C",
              boxShadow: "4px 4px 16px rgba(225,48,108,0.5)",
            }
          }}
        >
          <Box sx={{ minWidth: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <InstagramIcon />
          </Box>
          <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", whiteSpace: "nowrap" }}>
            Instagram
          </Typography>
        </Box>

        {/* YouTube */}
        <Box
          component="a"
          href="https://youtube.com"
          target="_blank"
          sx={{
            width: 48,
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            overflow: "hidden",
            bgcolor: "#cd201f",
            color: "white",
            textDecoration: "none",
            transition: "width 0.3s ease, box-shadow 0.3s ease",
            boxShadow: "2px 2px 8px rgba(0,0,0,0.25)",
            "&:hover": {
              width: 140,
              bgcolor: "#cd201f",
              boxShadow: "4px 4px 16px rgba(205,32,31,0.5)",
            }
          }}
        >
          <Box sx={{ minWidth: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <YouTubeIcon />
          </Box>
          <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", whiteSpace: "nowrap" }}>
            YouTube
          </Typography>
        </Box>
      </Box>

      {/* Left-side WhatsApp Button (Bottom) */}
      <Box
        sx={{
          position: "fixed",
          bottom: { xs: 80, sm: 90, md: 60 },
          left: { xs: 15, sm: 20 },
          zIndex: 1300
        }}
      >
        <Fab
          sx={{
            overflow: 'hidden',
            padding: 0,
            width: { xs: 50, sm: 56 },
            height: { xs: 50, sm: 56 }
          }}
          href="https://wa.me/917708150152"
          target="_blank"
        >
          <img
            src="/photos/whatsapp-icon.png"
            alt="WhatsApp"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Fab>
      </Box>
    </>
  );
}
