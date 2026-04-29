import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  Grid,
  Chip,
  Paper,
  alpha,
  Button,
  Pagination,
  CardMedia,
  Breadcrumbs,
  Link,
  TextField,
  InputAdornment,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  IconButton,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PersonIcon from "@mui/icons-material/Person";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/Add";
import { getImgUrl, GetRequest, PostRequest } from "../../api/api";
import { GET_ALL_BLOGS, POST_STUDENT_BLOG } from "../../api/endpoints";
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
const BlogCard = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "$hovered" && prop !== "$isStudent",
})(({ theme, $hovered, $isStudent }) => ({
  background: $isStudent ? alpha(colors.primary, 0.03) : colors.background.card,
  borderRadius: "24px",
  overflow: "hidden",
  position: "relative",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  transform: $hovered ? "translateY(-12px)" : "translateY(0)",
  border: `1px solid ${$hovered ? colors.primary : $isStudent ? alpha(colors.primary, 0.4) : alpha(colors.primary, 0.2)}`,
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

const BlogTitle = styled(Typography)(({ theme }) => ({
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

const BlogDescription = styled(Typography)(({ theme }) => ({
  color: colors.textSecondary,
  fontSize: "0.85rem",
  lineHeight: 1.6,
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxHeight: "4.08em",   // FIXED: exactly 3 lines — no card size variation
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

const SearchWrapper = styled(Box)(({ theme }) => ({
  maxWidth: "650px",
  margin: "0 auto 32px auto",
  position: "relative",
  "& .MuiOutlinedInput-root": {
    borderRadius: "50px",
    backgroundColor: "#fff",
    boxShadow: "0 10px 30px -10px rgba(0,0,0,0.08)",
    transition: "all 0.3s ease",
    padding: "4px 20px",
    "& fieldset": {
      borderColor: alpha(colors.primary, 0.15),
    },
    "&:hover fieldset": {
      borderColor: colors.primary,
    },
    "&.Mui-focused": {
      boxShadow: `0 15px 40px -10px ${alpha(colors.primary, 0.15)}`,
      "& fieldset": {
        borderColor: colors.primary,
        borderWidth: "2px",
      },
    },
  },
}));

const CategoryChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "$active",
})(({ theme, $active }) => ({
  fontWeight: 700,
  fontSize: "0.9rem",
  padding: "20px 10px",
  borderRadius: "30px",
  backgroundColor: $active ? colors.primary : "transparent",
  color: $active ? "#fff" : colors.textPrimary,
  border: $active ? "none" : `1px solid ${alpha(colors.primary, 0.1)}`,
  transition: "all 0.3s ease",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: $active ? colors.primaryDark : alpha(colors.primary, 0.08),
  },
}));

const BlogList = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [page, setPage] = useState(1);
  const blogsPerPage = 12;

  // Student Blog Modal States
  const [openModal, setOpenModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    studentName: "",
    code: "",
    title: "",
    short_description: "",
    description: "",
    category: "Student Life",
  });
  const [studentProfilePic, setStudentProfilePic] = useState(null);
  const [blogImage, setBlogImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === "profile") setStudentProfilePic(file);
    else setBlogImage(file);
  };

  const handleStudentSubmit = async () => {
    if (!formData.studentName || !formData.code || !formData.title || !formData.short_description || !formData.description || !studentProfilePic || !blogImage) {
      alert("Please fill all fields and upload required images.");
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      data.append("studentProfilePic", studentProfilePic);
      data.append("image", blogImage);

      const res = await PostRequest(POST_STUDENT_BLOG, data);
      if (res?.success) {
        alert("Blog posted successfully! It will appear on the site once approved by the admin.");
        setOpenModal(false);
        // Refresh blogs
        const fetchRes = await GetRequest(`${GET_ALL_BLOGS}?limit=1000&approved=true`);
        setBlogs(fetchRes?.data?.data || []);
      } else {
        alert(res?.message || "Failed to post blog. Please check your code.");
      }
    } catch (error) {
      console.error("Error posting blog:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await GetRequest(`${GET_ALL_BLOGS}?limit=1000&approved=true`);
        setBlogs(res?.data?.data || []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
    window.scrollTo(0, 0);
  }, []);

  const categories = ["All", ...new Set(blogs.map((blog) => blog.category || "General"))];

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.short_description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || (blog.category || "General") === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const currentBlogs = filteredBlogs.slice((page - 1) * blogsPerPage, page * blogsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  return (
    <Box sx={{ bgcolor: colors.background.main, minHeight: "100vh" }}>
      <Navbar />

      <Box sx={{ pt: { xs: 2, md: 3 }, pb: 4 }}>
        <Container maxWidth="xl">
          {/* Header Section */}
          <Box
            sx={{
              textAlign: "center",
              mb: { xs: 4, md: 6 },
              animation: `${slideInUp} 0.6s ease-out`,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 2, position: "relative" }}>
              <Chip
                icon={<MenuBookIcon sx={{ fontSize: "16px !important", color: "inherit !important" }} />}
                label="KNOWLEDGE HUB"
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
                  px: 3,
                  py: 1,
                  borderRadius: "30px",
                  boxShadow: `0 10px 20px ${alpha(colors.primary, 0.3)}`,
                  "&:hover": {
                    bgcolor: colors.primaryDark,
                  }
                }}
              >
                Post Your Blog
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
              Insights & <span style={{ color: colors.primary }}>Innovation</span>
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
              Stay ahead with expert tech insights and industry success stories.
            </Typography>

            {/* Breadcrumbs */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
              <Breadcrumbs
                separator={<ChevronRightIcon sx={{ fontSize: "1rem", color: colors.textSecondary }} />}
                sx={{ bgcolor: alpha(colors.primary, 0.05), px: 3, py: 1, borderRadius: "30px" }}
              >
                <Link
                  component="button"
                  onClick={() => navigate("/")}
                  color="inherit"
                  sx={{ display: "flex", alignItems: "center", textDecoration: "none", fontSize: "0.85rem", fontWeight: 500 }}
                >
                  Home
                </Link>
                <Typography color="primary" sx={{ fontSize: "0.85rem", fontWeight: 700 }}>
                  Blogs
                </Typography>
              </Breadcrumbs>
            </Box>

            {/* Search Bar */}
            <SearchWrapper>
              <TextField
                fullWidth
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: colors.textSecondary }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <FilterListIcon sx={{ color: colors.textSecondary, cursor: "pointer" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </SearchWrapper>

            {/* Category Filters */}
            <Box sx={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap", mb: 4 }}>
              {categories.map((cat) => (
                <CategoryChip
                  key={cat}
                  label={cat}
                  $active={selectedCategory === cat}
                  onClick={() => { setSelectedCategory(cat); setPage(1); }}
                />
              ))}
            </Box>
          </Box>

          {/* Student Blog Modal */}
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
              Share Your Story
              <IconButton onClick={() => setOpenModal(false)}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Your Name"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleInputChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="4-Digit Code"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    margin="normal"
                    helperText="One-time use code from admin"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Blog Title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Short Description"
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
                    label="Full Content"
                    name="description"
                    multiline
                    rows={6}
                    value={formData.description}
                    onChange={handleInputChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Your Profile Picture</Typography>
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
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Blog Featured Image</Typography>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                    sx={{ height: "56px", borderRadius: "12px", borderStyle: "dashed" }}
                  >
                    {blogImage ? blogImage.name : "Upload Blog Image"}
                    <input type="file" hidden accept="image/*" onChange={(e) => handleFileChange(e, "blog")} />
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
                {submitting ? "Posting..." : "Publish Blog"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Blog Grid */}
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
            ) : currentBlogs.length > 0 ? (
              currentBlogs.map((blog, idx) => (
                <Box key={blog.id || idx}>
                  <BlogCard
                    $hovered={hoveredCard === idx}
                    $isStudent={blog.authorType === "Student"}
                    onMouseEnter={() => setHoveredCard(idx)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => navigate(`/blogs/${blog.slug || blog.id}`)}
                    elevation={0}
                  >
                    {blog.image && (
                      <ImageContainer>
                        {blog.authorType === "Student" && (
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
                          image={getImgUrl(blog.image)}
                          alt={blog.title}
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
                              {blog.createdAt
                                ? new Date(blog.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })
                                : "Recent"}
                            </span>
                          </div>
                          <div className="meta-item">
                            <VisibilityIcon />
                            <span>{blog.views?.toLocaleString() || 0}</span>
                          </div>
                        </MetaInfo>

                        {blog.authorType === "Student" && (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Avatar
                              src={getImgUrl(blog.studentProfilePic)}
                              sx={{ width: 24, height: 24, border: `1px solid ${colors.primary}` }}
                            />
                            <Typography variant="caption" sx={{ fontWeight: 700, color: colors.textPrimary }}>
                              {blog.studentName}
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      <BlogTitle variant="h6">{blog.title}</BlogTitle>

                      <BlogDescription variant="body2">
                        {blog.short_description || blog.content?.substring(0, 150)}...
                      </BlogDescription>

                      <Box sx={{ mt: 1, pt: 1 }}>
                        <ActionButton
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/blogs/${blog.slug || blog.id}`);
                          }}
                        >
                          Read Article
                          <ArrowForwardIcon className="arrow-icon" />
                        </ActionButton>
                      </Box>
                    </Box>
                  </BlogCard>
                </Box>
              ))
            ) : (
              <Box sx={{ gridColumn: "1 / -1", textAlign: "center", py: 10 }}>
                <Typography color="textSecondary" variant="h6">
                  No articles found matching your criteria.
                </Typography>
                <Button
                  onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
                  sx={{ mt: 2, color: colors.primary, fontWeight: 700 }}
                >
                  Clear all filters
                </Button>
              </Box>
            )}
          </Box>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ mt: 8, display: "flex", justifyContent: "center" }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                size="large"
                sx={{
                  "& .MuiPaginationItem-root": {
                    fontWeight: 700,
                    borderRadius: "12px",
                    "&.Mui-selected": {
                      bgcolor: colors.primary,
                      color: "white",
                      "&:hover": { bgcolor: colors.primaryDark },
                    },
                  },
                }}
              />
            </Box>
          )}
        </Container>
      </Box>

      <BottomInfo />
      <Footer />
    </Box>
  );
};

export default BlogList;
