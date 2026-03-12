import React, { useEffect, useState } from "react";
import { Box, Typography, alpha } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { GetRequest } from "../../api/config";
import { ADMIN_GET_COMPANIES } from "../../api/endpoints";
import { BASE_URL, getImgUrl } from "../../api/api";

const scrollLeft = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const CarouselContainer = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  borderRadius: '32px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  padding: theme.spacing(6, 2),
  position: 'relative',
  overflow: 'hidden',
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    width: '150px',
    height: '100%',
    zIndex: 2,
    pointerEvents: 'none',
  },
  '&::before': {
    left: 0,
    background: 'linear-gradient(90deg, #fbfdf3 0%, transparent 100%)',
  },
  '&::after': {
    right: 0,
    background: 'linear-gradient(-90deg, #fbfdf3 0%, transparent 100%)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4, 1),
    '&::before, &::after': {
      width: '50px',
    },
  },
}));

const LogoWrapper = styled(Box)(({ theme }) => ({
  minWidth: 200,
  width: 110,
  height: 110,
  mx: 2,
  margin: '0 12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '16px',
  background: '#f5f5f5',
  border: '1px solid rgba(61, 184, 67, 0.12)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
  padding: '14px',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  flexShrink: 0,
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    filter: 'grayscale(10%) opacity(0.85)',
    transition: 'all 0.4s ease',
  },
  '&:hover': {
    transform: 'scale(1.1) translateY(-4px)',
    boxShadow: '0 12px 32px rgba(61, 184, 67, 0.18)',
    borderColor: 'rgba(61, 184, 67, 0.4)',
    '& img': {
      filter: 'grayscale(0%) opacity(1)',
    },
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 110,
    width: 110,
    height: 110,
    margin: '0 8px',
    padding: '10px',
    borderRadius: '12px',
  },
}));

// Duplicate logos for seamless loop

export default function LogoCarousel() {
  const [logos, setLogo] = useState([]);
  const loopLogos = [...logos, ...logos];

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await GetRequest(ADMIN_GET_COMPANIES);
        setLogo(data);
      } catch (err) {
        console.error("Failed to fetch Companies:", err);
      }
    };
    fetch();
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1400px",
        mx: "auto",
        py: { xs: 2, md: 4 },
        px: { xs: 1, md: 1 },
      }}
    >
      {/* HEADER SECTION */}
      <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 0.5, borderRadius: '50px', bgcolor: 'var(--green-light)', border: '1px solid var(--green-mid)', mb: 2 }}>
          <WorkspacePremiumIcon sx={{ fontSize: 16, color: 'var(--green-dark)' }} />
          <Typography variant="caption" sx={{ fontWeight: 800, color: 'var(--green-dark)', letterSpacing: 0.5 }}>
            TRUSTED BY 1000+ TOP MNC PARTNERS
          </Typography>
        </Box>

        <Typography
          variant="h3"
          sx={{
            fontWeight: 900,
            color: "black",
            fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
            mb: 2,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}
        >
          We Tie-Up with <Box component="span" sx={{
            background: 'linear-gradient(135deg, var(--green-dark) 0%, var(--green) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block',
          }}>Leading IT and MNC</Box> Companies
        </Typography>

        <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: '700px', mx: 'auto' }}>
          Our students are placed in top globally recognized tech companies and industry leaders across the worldwide market.
        </Typography>
      </Box>

      {/* CAROUSEL CONTAINER */}
      <CarouselContainer>
        <Box
          sx={{
            display: "flex",
            width: "max-content",
            animation: `${scrollLeft} 45s linear infinite`,
            "&:hover": {
              animationPlayState: "paused",
            },
          }}
        >
          {loopLogos.map((logo, i) => (
            <LogoWrapper key={i}>
              <Box
                component="img"
                src={getImgUrl(logo?.photoUrl) || "https://via.placeholder.com/180x60?text=No+Logo"}
                alt={logo?.name || "company logo"}
              />
            </LogoWrapper>
          ))}
        </Box>
      </CarouselContainer>
    </Box>
  );
}
