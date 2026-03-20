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
import toast from "react-hot-toast";

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
  const [activeCategory, setActiveCategory] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
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
        if (data?.length > 0) {
          setActiveCategory(data[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch Categories", err);
      }
    };

    fetchCats();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!activeCategory) return;
      setLoadingCourses(true);
      try {
        const res = await GetRequest(`/admin/course/category/${activeCategory}`);
        setCourses(res?.data || []);
      } catch (err) {
        console.error("Failed to fetch Courses", err);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, [activeCategory]);

  const handleOpen = (course) => {
    setSelectedCourse(course);
    setFormData({ ...formData, courseId: course.id });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCourse(null);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Phone validation: only numbers and max 10 digits
    if (name === "phone") {
      const numbersOnly = value.replace(/[^0-9]/g, "");
      if (numbersOnly.length <= 10) {
        setFormData({ ...formData, [name]: numbersOnly });
      }
      return;
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    // Validation Checks
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim() || !validateEmail(formData.email)) return toast.error("Please enter a valid email address");
    if (!formData.phone.trim() || formData.phone.length !== 10) return toast.error("Phone number must be exactly 10 digits");
    if (!formData.courseId) return toast.error("Please select a course");

    try {
      const data = await PostRequest(ADMIN_POST_REGISTRATIONS, formData);

      if (data?.message === "Registration successful") {
        toast.success(
          `Registration successful for ${cats.find((c) => c.id === formData.courseId)?.category}!`,
        );
      } else {
        toast.error(data.message || "Registration failed");
      }

      handleClose();
      setFormData({ fullName: "", email: "", phone: "", courseId: "" });
    } catch (err) {
      console.error(err);
      toast.error("Server error");
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

  const handleCourseClick = (slug) => {
    if (slug) {
      navigate(`/course/${slug}`);
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
              fontWeight: 600,
              fontSize: 'clamp(1.7rem, 3.2vw, 2.5rem)',
              color: 'black',
            }}
          >
            Popular <Box component="span" sx={{ color: 'var(--green-dark)' }}>Courses</Box>
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#6b8f76',
              fontWeight: 400,
              maxWidth: 700,
              mx: "auto",
              mb: 4,
              fontSize: '1rem',
            }}
          >
            Unlock your potential with our expert-led courses and transform your career
          </Typography>     
        </Box>

        {/* CATEGORY TABS (Scrollable on Mobile) */}
        <Box 
          sx={{ 
            display: "flex", 
            gap: 1.5,
            mb: 2, 
            overflowX: "auto",
            "&::-webkit-scrollbar": { height: 4 },
            "&::-webkit-scrollbar-track": { background: 'transparent' },
            "&::-webkit-scrollbar-thumb": { background: 'rgba(61, 184, 67, 0.3)', borderRadius: 4 },
          }}
        >
          {cats.map((cat) => (
            <Box
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              sx={{
                px: 1,
                py: 1,
                mr: 2,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                whiteSpace: 'nowrap',
                color: activeCategory === cat.id ? 'var(--green)' : '#757575',
                fontWeight: 600,
                fontSize: '1rem',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -2,
                  left: 0,
                  width: activeCategory === cat.id ? '100%' : '0%',
                  height: '3px',
                  bgcolor: 'var(--green)',
                  transition: 'width 0.3s ease',
                },
                '&:hover': {
                  color: 'var(--green)',
                  '&::after': {
                    width: '100%',
                  }
                }
              }}
            >
              <Typography sx={{ fontWeight: 'inherit', fontSize: 'inherit' }}>
                {cat.categoryName} {cat.courseCount !== undefined ? `(${cat.courseCount})` : ''}
              </Typography>
            </Box>
          ))}
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
          {courses.map((course, index) => (
            <Grow
              in={true}
              timeout={500 + index * 100}
              key={course.id}
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
                  {/* IMAGE SECTION */}                    <Box
                      sx={{
                        position: "relative",
                        height: 140,
                        overflow: "hidden",
                        cursor: 'pointer',
                      }}
                      onClick={() => handleCourseClick(course.slug)}
                    >
                      <Box
                        component="img"
                        src={getImgUrl(course?.thumbnail) || "https://via.placeholder.com/300x140?text=No+Image"}
                        alt={course?.title || "Course"}
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
                      onClick={(e) => toggleFavorite(course.id, e)}
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
                          color: favorites.includes(course.id)
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
                      onClick={() => handleCourseClick(course.slug)}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: 0.5,
                        mb: 1,
                        cursor: 'pointer',
                      }}
                    >                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            fontSize: "1.1rem",
                            color: 'black',
                            lineHeight: 1.3,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {course?.title || "N/A"}
                        </Typography>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <Rating value={Number(course.rating) || 0} precision={0.1} readOnly size="small" sx={{ color: 'var(--green)' }} />
                          <Typography variant="body2" fontWeight={600} sx={{ color: 'black' }}>
                            ({course.total_ratings || 0})
                          </Typography>
                        </Box>
                      </Box>

                    {/* Description */}
                                            <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          mb: 1,
                          fontSize: "0.85rem",
                          height: 40,
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {course.short_description || "Learn from industry experts."}
                      </Typography>

                      {/* Info Pills */}
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1.5 }}>
                         <Chip
                            icon={<AccessTime sx={{ fontSize: '14px !important' }}/>}
                            label={`${course.duration_months || 0} Months`}
                            size="small"
                            sx={{
                              bgcolor: 'rgba(61, 184, 67, 0.1)',
                              color: 'var(--green-dark)',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                            }}
                          />
                          <Chip
                            icon={<School sx={{ fontSize: '14px !important' }}/>}
                            label={course.level || "Regular"}
                            size="small"
                            sx={{
                              bgcolor: 'rgba(61, 184, 67, 0.1)',
                              color: 'var(--green-dark)',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                            }}
                          />
                      </Box>

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
                    >                        <Box>
                          <Typography variant="h6" sx={{ color: 'var(--green)', fontWeight: 800 }}>
                            {course.price ? `₹${course.price}` : "Free"}
                          </Typography>
                          {course.original_price && (
                             <Typography variant="caption" sx={{ color: 'text.secondary', textDecoration: 'line-through' }}>
                               ₹{course.original_price}
                             </Typography>
                          )}
                        </Box>

                        <AnimatedButton
                          onClick={() => handleOpen(course)}
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
        {courses.length > 0 && (
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
            borderRadius: 6,
            overflow: "hidden",
            bgcolor: '#ffffff',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid var(--green-light)',
          }
        }}
      >
        {selectedCourse && (
          <>
            <DialogTitle
              sx={{
                background: 'linear-gradient(135deg, var(--green-dark), #0a1a05)',
                color: 'white',
                py: 3,
                position: "relative",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={getImgUrl(selectedCourse?.thumbnail) || "https://via.placeholder.com/70x70?text=No+Img"}
                  sx={{
                    width: 60,
                    height: 60,
                    border: `2px solid ${colors.secondary}`,
                    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                  }}
                />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.25rem', lineHeight: 1.2 }}>
                    {selectedCourse?.title || "Enrollment Form"}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Rating value={Number(selectedCourse?.rating) || 0} size="small" readOnly sx={{ color: colors.secondary }} />
                    <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 500 }}>
                      Join {selectedCourse?.total_ratings || 0}+ Students
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

            <DialogContent sx={{ py: 3, pt: '24px !important' }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <TextField
                  label="Full Name"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    sx: {
                      borderRadius: 3,
                      bgcolor: '#f8fafc',
                      color: 'black',
                      fontWeight: 500,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e2e8f0',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'var(--green)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'var(--green)',
                        borderWidth: 2,
                      },
                    }
                  }}
                  InputLabelProps={{
                    sx: { color: '#64748b', fontWeight: 600 }
                  }}
                />

                <TextField
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    sx: {
                      borderRadius: 3,
                      bgcolor: '#f8fafc',
                      color: 'black',
                      fontWeight: 500,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e2e8f0',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'var(--green)',
                      },
                    }
                  }}
                  InputLabelProps={{
                    sx: { color: '#64748b', fontWeight: 600 }
                  }}
                />

                <TextField
                  label="Phone Number"
                  name="phone"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    sx: {
                      borderRadius: 3,
                      bgcolor: '#f8fafc',
                      color: 'black',
                      fontWeight: 500,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e2e8f0',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'var(--green)',
                      },
                    }
                  }}
                  InputLabelProps={{
                    sx: { color: '#64748b', fontWeight: 600 }
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
                      borderRadius: 3,
                      bgcolor: '#f8fafc',
                      color: 'black',
                      fontWeight: 600,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e2e8f0',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'var(--green)',
                      },
                    }
                  }}
                  InputLabelProps={{
                    sx: { color: '#64748b', fontWeight: 600 }
                  }}
                >
                  {courses.map((course) => (
                    <MenuItem 
                      key={course.id} 
                      value={course.id}
                      sx={{ 
                        color: 'black',
                        fontWeight: 500,
                        py: 1.5,
                        '&:hover': { bgcolor: 'var(--green-light)' }
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <School sx={{ fontSize: 20, color: 'var(--green)' }} />
                        {course.title}
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>

                {/* Course Benefits */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    bgcolor: '#f8fafc',
                    borderRadius: 4,
                    border: `1px dashed #cbd5e1`,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ color: 'var(--green-dark)', fontWeight: 800, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    🚀 Exclusive Course Benefits:
                  </Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                    {[
                      'Official Certificate',
                      'Live Expert Sessions',
                      'Hands-on Projects',
                      '1-on-1 Mentorship',
                      'Placement Support',
                      'Lifetime Access'
                    ].map((benefit, i) => (
                      <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CheckCircle sx={{ fontSize: 16, color: 'var(--green)' }} />
                        <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600 }}>
                          {benefit}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 0, gap: 1.5 }}>
              <Button
                onClick={handleClose}
                variant="text"
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.2,
                  color: '#64748b',
                  fontWeight: 700,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: '#f1f5f9',
                    color: 'black',
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
                      bgcolor: 'var(--green-dark)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 25px rgba(61, 184, 67, 0.25)',
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