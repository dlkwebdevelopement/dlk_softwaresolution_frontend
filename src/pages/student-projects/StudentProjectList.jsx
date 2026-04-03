import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { 
  ArrowRight, 
  Calendar, 
  Clock, 
  Eye, 
  ChevronRight,
  Code
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GetRequest } from "../../api/config";
import { GET_ALL_STUDENT_PROJECTS } from "../../api/endpoints";
import { getImgUrl } from "../../api/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import BottomInfo from "../../components/BottomInfo";

export default function StudentProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
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

      <Box sx={{ mt: { xs: 8, md: 12 }, minHeight: "80vh", pb: 10, bgcolor: "#f8faf7" }}>
        
        {/* HERO SECTION */}
        <Box
          sx={{
            background: `linear-gradient(135deg, #1a4718 0%, #3DB843 100%)`,
            py: { xs: 8, md: 12 },
            mb: 6,
            color: "white",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Container maxWidth="lg">
            <Typography 
              variant="h2" 
              fontWeight={900} 
              sx={{ 
                fontSize: { xs: "2rem", md: "3.5rem" },
                mb: 2,
                textShadow: "0 4px 12px rgba(0,0,0,0.1)"
              }}
            >
              Student Success Stories
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                opacity: 0.9, 
                maxWidth: "700px", 
                mx: "auto", 
                fontWeight: 500,
                lineHeight: 1.6
              }}
            >
              Explore the innovative and real-world projects developed by our talented students during their journey at DLK Software Solutions.
            </Typography>
          </Container>

          {/* Decorative icons */}
          <Code
            style={{
              position: "absolute",
              top: -20,
              right: -20,
              width: 180,
              height: 180,
              opacity: 0.1,
              transform: "rotate(15deg)",
              color: "white"
            }}
          />
        </Box>

        <Container maxWidth="xl">
          {/* BREADCRUMBS */}
          <Breadcrumbs 
            separator={<ChevronRight size={14} />} 
            sx={{ mb: 4 }}
          >
            <Link color="inherit" href="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              Home
            </Link>
            <Typography color="primary" fontWeight={600}>
              Student Projects
            </Typography>
          </Breadcrumbs>

          <Grid container spacing={4}>
            {loading ? (
              // SKELETON LOADERS
              Array.from(new Array(6)).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Skeleton 
                    variant="rectangular" 
                    height={400} 
                    sx={{ borderRadius: "24px" }} 
                  />
                </Grid>
              ))
            ) : projects.length > 0 ? (
              projects.map((project) => (
                <Grid item xs={12} sm={6} md={4} key={project.id}>
                  <Card
                    onClick={() => navigate(`/student-projects/${project.slug}`)}
                    sx={{
                      borderRadius: "24px",
                      overflow: "hidden",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      cursor: "pointer",
                      border: "1px solid rgba(0,0,0,0.05)",
                      "&:hover": {
                        transform: "translateY(-12px)",
                        boxShadow: "0 25px 50px rgba(61, 184, 67, 0.15)",
                        "& .MuiCardMedia-root": { transform: "scale(1.08)" },
                        "& .view-btn": { bgcolor: "#3DB843", color: "white" }
                      },
                    }}
                  >
                    <Box sx={{ position: "relative", overflow: "hidden", pt: "60%" }}>
                      <CardMedia
                        component="img"
                        image={getImgUrl(project.image)}
                        alt={project.title}
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.6s ease",
                        }}
                      />
                      <Box sx={{ position: "absolute", top: 16, left: 16, zIndex: 2 }}>
                        <Chip
                          label={project.short_description?.split(',')[0] || "Innovation"}
                          sx={{
                            bgcolor: "rgba(255,255,255,0.9)",
                            backdropFilter: "blur(4px)",
                            fontWeight: 700,
                            color: "#1a4718",
                            fontSize: "0.75rem"
                          }}
                        />
                      </Box>
                    </Box>

                    <CardContent sx={{ p: 4, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                      <Stack direction="row" spacing={2} sx={{ mb: 2, color: "text.secondary" }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Calendar size={14} strokeWidth={2.5} color="#3DB843" />
                          <Typography variant="caption" fontWeight={700}>{formatDate(project.createdAt)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Eye size={14} strokeWidth={2.5} color="#D3F36B" />
                          <Typography variant="caption" fontWeight={700}>{project.views || 0} views</Typography>
                        </Box>
                      </Stack>

                      <Typography
                        variant="h5"
                        fontWeight={700}
                        sx={{
                          mb: 2,
                          lineHeight: 1.3,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          color: "#111c12"
                        }}
                      >
                        {project.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 3,
                          lineHeight: 1.6,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {project.short_description}
                      </Typography>

                      <Box sx={{ mt: "auto" }}>
                        <Button
                          className="view-btn"
                          endIcon={<ArrowRight size={18} />}
                          fullWidth
                          sx={{
                            bgcolor: "rgba(61, 184, 67, 0.08)",
                            color: "#3DB843",
                            fontWeight: 700,
                            borderRadius: "12px",
                            py: 1.5,
                            textTransform: "none",
                            transition: "all 0.3s ease",
                          }}
                        >
                          Explore Project
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Box sx={{ textAlign: "center", py: 10 }}>
                  <Typography variant="h5" color="text.secondary">
                    No projects found yet. Check back soon!
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>

      <BottomInfo />
      <Footer />
    </>
  );
}
