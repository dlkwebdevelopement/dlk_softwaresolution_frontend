import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  CardMedia,
  CardContent,
  IconButton,
  useTheme,
  useMediaQuery,
  Chip,
  Avatar,
  Paper,
  Fade,
  Container,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { GetRequest } from "../../api/config";
import { GET_ALL_WORKSHOPS } from "../../api/endpoints";
import dayjs from "dayjs";
import { getImgUrl } from "../../api/api";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PeopleIcon from "@mui/icons-material/People";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import SchoolIcon from "@mui/icons-material/School";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";

// Animations
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const rotateGradient = keyframes`
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.1); }
  100% { transform: rotate(360deg) scale(1); }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

// Styled Components
const GlassCard = styled(({ $hovered, ...other }) => <Paper {...other} />)(({ theme, $hovered }) => ({
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid var(--green-dark)',
  borderRadius: '24px',
  overflow: 'hidden',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: '430px',
  width: '100%',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  transform: $hovered ? 'translateY(-10px)' : 'translateY(0)',
  boxShadow: $hovered
    ? '0 20px 40px rgba(61, 184, 67, 0.15)'
    : '0 10px 30px rgba(0, 0, 0, 0.05)',
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

const FloatingElement = styled(Box)({
  animation: `${floatAnimation} 3s ease-in-out infinite`,
});

const GlassChip = styled(Chip)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  color: 'white',
  fontWeight: 600,
  fontSize: '0.75rem',
  '& .MuiChip-label': {
    padding: '4px 8px',
  },
}));

const GlassAvatar = styled(Avatar)({
  background: 'rgba(61, 184, 67, 0.2)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid var(--green-mid)',
  color: 'white',
});

const StyledIcon = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  borderRadius: '12px',
  background: 'var(--green-light)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid var(--green-mid)',
  color: 'var(--green-dark)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'var(--green-mid)',
    transform: 'scale(1.1)',
  },
});

export default function WorkshopPage() {
  const navigate = useNavigate();
  const [workshops, setWorkshops] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        setLoading(true);
        const res = await GetRequest(GET_ALL_WORKSHOPS);
        if (res.success) {
          setWorkshops(res.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch Workshops:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshops();
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

  const getDaysRemaining = (startDate) => {
    const today = dayjs().startOf('day');
    const start = dayjs(startDate).startOf('day');
    const daysDiff = start.diff(today, "day");

    if (daysDiff < 0) return "Finished";
    if (daysDiff === 0) return "Today";
    if (daysDiff === 1) return "Tomorrow";
    return `${daysDiff} days left`;
  };

  return (
    <Box
      sx={{
        width: "100%",
        background: 'linear-gradient(180deg, #ffffff 0%, #f8faf7 100%)',
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 6, sm: 8, md: 10 },
        minHeight: '80vh'
      }}
    >
      {/* Subtle Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, var(--green-mid) 0%, transparent 70%)',
          borderRadius: '50%',
          opacity: 0.1,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="xl">
        {/* HEADER SECTION */}
        <Box sx={{ textAlign: "center", mb: { xs: 4, sm: 6, md: 8 } }}>
          {/* Premium Badge */}
          <FloatingElement sx={{ display: 'inline-block' }}>
            <Chip
              label="EXPERT WORKSHOPS"
              icon={<StarIcon />}
              sx={{
                bgcolor: 'var(--green-light)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                color: 'var(--green-dark)',
                border: '1px solid var(--green-mid)',
                fontWeight: 600,
                letterSpacing: 1,
                mb: 2,
                '& .MuiChip-icon': {
                  color: 'var(--green-dark)',
                },
              }}
            />
          </FloatingElement>

          {/* TITLE */}
          <Typography
            variant="h3"
            sx={{
              fontWeight: 600,
              mb: 2,
              fontSize: 'clamp(1.7rem, 3.2vw, 2.5rem)',
              color: 'var(--green-dark)',
            }}
          >
            <Box component="span" sx={{ color: 'black' }}>Upcoming</Box> Workshops
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#6b8f76',
              maxWidth: 700,
              mx: "auto",
              fontWeight: 400,
              fontSize: '1rem',
            }}
          >
            Level up your skills with hands-on workshops led by industry specialists and gain practical knowledge.
          </Typography>
        </Box>

        {/* GRID SECTION */}
        {loading ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
            {[...Array(3)].map((_, i) => (
              <Box key={i} sx={{ width: { xs: '100%', sm: 300 }, height: 450, bgcolor: 'rgba(0,0,0,0.05)', borderRadius: '24px', animation: 'pulse 1.5s infinite' }} />
            ))}
          </Box>
        ) : workshops.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography variant="h6" color="text.secondary">No upcoming workshops at the moment. Check back soon!</Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(auto-fill, minmax(280px, 1fr))",
                md: "repeat(auto-fill, minmax(300px, 1fr))",
              },
              gap: { xs: 3, sm: 4 },
              px: { xs: 1, md: 2 },
            }}
          >
            {workshops.map((work, i) => (
              <Box
                key={i}
                sx={{
                  scrollSnapAlign: "start",
                }}
              >
                <GlassCard
                  $hovered={hoveredCard === i}
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => navigate("/contact")}
                  sx={{ cursor: 'pointer' }}
                >
                  {/* CARD MEDIA */}
                  <Box sx={{ position: "relative", overflow: "hidden" }}>
                    <CardMedia
                      component="img"
                      height="180"
                      image={getImgUrl(work.image)}
                      alt={work.title}
                      sx={{
                        transition: "transform 0.5s ease",
                        transform: hoveredCard === i ? "scale(1.15)" : "scale(1)",
                      }}
                    />

                    {/* BADGES */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 16,
                        left: 16,
                        right: 16,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Chip
                        label={work.categoryName}
                        size="small"
                        sx={{
                          bgcolor: '#c2eac4',
                          color: '#2e9133',
                          fontWeight: 800,
                          fontSize: '0.7rem',
                          borderRadius: '8px',
                          border: 'none',
                          px: 0.5
                        }}
                      />

                      <GlassChip
                        label={getDaysRemaining(work.date)}
                        size="small"
                        sx={{
                          color: work.date && dayjs(work.date).isBefore(dayjs().startOf('day'))
                            ? '#ff5252'
                            : 'var(--green-mid)',
                        }}
                      />
                    </Box>

                    {/* CATEGORY ICON */}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 16,
                        right: 16,
                      }}
                    >
                      <StyledIcon>
                        <SchoolIcon sx={{ fontSize: 16 }} />
                      </StyledIcon>
                    </Box>
                  </Box>

                  {/* CARD CONTENT */}
                  <CardContent 
                    sx={{ 
                      p: 3, 
                      flex: 1, 
                      display: 'flex', 
                      flexDirection: 'column', 
                    }}
                  >
                    <Box sx={{ mb: 'auto' }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          mb: 1.5,
                          fontSize: "1.1rem",
                          color: 'black',
                          lineHeight: 1.4,
                          textTransform: 'uppercase',
                          letterSpacing: '-0.02em'
                        }}
                      >
                        {work.title}
                      </Typography>

                      {/* EXPERT INFO */}
                      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                        <GlassAvatar sx={{ width: 34, height: 34, mr: 1.5, bgcolor: 'var(--green-light)', border: 'none' }}>
                          <SchoolIcon sx={{ fontSize: 18, color: 'var(--green-dark)' }} />
                        </GlassAvatar>
                        <Typography variant="body2" sx={{ color: 'black', fontWeight: 600, fontSize: '0.85rem' }}>
                          {work.expertName}
                        </Typography>
                      </Box>
                    </Box>

                    {/* DETAILS */}
                    <Box sx={{ display: "grid", gap: 1.5, mb: 3 }}>
                      {/* DATE */}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <StyledIcon sx={{ width: 28, height: 28, bgcolor: 'var(--green-light)' }}>
                          <CalendarTodayIcon sx={{ fontSize: 14 }} />
                        </StyledIcon>
                        <Typography variant="body2" sx={{ color: 'black', fontSize: '0.85rem' }}>
                          <span style={{ fontWeight: 600 }}>Date:</span> {dayjs(work.date).format("DD MMM YYYY")}
                        </Typography>
                      </Box>

                      {/* TIME */}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <StyledIcon sx={{ width: 28, height: 28, bgcolor: 'var(--green-light)' }}>
                          <AccessTimeIcon sx={{ fontSize: 14 }} />
                        </StyledIcon>
                        <Typography variant="body2" sx={{ color: 'black', fontSize: '0.85rem' }}>
                          <span style={{ fontWeight: 600 }}>Time:</span> {formatTime12(work.startTime)} – {formatTime12(work.endTime)}
                        </Typography>
                      </Box>

                      {/* DURATION */}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <StyledIcon sx={{ width: 28, height: 28, bgcolor: 'var(--green-light)' }}>
                          <PeopleIcon sx={{ fontSize: 14 }} />
                        </StyledIcon>
                        <Typography variant="body2" sx={{ color: 'black', fontSize: '0.85rem' }}>
                          <span style={{ fontWeight: 600 }}>Duration:</span> {work.duration}
                        </Typography>
                      </Box>
                    </Box>

                    {/* ACTION BUTTON */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        pt: 2.5,
                        borderTop: '1px solid rgba(72, 114, 62, 0.1)',
                      }}
                    >
                      <Typography variant="caption" sx={{ color: '#8a9b7e', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Limited Seats
                      </Typography>

                      <Chip
                        label="Enroll Now"
                        icon={<VideoCallIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/contact");
                        }}
                        sx={{
                          bgcolor: 'var(--green)',
                          color: 'white',
                          fontWeight: 700,
                          px: 1,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: 'var(--green-dark)',
                            transform: 'translateY(-2px)',
                          },
                          '& .MuiChip-icon': {
                            color: 'white',
                          },
                        }}
                      />
                    </Box>
                  </CardContent>
                </GlassCard>
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
