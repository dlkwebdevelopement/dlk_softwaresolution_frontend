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
  Chip,
  Stack
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import {
  Calendar as CalendarMonthIcon,
  ArrowRight as ArrowForwardIcon,
  Eye as VisibilityIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  BookOpen as MenuBookIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GetRequest } from "../../api/api";
import { GET_ALL_BLOGS } from "../../api/endpoints";
import { getImgUrl } from "../../api/api";

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
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
  border: "#d4ead5",
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

const ScrollTrack = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '16px', // Reduced gap for "no space gaps"
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
  [$direction === 'left' ? 'left' : 'right']: -20,
  zIndex: 10,
  backgroundColor: 'white',
  color: colors.primary,
  boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
  transition: 'all 0.4s ease',
  opacity: 0, // Hidden by default, shown on hover
  '&:hover': {
    backgroundColor: colors.primary,
    color: 'white',
    transform: 'translateY(-50%) scale(1.1)',
  },
  [theme.breakpoints.down('lg')]: { display: 'none' },
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

const ActionButton = styled(Button)(({ theme }) => ({
  color: colors.primary,
  fontWeight: 700,
  fontSize: "0.85rem",
  textTransform: "none",
  padding: "0",
  minWidth: "auto",
  background: "transparent",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "transparent",
    color: colors.primaryDark,
    transform: "translateX(4px)",
  },
}));

const BlogTitle = styled(Typography)({
  fontWeight: 700,
  fontSize: "1rem",
  lineHeight: 1.4,
  color: colors.textPrimary,
  marginBottom: 12,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  height: "2.8em",
});

const BlogDescription = styled(Typography)({
  color: colors.textSecondary,
  fontSize: "0.85rem",
  lineHeight: 1.6,
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  height: "4.8em",
  marginBottom: 20,
});

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

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

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch =
        blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.short_description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [blogs, searchTerm]);

  useEffect(() => {
    let interval;
    if (isAutoScrolling && filteredBlogs.length > 3) {
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

  if (loading) {
    return (
      <Box sx={{ py: 8, bgcolor: colors.background.main, minHeight: "60vh" }}>
        <Container maxWidth="xl">
          <Grid container spacing={2} justifyContent="center">
            {[1, 2, 3, 4].map((i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Box sx={{ height: 480, borderRadius: "24px", overflow: "hidden", bgcolor: 'white' }}>
                  <Skeleton variant="rectangular" height={180} />
                  <Box sx={{ p: 3 }}>
                    <Skeleton variant="text" width="60%" height={24} />
                    <Skeleton variant="text" width="90%" height={40} />
                    <Skeleton variant="text" width="100%" height={80} sx={{ mt: 2 }} />
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
        pt: 1,
        pb: { xs: 6, md: 8 },
        background: colors.background.gradient,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ textAlign: "center", mb: { xs: 3, md: 4 } }}>
          <Chip
            label="KNOWLEDGE HUB"
            icon={<MenuBookIcon size={14} />}
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
              fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
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
              maxWidth: "750px",
              mx: "auto",
              fontSize: "1.1rem",
              fontWeight: 500,
              lineHeight: 1.6,
              mb: 3
            }}
          >
            Stay ahead of the curve with expert perspectives and deep dives into the software solutions shaping tomorrow's digital landscape.
          </Typography>

          <Box sx={{ mt: 1 }}>
            <Button
              variant="contained"
              onClick={() => navigate("/blogs")}
              endIcon={<ArrowForwardIcon size={18} />}
              sx={{
                bgcolor: colors.primary,
                color: "white",
                px: 5,
                py: 1.5,
                borderRadius: "50px",
                fontWeight: 800,
                fontSize: "0.95rem",
                textTransform: "none",
                boxShadow: `0 10px 20px ${alpha(colors.primary, 0.2)}`,
                "&:hover": {
                  bgcolor: colors.primaryDark,
                  transform: "translateY(-2px)",
                  boxShadow: `0 15px 30px ${alpha(colors.primary, 0.3)}`,
                },
                transition: "all 0.3s ease"
              }}
            >
              View More Insights
            </Button>
          </Box>
        </Box>

        <ScrollContainer>
          <ScrollButton $direction="left" onClick={() => scroll('left')} className="scroll-button">
            <ChevronLeftIcon size={20} />
          </ScrollButton>

          <ScrollTrack
            ref={scrollRef}
            onMouseEnter={() => setIsAutoScrolling(false)}
            onMouseLeave={() => setIsAutoScrolling(true)}
          >
            {filteredBlogs.map((blog, idx) => (
              <Box
                key={blog.id || idx}
                sx={{
                  width: { xs: "280px", sm: "300px", md: "calc((100% - 48px) / 4)" }, // Adjusted for 16px gap
                  height: "480px",
                  flexShrink: 0,
                }}
              >
                <GlassCard
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
                      sx={{ transform: hoveredCard === idx ? "scale(1.1)" : "scale(1)" }}
                    />
                    <Box sx={{ position: "absolute", top: 12, left: 12 }}>
                      <Chip
                        label="Technology"
                        size="small"
                        sx={{ bgcolor: alpha(colors.primary, 0.9), color: 'white', fontWeight: 700, fontSize: '0.65rem', backdropFilter: 'blur(4px)', border: `1px solid ${alpha('#ffffff', 0.2)}` }}
                      />
                    </Box>
                  </ImageContainer>

                  <Box sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    <Stack direction="row" spacing={1.5} sx={{ mb: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: colors.textPrimary }}>
                        <CalendarMonthIcon size={12} />
                        <Typography variant="caption" sx={{ fontWeight: 500 }}>
                          {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Recent"}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: colors.textPrimary }}>
                        <VisibilityIcon size={12} />
                        <Typography variant="caption" sx={{ fontWeight: 500 }}>
                          {blog.views?.toLocaleString() || 0}
                        </Typography>
                      </Box>
                    </Stack>

                    <BlogTitle variant="h6">{blog.title}</BlogTitle>

                    <BlogDescription variant="body2">
                      {blog.short_description || blog.content?.substring(0, 150)}...
                    </BlogDescription>

                    <Box sx={{ mt: "auto", pt: 2, borderTop: `1px solid ${alpha(colors.primary, 0.1)}` }}>
                      <ActionButton>
                        Read Article <ArrowForwardIcon size={14} style={{ marginLeft: 6 }} />
                      </ActionButton>
                    </Box>
                  </Box>
                </GlassCard>
              </Box>
            ))}
          </ScrollTrack>

          <ScrollButton $direction="right" onClick={() => scroll('right')} className="scroll-button">
            <ChevronRightIcon size={20} />
          </ScrollButton>
        </ScrollContainer>
      </Container>
    </Box>
  );
};

export default Blog;