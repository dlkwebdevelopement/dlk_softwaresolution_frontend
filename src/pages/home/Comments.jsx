import React, { useEffect, useState } from "react";
import { Box, Typography, Avatar, IconButton, Paper, Rating, Chip, alpha } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { ArrowBackIosNew, ArrowForwardIos, FormatQuote } from "@mui/icons-material";
import { GetRequest } from "../../api/config";
import { GET_ALL_TESTIMONIALS } from "../../api/endpoints";

// Animations
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const scrollLeft = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

// Color scheme - Light & Fresh
const colors = {
  primary: "#3DB843",
  secondary: "#D3F36B",
  accent: "#c2eac4",
  background: "#fbfdf3",
  cardBg: "#ffffff",
  textPrimary: "#111c12",
  textSecondary: "#2e9133",
  shadow: "rgba(61, 184, 67, 0.1)",
  hover: "rgba(211, 243, 107, 0.2)",
};

// Styled Components
const GlassCard = styled(Paper)(({ theme }) => ({
  background: colors.cardBg,
  borderRadius: '24px',
  padding: theme.spacing(3, 2.5, 2.5, 2.5),
  position: 'relative',
  minHeight: 240,
  boxShadow: `0 10px 30px ${colors.shadow}`,
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  border: '1px solid rgba(131, 165, 97, 0.1)',
  animation: `${fadeIn} 0.6s ease-out`,
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: `0 20px 40px ${colors.hover}`,
    borderColor: colors.secondary,
    '& .quote-icon': {
      color: colors.secondary,
      transform: 'scale(1.1)',
    },
    '& .testimonial-avatar': {
      borderColor: colors.secondary,
    },
  },
}));

const QuoteIcon = styled(FormatQuote)({
  position: 'absolute',
  top: 20,
  right: 20,
  fontSize: 40,
  color: alpha(colors.primary, 0.2),
  transition: 'all 0.3s ease',
  transform: 'rotate(180deg)',
});

const StyledAvatar = styled(Avatar)({
  width: 90,
  height: 90,
  border: `4px solid ${colors.primary}`,
  boxShadow: `0 8px 20px ${colors.shadow}`,
  transition: 'all 0.3s ease',
  backgroundColor: colors.cardBg,
});

const NavigationButton = styled(IconButton)({
  backgroundColor: colors.cardBg,
  boxShadow: `0 4px 15px ${colors.shadow}`,
  color: colors.primary,
  width: 48,
  height: 48,
  transition: 'all 0.3s ease',
  border: `1px solid ${alpha(colors.primary, 0.1)}`,
  '&:hover': {
    backgroundColor: colors.secondary,
    color: colors.cardBg,
    transform: 'scale(1.1)',
    boxShadow: `0 8px 25px ${colors.hover}`,
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
});

const DotIndicator = styled(Box)(({ active }) => ({
  width: active ? 30 : 10,
  height: 10,
  borderRadius: 20,
  backgroundColor: active ? colors.primary : alpha(colors.primary, 0.2),
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: colors.secondary,
    transform: 'scale(1.1)',
  },
}));

const FloatingElement = styled(Box)({
  animation: `${floatAnimation} 3s ease-in-out infinite`,
});

const MarqueeContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  overflow: 'hidden',
  position: 'relative',
  padding: theme.spacing(2, 0),
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    width: '150px',
    height: '100%',
    zIndex: 2,
    pointerEvents: 'none',
  },
  '&::before': {
    left: 0,
    background: 'linear-gradient(90deg, #fbfdf3 0%, transparent 100%)',
  },
  '&::after': {
    right: 0,
    background: 'linear-gradient(-90deg, #fbfdf3 0%, transparent 100%)',
  },
  [theme.breakpoints.down('sm')]: {
    '&::before, &::after': {
      width: '60px',
    },
  },
}));

const MarqueeTrack = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$testimonialsCount'
})(({ $testimonialsCount }) => ({
  display: 'flex',
  width: 'max-content',
  animation: `${scrollLeft} ${($testimonialsCount || 1) * 12}s linear infinite`,
  '&:hover': {
    animationPlayState: 'paused',
  },
}));

const SAMPLE_TESTIMONIALS = [
  {
    id: "sample-1",
    name: "Priya Sharma",
    role: "Software Engineer @ TCS",
    text: "DLK Software Solutions transformed my career! The Full Stack Python course was incredibly well-structured. Within 3 months of placement training, I landed my dream job. The instructors are top-notch and always available to help.",
    image: "/student_girl_1.png",
    is_active: 1,
  },
  {
    id: "sample-2",
    name: "Arjun Krishnamurthy",
    role: "Cloud Engineer @ Infosys",
    text: "The AWS Cloud training here is absolutely world-class. Hands-on projects and real-world scenarios made all the difference. I cleared my AWS certification on the first attempt. Highly recommended for anyone serious about cloud!",
    image: "/student_boy_1.png",
    is_active: 1,
  },
  {
    id: "sample-3",
    name: "Divya Menon",
    role: "Android Developer @ Zoho",
    text: "I had zero coding experience before joining the Android Development course. The teaching methodology is so student-friendly that I was building full apps within weeks. Got placed within 45 days of completing the course!",
    image: "/student_girl_2.png",
    is_active: 1,
  },
  {
    id: "sample-4",
    name: "Karthik Balasubramanian",
    role: "Data Analyst @ Wipro",
    text: "The Data Analytics program exceeded all my expectations. The combination of Python, SQL, and Power BI training is perfect. The placement cell worked tirelessly to connect me with the right opportunities. Forever grateful!",
    image: "/student_boy_2.png",
    is_active: 1,
  },
  {
    id: "sample-5",
    name: "Sneha Raghunathan",
    role: "Web Developer @ HCL",
    text: "Best decision of my life! DLK's Web Development course is thorough, practical, and industry-relevant. The mentors pushed me to build real projects and prepare for interviews. Got 3 job offers after training!",
    image: "/student_girl_3.png",
    is_active: 1,
  },
];

export default function Comments() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await GetRequest(GET_ALL_TESTIMONIALS);
        if (res?.success) {
          const activeData = res.data.filter((item) => item.is_active === 1);
          setTestimonials(activeData.length > 0 ? activeData : SAMPLE_TESTIMONIALS);
        } else {
          setTestimonials(SAMPLE_TESTIMONIALS);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        setTestimonials(SAMPLE_TESTIMONIALS);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const loopTestimonials = [...testimonials, ...testimonials];

  /** RESPONSIVE CARD COUNT **/
  useEffect(() => {
    const calculate = () => {
      const w = window.innerWidth;
      if (w < 600) setCardsPerView(1);
      else if (w < 960) setCardsPerView(2);
      else setCardsPerView(3);
    };

    calculate();
    window.addEventListener("resize", calculate);
    return () => window.removeEventListener("resize", calculate);
  }, []);

  /** NAVIGATION **/
  const maxIndex = Math.max(0, testimonials.length - cardsPerView);

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev - 1 < 0 ? maxIndex : prev - 1));

  const handleNext = () =>
    setCurrentIndex((prev) => (prev + 1 > maxIndex ? 0 : prev + 1));

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const translateXPercent = -(currentIndex * (100 / cardsPerView));

  // Loading skeleton
  if (loading) {
    return (
      <Box sx={{ maxWidth: "1300px", margin: "0 auto", py: { xs: 8, md: 10 }, px: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 6, textAlign: "center", color: colors.textPrimary }}>
          Student <span style={{ color: colors.primary }}>Testimonials</span>
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
          {[1, 2, 3].map((i) => (
            <Box key={i} sx={{ width: 300 }}>
              <Box sx={{
                height: 280,
                borderRadius: '30px',
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: `${shimmer} 1.5s infinite`,
              }} />
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: "1300px",
        margin: "0 auto",
        width: "100%",
        background: colors.background,
        py: { xs: 4, md: 6 },
        position: "relative",
        borderRadius: { xs: '30px 30px 0 0', md: '40px 40px 0 0' },
      }}
    >
      {/* Decorative Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '200px',
          height: '200px',
          background: `radial-gradient(circle, ${alpha(colors.secondary, 0.2)} 0%, transparent 70%)`,
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: '300px',
          height: '300px',
          background: `radial-gradient(circle, ${alpha(colors.primary, 0.1)} 0%, transparent 70%)`,
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />

      {/* Floating Particles */}
      {[...Array(8)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: 10 + i * 5,
            height: 10 + i * 5,
            borderRadius: '50%',
            background: alpha(colors.secondary, 0.1),
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            filter: 'blur(2px)',
            animation: `${floatAnimation} ${10 + i * 2}s ease-in-out infinite`,
            pointerEvents: 'none',
          }}
        />
      ))}

      <Box sx={{ position: "relative", zIndex: 1, maxWidth: "1200px", mx: "auto", px: 2 }}>
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }}>
            <Chip
              label="STUDENT STORIES"
              sx={{
                bgcolor: 'var(--green-light)',
                color: 'var(--green-dark)',
                fontWeight: 800,
                letterSpacing: 1,
                border: '1px solid var(--green-mid)',
                '& .MuiChip-label': { px: 2 }
              }}
            />
          </Box>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              mb: 2,
              fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
              color: 'var(--green-dark)',
            }}
          >
            <Box component="span" sx={{ color: 'black' }}>What Our</Box> Students Say
          </Typography>

          <Typography
            sx={{
              color: '#6b8f76',
              fontSize: '1.1rem',
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Real stories from our amazing community of learners
          </Typography>
        </Box>

        {/* MARQUEE SECTION */}
        <MarqueeContainer>
          <MarqueeTrack $testimonialsCount={testimonials.length}>
            {loopTestimonials.map((item, index) => (
              <Box
                key={`${item.id}-${index}`}
                sx={{
                  width: { xs: 300, md: 380 },
                  mx: 2,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <GlassCard elevation={0}>
                  <QuoteIcon className="quote-icon" />

                  {/* Avatar */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <StyledAvatar
                      src={item.image || "/default-avatar.png"}
                      alt={item.name}
                      className="testimonial-avatar"
                    />
                  </Box>

                  {/* Rating */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }}>
                    <Rating value={5} readOnly size="small" sx={{ color: colors.secondary }} />
                  </Box>

                  {/* Name & Role */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      textAlign: 'center',
                      color: colors.textPrimary,
                      mb: 0.5,
                      fontSize: '1.1rem'
                    }}
                  >
                    {item.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      textAlign: 'center',
                      color: colors.primary,
                      fontWeight: 500,
                      mb: 2,
                    }}
                  >
                    {item.role || "Student"}
                  </Typography>

                  {/* Testimonial Text */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#111c12',
                      lineHeight: 1.6,
                      fontSize: "0.9rem",
                      textAlign: 'center',
                      fontStyle: 'italic',
                      display: '-webkit-box',
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    "{item.text}"
                  </Typography>

                  {/* Decorative Border */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: '20%',
                      right: '20%',
                      height: 3,
                      background: `linear-gradient(90deg, transparent, ${colors.secondary}, transparent)`,
                      borderRadius: '3px 3px 0 0',
                    }}
                  />
                </GlassCard>
              </Box>
            ))}
          </MarqueeTrack>
        </MarqueeContainer>
      </Box>
    </Box>
  );
}