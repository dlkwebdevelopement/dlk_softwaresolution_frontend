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
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useTheme, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GetRequest } from "../../api/config";
import { GET_ALL_BLOGS } from "../../api/endpoints";
import { BASE_URL } from "../../api/api";

const Blog = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const theme = useTheme();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);

        const res = await GetRequest(GET_ALL_BLOGS);

        // backend structure: res.data.data.data
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

  const visibleBlogs = blogs.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <Box sx={{ py: 8, bgcolor: "#fafafa" }}>
      <Box>
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography
            variant="h4"
            align="center"
            sx={{ fontWeight: 600, mb: { xs: 2.5, sm: 2 }, color: "#1a4718" }}
          >
            Our Latest <span style={{ color: "#83a561" }}> Blog Posts</span>
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              maxWidth: "600px",
              mx: "auto",
              fontSize: "1.1rem",
              lineHeight: 1.6
            }}
          >
            Stay updated with the latest trends, tips, and insights in India.
          </Typography>
        </Box>

        {/* Navigation Controls */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            m: "40px auto",
            maxWidth: "1400px",
            width: "100%"
          }}
        >
          <IconButton
            onClick={handlePrev}
            sx={{
              bgcolor: "white",
              position: "relative",
              top: 250,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              "&:hover": {
                bgcolor: "primary.main",
                color: "white",
              },
              width: 48,
              height: 48,
              borderRadius: "12px",
              zIndex: 20
            }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>

          <Box sx={{ display: "flex", gap: 1 }}>
            {[...Array(Math.ceil(blogs.length / itemsPerPage))].map(
              (_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    bgcolor:
                      currentIndex === index * itemsPerPage
                        ? "primary.main"
                        : "#e0e0e0",
                    cursor: "pointer",
                    transition: "all 0.3s ease"
                  }}
                  onClick={() => setCurrentIndex(index * itemsPerPage)}
                />
              ),
            )}
          </Box>

          <IconButton
            onClick={handleNext}
            sx={{
              bgcolor: "white",
              position: "relative",
              top: 250,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              "&:hover": {
                bgcolor: "primary.main",
                color: "white",
              },
              width: 48,
              height: 48,
              borderRadius: "12px",
              zIndex: 20
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>

        {/* Blog Cards */}
        <Grid container spacing={3} justifyContent="center">
          {visibleBlogs.map((blog) => (
            <Grid item xs={12} md={4} key={blog.id}>
              <Card
                sx={{
                  borderRadius: "20px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                  overflow: "hidden",
                  margin: "auto",
                  height: "100%",
                  width: { xs: "270px", sm: "360px", md: "400px" },
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 16px 48px rgba(0,0,0,0.12)",
                  }
                }}
              >
                {/* Image with Overlay */}
                <Box sx={{ position: "relative", overflow: "hidden" }}>
                  <CardMedia
                    onClick={() => navigate(`/blogs/${blog.slug}`)}
                    component="img"
                    image={`${BASE_URL}/${blog.image}`}
                    alt={blog.title}
                    sx={{
                      height: { xs: 200, sm: 240, md: 280 },
                      width: "100%",
                      objectFit: "cover",
                      transition: "transform 0.5s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                      }
                    }}
                  />

                  {/* Gradient Overlay */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "100px",
                      background:
                        "linear-gradient(to bottom, rgba(0,0,0,0.3), transparent)"
                    }}
                  />

                  <Chip
                    label={blog.short_description}
                    sx={{
                      position: "absolute",
                      bottom: 14,
                      right: 14,
                      backgroundColor: "#f1f8e9", // Very light green
                      color: "#48723e", // Brand green
                      fontWeight: 600,
                      fontSize: "12px",
                      height: 28,
                      borderRadius: "999px",
                      px: 1.75,
                      zIndex: 10
                    }}
                  />
                </Box>

                {/* Content */}
                <Box
                  onClick={() => navigate(`/blogs/${blog.slug}`)}
                  sx={{
                    position: "relative",
                    zIndex: 2,
                    mt: -3, // pulls content over image
                    px: { xs: 2, md: 2.5 },
                    pt: { xs: 2, md: 3 },
                    pb: { xs: 2, md: 2.5 },

                    backgroundColor: "#fff",
                    borderTopLeftRadius: "18px",
                    borderTopRightRadius: "18px"
                  }}
                >
                  {/* Meta Info */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                      color: "text.secondary"
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <CalendarMonthIcon sx={{ fontSize: 16, color: "#83a561", opacity: 0.8 }} />
                      <Typography
                        variant="caption"
                        fontWeight={500}
                        sx={{}}
                      >
                        {blog.created_at
                          ? new Date(blog.created_at).toLocaleDateString(
                            "en-US",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )
                          : "-"}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        width: "4px",
                        height: "4px",
                        bgcolor: "text.secondary",
                        borderRadius: "50%",
                        opacity: 0.5
                      }}
                    />

                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <AccessTimeIcon sx={{ fontSize: 16, color: "#83a561", opacity: 0.8 }} />
                      <Typography
                        variant="caption"
                        fontWeight={500}
                        sx={{}}
                      >
                        3 min read time
                      </Typography>
                    </Box>
                  </Box>

                  {/* Title */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      lineHeight: 1.3,
                      fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
                      color: "#1a1a1a",

                      minHeight: { xs: "auto", md: "60px" }
                    }}
                  >
                    {blog.title}
                  </Typography>
                </Box>

                {/* Footer */}
                <Box
                  sx={{
                    px: 3,
                    pb: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "end"
                  }}
                >
                  <Button
                    onClick={() => navigate(`/blogs/${blog.slug}`)}
                    variant="contained"
                    sx={{
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 600,
                      px: 2.5,
                      py: 0.75,
                      mb: 2,
                      fontSize: "0.875rem",

                      bgcolor: "#48723e",
                      "&:hover": {
                        bgcolor: "#1a4718",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      }
                    }}
                  >
                    Read More
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Blog;
