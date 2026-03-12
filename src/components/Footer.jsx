import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Link,
  Container,
  IconButton,
  Divider,
  Paper,
  alpha,
  Fade,
  Grow,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FavoriteIcon from "@mui/icons-material/Favorite";

// Animations
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(61, 184, 67, 0.4); }
  70% { box-shadow: 0 0 0 15px rgba(61, 184, 67, 0); }
  100% { box-shadow: 0 0 0 0 rgba(61, 184, 67, 0); }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const rotateGradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Color scheme
const colors = {
  primary: "#3DB843",
  secondary: "#c2eac4",
  dark: "#1a4718",
  light: "#ffffff",
  accent: "#D3F36B",
  text: {
    primary: "#111c12",
    secondary: "#2e9133",
    light: "#f8faf7",
  },
  background: {
    solid: "#111c12",
    glass: "rgba(255, 255, 255, 0.05)",
  }
};

// Styled Components
const GlassSection = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '30px',
  padding: theme.spacing(3),
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    animation: `${shimmer} 3s infinite`,
  },
}));

const NewsletterInput = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '50px',
    transition: 'all 0.3s ease',
    '& fieldset': {
      border: 'none',
    },
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
    },
    '&.Mui-focused': {
      boxShadow: `0 0 0 3px ${alpha(colors.primary, 0.3)}`,
    },
  },
  '& .MuiInputBase-input': {
    padding: '12px 18px',
    fontSize: '0.9rem',
  },
});

const NewsletterButton = styled(Button)({
  borderRadius: '50px',
  padding: '12px 28px',
  fontWeight: 700,
  textTransform: 'none',
  fontSize: '0.95rem',
  background: `linear-gradient(135deg, ${colors.dark}, ${colors.primary})`,
  color: colors.light,
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
    transition: 'left 0.5s ease',
  },
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: `0 15px 30px ${alpha(colors.dark, 0.3)}`,
    '&::before': {
      left: '100%',
    },
  },
  '&:active': {
    transform: 'translateY(0)',
  },
});

const SocialIconButton = styled(IconButton)({
  background: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: colors.primary,
    transform: 'translateY(-5px) scale(1.1)',
    boxShadow: `0 10px 20px ${alpha(colors.primary, 0.3)}`,
    '& svg': {
      color: colors.light,
    },
  },
  '& svg': {
    color: '#ffffff',
    fontSize: 24,
    transition: 'color 0.3s ease',
  },
});

const FooterLink = styled(Link)({
  textDecoration: 'none',
  color: 'rgba(255, 255, 255, 0.7)',
  fontSize: '0.95rem',
  transition: 'all 0.3s ease',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -2,
    left: 0,
    width: 0,
    height: '2px',
    background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
    transition: 'width 0.3s ease',
  },
  '&:hover': {
    color: colors.primary,
    transform: 'translateX(5px)',
    '&::after': {
      width: '100%',
    },
  },
});

const FooterColumn = ({ title, items, delay }) => (
  <Grow in={true} timeout={500 + delay} style={{ transformOrigin: '0 0' }}>
    <Box>
      <Typography
        sx={{
          fontSize: { xs: '0.95rem', md: '1.05rem' },
          fontWeight: 700,
          mb: 2.5,
          color: "#ffffff",
          position: 'relative',
          display: 'inline-block',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -8,
            left: 0,
            width: 40,
            height: 3,
            background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
            borderRadius: '3px',
          },
        }}
      >
        {title}
      </Typography>
      <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
        {items.map((item, index) => (
          <Box
            component="li"
            key={index}
            sx={{
              mb: { xs: "8px", md: "10px" },
              animation: `${slideInLeft} 0.3s ease-out ${delay + index * 50}ms both`,
            }}
          >
            <FooterLink href="#">
              <ArrowForwardIcon sx={{ fontSize: 14, opacity: 0.5 }} />
              {item}
            </FooterLink>
          </Box>
        ))}
      </Box>
    </Box>
  </Grow>
);

const ContactInfo = ({ icon: Icon, text, subtext }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: '12px',
        background: alpha(colors.primary, 0.1),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: colors.primary,
        transition: 'all 0.3s ease',
        '&:hover': {
          background: colors.primary,
          color: colors.light,
          transform: 'scale(1.1)',
        },
      }}
    >
      <Icon sx={{ fontSize: 20 }} />
    </Box>
    <Box>
      <Typography sx={{ color: "#ffffff", fontWeight: 600, fontSize: '0.95rem' }}>
        {text}
      </Typography>
      {subtext && (
        <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem' }}>
          {subtext}
        </Typography>
      )}
    </Box>
  </Box>
);

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        background: colors.background.solid,
        color: "#ffffff",
        pt: { xs: 3, md: 5 },
        pb: { xs: 8, md: 8 }, // Added extra padding for fixed BottomInfo overlap
        overflow: 'hidden',
      }}
    >
      {/* Background Decorations */}
      <Box
        sx={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '400px',
          height: '400px',
          background: `radial-gradient(circle, ${alpha(colors.secondary, 0.3)} 0%, transparent 70%)`,
          borderRadius: '50%',
          animation: `${floatAnimation} 15s ease-in-out infinite`,
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '500px',
          height: '500px',
          background: `radial-gradient(circle, ${alpha(colors.accent, 0.2)} 0%, transparent 70%)`,
          borderRadius: '50%',
          animation: `${floatAnimation} 20s ease-in-out infinite reverse`,
          pointerEvents: 'none',
        }}
      />

      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: 5 + i * 2,
            height: 5 + i * 2,
            borderRadius: '50%',
            background: alpha("#ffffff", 0.05),
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            filter: 'blur(2px)',
            animation: `${floatAnimation} ${15 + i * 2}s ease-in-out infinite`,
            pointerEvents: 'none',
          }}
        />
      ))}

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        {/* NEWSLETTER SECTION */}
        <Fade in={true} timeout={1000}>
          <GlassSection sx={{ mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 3,
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: "#ffffff",
                    mb: 0.5,
                    fontSize: { xs: '1.3rem', md: '1.6rem' },
                  }}
                >
                  Stay Updated!
                </Typography>
                <Typography
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: { xs: "14px", md: "16px" },
                    maxWidth: 400,
                  }}
                >
                  Subscribe to our newsletter for latest updates and exclusive offers
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  width: { xs: "100%", md: "auto" },
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                }}
              >
                <NewsletterInput
                  type="email"
                  placeholder="Enter your email address"
                  variant="outlined"
                  sx={{
                    width: { xs: "100%", sm: "300px" },
                  }}
                />
                <NewsletterButton
                  variant="contained"
                  endIcon={<SendIcon />}
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  Subscribe
                </NewsletterButton>
              </Box>
            </Box>
          </GlassSection>
        </Fade>

        {/* MAIN FOOTER CONTENT */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: { xs: 2, md: 3 },
            justifyContent: "space-between",
            flexDirection: { xs: "column", md: "row" },
            mb: 3,
          }}
        >
          {/* COMPANY INFO */}
          <Grow in={true} timeout={500}>
            <Box sx={{ maxWidth: { xs: "100%", md: "300px" } }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: "#ffffff",
                  mb: 1.5,
                  fontSize: '1.6rem',
                  background: `linear-gradient(135deg, #ffffff, var(--green-mid))`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                DLK
              </Typography>
              <Typography
                sx={{
                  color: "#ffffff",
                  mb: 3,
                  lineHeight: 1.7,
                  fontSize: '0.95rem',
                }}
              >
                Empowering careers through quality software training with industry experts and 100% placement assistance.
              </Typography>

              {/* Contact Info */}
              <Box sx={{ mt: 2 }}>
                <ContactInfo icon={LocationOnIcon} text="Chennai, Tamil Nadu" subtext="India" />
                <ContactInfo icon={PhoneIcon} text="+91 77081 50152" subtext="Mon-Sat, 9AM-8PM" />
                <ContactInfo icon={EmailIcon} text="dlksoftwaresolutions@gmail.com" subtext="Support 24/7" />
              </Box>
            </Box> 
          </Grow>

          {/* FOOTER COLUMNS */}
          <FooterColumn title="Explore" items={["Register", "Our News", "Contact Us", "Blog"]} delay={600} />
          <FooterColumn title="Top Courses" items={["AI & Machine Learning", "Web Development", "Java Programming", "Python", "AWS Cloud"]} delay={800} />
          <FooterColumn title="Important Links" items={["Help Center", "About Us", "Terms & Services", "Privacy Policy"]} delay={1000} />

          {/* SOCIAL & APP */}
          <Grow in={true} timeout={1200}>
            <Box>
              <Typography
                sx={{
                  fontSize: { xs: '0.95rem', md: '1.05rem' },
                  fontWeight: 700,
                  mb: 2.5,
                  color: "#ffffff",
                  position: 'relative',
                  display: 'inline-block',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: 40,
                    height: 3,
                    background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
                    borderRadius: '3px',
                  },
                }}
              >
                Connect With Us
              </Typography>

              <Stack direction="row" spacing="12px" sx={{ mb: 3 }}>
                {[
                  { icon: FacebookIcon, color: '#1877f2' },
                  { icon: TwitterIcon, color: '#1da1f2' },
                  { icon: InstagramIcon, color: '#e4405f' },
                  { icon: LinkedInIcon, color: '#0a66c2' },
                ].map((Social, index) => (
                  <SocialIconButton
                    key={index}
                    component="a"
                    href="#"
                    target="_blank"
                    sx={{
                      '&:hover': {
                        background: Social.color,
                      },
                    }}
                  >
                    <Social.icon />
                  </SocialIconButton>
                ))}
              </Stack>


            </Box>
          </Grow>
        </Box>

        {/* BOTTOM BAR */}
        <Fade in={true} timeout={1500}>
          <Box
            sx={{
              mt: 1,
              pt: 2,
              borderTop: `1px solid ${alpha(colors.primary, 0.2)}`,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              © {new Date().getFullYear()} DLK Technologies All rights reserved.
            </Typography>

            <Box sx={{ display: 'flex', gap: 3 }}>
              <Link
                href="#"
                sx={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'color 0.3s ease',
                  '&:hover': { color: 'var(--green)' },
                }}
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                sx={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'color 0.3s ease',
                  '&:hover': { color: 'var(--green)' },
                }}
              >
                Terms of Service
              </Link>
            </Box>

          </Box >
        </Fade >
      </Container >
    </Box >
  );
};

export default Footer;