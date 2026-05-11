import React, { useState, useRef } from "react";
import { Box, Typography, TextField, Button, Container, alpha, Grid, Stack, MenuItem } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { PostRequest } from "../../api/api";
import { ADMIN_POST_ENQUIRIES } from "../../api/endpoints";
import SendIcon from '@mui/icons-material/Send';
import VerifiedIcon from '@mui/icons-material/Verified';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SpeedIcon from '@mui/icons-material/Speed';
import GroupIcon from '@mui/icons-material/Group';
import toast from "react-hot-toast";
import SuccessPopup from "../../components/SuccessPopup";
import ReCAPTCHA from "react-google-recaptcha";
import { RECAPTCHA_SITE_KEY } from "../../api/constants";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

// Styled Components
const GlassContainer = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderRadius: '30px',
  border: '1px solid rgba(255, 255, 255, 0.5)',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
  padding: theme.spacing(4),
  animation: `${fadeIn} 0.8s ease-out forwards`,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
    borderRadius: '20px',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: '16px',
    transition: 'all 0.3s ease',
    '& fieldset': {
      borderColor: 'rgba(61, 184, 67, 0.1)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(61, 184, 67, 0.3)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--green)',
      borderWidth: '2px',
    },
  },
  '& .MuiInputBase-input': {
    fontSize: '1rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.9rem',
    },
  },
}));

const InfoCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  animation: `${fadeIn} 0.8s ease-out 0.2s forwards`,
  opacity: 0,
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2, 1),
  },
}));

const FloatingBadge = styled(Box)({
  animation: `${float} 3s ease-in-out infinite`,
  display: 'inline-flex',
});

const FeatureItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  padding: theme.spacing(1.5),
  borderRadius: '16px',
  background: 'rgba(255, 255, 255, 0.5)',
  border: '1px solid var(--green-mid)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.8)',
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.05)',
    borderColor: 'var(--green)',
  },
}));

const ImageBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  minHeight: '400px',
  borderRadius: '30px',
  overflow: 'hidden',
  position: 'relative',
  border: '8px solid rgba(255, 255, 255, 0.5)',
  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
  // animation: `${float} 6s ease-in-out infinite`,
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  [theme.breakpoints.down('md')]: {
    minHeight: '300px',
    marginBottom: theme.spacing(4),
  },
}));

const locations = ["Vadapalani", "Porur", "Online"];
const timeslots = ["Morning", "Afternoon", "Evening"];

export default function QuickEnquiry() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    course: "",
    location: "Vadapalani",
    timeslot: "Morning",
  });

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const captchaRef = useRef(null);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    if(e) e.preventDefault();
    
    if (!captchaToken) {
      toast.error("Please complete the reCAPTCHA");
      return;
    }

    setLoading(true);

    const { name, email, mobile, course, location, timeslot } = formData;
    if (!name || !email || !mobile || !course || !location || !timeslot) {
      toast.error("Please fill all mandatory fields");
      setLoading(false);
      return;
    }



    try {
      await PostRequest(ADMIN_POST_ENQUIRIES, { 
        ...formData, 
        inquiryType: "Quick Enquiry" 
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      
      setFormData({
        name: "",
        email: "",
        mobile: "",
        course: "",
        location: "Vadapalani",
        timeslot: "Morning",
      });
      setCaptchaToken(null);
      if (captchaRef.current) captchaRef.current.reset();

    } catch (err) {
      toast.error("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      py: { xs: 8, md: 12 },
      background: 'linear-gradient(135deg, var(--green-pale) 0%, #ffffff 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <Box sx={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        bgcolor: alpha('#3DB843', 0.05),
        zIndex: 0
      }} />

      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
          
          {/* IMAGE & INFO SECTION */}
          <Grid size={{ xs: 12, md: 5 }}>
             <ImageBox>
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" alt="Students learning" />
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 100%)',
                  pointerEvents: 'none'
                }} />
                
                {/* Overlay Info */}
                <Box sx={{ position: 'absolute', bottom: 30, left: 30, color: 'white' }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>Transform Your Career</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Join 10,000+ successful graduates at DLK Academy.</Typography>
                </Box>
             </ImageBox>
          </Grid>

          {/* FORM SECTION */}
          <Grid size={{ xs: 12, md: 7 }}>
            <GlassContainer>
              <Box sx={{ mb: 4, textAlign: 'left' }}>
                <FloatingBadge>
                  <Box sx={{
                    bgcolor: alpha('#3DB843', 0.1),
                    p: '6px 16px',
                    borderRadius: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 2,
                    border: '1px solid var(--green-mid)'
                  }}>
                    <VerifiedIcon sx={{ color: 'var(--green-dark)', fontSize: 16 }} />
                    <Typography variant="caption" sx={{ color: 'var(--green-dark)', fontWeight: 800, letterSpacing: 1 }}>
                      QUICK ENQUIRY
                    </Typography>
                  </Box>
                </FloatingBadge>
                <Typography variant="h3" sx={{
                  fontWeight: 800,
                  color: "var(--dark)",
                  fontSize: { xs: '2rem', md: '2.8rem' },
                  lineHeight: 1.1,
                  mb: 2,
                  letterSpacing: '-0.02em'
                }}>
                  Get a <span style={{ color: "var(--green)" }}>Free Consultation</span> Today!
                </Typography>
                <Typography sx={{ color: "text.secondary", fontSize: '1.1rem', maxWidth: '500px' }}>
                  Fill the form below and let our experts guide you to your dream IT career.
                </Typography>
              </Box>

              <form onSubmit={handleSubmit}>
                <Stack spacing={2.5}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                       <StyledTextField
                         fullWidth
                         label="Your Full Name"
                         name="name"
                         value={formData.name}
                         onChange={handleChange}
                         required
                       />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                       <StyledTextField
                         fullWidth
                         label="Mobile Number"
                         name="mobile"
                         value={formData.mobile}
                         onChange={handleChange}
                         required
                       />
                    </Grid>
                  </Grid>

                  <StyledTextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                  <StyledTextField
                    fullWidth
                    label="Course of Interest"
                    placeholder="e.g. Full Stack Development, Data Science"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    required
                  />

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                       <StyledTextField
                         select
                         fullWidth
                         label="Preferred Location"
                         name="location"
                         value={formData.location}
                         onChange={handleChange}
                         required
                       >
                         {locations.map((loc) => (
                           <MenuItem key={loc} value={loc}>{loc}</MenuItem>
                         ))}
                       </StyledTextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                       <StyledTextField
                         select
                         fullWidth
                         label="Preferred Timeslot"
                         name="timeslot"
                         value={formData.timeslot}
                         onChange={handleChange}
                         required
                       >
                         {timeslots.map((slot) => (
                           <MenuItem key={slot} value={slot}>{slot}</MenuItem>
                         ))}
                       </StyledTextField>
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
                    <ReCAPTCHA
                      ref={captchaRef}
                      sitekey={RECAPTCHA_SITE_KEY}
                      onChange={(token) => setCaptchaToken(token)}
                    />
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    endIcon={loading ? null : <SendIcon />}
                    sx={{
                      py: 2,
                      fontSize: "1.1rem",
                      fontWeight: 800,
                      borderRadius: "16px",
                      textTransform: "none",
                      bgcolor: "var(--green)",
                      boxShadow: '0 10px 30px rgba(61, 184, 67, 0.3)',
                      "&:hover": { bgcolor: "var(--green-dark)", transform: 'translateY(-3px)' },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {loading ? "Processing..." : "Submit My Enquiry"}
                  </Button>
                </Stack>
              </form>
            </GlassContainer>
          </Grid>
        </Grid>
      </Container>
      <SuccessPopup open={showSuccess} onClose={() => setShowSuccess(false)} />
    </Box>
  );
}
