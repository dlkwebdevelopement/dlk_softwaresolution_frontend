import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Box,
  Stack,
  Alert,
  Snackbar,
  CircularProgress,
  Fade,
  IconButton,
  Grid
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import { PostRequest } from "../../api/api";
import { ADMIN_POST_CONTACT } from "../../api/endpoints";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// Styled Components
const PageWrapper = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: "linear-gradient(180deg, #f8fdf8 0%, #ffffff 100%)",
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
  position: "relative",
  overflow: "hidden",
}));

const UnifiedCard = styled(Box)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(20px)",
  borderRadius: "40px",
  border: "1px solid rgba(61, 184, 67, 0.12)",
  boxShadow: "0 40px 100px -20px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "row",
  minHeight: "650px",
  overflow: "hidden",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    borderRadius: "32px",
  },
}));

const Sidebar = styled(Box)(({ theme }) => ({
  flex: "0 0 40%",
  background: "#c2eac4", // Light Green
  padding: theme.spacing(6, 4),
  color: "#121b13",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  backgroundImage: `radial-gradient(circle at 0% 0%, rgba(61, 184, 67, 0.1) 0%, transparent 50%), 
                    radial-gradient(circle at 100% 100%, rgba(61, 184, 67, 0.05) 0%, transparent 50%)`,
  [theme.breakpoints.down("md")]: {
    flex: "none",
    padding: theme.spacing(6, 4),
  },
}));

const FormSection = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(6, 8),
  background: "#ffffff",
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(6, 4),
  },
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: theme.spacing(3),
  marginBottom: theme.spacing(4),
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateX(8px)",
  },
}));

const IconBox = styled(Box)(({ theme }) => ({
  width: "56px",
  height: "56px",
  borderRadius: "18px",
  background: "rgba(61, 184, 67, 0.12)",
  border: "1px solid rgba(61, 184, 67, 0.2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#3DB843",
  flexShrink: 0,
  boxShadow: "0 8px 16px rgba(61, 184, 67, 0.1)",
}));

const LuxuryTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "18px",
    backgroundColor: "#fcfdfc",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    border: "1px solid rgba(0,0,0,0.03)",
    "& fieldset": {
      borderColor: "transparent",
    },
    "&:hover": {
      backgroundColor: "#f7fbf7",
      "& fieldset": {
        borderColor: "rgba(61, 184, 67, 0.2)",
      },
    },
    "&.Mui-focused": {
      backgroundColor: "#ffffff",
      boxShadow: "0 10px 40px -10px rgba(61, 184, 67, 0.15)",
      "& fieldset": {
        borderColor: "#3DB843",
        borderWidth: "1.5px",
      },
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.95rem",
    color: "#6b8f6d",
    "&.Mui-focused": {
      color: "#3DB843",
      fontWeight: 600,
    },
  },
}));

const PremiumButton = styled(Button)(({ theme }) => ({
  background: "#3DB843", // Vibrant Light Green
  color: "#ffffff",
  borderRadius: "20px",
  padding: "18px 40px",
  fontSize: "15px",
  fontWeight: 600,
  letterSpacing: "1px",
  textTransform: "uppercase",
  boxShadow: "0 15px 35px -10px rgba(61, 184, 67, 0.15)", // Lighter shadow
  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  "&:hover": {
    transform: "translateY(-5px) scale(1.01)",
    background: "#d0edd0", // Slightly darker on hover
    boxShadow: "0 20px 45px -12px rgba(61, 184, 67, 0.25)", // Lighter shadow on hover
  },
  "&:disabled": {
    background: "#e0eee0",
    color: "#a0b0a0",
  },
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.4)",
  border: "1px solid rgba(0, 0, 0, 0.05)",
  color: "#121b13",
  marginRight: theme.spacing(1.5),
  transition: "all 0.3s ease",
  "&:hover": {
    background: "#3DB843",
    borderColor: "#3DB843",
    transform: "translateY(-4px)",
    boxShadow: "0 8px 20px rgba(61, 184, 67, 0.3)",
  },
}));

export default function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is essential";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is essential";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) newErrors.email = "Valid professional email requested";
    if (formData.phone.trim() && formData.phone.length !== 10) newErrors.phone = "Phone number must be exactly 10 digits";
    if (!formData.message.trim()) newErrors.message = "Please share your message";
    if (!formData.acceptTerms) newErrors.acceptTerms = "Terms must be accepted";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    
    if (name === "phone") {
      const nums = value.replace(/[^0-9]/g, "");
      if (nums.length <= 10) {
        setFormData(prev => ({ ...prev, [name]: nums }));
      }
      return;
    }

    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const response = await PostRequest(ADMIN_POST_CONTACT, formData);
      if (response?.success) {
        setSubmitSuccess(true);
        setFormData({ firstName: "", lastName: "", email: "", phone: "", message: "", acceptTerms: true });
        setTimeout(() => setSubmitSuccess(false), 8000);
      } else {
        setSnackbar({ open: true, message: response?.message || "Transmission failed", severity: "error" });
      }
    } catch (error) {
      setSnackbar({ open: true, message: "Connection lost with server", severity: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      <Container maxWidth="lg" sx={{ animation: `${fadeIn} 1s ease-out` }}>
        
        {/* Unified Luxury Card */}
        <UnifiedCard>
          
          {/* Information Sidebar */}
          <Sidebar>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 600, mb: 1.5, letterSpacing: "-1.5px", fontSize: { xs: "2rem", md: "2.8rem" }, color: "#121b13" }}>
                Connect With <span style={{ color: "#3DB843" }}>Us.</span>
              </Typography>
              <Typography variant="body1" sx={{ color: "rgba(18,27,19,0.7)", fontSize: "16px", fontWeight: 400, mb: 4, maxWidth: "340px", lineHeight: 1.6 }}>
                Our team of digital architects is ready to bring your vision to absolute reality.
              </Typography>

              <Box>
                <InfoItem>
                  <IconBox><LocationOnIcon /></IconBox>
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: "#3DB843", fontWeight: 600, textTransform: "uppercase", fontSize: "11px", letterSpacing: "2px", mb: 0.5 }}>Headquarters</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, fontSize: "0.95rem" }}>Rahath Plaza, Vadapalani,<br/>Chennai - 600026</Typography>
                  </Box>
                </InfoItem>

                <InfoItem>
                  <IconBox><PhoneIcon /></IconBox>
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: "#3DB843", fontWeight: 600, textTransform: "uppercase", fontSize: "11px", letterSpacing: "2px", mb: 0.5 }}>Direct Line</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, fontSize: "0.95rem" }}>+91 77081 50152</Typography>
                  </Box>
                </InfoItem>

                <InfoItem>
                  <IconBox><EmailIcon /></IconBox>
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: "#3DB843", fontWeight: 600, textTransform: "uppercase", fontSize: "11px", letterSpacing: "2px", mb: 0.5 }}>Partnerships</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, fontSize: "0.95rem" }}>dlksoftwaresolutions@gmail.com</Typography>
                  </Box>
                </InfoItem>
              </Box>
            </Box>

            <Box>
              <Typography variant="overline" sx={{ color: "rgba(18,27,19,0.4)", fontWeight: 600, letterSpacing: "3px", mb: 2, display: "block" }}>Stay Social</Typography>
              <Stack direction="row">
                {[FacebookIcon, InstagramIcon, LinkedInIcon, TwitterIcon].map((Icon, i) => (
                  <SocialButton key={i} size="small"><Icon fontSize="small" /></SocialButton>
                ))}
              </Stack>
            </Box>
          </Sidebar>

          {/* Interaction FormSection */}
          <FormSection>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 600, color: "#111c12", mb: 1.5, letterSpacing: "-1px" }}>
                Send a Message
              </Typography>
              <Typography variant="body2" sx={{ color: "#6b8f6d", fontWeight: 600 }}>Fill out the form below and we'll reach back within 2 hours.</Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <LuxuryTextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      error={!!errors.firstName}
                      helperText={errors.firstName}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <LuxuryTextField
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      error={!!errors.lastName}
                      helperText={errors.lastName}
                    />
                  </Grid>
                </Grid>

                <LuxuryTextField
                  fullWidth
                  label="Professional Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                />

                <LuxuryTextField
                  fullWidth
                  label="Contact Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={!!errors.phone}
                  helperText={errors.phone}
                />

                <LuxuryTextField
                  fullWidth
                  label="Brief your requirement..."
                  name="message"
                  multiline
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  error={!!errors.message}
                  helperText={errors.message}
                />

                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleChange}
                        sx={{ color: "#3DB843", '&.Mui-checked': { color: "#3DB843" } }}
                      />
                    }
                    label={<Typography variant="body2" sx={{ color: "#6b8f6d", fontWeight: 600 }}>I agree to the privacy and cookie policy.</Typography>}
                  />
                  {errors.acceptTerms && (
                    <Typography color="error" sx={{ fontSize: "11px", mt: 0.5, fontWeight: 600, uppercase: true }}>{errors.acceptTerms}</Typography>
                  )}
                </Box>

                <PremiumButton
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isSubmitting}
                  endIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <SendIcon sx={{ fontSize: "18px" }} />}
                >
                  {isSubmitting ? "Initiating Protocol..." : "Submit Inquiry"}
                </PremiumButton>

                {/* Fade-in Success Alert */}
                <Fade in={submitSuccess}>
                  <Alert 
                    icon={<CheckCircleIcon fontSize="inherit" />} 
                    severity="success"
                    sx={{ 
                      borderRadius: "20px", 
                      background: "#e8f7e9", 
                      color: "#1a4718",
                      fontWeight: 600,
                      border: "1px solid rgba(61, 184, 67, 0.2)",
                      fontSize: "0.85rem"
                    }}
                  >
                    Successfully sent! check your inbox for our automated confirmation.
                  </Alert>
                </Fade>
              </Stack>
            </form>
          </FormSection>

        </UnifiedCard>

        {/* Floating Decorative Elements */}
        <Box sx={{ 
          position: "absolute", 
          zIndex: -1, 
          bottom: "-50px", 
          left: "5%", 
          width: "200px", 
          height: "200px", 
          border: "40px solid #f2fbf2", 
          borderRadius: "60px",
          transform: "rotate(25deg)"
        }} />

      </Container>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: "14px", fontWeight: 600 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageWrapper>
  );
}
