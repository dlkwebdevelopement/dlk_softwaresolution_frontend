import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Chip,
  Button,
  alpha,
  useTheme,
  Breadcrumbs,
  Link,
  Skeleton,
  Stack,
  Paper,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { getImgUrl, GetRequest } from "../../api/api";
import { GET_ALL_STUDENT_PROJECTS } from "../../api/endpoints";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import BottomInfo from "../../components/BottomInfo";

// Animations
const slideInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Color Palette
const colors = {
  primary: "#4CAF50",
  primaryDark: "#388E3C",
  primaryLight: "#81C784",
  secondary: "#C8E6C9",
  accent: "#2D3748",
  dark: "#1A202C",
  light: "#ffffff",
  textPrimary: "#2D3748",
  textSecondary: "#718096",
  background: {
    main: "#f8f9fa",
    light: "#ffffff",
    gradient: "linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)",
    card: "#ffffff",
  },
};

// Styled Components
const ProjectCard = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "$hovered",
})(({ theme, $hovered }) => ({
  background: colors.background.card,
  borderRadius: "24px",
  overflow: "hidden",
  position: "relative",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  transform: $hovered ? "translateY(-12px)" : "translateY(0)",
  border: `1px solid ${$hovered ? colors.primary : alpha(colors.primary, 0.1)}`,
  boxShadow: $hovered
    ? `0 25px 50px -12px rgba(61, 184, 67, 0.15)`
    : `0 4px 6px -1px rgba(0, 0, 0, 0.05)`,
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  cursor: "pointer",
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  paddingTop: "56.25%",
  width: "100%",
  overflow: "hidden",
  backgroundColor: "#f5f5f5",
  flexShrink: 0,
  "&::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.3) 100%)",
    pointerEvents: "none",
  },
}));

const StyledCardMedia = styled(CardMedia)(() => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
  objectFit: "cover",
}));

const MetaInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 12,
  marginBottom: 12,
  flexWrap: "wrap",
  "& .meta-item": {
    display: "flex",
    alignItems: "center",
    gap: 4,
    "& svg": {
      fontSize: 14,
      color: colors.primary,
    },
    "& span": {
      fontSize: "0.75rem",
      fontWeight: 500,
      color: colors.textSecondary,
    },
  },
}));

const ProjectTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "1.15rem",
  lineHeight: 1.4,
  color: colors.textPrimary,
  marginBottom: 10,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
  height: "3.22em",
  transition: "all 0.3s ease",
  "&:hover": { color: colors.primary },
}));

const ProjectDescription = styled(Typography)(({ theme }) => ({
  color: colors.textSecondary,
  fontSize: "0.85rem",
  lineHeight: 1.6,
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
  height: "4.08em",
  marginBottom: 16,
}));

const ActionButton = styled(Button)(({ theme }) => ({
  color: colors.primary,
  fontWeight: 700,
  fontSize: "0.9rem",
  textTransform: "none",
  padding: "0",
  minWidth: "auto",
  background: "transparent",
  transition: "all 0.3s ease",
  "& .arrow-icon": {
    transition: "transform 0.3s ease",
    fontSize: 18,
    marginLeft: 6,
  },
  "&:hover": {
    background: "transparent",
    opacity: 0.8,
    "& .arrow-icon": { transform: "translateX(6px)" },
  },
}));

export default function StudentProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await GetRequest(GET_ALL_STUDENT_PROJECTS);
        setProjects(res?.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Recent";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <Navbar />

      <Box sx={{ bgcolor: colors.background.main, minHeight: "100vh" }}>
        <Navbar />

        <Box sx={{ pt: { xs: 12, md: 16 }, pb: 10 }}>
          <Container maxWidth="xl">
            {/* Header Section */}
            <Box
              sx={{
                textAlign: "center",
                mb: { xs: 6, md: 8 },
                animation: `${slideInUp} 0.6s ease-out`,
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Chip
                  icon={<MenuBookIcon sx={{ fontSize: "16px !important", color: "inherit !important" }} />}
                  label="SUCCESS STORIES"
                  sx={{
                    bgcolor: alpha(colors.primary, 0.1),
                    color: colors.textPrimary,
                    fontWeight: 800,
                    px: 1,

                    "& .MuiChip-label": { paddingLeft: "8px" },
                  }}
                />
              </Box>

              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  mb: 2,
                  fontSize: { xs: "2.2rem", sm: "2.8rem", md: "3.5rem" },
                  color: colors.textPrimary,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                }}
              >
                Innovation & <span style={{ color: colors.primary }}>Excellence</span>
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: colors.textSecondary,
                  maxWidth: "700px",
                  mx: "auto",
                  fontSize: { xs: "1rem", sm: "1.1rem" },
                  lineHeight: 1.6,
                  px: 2,
                  mb: 4,
                }}
              >
                Discover the groundbreaking projects developed by our talented students and innovators.
              </Typography>

              {/* Breadcrumbs */}
              <Box sx={{ display: "flex", justifyContent: "center", mb: 6 }}>
                <Breadcrumbs separator={<ChevronRightIcon sx={{ fontSize: 14 }} />}>
                  <Link
                    component="button"
                    onClick={() => navigate("/")}
                    color="inherit"
                    sx={{ display: "flex", alignItems: "center", textDecoration: "none", fontSize: "0.85rem", fontWeight: 500 }}
                  >
                    Home
                  </Link>
                  <Typography color="primary" sx={{ fontSize: "0.85rem", fontWeight: 700 }}>
                    Student Projects
                  </Typography>
                </Breadcrumbs>
              </Box>
            </Box>

            {/* Project Grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(4, 1fr)",
                },
                gap: "30px",
              }}
            >
              {loading ? (
                [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <Box key={i} sx={{ height: "480px", borderRadius: "24px", overflow: "hidden" }}>
                    <Skeleton variant="rectangular" height={240} sx={{ borderRadius: "24px 24px 0 0" }} />
                    <Box sx={{ p: 2, bgcolor: "white", borderRadius: "0 0 24px 24px", height: "240px" }}>
                      <Skeleton variant="text" width="60%" height={24} />
                      <Skeleton variant="text" width="90%" height={60} />
                      <Skeleton variant="rectangular" width="120px" height={32} sx={{ borderRadius: "30px", mt: 2 }} />
                    </Box>
                  </Box>
                ))
              ) : projects.length > 0 ? (
                projects.map((project, idx) => (
                  <Box key={project.id || idx} sx={{ height: "480px" }}>
                    <ProjectCard
                      $hovered={hoveredCard === idx}
                      onMouseEnter={() => setHoveredCard(idx)}
                      onMouseLeave={() => setHoveredCard(null)}
                      onClick={() => navigate(`/student-projects/${project.slug || project.id}`)}
                      elevation={0}
                    >
                      <ImageContainer>
                        <StyledCardMedia
                          component="img"
                          image={getImgUrl(project.image)}
                          alt={project.title}
                          loading="lazy"
                        />
                        <Box sx={{ position: "absolute", top: 16, left: 16, zIndex: 2 }}>
                          <Chip
                            label={project.short_description?.split(',')[0] || "Innovation"}
                            sx={{
                              bgcolor: "rgba(255,255,255,0.9)",
                              backdropFilter: "blur(4px)",
                              fontWeight: 700,
                              color: "#1a4718",
                              fontSize: "0.72rem"
                            }}
                          />
                        </Box>
                      </ImageContainer>

                      <Box sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                        <MetaInfo>
                          <div className="meta-item">
                            <CalendarMonthIcon />
                            <span>
                              {project.createdAt
                                ? formatDate(project.createdAt)
                                : "Recent"}
                            </span>
                          </div>
                          <div className="meta-item">
                            <VisibilityIcon />
                            <span>{project.views?.toLocaleString() || 0} views</span>
                          </div>
                        </MetaInfo>

                        <ProjectTitle variant="h6">{project.title}</ProjectTitle>

                        <ProjectDescription variant="body2">
                          {project.short_description}
                        </ProjectDescription>

                        <Box sx={{ mt: "auto", pt: 1 }}>
                          <ActionButton
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/student-projects/${project.slug || project.id}`);
                            }}
                          >
                            Explore Project
                            <ArrowForwardIcon className="arrow-icon" />
                          </ActionButton>
                        </Box>
                      </Box>
                    </ProjectCard>
                  </Box>
                ))
              ) : (
                <Box sx={{ gridColumn: "1 / -1", textAlign: "center", py: 10 }}>
                  <Typography color="textSecondary" variant="h6">
                    No projects found yet. Check back soon!
                  </Typography>
                </Box>
              )}
            </Box>
          </Container>
        </Box>
      </Box>

      <BottomInfo />
      <Footer />
    </>
  );
}
