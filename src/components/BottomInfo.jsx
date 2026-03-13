import { Box, Typography, Stack, useTheme, useMediaQuery, Chip, alpha } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled, keyframes } from "@mui/material/styles";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import TelegramIcon from "@mui/icons-material/Telegram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CallIcon from "@mui/icons-material/Call";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

// Animations
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-3px); }
  100% { transform: translateY(0px); }
`;

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(61, 184, 67, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(61, 184, 67, 0); }
  100% { box-shadow: 0 0 0 0 rgba(61, 184, 67, 0); }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const rotateGradient = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Color scheme
const colors = {
  primary: "#3DB843",
  secondary: "#c2eac4",
  accent: "#D3F36B",
  dark: "#1a4718",
  light: "#ffffff",
  text: {
    primary: "#111c12",
    secondary: "#2e9133",
    light: "#f8faf7",
  },
  gradient: {
    main: "linear-gradient(135deg, #D3F36B, #c2eac4, #3DB843)",
    text: "linear-gradient(270deg, #1a4718, #3DB843, #c2eac4, #D3F36B)",
    accent: "linear-gradient(135deg, #3DB843, #c2eac4)",
  }
};

// Styled Components
const GlassBar = styled(Box)(({ theme }) => ({
  position: "fixed",
  bottom: 0,
  left: 0,
  width: "100%",
  minHeight: "40px",
  height: { xs: "auto", sm: "40px" },
  background: 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderTop: `1px solid ${alpha(colors.primary, 0.1)}`,
  zIndex: 1400,
  display: "flex",
  alignItems: "center",
  boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.08)',
  padding: theme.spacing(0.5, 0),
  overflow: 'hidden',
  maxWidth: "100vw",
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    animation: `${shimmer} 3s infinite`,
    pointerEvents: 'none',
  },
}));

const ContactChip = styled(Chip)({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.5)',
  borderRadius: '30px',
  padding: '4px 8px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 5px 15px rgba(72, 114, 62, 0.2)`,
  },
  '& .MuiChip-label': {
    fontWeight: 600,
    color: colors.dark,
  },
  '& .MuiChip-icon': {
    color: colors.primary,
  },
});

const AnimatedText = styled(Typography)({
  color: colors.dark,
  fontWeight: 700,
});

const CTABox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${colors.dark}, ${colors.primary})`,
  height: "36px",
  padding: "0 20px",
  borderRadius: "50px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: 'relative',
  overflow: 'hidden',
  boxShadow: `0 4px 15px ${alpha(colors.dark, 0.2)}`,
  cursor: "pointer",
  animation: `${pulseGlow} 2s infinite`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
    animation: `${shimmer} 3s infinite`,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '150%',
    height: '150%',
    background: `radial-gradient(circle, ${alpha(colors.secondary, 0.2)} 0%, transparent 70%)`,
    animation: `${rotateGradient} 10s linear infinite`,
  },
}));

const IconWrapper = styled(Box)({
  width: { xs: 24, sm: 28 },
  height: { xs: 24, sm: 28 },
  borderRadius: '50%',
  background: alpha(colors.light, 0.2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: colors.primary,
    transform: 'scale(1.1)',
    '& svg': {
      color: colors.light,
    },
  },
  '& svg': {
    fontSize: 16,
    color: colors.dark,
    transition: 'color 0.3s ease',
  },
});

const BottomInfo = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  return (
    <GlassBar>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        sx={{ px: { xs: 2, md: 10 } }}
      >
        {/* Left Section - Contact Info */}
        <Stack
          direction="row"
          spacing={{ xs: 2, md: 5 }}
          alignItems="center"
          sx={{
            flex: 1,
            overflow: "hidden",
            animation: `${slideInLeft} 0.5s ease-out`,
          }}
        >
          {/* Scrolling Contact Info for Mobile */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: { xs: "space-between", md: "flex-start" },
              gap: { xs: 0, md: 5 },
              width: "100%",
            }}
          >
            {/* Phone Numbers */}
            <Stack 
              direction="row" 
              spacing={1} 
              alignItems="center" 
              sx={{ 
                flexShrink: 0,
                cursor: 'pointer',
                '&:hover': {
                  '& .MuiTypography-root': { color: colors.primary },
                  '& .IconWrapper-root': { 
                    background: colors.primary,
                    '& svg': { color: colors.light }
                  }
                }
              }}
              onClick={() => window.location.href = 'tel:+917708150152'}
            >
              <IconWrapper className="IconWrapper-root">
                <PhoneIcon />
              </IconWrapper>
              <AnimatedText
                sx={{
                  fontSize: { xs: '0.75rem', md: '0.85rem' },
                  fontWeight: 800,
                  whiteSpace: 'nowrap',
                  color: colors.dark,
                  transition: 'color 0.3s ease',
                }}
              >
                {isMobile
                  ? "+91 77081 50152"
                  : isTablet
                    ? "+91 77081 50152, +91 97518 00789"
                    : "+91 77081 50152, +91 97518 00789, +91 79043 20834"}
              </AnimatedText>
            </Stack>

            {/* Email Section */}
            <Stack 
              direction="row" 
              spacing={1} 
              alignItems="center" 
              sx={{ 
                flexShrink: 0, 
                cursor: 'pointer',
                '&:hover': {
                  '& .MuiTypography-root': {
                    color: colors.primary,
                  },
                  '& .IconWrapper-root': {
                    background: colors.primary,
                    '& svg': { color: colors.light }
                  }
                }
              }}
              onClick={() => {
                const subject = encodeURIComponent("Enquiry from Website");
                const body = encodeURIComponent("Hello DLK Software Solutions,\n\nI am interested in your training programs and would like to get more details.\n\nRegards,");
                if (isMobile) {
                  window.location.href = `mailto:dlksoftwaresolutions@gmail.com?subject=${subject}&body=${body}`;
                } else {
                  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=dlksoftwaresolutions@gmail.com&su=${subject}&body=${body}`;
                  window.open(gmailUrl, "_blank");
                }
              }}
            >
              <IconWrapper className="IconWrapper-root">
                <EmailIcon />
              </IconWrapper>
              <Typography
                sx={{
                  color: colors.dark,
                  fontSize: { xs: '0.75rem', md: '0.9rem' },
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  opacity: 0.9,
                  transition: 'color 0.3s ease',
                }}
              >
                {isMobile ? "Email Us" : "dlksoftwaresolutions@gmail.com"}
              </Typography>
            </Stack>

            
          </Box>
        </Stack>

        {/* Right Section - CTA */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            animation: `${slideInRight} 0.5s ease-out`,
            display: { xs: "none", sm: "flex" },
          }}
        >
          {/* Free Career Counselling */}
          {!isMobile && (
            <CTABox onClick={() => navigate("/contact")}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ position: 'relative', zIndex: 2 }}>
                <VerifiedIcon sx={{ fontSize: 16, color: colors.secondary }} />
                <Typography
                  sx={{
                    color: colors.light,
                    fontSize: { xs: 10, md: 11.5 },
                    fontWeight: 800,
                    letterSpacing: '0.8px',
                    textTransform: 'uppercase',
                  }}
                >
                  Free Counselling
                </Typography>
                <LocalOfferIcon sx={{ fontSize: 14, color: colors.secondary }} />
              </Stack>
            </CTABox>
          )}

          {/* Quick Call Button */}
          <ContactChip
            icon={<CallIcon sx={{ fontSize: '18px !important' }} />}
            label={isMobile ? "Call" : "Call Now"}
            onClick={() => window.location.href = 'tel:+917708150152'}
            sx={{
              height: '36px',
              px: isMobile ? 0.5 : 1.5,
              '& .MuiChip-label': {
                fontSize: isMobile ? '0.75rem' : '0.85rem',
              },
              '&:hover': {
                background: colors.primary,
                '& .MuiChip-label, & .MuiChip-icon': {
                  color: colors.light,
                },
              },
            }}
          />
        </Stack>


      </Stack>

      {/* Decorative Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: '10%',
          width: '80%',
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${colors.light}, transparent)`,
        }}
      />
    </GlassBar>
  );
};

export default BottomInfo;