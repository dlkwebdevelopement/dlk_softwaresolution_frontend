import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
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
  Badge,
  alpha,
} from "@mui/material";
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
} from "@mui/icons-material";
import { GetRequest, PostRequest } from "../../api/config";
import {
  ADMIN_GET_CATEGORIES,
  ADMIN_POST_REGISTRATIONS,
} from "../../api/endpoints";
import { BASE_URL } from "../../api/api";



// Color scheme
const colors = {
  primary: "#48723e", // Middle green
  secondary: "#bfdb81", // Lime green
  dark: "#1a4718", // Dark green
  light: "#ffffff",
  grey: "#f5f5f5",
  textPrimary: "#333333",
  textSecondary: "#666666",
  accent: "#bfdb81", // Changed to lime green to match new palette
};

const Ads = () => {
  const navigate = useNavigate();
  const sliderRef = useRef(null);

  const [cats, setCats] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    courseId: "",
  });

  // Calculate gaps for different breakpoints
  const GAP_MOBILE = 16; // xs
  const GAP_TABLET = 24; // sm
  const GAP_DESKTOP = 28; // md and up

  // Card dimensions
  const CARD_WIDTH = {
    xs: 280,
    sm: 300,
    md: 320,
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
        maxWidth: "1455px",
        mx: "auto",
        p: { xs: 2, sm: 3, md: 4 },
        position: "relative"
      }}
    >
      {/* HEADER SECTION */}
      <Box
        sx={{
          mb: { xs: 2, sm: 1 },
          textAlign: "center"
        }}
      >
        <Box
          sx={{
            textAlign: "center"
          }}
        >
          <Typography sx={{ fontSize: "36px", fontWeight: 700, color: "#1a4718" }}>
            Popular <span style={{ color: "#83a561" }}> Courses</span>
          </Typography>
        </Box>

        <Typography
          variant="h6"
          sx={{
            color: colors.textSecondary,
            fontWeight: 400,
            maxWidth: 600,
            mx: "auto"
          }}
        >
          Unlock your potential with our expert-led courses
        </Typography>

        {/* STATS */}
        <Box
          sx={{
            display: "flex",
            gap: { xs: 2, sm: 4 },
            justifyContent: "center",
            mt: 2
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h4"
              sx={{ color: colors.primary, fontWeight: 700 }}
            >
              {cats.length}+
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary }}>
              Courses
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h4"
              sx={{ color: colors.primary, fontWeight: 700 }}
            >
              2.5k+
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary }}>
              Students
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h4"
              sx={{ color: colors.primary, fontWeight: 700 }}
            >
              15+
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary }}>
              Experts
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* SLIDER CONTROLS - Only visible on desktop */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          justifyContent: "flex-end",
          gap: 2,
          mb: 2
        }}
      >
        <IconButton
          onClick={() => scroll("left")}
          sx={{
            bgcolor: colors.light,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            "&:hover": {
              bgcolor: colors.primary,
              color: colors.light,
              transform: "scale(1.1)",
            },
            transition: "all 0.3s ease"
          }}
        >
          <ArrowBackIosNew fontSize="small" />
        </IconButton>
        <IconButton
          onClick={() => scroll("right")}
          sx={{
            bgcolor: colors.light,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            "&:hover": {
              bgcolor: colors.primary,
              color: colors.light,
              transform: "scale(1.1)",
            },
            transition: "all 0.3s ease"
          }}
        >
          <ArrowForwardIos fontSize="small" />
        </IconButton>
      </Box>

      {/* COURSE CARDS - Horizontal Scroll */}
      <Box
        ref={sliderRef}
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
          pb: 3,
          px: 1,
          py: 2,
          "&::-webkit-scrollbar": {
            height: 6,
          },
          "&::-webkit-scrollbar-track": {
            background: alpha(colors.dark, 0.05),
            borderRadius: 10,
          },
          "&::-webkit-scrollbar-thumb": {
            background: colors.primary,
            borderRadius: 10,
            "&:hover": {
              background: alpha(colors.primary, 0.8),
            },
          }
        }}
      >
        {cats.map((item, index) => (
          <Fade in={true} timeout={500 + index * 100} key={item.id}>
            <Paper
              elevation={hoveredCard === index ? 8 : 0}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              sx={{
                minWidth: {
                  xs: `calc((100vw - ${GAP_MOBILE * 2}px - 32px) / 2)`, // 2 cards visible
                  sm: `calc((100vw - ${GAP_TABLET * 2}px - 48px) / 3)`, // 3 cards visible
                  md: `calc((100vw - ${GAP_DESKTOP * 3}px - 128px) / 4)`,
                },
                maxWidth: {
                  xs: CARD_WIDTH.xs,
                  sm: CARD_WIDTH.sm,
                  md: CARD_WIDTH.md,
                },
                height: 420,
                borderRadius: 3,
                overflow: "hidden",
                position: "relative",
                cursor: "pointer",
                border: `1px solid ${alpha(colors.dark, 0.05)}`,
                display: "flex",
                flexDirection: "column",
                flexShrink: 0,
                scrollSnapAlign: "start",

                /* Hover Effects */
                transform: hoveredCard === index ? "translateY(-8px)" : "translateY(0px)",
                willChange: "transform",
                transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease",

                "&:hover": {
                  boxShadow: "0px 15px 40px rgba(0,0,0,0.12)",
                  borderColor: colors.primary,
                  "& .card-image": {
                    transform: "scale(1.08)",
                  },
                },

                "&:hover .card-overlay": {
                  opacity: 1,
                }
              }}
            >
              {/* IMAGE SECTION */}
              <Box
                sx={{
                  position: "relative",
                  height: 140,
                  overflow: "hidden",
                  bgcolor: colors.grey
                }}
                onClick={() => handleCardClick(item.id)}
              >
                <Box
                  component="img"
                  src={`${BASE_URL}/${item.image}`}
                  alt={item.category}
                  className="card-image"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.5s ease"
                  }}
                />

                {/* GRADIENT OVERLAY */}
                <Box
                  className="card-overlay"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(180deg, transparent 0%, ${alpha(colors.dark, 0.6)} 100%)`,
                    opacity: 0,
                    transition: "opacity 0.3s ease"
                  }}
                />

                {/* BADGES */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    display: "flex",
                    gap: 1
                  }}
                >
                  <Chip
                    label="Bestseller"
                    size="small"
                    icon={<Star sx={{ fontSize: 14 }} />}
                    sx={{
                      bgcolor: colors.secondary,
                      color: colors.dark,
                      fontWeight: 600,
                      fontSize: "0.7rem"
                    }}
                  />
                </Box>

                {/* FAVORITE BUTTON */}
                <IconButton
                  onClick={(e) => toggleFavorite(item.id, e)}
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    bgcolor: colors.light,
                    "&:hover": {
                      bgcolor: colors.light,
                      transform: "scale(1.1)",
                    },
                    transition: "all 0.2s ease",
                    zIndex: 2
                  }}
                >
                  <FavoriteTwoTone
                    sx={{
                      color: favorites.includes(item.id)
                        ? "#f44336"
                        : colors.textSecondary
                    }}
                  />
                </IconButton>
              </Box>

              {/* CONTENT SECTION */}
              <Box
                sx={{
                  p: 2.5,
                  display: "flex",
                  flexDirection: "column",
                  height: 280,
                  bgcolor: colors.light
                }}
              >
                {/* TITLE & RATING */}
                <Box
                  onClick={() => handleCardClick(item.id)}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      fontSize: "1.25rem",
                      color: colors.dark,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "70%"
                    }}
                  >
                    {item.category}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Star
                      sx={{ fontSize: 16, color: colors.secondary, mr: 0.5 }}
                    />
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color={colors.dark}
                    >
                      4.8
                    </Typography>
                  </Box>
                </Box>

                {/* DESCRIPTION */}
                <Typography
                  variant="body1"
                  sx={{
                    color: colors.textSecondary,
                    mb: 2,
                    fontSize: "0.95rem",
                    height: 70,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical"
                  }}
                >
                  {item.description ||
                    "Learn from industry experts and master the skills you need to succeed in your career."}
                </Typography>

                {/* COURSE STATS */}
                <Box
                  onClick={() => handleCardClick(item.id)}
                  sx={{
                    display: "flex",
                    gap: 2,
                    mb: 2
                  }}
                >
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                  >
                    <AccessTime sx={{ fontSize: 16, color: colors.primary }} />
                    <Typography variant="body2" color={colors.textSecondary} sx={{ fontSize: "0.85rem" }}>
                      20 hours
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <People sx={{ fontSize: 16, color: colors.primary }} />
                    <Typography variant="body2" color={colors.textSecondary} sx={{ fontSize: "0.85rem" }}>
                      1.2k students
                    </Typography>
                  </Box>
                </Box>

                {/* FOOTER */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mt: "auto"
                  }}
                >
                  <Button
                    onClick={() => handleOpen(item)}
                    variant="contained"
                    sx={{
                      bgcolor: colors.primary,
                      color: colors.light,
                      borderRadius: 50,
                      px: 2.5,
                      py: 0.75,
                      fontSize: "0.9rem",
                      "&:hover": {
                        bgcolor: alpha(colors.primary, 0.9),
                        transform: "scale(1.05)",
                      },
                      transition: "all 0.2s ease"
                    }}
                  >
                    Register Now
                  </Button>
                </Box>
              </Box>

              {/* DECORATIVE BOTTOM BORDER */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                  opacity: hoveredCard === index ? 1 : 0,
                  transition: "opacity 0.3s ease"
                }}
              />
            </Paper>
          </Fade>
        ))}
      </Box>

      {/* SCROLL INDICATOR */}
      {cats.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 2,
            gap: 1
          }}
        >
          <Typography variant="caption" color={colors.textSecondary}>
            Swipe to see more courses →
          </Typography>
        </Box>
      )}

      {/* REGISTRATION MODAL */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
          }
        }}
      >
        {selectedCourse && (
          <>
            <DialogTitle
              sx={{
                bgcolor: colors.primary,
                color: colors.light,
                py: 3,
                position: "relative"
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={`${BASE_URL}/${selectedCourse.image}`}
                  sx={{
                    width: 56,
                    height: 56,
                    border: `2px solid ${colors.light}`,
                    bgcolor: colors.light
                  }}
                />
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {selectedCourse.category}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Complete your registration
                  </Typography>
                </Box>
              </Box>
              <IconButton
                onClick={handleClose}
                sx={{
                  position: "absolute",
                  right: 16,
                  top: 16,
                  color: colors.light
                }}
              >
                <Close />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ py: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2.5,
                  mt: 1
                }}
              >
                <TextField
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    sx: { borderRadius: 2 }
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
                    sx: { borderRadius: 2 }
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
                    sx: { borderRadius: 2 }
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
                    sx: { borderRadius: 2 }
                  }}
                >
                  {cats.map((course) => (
                    <MenuItem key={course.id} value={course.id}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <School sx={{ fontSize: 20, color: colors.primary }} />
                        {course.category}
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>

                {/* COURSE PREVIEW */}
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: alpha(colors.primary, 0.05),
                    borderRadius: 2,
                    border: `1px solid ${alpha(colors.primary, 0.1)}`
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ color: colors.primary, mb: 1 }}
                  >
                    Course Benefits:
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <CheckCircle
                        sx={{ fontSize: 16, color: colors.primary }}
                      />
                      <Typography
                        variant="caption"
                        color={colors.textSecondary}
                      >
                        Certificate
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <CheckCircle
                        sx={{ fontSize: 16, color: colors.primary }}
                      />
                      <Typography
                        variant="caption"
                        color={colors.textSecondary}
                      >
                        Live Sessions
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <CheckCircle
                        sx={{ fontSize: 16, color: colors.primary }}
                      />
                      <Typography
                        variant="caption"
                        color={colors.textSecondary}
                      >
                        Projects
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 0, gap: 1 }}>
              <Button
                onClick={handleClose}
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  px: 3,
                  borderColor: alpha(colors.dark, 0.2),
                  color: colors.textSecondary,
                  "&:hover": {
                    borderColor: colors.textSecondary,
                  }
                }}
              >
                Cancel
              </Button>

              <Button
                onClick={handleSubmit}
                variant="contained"
                sx={{
                  bgcolor: colors.primary,
                  color: colors.light,
                  borderRadius: 2,
                  px: 3,
                  "&:hover": {
                    bgcolor: alpha(colors.primary, 0.9),
                  }
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