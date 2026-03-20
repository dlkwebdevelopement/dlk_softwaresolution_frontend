import React, { useState } from "react";
import { Box, Typography, TextField, Button, Container, alpha } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { PostRequest } from "../../api/config";
import { ADMIN_POST_ENQUIRIES } from "../../api/endpoints";
import SendIcon from '@mui/icons-material/Send';
import InfoIcon from '@mui/icons-material/Info';
import VerifiedIcon from '@mui/icons-material/Verified';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SpeedIcon from '@mui/icons-material/Speed';
import GroupIcon from '@mui/icons-material/Group';

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

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(61, 184, 67, 0.4); }
  70% { box-shadow: 0 0 0 20px rgba(61, 184, 67, 0); }
  100% { box-shadow: 0 0 0 0 rgba(61, 184, 67, 0); }
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
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    '&fieldset': {
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

export default function QuickEnquiry() {
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    const { name, email, mobile, course, location, timeslot } = formData;
    if (!name || !email || !mobile || !course || !location || !timeslot) {
      setError("Please fill all fields");
      setLoading(false);
      return;
    }

    try {
      await PostRequest(ADMIN_POST_ENQUIRIES, formData);
      setSuccess("Enquiry submitted successfully!");
      setFormData({
        name: "",
        email: "",
        mobile: "",
        course: "",
        location: "",
        timeslot: "",
      });
    } catch (err) {
      setError("Failed to submit enquiry: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      width: "100%",
      background: 'linear-gradient(180deg, #f8faf7 0%, #ffffff 100%)',
      py: { xs: 4, md: 6 },
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Decorative Elements */}
      <Box sx={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(61,184,67,0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        zIndex: 0
      }} />

      <Container maxWidth="lg">
        <Box sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center"
        }}
        >
          {/* CONTENT SECTION */}
          <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
            <InfoCard>
              <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <FloatingBadge>
                  <Box sx={{
                    bgcolor: 'var(--green-light)',
                    p: '6px 16px',
                    borderRadius: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 2,
                    border: '1px solid var(--green-mid)'
                  }}>
                    <VerifiedIcon sx={{ color: 'var(--green-dark)', fontSize: 16 }} />
                    <Typography variant="caption" sx={{ color: 'var(--dark)', fontWeight: 800, letterSpacing: 0.5 }}>
                      WHY CHOOSE US?
                    </Typography>
                  </Box>
                </FloatingBadge>
                <Typography variant="h4" sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: "var(--dark)",
                  fontSize: { xs: '2rem', md: '2.8rem' },
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em'
                }}>
                  The Best <span style={{
                    background: 'linear-gradient(135deg, var(--green-dark) 0%, var(--green) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>Software Training</span> Academy
                </Typography>
                <Typography sx={{ color: "#4b5563", lineHeight: 1.8, fontSize: '1rem', fontWeight: 400, mb: 3 }}>
                  DLK is <strong>the Best Software Training Institute in Chennai</strong>, led by IT experts with 20+ years of experience and a track record of 100% placement guidance.
                </Typography>
              </Box>

              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2,
                mb: 3,
                textAlign: 'left'
              }}>
                <FeatureItem>
                  <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '12px',
                    bgcolor: 'var(--green-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--green-dark)'
                  }}>
                    <EmojiEventsIcon fontSize="small" />
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'var(--dark)' }}>
                    100% Placement
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.4 }}>
                    Real-world job opportunities with top MNC partners.
                  </Typography>
                </FeatureItem>

                <FeatureItem>
                  <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '12px',
                    bgcolor: 'var(--green-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--green-dark)'
                  }}>
                    <GroupIcon fontSize="small" />
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'var(--dark)' }}>
                    Expert Trainers
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.4 }}>
                    Learn from professionals with 20+ years of IT experience.
                  </Typography>
                </FeatureItem>

                <FeatureItem>
                  <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '12px',
                    bgcolor: 'var(--green-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--green-dark)'
                  }}>
                    <SpeedIcon fontSize="small" />
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'var(--dark)' }}>
                    70+ Technologies
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.4 }}>
                    Master the latest tools and tech and stay ahead.
                  </Typography>
                </FeatureItem>

                <FeatureItem>
                  <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '12px',
                    bgcolor: 'var(--green-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--green-dark)'
                  }}>
                    <VerifiedIcon fontSize="small" />
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'var(--dark)' }}>
                    Global Certification
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.4 }}>
                    Earn certificates recognized by global top companies.
                  </Typography>
                </FeatureItem>
              </Box>

              <Box sx={{
                p: 2,
                background: 'linear-gradient(135deg, var(--green-light) 0%, var(--green-pale) 100%)',
                borderRadius: '24px',
                border: '1px solid var(--green-mid)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                maxWidth: '450px',
                mx: 'auto'
              }}>
                <Box sx={{
                  minWidth: 50,
                  height: 50,
                  borderRadius: '15px',
                  bgcolor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                  color: 'var(--green)'
                }}>
                  <VerifiedIcon />
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'var(--dark)', lineHeight: 1.2 }}>
                    ISO 9001:2015 Certified
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Quality education matching international standards.
                  </Typography>
                </Box>
              </Box>
            </InfoCard>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
