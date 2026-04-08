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
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import StarIcon from "@mui/icons-material/Star";
import SchoolIcon from "@mui/icons-material/School";
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
  primary: "#4CAF50",
  primaryDark: "#388E3C",
  primaryLight: "#81C784",
  secondary: "#3DB843",
  accent: "#2e9133",
  dark: "#1A202C",
  light: "#ffffff",
  textPrimary: "#2D3748",
  textSecondary: "#718096",
  background: {
    main: "#f8faf8",
    light: "#ffffff",
    gradient: "linear-gradient(135deg, #f8faf8 0%, #f0f7f0 50%, #e8f5e9 100%)",
    card: "rgba(255, 255, 255, 0.97)",
  },
};

// ─── Styled Components ────────────────────────────────────────────────────────

const GlassCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "$hovered",
})(({ $hovered }) => ({
  background: colors.background.card,
  backdropFilter: "blur(10px)",
  borderRadius: "20px",
  overflow: "hidden",
  position: "relative",
  transition: "all 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
  transform: $hovered ? "translateY(-8px) scale(1.01)" : "translateY(0) scale(1)",
  border: `1px solid ${$hovered ? colors.primary : alpha(colors.primary, 0.2)}`,
  boxShadow: $hovered
    ? `0 24px 48px -12px ${alpha(colors.primary, 0.3)}`
    : `0 4px 20px -6px ${alpha(colors.dark, 0.08)}`,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  cursor: "pointer",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "3px",
    background: `linear-gradient(90deg, ${colors.primary}, ${colors.primaryDark}, ${colors.primaryLight}, ${colors.primary})`,
    backgroundSize: "300% 100%",
    animation: $hovered ? `${gradientShift} 2s linear infinite` : "none",
    opacity: $hovered ? 1 : 0.35,
    transition: "opacity 0.3s ease",
  },
}));

const ImageContainer = styled(Box)(() => ({
  position: "relative",
  paddingTop: "55%",       // compact image height
  width: "100%",
  overflow: "hidden",
  backgroundColor: "#f1f5f9",
  "&::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, transparent 40%, rgba(15,23,42,0.35) 100%)",
    pointerEvents: "none",
  },
}));

const StyledCardMedia = styled(CardMedia)(() => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  transition: "transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  objectFit: "cover",
  "&:hover": { transform: "scale(1.06)" },
}));

const CategoryChip = styled(Chip)(() => ({
  background: alpha(colors.dark, 0.82),
  backdropFilter: "blur(6px)",
  color: colors.light,
  fontWeight: 600,
  fontSize: "0.62rem",
  borderRadius: "8px",
  border: `1px solid ${alpha(colors.light, 0.15)}`,
  height: "22px",
  "& .MuiChip-label": { padding: "0 8px", fontSize: "0.62rem" },
}));

const BadgeIcon = styled(Box)(() => ({
  position: "absolute",
  top: 8,
  right: 8,
  zIndex: 2,
  background: `linear-gradient(135deg, ${colors.primaryDark}, ${colors.accent})`,
  borderRadius: "20px",
  padding: "3px 8px",
  display: "flex",
  alignItems: "center",
  gap: 4,
  boxShadow: `0 4px 12px -3px ${alpha(colors.primary, 0.4)}`,
  "& span": {
    color: "#fff",
    fontSize: "0.62rem",
    fontWeight: 700,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
  },
}));

const MetaInfo = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginBottom: 6,
  flexWrap: "wrap",
  "& .meta-item": {
    display: "flex",
    alignItems: "center",
    gap: 3,
    "& svg": { fontSize: 11, color: colors.primary },
    "& span": { fontSize: "0.62rem", fontWeight: 500, color: colors.textSecondary },
  },
}));

const ProjectTitle = styled(Typography)(() => ({
  fontWeight: 700,
  fontSize: "0.78rem",
  lineHeight: 1.35,
  color: colors.textPrimary,
  marginBottom: 5,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  height: "2.1em",   // 1.35 * 2 + buffer
  transition: "color 0.2s ease",
  "&:hover": { color: colors.primary },
}));

const ProjectDescription = styled(Typography)(() => ({
  color: colors.textSecondary,
  fontSize: "0.68rem",
  lineHeight: 1.5,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  marginBottom: 10,
  height: "3.0em",   // FIXED: matches 2 lines of text
}));

const ActionButton = styled(Button)(() => ({
  color: colors.primary,
  fontWeight: 700,
  fontSize: "0.65rem",
  textTransform: "none",
  padding: "5px 14px",
  borderRadius: "50px",
  background: alpha(colors.primary, 0.07),
  border: `1px solid ${alpha(colors.primary, 0.12)}`,
  minWidth: "auto",
  transition: "all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  "&:hover": {
    background: colors.primary,
    color: "#fff",
    transform: "scale(1.04) translateY(-1px)",
    boxShadow: `0 6px 14px -4px ${alpha(colors.primary, 0.3)}`,
    "& .arrow-icon": { transform: "translateX(3px)" },
  },
  "& .arrow-icon": { transition: "transform 0.3s ease", fontSize: 12, marginLeft: 4 },
}));

const NavigationButton = styled(IconButton)(({ theme }) => ({
  background: colors.light,
  boxShadow: `0 4px 12px -4px ${alpha(colors.dark, 0.1)}`,
  border: `1px solid ${alpha(colors.primary, 0.1)}`,
  color: colors.primary,
  width: 44,
  height: 44,
  transition: "all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  "&:hover": {
    background: colors.primary,
    color: "#fff",
    transform: "scale(1.08) translateY(-3px)",
    borderColor: "transparent",
    boxShadow: `0 10px 20px -6px ${alpha(colors.primary, 0.4)}`,
  },
  "&.Mui-disabled": { opacity: 0.35, background: colors.background.main },
  [theme.breakpoints.down("sm")]: { width: 38, height: 38 },
}));

const DotIndicator = styled(Box)(({ $active }) => ({
  width: $active ? 32 : 8,
  height: 5,
  borderRadius: 3,
  background: $active
    ? `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`
    : alpha(colors.primary, 0.15),
  transition: "all 0.45s cubic-bezier(0.19, 1, 0.22, 1)",
  cursor: "pointer",
  "&:hover": { background: colors.primary, opacity: 0.75 },
}));

const ScrollContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  overflow: 'visible',
  '&:hover .scroll-button': {
    opacity: 1,
    transform: 'translateY(-50%) scale(1)',
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
  },
}));

const ScrollButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "$direction",
})(({ theme, $direction }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%) scale(0.9)',
  [$direction === 'left' ? 'left' : 'right']: -25,
  zIndex: 10,
  backgroundColor: 'white',
  color: colors.primary,
  boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
  opacity: 0,
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: colors.primary,
    color: 'white',
    transform: 'translateY(-50%) scale(1.1)',
  },
  [theme.breakpoints.down('lg')]: {
    display: 'none',
  },
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

// ─── Component ────────────────────────────────────────────────────────────────

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

  // ── Loading skeleton ──
  if (loading) {
    return (
      <Box sx={{ py: 8, bgcolor: colors.background.main, minHeight: "50vh" }}>
        <Container maxWidth="lg">
          <Grid container spacing={2} justifyContent="center">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                <Box
                  sx={{
                    height: 280,
                    borderRadius: "20px",
                    background:
                      "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)",
                    backgroundSize: "200% 100%",
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

  const visibleProjects = projects;

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        background: colors.background.gradient,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background orbs */}
      <FloatingOrb size="420px" top="-15%" right="-12%" color={alpha(colors.primary, 0.07)} delay="12" />
      <FloatingOrb size="320px" bottom="-12%" left="-8%" color={alpha(colors.secondary, 0.07)} delay="15" />
      <FloatingOrb size="240px" top="35%" left="18%" color={alpha(colors.accent, 0.05)} delay="9" />

      <Container maxWidth="xl">

        {/* ── Header ── */}
        <Box
          sx={{
            textAlign: "center",
            mb: { xs: 5, md: 7 },
            animation: `${slideInUp} 0.7s cubic-bezier(0.16, 1, 0.3, 1)`,
          }}
        >
          <Stack
            direction="row"
            spacing={1.5}
            justifyContent="center"
            alignItems="center"
            sx={{ mb: 3 }}
          >
            <Chip
              label="SUCCESSFUL PROJECTS"
              icon={<SchoolIcon sx={{ fontSize: "13px !important" }} />}
              sx={{
                background: alpha(colors.primary, 0.08),
                color: colors.primaryDark,
                fontWeight: 800,
                letterSpacing: "0.08em",
                borderRadius: "50px",
                height: "32px",
                border: `1px solid ${alpha(colors.primary, 0.15)}`,
                "& .MuiChip-label": { px: 2, fontSize: "0.65rem" },
              }}
            />
          </Stack>

          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              mb: 2,
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              color: colors.textPrimary,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
            }}
          >
            Insights & <Box
              component="span"
              sx={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent}, ${colors.primaryDark})`,
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: `${gradientShift} 4s linear infinite`,
              }}
            >
              Future Tech
            </Box>
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: colors.textSecondary,
              maxWidth: "600px",
              mx: "auto",
              fontSize: "0.95rem",
              fontWeight: 500,
              lineHeight: 1.75,
            }}
          >
            Explore the innovative projects built by our talented students during their training at DLK Software Solutions.
          </Typography>
        </Box>

        {/* Student Projects Scroll Track */}
        <ScrollContainer>
          <ScrollButton $direction="left" onClick={() => scroll('left')} className="scroll-button">
            <ChevronLeftIcon />
          </ScrollButton>

          <ScrollTrack
            ref={scrollRef}
            onMouseEnter={() => setIsAutoScrolling(false)}
            onMouseLeave={() => setIsAutoScrolling(true)}
            sx={{
              justifyContent: projects.length < 4 ? "center" : "flex-start",
            }}
          >
            {projects.map((project, idx) => (
              <Box
                key={project.id || idx}
                sx={{
                  width: { xs: "280px", sm: "300px", md: "calc((100% - 90px) / 4)" },
                  height: "auto",
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
                  {/* Image */}
                  <ImageContainer>
                    <StyledCardMedia
                      component="img"
                      image={getImgUrl(project.image)}
                      alt={project.title}
                    />
                    <CategoryChip
                      label={
                        project.category ||
                        project.short_description?.split(",")[0] ||
                        "Innovation"
                      }
                      size="small"
                      sx={{ position: "absolute", top: 8, left: 8, zIndex: 2 }}
                    />
                    <BadgeIcon>
                      <StarIcon sx={{ fontSize: 10, color: "#fff" }} />
                      <span>Featured</span>
                    </BadgeIcon>
                  </ImageContainer>

                  {/* Body */}
                  <Box
                    sx={{
                      p: 1.5,
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden",
                    }}
                  >
                    <MetaInfo>
                      <div className="meta-item">
                        <CalendarMonthIcon />
                        <span>
                          {project.createdAt
                            ? new Date(project.createdAt).toLocaleDateString(
                              "en-US",
                              { month: "short", year: "numeric" }
                            )
                            : "Recent"}
                        </span>
                      </div>
                      <div className="meta-item">
                        <VisibilityIcon />
                        <span>{project.views?.toLocaleString() || 0}</span>
                      </div>
                      <div className="meta-item">
                        <TrendingUpIcon
                          sx={{ color: colors.secondary, fontSize: "11px !important" }}
                        />
                        <span>Trending</span>
                      </div>
                    </MetaInfo>

                    <ProjectTitle variant="h6">{project.title}</ProjectTitle>

                    <ProjectDescription variant="body2">
                      {project.short_description?.substring(0, 90)}...
                    </ProjectDescription>

                    {/* Footer */}
                    <Box
                      sx={{
                        mt: "auto",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <ActionButton
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/student-projects/${project.slug}`);
                        }}
                      >
                        Explore Project
                        <ArrowForwardIcon className="arrow-icon" />
                      </ActionButton>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <TrendingUpIcon sx={{ fontSize: 12, color: colors.secondary }} />
                        <Typography
                          variant="caption"
                          sx={{ color: colors.textSecondary, fontWeight: 500, fontSize: "0.62rem" }}
                        >
                          Trending
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </GlassCard>
              </Box>
            ))}
          </ScrollTrack>

          <ScrollButton $direction="right" onClick={() => scroll('right')} className="scroll-button">
            <ChevronRightIcon />
          </ScrollButton>
        </ScrollContainer>
      </Container>
    </Box>
  );
};

export default StudentProjects;