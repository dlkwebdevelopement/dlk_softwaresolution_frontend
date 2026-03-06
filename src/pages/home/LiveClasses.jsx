import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  useTheme,
  useMediaQuery,
  Chip,
  Avatar,
  Paper,
  Fade,
} from "@mui/material";
import { GetRequest } from "../../api/config";
import { ADMIN_GET_LIVE_CLASSES } from "../../api/endpoints";
import dayjs from "dayjs";
import { BASE_URL } from "../../api/api";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PeopleIcon from "@mui/icons-material/People";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import SchoolIcon from "@mui/icons-material/School";
import { useNavigate } from "react-router-dom";

export default function LiveClass() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const sliderRef = useRef(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const CARD_WIDTH_MOBILE = 280;
  const CARD_WIDTH_TABLET = 320;
  const CARD_WIDTH_DESKTOP = 350;

  const GAP_MOBILE = 16;
  const GAP_TABLET = 24;
  const GAP_DESKTOP = 32;

  useEffect(() => {
    const fetchLiveClasses = async () => {
      try {
        const data = await GetRequest(ADMIN_GET_LIVE_CLASSES);
        setClasses(data);
      } catch (err) {
        console.error("Failed to fetch Live Classes:", err);
      }
    };
    fetchLiveClasses();
  }, []);

  const formatTime12 = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const scroll = (direction) => {
    if (!sliderRef.current) return;

    const cardWidth = isMobile
      ? CARD_WIDTH_MOBILE + GAP_MOBILE
      : isTablet
        ? CARD_WIDTH_TABLET + GAP_TABLET
        : CARD_WIDTH_DESKTOP + GAP_DESKTOP;

    sliderRef.current.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  const getDaysRemaining = (startDate) => {
    const today = dayjs();
    const start = dayjs(startDate);
    const daysDiff = start.diff(today, "day");

    if (daysDiff < 0) return "Started";
    if (daysDiff === 0) return "Today";
    if (daysDiff === 1) return "Tomorrow";
    return `${daysDiff} days left`;
  };

  return (
    <Box
      sx={{
        maxWidth: "1400px",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 4, sm: 5, md: 6 },
        mx: "auto",
        background: "linear-gradient(145deg, #f8f9ff 0%, #ffffff 100%)",
        borderRadius: { xs: 4, md: 6 } }}
    >
      {/* HEADER SECTION */}
      <Box sx={{ textAlign: "center", mb: { xs: 2, sm: 2, md: 3 } }}>
        {/* TITLE */}
        <Typography
          variant="h4"
          align="center"
          sx={{ fontWeight: 600, mb: { xs: 2.5, sm: 2 },  color: "#1a4718" }}
        >
          Upcoming <span style={{ color: "#83a561" }}> Live Classes</span>
        </Typography>

        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ maxWidth: 700, mx: "auto" }}
        >
          Join our interactive live sessions with expert instructors
        </Typography>
      </Box>

      {/* SLIDER SECTION */}
      <Box sx={{ position: "relative", px: { md: 4 } }}>
        {/* LEFT ARROW */}
        <IconButton
          onClick={() => scroll("left")}
          sx={{
            display: { xs: "none", md: "flex" },
            position: "absolute",
            top: "50%",
            left: -20,
            transform: "translateY(-50%)",
            zIndex: 3,
            bgcolor: "white",
            boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
            "&:hover": {
              bgcolor: "#48723e",
              color: "white",
              transform: "translateY(-50%) scale(1.1)",
            },
            transition: "all 0.3s ease",
            width: 48,
            height: 48 }}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>

        {/* SLIDER */}
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
            px: {
              xs: 2,
              sm: 3,
              md: 2,
            },
            py: 2,
            "&::-webkit-scrollbar": {
              height: 4,
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
              borderRadius: 10,
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#1a4718",
              borderRadius: 10,
              "&:hover": {
                background: "#1a4718",
              },
            } }}
        >
          {classes.map((cls, i) => (
            <Fade in={true} timeout={500 + i * 100} key={i}>
              <Paper
                elevation={hoveredCard === i ? 8 : 2}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
                sx={{
                  minWidth: {
                    xs: CARD_WIDTH_MOBILE,
                    sm: `calc((100% - ${GAP_TABLET}px) / 2)`,
                    md: `calc((100% - ${GAP_DESKTOP * 2}px) / 3)`,
                  },
                  maxWidth: {
                    xs: CARD_WIDTH_MOBILE,
                    sm: `calc((100% - ${GAP_TABLET}px) / 2)`,
                    md: `calc((100% - ${GAP_DESKTOP * 2}px) / 3)`,
                  },
                  width: "100%",
                  scrollSnapAlign: "center",
                  borderRadius: 4,
                  flexShrink: 0,
                  overflow: "hidden",
                  position: "relative",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: hoveredCard === i ? "translateY(-8px)" : "none",
                  cursor: "pointer",
                  "&:hover": {
                    "& .card-media": {
                      transform: "scale(1.1)",
                    },
                    "& .card-overlay": {
                      opacity: 1,
                    },
                  } }}
              >
                {/* CARD MEDIA */}
                <Box sx={{ position: "relative", overflow: "hidden" }}>
                  <CardMedia
                    component="img"
                    height="160"
                    image={`${BASE_URL}/${cls.category.image}`}
                    alt={cls.title}
                    className="card-media"
                    sx={{
                      transition: "transform 0.5s ease" }}
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
                      background:
                        "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.6) 100%)",
                      opacity: 0,
                      transition: "opacity 0.3s ease" }}
                  />

                  {/* BADGES */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      right: 12,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center" }}
                  >
                    <Chip
                      label={cls.title}
                      size="small"
                      sx={{
                        bgcolor: "#48723e",
                        color: "white",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        backdropFilter: "blur(4px)" }}
                    />

                    <Chip
                      label={getDaysRemaining(cls.startDate)}
                      size="small"
                      sx={{
                        bgcolor: "rgba(255, 255, 255, 0.95)",
                        color:
                          cls.startDate &&
                            dayjs(cls.startDate).isBefore(dayjs())
                            ? "#f44336"
                            : "#48723e",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        backdropFilter: "blur(4px)" }}
                    />
                  </Box>
                </Box>

                {/* CARD CONTENT */}
                <CardContent sx={{ p: 3 }}>
                  {/* TITLE */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      fontSize: "1.1rem",
                      lineHeight: 1.4,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      minHeight: "3.2rem" }}
                  >
                    {cls.category.category}
                  </Typography>

                  {/* INSTRUCTOR INFO (if available) */}
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        bgcolor: "#48723e",
                        fontSize: "0.875rem",
                        mr: 1 }}
                    >
                      <SchoolIcon sx={{ fontSize: 16 }} />
                    </Avatar>
                    <Typography variant="body2" color="text.secondary">
                      Expert Instructor
                    </Typography>
                  </Box>

                  {/* COURSE DETAILS GRID */}
                  <Box sx={{ display: "grid", gap: 1.5, mt: 2 }}>
                    {/* DATE */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CalendarTodayIcon
                        sx={{ fontSize: 18, color: "#48723e" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        <span style={{ fontWeight: 600, color: "#2D3748" }}>
                          Starts:{" "}
                        </span>
                        {dayjs(cls.startDate).format("DD MMM YYYY")}
                      </Typography>
                    </Box>

                    {/* TIME */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AccessTimeIcon sx={{ fontSize: 18, color: "#48723e" }} />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ }}
                      >
                        <span style={{ fontWeight: 600, color: "#2D3748" }}>
                          Time:{" "}
                        </span>
                        {formatTime12(cls.startTime)} –{" "}
                        {formatTime12(cls.endTime)}
                      </Typography>
                    </Box>

                    {/* DURATION */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PeopleIcon sx={{ fontSize: 18, color: "#48723e" }} />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ }}
                      >
                        <span style={{ fontWeight: 600, color: "#2D3748" }}>
                          Duration:{" "}
                        </span>
                        {cls.durationDays}{" "}
                        {cls.durationDays === 1 ? "day" : "days"}
                      </Typography>
                    </Box>
                  </Box>

                  {/* ACTION BUTTON */}
                  <Box
                    sx={{
                      mt: 3,
                      pt: 2,
                      borderTop: "1px solid",
                      borderColor: "rgba(0,0,0,0.08)" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between" }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ }}
                      >
                        Limited seats available
                      </Typography>
                      <Chip
                        label="Join Now"
                        icon={<VideoCallIcon />}
                        onClick={() => {
                          navigate("/contact");
                        }}
                        sx={{
                          bgcolor: "#48723e",
                          color: "white",
                          "&:hover": {
                            bgcolor: "#1a4718",
                          },
                          "& .MuiChip-icon": {
                            color: "white",
                          } }}
                      />
                    </Box>
                  </Box>
                </CardContent>

                {/* DECORATIVE ELEMENT */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background:
                      "linear-gradient(90deg, #48723e 0%, #bfdb81 100%)" }}
                />
              </Paper>
            </Fade>
          ))}
        </Box>

        {/* RIGHT ARROW */}
        <IconButton
          onClick={() => scroll("right")}
          sx={{
            display: { xs: "none", md: "flex" },
            position: "absolute",
            top: "50%",
            right: -20,
            transform: "translateY(-50%)",
            zIndex: 3,
            bgcolor: "white",
            boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
            "&:hover": {
              bgcolor: "#48723e",
              color: "white",
              transform: "translateY(-50%) scale(1.1)",
            },
            transition: "all 0.3s ease",
            width: 48,
            height: 48 }}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* BOTTOM CTA (if needed) */}
      {classes.length > 0 && (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <Typography variant="body2" color="text.secondary">
            {classes.length} live {classes.length === 1 ? "class" : "classes"}{" "}
            available
          </Typography>
        </Box>
      )}
    </Box>
  );
}
