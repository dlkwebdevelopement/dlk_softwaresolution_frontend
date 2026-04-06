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
import GavelIcon from "@mui/icons-material/Gavel";
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

const TermsOfService = () => {
  return (
    <Box sx={{ bgcolor: colors.background, minHeight: "100vh" }}>
      {/* Header Section */}
      <HeaderSection>
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
                <Typography color="inherit">Terms of Service</Typography>
              </Breadcrumbs>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <GavelIcon sx={{ fontSize: 40, color: colors.secondary }} />
                <Typography variant="h3" sx={{ fontWeight: 800 }} color="white">
                  Terms of Service
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.8)", maxWidth: 600, fontWeight: 400 }}>
                Please read these terms carefully before using our platform.
              </Typography>
            </Box>
          </Fade>
        </Container>
      </HeaderSection>

      <Container maxWidth="lg">
        <Grow in timeout={1200}>
          <PolicyCard>
            <Typography variant="body1" sx={{ color: colors.textSecondary, mb: 4, fontSize: "1.1rem", lineHeight: 1.8 }}>
              Last Updated: <strong>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>
              <br /><br />
              Welcome to DLK Software Solutions! These Terms of Service ("Terms") frame the rules and regulations for the use of our website and offline services. By accessing this web platform or enrolling in our programs, we assume you accept these terms and conditions in full.
            </Typography>

            <Divider sx={{ my: 4 }} />

            <SectionTitle>
              <Box component="span" sx={{ color: colors.primary }}>1.</Box> Intellectual Property
            </SectionTitle>
            <Typography variant="body1" sx={{ color: colors.textSecondary, lineHeight: 1.8, mb: 3 }}>
              Unless otherwise stated, DLK Software Solutions and/or its licensors own the intellectual property rights for all material on the platform. All intellectual property rights are reserved. You may view and/or print pages from our website for your personal use subject to restrictions set in these terms and conditions.
            </Typography>

            <SectionTitle>
              <Box component="span" sx={{ color: colors.primary }}>2.</Box> User Accounts
            </SectionTitle>
            <Typography variant="body1" sx={{ color: colors.textSecondary, lineHeight: 1.8, mb: 3 }}>
              When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account. You are responsible for safeguarding the password that you use to access our services.
            </Typography>

            <SectionTitle>
              <Box component="span" sx={{ color: colors.primary }}>3.</Box> Course Enrollment and Payments
            </SectionTitle>
            <Typography variant="body1" sx={{ color: colors.textSecondary, lineHeight: 1.8, mb: 3 }}>
              • All fees must be paid in full prior to the commencement of the course or service, unless an installment plan is agreed upon.<br />
              • Fees paid are strictly <strong>non-refundable</strong> unless a course is cancelled entirely by DLK Software Solutions.<br />
              • Enrollment is non-transferable to other individuals without prior written consent from management.
            </Typography>

            <SectionTitle>
              <Box component="span" sx={{ color: colors.primary }}>4.</Box> Student Conduct
            </SectionTitle>
            <Typography variant="body1" sx={{ color: colors.textSecondary, lineHeight: 1.8, mb: 3 }}>
              Students are expected to maintain professional conduct during both online and offline sessions. Harassment, unauthorized distribution of course materials, or any activity that disrupts the learning environment will result in immediate expulsion without a refund.
            </Typography>

            <SectionTitle>
              <Box component="span" sx={{ color: colors.primary }}>5.</Box> Limitation of Liability
            </SectionTitle>
            <Typography variant="body1" sx={{ color: colors.textSecondary, lineHeight: 1.8, mb: 3 }}>
              In no event shall DLK Software Solutions, nor any of its officers, directors, or instructional staff, be liable to you for anything arising out of or in any way connected with your use of this Website. We shall not be held liable for any indirect, consequential, or special liability arising out of or in any way related to your use of this Website.
            </Typography>

            <SectionTitle>
              <Box component="span" sx={{ color: colors.primary }}>6.</Box> Changes to Terms
            </SectionTitle>
            <Typography variant="body1" sx={{ color: colors.textSecondary, lineHeight: 1.8, mb: 3 }}>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ bgcolor: alpha(colors.primary, 0.05), p: 4, borderRadius: "16px", mt: 4 }}>
              <Typography variant="h6" sx={{ color: colors.dark, fontWeight: 700, mb: 1 }}>
                Contact Us
              </Typography>
              <Typography variant="body1" sx={{ color: colors.textSecondary, mb: 2 }}>
                If you have any questions about these Terms, please contact us.
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

export default TermsOfService;
