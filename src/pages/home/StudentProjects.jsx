import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Card,
  CardMedia,
  Chip,
  Typography,
  Grid,
  Button,
  IconButton,
  Container,
  alpha,
  Stack,
  useTheme,
  useMediaQuery,
  Paper
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import {
  Clock as AccessTimeIcon,
  Calendar as CalendarMonthIcon,
  ArrowRight as ArrowForwardIcon,
  Eye as VisibilityIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  GraduationCap as SchoolIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GetRequest } from "../../api/config";
import { GET_ALL_STUDENT_PROJECTS } from "../../api/endpoints";
import { getImgUrl } from "../../api/api";

// Animations
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-16px); }
  100% { transform: translateY(0px); }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); opacity: 0.5; }
  50% { opacity: 0.8; }
  100% { transform: translateX(100%); opacity: 0.5; }
`;

const slideInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const gradientShift = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
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
})(({ $hovered }) => ({
  background: colors.background.card,
  backdropFilter: "blur(10px)",
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

const FloatingOrb = styled(Box)(({ size, top, bottom, left, right, color, delay }) => ({
  position: "absolute",
  width: size,
  height: size,
  borderRadius: "50%",
  background: `radial-gradient(circle, ${color} 0%, transparent 75%)`,
  top, bottom, left, right,
  filter: "blur(70px)",
  animation: `${floatAnimation} ${delay || 12}s ease-in-out infinite`,
  pointerEvents: "none",
  zIndex: 0,
}));

const StudentProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await GetRequest(GET_ALL_STUDENT_PROJECTS);
        setProjects(res?.data?.data || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  useEffect(() => {
    let interval;
    if (isAutoScrolling && projects.length > 3) {
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
  }, [isAutoScrolling, projects]);

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

  if (loading) {
    return (
      <Box sx={{ py: 8, bgcolor: colors.background.main, minHeight: "50vh" }}>
        <Container maxWidth="lg">
          <Grid container spacing={2} justifyContent="center">
            {[1, 2, 3, 4].map((i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                <Box
                  sx={{
                    height: 400,
                    borderRadius: "24px",
                    background: alpha(colors.primary, 0.05),
                    animation: `${shimmer} 1.5s infinite`,
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    );
  }

  if (!projects.length) return null;

  return (
    <Box
      sx={{
        pt: 1, // Removed top padding
        pb: { xs: 6, md: 10 },
        background: colors.background.gradient,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <FloatingOrb size="400px" top="-10%" right="-5%" color={alpha(colors.primary, 0.05)} delay="12" />
      <FloatingOrb size="400px" bottom="-10%" left="-5%" color={alpha(colors.primary, 0.05)} delay="15" />

      <Container maxWidth="xl">
        <Box sx={{ textAlign: "center", mb: { xs: 3, md: 4 } }}>
          <Chip
            label="SUCCESSFUL PROJECTS"
            icon={<SchoolIcon size={14} />}
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
            Insights & <Box component="span" sx={{ color: colors.primary }}>Future Tech</Box>
          </Typography>

          <Typography
            sx={{
              color: colors.textSecondary,
              maxWidth: "650px",
              mx: "auto",
              fontSize: "1.1rem",
              fontWeight: 500,
              lineHeight: 1.6,
            }}
          >
            Explore the innovative projects built by our talented students during their training at DLK Software Solutions.
          </Typography>
        </Box>

        <Box sx={{ position: "relative", overflow: "visible" }}>
          <ScrollButton $direction="left" onClick={() => scroll('left')} className="scroll-button">
            <ChevronLeftIcon size={20} />
          </ScrollButton>

          <ScrollTrack
            ref={scrollRef}
            onMouseEnter={() => setIsAutoScrolling(false)}
            onMouseLeave={() => setIsAutoScrolling(true)}
          >
            {projects.map((project, idx) => (
              <Box
                key={project.id || idx}
                sx={{
                  width: { xs: "280px", sm: "300px", md: "calc((100% - 48px) / 4)" }, // Adjusted for 16px gap
                  flexShrink: 0,
                }}
              >
                <GlassCard
                  $hovered={hoveredCard === idx}
                  onMouseEnter={() => setHoveredCard(idx)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => navigate(`/student-projects/${project.slug}`)}
                  elevation={0}
                >
                  <Box sx={{ position: "relative", overflow: "hidden", height: 180 }}>
                    <StyledCardMedia
                      component="img"
                      image={getImgUrl(project.image)}
                      alt={project.title}
                      sx={{ transform: hoveredCard === idx ? "scale(1.1)" : "scale(1)" }}
                    />
                    <Box sx={{ position: "absolute", top: 12, left: 12 }}>
                      <Chip
                        label={project.category || "Innovation"}
                        size="small"
                        sx={{ bgcolor: alpha(colors.primary, 0.9), color: 'white', fontWeight: 700, fontSize: '0.65rem', backdropFilter: 'blur(4px)', border: `1px solid ${alpha('#ffffff', 0.2)}` }}
                      />
                    </Box>
                  </Box>

                  <Box sx={{ p: 2.5, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    <Stack direction="row" spacing={1.5} sx={{ mb: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: colors.textPrimary }}>
                        <CalendarMonthIcon size={12} />
                        <Typography variant="caption" sx={{ fontWeight: 500 }}>
                          {project.createdAt ? new Date(project.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Recent"}
                        </Typography>
                      </Box>
                    </Stack>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700, fontSize: "1rem", mb: 2, color: colors.textPrimary,
                        lineHeight: 1.4, height: "2.8em", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                      }}
                    >
                      {project.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: colors.textSecondary, mb: 3, fontSize: "0.85rem", lineHeight: 1.6, height: "3.2em", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                      }}
                    >
                      {project.short_description}
                    </Typography>

                    <Box sx={{ mt: "auto", pt: 2, borderTop: `1px solid ${alpha(colors.primary, 0.1)}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: colors.textPrimary }}>
                        <VisibilityIcon size={14} />
                        <Typography variant="caption" sx={{ fontWeight: 500 }}>{project.views || 0}</Typography>
                      </Box>
                      <Button
                        size="small"
                        sx={{
                          color: colors.primary, fontWeight: 700, fontSize: "0.75rem", textTransform: 'none',
                          '&:hover': { gap: 1 }
                        }}
                      >
                        Explore <ArrowForwardIcon size={14} style={{ marginLeft: 4 }} />
                      </Button>
                    </Box>
                  </Box>
                </GlassCard>
              </Box>
            ))}
          </ScrollTrack>

          <ScrollButton $direction="right" onClick={() => scroll('right')} className="scroll-button">
            <ChevronRightIcon size={20} />
          </ScrollButton>
        </Box>
      </Container>
    </Box>
  );
};

export default StudentProjects;