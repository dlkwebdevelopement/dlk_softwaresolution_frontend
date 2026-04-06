import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  Fade,
  Grow,
  Breadcrumbs,
  Link as MuiLink,
  alpha
} from "@mui/material";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import SecurityIcon from "@mui/icons-material/Security";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

// Colors consistent with the application theme
const colors = {
  primary: "#3DB843",
  secondary: "#c2eac4",
  dark: "#1a4718",
  light: "#ffffff",
  textPrimary: "#111c12",
  textSecondary: "#6b8f76",
  background: "#f8faf7",
};

const HeaderSection = styled(Box)({
  background: `linear-gradient(135deg, ${colors.dark} 0%, ${colors.primary} 100%)`,
  padding: "80px 0 60px 0",
  position: "relative",
  overflow: "hidden",
  color: colors.light,
});

const PolicyCard = styled(Paper)(({ theme }) => ({
  borderRadius: "24px",
  padding: theme.spacing(6),
  boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
  border: "1px solid rgba(61,184,67,0.1)",
  background: colors.light,
  position: "relative",
  transform: "translateY(-40px)",
  zIndex: 2,
}));

const SectionTitle = styled(Typography)({
  fontWeight: 700,
  fontSize: "1.4rem",
  color: colors.dark,
  marginTop: "32px",
  marginBottom: "16px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

const PrivacyPolicy = () => {
  return (
    <Box sx={{ bgcolor: colors.background, minHeight: "100vh" }}>
      {/* Header Section */}
      <HeaderSection>
        {/* Subtle Background Pattern */}
        <Box sx={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1,
          backgroundImage: "radial-gradient(#ffffff 2px, transparent 2px)",
          backgroundSize: "30px 30px"
        }} />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Fade in timeout={800}>
            <Box>
              <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" sx={{ color: "rgba(255,255,255,0.7)" }} />}
                aria-label="breadcrumb"
                sx={{ mb: 3 }}
              >
                <MuiLink component={Link} to="/" color="inherit" sx={{ opacity: 0.7, "&:hover": { opacity: 1 } }}>
                  Home
                </MuiLink>
                <Typography color="inherit">Privacy Policy</Typography>
              </Breadcrumbs>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <SecurityIcon sx={{ fontSize: 40, color: colors.secondary }} />
                <Typography variant="h3" sx={{ fontWeight: 800 }} color="white">
                  Privacy Policy
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.8)", maxWidth: 600, fontWeight: 400 }}>
                We are committed to protecting your personal information and your right to privacy.
              </Typography>
            </Box>
          </Fade>
        </Container>
      </HeaderSection>

      <Container maxWidth="lg">
        <Grow in timeout={1200}>
          <PolicyCard>
            <Typography variant="body1" sx={{ color: colors.textSecondary, mb: 4, fontSize: "1.1rem", lineHeight: 1.8 }}>
              Effective Date: <strong>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>
              <br /><br />
              At DLK Software Solutions, we take your privacy seriously. This privacy notice describes how we might collect, store, use, and/or share your information when you use our services, such as when you visit our website, enroll in a course, or communicate with us.
            </Typography>

            <Divider sx={{ my: 4 }} />

            <SectionTitle>
              <Box component="span" sx={{ color: colors.primary }}>1.</Box> Information We Collect
            </SectionTitle>
            <Typography variant="body1" sx={{ color: colors.textSecondary, lineHeight: 1.8, mb: 3 }}>
              We collect personal information that you voluntarily provide to us when you register on our website, express an interest in obtaining information about us or our products and services, or otherwise when you contact us. The personal information we collect may include:
              <br /><br />
              • <strong>Contact Data:</strong> Name, email address, phone number, and mailing address.<br />
              • <strong>Account Data:</strong> Usernames, passwords, and security questions.<br />
              • <strong>Educational Data:</strong> Academic background and course preferences.
            </Typography>

            <SectionTitle>
              <Box component="span" sx={{ color: colors.primary }}>2.</Box> How We Use Your Information
            </SectionTitle>
            <Typography variant="body1" sx={{ color: colors.textSecondary, lineHeight: 1.8, mb: 3 }}>
              We process your personal information for a variety of reasons, depending on how you interact with our services, including:
              <br /><br />
              • To facilitate account creation and authentication and otherwise manage user accounts.<br />
              • To deliver and facilitate delivery of services (such as our Live Classes and Courses) to the user.<br />
              • To respond to user inquiries/offer support to users.<br />
              • To send administrative information to you regarding updates, terms, and policies.
            </Typography>

            <SectionTitle>
              <Box component="span" sx={{ color: colors.primary }}>3.</Box> Log Files and Usage Data
            </SectionTitle>
            <Typography variant="body1" sx={{ color: colors.textSecondary, lineHeight: 1.8, mb: 3 }}>
              Like many businesses, we also collect information through cookies and similar technologies. This may include your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, and information about how and when you use our services.
            </Typography>

            <SectionTitle>
              <Box component="span" sx={{ color: colors.primary }}>4.</Box> Is Your Information Shared?
            </SectionTitle>
            <Typography variant="body1" sx={{ color: colors.textSecondary, lineHeight: 1.8, mb: 3 }}>
              We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We do not sell your personal information to third-party marketing or advertising networks.
            </Typography>

            <SectionTitle>
              <Box component="span" sx={{ color: colors.primary }}>5.</Box> Data Security
            </SectionTitle>
            <Typography variant="body1" sx={{ color: colors.textSecondary, lineHeight: 1.8, mb: 3 }}>
              We have implemented appropriate and reasonable technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards, no internet transmission is 100% secure.
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ bgcolor: alpha(colors.primary, 0.05), p: 4, borderRadius: "16px", mt: 4 }}>
              <Typography variant="h6" sx={{ color: colors.dark, fontWeight: 700, mb: 1 }}>
                Questions About This Policy?
              </Typography>
              <Typography variant="body1" sx={{ color: colors.textSecondary, mb: 2 }}>
                If you have questions or comments about this privacy policy, you may email us at:
              </Typography>
              <Typography variant="body1" sx={{ color: colors.primary, fontWeight: 700 }}>
                dlksoftwaresolutions@gmail.com
              </Typography>
            </Box>

          </PolicyCard>
        </Grow>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;
