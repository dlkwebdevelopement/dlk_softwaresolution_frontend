import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Avatar,
  Fade,
  alpha,
  Container,
  Rating,
  Grow,
  Zoom,
  Slide,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import {
  FavoriteBorder,
  Phone,
  School,
  AccessTime,
  People,
  Star,
  TrendingUp,
  BookmarkBorder,
  Share,
  Close,
  CheckCircle,
  CalendarToday,
  MenuBook,
  FavoriteRounded,
  FavoriteTwoTone,
  ArrowBackIosNew,
  ArrowForwardIos,
  PlayCircleOutline,
  Verified,
  EmojiEvents,
  WorkspacePremium,
  Group,
  Timeline,
} from "@mui/icons-material";
import { GetRequest, PostRequest } from "../../api/config";
import {
  ADMIN_GET_CATEGORIES,
  ADMIN_POST_REGISTRATIONS,
} from "../../api/endpoints";
import { BASE_URL, getImgUrl } from "../../api/api";

// Animations
const floatAnimation = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-10px) rotate(1deg); }
  66% { transform: translateY(5px) rotate(-1deg); }
  100% { transform: translateY(0px) rotate(0deg); }
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

const rotateGradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
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

// Color scheme
const colors = {
  primary: "#3DB843",
  secondary: "#D3F36B",
  dark: "#1a4718",
  light: "#ffffff",
  grey: "#f5f5f5",
  textPrimary: "#fbfdf3",
  textSecondary: "#c2eac4",
  accent: "#D3F36B",
  background: {
    dark: "#fbfdf3",
    medium: "#f0f5eb",
    light: "#ffffff",
  }
};

// Styled Components
const GlassCard = styled(({ $hovered, ...other }) => <Paper {...other} />)(({ theme, $hovered }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid var(--green-dark, #1a4718)', // Changed to dark green outline
  borderRadius: '24px',
  overflow: 'hidden',
  position: 'relative',
  transition: 'all 0.3s ease-in-out',
  transform: $hovered ? 'scale(1.02)' : 'scale(1)',
  boxShadow: $hovered
    ? '0 10px 30px rgba(72, 114, 62, 0.15)'
    : '0 4px 15px rgba(0, 0, 0, 0.05)',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(61,184,67,0.1) 0%, rgba(61,184,67,0.05) 100%)',
    borderRadius: 'inherit',
    pointerEvents: 'none',
  },
}));

const GradientText = styled('span')({
  background: 'linear-gradient(135deg, var(--green), var(--green-dark))',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  display: 'inline-block',
});

const AnimatedButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #3DB843, #D3F36B)',
  color: '#0a1a05',
  borderRadius: '50px',
  padding: '8px 10px',
  fontWeight: 700,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 10px 20px rgba(191, 219, 129, 0.2)',
  },
}));

const StatsCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  borderRadius: '16px',
  padding: theme.spacing(1.2, 2.5),
  border: '1px solid var(--green-light)',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  transition: 'all 0.3s ease',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
  '&:hover': {
    transform: 'translateY(-3px)',
    background: 'rgba(191, 219, 129, 0.1)',
    borderColor: 'rgba(191, 219, 129, 0.3)',
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

const Ads = () => {
  const navigate = useNavigate();
  const sliderRef = useRef(null);

  const [cats, setCats] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isHoveringSlider, setIsHoveringSlider] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    courseId: "",
  });

  // Calculate gaps for different breakpoints
  const GAP_MOBILE = 8;
  const GAP_TABLET = 12;
  const GAP_DESKTOP = 16;

  // Card dimensions
  const CARD_WIDTH = {
    xs: 260,
    sm: 280,
    md: 300,
  };

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await GetRequest(ADMIN_GET_CATEGORIES);
        setCats(data);
      } catch (err) {
        console.error("Failed to fetch Categories", err);
      }
    };

    fetchCats();
  }, []);

  const handleOpen = (course) => {
    setSelectedCourse(course);
    setFormData({ ...formData, courseId: course.id });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCourse(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const data = await PostRequest(ADMIN_POST_REGISTRATIONS, formData);

      if (data?.message === "Registration successful") {
        alert(
          `✅ Registration successful for ${cats.find((c) => c.id === formData.courseId)?.category
          }!`,
        );
      } else {
        alert(data.message || "Registration failed");
      }

      handleClose();
      setFormData({ fullName: "", email: "", phone: "", courseId: "" });
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  const toggleFavorite = (courseId, e) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId],
    );
  };

  const handleCardClick = async (categoryId) => {
    try {
      const res = await GetRequest(`/admin/course/category/${categoryId}`);
      const courses = res?.data || [];

      if (courses.length > 0) {
        navigate(`/course/${courses[0].slug}`);
      } else {
        alert("Course not found for this category");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const scroll = (direction) => {
    if (!sliderRef.current) return;

    const container = sliderRef.current;
    const scrollAmount = direction === "left"
      ? -container.clientWidth * 0.8
      : container.clientWidth * 0.8;

    container.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        background: `linear-gradient(135deg, ${colors.background.dark} 0%, ${colors.background.medium} 100%)`,
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 3, sm: 4, md: 5 },
      }}
    >
      <Container maxWidth="xl">
        {/* HEADER SECTION */}
        <Box sx={{ textAlign: "center", mb: { xs: 2.5, sm: 3 } }}>
          {/* Premium Badge */}
          <Chip
            label="TOP RATED COURSES"
            icon={<WorkspacePremium sx={{ color: 'var(--green-dark) !important' }} />}
            sx={{
              bgcolor: 'var(--green-light)',
              color: 'var(--green-dark)',
              border: '1px solid var(--green-mid)',
              fontWeight: 800,
              letterSpacing: 1,
              '& .MuiChip-label': { px: 2 }
            }}
          />

          {/* Title */}
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
              color: 'black',
            }}
          >
            Popular <Box component="span" sx={{ color: 'var(--green-dark)' }}>Courses</Box>
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: '#6b8f76',
              fontWeight: 400,
              maxWidth: 700,
              mx: "auto",
              mb: 4,
              fontSize: { xs: '1rem', sm: '1.1rem' },
            }}
          >
            Unlock your potential with our expert-led courses and transform your career
          </Typography>     
        </Box>

        {/* SLIDER CONTROLS */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            justifyContent: "flex-end",
            gap: 1.5,
            mb: 2,
          }}
        >

        </Box>

        {/* COURSE CARDS - Horizontal Scroll */}
        <Box
          ref={sliderRef}
          onMouseEnter={() => setIsHoveringSlider(true)}
          onMouseLeave={() => setIsHoveringSlider(false)}
          sx={{
            display: "flex",
            gap: {
              xs: `${GAP_MOBILE}px`,
              sm: `${GAP_TABLET}px`,
              md: `${GAP_DESKTOP}px`,
            },
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollBehavior: "smooth",
            pb: 4,
            px: 2,
            py: 4,
            "&::-webkit-scrollbar": {
              height: 8,
            },
            "&::-webkit-scrollbar-track": {
              background: 'rgba(61, 184, 67, 0.05)',
              borderRadius: 10,
            },
            "&::-webkit-scrollbar-thumb": {
              background: 'rgba(61, 184, 67, 0.5)',
              borderRadius: 10,
              "&:hover": {
                background: '#3DB843',
              },
            }
          }}
        >
          {cats.map((item, index) => (
            <Grow
              in={true}
              timeout={500 + index * 100}
              key={item.id}
              style={{ transformOrigin: '0 0 0' }}
            >
              <Box
                sx={{
                  minWidth: {
                    xs: `calc((100vw - ${GAP_MOBILE * 2}px - 48px) / 2)`,
                    sm: `calc((100vw - ${GAP_TABLET * 2}px - 64px) / 3)`,
                    md: `calc((100vw - ${GAP_DESKTOP * 3}px - 144px) / 4)`,
                  },
                  maxWidth: {
                    xs: CARD_WIDTH.xs,
                    sm: CARD_WIDTH.sm,
                    md: CARD_WIDTH.md,
                  },
                  width: "100%",
                  scrollSnapAlign: "start",
                  display: "flex", // Ensure Box takes full height available and passes it down
                }}
              >
                <GlassCard
                  $hovered={hoveredCard === index}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  sx={{ 
                    height: '100%', // Take full height of parent Box
                    display: 'flex', 
                    flexDirection: 'column',
                    width: '100%'
                  }}
                >
                  {/* IMAGE SECTION */}
                  <Box
                    sx={{
                      position: "relative",
                      height: 140,
                      overflow: "hidden",
                      cursor: 'pointer',
                    }}
                    onClick={() => handleCardClick(item.id)}
                  >
                    <Box
                      component="img"
                       src={getImgUrl(item?.image) || "https://via.placeholder.com/300x140?text=No+Image"}
                      alt={item?.category || "Category"}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.5s ease",
                        transform: hoveredCard === index ? "scale(1.15)" : "scale(1)",
                      }}
                    />

                    {/* Gradient Overlay */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.6) 100%)',
                        pointerEvents: 'none',
                      }}
                    />

                    {/* Badges */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 16,
                        left: 16,
                        display: "flex",
                        gap: 1,
                      }}
                    >
                      <Chip
                        label="Bestseller"
                        size="small"
                        icon={<Star sx={{ fontSize: 14 }} />}
                        sx={{
                          bgcolor: 'rgba(211, 243, 107, 0.9)',
                          color: '#0a1a05',
                          fontWeight: 700,
                          fontSize: "0.7rem",
                          backdropFilter: 'blur(4px)',
                        }}
                      />
                      <Chip
                        label="New"
                        size="small"
                        sx={{
                          bgcolor: 'var(--green-light)',
                          color: 'var(--green-dark)',
                          fontWeight: 700,
                          fontSize: "0.7rem",
                          backdropFilter: 'blur(4px)',
                        }}
                      />
                    </Box>

                    {/* Favorite Button */}
                    <IconButton
                      onClick={(e) => toggleFavorite(item.id, e)}
                      sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        bgcolor: 'rgba(61, 184, 67, 0.1)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        border: '1px solid var(--green-mid)',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.3)',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.2s ease',
                        zIndex: 2,
                      }}
                    >
                      <FavoriteTwoTone
                        sx={{
                          color: favorites.includes(item.id)
                            ? "#ff4d4d"
                            : "red",
                          fontSize: 20,
                        }}
                      />
                    </IconButton>
                  </Box>

                  {/* CONTENT SECTION */}
                  <Box
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      flex: 1, // Grow to fill the GlassCard
                      minHeight: 260, // Maintain a minimum height for consistency
                    }}
                  >
                    {/* Title & Rating */}
                    <Box
                      onClick={() => handleCardClick(item.id)}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: 0.5,
                        mb: 1,
                        cursor: 'pointer',
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          fontSize: "1.2rem",
                          color: 'black',
                          lineHeight: 1.3,
                        }}
                      >
                        {item?.category || "N/A"}
                      </Typography>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Rating value={4.8} precision={0.1} readOnly size="small" sx={{ color: 'var(--green)' }} />
                        <Typography variant="body2" fontWeight={600} sx={{ color: 'black' }}>
                          (4.8)
                        </Typography>
                      </Box>
                    </Box>

                    {/* Description */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'black',
                        mb: 1,
                        fontSize: "0.9rem",
                        height: 60,
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {item.description ||
                        "Learn from industry experts and master the skills you need to succeed in your career."}
                    </Typography>

                    {/* Instructor */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          bgcolor: 'var(--green-light)',
                          border: '1px solid var(--green-mid)',
                        }}
                      >
                        <School sx={{ fontSize: 14, color: '#D3F36B' }} />
                      </Avatar>
                      <Typography variant="caption" sx={{ color: 'black' }}>
                        Expert Instructor
                      </Typography>
                      <Verified sx={{ fontSize: 14, color: 'var(--green)' }} />
                    </Box>

                    {/* Footer */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: "auto",
                        pt: 1.5,
                        borderTop: '1px solid var(--green-light)',
                      }}
                    >
                      <Box>
                        <Typography variant="caption" sx={{ color: 'black' }}>
                          Starting from
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'var(--green)', fontWeight: 700 }}>
                          Free
                        </Typography>
                      </Box>

                      <AnimatedButton
                        onClick={() => handleOpen(item)}
                        size="small"
                      >
                        Enroll Now
                      </AnimatedButton>
                    </Box>
                  </Box>
                </GlassCard>
              </Box>
            </Grow>
          ))}
        </Box>

        {/* Scroll Indicator */}
        {cats.length > 0 && (
          <Fade in={true}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 3,
                gap: 1,
              }}
            >

            </Box>
          </Fade>
        )}
      </Container>

      {/* REGISTRATION MODAL */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Slide}
        transitionDuration={500}
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: "hidden",
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }
        }}
      >
        {selectedCourse && (
          <>
            <DialogTitle
              sx={{
                background: 'linear-gradient(135deg, #1a2e0f, #2d4a1e)',
                color: 'white',
                py: 4,
                position: "relative",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={getImgUrl(selectedCourse?.image) || "https://via.placeholder.com/70x70?text=No+Img"}
                  sx={{
                    width: 70,
                    height: 70,
                    border: `3px solid ${colors.secondary}`,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  }}
                />
                <Box>
                  <Typography variant="h5" fontWeight={800}>
                    {selectedCourse?.category || "Course"}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Rating value={4.8} size="small" readOnly sx={{ color: colors.secondary }} />
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      (120+ reviews)
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <IconButton
                onClick={handleClose}
                sx={{
                  position: "absolute",
                  right: 16,
                  top: 16,
                  color: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.2)',
                    transform: 'rotate(90deg)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <Close />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ py: 4 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <TextField
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      bgcolor: 'rgba(255,255,255,0.05)',
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.2)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: colors.secondary,
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: colors.secondary,
                      },
                    }
                  }}
                  InputLabelProps={{
                    sx: { color: 'rgba(255,255,255,0.7)' }
                  }}
                />

                <TextField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      bgcolor: 'rgba(255,255,255,0.05)',
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.2)',
                      },
                    }
                  }}
                  InputLabelProps={{
                    sx: { color: 'rgba(255,255,255,0.7)' }
                  }}
                />

                <TextField
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      bgcolor: 'rgba(255,255,255,0.05)',
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.2)',
                      },
                    }
                  }}
                  InputLabelProps={{
                    sx: { color: 'rgba(255,255,255,0.7)' }
                  }}
                />

                <TextField
                  select
                  label="Select Course"
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      bgcolor: 'rgba(255,255,255,0.05)',
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.2)',
                      },
                    }
                  }}
                  InputLabelProps={{
                    sx: { color: 'rgba(255,255,255,0.7)' }
                  }}
                  SelectProps={{
                    sx: { color: 'white' }
                  }}
                >
                  {cats.map((course) => (
                    <MenuItem key={course.id} value={course.id}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <School sx={{ fontSize: 20, color: colors.primary }} />
                        {course.category}
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>

                {/* Course Benefits */}
                <Paper
                  sx={{
                    p: 3,
                    bgcolor: 'rgba(191, 219, 129, 0.05)',
                    borderRadius: 3,
                    border: `1px solid rgba(191, 219, 129, 0.2)`,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ color: colors.secondary, fontWeight: 600 }}>
                    🎓 What You'll Get:
                  </Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    {[
                      'Certificate',
                      'Live Sessions',
                      'Projects',
                      'Mentorship',
                      'Job Support',
                      'Lifetime Access'
                    ].map((benefit, i) => (
                      <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <CheckCircle sx={{ fontSize: 16, color: colors.secondary }} />
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                          {benefit}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Box>
            </DialogContent>

            <DialogActions sx={{ p: 4, pt: 0, gap: 2 }}>
              <Button
                onClick={handleClose}
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.8)',
                  '&:hover': {
                    borderColor: colors.secondary,
                    bgcolor: 'rgba(255,255,255,0.05)',
                  },
                }}
              >
                Cancel
              </Button>

              <Button
                onClick={handleSubmit}
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #bfdb81, #8fb56b)',
                  color: '#0a1a05',
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontWeight: 700,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 15px 30px rgba(191, 219, 129, 0.3)',
                  },
                }}
                startIcon={<CheckCircle />}
              >
                Register Now
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Ads;