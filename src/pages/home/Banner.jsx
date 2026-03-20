import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Button, Container, Paper, Chip, Avatar } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { ADMIN_GET_BANNERS } from "../../api/endpoints";
import { GetRequest } from "../../api/config";
import { useNavigate } from "react-router-dom";
import { BASE_URL, getImgUrl } from "../../api/api";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import VerifiedIcon from '@mui/icons-material/Verified';
import StarIcon from '@mui/icons-material/Star';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CloseIcon from "@mui/icons-material/Close";
import { Dialog, DialogContent, IconButton } from "@mui/material";
import EnquiryFormAlone from "./EnquiryFormAlone";

// Animations
const floatAnimation = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-15px) rotate(1deg); }
  66% { transform: translateY(10px) rotate(-1deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-80px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(80px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
`;

const textShimmer = keyframes`
  0% { background-position: -200% 50%; }
  100% { background-position: 200% 50%; }
`;

const rotateGradient = keyframes`
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.1); }
  100% { transform: rotate(360deg) scale(1); }
`;

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(61, 184, 67, 0.4); }
  70% { box-shadow: 0 0 0 20px rgba(61, 184, 67, 0); }
  100% { box-shadow: 0 0 0 0 rgba(61, 184, 67, 0); }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const marquee = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`;

// Styled components
const AnimatedGradientText = styled(Typography)({
  background: 'linear-gradient(135deg, #2e9133 0%, #3DB843 50%, #2e9133 100%)',
  backgroundSize: '200% auto',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: `${textShimmer} 4s linear infinite`,
});

const GlassCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.4)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(26, 71, 24, 0.1)',
  borderRadius: '40px',
  padding: theme.spacing(3),
  boxShadow: '0 25px 50px -12px rgba(26, 71, 24, 0.15)',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
    animation: `${shimmer} 3s infinite`,
  },
}));

const FloatingImage = styled(Box)({
  filter: 'drop-shadow(0 30px 40px rgba(0, 0, 0, 0.3))',
});

const NavigationArrow = styled(({ $direction, ...other }) => <Box {...other} />)(({ $direction }) => ({
  position: 'absolute',
  top: '50%',
  [$direction]: 30,
  transform: 'translateY(-50%)',
  width: 56,
  height: 56,
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  zIndex: 10,
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  color: '#ffffff',
  '&:hover': {
    background: 'rgba(61, 184, 67, 0.2)',
    borderColor: '#3DB843',
    transform: 'translateY(-50%) scale(1.15)',
    boxShadow: '0 10px 40px rgba(61, 184, 67, 0.2)',
  },
}));

const SlideContent = styled(({ $isActive, ...other }) => <Box {...other} />)(({ $isActive }) => ({
  opacity: 0,
  overflow: 'hidden',
  animation: $isActive
    ? `${slideInLeft} 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards`
    : "none",
}));

const SlideImage = styled(({ $isActive, ...other }) => <Box {...other} />)(({ $isActive }) => ({
  opacity: 0,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  animation: $isActive
    ? `${slideInRight} 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards`
    : "none",
}));

const DotIndicator = styled(({ $active, ...other }) => <Box {...other} />)(({ $active }) => ({
  width: $active ? 32 : 12,
  height: 12,
  borderRadius: '24px',
  background: $active
    ? 'linear-gradient(135deg, #3DB843, #2e9133)'
    : 'rgba(255, 255, 255, 0.2)',
  cursor: 'pointer',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  border: '2px solid rgba(255, 255, 255, 0.5)',
  boxShadow: $active ? '0 0 30px rgba(61, 184, 67, 0.4)' : 'none',
}));

// Removed BackgroundGlow to optimize performance

const FloatingParticle = styled(({ $delay, $size, $top, $left, ...other }) => <Box {...other} />)(({ $delay, $size, $top, $left }) => ({
  position: 'absolute',
  width: $size,
  height: $size,
  borderRadius: '50%',
  background: `rgba(61, 184, 67, ${0.05 + Math.random() * 0.1})`,
  top: $top,
  left: $left,
  filter: 'blur(8px)',
  animation: `${floatAnimation} ${15 + Math.random() * 10}s ease-in-out infinite`,
  animationDelay: `${$delay}s`,
  pointerEvents: 'none',
}));

const Badge = styled(Box)({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  background: 'rgba(26, 71, 24, 0.05)',
  backdropFilter: 'blur(12px)',
  padding: '8px 20px',
  borderRadius: '50px',
  border: '1px solid rgba(26, 71, 24, 0.1)',
  marginBottom: '20px',
});

const FeatureChip = styled(Chip)({
  background: 'rgba(61, 184, 67, 0.1)',
  border: '1px solid rgba(61, 184, 67, 0.3)',
  color: '#2e9133',
  fontWeight: 600,
  borderRadius: '30px',
  padding: '10px 5px',
  '& .MuiChip-icon': {
    color: '#2e9133',
  },
});

// New Redesign Styled Components
const EyebrowBox = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  background: '#e8f7e9',
  border: '1px solid #c2eac4',
  borderRadius: '100px',
  padding: '5px 5px 5px 5px',
  fontSize: '0.75rem',
  marginTop: '10px',
  fontWeight: 700,
  color: '#2e9133',
  letterSpacing: '0.04em',
  marginBottom: '10px',
  textTransform: 'uppercase',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.6rem',
    padding: '4px 10px',
  }
}));

const EyebrowPill = styled('span')({
  background: '#3DB843',
  color: 'white',
  fontSize: '0.65rem',
  padding: '2px 8px',
  borderRadius: '100px',
  fontWeight: 800,
});

const MainHeading = styled(Typography)(({ theme }) => ({
  fontFamily: '"Poppins", sans-serif',
  fontSize: 'clamp(1.5rem, 2.8vw, 2.3rem)',
  fontWeight: 600,
  lineHeight: 1.2,
  letterSpacing: '-0.01em',
  color: '#111c12',
  marginBottom: '16px',
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.4rem',
  }
}));

const UnderlineAccent = styled('span')({
  display: 'inline-block',
  position: 'relative',
  zIndex: 1,
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '4px',
    left: 0,
    right: 0,
    height: '8px',
    background: '#c2eac4',
    borderRadius: '2px',
    zIndex: -1,
  }
});

const TextAccent = styled('span')({
  color: '#3DB843',
  position: 'relative',
});

const HeroSub = styled(Typography)({
  fontSize: '0.9rem',
  lineHeight: 1.6,
  fontWeight: 300, // Reduced to light for better contrast
  color: '#6b8f76',
  opacity: 1,
  maxWidth: '480px',
  marginBottom: '20px',
});



const AvatarContainer = styled(Box)({
  display: 'flex',
});

const AvatarCircle = styled(Box)(({ $bg }) => ({
  width: '34px',
  height: '34px',
  borderRadius: '50%',
  border: '2.5px solid white',
  fontSize: '0.7rem',
  fontWeight: 700,
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: '-10px',
  background: $bg,
  '&:first-of-type': {
    marginLeft: 0,
  }
}));

const TrustText = styled(Box)({
  fontSize: '0.8rem',
  color: '#1a2b1b',
  lineHeight: 1.5,
  '& strong': {
    color: '#111c12',
    fontWeight: 700,
  }
});

const StarRating = styled(Box)({
  color: '#f5c842',
  fontSize: '0.75rem',
});

export default function Banner() {
  const [index, setIndex] = useState(0);
  const [transition, setTransition] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const navigate = useNavigate();
  const sliderRef = useRef();
  const [list, setList] = useState([]);
  const loopSlides = list.length > 0 ? [...list, list[0]] : [];

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await GetRequest(ADMIN_GET_BANNERS);
        setList(data);
      } catch (err) {
        console.error("Failed to fetch banners:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Auto-open Enquiry Popup after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setEnquiryOpen(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let timer;
    if (!isHovering && list.length > 1) {
      timer = setInterval(() => {
        handleNext();
      }, 5000); // 5s for smoother experience
    }
    return () => clearInterval(timer);
  }, [index, isHovering, list.length]);

  useEffect(() => {
    if (index === list.length) {
      setTimeout(() => {
        setTransition(false);
        setIndex(0);
      }, 800);
    } else {
      setTransition(true);
    }
  }, [index, list.length]);

  const handlePrevious = () => {
    setIndex((prev) => (prev === 0 ? list.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => prev + 1);
  };

  const handleDotClick = (i) => {
    setIndex(i);
  };

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "85vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: '#c2eac4',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              border: '3px solid rgba(61, 184, 67, 0.2)',
              borderTopColor: '#3DB843',
              animation: 'spin 1s linear infinite',
              mb: 3,
              mx: 'auto',
            }}
          />
          <Typography variant="h4" sx={{ color: '#2e9133', fontWeight: 300, letterSpacing: 2 }}>
            Loading Experience
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!list.length) return null;

  const currentSlide = list[index % list.length];

  return (
    <Box
      sx={{
        width: "100%",
        marginTop: { xs: "80px", md: "80px" },
        height: { xs: "auto", md: "80vh" },
        minHeight: { xs: "600px", md: "560px" },
        overflow: "hidden",
        position: "relative",
        background: '#c2eac4',
        pb: '50px', // Added padding to prevent ticker overlap
        maxWidth: "100vw",
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Floating Particles kept for subtle effect */}

      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <FloatingParticle
          key={i}
          $size={20 + i * 10}
          $delay={i * 0.5}
          $top={`${Math.random() * 100}%`}
          $left={`${Math.random() * 100}%`}
        />
      ))}





      {/* Navigation Arrows - Only show if multiple slides */}
      {list.length > 1 && isHovering && (
        <>
          <NavigationArrow $direction="left" onClick={handlePrevious}>
            <ChevronLeftIcon sx={{ fontSize: 32 }} />
          </NavigationArrow>
          <NavigationArrow $direction="right" onClick={handleNext}>
            <ChevronRightIcon sx={{ fontSize: 32 }} />
          </NavigationArrow>
        </>
      )}

      {/* SLIDER */}
      <Box
        ref={sliderRef}
        sx={{
          display: "flex",
          width: `${loopSlides.length * 100}%`,
          transform: `translateX(-${index * (100 / loopSlides.length)}%)`,
          transition: transition ? "transform 1s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
          height: "100%",
          position: 'relative',
          zIndex: 1,
        }}
      >
        {loopSlides.map((slide, i) => {
          const isActive = i === index;
          return (
            <Box
              key={i}
              sx={{
                width: `${100 / loopSlides.length}%`,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                position: 'relative',
              }}
            >
              <Container
                maxWidth="xl"
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    gap: { xs: 4, md: 10 },
                    width: '100%',
                    height: '100%',
                    alignItems: 'stretch', // Changed from center to stretch
                  }}
                >
                  {/* Text Content */}
                  <SlideContent
                    $isActive={isActive}
                  >
                    {/* New Redesign Layout */}
                    <EyebrowBox>
                      <EyebrowPill>{slide.tagline || "Chennai #1"}</EyebrowPill>
                      IT Training & Placement Institute
                    </EyebrowBox>

                    <MainHeading variant="h1">
                      {slide.title}<br /><br />
                      <UnderlineAccent>{slide.highlight}</UnderlineAccent><br />
                      <TextAccent>{slide.subtitle}</TextAccent>
                    </MainHeading>

                    <HeroSub>
                      {slide.description}
                    </HeroSub>

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', mb: 4 }}>
                      <Button
                        variant="contained"
                        onClick={() => setEnquiryOpen(true)}
                        sx={{
                          background: '#3DB843',
                          color: 'white',
                          px: 4,
                          py: 1.5,
                          borderRadius: '100px',
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          textTransform: 'none',
                          fontFamily: 'inherit',
                          '&:hover': {
                            background: '#2e9133',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 12px 32px rgba(61,184,67,0.35)',
                          },
                          transition: 'all 0.25s',
                        }}
                      >
                        {slide.button || "Enroll Now — It's Free"} →
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => {/* Watch how it works */ }}
                        sx={{
                          borderColor: '#c2eac4',
                          color: '#111c12',
                          px: 4,
                          py: 1.5,
                          borderRadius: '100px',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          textTransform: 'none',
                          fontFamily: 'inherit',
                          '&:hover': {
                            borderColor: '#3DB843',
                            color: '#3DB843',
                            background: 'transparent',
                          },
                          transition: 'all 0.2s',
                        }}
                      >
                        ▶ Watch How It Works
                      </Button>
                    </Box>








                  </SlideContent>

                  {/* Image Container - Hidden on mobile */}
                  <SlideImage
                    $isActive={isActive}
                    sx={{
                      display: { xs: 'none', md: 'flex' }
                    }}
                  >
                    <FloatingImage>
                      <Box
                        sx={{
                          position: 'relative',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        {/* Glow Effect */}
                        <Box
                          sx={{
                            position: 'absolute',
                            width: '80%',
                            height: '0%',
                            background: 'radial-gradient(circle, rgba(191,219,129,0.3) 0%, transparent 70%)',
                            filter: 'blur(40px)',
                            zIndex: -1,
                          }}
                        />

                        {/* Main Image */}
                        <Box
                          component="img"
                          src={getImgUrl(slide.photoUrl)}
                          alt={slide.title}
                          sx={{
                            width: '100%',
                            maxWidth: '700px',
                            height: '100%',
                            minHeight: '530px', // Reduced to fit 80vh
                            objectFit: 'contain',
                            transform: 'scale(1.6)',
                            filter: 'drop-shadow(0 30px 50px rgba(0, 0, 0, 0.4))',
                            WebkitMaskImage: {
                              xs: 'none',
                              md: 'linear-gradient(to right, transparent, black 20%)'
                            },
                            maskImage: {
                              xs: 'none',
                              md: 'linear-gradient(to right, transparent, black 20%)'
                            },
                          }}
                        />
                      </Box>
                    </FloatingImage>
                  </SlideImage>
                </Box>
              </Container>
            </Box>
          );
        })}
      </Box >

      {/* DOTS NAVIGATION - Show only if multiple slides */}
      {
        list.length > 1 && (
          <Box
            sx={{
              position: "absolute",
              bottom: 80, // Moved up to make room for ticker
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 1.5,
              zIndex: 10,
              background: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(16px)',
              padding: '14px 28px',
              borderRadius: '60px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {list.map((_, i) => (
              <DotIndicator
                key={i}
                $active={i === index % list.length}
                onClick={() => handleDotClick(i)}
              />
            ))}
          </Box>
        )
      }

      {/* TICKER */}
      <Box
        sx={{
          position: "absolute",
          bottom: -5,
          left: 0,
          right: 0,
          background: "var(--green, #3DB843)",
          overflow: "hidden",
          padding: "13px 0",
          zIndex: 20,
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "max-content",
            animation: `${marquee} 28s linear infinite`,
          }}
        >
          {/* Duplicated list for seamless scrolling */}
          {[1, 2].map((_, idx) => (
            <React.Fragment key={idx}>
              {[
                "Full Stack Python",
                "AWS Cloud",
                "Data Analytics",
                "Android Dev",
                "100% Placement",
                "Expert Instructors",
                "Live Projects",
                "Job Ready Training",
              ].map((text, i) => (
                <Box
                  key={`${idx}-${i}`}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "0 28px",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    color: "white",
                    whiteSpace: "nowrap",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  {text}
                  <Box
                    sx={{
                      width: "4px",
                      height: "4px",
                      background: "rgba(255,255,255,0.5)",
                      borderRadius: "50%",
                    }}
                  />
                </Box>
              ))}
            </React.Fragment>
          ))}
        </Box>
      </Box>

      {/* Enquiry Dialog */}
      <Dialog
        open={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "24px",
            overflow: "hidden"
          }
        }}
      >
        <DialogContent sx={{ position: "relative", p: 0 }}>
          <IconButton
            onClick={() => setEnquiryOpen(false)}
            sx={{
              position: "absolute",
              top: 15,
              right: 15,
              zIndex: 10,
              color: 'rgba(0,0,0,0.5)',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.05)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
          <EnquiryFormAlone />
        </DialogContent>
      </Dialog>
    </Box>
  );
}