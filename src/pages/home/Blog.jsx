import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Box,
  CardMedia,
  Typography,
  Grid,
  Button,
  Container,
  alpha,
  Skeleton,
  IconButton,
  Paper,
  TextField,
  InputAdornment,
  Chip,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PersonIcon from "@mui/icons-material/Person";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useNavigate } from "react-router-dom";
import { GetRequest } from "../../api/api";
import { GET_ALL_BLOGS } from "../../api/endpoints";
import { getImgUrl } from "../../api/api";

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
  flex: 1,               // fills the full height of its flex-column parent
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
  "&::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.3) 100%)",
    pointerEvents: "none",
  },
  [theme.breakpoints.down("sm")]: {
    paddingTop: "66.67%",
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
      [theme.breakpoints.down("sm")]: {
        fontSize: 12,
      },
    },
    "& span": {
      fontSize: "0.75rem",
      fontWeight: 500,
      color: colors.textSecondary,
      [theme.breakpoints.down("sm")]: {
        fontSize: "0.7rem",
      },
    },
  },
  [theme.breakpoints.down("sm")]: {
    gap: 8,
    marginBottom: 8,
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
  height: "3.22em",          // FIXED: exactly 2 lines at lineHeight 1.4 + small buffer
  transition: "color 0.2s ease",
  [theme.breakpoints.down("sm")]: {
    fontSize: "1rem",
    height: "2.9em",
    marginBottom: 8,
  },
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
  height: "4.08em",          // FIXED: exactly 3 lines at lineHeight 1.6 - no shifting
  marginBottom: 16,
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.8rem",
    height: "3.84em",
    marginBottom: 12,
  },
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
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.85rem",
  },
}));

const NavigationButton = styled(IconButton)(({ theme }) => ({
  background: colors.light,
  boxShadow: `0 4px 12px -4px ${alpha(colors.dark, 0.1)}`,
  border: `1px solid ${alpha(colors.primary, 0.15)}`,
  color: colors.primary,
  width: 44,
  height: 44,
  transition: "all 0.3s ease",
  "&:hover": {
    background: colors.primary,
    color: "#fff",
    transform: "scale(1.08) translateY(-2px)",
    borderColor: "transparent",
    boxShadow: `0 10px 20px -6px ${alpha(colors.primary, 0.4)}`,
  },
  "&.Mui-disabled": { opacity: 0.35, background: colors.background.main },
  [theme.breakpoints.down("sm")]: {
    width: 36,
    height: 36,
    "& svg": { fontSize: 18 },
  },
}));

const DotIndicator = styled(Box)(({ $active }) => ({
  width: $active ? 32 : 8,
  height: 6,
  borderRadius: 3,
  background: $active
    ? `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`
    : alpha(colors.primary, 0.2),
  transition: "all 0.3s ease",
  cursor: "pointer",
  "&:hover": {
    background: colors.primary,
    opacity: 0.75,
    width: $active ? 32 : 16,
  },
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
  alignItems: 'stretch',
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

const SearchWrapper = styled(Box)(({ theme }) => ({
  maxWidth: "650px",
  margin: "0 auto 32px auto",
  position: "relative",
  animation: `${slideInUp} 0.7s ease-out`,
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

const CategoryContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  gap: "12px",
  flexWrap: "wrap",
  marginBottom: "48px",
  animation: `${slideInUp} 0.8s ease-out`,
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
  border: $active ? "none" : `1px solid transparent`,
  transition: "all 0.3s ease",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: $active ? colors.primaryDark : alpha(colors.primary, 0.08),
  },
}));

// Main Component
const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  // 1. Fetch data
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await GetRequest(GET_ALL_BLOGS);
        setBlogs(res?.data?.data || []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // 2. Memoize category and filters
  const categories = useMemo(() => ["All", ...new Set(blogs.map((blog) => blog.category || "General"))], [blogs]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch =
        blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.short_description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || (blog.category || "General") === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [blogs, searchTerm, selectedCategory]);

  // 3. Auto-scroll logic (pauses on hover)
  useEffect(() => {
    let interval;
    if (isAutoScrolling && filteredBlogs.length > 3) { // Only scroll if there are more than 3 blogs
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
  }, [isAutoScrolling, filteredBlogs]);

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

  // Loading skeleton
  if (loading) {
    return (
      <Box sx={{ py: 8, bgcolor: colors.background.main, minHeight: "60vh" }}>
        <Container maxWidth="lg">
          <Grid container spacing={3} justifyContent="center">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                <Box sx={{ height: "100%" }}>
                  <Skeleton
                    variant="rectangular"
                    height={240}
                    sx={{ borderRadius: "24px 24px 0 0" }}
                  />
                  <Box sx={{ p: 2 }}>
                    <Skeleton variant="text" width="60%" height={24} />
                    <Skeleton variant="text" width="40%" height={20} />
                    <Skeleton variant="text" width="90%" height={60} />
                    <Skeleton variant="rectangular" width="100px" height={32} sx={{ borderRadius: "30px" }} />
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: colors.background.main,
        position: "relative",
        overflow: "hidden",
      }}
    >
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
            Insights & <span style={{ color: colors.primary }}>Future Tech</span>
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
            Stay ahead of the curve with expert perspectives and deep dives into the software solutions shaping tomorrow's digital landscape.
          </Typography>

          {/* Category Filters */}
          <CategoryContainer>
            {categories.map((cat) => (
              <CategoryChip
                key={cat}
                label={cat}
                $active={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
              />
            ))}
          </CategoryContainer>
        </Box>

        {/* Blog Scroll Track */}
        <ScrollContainer>
          <ScrollButton $direction="left" onClick={() => scroll('left')} className="scroll-button">
            <ChevronLeftIcon />
          </ScrollButton>

          <ScrollTrack
            ref={scrollRef}
            onMouseEnter={() => setIsAutoScrolling(false)}
            onMouseLeave={() => setIsAutoScrolling(true)}
          >
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map((blog, idx) => (
                <Box
                  key={blog.id || idx}
                  sx={{
                    width: { xs: "280px", sm: "300px", md: "calc((100% - 90px) / 4)" },
                    height: "480px",   // FIXED HEIGHT — every card identical
                    flexShrink: 0,
                  }}
                >
                  <BlogCard
                    $hovered={hoveredCard === idx}
                    onMouseEnter={() => setHoveredCard(idx)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => navigate(`/blogs/${blog.slug || blog.id}`)}
                    elevation={0}
                  >
                    {/* Image Section */}
                    <ImageContainer>
                      <StyledCardMedia
                        component="img"
                        image={getImgUrl(blog.image)}
                        alt={blog.title}
                        loading="lazy"
                      />
                    </ImageContainer>

                    {/* Content Section */}
                    <Box
                      sx={{
                        p: { xs: 2.5, sm: 3 },
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
                          <PersonIcon />
                          <span>{blog.author || "Admin"}</span>
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

                      {/* Footer */}
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
              <Box sx={{ width: "100%", textAlign: "center", py: 4 }}>
                <Typography color="textSecondary">No blogs found matching your criteria.</Typography>
              </Box>
            )}
          </ScrollTrack>

          <ScrollButton $direction="right" onClick={() => scroll('right')} className="scroll-button">
            <ChevronRightIcon />
          </ScrollButton>
        </ScrollContainer>
      </Container>
    </Box>
  );
};

export default Blog;