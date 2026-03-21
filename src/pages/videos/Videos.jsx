import React, { useState, useEffect } from "react";
import { GetRequest } from "../../api/config";
import { GET_ALL_VIDEOS } from "../../api/endpoints";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  IconButton,
  Stack,
  alpha,
  Button,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ScheduleIcon from "@mui/icons-material/Schedule";
import VisibilityIcon from "@mui/icons-material/Visibility";

const categories = ["All", "Tutorials", "Roadmaps", "Workshops", "Placements", "Design"];

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
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", pb: 10 }}>
      {/* Header Banner - Rich Aesthetic Gradient */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #059669 100%)",
          color: "#fff",
          py: { xs: 8, md: 12 },
          position: "relative",
          overflow: "hidden",
          mb: 6,
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.1,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 600,
              fontSize: { xs: "2rem", md: "3rem" },
              mb: 2,
              fontFamily: '"Poppins", sans-serif',
              textShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            Our <span style={{ color: "#10b981" }}>Learning</span> Library
          </Typography>
          <Typography
            sx={{
              fontSize: "16px",
              color: "rgba(255,255,255,0.85)",
              maxWidth: "600px",
              margin: "auto",
              lineHeight: 1.6,
              fontWeight: 400,
            }}
          >
            Access our comprehensive collection of video tutorials, expert workshops, and step-by-step roadmaps to accelerate your career.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Category Filters Row */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            mb: 5,
            overflowX: "auto",
            pb: 1,
            "&::-webkit-scrollbar": { height: "6px" },
            "&::-webkit-scrollbar-thumb": { bgcolor: "#cbd5e1", borderRadius: "10px" },
          }}
        >
          {categories.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              onClick={() => setSelectedCategory(cat)}
              sx={{
                px: 1.5,
                py: 2.2,
                borderRadius: "12px",
                fontWeight: 500,
                fontSize: "0.95rem",
                bgcolor: selectedCategory === cat ? "#10b981" : "#ffffff",
                color: selectedCategory === cat ? "#ffffff" : "#475569",
                border: `1px solid ${selectedCategory === cat ? "transparent" : "#e2e8f0"}`,
                boxShadow: selectedCategory === cat ? "0 4px 12px rgba(16, 185, 129, 0.2)" : "0 1px 2px rgba(0,0,0,0.02)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  bgcolor: selectedCategory === cat ? "#10b981" : "#f1f5f9",
                  transform: "translateY(-1px)",
                },
              }}
            />
          ))}
        </Stack>

        {/* Videos Grid */}
        <Grid container spacing={4}>
          {loading ? (
            <Grid size={{ xs: 12 }} sx={{ textAlign: 'center', py: 8 }}>
              <Typography sx={{ color: '#64748b' }}>Loading videos...</Typography>
            </Grid>
          ) : videos.length === 0 ? (
            <Grid size={{ xs: 12 }} sx={{ textAlign: 'center', py: 8 }}>
              <Typography sx={{ color: '#64748b' }}>No videos available or found.</Typography>
            </Grid>
          ) : (
            videos
              .filter((v) => selectedCategory === "All" || v.category === selectedCategory)
              .map((video) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={video._id || video.id}>
                  <Card
                    sx={{
                    borderRadius: "24px",
                    overflow: "hidden",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 20px 25px -5px rgba(0,0,0,0.08), 0 10px 10px -5px rgba(0,0,0,0.04)",
                      borderColor: "#10b981",
                      "& .play-circle": {
                        transform: "scale(1.1)",
                        bgcolor: "#10b981",
                        color: "#fff",
                      },
                    },
                  }}
                >
                  {/* Thumbnail and absolute video info overlay */}
                  <Box sx={{ position: "relative", overflow: "hidden", aspectRatio: "16/9" }}>
                    <CardMedia
                      component="img"
                      image={video.thumbnail || "https://images.unsplash.com/photo-1611162607248-cb5f87b32216?auto=format&fit=crop&w=600&q=80"}
                      alt={video.title}
                      sx={{ transition: "transform 0.5s ease" }}
                    />
                    {/* Shadow overlay */}
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 40%)",
                      }}
                    />
                    
                    {/* Centered Play Button */}
                    <Box
                      className="play-circle"
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%) scale(1)",
                        width: "60px",
                        height: "60px",
                        bgcolor: "rgba(255, 255, 255, 0.95)",
                        color: "#064e3b",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                        transition: "all 0.4s ease",
                        cursor: "pointer",
                        zIndex: 2,
                      }}
                    >
                      <PlayArrowIcon sx={{ fontSize: 34, ml: "4px" }} />
                    </Box>

                    {/* Duration badge absolute bottom-right */}
                    {video.duration && (
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 12,
                          right: 12,
                          bgcolor: "rgba(0,0,0,0.75)",
                          color: "#fff",
                          px: 1,
                          py: 0.4,
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: 600,
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        {video.duration}
                      </Box>
                    )}
                  </Box>

                  <CardContent sx={{ p: 3 }}>
                    {/* Category Label */}
                    <Typography
                      sx={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#059669",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        mb: 1.5,
                      }}
                    >
                      {video.category}
                    </Typography>

                    {/* Title */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "1.05rem",
                        fontWeight: 600,
                        color: "#0f172a",
                        lineHeight: 1.4,
                        mb: 2,
                        height: "45px",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {video.title}
                    </Typography>

                    {/* Meta Row: Duration and Views */}
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ pt: 2, borderTop: "1px solid #f1f5f9" }}>
                      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: "#64748b" }}>
                        <ScheduleIcon sx={{ fontSize: 16 }} />
                        <Typography sx={{ fontSize: "12.5px" }}>
                          {new Date(video.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </Typography>
                      </Stack>
                      {video.views && (
                        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: "#64748b" }}>
                          <VisibilityIcon sx={{ fontSize: 16 }} />
                          <Typography sx={{ fontSize: "12.5px" }}>{video.views}</Typography>
                        </Stack>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              )))}
        </Grid>
      </Container>
    </Box>
  );
}
