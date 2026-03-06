import React, { useEffect, useState } from "react";
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
  Collapse,
  Paper,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { GetRequest } from "../api/config";
import { ADMIN_GET_ALL_CATEGORIES_WITH_SUB } from "../api/endpoints";

const MegaMenu = ({ open, onClose, handleCardClick }) => {
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

  if (!open) return null;

  return (
    <Paper
      elevation={6}
      onMouseLeave={onClose}
      sx={{
        position: "absolute",
        top: "45px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "900px",
        maxWidth: "90vw",
        height: "450px",
        borderRadius: "12px",
        zIndex: 1400,
        display: "flex",
        overflow: "hidden" }}
    >
      {/* LEFT COLUMN - Categories */}
      <Box
        sx={{
          width: "280px",
          bgcolor: "#f8f9fa",
          borderRight: "1px solid #e0e0e0",
          overflowY: "auto",
          p: 2 }}
      >
        <Stack spacing={0.5}>
          {cats.map((item) => (
            <Box
              key={item.id}
              onMouseEnter={() => setActiveCat(item)}
              sx={{
                px: 2,
                py: 1.2,
                borderRadius: "8px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
                
                backgroundColor:
                  activeCat?.id === item.id ? "#eae69e" : "transparent",
                color: activeCat?.id === item.id ? "#1a4718" : "#1e1e1e",
                "&:hover": {
                  backgroundColor: "#eae69e",
                  color: "#1a4718",
                } }}
            >
              {item.category}
            </Box>
          ))}
        </Stack>
      </Box>

      {/* RIGHT COLUMN - Subcategories */}
      <Box
        sx={{
          flex: 1,
          p: 3,
          overflowY: "auto",
          bgcolor: "#ffffff" }}
      >
        {activeCat ? (
          <>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 3,
                color: "#1e1e1e",
                borderBottom: "2px solid #48723e",
                pb: 1,
                display: "inline-block" }}
            >
              {activeCat.category}
            </Typography>

            {activeCat?.subcategories?.length > 0 ? (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                {activeCat.subcategories.map((sub) => (
                  <Chip
                    key={sub.id}
                    label={sub.subcategory}
                    clickable
                    onClick={() => handleCardClick(activeCat.id)}
                    sx={{
                      borderRadius: "20px",
                      px: 1,
                      backgroundColor: "#f5f5f5",
                      fontWeight: 500,
                      transition: "all 0.2s",
                      
                      "&:hover": {
                        backgroundColor: "#48723e",
                        color: "#ffffff",
                        transform: "translateY(-2px)",
                        boxShadow: 2,
                      } }}
                  />
                ))}
              </Box>
            ) : (
              <Typography
                color="text.secondary"
                sx={{ fontStyle: "italic" }}
              >
                No subcategories available
              </Typography>
            )}
          </>
        ) : (
          <Typography
            color="text.secondary"
            sx={{ textAlign: "center", mt: 4 }}
          >
            Select a category to view subcategories
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [courseOpen, setCourseOpen] = useState(false);
  const [fortuneOpen, setFortuneOpen] = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState({});
  const [roadMap, setRoadMapOpen] = useState(false);
  const [workShop, setWorkShopOpen] = useState(false);
  const [cats, setCats] = useState([]);
  const [mobileAllCoursesOpen, setMobileAllCoursesOpen] = useState(false);
  const [mobileFortuneOpen, setMobileFortuneOpen] = useState(false);

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
    setMobileCatOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleNavigation = (path) => {
    navigate(path);
    setOpen(false);
  };

  const linkStyle = {
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: 550,
    cursor: "pointer",
    transition: "opacity 0.2s",
    
    "&:hover": {
      opacity: 0.9,
    },
  };

  const handleCardClick = async (categoryId) => {
    try {
      const res = await GetRequest(`/admin/course/category/${categoryId}`);

      const courses = res?.data || [];

      if (courses.length > 0) {
        navigate(`/course/${courses[0].slug}`);
        setOpen(false); // close drawer if mobile
      } else {
        alert("Course not found for this category");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
         background: "linear-gradient(340deg, #48723e 0%, #d8ea9e 100%)",
        px: { xs: 2, md: 4 },
        py: 0.5,
        top: 0,
        zIndex: 1300,
        boxShadow: 3 }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: { xs: "70px", md: "80px" },
          p: "0 !important" }}
      >
        {/* LOGO */}
        <Box
          onClick={() => navigate("/")}
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#ffffff",
            px: 1.5,
            py: 0.5,
            borderRadius: "10px",
            cursor: "pointer",
            transition: "transform 0.2s",
            "&:hover": {
              transform: "scale(1.02)",
            } }}
        >
          <img
            src="/photos/dlk_logo.webp"
            height="50"
            alt="DLK Logo"
            style={{ display: "block" }}
          />
        </Box>

        {/* DESKTOP NAVIGATION */}
        <Stack
          direction="row"
          spacing={3}
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center" }}
        >
          {/* All Courses with MegaMenu */}
          <Box
            sx={{ position: "relative" }}
            onMouseEnter={() => {
              setCourseOpen(true);
              setFortuneOpen(false);
            }}
            onMouseLeave={() => setCourseOpen(false)}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                py: 2 }}
            >
              <Typography sx={linkStyle}>All Courses</Typography>
              <ArrowDropDownIcon sx={{ color: "#ffffff", ml: 0.5 }} />
            </Box>
            <MegaMenu
              open={courseOpen}
              onClose={() => setCourseOpen(false)}
              handleCardClick={handleCardClick}
            />
          </Box>

          {/* Fortune Dropdown */}
          <Box
            sx={{ position: "relative" }}
            onMouseEnter={() => {
              setFortuneOpen(true);
              setCourseOpen(false);
            }}
            onMouseLeave={() => setFortuneOpen(false)}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                py: 2 }}
            >
              <Typography sx={linkStyle}>Fortune</Typography>
              <ArrowDropDownIcon sx={{ color: "#ffffff", ml: 0.5 }} />
            </Box>

            {fortuneOpen && (
              <Paper
                elevation={4}
                sx={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  minWidth: "220px",
                  mt: 0.5,
                  borderRadius: "8px",
                  overflow: "hidden",
                  zIndex: 1400 }}
              >
                <Typography
                  sx={{
                    px: 2.5,
                    py: 1.5,
                    cursor: "pointer",
                    color: "#1e1e1e",
                    fontSize: "14px",
                    transition: "all 0.2s",
                    
                    "&:hover": {
                      backgroundColor: "#eae69e",
                      color: "#1a4718",
                      pl: 3,
                    } }}
                  onClick={() => handleNavigation("/become-instructor")}
                >
                  Become an Instructor
                </Typography>
                <Typography
                  sx={{
                    px: 2.5,
                    py: 1.5,
                    cursor: "pointer",
                    color: "#1e1e1e",
                    fontSize: "14px",
                    borderTop: "1px solid #e0e0e0",
                    transition: "all 0.2s",
                    
                    "&:hover": {
                      backgroundColor: "#eae69e",
                      color: "#1a4718",
                      pl: 3,
                    } }}
                  onClick={() => handleNavigation("/career")}
                >
                  Career
                </Typography>
              </Paper>
            )}
          </Box>

          <Typography
            onClick={() => handleNavigation("/workshop")}
            sx={linkStyle}
          >
            Workshop
          </Typography>

          <Typography
            onClick={() => handleNavigation("/roadmap")}
            sx={linkStyle}
          >
            Roadmap
          </Typography>

          <Button
            onClick={() => navigate("/contact")}
            variant="contained"
            sx={{
              backgroundColor: "#bfdb81",
              color: "#1e1e1e",
              fontWeight: 700,
              textTransform: "none",
              px: 4,
              py: 1.5,
              borderRadius: "10px",
              boxShadow: 3,
              
              position: "relative",
              animation: "pulse 1.2s infinite",

              "@keyframes pulse": {
                "0%": {
                  boxShadow: "0 0 0 0 rgba(229, 229, 229, 0.7)",
                },
                "70%": {
                  boxShadow: "0 0 0 12px rgba(179, 20, 20, 0)",
                },
                "100%": {
                  boxShadow: "0 0 0 0 rgba(229, 215, 69, 0)",
                },
              },

              "&:hover": {
                backgroundColor: "#bfdb81",
                transform: "scale(1.05)",
                opacity: 0.9,
              } }}
          >
            Book Free Demo
          </Button>
        </Stack>

        {/* MOBILE MENU BUTTON */}
        <IconButton
          sx={{
            display: { xs: "flex", md: "none" },
            color: "#ffffff",
            backgroundColor: "rgba(255,255,255,0.1)",
            
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.2)",
            } }}
          onClick={() => setOpen(!open)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Toolbar>

      {/* MOBILE DRAWER */}
      <Drawer
        anchor="top"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: "#48723e",
            pt: 10,
            pb: 4,
            maxHeight: "90vh",
            overflowY: "auto",
            
          } }}
      >
        <Stack spacing={1} alignItems="center" sx={{ width: "100%", px: 2 }}>
          {/* All Courses Section */}
          <List sx={{ width: "100%", maxWidth: 400 }}>
            <ListItemButton
              onClick={() => setMobileAllCoursesOpen(!mobileAllCoursesOpen)}
              sx={{
                backgroundColor: "#1a4718",
                borderRadius: 2,
                
                mb: 0.5,
                "&:hover": {
                  backgroundColor: "#1a4718",
                } }}
            >
              <ListItemText
                primary="All Courses"
                primaryTypographyProps={{
                  fontWeight: 600,
                  color: "#ffffff",
                  fontSize: "16px" }}
              />
              {mobileAllCoursesOpen ? (
                <ExpandLessIcon sx={{ color: "#ffffff" }} />
              ) : (
                <ExpandMoreIcon sx={{ color: "#ffffff" }} />
              )}
            </ListItemButton>

            <Collapse in={mobileAllCoursesOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {cats.map((cat) => (
                  <Box key={cat.id}>
                    <ListItemButton
                      onClick={() => toggleMobileCat(cat.id)}
                      sx={{ pl: 3 }}
                    >
                      <ListItemText
                        primary={cat.category}
                        primaryTypographyProps={{
                          fontWeight: 500,
                          color: "#ffffff",
                          fontSize: "15px" }}
                      />
                      {mobileCatOpen[cat.id] ? (
                        <ExpandLessIcon
                          sx={{ color: "#ffffff" }}
                        />
                      ) : (
                        <ExpandMoreIcon
                          sx={{ color: "#ffffff" }}
                        />
                      )}
                    </ListItemButton>

                    <Collapse
                      in={mobileCatOpen[cat.id]}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        {cat.subcategories?.length > 0 ? (
                          cat.subcategories.map((sub) => (
                            <ListItemButton
                              key={sub.id}
                              sx={{ pl: 5, py: 0.5 }}
                              onClick={() => handleCardClick(cat.id)}
                            >
                              <ListItemText
                                primary={sub.subcategory}
                                primaryTypographyProps={{
                                  color: "#ffffff",
                                  
                                  fontSize: "14px" }}
                              />
                            </ListItemButton>
                          ))
                        ) : (
                          <ListItemText
                            primary="No subcategories available"
                            sx={{
                              pl: 5,
                              color: "#ffffff",
                              opacity: 0.8 }}
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
          <List sx={{ width: "100%", maxWidth: 400 }}>
            <ListItemButton
              onClick={() => setMobileFortuneOpen(!mobileFortuneOpen)}
              sx={{
                backgroundColor: "#1a4718",
                borderRadius: 2,
                
                mb: 0.5,
                "&:hover": {
                  backgroundColor: "#1a4718",
                } }}
            >
              <ListItemText
                primary="Fortune"
                primaryTypographyProps={{
                  fontWeight: 600,
                  color: "#ffffff",
                  
                  fontSize: "16px" }}
              />
              {mobileFortuneOpen ? (
                <ExpandLessIcon sx={{ color: "#ffffff" }} />
              ) : (
                <ExpandMoreIcon sx={{ color: "#ffffff" }} />
              )}
            </ListItemButton>

            <Collapse in={mobileFortuneOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 3 }}
                  onClick={() => handleNavigation("/become-instructor")}
                >
                  <ListItemText
                    primary="Become an Instructor"
                    primaryTypographyProps={{
                      color: "#ffffff",
                      fontSize: "15px" }}
                  />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 3 }}
                  onClick={() => handleNavigation("/career")}
                >
                  <ListItemText
                    primary="Career"
                    primaryTypographyProps={{
                      color: "#ffffff",
                      fontSize: "15px" }}
                  />
                </ListItemButton>
              </List>
            </Collapse>
          </List>

          {/* Workshop Mobile Section */}
          <List sx={{ width: "100%", maxWidth: 400 }}>
            <ListItemButton
              onClick={() => setWorkShopOpen(!workShop)}
              sx={{
                backgroundColor: "#1a4718",
                borderRadius: 2,
                mb: 0.5,
                "&:hover": {
                  backgroundColor: "#1a4718",
                } }}
            >
              <ListItemText
                primary="Workshop"
                primaryTypographyProps={{
                  fontWeight: 600,
                  color: "#ffffff",
                  fontSize: "16px" }}
              />
              {workShop ? (
                <ExpandLessIcon sx={{ color: "#ffffff" }} />
              ) : (
                <ExpandMoreIcon sx={{ color: "#ffffff" }} />
              )}
            </ListItemButton>

            <Collapse in={workShop} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 3 }}
                  onClick={() => handleNavigation("/workshop1")}
                >
                  <ListItemText
                    primary="Workshop 1"
                    primaryTypographyProps={{
                      color: "#ffffff",
                      fontSize: "15px" }}
                  />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 3 }}
                  onClick={() => handleNavigation("/workshop2")}
                >
                  <ListItemText
                    primary="Workshop 2"
                    primaryTypographyProps={{
                      color: "#ffffff",
                      fontSize: "15px" }}
                  />
                </ListItemButton>
              </List>
            </Collapse>
          </List>

          {/* Roadmap Mobile Section */}
          <List sx={{ width: "100%", maxWidth: 400 }}>
            <ListItemButton
              onClick={() => setRoadMapOpen(!roadMap)}
              sx={{
                backgroundColor: "#1a4718",
                borderRadius: 2,
                mb: 0.5,

                "&:hover": {
                  backgroundColor: "#1a4718",
                } }}
            >
              <ListItemText
                primary="Roadmap"
                primaryTypographyProps={{
                  fontWeight: 600,
                  color: "#ffffff",
                  
                  fontSize: "16px" }}
              />
              {roadMap ? (
                <ExpandLessIcon sx={{ color: "#ffffff" }} />
              ) : (
                <ExpandMoreIcon sx={{ color: "#ffffff" }} />
              )}
            </ListItemButton>

            <Collapse in={roadMap} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 3 }}
                  onClick={() => handleNavigation("/comingsoon")}
                >
                  <ListItemText
                    primary="Coming Soon"
                    primaryTypographyProps={{
                      color: "#ffffff",
                      fontSize: "15px" }}
                  />
                </ListItemButton>
              </List>
            </Collapse>
          </List>

          {/* Book Demo Button - Mobile */}
          <Box
            onClick={() => handleNavigation("/contact")}
            sx={{
              backgroundColor: "#bfdb81",
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontSize: "16px",
              fontWeight: 600,
              color: "#1e1e1e",
              cursor: "pointer",
              width: "100%",
              maxWidth: 400,
              textAlign: "center",
              mt: 2,
              transition: "all 0.2s",
              "&:hover": {
                backgroundColor: "#bfdb81",
                transform: "scale(1.02)",
              } }}
          >
            Book Free Demo
          </Box>
        </Stack>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
