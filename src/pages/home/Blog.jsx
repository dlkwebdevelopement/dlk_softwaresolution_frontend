import React, { useState } from "react";
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
  Paper,
  Avatar,
  Rating,
  alpha,
  Fade,
  Grow,
  Zoom,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useTheme, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GetRequest } from "../../api/config";
import { GET_ALL_BLOGS } from "../../api/endpoints";
import { getImgUrl } from "../../api/api";

// Animations
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(61, 184, 67, 0.4); }
  70% { box-shadow: 0 0 0 20px rgba(61, 184, 67, 0); }
  100% { box-shadow: 0 0 0 0 rgba(61, 184, 67, 0); }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const rotateGradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const scrollLeft = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

// Color scheme
const colors = {
  primary: "#3DB843",
  secondary: "#D3F36B",
  dark: "#1a4718",
  light: "#ffffff",
  grey: "#f5f5f5",
  textPrimary: "#111c12",
  textSecondary: "#2e9133",
  accent: "#c2eac4",
  background: {
    main: "#fbfdf3",
    light: "#ffffff",
    gradient: "linear-gradient(180deg, #fbfdf3 0%, #ffffff 100%)",
  }
};

// Styled Components
const GlassCard = styled(({ $hovered, ...other }) => <Paper {...other} />)(({ theme, $hovered }) => ({
  background: 'rgba(255, 255, 255, 0.4)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(72, 114, 62, 0.1)',
  borderRadius: '32px',
  overflow: 'hidden',
  position: 'relative',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  transform: $hovered ? 'translateY(-12px)' : 'translateY(0)',
  boxShadow: $hovered
    ? '0 25px 50px -12px rgba(72, 114, 62, 0.2)'
    : '0 10px 30px -12px rgba(72, 114, 62, 0.1)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  width: 380, // Matched with Comments.jsx
  margin: theme.spacing(0, 2),
  [theme.breakpoints.down('sm')]: {
    width: 300,
    margin: theme.spacing(0, 1),
  }
}));

const GradientText = styled('span')({
  background: 'linear-gradient(135deg, var(--green), var(--green-mid))',
  backgroundSize: '200% 200%',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: `${rotateGradient} 3s ease infinite`,
});

const FloatingElement = styled(Box)({
  animation: `${floatAnimation} 3s ease-in-out infinite`,
});

const MarqueeContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  overflowX: 'auto',
  [theme.breakpoints.up('md')]: {
    overflowX: 'hidden',
  },
  position: 'relative',
  padding: theme.spacing(4, 0),
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': { display: 'none' },
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    width: '150px',
    height: '100%',
    zIndex: 2,
    pointerEvents: 'none',
  },
  '&::before': {
    left: 0,
    background: 'linear-gradient(90deg, #f8faf7 0%, transparent 100%)',
  },
  '&::after': {
    right: 0,
    background: 'linear-gradient(-90deg, #f8faf7 0%, transparent 100%)',
  },
  [theme.breakpoints.down('sm')]: {
    '&::before, &::after': {
      width: '60px',
    },
  },
}));

const CategoryChip = styled(Chip)({
  background: alpha("#83a561", 0.2),
  color: "#48723e",
  fontWeight: 600,
  fontSize: '0.85rem',
  borderRadius: '30px',
  border: `1px solid ${alpha("#48723e", 0.2)}`,
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  '& .MuiChip-label': {
    padding: '6px 12px',
  },
});

const MarqueeTrack = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$blogsCount'
})(({ $blogsCount }) => ({
  display: 'flex',
  width: 'max-content',
  animation: `${scrollLeft} ${($blogsCount || 1) * 12}s linear infinite`,
  '&:hover': {
    animationPlayState: 'paused',
  },
  '&:active': {
    animationPlayState: 'paused',
  },
}));

const BackgroundOrb = styled(Box)(({ size, top, right, color }) => ({
  position: 'absolute',
  width: size,
  height: size,
  borderRadius: '50%',
  background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
  top,
  right,
  filter: 'blur(60px)',
  animation: `${floatAnimation} ${15 + Math.random() * 10}s ease-in-out infinite`,
  pointerEvents: 'none',
  zIndex: 0,
}));

const Blog = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [bookmarked, setBookmarked] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
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

  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const itemsPerPage = isTablet || isMobile ? 1 : 3;

  React.useEffect(() => {
    setCurrentIndex(0);
  }, [itemsPerPage]);

  const handleNext = () => {
    if (!blogs.length) return;
    setCurrentIndex((prevIndex) =>
      prevIndex + itemsPerPage >= blogs.length ? 0 : prevIndex + itemsPerPage,
    );
  };

  const handlePrev = () => {
    if (!blogs.length) return;
    setCurrentIndex((prevIndex) =>
      prevIndex - itemsPerPage < 0
        ? Math.max(blogs.length - itemsPerPage, 0)
        : prevIndex - itemsPerPage,
    );
  };

  const handleBookmark = (blogId, e) => {
    e.stopPropagation();
    setBookmarked((prev) =>
      prev.includes(blogId)
        ? prev.filter((id) => id !== blogId)
        : [...prev, blogId],
    );
  };

  const loopBlogs = blogs.length > 0 ? [...blogs, ...blogs] : [];

  // Loading skeleton
  if (loading) {
    return (
      <Box sx={{ py: 8, bgcolor: colors.background.main }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: colors.textPrimary }}>
              Loading <span style={{ color: colors.primary }}>Articles</span>
            </Typography>
          </Box>
          <Grid container spacing={3} justifyContent="center">
            {[1, 2, 3].map((i) => (
              <Grid item xs={12} md={4} key={i}>
                <Box sx={{
                  height: 400,
                  borderRadius: '30px',
                  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                  backgroundSize: '200% 100%',
                  animation: `${shimmer} 1.5s infinite`,
                }} />
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
        py: { xs: 6, md: 10 },
        background: colors.background.gradient,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Orbs */}
      <BackgroundOrb size="500px" top="-10%" right="-5%" color="rgba(61, 184, 67, 0.1)" />
      <BackgroundOrb size="400px" bottom="-10%" left="-5%" color="rgba(211, 243, 107, 0.1)" />

      {/* Floating Particles */}
      {[...Array(12)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: 5 + i * 3,
            height: 5 + i * 3,
            borderRadius: '50%',
            background: alpha(colors.secondary, 0.1),
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            filter: 'blur(2px)',
            animation: `${floatAnimation} ${15 + i * 2}s ease-in-out infinite`,
            pointerEvents: 'none',
          }}
        />
      ))}

      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Chip
              label="LATEST ARTICLES"
              icon={<MenuBookIcon sx={{ fontSize: 18, color: 'var(--green-dark) !important' }} />}
              sx={{
                bgcolor: 'var(--green-light)',
                color: 'var(--green-dark)',
                fontWeight: 800,
                letterSpacing: 1,
                border: '1px solid var(--green-mid)',
                '& .MuiChip-label': { px: 2 }
              }}
            />
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              mb: 2.5,
              fontSize: { xs: '2.25rem', md: '3.75rem' },
              color: 'var(--green-dark)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1
            }}
          >
            <Box component="span" sx={{ color: 'black' }}>Insights &</Box> Future Tech
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#6b8f76',
              maxWidth: "650px",
              mx: "auto",
              fontSize: "1.15rem",
              lineHeight: 1.7,
              mb: 2
            }}
          >
            Stay ahead of the curve with expert perspectives and deep dives into the software solutions shaping tomorrow's digital landscape.
          </Typography>
        </Box>

        {/* Blog Marquee Section */}
        <MarqueeContainer>
          <MarqueeTrack $blogsCount={blogs.length}>
            {loopBlogs.map((blog, index) => (
              <Box key={`${blog.id || 'blog'}-${index}`} sx={{ py: 2 }}>
                <GlassCard
                  $hovered={hoveredCard === index}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => navigate(`/blogs/${blog.slug}`)}
                >
                  {/* Image Container */}
                  <Box sx={{ position: "relative", pt: '60%', overflow: 'hidden' }}>
                    <CardMedia
                      component="img"
                      image={getImgUrl(blog.image)}
                      alt={blog.title}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                        transform: hoveredCard === index ? "scale(1.1)" : "scale(1)",
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 20,
                        left: 20,
                        zIndex: 2
                      }}
                    >
                      <CategoryChip
                        label={blog.short_description?.split(',')[0] || "Featured"}
                        sx={{
                          background: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(4px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Content Area */}
                  <Box sx={{ p: 3.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: colors.textPrimary }}>
                        <CalendarMonthIcon sx={{ fontSize: 16, color: colors.primary }} />
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                        </Typography>
                      </Box>
                      <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'divider' }} />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: colors.textPrimary }}>
                        <AccessTimeIcon sx={{ fontSize: 16, color: colors.secondary }} />
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>3 min read</Typography>
                      </Box>
                    </Box>

                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 800,
                        lineHeight: 1.3,
                        color: colors.textPrimary,
                        mb: 2.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        fontSize: '1.25rem',
                        minHeight: '3.2rem'
                      }}
                    >
                      {blog.title}
                    </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: '#6b8f76',
                          lineHeight: 1.6,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          mb: 3,
                          fontSize: '0.95rem'
                        }}
                      >
                        {blog.short_description || blog.content?.replace(/<[^>]*>?/gm, '').substring(0, 150)}
                      </Typography>

                      <Box sx={{ mt: 'auto' }}>
                        <Button
                          onClick={() => navigate(`/blogs/${blog.slug}`)}
                          endIcon={<ArrowForwardIosIcon sx={{ fontSize: '12px !important' }} />}
                          sx={{
                            color: colors.primary,
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            textTransform: 'none',
                            p: 0,
                            '&:hover': {
                              background: 'transparent',
                              color: colors.dark,
                              '& .MuiButton-endIcon': { transform: 'translateX(4px)' }
                            },
                            transition: 'all 0.3s ease'
                          }}
                        >
                          Read More
                        </Button>
                      </Box>
                  </Box>
                </GlassCard>
              </Box>
            ))}
          </MarqueeTrack>
        </MarqueeContainer>

      </Container>
    </Box>
  );
};

export default Blog;