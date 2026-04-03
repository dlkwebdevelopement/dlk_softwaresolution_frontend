import React from "react";
import { Box, Typography, Rating, alpha, useTheme, useMediaQuery } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(66, 133, 244, 0.4); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(66, 133, 244, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(66, 133, 244, 0); }
`;

const slideIn = keyframes`
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const StyledFloatingBtn = styled("a")(({ theme }) => ({
  position: "fixed",
  bottom: "130px",
  left: "20px",
  backgroundColor: "#ffffff",
  padding: "12px 20px",
  borderRadius: "50px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  textDecoration: "none",
  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  border: "1px solid #e0e0e0",
  zIndex: 2000,
  animation: `${slideIn} 0.8s ease-out, ${pulse} 3s infinite`,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "translateY(-5px) scale(1.02)",
    boxShadow: "0 15px 40px rgba(66, 133, 244, 0.2)",
    borderColor: "#4285F4",
  },
  [theme.breakpoints.down("sm")]: {
    bottom: "160px",
    left: "20px",
    padding: "10px 15px",
    gap: "8px",
  },
}));

export default function GoogleReviewFloatingButton() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <StyledFloatingBtn
      href="https://search.google.com/local/writereview?placeid=ChIJKeCIbgBnUjoRHvW1DZJVYNU"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Box 
        component="img" 
        src='https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_"G"_logo.svg' 
        sx={{ width: 20, height: 20 }} 
        alt="Google"
      />
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography 
            sx={{ 
              fontWeight: 800, 
              fontSize: isMobile ? "0.85rem" : "1rem", 
              color: "#111c12",
              lineHeight: 1
            }}
          >
            4.9
          </Typography>
          <Rating value={4.9} precision={0.1} readOnly size="small" sx={{ fontSize: isMobile ? "0.9rem" : "1.1rem" }} />
        </Box>
        {!isMobile && (
          <Typography 
            sx={{ 
              fontSize: "0.7rem", 
              fontWeight: 700, 
              color: "#4285F4",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              mt: 0.2
            }}
          >
            Review us on Google
          </Typography>
        )}
      </Box>
    </StyledFloatingBtn>
  );
}
