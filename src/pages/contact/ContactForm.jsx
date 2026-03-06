import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Box,
  Paper,
  Stack,
  Alert,
  Snackbar,
  CircularProgress,
  Fade,
  Zoom,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import { GetRequest, PostRequest } from "../../api/config";
import { ADMIN_POST_CONTACT } from "../../api/endpoints";

// Illustration URL
const illustrationUrl =
  "https://img.freepik.com/free-vector/flat-design-illustration-customer-support_23-2148889374.jpg?w=1060";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
  },
}));

const AnimatedIllustration = styled(Box)(() => ({
  animation: "float 3s ease-in-out infinite",
  "@keyframes float": {
    "0%": {
      transform: "translateY(0px)",
    },
    "50%": {
      transform: "translateY(-15px)",
    },
    "100%": {
      transform: "translateY(0px)",
    },
  },
}));

const FloatingElement = styled(Box)(() => ({
  position: "absolute",
  backgroundColor: "rgba(131, 165, 97, 0.1)", // Light green alpha
  borderRadius: "50%",
  animation: "pulse 2s ease-in-out infinite",
  "@keyframes pulse": {
    "0%": {
      transform: "scale(1)",
      opacity: 0.5,
    },
    "50%": {
      transform: "scale(1.1)",
      opacity: 0.8,
    },
    "100%": {
      transform: "scale(1)",
      opacity: 0.5,
    },
  },
}));

const IllustrationBox = ({ children }) => (
  <Box
    sx={{
      width: "100%",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
      background: "linear-gradient(135deg,  #90ea66 0%, #2e5737 100%)",
      p: { xs: 3, md: 6 },
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "relative",
      mb: { xs: 2, md: 0 } }}
  >
    <FloatingElement
      sx={{
        width: 150,
        height: 150,
        top: -30,
        left: -30 }}
    />
    <FloatingElement
      sx={{
        width: 100,
        height: 100,
        bottom: -20,
        right: -20,
        animationDelay: "1s" }}
    />
    <AnimatedIllustration>{children}</AnimatedIllustration>
    <Typography
      variant="caption"
      sx={{
        mt: 2,
        color: "#fff",
        fontWeight: 500,
        textShadow: "1px 1px 2px rgba(0,0,0,0.2)" }}
    >
      We're here to help! Contact us anytime.
    </Typography>
  </Box>
);

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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (formData.phone && !/^[0-9+\-\s()]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "You must accept the terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: "Please fix the errors in the form",
        severity: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await PostRequest(ADMIN_POST_CONTACT, formData);

      if (response?.success) {
        setSubmitSuccess(true);

        setSnackbar({
          open: true,
          message: response.message || "Message sent successfully!",
          severity: "success",
        });

        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: "",
          acceptTerms: true,
        });

        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        setSnackbar({
          open: true,
          message: response?.message || "Something went wrong",
          severity: "error",
        });
      }
    } catch (error) {
      console.error(error);

      setSnackbar({
        open: true,
        message: "Server error. Please try again.",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Zoom in={true} timeout={1000}>
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          fontWeight="bold"
          sx={{ mb: 1,  color: "#1a4718" }}
        >
          Contact <span style={{ color: "#83a561" }}>Us</span>
        </Typography>
      </Zoom>

      {/* Success Alert */}
      <Fade in={submitSuccess}>
        <Alert
          icon={<CheckCircleIcon fontSize="inherit" />}
          severity="success"
          sx={{
            mb: 1,
            maxWidth: "600px",
            mx: "auto",
            animation: "slideDown 0.5s ease-out",
            "@keyframes slideDown": {
              "0%": {
                transform: "translateY(-20px)",
                opacity: 0,
              },
              "100%": {
                transform: "translateY(0)",
                opacity: 1,
              },
            } }}
        >
          Thank you for contacting us! We'll respond within 24 hours.
        </Alert>
      </Fade>

      {/* Flex container */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          gap: { xs: 6, md: 4 } }}
      >
        {/* Illustration */}
        <Box sx={{ flex: { xs: "0 0 100%", md: "0 0 40%" } }}>
          <IllustrationBox>
            <Box
              component="img"
              src={illustrationUrl}
              alt="Customer service illustration"
              sx={{
                width: "100%",
                objectFit: "contain",
                maxHeight: { xs: "auto", md: "400px" },
                filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.2))" }}
            />
          </IllustrationBox>
        </Box>

        {/* Form */}
        <Box sx={{ flex: { xs: "0 0 100%", md: "0 0 55%" } }}>
          <StyledPaper elevation={3}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {/* First Name & Last Name */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    flexDirection: { xs: "column", sm: "row" } }}
                >
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    variant="outlined"
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    InputProps={{
                      startAdornment: (
                        <PersonIcon sx={{ mr: 1, color: "action.active" }} />
                      ) }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                          borderColor: "#48723e",
                        },
                      } }}
                  />
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    variant="outlined"
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    InputProps={{
                      startAdornment: (
                        <PersonIcon sx={{ mr: 1, color: "action.active" }} />
                      ) }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                          borderColor: "#48723e",
                        },
                      } }}
                  />
                </Box>

                {/* Email & Phone Number */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    flexDirection: { xs: "column", sm: "row" } }}
                >
                  <TextField
                    required
                    fullWidth
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    variant="outlined"
                    error={!!errors.email}
                    helperText={errors.email}
                    InputProps={{
                      startAdornment: (
                        <EmailIcon sx={{ mr: 1, color: "action.active" }} />
                      ) }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                          borderColor: "#48723e",
                        },
                      } }}
                  />
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    variant="outlined"
                    error={!!errors.phone}
                    helperText={errors.phone}
                    InputProps={{
                      startAdornment: (
                        <PhoneIcon sx={{ mr: 1, color: "action.active" }} />
                      ) }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                          borderColor: "#48723e",
                        },
                      } }}
                  />
                </Box>

                {/* Message */}
                <TextField
                  fullWidth
                  label="Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  variant="outlined"
                  error={!!errors.message}
                  helperText={errors.message}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#48723e",
                      },
                    } }}
                />

                {/* Terms Checkbox */}
                <FormControlLabel
                  control={
                    <Checkbox
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      color="primary"
                      sx={{
                        color: "#48723e",
                        
                        "&.Mui-checked": {
                          color: "#48723e",
                        } }}
                    />
                  }
                  label="I accept the Terms and Conditions"
                />
                {errors.acceptTerms && (
                  <Typography color="error" variant="caption" sx={{ mt: -1 }}>
                    {errors.acceptTerms}
                  </Typography>
                )}

                {/* Submit Button */}
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{
                      color: "white",
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: "600",
                      background: "#48723e",
                      minWidth: "200px",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background: "#000000ff",
                        color: "white",
                        transform: "translateY(-2px)",
                        boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
                      },
                      "&:disabled": {
                        background: "#cccccc",
                      } }}
                    size="large"
                    endIcon={
                      isSubmitting ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <SendIcon />
                      )
                    }
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </Box>
              </Stack>
            </form>
          </StyledPaper>
        </Box>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            boxShadow: 3 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
