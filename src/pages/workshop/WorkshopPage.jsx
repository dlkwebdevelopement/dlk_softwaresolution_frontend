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
  Skeleton,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { GetRequest, getImgUrl } from "../../api/api";
import { GET_ALL_WORKSHOPS } from "../../api/endpoints";
import dayjs from "dayjs";
import {
  Clock as AccessTimeIcon,
  Calendar as CalendarTodayIcon,
  Video as VideoCallIcon,
  GraduationCap as SchoolIcon,
  Star as StarIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ArrowRight as ArrowForwardIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Animations
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const pulse = keyframes`
  0% { opacity: 0.6; transform: scale(0.98); }
  50% { opacity: 1; transform: scale(1); }
  100% { opacity: 0.6; transform: scale(0.98); }
`;

// Color Palette — Brand Green
const colors = {
  primary: "#3DB843",
  primaryDark: "#1a4718",
  primaryLight: "#e8f7e9",
  secondary: "#D3F36B",
  accent: "#2e9133",
  dark: "#0f172a",
  light: "#ffffff",
  textPrimary: "#0f172a",
  textSecondary: "#475569",
  background: {
    main: "#f8faf7",
    light: "#ffffff",
    gradient: "linear-gradient(180deg, #ffffff 0%, #f1f8f1 100%)",
    card: "rgba(255, 255, 255, 0.95)",
  },
};

// Styled Components
const GlassCard = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "$hovered",
})(({ theme, $hovered }) => ({
  background: colors.background.card,
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  borderRadius: "24px",
  overflow: "hidden",
  position: "relative",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  transform: $hovered ? "translateY(-10px)" : "translateY(0)",
  border: `1px solid ${$hovered ? alpha(colors.primary, 0.5) : alpha(colors.primary, 0.1)}`,
  boxShadow: $hovered
    ? `0 20px 40px rgba(61, 184, 67, 0.15)`
    : "0 10px 30px rgba(0,0,0,0.05)",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  cursor: "pointer",
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

const ImageContainer = styled(Box)({
  position: "relative",
  height: 180,
  width: "100%",
  overflow: "hidden",
});

const StyledCardMedia = styled(CardMedia)({
  width: "100%",
  height: "100%",
  transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
  objectFit: "cover",
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
  padding: '10px 4px 30px 4px', // Reduced top padding
  '&::-webkit-scrollbar': { display: 'none' },
  [theme.breakpoints.down('sm')]: {
    gap: '12px',
    padding: '5px 20px 20px 20px',
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

const ViewToggleButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "$active",
})(({ $active }) => ({
  borderRadius: '50px',
  padding: '10px 28px',
  textTransform: 'none',
  fontWeight: 800,
  fontSize: '0.9rem',
  transition: 'all 0.4s ease',
  background: $active ? colors.primary : 'white',
  color: $active ? 'white' : colors.textPrimary,
  border: `1px solid ${$active ? 'transparent' : alpha(colors.primary, 0.2)}`,
  boxShadow: $active ? `0 10px 20px ${alpha(colors.primary, 0.2)}` : 'none',
  '&:hover': {
    background: $active ? colors.primaryDark : alpha(colors.primary, 0.05),
    transform: 'translateY(-3px)',
  },
}));

const WorkshopCard = ({ work, index, hoveredCard, setHoveredCard, navigate, getDaysRemaining, formatTime12, currentViewMode }) => {
  return (
    <Box sx={{
      height: '100%',
      width: currentViewMode === "scroll" ? { xs: '280px', sm: '300px', md: 'calc((100% - 48px) / 4)' } : '100%', // Adjusted for 16px gap
      flexShrink: 0
    }}>
      <GlassCard
        $hovered={hoveredCard === index}
        onMouseEnter={() => setHoveredCard(index)}
        onMouseLeave={() => setHoveredCard(null)}
        onClick={() => navigate("/contact")}
      >
        <Box sx={{ position: "relative", overflow: "hidden", height: 180 }}>
          <StyledCardMedia
            component="img"
            image={getImgUrl(work.image)}
            alt={work.title}
            sx={{ transform: hoveredCard === index ? "scale(1.1)" : "scale(1)" }}
          />
          <Box sx={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 1 }}>
            <Chip
              label={work.categoryName || "Innovation"}
              size="small"
              sx={{ bgcolor: alpha(colors.primary, 0.9), color: 'white', fontWeight: 700, fontSize: '0.65rem', backdropFilter: 'blur(4px)', border: `1px solid ${alpha('#ffffff', 0.2)}` }}
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
            {work.title}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: colors.textSecondary, mb: 2.5, fontSize: "0.85rem", lineHeight: 1.6,
              height: '3.2em', overflow: 'hidden', display: '-webkit-box',
              WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
            }}
          >
            {work.description || "Master new skills with hands-on training sessions led by industry-leading expert practitioners."}
          </Typography>

          <Stack spacing={1.5} sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <StyledIcon><CalendarTodayIcon size={14} /></StyledIcon>
              <Typography variant="body2" sx={{ color: colors.textPrimary, fontWeight: 500 }}>
                {dayjs(work.date).format("DD MMM, YYYY")}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <StyledIcon><AccessTimeIcon size={14} /></StyledIcon>
              <Typography variant="body2" sx={{ color: colors.textPrimary, fontWeight: 500 }}>
                {formatTime12(work.startTime)}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <StyledIcon><SchoolIcon size={14} /></StyledIcon>
              <Typography variant="body2" sx={{ color: colors.textPrimary, fontWeight: 500 }}>
                {work.expertName || "Expert Trainer"}
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ mt: "auto", pt: 2, borderTop: `1px solid ${alpha(colors.primary, 0.1)}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box>
              <Typography sx={{ color: colors.primary, fontWeight: 800, fontSize: '0.75rem' }}>FREE ACCESS</Typography>
              <Typography sx={{ color: colors.textSecondary, fontSize: '0.65rem' }}>{getDaysRemaining(work.date)}</Typography>
            </Box>
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
              Enroll Now
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
        background: colors.background.gradient,
        position: 'relative',
        overflow: 'hidden',
        pt: 1, // 4px top padding
        pb: currentViewMode === "scroll" ? { xs: 4, md: 6 } : { xs: 4, md: 6 },
        minHeight: currentViewMode === "scroll" ? "auto" : '80vh'
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
        <Box sx={{ textAlign: "center", mb: { xs: 3, md: 4 } }}>
          <Chip
            label="UPCOMING WORKSHOPS"
            icon={<StarIcon size={14} />}
            sx={{
              background: alpha(colors.primary, 0.1),
              color: colors.primaryDark,
              fontWeight: 800,
              fontSize: '0.7rem',
              borderRadius: "50px",
              height: "32px",
              border: `1px solid ${alpha(colors.primary, 0.2)}`,
              letterSpacing: 1,
              mb: 2.5,
            }}
          />

          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              mb: 2,
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              color: colors.textPrimary,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
            }}
          >
            Trending <Box component="span" sx={{ color: colors.primary }}>Workshops</Box>
          </Typography>

          <Typography
            sx={{
              color: colors.textSecondary,
              maxWidth: "650px",
              mx: "auto",
              fontSize: "1.1rem",
              fontWeight: 500,
              lineHeight: 1.6,
              mb: 3
            }}
          >
            Master new skills with hands-on training sessions led by industry-leading expert practitioners.
          </Typography>

          {currentViewMode === "scroll" && (
            <Box sx={{ mt: 1 }}>
              <Button
                variant="contained"
                onClick={() => navigate("/workshop")}
                endIcon={<ChevronRightIcon size={18} />}
                sx={{
                  bgcolor: colors.primary,
                  color: 'white',
                  fontWeight: 800,
                  px: 4,
                  py: 1.5,
                  borderRadius: '50px',
                  fontSize: '0.9rem',
                  textTransform: 'none',
                  boxShadow: `0 10px 20px ${alpha(colors.primary, 0.2)}`,
                  '&:hover': {
                    bgcolor: colors.primaryDark,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 15px 30px ${alpha(colors.primaryDark, 0.3)}`,
                  }
                }}
              >
                Explore All
              </Button>
            </Box>
          )}

          {viewMode === "both" && (
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
              <ViewToggleButton $active={currentViewMode === "grid"} onClick={() => setCurrentViewMode("grid")}>Standard View</ViewToggleButton>
              <ViewToggleButton $active={currentViewMode === "scroll"} onClick={() => setCurrentViewMode("scroll")}>Quick View</ViewToggleButton>
            </Stack>
          )}
        </Box>

        {loading ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: "16px",
            }}
          >
            {[1, 2, 3, 4].map((i) => (
              <Box key={i} sx={{ height: "450px", borderRadius: "24px", overflow: "hidden" }}>
                <Skeleton variant="rectangular" height={180} sx={{ borderRadius: "24px 24px 0 0" }} />
                <Box sx={{ p: 2.5, bgcolor: "white", borderRadius: "0 0 24px 24px", height: "100%" }}>
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton variant="text" width="90%" height={40} />
                  <Skeleton variant="text" width="40%" height={20} />
                  <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: "30px", mt: 2 }} />
                </Box>
              </Box>
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
          <Box sx={{ position: "relative", overflow: "visible" }}>
            <ScrollButton $direction="left" onClick={() => scroll('left')} className="scroll-button"><ChevronLeftIcon size={20} /></ScrollButton>
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
            <ScrollButton $direction="right" onClick={() => scroll('right')} className="scroll-button"><ChevronRightIcon size={20} /></ScrollButton>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: "16px",
            }}
          >
            {workshops.map((work, i) => (
              <Box key={work._id || i}>
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
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}