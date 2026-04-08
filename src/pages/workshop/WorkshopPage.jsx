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
  Container,
  Button,
  Stack,
  Fade,
  alpha,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { GetRequest, getImgUrl } from "../../api/api";
import { GET_ALL_WORKSHOPS } from "../../api/endpoints";
import dayjs from "dayjs";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import SchoolIcon from "@mui/icons-material/School";
import StarIcon from "@mui/icons-material/Star";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate } from "react-router-dom";

// Animations
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); opacity: 0.5; }
  50% { opacity: 0.8; }
  100% { transform: translateX(100%); opacity: 0.5; }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const pulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

// Color Palette
const colors = {
  primary: "#3DB843",
  primaryDark: "#226625",
  primaryLight: "#e9f7ea",
  secondary: "#D3F36B",
  dark: "#0f172a",
  light: "#ffffff",
  textPrimary: "#1e293b",
  textSecondary: "#64748b",
  border: "rgba(61,184,67,0.12)",
};

// Styled Components
const GlassCard = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "$hovered",
})(({ $hovered }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderRadius: '28px',
  overflow: 'hidden',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  transform: $hovered ? 'translateY(-12px)' : 'translateY(0)',
  border: `1.5px solid ${$hovered ? colors.primary : alpha(colors.primary, 0.25)}`,
  boxShadow: $hovered
    ? `0 30px 60px -15px ${alpha(colors.primary, 0.3)}`
    : `0 10px 30px -10px rgba(0,0,0,0.05)`,
  cursor: 'pointer',
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
    zIndex: 2,
  },
}));

const StyledIconBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 34,
  height: 34,
  borderRadius: '12px',
  background: colors.primaryLight,
  color: colors.primaryDark,
  transition: 'transform 0.3s ease',
});

const FloatingElement = styled(Box)({
  animation: `${floatAnimation} 3s ease-in-out infinite`,
});

const SkeletonRow = styled(Box)({
  height: 400,
  backgroundColor: 'rgba(0,0,0,0.03)',
  borderRadius: '28px',
  animation: `${pulse} 1.5s ease-in-out infinite`,
});

const ScrollContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  overflow: 'visible',
  padding: '10px 0',
  '&:hover .scroll-button': {
    opacity: 1,
  },
});

const ScrollTrack = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '30px',
  overflowX: 'auto',
  scrollBehavior: 'smooth',
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  padding: '20px 4px 40px 4px',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  [theme.breakpoints.down('sm')]: {
    gap: '16px',
    padding: '10px 20px 20px 20px',
    margin: '0 -20px',
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
  color: colors.primaryDark,
  boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
  opacity: 0,
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: colors.primaryDark,
    color: 'white',
    transform: 'translateY(-50%) scale(1.15)',
  },
  [theme.breakpoints.down('lg')]: {
    display: 'none',
  },
}));

const ViewToggleButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "$active",
})(({ $active }) => ({
  borderRadius: '50px',
  padding: '10px 28px',
  textTransform: 'none',
  fontWeight: 800,
  fontSize: '0.9rem',
  transition: 'all 0.4s ease',
  background: $active ? colors.primaryDark : 'white',
  color: $active ? 'white' : colors.textPrimary,
  border: `1px solid ${$active ? 'transparent' : alpha(colors.primary, 0.2)}`,
  boxShadow: $active ? `0 10px 20px ${alpha(colors.primaryDark, 0.2)}` : 'none',
  '&:hover': {
    background: $active ? colors.primaryDark : alpha(colors.primary, 0.05),
    transform: 'translateY(-3px)',
    boxShadow: `0 15px 30px ${alpha(colors.primaryDark, 0.15)}`,
  },
}));

const WorkshopCard = ({ work, index, hoveredCard, setHoveredCard, navigate, getDaysRemaining, formatTime12, currentViewMode }) => {
  return (
    <Box sx={{ 
      height: '100%', 
      width: currentViewMode === "scroll" ? { xs: '270px', sm: '300px', md: 'calc((100% - 90px) / 4)' } : '100%',
      flexShrink: 0
    }}>
      <GlassCard
        $hovered={hoveredCard === index}
        onMouseEnter={() => setHoveredCard(index)}
        onMouseLeave={() => setHoveredCard(null)}
        onClick={() => navigate("/contact")}
      >
        <Box sx={{ position: "relative", height: 220, overflow: "hidden" }}>
          <CardMedia
            component="img"
            image={getImgUrl(work.image)}
            alt={work.title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: 'cover',
              transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: hoveredCard === index ? "scale(1.1)" : "scale(1)",
            }}
          />
          <Box sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 100%)",
            opacity: hoveredCard === index ? 0.8 : 0.4,
            transition: "opacity 0.4s ease"
          }} />
          
          <Box sx={{ position: "absolute", top: 16, left: 16, right: 16, display: "flex", justifyContent: "space-between", zIndex: 3 }}>
            <Chip 
              label={work.categoryName || "Premium Workshop"} 
              size="small" 
              sx={{ 
                bgcolor: colors.primary, 
                color: 'white', 
                fontWeight: 800, 
                fontSize: '0.6rem',
                borderRadius: '8px',
                px: 0.5,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }} 
            />
            <Box sx={{ 
              px: 1.5, py: 0.5, 
              bgcolor: 'rgba(255,255,255,0.9)', 
              backdropFilter: 'blur(8px)',
              borderRadius: '8px',
              color: colors.primaryDark,
              fontSize: '0.7rem',
              fontWeight: 800,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              {getDaysRemaining(work.date)}
            </Box>
          </Box>
        </Box>

        <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 800, 
              mb: 2.5, 
              color: colors.textPrimary,
              lineHeight: 1.3,
              fontSize: '1.25rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              height: '3.2em',
              letterSpacing: '-0.01em'
            }}
          >
            {work.title}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <Avatar 
              sx={{ 
                width: 44, 
                height: 44, 
                mr: 2, 
                bgcolor: alpha(colors.primary, 0.1),
                border: `2px solid ${alpha(colors.primary, 0.2)}`,
                color: colors.primaryDark
              }}
            >
              <SchoolIcon />
            </Avatar>
            <Box>
              <Typography sx={{ color: colors.textSecondary, fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Expert Mentor</Typography>
              <Typography sx={{ color: colors.textPrimary, fontWeight: 700, fontSize: '0.95rem' }}>
                {work.expertName || "DLK Expert Trainer"}
              </Typography>
            </Box>
          </Box>

          <Stack spacing={2} sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <StyledIconBox><CalendarTodayIcon sx={{ fontSize: 18 }} /></StyledIconBox>
              <Box>
                <Typography sx={{ color: colors.textSecondary, fontSize: '0.7rem', fontWeight: 600 }}>SCHEDULED DATE</Typography>
                <Typography sx={{ color: colors.textPrimary, fontWeight: 700, fontSize: '0.9rem' }}>
                  {dayjs(work.date).format("DD MMMM YYYY")}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <StyledIconBox sx={{ bgcolor: '#f1f5f9', color: colors.dark }}><AccessTimeIcon sx={{ fontSize: 18 }} /></StyledIconBox>
              <Box>
                <Typography sx={{ color: colors.textSecondary, fontSize: '0.7rem', fontWeight: 600 }}>SESSION TIMING</Typography>
                <Typography sx={{ color: colors.textPrimary, fontWeight: 700, fontSize: '0.9rem' }}>
                  {formatTime12(work.startTime)} – {formatTime12(work.endTime)}
                </Typography>
              </Box>
            </Box>
          </Stack>

          <Box sx={{ 
            mt: 'auto', 
            pt: 3, 
            borderTop: `1px solid ${alpha(colors.primary, 0.08)}`,
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between" 
          }}>
            <Box>
              <Typography sx={{ color: colors.primary, fontWeight: 900, fontSize: '0.75rem', letterSpacing: 1 }}>FREE ACCESS</Typography>
              <Typography sx={{ color: colors.textSecondary, fontSize: '0.7rem', fontWeight: 500 }}>Limited Slots Available</Typography>
            </Box>
            <Button
              variant="contained"
              endIcon={<VideoCallIcon />}
              sx={{ 
                bgcolor: colors.primary, 
                color: 'white', 
                fontWeight: 800, 
                borderRadius: '14px',
                px: 3,
                py: 1,
                fontSize: '0.85rem',
                textTransform: 'none',
                boxShadow: `0 10px 20px ${alpha(colors.primary, 0.2)}`,
                '&:hover': { bgcolor: colors.primaryDark, transform: 'scale(1.05)' },
                transition: 'all 0.3s ease'
              }} 
            >
              Enroll
            </Button>
          </Box>
        </CardContent>
      </GlassCard>
    </Box>
  );
};

export default function WorkshopPage({ viewMode = "grid" }) {
  const navigate = useNavigate();
  const [workshops, setWorkshops] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentViewMode, setCurrentViewMode] = useState(viewMode);
  const scrollRef = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    setCurrentViewMode(viewMode);
  }, [viewMode]);

  useEffect(() => {
    let active = true;
    const fetchWorkshops = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await GetRequest(GET_ALL_WORKSHOPS);
        if (active) {
          // Handle both array-direct and { success, data } wrapped responses
          let data = [];
          if (Array.isArray(res)) {
            data = res;
          } else if (res && Array.isArray(res.data)) {
            data = res.data;
          }
          if (data.length > 0) {
            setWorkshops(data);
          } else if (res && !res.success) {
            setError(res.message || "Failed to load workshops");
          }
        }
      } catch (err) {
        if (active) {
          console.error("Failed to fetch Workshops:", err);
          setError("Services temporarily unavailable.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchWorkshops();
    return () => { active = false; };
  }, []);

  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  useEffect(() => {
    let interval;
    if (isAutoScrolling && currentViewMode === "scroll" && workshops.length > 3) {
      interval = setInterval(() => {
        if (scrollRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
          if (scrollLeft + clientWidth >= scrollWidth - 15) {
            scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
          } else {
            scroll("right");
          }
        }
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isAutoScrolling, currentViewMode, workshops]);

  const formatTime12 = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":").map(Number);
    if (isNaN(hours)) return time;
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getDaysRemaining = (startDate) => {
    if (!startDate) return "Coming Soon";
    const today = dayjs().startOf('day');
    const start = dayjs(startDate).startOf('day');
    const daysDiff = start.diff(today, "day");

    if (daysDiff < 0) return "Finished";
    if (daysDiff === 0) return "Starting Today";
    if (daysDiff === 1) return "Tomorrow";
    return `${daysDiff} Days Left`;
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const scrollAmount = direction === 'left' ? -container.clientWidth : container.clientWidth;
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        background: currentViewMode === "scroll" ? "transparent" : alpha(colors.primary, 0.02),
        position: 'relative',
        overflow: 'hidden',
        py: currentViewMode === "scroll" ? { xs: 6, md: 10 } : { xs: 8, sm: 10, md: 12 },
        minHeight: currentViewMode === "scroll" ? "auto" : '80vh'
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
        {/* HEADER SECTION */}
        <Box
          sx={{
            textAlign: "center",
            mb: { xs: 6, md: 8 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            position: 'relative',
            zIndex: 1
          }}
        >
          <Box sx={{ maxWidth: 700, mx: "auto" }}>
            <FloatingElement sx={{ display: 'inline-block' }}>
              <Chip
                label="UPCOMING SESSIONS"
                icon={<StarIcon sx={{ fontSize: 14 }} />}
                sx={{
                  bgcolor: alpha(colors.primary, 0.1),
                  color: colors.primaryDark,
                  fontWeight: 800,
                  fontSize: '0.7rem',
                  mb: 2.5,
                  border: `1px solid ${alpha(colors.primary, 0.2)}`,
                  letterSpacing: 1
                }}
              />
            </FloatingElement>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                mb: 2,
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                color: colors.textPrimary,
                letterSpacing: '-0.02em'
              }}
            >
              Trending <Box component="span" sx={{ color: colors.primaryDark }}>Workshops</Box>
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: colors.textSecondary,
                fontWeight: 500,
                fontSize: '1.05rem',
                lineHeight: 1.6,
                textAlign: 'center'
              }}
            >
              Master new skills with hands-on training sessions led by industry-leading expert practitioners.
            </Typography>
          </Box>

          {currentViewMode === "scroll" && (
            <Button
              variant="contained"
              onClick={() => navigate("/workshop")}
              endIcon={<ChevronRightIcon />}
              sx={{
                bgcolor: colors.primaryDark,
                color: 'white',
                fontWeight: 800,
                px: 3.5,
                py: 1.5,
                borderRadius: '50px',
                fontSize: '0.9rem',
                textTransform: 'none',
                boxShadow: `0 10px 20px ${alpha(colors.primaryDark, 0.2)}`,
                '&:hover': { bgcolor: colors.primary, transform: 'translateY(-2px)' }
              }}
            >
              Explore All
            </Button>
          )}

          {viewMode === "both" && (
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: currentViewMode === "scroll" ? 0 : 4 }}>
              <ViewToggleButton $active={currentViewMode === "grid"} onClick={() => setCurrentViewMode("grid")}>Standard View</ViewToggleButton>
              <ViewToggleButton $active={currentViewMode === "scroll"} onClick={() => setCurrentViewMode("scroll")}>Quick View</ViewToggleButton>
            </Stack>
          )}
        </Box>

        {/* CONTENT SECTION */}
        {loading ? (
          <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fill, minmax(300px, 1fr))' } }}>
            {[...Array(3)].map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', py: 12 }}>
             <Typography variant="h5" color="error" sx={{ fontWeight: 600 }}>{error}</Typography>
          </Box>
        ) : workshops.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 12 }}>
            <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 600 }}>No active workshops found.</Typography>
          </Box>
        ) : currentViewMode === "scroll" ? (
          <ScrollContainer>
            <ScrollButton $direction="left" onClick={() => scroll('left')} className="scroll-button"><ChevronLeftIcon /></ScrollButton>
            <ScrollTrack
              ref={scrollRef}
              onMouseEnter={() => setIsAutoScrolling(false)}
              onMouseLeave={() => setIsAutoScrolling(true)}
            >
              {workshops.map((work, i) => (
                <WorkshopCard 
                  key={work._id || i} 
                  work={work} 
                  index={i} 
                  currentViewMode={currentViewMode} 
                  hoveredCard={hoveredCard} 
                  setHoveredCard={setHoveredCard} 
                  navigate={navigate} 
                  getDaysRemaining={getDaysRemaining} 
                  formatTime12={formatTime12} 
                />
              ))}
            </ScrollTrack>
            <ScrollButton $direction="right" onClick={() => scroll('right')} className="scroll-button"><ChevronRightIcon /></ScrollButton>
          </ScrollContainer>
        ) : (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: { xs: 3, sm: 5 } }}>
            {workshops.map((work, i) => (
              <Fade in key={work._id || i} timeout={500 + i * 150}>
                <Box>
                  <WorkshopCard 
                    work={work} 
                    index={i} 
                    currentViewMode={currentViewMode} 
                    hoveredCard={hoveredCard} 
                    setHoveredCard={setHoveredCard} 
                    navigate={navigate} 
                    getDaysRemaining={getDaysRemaining} 
                    formatTime12={formatTime12} 
                  />
                </Box>
              </Fade>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}