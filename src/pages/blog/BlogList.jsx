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
import { getImgUrl, GetRequest } from "../../api/api";
import { GET_ALL_BLOGS } from "../../api/endpoints";
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
  shouldForwardProp: (prop) => prop !== "$hovered",
})(({ theme, $hovered }) => ({
  background: colors.background.card,
  borderRadius: "24px",
  overflow: "hidden",
  position: "relative",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  transform: $hovered ? "translateY(-12px)" : "translateY(0)",
  border: `1px solid ${$hovered ? colors.primary : alpha(colors.primary, 0.2)}`,
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
  height: "3.22em",
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
  height: "4.08em",   // FIXED: exactly 3 lines — no card size variation
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

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await GetRequest(`${GET_ALL_BLOGS}?limit=1000`);
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
                label="KNOWLEDGE HUB"
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
            <Box sx={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
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
                <Box key={blog.id || idx} sx={{ height: "480px" }}>
                  <BlogCard
                    $hovered={hoveredCard === idx}
                    onMouseEnter={() => setHoveredCard(idx)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => navigate(`/blogs/${blog.slug || blog.id}`)}
                    elevation={0}
                  >
                    <ImageContainer>
                      <StyledCardMedia
                        component="img"
                        image={getImgUrl(blog.image)}
                        alt={blog.title}
                        loading="lazy"
                      />
                    </ImageContainer>

                    <Box sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                      <MetaInfo>
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

                      <BlogTitle variant="h6">{blog.title}</BlogTitle>

                      <BlogDescription variant="body2">
                        {blog.short_description || blog.content?.substring(0, 150)}...
                      </BlogDescription>

                      <Box sx={{ mt: "auto", pt: 1 }}>
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
