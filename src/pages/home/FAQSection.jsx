import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Chip,
  Paper,
  alpha,
  Fade,
  Zoom,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import { GetRequest } from "../../api/api";
import { ADMIN_GET_ALL_QUESTIONS } from "../../api/endpoints";

// Animations
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(61, 184, 67, 0.4); }
  70% { box-shadow: 0 0 0 20px rgba(61, 184, 67, 0); }
  100% { box-shadow: 0 0 0 0 rgba(61, 184, 67, 0); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const rotateGradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Color scheme
const colors = {
  primary: "#3DB843",
  secondary: "#D3F36B",
  dark: "#111c12",
  light: "#ffffff",
  accent: "#2e9133",
  grey: "#757575",
  background: {
    main: "#fbfdf3",
    light: "#ffffff",
    gradient: "linear-gradient(135deg, #fbfdf3 0%, #f0f5eb 100%)",
  }
};

// Styled Components
const GradientText = styled(Typography)({
  background: 'linear-gradient(135deg, #1f6b24, #3DB843)',
  backgroundSize: '200% 200%',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: `${rotateGradient} 3s ease infinite`,
});

const FloatingElement = styled(Box)({
  animation: `${floatAnimation} 3s ease-in-out infinite`,
});

const GlassAccordion = styled(Accordion)(({ theme, expanded }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '20px !important',
  overflow: 'hidden',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: expanded
    ? `0 20px 40px ${alpha(colors.primary, 0.2)}, 0 0 0 2px ${alpha(colors.secondary, 0.3)}`
    : `0 10px 30px ${alpha(colors.primary, 0.1)}`,
  '&:before': {
    display: 'none',
  },
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 25px 50px ${alpha(colors.primary, 0.2)}`,
    borderColor: alpha(colors.secondary, 0.3),
  },
  '& .MuiAccordionSummary-root': {
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: alpha(colors.secondary, 0.05),
    },
  },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  '& .MuiAccordionSummary-content': {
    margin: 0,
  },
  '& .MuiAccordionSummary-expandIconWrapper': {
    color: colors.primary,
    transition: 'all 0.3s ease',
    '&.Mui-expanded': {
      transform: 'rotate(180deg)',
      color: colors.secondary,
    },
  },
}));

const QuestionIcon = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: '12px',
  background: alpha(colors.secondary, 0.15),
  color: colors.primary,
  marginRight: 16,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: alpha(colors.primary, 0.2),
    transform: 'scale(1.1)',
  },
});

const AnswerBox = styled(Box)({
  padding: theme => theme.spacing(2, 0),
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1,
    background: `linear-gradient(90deg, transparent, ${alpha(colors.primary, 0.2)}, transparent)`,
  },
});

const CategoryChip = styled(Chip)({
  background: alpha(colors.secondary, 0.15),
  color: colors.primary,
  fontWeight: 600,
  fontSize: '0.9rem',
  padding: '4px 8px',
  borderRadius: '30px',
  border: `1px solid ${alpha(colors.primary, 0.2)}`,
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  '& .MuiChip-icon': {
    color: colors.primary,
  },
});

const BackgroundOrb = styled(Box)(({ size, top, right, color }) => ({
  position: 'absolute',
  width: size,
  height: size,
  borderRadius: '50%',
  background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
  top,
  right,
  filter: 'blur(60px)',
  animation: `${floatAnimation} ${15 + Math.random() * 10}s ease-in-out infinite`,
  pointerEvents: 'none',
  zIndex: 0,
}));

// Loading Skeleton
const SkeletonAccordion = () => (
  <Box sx={{ mb: 2 }}>
    <Box sx={{
      height: 70,
      borderRadius: '20px',
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      backgroundSize: '200% 100%',
      animation: `${shimmer} 1.5s infinite`,
    }} />
  </Box>
);

export default function FAQSection() {
  const [qa, setQa] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await GetRequest(ADMIN_GET_ALL_QUESTIONS);
        setQa(data);
      } catch (err) {
        console.error("Failed to fetch Question and answers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: colors.background.gradient,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Orbs */}
      <BackgroundOrb size="600px" top="-20%" right="-10%" color="rgba(61, 184, 67, 0.1)" />
      <BackgroundOrb size="500px" bottom="-10%" left="-10%" color="rgba(211, 243, 107, 0.1)" />

      {/* Floating Particles */}
      {[...Array(10)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: 5 + i * 3,
            height: 5 + i * 3,
            borderRadius: '50%',
            background: alpha(colors.secondary, 0.1),
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            filter: 'blur(2px)',
            animation: `${floatAnimation} ${15 + i * 2}s ease-in-out infinite`,
            pointerEvents: 'none',
          }}
        />
      ))}

      <Container maxWidth="lg">
        <Box
          sx={{
            maxWidth: "900px",
            mx: "auto",
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* HEADER */}
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Chip
                label="FAQ"
                icon={<LiveHelpIcon sx={{ color: 'var(--green-dark) !important' }} />}
                sx={{
                  bgcolor: 'var(--green-light)',
                  color: 'var(--green-dark)',
                  border: '1px solid var(--green-mid)',
                  fontWeight: 800,
                  letterSpacing: 1,
                  '& .MuiChip-label': { px: 2 }
                }}
              />
            </Box>

            <Typography
              variant="h2"
              sx={{
                fontWeight: 600,
                mb: 2,
                fontSize: 'clamp(1.7rem, 3.2vw, 2.5rem)',
                color: 'var(--green-dark)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1
              }}
            >
              <Box component="span" sx={{ color: 'black' }}>Frequently Asked</Box>{' '}
              Questions
            </Typography>

            <Typography
              sx={{
                color: '#6b8f76',
                fontSize: '1.1rem',
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Everything you need to know before getting started with our courses
            </Typography>


          </Box>

          {/* FAQ LIST */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {loading ? (
              // Loading State
              [...Array(5)].map((_, i) => (
                <SkeletonAccordion key={i} />
              ))
            ) : (
              // FAQ Items
              qa.map((item, i) => item && (
                <Fade in={true} timeout={500 + i * 100} key={i}>
                  <Box>
                    <GlassAccordion
                      expanded={expanded === i}
                      onChange={handleChange(i)}
                      disableGutters
                      elevation={0}
                    >
                      <StyledAccordionSummary
                        expandIcon={
                          <ExpandMoreIcon sx={{
                            fontSize: 28,
                            color: expanded === i ? colors.secondary : colors.primary,
                            transition: 'transform 0.3s ease',
                          }} />
                        }
                        aria-controls={`panel${i}-content`}
                        id={`panel${i}-header`}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <QuestionIcon>
                            <HelpOutlineIcon sx={{ fontSize: 20 }} />
                          </QuestionIcon>
                          <Typography
                            sx={{
                              fontWeight: 700,
                              fontSize: { xs: '15px', md: '16px' },
                              color: expanded === i ? colors.primary : colors.dark,
                              transition: 'color 0.3s ease',
                              flex: 1,
                            }}
                          >
                            {item.question}
                          </Typography>

                          {/* Category Tag */}
                          {i === 0 && (
                            <Chip
                              label="Popular"
                              size="small"
                              sx={{
                                ml: 2,
                                bgcolor: 'rgba(0, 0, 0, 0.05)',
                                color: 'black',
                                border: '1px solid rgba(0, 0, 0, 0.1)',
                                fontWeight: 700,
                                fontSize: '0.7rem',
                                height: 24,
                                display: { xs: 'none', sm: 'flex' },
                              }}
                            />
                          )}
                        </Box>
                      </StyledAccordionSummary>

                      <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                        <AnswerBox>
                          <Box
                            sx={{
                              display: 'flex',
                              gap: 2,
                            }}
                          >
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                bgcolor: colors.secondary,
                                mt: 1.5,
                                shrink: 0
                              }}
                            />
                            <Typography
                              sx={{
                                color: alpha(colors.dark, 0.7),
                                lineHeight: 1.8,
                                fontSize: '0.95rem',
                                flex: 1,
                                whiteSpace: 'pre-wrap'
                              }}
                            >
                              {item.answer || "No answer provided yet."}
                            </Typography>
                          </Box>
                        </AnswerBox>

                        {/* Helpful Section */}
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mt: 3,
                            pt: 2,
                            borderTop: `1px solid ${alpha(colors.primary, 0.1)}`,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ color: alpha(colors.dark, 0.5) }}
                          >
                            Was this helpful?
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Chip
                              label="Yes"
                              size="small"
                              onClick={() => console.log('Helpful clicked')}
                              sx={{
                                bgcolor: alpha(colors.secondary, 0.1),
                                color: colors.primary,
                                '&:hover': {
                                  bgcolor: alpha(colors.secondary, 0.3),
                                },
                              }}
                            />
                            <Chip
                              label="No"
                              size="small"
                              onClick={() => console.log('Not helpful clicked')}
                              sx={{
                                bgcolor: alpha(colors.grey, 0.1),
                                color: alpha(colors.dark, 0.6),
                                '&:hover': {
                                  bgcolor: alpha(colors.grey, 0.3),
                                },
                              }}
                            />
                          </Box>
                        </Box>
                      </AccordionDetails>
                    </GlassAccordion>
                  </Box>
                </Fade>
              ))
            )}
          </Box>

          {/* Still Have Questions */}
          {!loading && qa.length > 0 && (
            <Fade in={true} timeout={1000}>
              <Paper
                elevation={0}
                sx={{
                  mt: 6,
                  p: 4,
                  textAlign: 'center',
                  background: alpha(colors.secondary, 0.1),
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  borderRadius: '30px',
                  border: `1px solid ${alpha(colors.primary, 0.1)}`,
                }}
              >
                <FloatingElement>
                  <ContactSupportIcon sx={{ fontSize: 48, color: colors.primary, mb: 2 }} />
                </FloatingElement>

                <Typography variant="h5" sx={{ fontWeight: 700, color: colors.dark, mb: 1 }}>
                  Still have questions?
                </Typography>

                <Typography sx={{ color: alpha(colors.dark, 0.7), mb: 3 }}>
                  Can't find the answer you're looking for? Please chat with our friendly team.
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                  <Chip
                    label="Contact Support"
                    icon={<QuestionAnswerIcon />}
                    onClick={() => window.location.href = '/contact'}
                    sx={{
                      bgcolor: colors.primary,
                      color: 'white',
                      fontWeight: 600,
                      px: 2,
                      py: 2.5,
                      '&:hover': {
                        bgcolor: colors.dark,
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  />
                </Box>
              </Paper>
            </Fade>
          )}
        </Box>
      </Container>
    </Box>
  );
}
