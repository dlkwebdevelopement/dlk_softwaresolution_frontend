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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Avatar,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/Add";
import { getImgUrl, GetRequest, PostRequest } from "../../api/api";
import { GET_ALL_STUDENT_PROJECTS, POST_STUDENT_PROJECT } from "../../api/endpoints";
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
  shouldForwardProp: (prop) => prop !== "$hovered" && prop !== "$isStudent",
})(({ theme, $hovered, $isStudent }) => ({
  background: $isStudent ? alpha(colors.primary, 0.03) : colors.background.card,
  borderRadius: "24px",
  overflow: "hidden",
  position: "relative",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  transform: $hovered ? "translateY(-12px)" : "translateY(0)",
  border: `1px solid ${$hovered ? colors.primary : $isStudent ? alpha(colors.primary, 0.4) : alpha(colors.primary, 0.1)}`,
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
  maxHeight: "3.22em",
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
  maxHeight: "4.08em",
  marginBottom: 10,
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

  // Student Project Modal States
  const [openModal, setOpenModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    studentName: "",
    code: "",
    title: "",
    short_description: "",
    description: "",
  });
  const [studentProfilePic, setStudentProfilePic] = useState(null);
  const [projectImage, setProjectImage] = useState(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      // Fetch with approved=true filter
      const res = await GetRequest(`${GET_ALL_STUDENT_PROJECTS}?approved=true&limit=1000`);
      setProjects(res?.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === "profile") setStudentProfilePic(file);
    else setProjectImage(file);
  };

  const handleStudentSubmit = async () => {
    if (!formData.studentName || !formData.code || !formData.title || !formData.short_description || !formData.description || !studentProfilePic || !projectImage) {
      alert("Please fill all fields and upload required images.");
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      data.append("studentProfilePic", studentProfilePic);
      data.append("image", projectImage);

      const res = await PostRequest(POST_STUDENT_PROJECT, data);
      if (res?.success) {
        alert("Project submitted successfully! It will appear on the site once approved by the admin.");
        setOpenModal(false);
        // Clear form
        setFormData({
          studentName: "",
          code: "",
          title: "",
          short_description: "",
          description: "",
        });
        setStudentProfilePic(null);
        setProjectImage(null);
        fetchProjects();
      } else {
        alert(res?.message || "Failed to submit project. Please check your code.");
      }
    } catch (error) {
      console.error("Error submitting project:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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
        <Box sx={{ pt: { xs: 2, md: 4 }, pb: 4 }}>
          <Container maxWidth="xl">
            {/* Header Section */}
            <Box
              sx={{
                textAlign: "center",
                mb: { xs: 3, md: 4 },
                animation: `${slideInUp} 0.6s ease-out`,
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 2, position: "relative" }}>
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
                
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenModal(true)}
                  sx={{
                    position: "absolute",
                    right: 0,
                    bgcolor: colors.primary,
                    color: "white",
                    fontWeight: 700,
                    px: { xs: 2, md: 3 },
                    py: 1,
                    borderRadius: "30px",
                    boxShadow: `0 10px 20px ${alpha(colors.primary, 0.3)}`,
                    "&:hover": {
                      bgcolor: colors.primaryDark,
                    }
                  }}
                >
                  Post Your Project
                </Button>
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

            {/* Student Project Modal */}
            <Dialog
              open={openModal}
              onClose={() => setOpenModal(false)}
              maxWidth="md"
              fullWidth
              PaperProps={{
                sx: { borderRadius: "24px", p: 1 }
              }}
            >
              <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 800, fontSize: "1.5rem" }}>
                Share Your Project
                <IconButton onClick={() => setOpenModal(false)}>
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent dividers>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Student Name"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleInputChange}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="4-Digit Project Code"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      margin="normal"
                      helperText="One-time use project code from admin"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Project Title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Short Summary"
                      name="short_description"
                      multiline
                      rows={2}
                      value={formData.short_description}
                      onChange={handleInputChange}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Detailed Description"
                      name="description"
                      multiline
                      rows={6}
                      value={formData.description}
                      onChange={handleInputChange}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Profile Picture</Typography>
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<CloudUploadIcon />}
                      fullWidth
                      sx={{ height: "56px", borderRadius: "12px", borderStyle: "dashed" }}
                    >
                      {studentProfilePic ? studentProfilePic.name : "Upload Profile Pic"}
                      <input type="file" hidden accept="image/*" onChange={(e) => handleFileChange(e, "profile")} />
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Project Image</Typography>
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<CloudUploadIcon />}
                      fullWidth
                      sx={{ height: "56px", borderRadius: "12px", borderStyle: "dashed" }}
                    >
                      {projectImage ? projectImage.name : "Upload Project Image"}
                      <input type="file" hidden accept="image/*" onChange={(e) => handleFileChange(e, "project")} />
                    </Button>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button onClick={() => setOpenModal(false)} sx={{ fontWeight: 700, color: colors.textSecondary }}>Cancel</Button>
                <Button
                  onClick={handleStudentSubmit}
                  variant="contained"
                  disabled={submitting}
                  sx={{
                    bgcolor: colors.primary,
                    fontWeight: 700,
                    px: 4,
                    borderRadius: "12px",
                    "&:hover": { bgcolor: colors.primaryDark }
                  }}
                >
                  {submitting ? "Submitting..." : "Submit Project"}
                </Button>
              </DialogActions>
            </Dialog>

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
                  <Box key={project.id || idx}>
                    <ProjectCard
                      $hovered={hoveredCard === idx}
                      $isStudent={project.authorType === "Student"}
                      onMouseEnter={() => setHoveredCard(idx)}
                      onMouseLeave={() => setHoveredCard(null)}
                      onClick={() => navigate(`/student-projects/${project.slug || project.id}`)}
                      elevation={0}
                    >
                      {project.image && (
                        <ImageContainer>
                          {project.authorType === "Student" && (
                            <Chip
                              label="STUDENT"
                              size="small"
                              sx={{
                                position: "absolute",
                                top: 16,
                                left: 16,
                                zIndex: 2,
                                bgcolor: colors.primary,
                                color: "white",
                                fontWeight: 900,
                                fontSize: "0.65rem",
                                height: "22px",
                                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                              }}
                            />
                          )}
                          <StyledCardMedia
                            component="img"
                            image={getImgUrl(project.image)}
                            alt={project.title}
                            loading="lazy"
                          />
                        </ImageContainer>
                      )}

                      <Box sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
                          <MetaInfo sx={{ mb: 0 }}>
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
                              <span>{project.views?.toLocaleString() || 0}</span>
                            </div>
                          </MetaInfo>

                          {project.authorType === "Student" && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Avatar
                                src={getImgUrl(project.studentProfilePic)}
                                sx={{ width: 24, height: 24, border: `1px solid ${colors.primary}` }}
                              />
                              <Typography variant="caption" sx={{ fontWeight: 700, color: colors.textPrimary }}>
                                {project.studentName?.split(" ")[0]}
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        <ProjectTitle variant="h6">{project.title}</ProjectTitle>

                        <ProjectDescription variant="body2">
                          {project.short_description}
                        </ProjectDescription>

                        <Box sx={{ mt: 1, pt: 1 }}>
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
