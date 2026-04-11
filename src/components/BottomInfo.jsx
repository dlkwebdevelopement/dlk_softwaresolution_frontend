import { Box, Typography, Stack, useTheme, useMediaQuery, Chip, alpha } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled, keyframes } from "@mui/material/styles";

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
  },
  social: {
    facebook: "#1877F2",
    instagram: "#E4405F",
    linkedin: "#0A66C2",
    youtube: "#FF0000",
  }
};

// Styled Components
const GlassBar = styled(Box)(({ theme }) => ({
  position: "fixed",
  bottom: 0,
  left: 0,
  width: "100%",
  minHeight: "40px",
  height: "auto",
  background: 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderTop: `1px solid ${alpha(colors.primary, 0.1)}`,
  zIndex: 1400,
  display: "flex",
  alignItems: "center",
  boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.08)',
  padding: theme.spacing(1, 0),
  overflow: "visible",
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
  width: { xs: 28, sm: 34 },
  height: { xs: 28, sm: 34 },
  borderRadius: '50%',
  background: alpha(colors.primary, 0.1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
  '& i': {
    fontSize: 18,
    color: colors.primary,
    transition: 'all 0.3s ease',
  },
});

const SocialIconButton = styled(Box)(({ theme, socialcolor }) => ({
  width: 34,
  height: 34,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: alpha(socialcolor, 0.1),
  color: socialcolor,
  '& i': {
    fontSize: 18,
    transition: 'all 0.3s ease',
  },
  '&:hover': {
    transform: 'translateY(-3px) scale(1.1)',
    backgroundColor: socialcolor,
    '& i': {
      color: '#ffffff',
    },
    boxShadow: `0 4px 12px ${alpha(socialcolor, 0.4)}`,
  },
}));

const BottomInfo = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <GlassBar>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        spacing={{ xs: 1.5, sm: 0 }}
        sx={{ px: { xs: 1, sm: 2, md: 10 } }}
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
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              justifyContent: { xs: "center", md: "flex-start" },
              gap: { xs: 1, sm: 3, md: 5 },
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
                    '& i': { color: colors.light }
                  }
                }
              }}
              onClick={() => window.location.href = 'tel:+917708150152'}
            >
              <IconWrapper className="IconWrapper-root">
                <i className="bi bi-telephone-fill"></i>
              </IconWrapper>
              <AnimatedText
                sx={{
                  fontSize: { xs: '0.7rem', md: '0.85rem' },
                  fontWeight: 800,
                  whiteSpace: { xs: 'normal', sm: 'nowrap' },
                  textAlign: 'center',
                  color: colors.dark,
                  transition: 'color 0.3s ease',
                  lineHeight: 1.2
                }}
              >
                +91 77081 50152, +91 97518 00789, +91 79043 20834
              </AnimatedText>
            </Stack>

            <Box sx={{ display: { xs: 'none', sm: 'block' }, width: '1px', height: '24px', bgcolor: alpha(colors.primary, 0.1) }} />

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
                    '& i': { color: colors.light }
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
                <i className="bi bi-envelope-fill"></i>
              </IconWrapper>
              <Typography
                sx={{
                  color: colors.dark,
                  fontSize: { xs: '0.75rem', md: '0.9rem' },
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  opacity: 0.9,
                  transition: 'color 0.3s ease',
                }}
              >
                dlksoftwaresolutions@gmail.com
              </Typography>
            </Stack>
          </Box>
        </Stack>

        {/* Middle Section - Social Media Icons */}
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{
            animation: `${floatAnimation} 3s ease-in-out infinite`,
            px: 2,
            borderLeft: { sm: `1px solid ${alpha(colors.primary, 0.1)}` },
            borderRight: { sm: `1px solid ${alpha(colors.primary, 0.1)}` },
            mx: { xs: 0, sm: 2 },
            flexShrink: 0
          }}
        >
          <SocialIconButton
            component="a"
            href="https://www.facebook.com/profile.php?id=61569333069634"
            target="_blank"
            socialcolor={colors.social.facebook}
          >
            <i className="bi bi-facebook"></i>
          </SocialIconButton>

          <SocialIconButton
            component="a"
            href="https://www.instagram.com/dlk_softwaresolutions/"
            target="_blank"
            socialcolor={colors.social.instagram}
          >
            <i className="bi bi-instagram"></i>
          </SocialIconButton>

          <SocialIconButton
            component="a"
            href="https://www.linkedin.com/company/dlk-software-solutions/"
            target="_blank"
            socialcolor={colors.social.linkedin}
          >
            <i className="bi bi-linkedin"></i>
          </SocialIconButton>

          <SocialIconButton
            component="a"
            href="https://www.youtube.com/@StudentsLearningplatform2026"
            target="_blank"
            socialcolor={colors.social.youtube}
          >
            <i className="bi bi-youtube"></i>
          </SocialIconButton>
        </Stack>

        {/* Right Section - CTA */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            animation: `${slideInRight} 0.5s ease-out`,
            flexShrink: 0
          }}
        >
          {/* Free Career Counselling */}
          <CTABox onClick={() => navigate("/contact")}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ position: 'relative', zIndex: 2 }}>
              <i className="bi bi-patch-check-fill" style={{ fontSize: 20, color: colors.secondary }}></i>
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
              <i className="bi bi-tag-fill" style={{ fontSize: 18, color: colors.secondary }}></i>
            </Stack>
          </CTABox>

          {/* Quick Call Button */}
          <ContactChip
            icon={<i className="bi bi-telephone-forward-fill" style={{ fontSize: 20, marginRight: 4 }}></i>}
            label={isMobile ? "Call" : "Call Now"}
            onClick={() => window.location.href = 'tel:+917708150152'}
            sx={{
              height: '36px',
              px: 1.5,
              flexShrink: 0,
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