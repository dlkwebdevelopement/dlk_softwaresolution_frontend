import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  Stack,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Collapse,
  Paper,
  Chip,
  Avatar,
  Badge,
  Divider,
  Fade,
  Grow,
  Zoom,
  alpha,
  Container,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import EventIcon from "@mui/icons-material/Event";
import MapIcon from "@mui/icons-material/Map";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import StarIcon from "@mui/icons-material/Star";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import { GetRequest } from "../api/api";
import { ADMIN_GET_ALL_CATEGORIES_WITH_SUB } from "../api/endpoints";

// Animations
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(61, 184, 67, 0.4); }
  70% { box-shadow: 0 0 0 15px rgba(61, 184, 67, 0); }
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

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
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

// Color scheme
const colors = {
  primary: "#3DB843",
  secondary: "#D3F36B",
  accent: "#fbfdf3",
  dark: "#1a4718",
  light: "#ffffff",
  text: {
    primary: "#111c12",
    secondary: "#2e9133",
    light: "#f8faf7",
  },
  gradient: {
    main: "linear-gradient(135deg, #1a4718 0%, #3DB843 50%, #D3F36B 100%)",
    dark: "linear-gradient(135deg, #1a4718 0%, #3DB843 100%)",
    accent: "linear-gradient(135deg, #3DB843, #D3F36B)",
  }
};

// Styled Components
const GlassAppBar = styled(AppBar)({
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(15px)',
  WebkitBackdropFilter: 'blur(15px)',
  borderBottom: `1px solid ${alpha(colors.primary, 0.1)}`,
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
    animation: `${shimmer} 3s infinite`,
    pointerEvents: 'none',
  },
});

const LogoContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  background: "transparent",
  cursor: "pointer",
  transition: "all 0.3s ease",
  '&:hover': {
    transform: "scale(1.04)",
  },
});

const NavItem = styled(Box)({
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  padding: "6px 14px",
  borderRadius: "50px",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  '&:hover': {
    background: alpha(colors.primary, 0.08),
    transform: "translateY(-1px)",
    '& .nav-text': {
      color: colors.primary,
    },
    '& .nav-icon': {
      color: colors.primary,
      transform: "rotate(15deg)",
    },
  },
});

const NavText = styled(Typography)({
  color: colors.dark,
  fontSize: "0.9rem",
  fontWeight: 500,
  letterSpacing: "0.2px",
  transition: "color 0.3s ease",
});

const MegaMenuContainer = styled(Paper)({
  position: "fixed",
  top: "80px",
  left: "50vw",
  transform: "translateX(-50%)",
  width: "850px",
  maxWidth: "95vw",
  height: "450px",
  borderRadius: "24px",
  zIndex: 9999,
  display: "flex",
  overflow: "hidden",
  background: 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(colors.primary, 0.1)}`,
  boxShadow: '0 30px 60px rgba(0, 0, 0, 0.12)',
  transition: 'opacity 0.2s ease, transform 0.2s ease',
  pointerEvents: 'auto',
});

const CategoryItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active'
})(({ active }) => ({
  padding: "12px 18px",
  borderRadius: "12px",
  fontWeight: 500,
  cursor: "pointer",
  transition: "all 0.3s ease",
  backgroundColor: active ? alpha(colors.primary, 0.1) : "transparent",
  color: 'black',
  border: active ? `1px solid ${alpha(colors.primary, 0.1)}` : '1px solid transparent',
  '&:hover': {
    backgroundColor: alpha(colors.primary, 0.05),
    color: 'black',
    transform: "translateX(5px)",
  },
}));

const SubCategoryChip = styled(Chip)({
  borderRadius: "30px",
  padding: "6px 4px",
  backgroundColor: alpha(colors.primary, 0.05),
  border: `1px solid ${alpha(colors.primary, 0.1)}`,
  color: colors.text.primary,
  fontWeight: 500,
  fontSize: "0.85rem",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  '&:hover': {
    backgroundColor: colors.primary,
    color: colors.light,
    transform: "translateY(-2px)",
    boxShadow: `0 4px 12px ${alpha(colors.primary, 0.2)}`,
    '& .MuiChip-icon': {
      color: colors.light,
    }
  },
  '& .MuiChip-icon': {
    fontSize: 14,
    color: colors.primary,
    transition: 'color 0.3s ease',
  }
});

const CTAGradientButton = styled(Button)({
  background: colors.primary,
  color: colors.light,
  fontWeight: 700,
  textTransform: "none",
  padding: "8px 12px",
  borderRadius: "50px",
  fontSize: "0.95rem",
  letterSpacing: "0.5px",
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "hidden",
  animation: `${pulseGlow} 2s infinite`,
  border: '1px solid rgba(255, 255, 255, 0.3)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
    transition: 'left 0.5s ease',
  },
  '&:hover': {
    transform: 'translateY(-3px) scale(1.05)',
    boxShadow: `0 20px 40px ${alpha(colors.secondary, 0.3)}`,
    '&::before': {
      left: '100%',
    },
  },
  '&:active': {
    transform: 'translateY(0) scale(0.95)',
  },
});

const MobileMenuItem = styled(ListItemButton)({
  borderRadius: "12px",
  marginBottom: "6px",
  padding: "10px 16px",
  transition: "all 0.3s ease",
  '&:hover': {
    backgroundColor: alpha(colors.primary, 0.05),
    transform: "translateX(5px)",
    '& .MuiListItemIcon-root': {
      color: colors.primary,
    }
  },
});

const MegaMenu = ({ open, onClose, onKeepOpen, handleCardClick }) => {
  const navigate = useNavigate();
  const [cats, setCats] = useState([]);
  const [activeCat, setActiveCat] = useState(null);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await GetRequest(ADMIN_GET_ALL_CATEGORIES_WITH_SUB);
        setCats(data);
        if (data?.length > 0) {
          setActiveCat(data[0]);
        }
      } catch (err) {
        console.error("Failed to fetch Categories", err);
      }
    };
    fetchCats();
  }, []);

  // Always render — use CSS so mouse events work smoothly
  return (
    <MegaMenuContainer
      elevation={0}
      onMouseEnter={onKeepOpen}
      onMouseLeave={onClose}
      sx={{
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
        transform: open
          ? 'translateX(-50%) translateY(0)'
          : 'translateX(-50%) translateY(-10px)',
      }}
    >
      {/* LEFT COLUMN - Categories */}
      <Box
        sx={{
          width: "280px",
          background: alpha(colors.primary, 0.02),
          borderRight: `1px solid ${alpha(colors.primary, 0.08)}`,
          overflowY: "auto",
          p: 1.5,
        }}
      >
        <Typography
          sx={{
            color: '#111c12',
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "1.2px",
            mb: 2,
            px: 1,
            textTransform: "uppercase",
          }}
        >
          Course Categories
        </Typography>
        <Stack spacing={0.5}>
          {cats.map((item, index) => (
            <CategoryItem
              key={item.id || index}
              active={activeCat?.id === item.id}
              onMouseEnter={() => setActiveCat(item)}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <MenuBookIcon sx={{ fontSize: 18, color: colors.primary }} />
                {item.categoryName}
              </Box>
            </CategoryItem>
          ))}
        </Stack>
      </Box>

      {/* RIGHT COLUMN - Subcategories */}
      <Box
        sx={{
          flex: 1,
          p: 4,
          overflowY: "auto",
          background: 'white',
        }}
      >
        {activeCat ? (
          <>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, mb: 4 }}>
              <Avatar
                sx={{
                  bgcolor: alpha(colors.primary, 0.1),
                  color: colors.primary,
                  width: 56,
                  height: 56,
                }}
              >
                <SchoolIcon sx={{ fontSize: 28 }} />
              </Avatar>
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: colors.dark,
                    mb: 0.5,
                    fontSize: '1.4rem'
                  }}
                >
                  {activeCat.categoryName}
                </Typography>
                <Typography sx={{ color: colors.text.secondary, fontSize: "0.95rem", fontWeight: 500 }}>
                  Discover {activeCat?.subcategories?.length || 0} expert-led specializations
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ borderColor: alpha(colors.primary, 0.08), mb: 4 }} />

            {activeCat?.subcategories?.length > 0 ? (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                {activeCat.subcategories.map((sub, index) => (
                  <SubCategoryChip
                    key={sub.id}
                    label={sub.subcategory}
                    onClick={() => {
                      navigate(`/course/${sub.slug}`);
                      onClose();
                    }}
                    icon={<ChevronRightIcon />}
                  />
                ))}
              </Box>
            ) : (
              <Box sx={{ textAlign: "center", py: 6 }}>
                <Typography sx={{ color: colors.text.secondary, fontStyle: "italic", fontSize: '1rem' }}>
                  New courses coming soon for this category
                </Typography>
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ textAlign: "center", mt: 6 }}>
            <Typography sx={{ color: colors.text.secondary, fontWeight: 500 }}>
              Explore our catalog by selecting a category
            </Typography>
          </Box>
        )}
      </Box>
    </MegaMenuContainer>
  );
};

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [courseOpen, setCourseOpen] = useState(false);
  const [fortuneOpen, setFortuneOpen] = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(null);
  const [roadMap, setRoadMapOpen] = useState(false);
  const [workShop, setWorkShopOpen] = useState(false);
  const [cats, setCats] = useState([]);
  const [mobileAllCoursesOpen, setMobileAllCoursesOpen] = useState(false);
  const [mobileFortuneOpen, setMobileFortuneOpen] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [mobileMediaOpen, setMobileMediaOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const courseCloseTimer = useRef(null);

  const openCourseMenu = () => {
    clearTimeout(courseCloseTimer.current);
    setCourseOpen(true);
    setFortuneOpen(false);
    setMediaOpen(false);
    setResourcesOpen(false);
  };

  const closeCourseMenu = () => {
    courseCloseTimer.current = setTimeout(() => setCourseOpen(false), 200);
  };

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await GetRequest(ADMIN_GET_ALL_CATEGORIES_WITH_SUB);
        setCats(data || []);
      } catch (err) {
        console.error("Failed to fetch Categories", err);
      }
    };
    fetchCats();
  }, []);

  const toggleMobileCat = (id) => {
    setMobileCatOpen((prev) => (prev === id ? null : id));
  };

  const handleNavigation = (path) => {
    navigate(path);
    setOpen(false);
  };

  const handleCardClick = async (categoryId) => {
    try {
      const res = await GetRequest(`/admin/course/category/${categoryId}`);
      const courses = res?.data || [];

      if (courses.length > 0) {
        navigate(`/course/${courses[0].slug}`);
        setOpen(false);
      } else {
        toast.error("Course not found for this category");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <GlassAppBar position="fixed" elevation={0}>
        <Container maxWidth="xl">
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              minHeight: { xs: "70px", md: "80px" },
              p: "0 !important",
            }}
          >
            {/* LOGO */}
            <LogoContainer onClick={() => navigate("/")}>
              <img
                src="/photos/dlk_logo.png"
                height="60"
                alt="DLK Logo"
                style={{ display: "block" }}
              />
            </LogoContainer>

            {/* DESKTOP NAVIGATION */}
            <Stack
              direction="row"
              spacing={1}
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
              }}
            >
              {/* All Courses with MegaMenu */}
              <Box
                sx={{ position: "relative" }}
                onMouseEnter={openCourseMenu}
                onMouseLeave={closeCourseMenu}
              >
                <NavItem>
                  <MenuBookIcon className="nav-icon" sx={{ fontSize: 20, mr: 1, color: colors.dark, transition: "all 0.4s ease" }} />
                  <NavText className="nav-text">All Courses</NavText>
                  <ArrowDropDownIcon className="nav-icon" sx={{ color: colors.dark, ml: 0.2, transition: "transform 0.4s ease" }} />
                </NavItem>
                <MegaMenu
                  open={courseOpen}
                  onClose={closeCourseMenu}
                  onKeepOpen={openCourseMenu}
                  handleCardClick={handleCardClick}
                />
              </Box>

              {/* Fortune Dropdown */}
              <Box
                sx={{ position: "relative" }}
                onMouseEnter={() => {
                  setFortuneOpen(true);
                  setCourseOpen(false);
                  setMediaOpen(false);
                  setResourcesOpen(false);
                }}
                onMouseLeave={() => setFortuneOpen(false)}
              >
                <NavItem>
                  <EmojiEventsIcon className="nav-icon" sx={{ fontSize: 20, mr: 1, color: colors.dark, transition: "all 0.4s ease" }} />
                  <NavText className="nav-text">Fortune</NavText>
                  <ArrowDropDownIcon className="nav-icon" sx={{ color: colors.dark, ml: 0.2, transition: "transform 0.4s ease" }} />
                </NavItem>

                <Fade in={fortuneOpen}>
                  <Paper
                    elevation={0}
                    sx={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      minWidth: "260px",
                      mt: 1,
                      borderRadius: "20px",
                      overflow: "hidden",
                      zIndex: 1400,
                      background: 'rgba(255, 255, 255, 0.98)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: `1px solid ${alpha(colors.primary, 0.1)}`,
                      boxShadow: '0 15px 45px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    {[
                      { icon: <SchoolIcon />, text: "Become an Instructor", path: "/become-instructor" },
                      { icon: <WorkIcon />, text: "Career", path: "/career" },
                      { icon: <EmojiEventsIcon />, text: "Placement", path: "/placement" },
                      { icon: <RocketLaunchIcon />, text: "Student Projects", path: "/student-projects" },
                    ].map((item, index) => (
                      <ListItemButton
                        key={index}
                        onClick={() => handleNavigation(item.path)}
                        sx={{
                          px: 3,
                          py: 1.8,
                          '&:hover': {
                            backgroundColor: alpha(colors.primary, 0.05),
                            '& .MuiListItemIcon-root': {
                              color: colors.primary,
                            },
                            '& .MuiListItemText-primary': {
                              color: colors.primary,
                            }
                          },
                        }}
                      >
                        <ListItemIcon sx={{ color: colors.text.secondary, minWidth: 36 }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.text}
                          primaryTypographyProps={{
                            color: colors.text.primary,
                            fontWeight: 500,
                            fontSize: '0.9rem'
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </Paper>
                </Fade>
              </Box>

              {/* Media Dropdown */}
              <Box
                sx={{ position: "relative" }}
                onMouseEnter={() => {
                  setMediaOpen(true);
                  setFortuneOpen(false);
                  setCourseOpen(false);
                  setResourcesOpen(false);
                }}
                onMouseLeave={() => setMediaOpen(false)}
              >
                <NavItem>
                  <PermMediaIcon className="nav-icon" sx={{ fontSize: 20, mr: 1, color: colors.dark, transition: "all 0.4s ease" }} />
                  <NavText className="nav-text">Media</NavText>
                  <ArrowDropDownIcon className="nav-icon" sx={{ color: colors.dark, ml: 0.2, transition: "transform 0.4s ease" }} />
                </NavItem>

                <Fade in={mediaOpen}>
                  <Paper
                    elevation={0}
                    sx={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      minWidth: "220px",
                      mt: 1,
                      borderRadius: "20px",
                      overflow: "hidden",
                      zIndex: 1400,
                      background: 'rgba(255, 255, 255, 0.98)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: `1px solid ${alpha(colors.primary, 0.1)}`,
                      boxShadow: '0 15px 45px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    {[
                      { icon: <PhotoLibraryIcon />, text: "Gallery", path: "/gallery" },
                      { icon: <PhotoLibraryIcon />, text: "Office Testimonial", path: "/office-gallery" },
                      { icon: <VideoLibraryIcon />, text: "Videos", path: "/videos" },
                    ].map((item, index) => (
                      <ListItemButton
                        key={index}
                        onClick={() => handleNavigation(item.path)}
                        sx={{
                          px: 3,
                          py: 1.8,
                          '&:hover': {
                            backgroundColor: alpha(colors.primary, 0.05),
                            '& .MuiListItemIcon-root': {
                              color: colors.primary,
                            },
                            '& .MuiListItemText-primary': {
                              color: colors.primary,
                            }
                          },
                        }}
                      >
                        <ListItemIcon sx={{ color: colors.text.secondary, minWidth: 36 }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.text}
                          primaryTypographyProps={{
                            color: colors.text.primary,
                            fontWeight: 500,
                            fontSize: '0.9rem'
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </Paper>
                </Fade>
              </Box>

              <NavItem onClick={() => handleNavigation("/workshop")}>
                <EventIcon className="nav-icon" sx={{ fontSize: 20, mr: 1, color: colors.dark, transition: "all 0.4s ease" }} />
                <NavText className="nav-text">Workshop</NavText>
              </NavItem>

              {/* Resources Dropdown */}
              <Box
                sx={{ position: "relative" }}
                onMouseEnter={() => {
                  setResourcesOpen(true);
                  setMediaOpen(false);
                  setFortuneOpen(false);
                  setCourseOpen(false);
                }}
                onMouseLeave={() => setResourcesOpen(false)}
              >
                <NavItem>
                  <LibraryBooksIcon className="nav-icon" sx={{ fontSize: 20, mr: 1, color: colors.dark, transition: "all 0.4s ease" }} />
                  <NavText className="nav-text">Resources</NavText>
                  <ArrowDropDownIcon className="nav-icon" sx={{ color: colors.dark, ml: 0.2, transition: "transform 0.4s ease" }} />
                </NavItem>

                <Fade in={resourcesOpen}>
                  <Paper
                    elevation={0}
                    sx={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      minWidth: "220px",
                      mt: 1,
                      borderRadius: "20px",
                      overflow: "hidden",
                      zIndex: 1400,
                      background: 'rgba(255, 255, 255, 0.98)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: `1px solid ${alpha(colors.primary, 0.1)}`,
                      boxShadow: '0 15px 45px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    {[
                      { icon: <MapIcon />, text: "Roadmap", path: "/roadmap" },
                      { icon: <MenuBookIcon />, text: "Blog", path: "/blogs" },
                      { icon: <LocalOfferIcon />, text: "Offers", path: "/offers" },
                      { icon: <LiveHelpIcon />, text: "Help", path: "/help" },
                    ].map((item, index) => (
                      <ListItemButton
                        key={index}
                        onClick={() => handleNavigation(item.path)}
                        sx={{
                          px: 3,
                          py: 1.8,
                          '&:hover': {
                            backgroundColor: alpha(colors.primary, 0.05),
                            '& .MuiListItemIcon-root': {
                              color: colors.primary,
                            },
                            '& .MuiListItemText-primary': {
                              color: colors.primary,
                            }
                          },
                        }}
                      >
                        <ListItemIcon sx={{ color: colors.text.secondary, minWidth: 36 }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.text}
                          primaryTypographyProps={{
                            color: colors.text.primary,
                            fontWeight: 500,
                            fontSize: '0.9rem'
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </Paper>
                </Fade>
              </Box>

              <CTAGradientButton
                onClick={() => navigate("/contact")}
                startIcon={<RocketLaunchIcon />}
              >
                Book Free Demo
              </CTAGradientButton>
            </Stack>

            {/* MOBILE MENU BUTTON */}
            <IconButton
              sx={{
                display: { xs: "flex", md: "none" },
                color: colors.primary,
                backgroundColor: alpha(colors.primary, 0.05),
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(colors.primary, 0.1)}`,
                '&:hover': {
                  backgroundColor: alpha(colors.primary, 0.1),
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.3s ease',
              }}
              onClick={() => setOpen(!open)}
            >
              {open ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </Toolbar>
        </Container>
      </GlassAppBar>

      {/* MOBILE DRAWER */}
      <Drawer
        anchor="top"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            pt: 11,
            pb: 4,
            maxHeight: "100vh",
            overflowY: "auto",
            borderBottomLeftRadius: "30px",
            borderBottomRightRadius: "30px",
            borderBottom: `2px solid ${alpha(colors.primary, 0.1)}`,
          }
        }}
      >
        <IconButton
          onClick={() => setOpen(false)}
          sx={{
            position: "absolute",
            top: 20,
            right: 20,
            color: colors.primary,
            bgcolor: alpha(colors.primary, 0.05),
            "&:hover": {
              bgcolor: alpha(colors.primary, 0.1),
            },
            zIndex: 1500,
          }}
        >
          <CloseIcon />
        </IconButton>
        <Container maxWidth="sm">
          <Stack spacing={1} alignItems="center" sx={{ width: "100%" }}>
            {/* All Courses Section */}
            <List sx={{ width: "100%" }}>
              <MobileMenuItem
                onClick={() => setMobileAllCoursesOpen(!mobileAllCoursesOpen)}
                sx={{
                  backgroundColor: alpha(colors.primary, 0.04),
                  borderRadius: "16px",
                  border: `1px solid ${alpha(colors.primary, 0.08)}`,
                }}
              >
                <ListItemIcon sx={{ color: colors.primary, minWidth: 40 }}>
                  <MenuBookIcon />
                </ListItemIcon>
                <ListItemText
                  primary="All Courses"
                  primaryTypographyProps={{
                    fontWeight: 700,
                    color: colors.dark,
                    fontSize: "1.05rem"
                  }}
                />
                {mobileAllCoursesOpen ? (
                  <ExpandLessIcon sx={{ color: colors.primary }} />
                ) : (
                  <ExpandMoreIcon sx={{ color: colors.primary }} />
                )}
              </MobileMenuItem>

              <Collapse in={mobileAllCoursesOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ pl: 2 }}>
                  {cats.map((cat) => (
                    <Box key={cat.id}>
                      <MobileMenuItem
                        onClick={() => toggleMobileCat(cat.id)}
                        sx={{ pl: 3 }}
                      >
                        <ListItemText
                          primary={cat.categoryName}
                          primaryTypographyProps={{
                            fontWeight: 500,
                            color: "black",
                            fontSize: "0.95rem"
                          }}
                        />
                        {mobileCatOpen === cat.id ? (
                          <ExpandLessIcon sx={{ color: colors.primary, fontSize: 20 }} />
                        ) : (
                          <ExpandMoreIcon sx={{ color: colors.primary, fontSize: 20 }} />
                        )}
                      </MobileMenuItem>

                      <Collapse in={mobileCatOpen === cat.id} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding sx={{ pl: 4 }}>
                          {cat.subcategories?.length > 0 ? (
                            cat.subcategories.map((sub) => (
                              <MobileMenuItem
                                key={sub.id}
                                sx={{ py: 0.8 }}
                                onClick={() => {
                                  navigate(`/course/${sub.slug}`);
                                  setOpen(false);
                                }}
                              >
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                  <ChevronRightIcon sx={{ color: alpha(colors.primary, 0.4), fontSize: 18 }} />
                                </ListItemIcon>
                                <ListItemText
                                  primary={sub.subcategory}
                                  primaryTypographyProps={{
                                    color: colors.text.secondary,
                                    fontSize: "0.9rem",
                                    fontWeight: 500
                                  }}
                                />
                              </MobileMenuItem>
                            ))
                          ) : (
                            <ListItemText
                              primary="No subcategories available"
                              sx={{
                                pl: 2,
                                color: alpha(colors.light, 0.6),
                                fontSize: "14px"
                              }}
                            />
                          )}
                        </List>
                      </Collapse>
                    </Box>
                  ))}
                </List>
              </Collapse>
            </List>

            {/* Fortune Mobile Section */}
            <List sx={{ width: "100%" }}>
              <MobileMenuItem
                onClick={() => setMobileFortuneOpen(!mobileFortuneOpen)}
                sx={{
                  backgroundColor: alpha(colors.primary, 0.04),
                  borderRadius: "16px",
                  border: `1px solid ${alpha(colors.primary, 0.08)}`,
                }}
              >
                <ListItemIcon sx={{ color: colors.primary, minWidth: 40 }}>
                  <EmojiEventsIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Fortune"
                  primaryTypographyProps={{
                    fontWeight: 700,
                    color: colors.dark,
                    fontSize: "1.05rem"
                  }}
                />
                {mobileFortuneOpen ? (
                  <ExpandLessIcon sx={{ color: colors.primary }} />
                ) : (
                  <ExpandMoreIcon sx={{ color: colors.primary }} />
                )}
              </MobileMenuItem>

              <Collapse in={mobileFortuneOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ pl: 4 }}>
                  {[
                    { icon: <SchoolIcon />, text: "Become an Instructor", path: "/become-instructor" },
                    { icon: <WorkIcon />, text: "Career", path: "/career" },
                    { icon: <EmojiEventsIcon />, text: "Placement", path: "/placement" },
                    { icon: <RocketLaunchIcon />, text: "Student Projects", path: "/student-projects" },
                  ].map((item, index) => (
                    <MobileMenuItem
                      key={index}
                      sx={{ pl: 2, py: 1.2 }}
                      onClick={() => handleNavigation(item.path)}
                    >
                      <ListItemIcon sx={{ color: alpha(colors.primary, 0.6), minWidth: 40 }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          color: colors.text.primary,
                          fontSize: "0.95rem",
                          fontWeight: 500
                        }}
                      />
                    </MobileMenuItem>
                  ))}
                </List>
              </Collapse>
            </List>

            {/* Media Mobile Section */}
            <List sx={{ width: "100%" }}>
              <MobileMenuItem
                onClick={() => setMobileMediaOpen(!mobileMediaOpen)}
                sx={{
                  backgroundColor: alpha(colors.primary, 0.04),
                  borderRadius: "16px",
                  border: `1px solid ${alpha(colors.primary, 0.08)}`,
                }}
              >
                <ListItemIcon sx={{ color: colors.primary, minWidth: 40 }}>
                  <PermMediaIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Media"
                  primaryTypographyProps={{
                    fontWeight: 700,
                    color: colors.dark,
                    fontSize: "1.05rem"
                  }}
                />
                {mobileMediaOpen ? (
                  <ExpandLessIcon sx={{ color: colors.primary }} />
                ) : (
                  <ExpandMoreIcon sx={{ color: colors.primary }} />
                )}
              </MobileMenuItem>

              <Collapse in={mobileMediaOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ pl: 4 }}>
                  {[
                    { icon: <PhotoLibraryIcon />, text: "Gallery", path: "/gallery" },
                    { icon: <PhotoLibraryIcon />, text: "Office Testimonial", path: "/office-gallery" },
                    { icon: <VideoLibraryIcon />, text: "Videos", path: "/videos" },
                  ].map((item, index) => (
                    <MobileMenuItem
                      key={index}
                      sx={{ pl: 2, py: 1.2 }}
                      onClick={() => handleNavigation(item.path)}
                    >
                      <ListItemIcon sx={{ color: alpha(colors.primary, 0.6), minWidth: 40 }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          color: colors.text.primary,
                          fontSize: "0.95rem",
                          fontWeight: 500
                        }}
                      />
                    </MobileMenuItem>
                  ))}
                </List>
              </Collapse>
            </List>

            {/* Workshop Mobile Section */}
            <MobileMenuItem
              onClick={() => handleNavigation("/workshop")}
              sx={{
                backgroundColor: alpha(colors.primary, 0.04),
                borderRadius: "16px",
                border: `1px solid ${alpha(colors.primary, 0.08)}`,
              }}
            >
              <ListItemIcon sx={{ color: colors.primary, minWidth: 40 }}>
                <EventIcon />
              </ListItemIcon>
              <ListItemText
                primary="Workshop"
                primaryTypographyProps={{
                  fontWeight: 700,
                  color: colors.dark,
                  fontSize: "1.05rem"
                }}
              />
            </MobileMenuItem>

            {/* Resources Mobile Section */}
            <List sx={{ width: "100%" }}>
              <MobileMenuItem
                onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
                sx={{
                  backgroundColor: alpha(colors.primary, 0.04),
                  borderRadius: "16px",
                  border: `1px solid ${alpha(colors.primary, 0.08)}`,
                  mt: 1
                }}
              >
                <ListItemIcon sx={{ color: colors.primary, minWidth: 40 }}>
                  <LibraryBooksIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Resources"
                  primaryTypographyProps={{
                    fontWeight: 700,
                    color: colors.dark,
                    fontSize: "1.05rem"
                  }}
                />
                {mobileResourcesOpen ? (
                  <ExpandLessIcon sx={{ color: colors.primary }} />
                ) : (
                  <ExpandMoreIcon sx={{ color: colors.primary }} />
                )}
              </MobileMenuItem>

              <Collapse in={mobileResourcesOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ pl: 4 }}>
                  {[
                    { icon: <MapIcon />, text: "Roadmap", path: "/roadmap" },
                    { icon: <MenuBookIcon />, text: "Blog", path: "/blogs" },
                    { icon: <LocalOfferIcon />, text: "Offers", path: "/offers" },
                    { icon: <LiveHelpIcon />, text: "Help", path: "/help" },
                  ].map((item, index) => (
                    <MobileMenuItem
                      key={index}
                      sx={{ pl: 2, py: 1.2 }}
                      onClick={() => handleNavigation(item.path)}
                    >
                      <ListItemIcon sx={{ color: alpha(colors.primary, 0.6), minWidth: 40 }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          color: colors.text.primary,
                          fontSize: "0.95rem",
                          fontWeight: 500
                        }}
                      />
                    </MobileMenuItem>
                  ))}
                </List>
              </Collapse>
            </List>

            {/* Book Demo Button - Mobile */}
            <Box sx={{ width: "100%", mt: 3 }}>
              <CTAGradientButton
                fullWidth
                onClick={() => handleNavigation("/contact")}
                startIcon={<RocketLaunchIcon />}
              >
                Book Free Demo
              </CTAGradientButton>
            </Box>

            {/* Decorative Elements */}
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                mt: 3,
              }}
            >
              {[1, 2, 3].map((i) => (
                <Chip
                  key={i}
                  size="small"
                  label={`${i}00+ Students`}
                  sx={{
                    backgroundColor: alpha(colors.secondary, 0.1),
                    color: colors.secondary,
                    border: `1px solid ${alpha(colors.secondary, 0.2)}`,
                  }}
                />
              ))}
            </Box>
          </Stack>
        </Container>
      </Drawer>

    </>
  );
};

export default Navbar;
