import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  CardMedia,
  CardContent,
  IconButton,
  useTheme,
  useMediaQuery,
  Chip,
  Avatar,
  Paper,
  Fade,
  Container,
  alpha
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { GetRequest } from "../../api/api";
import { ADMIN_GET_LIVE_CLASSES } from "../../api/endpoints";
import dayjs from "dayjs";
import { BASE_URL, getImgUrl } from "../../api/api";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PeopleIcon from "@mui/icons-material/People";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import SchoolIcon from "@mui/icons-material/School";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";
import Gallery from "./Gallery";

// Animations
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const rotateGradient = keyframes`
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.1); }
  100% { transform: rotate(360deg) scale(1); }
`;

const glowPulse = keyframes`
  0% { box-shadow: 0 10px 30px rgba(61, 184, 67, 0.2); }
  50% { box-shadow: 0 20px 40px rgba(61, 184, 67, 0.4); }
  100% { box-shadow: 0 10px 30px rgba(61, 184, 67, 0.2); }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const marquee = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const pulse = keyframes`
  0% { opacity: 0.6; transform: scale(0.98); }
  50% { opacity: 1; transform: scale(1); }
  100% { opacity: 0.6; transform: scale(0.98); }
`;

const colors = {
  primary: "#3DB843",
  primaryDark: "#2e9133",
  primaryLight: "#e8f7e9",
  textPrimary: "#1a2b1b",
  textSecondary: "#6b8f6d",
  border: "#d4ead5",
};

// Styled Components
const GlassCard = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "$hovered",
})(({ theme, $hovered }) => ({
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid var(--green-dark)',
  borderRadius: '24px',
  overflow: 'hidden',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: '430px',
  width: '100%',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  transform: $hovered ? 'translateY(-10px)' : 'translateY(0)',
  boxShadow: $hovered
    ? '0 20px 40px rgba(61, 184, 67, 0.15)'
    : '0 10px 30px rgba(0, 0, 0, 0.05)',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
    animation: $hovered ? `${shimmer} 2s infinite` : 'none',
    pointerEvents: 'none',
  },
}));

const FloatingElement = styled(Box)({
  animation: `${floatAnimation} 3s ease-in-out infinite`,
});

const GradientBorder = styled(Box)({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: '4px',
  background: 'linear-gradient(90deg, var(--green-dark), var(--green), var(--green-dark))',
  backgroundSize: '200% 100%',
  animation: `${rotateGradient} 3s linear infinite`,
});

const GlassChip = styled(Chip)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  color: 'white',
  fontWeight: 600,
  fontSize: '0.75rem',
  '& .MuiChip-label': {
    padding: '4px 8px',
  },
}));

const GlassAvatar = styled(Avatar)({
  background: 'rgba(61, 184, 67, 0.2)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid var(--green-mid)',
  color: 'white',
});

const StyledIcon = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  borderRadius: '12px',
  background: 'var(--green-light)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid var(--green-mid)',
  color: 'var(--green-dark)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'var(--green-mid)',
    transform: 'scale(1.1)',
  },
});

export default function LiveClass() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sliderRef = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    let isMounted = true;
    const fetchLiveClasses = async () => {
      try {
        setLoading(true);
        const res = await GetRequest(ADMIN_GET_LIVE_CLASSES);
        if (isMounted) {
          // Backend may return array directly OR { success, data } wrapped
          // Mirror admin panel logic: accept either shape
          let data = [];
          if (Array.isArray(res)) {
            data = res;
          } else if (res && Array.isArray(res.data)) {
            data = res.data;
          } else if (res && res.success && Array.isArray(res.data)) {
            data = res.data;
          }
          setClasses(data);
          setError(null);
        }
      } catch (err) {
        console.error("Failed to fetch Live Classes:", err);
        if (isMounted) {
          setError("Online sessions temporarily unavailable.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchLiveClasses();
    return () => { isMounted = false; };
  }, []);

  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  useEffect(() => {
    let interval;
    if (isAutoScrolling && classes.length > 3) {
      interval = setInterval(() => {
        if (sliderRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
          if (scrollLeft + clientWidth >= scrollWidth - 15) {
            sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
          } else {
            scroll("right");
          }
        }
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isAutoScrolling, classes]);

  const formatTime12 = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getDaysRemaining = (startDate) => {
    const today = dayjs();
    const start = dayjs(startDate);
    const daysDiff = start.diff(today, "day");

    if (daysDiff < 0) return "Started";
    if (daysDiff === 0) return "Today";
    if (daysDiff === 1) return "Tomorrow";
    return `${daysDiff} days left`;
  };

  const scroll = (direction) => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const scrollAmount = direction === "left"
      ? -container.clientWidth
      : container.clientWidth;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <Box
      sx={{
        width: "100%",
        background: 'linear-gradient(180deg, #ffffff 0%, #f8faf7 100%)',
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 6, sm: 8, md: 10 },
      }}
    >
      {/* Subtle Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, var(--green-mid) 0%, transparent 70%)',
          borderRadius: '50%',
          opacity: 0.1,
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(61,184,67,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: `${rotateGradient} 25s linear infinite reverse`,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="xl">
        <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
          <FloatingElement>
            <Chip
              label="ONLINE TRAINING"
              icon={<StarIcon sx={{ fontSize: 16 }} />}
              sx={{
                bgcolor: alpha(colors.primary, 0.1),
                color: colors.primaryDark,
                fontWeight: 800,
                fontSize: '0.7rem',
                border: `1px solid ${alpha(colors.primary, 0.2)}`,
                letterSpacing: 1,
                mb: 2.5,
              }}
            />
          </FloatingElement>

          {/* TITLE */}
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              mb: 2,
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              color: colors.textPrimary,
              letterSpacing: '-0.02em',
            }}
          >
            Live <Box component="span" sx={{ color: colors.primary }}>Career Classes</Box>
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: colors.textSecondary,
              maxWidth: 700,
              mx: "auto",
              fontWeight: 500,
              fontSize: '1.1rem',
              lineHeight: 1.6
            }}
          >
            Join our interactive live sessions with industry experts and transform your career path with hands-on learning.
          </Typography>
        </Box>

        {error ? (
          <Box sx={{ textAlign: 'center', py: 8, bgcolor: '#fff5f5', borderRadius: 6, border: '1px dashed #feb2b2' }}>
            <Typography color="#c53030" fontWeight={600}>{error}</Typography>
          </Box>
        ) : loading ? (
          <Box sx={{ display: 'flex', gap: 4, overflow: 'hidden', py: 4 }}>
            {[...Array(4)].map((_, i) => (
              <Box key={i} sx={{ minWidth: 300, height: 450, bgcolor: 'rgba(0,0,0,0.03)', borderRadius: '28px', animation: `${pulse} 1.5s infinite` }} />
            ))}
          </Box>
        ) : classes.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, bgcolor: '#f8fafc', borderRadius: 6 }}>
            <Typography variant="h6" color="text.secondary" fontWeight={600}>No live classes scheduled at the moment.</Typography>
          </Box>
        ) : (
          <Box sx={{ position: "relative", overflow: "visible" }}>
            <Box
              ref={sliderRef}
              onMouseEnter={() => setIsAutoScrolling(false)}
              onMouseLeave={() => setIsAutoScrolling(true)}
              sx={{
                display: "flex",
                gap: { xs: 2, sm: 3, md: 4 },
                overflowX: "auto",
                scrollSnapType: "x mandatory",
                scrollBehavior: "smooth",
                pb: 4,
                pt: 2,
                px: { xs: 1, md: 2 },
                "&::-webkit-scrollbar": { height: 6 },
                "&::-webkit-scrollbar-track": { background: 'var(--green-pale)', borderRadius: 10 },
                "&::-webkit-scrollbar-thumb": { background: 'var(--green-mid)', borderRadius: 10, "&:hover": { background: 'var(--green)' } },
              }}
            >
              {classes.map((cls, i) => (
                <Box
                  key={cls._id || i}
                  sx={{
                    width: { xs: "250px", sm: "260px", md: "calc((100% - 96px) / 4)" },
                    flexShrink: 0,
                    scrollSnapAlign: "start",
                  }}
                >
                  <GlassCard
                    $hovered={hoveredCard === i}
                    onMouseEnter={() => setHoveredCard(i)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => navigate("/contact")}
                    sx={{ cursor: 'pointer' }}
                  >
                    <Box sx={{ position: "relative", overflow: "hidden" }}>
                      <CardMedia
                        component="img"
                        height="180"
                        image={getImgUrl(cls.image || cls.courseId?.image)}
                        alt={cls.title || "Live Class"}
                        sx={{
                          transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                          transform: hoveredCard === i ? "scale(1.1)" : "scale(1)",
                        }}
                      />
                      <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 100%)', pointerEvents: 'none' }} />
                      <Box sx={{ position: "absolute", top: 16, left: 16, right: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Chip label={cls.courseId?.categoryName || "Category"} size="small" sx={{ bgcolor: '#c2eac4', color: '#2e9133', fontWeight: 800, fontSize: '0.7rem', borderRadius: '8px', px: 0.5 }} />
                        <GlassChip label={getDaysRemaining(cls.startDate)} size="small" sx={{ color: cls.startDate && dayjs(cls.startDate).isBefore(dayjs()) ? '#ff5252' : 'var(--green-mid)' }} />
                      </Box>
                      <Box sx={{ position: 'absolute', bottom: 16, right: 16 }}>
                        <StyledIcon><SchoolIcon sx={{ fontSize: 16 }} /></StyledIcon>
                      </Box>
                    </Box>
                    <CardContent sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, fontSize: "1.05rem", color: 'black', lineHeight: 1.4 }}>
                          {cls.title || "Live Class"}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <GlassAvatar sx={{ width: 32, height: 32, mr: 1.5, bgcolor: 'var(--green-light)', border: 'none' }}>
                            <SchoolIcon sx={{ fontSize: 16, color: 'var(--green-dark)' }} />
                          </GlassAvatar>
                          <Typography variant="body2" sx={{ color: 'black', fontWeight: 600 }}>Expert Instructor</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: "grid", gap: 1, mb: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <StyledIcon sx={{ width: 28, height: 28, bgcolor: 'var(--green-light)' }}><CalendarTodayIcon sx={{ fontSize: 14 }} /></StyledIcon>
                          <Typography variant="body2" sx={{ color: 'black' }}><span style={{ fontWeight: 600 }}>Starts: </span>{dayjs(cls.startDate).format("DD MMM YYYY")}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <StyledIcon sx={{ width: 28, height: 28, bgcolor: 'var(--green-light)' }}><AccessTimeIcon sx={{ fontSize: 14 }} /></StyledIcon>
                          <Typography variant="body2" sx={{ color: 'black' }}><span style={{ fontWeight: 600 }}>Time: </span>{formatTime12(cls.startTime)} – {formatTime12(cls.endTime)}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <StyledIcon sx={{ width: 28, height: 28, bgcolor: 'var(--green-light)' }}><PeopleIcon sx={{ fontSize: 14 }} /></StyledIcon>
                          <Typography variant="body2" sx={{ color: 'black' }}><span style={{ fontWeight: 600 }}>Duration: </span>{cls.durationDays} {cls.durationDays === 1 ? "day" : "days"}</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pt: 2, borderTop: '1px solid rgba(72, 114, 62, 0.1)' }}>
                        <Typography variant="caption" sx={{ color: '#8a9b7e', fontWeight: 500 }}>Limited seats</Typography>
                        <Chip label="Join Now" icon={<VideoCallIcon />} onClick={(e) => { e.stopPropagation(); navigate("/contact"); }} sx={{ bgcolor: 'var(--green)', color: 'white', fontWeight: 600, transition: 'all 0.3s ease', '&:hover': { bgcolor: 'var(--green-dark)', transform: 'scale(1.05)' }, '& .MuiChip-icon': { color: 'white' } }} />
                      </Box>
                    </CardContent>
                  </GlassCard>
                </Box>
              ))}
            </Box>
          </Box>
        )}
        
        <Gallery />

        <Box
          className="stats-strip"
          sx={{
            background: 'var(--green-pale, #f2fbf2)',
            borderTop: '1px solid var(--border, #d4ead5)',
            borderBottom: '1px solid var(--border, #d4ead5)',
            padding: { xs: '36px 20px', md: '36px 60px' },
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: { xs: 4, md: 0 },
            mt: 6,
          }}
        >
          {[
            { value: "2.5k+", label: "Students Placed" },
            { value: "20+", label: "Years Experience" },
            { value: "11+", label: "Expert Courses" },
            { value: "1000+", label: "Hiring Partners" },
            { value: "15+", label: "Expert Trainers" },
          ].map((stat, idx) => (
            <Box
              key={idx}
              className="stat-block reveal"
              sx={{
                textAlign: 'center',
                padding: { xs: '0 20px', md: '0 56px' },
                position: 'relative',
                ...(idx > 0 && {
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: '10%',
                    bottom: '10%',
                    width: '1px',
                    background: 'var(--border, #d4ead5)',
                    display: { xs: 'none', md: 'block' }
                  }
                })
              }}
            >
              <Typography component="h3" sx={{ fontFamily: "'Poppins', sans-serif", fontSize: { xs: '2.4rem', md: '3.2rem' }, fontWeight: 600, color: 'var(--green, #3DB843)', letterSpacing: '-0.04em', lineHeight: 1.2 }}>
                {stat.value}
              </Typography>
              <Typography sx={{ fontSize: '0.82rem', color: 'var(--text-muted, #6b8f6d)', marginTop: '3px', fontWeight: 500 }}>
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
