import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  CardMedia,
  CardContent,
  IconButton,
  Chip,
  Avatar,
  alpha,
  Stack,
  useTheme,
  useMediaQuery,
  Paper,
  Container,
  Button
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { GetRequest } from "../../api/api";
import { ADMIN_GET_LIVE_CLASSES } from "../../api/endpoints";
import dayjs from "dayjs";
import { getImgUrl } from "../../api/api";
import {
  Play as VideoCallIcon,
  MapPin as LocationIcon,
  Clock as AccessTimeIcon,
  Calendar as CalendarTodayIcon,
  Users as PeopleIcon,
  GraduationCap as SchoolIcon,
  Star as StarIcon,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  primaryDark: "#1a4718",
  primaryLight: "#e8f7e9",
  textPrimary: "#0f172a",
  textSecondary: "#475569",
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
  borderRadius: '10px',
  background: alpha(colors.primary, 0.1),
  color: colors.primaryDark,
  transition: 'all 0.3s ease',
});

const ScrollTrack = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '30px',
  overflowX: 'auto',
  scrollBehavior: 'smooth',
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  padding: '20px 4px 40px 4px',
  '&::-webkit-scrollbar': { display: 'none' },
  [theme.breakpoints.down('sm')]: {
    gap: '16px',
    padding: '10px 10px 10px 10px',
  },
}));

const ScrollButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "$direction",
})(({ theme, $direction }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  [$direction === 'left' ? 'left' : 'right']: -25,
  zIndex: 10,
  backgroundColor: 'white',
  color: colors.primary,
  boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
  transition: 'all 0.4s ease',
  '&:hover': {
    backgroundColor: colors.primary,
    color: 'white',
    transform: 'translateY(-50%) scale(1.1)',
  },
  [theme.breakpoints.down('lg')]: { display: 'none' },
}));

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
          <Box sx={{ textAlign: 'center', py: 8, bgcolor: alpha(colors.primary, 0.05), borderRadius: 6, border: `1px dashed ${alpha(colors.primary, 0.3)}` }}>
            <Typography color={colors.primaryDark} fontWeight={600}>{error}</Typography>
          </Box>
        ) : loading ? (
          <Box sx={{ display: 'flex', gap: 4, overflow: 'hidden', py: 4 }}>
            {[...Array(4)].map((_, i) => (
              <Box key={i} sx={{ minWidth: 280, height: 400, bgcolor: 'rgba(0,0,0,0.03)', borderRadius: '24px', animation: `${pulse} 1.5s infinite` }} />
            ))}
          </Box>
        ) : classes.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, bgcolor: alpha(colors.primary, 0.02), borderRadius: 6, border: `1px dashed ${alpha(colors.primary, 0.1)}` }}>
            <Typography variant="h6" color="text.secondary" fontWeight={600}>No live classes scheduled at the moment.</Typography>
          </Box>
        ) : (
          <Box sx={{ position: "relative", overflow: "visible" }}>
            <ScrollButton $direction="left" onClick={() => scroll('left')} className="scroll-button">
              <ChevronLeft size={20} />
            </ScrollButton>

            <ScrollTrack
              ref={sliderRef}
              onMouseEnter={() => setIsAutoScrolling(false)}
              onMouseLeave={() => setIsAutoScrolling(true)}
            >
              {classes.map((cls, i) => (
                <Box
                  key={cls._id || i}
                  sx={{
                    width: { xs: "280px", sm: "300px", md: "calc((100% - 90px) / 4)" },
                    flexShrink: 0,
                  }}
                >
                  <GlassCard
                    $hovered={hoveredCard === i}
                    onMouseEnter={() => setHoveredCard(i)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => navigate("/contact")}
                  >
                    <Box sx={{ position: "relative", overflow: "hidden", height: 180 }}>
                      <CardMedia
                        component="img"
                        image={getImgUrl(cls.image || cls.courseId?.image)}
                        alt={cls.title || "Live Class"}
                        sx={{
                          height: "100%", width: "100%", objectFit: "cover",
                          transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                          transform: hoveredCard === i ? "scale(1.1)" : "scale(1)",
                        }}
                      />
                      <Box sx={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 1 }}>
                        <Chip
                          label={cls.courseId?.categoryName || "Training"}
                          size="small"
                          sx={{ bgcolor: alpha(colors.primary, 0.9), color: 'white', fontWeight: 700, fontSize: '0.65rem', backdropFilter: 'blur(4px)', border: `1px solid ${alpha('#ffffff', 0.2)}` }}
                        />
                      </Box>
                      <Box sx={{ position: "absolute", bottom: 12, right: 12 }}>
                        <Chip
                          label={getDaysRemaining(cls.startDate)}
                          size="small"
                          sx={{ bgcolor: cls.startDate && dayjs(cls.startDate).isBefore(dayjs()) ? alpha('#ef4444', 0.9) : alpha(colors.primary, 0.9), color: 'white', fontWeight: 800, fontSize: '0.65rem', backdropFilter: 'blur(4px)' }}
                        />
                      </Box>
                    </Box>

                    <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700, mb: 1.5, fontSize: "1rem", color: colors.textPrimary,
                          lineHeight: 1.4, height: '2.8em', overflow: 'hidden', display: '-webkit-box',
                          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {cls.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: colors.textSecondary, mb: 2.5, fontSize: "0.85rem", lineHeight: 1.6,
                          height: '3.2em', overflow: 'hidden', display: '-webkit-box',
                          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {cls.description || cls.courseId?.description || "Join our expert-led live training session to master industry-relevant skills and boost your career."}
                      </Typography>

                      <Stack spacing={1.5} sx={{ mb: 3 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <StyledIcon><CalendarTodayIcon size={14} /></StyledIcon>
                          <Typography variant="body2" sx={{ color: colors.textPrimary, fontWeight: 500 }}>
                            {dayjs(cls.startDate).format("DD MMM, YYYY")}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <StyledIcon><AccessTimeIcon size={14} /></StyledIcon>
                          <Typography variant="body2" sx={{ color: colors.textPrimary, fontWeight: 500 }}>
                            {formatTime12(cls.startTime)} - {formatTime12(cls.endTime)}
                          </Typography>
                        </Box>
                        {cls.durationDays && (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <StyledIcon><PeopleIcon size={14} /></StyledIcon>
                            <Typography variant="body2" sx={{ color: colors.textPrimary, fontWeight: 500 }}>
                              {cls.durationDays} Days Duration
                            </Typography>
                          </Box>
                        )}
                      </Stack>

                      <Box sx={{ mt: "auto", pt: 2, borderTop: `1px solid ${alpha(colors.primary, 0.1)}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography variant="caption" sx={{ color: colors.textSecondary, fontWeight: 600 }}>Limited Seats</Typography>
                        <Button
                          size="small"
                          onClick={(e) => { e.stopPropagation(); navigate("/contact"); }}
                          sx={{
                            bgcolor: colors.primary,
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            px: 3,
                            py: 0.8,
                            borderRadius: '50px',
                            textTransform: 'none',
                            boxShadow: `0 4px 14px ${alpha(colors.primary, 0.4)}`,
                            '&:hover': {
                              bgcolor: colors.primaryDark,
                              transform: 'translateY(-2px)',
                              boxShadow: `0 6px 20px ${alpha(colors.primary, 0.6)}`,
                            },
                            transition: 'all 0.3s ease'
                          }}
                        >
                          Join Now
                        </Button>
                      </Box>
                    </CardContent>
                  </GlassCard>
                </Box>
              ))}
            </ScrollTrack>

            <ScrollButton $direction="right" onClick={() => scroll('right')} className="scroll-button">
              <ChevronRight size={20} />
            </ScrollButton>
          </Box>
        )}

        <Box
          className="stats-strip"
          sx={{
            background: alpha(colors.primary, 0.03),
            borderTop: `1px solid ${alpha(colors.primary, 0.1)}`,
            borderBottom: `1px solid ${alpha(colors.primary, 0.1)}`,
            padding: { xs: '40px 20px', md: '50px 60px' },
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: { xs: 5, md: 0 },
            mt: 4,
            borderRadius: 4
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
              sx={{
                textAlign: 'center',
                flex: { xs: '1 1 40%', md: '1' },
                position: 'relative',
                px: 2,
                ...(idx > 0 && {
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: '15%',
                    bottom: '15%',
                    width: '1px',
                    background: alpha(colors.primary, 0.15),
                    display: { xs: 'none', md: 'block' }
                  }
                })
              }}
            >
              <Typography sx={{ fontSize: { xs: '2rem', md: '2.8rem' }, fontWeight: 800, color: colors.primary, lineHeight: 1 }}>
                {stat.value}
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', color: colors.textSecondary, mt: 1, fontWeight: 600 }}>
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
