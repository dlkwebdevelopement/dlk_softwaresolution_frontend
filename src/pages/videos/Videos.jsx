import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  Grid,
  Chip,
  IconButton,
  Stack,
  alpha,
  Button,
  Paper,
  Breadcrumbs,
  Link,
  Fade,
  Skeleton,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import {
  Play,
  Calendar as CalIcon,
  Clock as ClockIcon,
  ChevronRight as ChevronIcon,
  Video as VideoIcon,
  Layout as LayoutIcon,
  PlayCircle as PlayCircleIcon,
  ArrowRight as RightIcon,
  ArrowLeft as LeftIcon,
  FolderOpen as FolderIcon
} from "lucide-react";
import { GetRequest } from "../../api/api";
import { GET_ALL_VIDEOS } from "../../api/endpoints";
import dayjs from "dayjs";

// Animations
const shimmer = keyframes`0%{transform:translateX(-100%)}100%{transform:translateX(100%)}`;
const rotateGradient = keyframes`0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}`;

// Color Palette
const COLORS = {
  primary: "#3DB843",
  dark: "#1a4718",
  light: "#f0fbf0",
  textPrimary: "#1e293b",
  textSecondary: "#64748b"
};
const colors = COLORS;

// Styled Components
const GlassCard = styled(({ $hovered, ...p }) => <Paper {...p} />)(({ theme, $hovered }) => ({
  background: "rgba(255,255,255,0.85)",
  backdropFilter: "blur(10px)",
  border: `1px solid ${$hovered ? "rgba(61,184,67,0.8)" : "rgba(61,184,67,0.25)"}`,
  borderRadius: 24,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
  transform: $hovered ? "translateY(-10px)" : "translateY(0)",
  boxShadow: $hovered ? "0 20px 40px rgba(61,184,67,0.25)" : "0 10px 30px rgba(0,0,0,0.05)",
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0, left: "-100%",
    width: "100%", height: "100%",
    background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)",
    animation: $hovered ? `${shimmer} 2s infinite` : "none",
    pointerEvents: "none",
  },
}));

const IconBox = styled(Box)({
  display: "flex", alignItems: "center", justifyContent: "center",
  width: 36, height: 36, borderRadius: 12,
  background: "#f0fbf0", color: "#2e9133",
  transition: "all 0.3s ease",
});

const categories = ["All", "Tutorials", "Roadmaps", "Workshops", "Placements", "Design"];

// ─── Video Card ────────────────────────────────────────────────────────────────
function VideoCard({ video }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Fade in timeout={500}>
      <Box>
        <GlassCard
          $hovered={hovered}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => video.url && window.open(video.url, "_blank")}
          sx={{ cursor: video.url ? "pointer" : "default" }}
        >
          {/* Thumbnail Section */}
          <Box sx={{ position: "relative", overflow: "hidden", aspectRatio: "16/9" }}>
            <Box
              component="img"
              src={video.thumbnail || "https://images.unsplash.com/photo-1611162607248-cb5f87b32216?auto=format&fit=crop&w=600&q=80"}
              alt={video.title}
              sx={{
                width: "100%", height: "100%", objectFit: "cover",
                transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)",
                transform: hovered ? "scale(1.1) rotate(1deg)" : "scale(1)",
              }}
            />
            {/* Overlay */}
            <Box sx={{
              position: "absolute", inset: 0,
              background: "linear-gradient(180deg,transparent 0%,rgba(0,0,0,0.6) 100%)",
              opacity: hovered ? 0.9 : 0.6, transition: "opacity 0.4s ease",
            }} />

            {/* Centered Play Button */}
            <Box sx={{
              position: "absolute", top: "50%", left: "50%",
              transform: `translate(-50%, -50%) scale(${hovered ? 1.1 : 1})`,
              width: 64, height: 64,
              bgcolor: hovered ? COLORS.primary : "rgba(255,255,255,0.95)",
              color: hovered ? "white" : COLORS.dark,
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
              transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
              zIndex: 2,
            }}>
              <Play size={32} fill={hovered ? "currentColor" : "none"} style={{ marginLeft: 4 }} />
            </Box>

            {/* Duration Badge */}
            {video.duration && (
              <Box sx={{
                position: "absolute", bottom: 16, right: 16,
                bgcolor: "rgba(0,0,0,0.75)", color: "white",
                px: 1.5, py: 0.5, borderRadius: "8px",
                fontSize: "0.75rem", fontWeight: 700,
                backdropFilter: "blur(4px)",
              }}>
                {video.duration}
              </Box>
            )}
          </Box>

          {/* Content Section */}
          <Box sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}>
            <Chip
              label={video.category || "Tutorial"}
              size="small"
              sx={{
                bgcolor: alpha(COLORS.primary, 0.1),
                color: COLORS.primary,
                fontWeight: 800,
                fontSize: "0.65rem",
                textTransform: "uppercase",
                letterSpacing: "1px",
                mb: 1.5,
                width: "fit-content",
                border: `1px solid ${alpha(COLORS.primary, 0.2)}`
              }}
            />

            <Typography variant="h6" sx={{
              fontWeight: 700, fontSize: "1.1rem", mb: 2.5, color: COLORS.textPrimary,
              lineHeight: 1.4, minHeight: "2.8em",
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
            }}>
              {video.title}
            </Typography>

            <Stack spacing={2} sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <IconBox><CalIcon size={16} /></IconBox>
                <Box>
                  <Typography variant="caption" sx={{ display: "block", fontWeight: 700, color: COLORS.textSecondary, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.5px' }}>Release Date</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: COLORS.textPrimary }}>
                    {dayjs(video.createdAt).format("DD MMM, YYYY")}
                  </Typography>
                </Box>
              </Box>
              {video.views && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <IconBox sx={{ bgcolor: "#f1f5f9", color: "#64748b" }}><VideoIcon size={16} /></IconBox>
                  <Box>
                    <Typography variant="caption" sx={{ display: "block", fontWeight: 700, color: COLORS.textSecondary, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.5px' }}>Views</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: COLORS.textPrimary }}>{video.views}</Typography>
                  </Box>
                </Box>
              )}
            </Stack>

            <Box sx={{
              mt: "auto", pt: 2, borderTop: "1px solid rgba(0,0,0,0.05)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              color: COLORS.primary, fontWeight: 800, fontSize: "0.85rem",
              transition: 'all 0.3s ease',
              '&:hover': { gap: 1 }
            }}>
              Watch Now <RightIcon size={18} />
            </Box>
          </Box>
        </GlassCard>
      </Box>
    </Fade>
  );
}

export default function Videos() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const res = await GetRequest(GET_ALL_VIDEOS);
        if (res && res.success) {
          const dataArray = res.data?.data || res.data || [];
          setVideos(Array.isArray(dataArray) ? dataArray : []);
        }
      } catch (err) {
        console.error("Fetch videos failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  return (
    <Box sx={{ bgcolor: "#f8faf7", minHeight: "80vh", pb: 10 }}>
      {/* Header Banner */}
      <Box sx={{
        background: `linear-gradient(135deg,${COLORS.dark} 0%,${COLORS.primary} 100%)`,
        py: { xs: 8, md: 12 }, color: "white", textAlign: "center",
        mb: 6, position: "relative", overflow: "hidden",
      }}>
        <Box sx={{
          position: "absolute", top: "-20%", right: "-10%",
          width: 400, height: 400,
          background: "radial-gradient(circle,rgba(255,255,255,0.1) 0%,transparent 70%)",
          borderRadius: "50%",
          animation: `${rotateGradient} 20s linear infinite`,
        }} />

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 2 }}>
          <Breadcrumbs
            separator={<ChevronIcon size={14} color="rgba(255,255,255,0.7)" />}
            sx={{ justifyContent: "center", display: "flex", mb: 2, "& *": { color: "rgba(255,255,255,0.8)" } }}
          >
            <Link component={RouterLink} to="/" underline="hover"
              sx={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 0.5, fontWeight: 600 }}>
              <LayoutIcon size={14} /> Home
            </Link>
            <Typography sx={{ color: "white", fontWeight: 800 }}>Video Library</Typography>
          </Breadcrumbs>

          <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: "2.4rem", md: "3.8rem" }, mb: 2, lineHeight: 1.1, letterSpacing: '-0.02em' }} color="white">
            Our Learning <span style={{ color: alpha('#fff', 0.8) }}>Library</span>
          </Typography>

          <Typography
            sx={{
              fontSize: "1.1rem",
              color: "rgba(255,255,255,0.85)",
              maxWidth: "650px",
              margin: "auto",
              lineHeight: 1.6,
              fontWeight: 500,
            }}
          >
            Access our comprehensive collection of video tutorials, expert workshops, and step-by-step roadmaps to accelerate your career.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl">
        {/* Category Filters Row */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
          <Stack
            direction="row"
            spacing={1.5}
            sx={{
              overflowX: "auto",
              pb: 1,
              px: 2,
              "&::-webkit-scrollbar": { height: "6px" },
              "&::-webkit-scrollbar-thumb": { bgcolor: alpha(COLORS.primary, 0.2), borderRadius: "10px" },
            }}
          >
            {categories.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                onClick={() => setSelectedCategory(cat)}
                sx={{
                  px: 2,
                  py: 2.5,
                  borderRadius: "14px",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  bgcolor: selectedCategory === cat ? COLORS.primary : "#ffffff",
                  color: selectedCategory === cat ? "#ffffff" : COLORS.textSecondary,
                  border: `1px solid ${selectedCategory === cat ? "transparent" : alpha(COLORS.primary, 0.1)}`,
                  boxShadow: selectedCategory === cat ? `0 10px 20px ${alpha(COLORS.primary, 0.3)}` : "0 4px 6px rgba(0,0,0,0.02)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    bgcolor: selectedCategory === cat ? COLORS.primary : alpha(COLORS.primary, 0.05),
                    transform: "translateY(-2px)",
                    borderColor: COLORS.primary
                  },
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* Videos Grid */}
        {loading ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 15, gap: 3 }}>
            <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: 4, opacity: 0.5 }} />
          </Box>
        ) : (
          <Grid container spacing={4} justifyContent="center">
            {videos.length === 0 ? (
              <Grid size={{ xs: 12 }} sx={{ textAlign: 'center', py: 15, bgcolor: "white", borderRadius: 8, border: "1px dashed #ced4cd" }}>
                <VideoIcon size={64} color="#ced4cd" style={{ marginBottom: 16 }} />
                <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 600 }}>
                  No videos available in this category yet.
                </Typography>
                <Button
                  sx={{ mt: 3, color: COLORS.primary, fontWeight: 700 }}
                  startIcon={<LeftIcon size={17} />}
                  onClick={() => setSelectedCategory("All")}
                >
                  View All Videos
                </Button>
              </Grid>
            ) : (
              videos
                .filter((v) => selectedCategory === "All" || v.category === selectedCategory)
                .map((video, i) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={video._id || video.id}>
                    <VideoCard video={video} />
                  </Grid>
                ))
            )}
          </Grid>
        )}
      </Container>
    </Box>
  );
}


