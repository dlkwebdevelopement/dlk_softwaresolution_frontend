import React, { useEffect, useState } from "react";
import { Box, Typography, Container } from "@mui/material";
import { styled } from "@mui/material/styles";
import { GetRequest } from "../../api/config";
import { ADMIN_GET_COMPANIES } from "../../api/endpoints";
import { getImgUrl } from "../../api/api";

const LogoWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0.5),
  transition: 'transform 0.4s ease',
  '& img': {
    maxWidth: '160px',
    height: 'auto',
    maxHeight: '60px',
    filter: 'grayscale(100%) opacity(0.4)',
    transition: 'all 0.4s ease',
  },
  '&:hover': {
    transform: 'scale(1.1)',
    '& img': {
      filter: 'grayscale(0%) opacity(1)',
    },
  },
}));

export default function LogoCarousel() {
  const [logos, setLogo] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await GetRequest(ADMIN_GET_COMPANIES);
        setLogo(data || []);
      } catch (err) {
        console.error("Failed to fetch Companies:", err);
      }
    };
    fetch();
  }, []);

  return (
    <Box sx={{ bgcolor: '#f8fafc', py: { xs: 4, sm: 5, md: 6 }, borderTop: '1px solid #f3f4f6' }}>
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            alignItems: 'center', 
            justifyContent: 'space-between',
            gap: { xs: 3, sm: 3, md: 5 },
          }}
        >
          {/* LEFT CONTENT: TEXT */}
          <Box sx={{ flex: { xs: '1', sm: '1' }, textAlign: 'left' }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                color: "#111827",
                fontSize: { xs: '2.5rem', sm: '2.8rem', md: '3.5rem' },
                lineHeight: 1.05,
                mb: 3,
                letterSpacing: '-0.03em',
              }}
            >
              We Tie-Up <Box component="span" sx={{ color: '#16a34a' }}>with Leading IT and MNC</Box> Companies
            </Typography>

            <Typography 
              variant="body1" 
              sx={{ 
                color: "#6b7280", 
                fontSize: { xs: "1.1rem", md: "1.1rem" },
                lineHeight: 1.6,
                maxWidth: '540px',
                fontWeight: 400
              }}
            >
              Our students are placed in top globally recognized tech companies and industry leaders across the worldwide market.
            </Typography>
          </Box>

          {/* RIGHT CONTENT: LOGO GRID */}
          <Box 
            sx={{ 
              flex: { xs: '1', sm: '1.2' }, 
              width: '100%',
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: { xs: 1, sm: 1, md: 1.5 },
              alignItems: 'center',
              justifyItems: 'center',
            }}
          >
            {logos.length > 0 ? (
              logos.slice(0, 9).map((logo, i) => (
                <LogoWrapper key={i}>
                  <Box
                    component="img"
                    src={getImgUrl(logo?.photoUrl)}
                    alt={logo?.name || "company logo"}
                  />
                </LogoWrapper>
              ))
            ) : (
              // Fallback Placeholders
              [...Array(6)].map((_, i) => (
                <LogoWrapper key={i}>
                  <Typography 
                    variant="h5" 
                    sx={{ color: '#e5e7eb', fontWeight: 900, textTransform: 'uppercase', opacity: 0.6 }}
                  >
                    Logo
                  </Typography>
                </LogoWrapper>
              ))
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
