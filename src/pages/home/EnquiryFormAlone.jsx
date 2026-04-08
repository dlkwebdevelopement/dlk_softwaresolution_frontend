import React, { useState, useRef } from "react";
import { Box, Typography, TextField, Button, alpha } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { PostRequest } from "../../api/api";
import { ADMIN_POST_ENQUIRIES } from "../../api/endpoints";
import SendIcon from '@mui/icons-material/Send';
import ReCAPTCHA from "react-google-recaptcha";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled Components
const GlassFormCard = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderRadius: '24px',
  border: '1px solid rgba(255, 255, 255, 0.5)',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05)',
  padding: theme.spacing(4),
  animation: `${fadeIn} 0.8s ease-out forwards`,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    '& fieldset': {
      borderColor: 'var(--green-light)',
    },
    '&:hover fieldset': {
      borderColor: 'var(--green-mid)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--green)',
      borderWidth: '2px',
    },
  },
  '& .MuiInputBase-input': {
    fontSize: '0.95rem',
  },
}));

export default function EnquiryFormAlone() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    course: "",
    location: "",
    timeslot: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  const recaptchaRef = useRef(null);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile") {
      const nums = value.replace(/[^0-9]/g, "");
      if (nums.length <= 10) {
        setFormData({ ...formData, [name]: nums });
      }
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleCaptchaChange = (value) => {
    setCaptchaToken(value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    const { name, email, mobile, course, location, timeslot } = formData;

    if (!name.trim()) {
      setError("Name is required");
      setLoading(false);
      return;
    }
    if (!email.trim() || !validateEmail(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }
    if (!mobile.trim() || mobile.length !== 10) {
      setError("Mobile number must be exactly 10 digits");
      setLoading(false);
      return;
    }
    if (!course || !location || !timeslot) {
      setError("Please fill all fields");
      setLoading(false);
      return;
    }
    if (!captchaToken) {
      setError("Please verify that you are not a robot");
      setLoading(false);
      return;
    }

    try {
      await PostRequest(ADMIN_POST_ENQUIRIES, { ...formData, captchaToken });
      setSuccess("Enquiry submitted successfully!");
      setFormData({
        name: "",
        email: "",
        mobile: "",
        course: "",
        location: "",
        timeslot: "",
      });
      setCaptchaToken(null);
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
    } catch (err) {
      setError("Failed to submit enquiry: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassFormCard>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{
          fontWeight: 600,
          color: "var(--green-deep)",
          fontSize: { xs: '1.6rem', md: '1.8rem' },
          mb: 1
        }}>
          Quick <span style={{ color: "var(--green)" }}>Enquiry</span>
        </Typography>
        <Typography sx={{ color: "text.secondary", fontSize: '0.9rem' }}>
          Intersted in our courses? Let us know!
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <StyledTextField
          fullWidth
          placeholder="Your Name *"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <StyledTextField
          fullWidth
          placeholder="Your Email Address *"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        <StyledTextField
          fullWidth
          placeholder="Mobile Number *"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
        />
        <StyledTextField
          fullWidth
          placeholder="Course of Interest *"
          name="course"
          value={formData.course}
          onChange={handleChange}
        />

        <Box sx={{ display: "flex", flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <StyledTextField
            fullWidth
            placeholder="Your Location *"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
          <StyledTextField
            fullWidth
            type="time"
            label="Preferred Call Time"
            InputLabelProps={{ shrink: true }}
            name="timeslot"
            value={formData.timeslot}
            onChange={handleChange}
          />
        </Box>

        {error && (
          <Typography color="error" sx={{
            fontSize: '0.8rem',
            fontWeight: 500,
            mt: 0.5
          }}>
            {error}
          </Typography>
        )}
        {success && (
          <Typography color="success.main" sx={{
            fontSize: '0.8rem',
            fontWeight: 500,
            mt: 0.5
          }}>
            {success}
          </Typography>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey="6Lc_DJAsAAAAADKYIf74PvRX5a5dUCy8GTxlxP5D"
            onChange={handleCaptchaChange}
          />
        </Box>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          endIcon={<SendIcon />}
          sx={{
            mt: 1,
            py: 1.8,
            fontSize: "1rem",
            fontWeight: 700,
            borderRadius: "12px",
            textTransform: "none",
            background: "linear-gradient(135deg, var(--green) 0%, var(--green-dark) 100%)",
            color: "white",
            boxShadow: '0 8px 16px var(--green-light)',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: "linear-gradient(135deg, var(--green-dark) 0%, var(--green-deep) 100%)",
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 24px var(--green-light)',
            },
            '&:active': {
              transform: 'translateY(0)',
            }
          }}
        >
          {loading ? "Submitting..." : "Get Started Now"}
        </Button>
      </Box>
    </GlassFormCard>
  );
}
