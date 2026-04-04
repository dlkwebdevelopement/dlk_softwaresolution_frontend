import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Chip,
  Paper,
  InputBase,
  IconButton,
  alpha,
  Fade,
  CircularProgress,
  Button,
  Divider,
  Pagination
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import {
  Search as SearchIcon,
  CalendarMonth as CalendarIcon,
  Visibility as ViewIcon,
  ArrowForward as ArrowIcon,
  MenuBook as BookIcon,
  FilterList as FilterIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { GetRequest } from "../../api/config";
import { GET_ALL_BLOGS } from "../../api/endpoints";
import { getImgUrl } from "../../api/api";

const fadeInUp = keyframes`
  from { opacity:0; transform:translateY(30px); }
  to { opacity:1; transform:translateY(0); }
`;

/* ---------------- HERO ---------------- */

const HeroSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0, 6),
  background: "linear-gradient(135deg,#f8faf7 0%,#ffffff 100%)"
}));

const SearchWrapper = styled(Paper)({
  display: "flex",
  alignItems: "center",
  maxWidth: 600,
  margin: "0 auto",
  borderRadius: 20,
  border: "1px solid rgba(61,184,67,0.15)"
});

/* ---------------- CARD ---------------- */

const BlogCard = styled(Paper)({
  borderRadius: 20,
  overflow: "hidden",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "0.35s",
  cursor: "pointer",
  border: "1px solid rgba(0,0,0,0.05)",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 15px 35px rgba(0,0,0,0.1)"
  }
});

const CardImageWrapper = styled(Box)({
  aspectRatio: "16 / 10",
  overflow: "hidden",
  position: "relative",
  background: "#f0f0f0"
});

const CardImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
  transition: "0.5s ease",
  "&:hover": {
    transform: "scale(1.1)"
  }
});

const CardContent = styled(Box)({
  padding: 20,
  display: "flex",
  flexDirection: "column",
  flexGrow: 1
});

/* ---------------- COMPONENT ---------------- */

const BlogList = () => {

  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [page, setPage] = useState(1);
  const blogsPerPage = 12; // 3 full rows of 4 cards

  useEffect(() => {

    const fetchBlogs = async () => {
      try {
        const res = await GetRequest(`${GET_ALL_BLOGS}?limit=1000`);
        setBlogs(res?.data?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
    window.scrollTo(0, 0);

  }, []);

  /* -------- FILTER -------- */

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch =
      blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.short_description?.toLowerCase().includes(searchQuery.toLowerCase());
    const category = blog.category || blog.short_description?.split(",")[0] || "General";
    const matchesCategory =
      selectedCategory === "All" || category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const currentBlogs = filteredBlogs.slice(
    (page - 1) * blogsPerPage,
    page * blogsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const categories = [
    "All",
    ...new Set(
      blogs.map(b => {
        if (b.category) return b.category;
        const firstPart = b.short_description?.split(",")[0] || "General";
        // If the first part is more than 20 chars, it's likely part of the description, not a category
        return firstPart.length < 20 ? firstPart : "General";
      })
    )
  ];

  /* -------- LOADING -------- */

  if (loading) {

    return (
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <CircularProgress sx={{ color: "#3DB843" }} />
      </Box>
    );

  }

  return (

    <Box sx={{ bgcolor: "#FBFDF3", minHeight: "100vh", pb: 10 }}>

      {/* HERO */}

      <HeroSection>

        <Container maxWidth="xl">

          <Box
            sx={{
              textAlign: "center",
              mb: 5,
              animation: `${fadeInUp} .7s`
            }}
          >

            <Chip
              icon={<BookIcon />}
              label="KNOWLEDGE HUB"
              sx={{
                mb: 2,
                bgcolor: alpha("#3DB843", .1),
                fontWeight: 700
              }}
            />

            <Typography
              variant="h3"
              sx={{ fontWeight: 800, color: "#1a4718", mb: 1 }}
            >
              Insights & <span style={{ color: "#3DB843" }}>Innovation</span>
            </Typography>

            <Typography sx={{ color: "#6b8f76", mb: 4 }}>
              Stay ahead with expert tech insights
            </Typography>

            {/* SEARCH */}

            <SearchWrapper>

              <IconButton>
                <SearchIcon />
              </IconButton>

              <InputBase
                placeholder="Search articles..."
                sx={{ flex: 1 }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <Divider orientation="vertical" flexItem />

              <IconButton>
                <FilterIcon />
              </IconButton>

            </SearchWrapper>

          </Box>

          {/* CATEGORY */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 1.5
            }}
          >

            {categories.map(cat => (
              <Chip
                key={cat}
                label={cat}
                onClick={() => setSelectedCategory(cat)}
                sx={{
                  fontWeight: 600,
                  bgcolor: selectedCategory === cat ? "#3DB843" : "white",
                  color: selectedCategory === cat ? "white" : "#1a4718"
                }}
              />
            ))}

          </Box>

        </Container>

      </HeroSection>

      {/* BLOG GRID */}

      <Container maxWidth="xl" sx={{ mt: 6 }}>

        <Grid container spacing={3} alignItems="stretch">

          {currentBlogs.length > 0 ? (

            currentBlogs.map((blog, idx) => (

              <Grid
                key={blog.id || idx}
                size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                sx={{ display: 'flex' }}
              >

                <Fade in timeout={400 + (idx * 80)}>

                  <BlogCard
                    onClick={() => navigate(`/blogs/${blog.slug}`)}
                  >

                    <CardImageWrapper>

                      <CardImage
                        src={getImgUrl(blog.image)}
                        alt={blog.title}
                      />

                      <Box
                        sx={{
                          position: "absolute",
                          top: 10,
                          left: 10
                        }}
                      >

                        <Chip
                          size="small"
                          label={
                            blog.category ||
                            blog.short_description?.split(",")[0] ||
                            "General"
                          }
                          sx={{ fontWeight: 700 }}
                        />

                      </Box>

                    </CardImageWrapper>

                    <CardContent>

                      {/* META */}

                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          mb: 1,
                          color: "#6b8f76"
                        }}
                      >

                        <Box sx={{ display: "flex", alignItems: "center", gap: .5 }}>
                          <CalendarIcon sx={{ fontSize: 14 }} />
                          <Typography variant="caption">
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: .5 }}>
                          <ViewIcon sx={{ fontSize: 14 }} />
                          <Typography variant="caption">
                            {blog.views || 0}
                          </Typography>
                        </Box>

                      </Box>

                      {/* TITLE */}

                      <Typography
                        sx={{
                          fontWeight: 700,
                          mb: 1,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden"
                        }}
                      >
                        {blog.title}
                      </Typography>

                      {/* DESC */}

                      <Typography
                        variant="body2"
                        sx={{
                          color: "#6b8f76",
                          mb: 2,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden"
                        }}
                      >
                        {blog.short_description}
                      </Typography>

                      <Box sx={{ mt: "auto" }}>

                        <Button
                          endIcon={<ArrowIcon />}
                          sx={{
                            color: "#3DB843",
                            fontWeight: 700,
                            textTransform: "none"
                          }}
                        >
                          Read Article
                        </Button>

                      </Box>

                    </CardContent>

                  </BlogCard>

                </Fade>

              </Grid>

            ))

          ) : (

            <Grid item xs={12}>

              <Box sx={{ textAlign: "center", py: 10 }}>
                <Typography>No articles found</Typography>
              </Box>

            </Grid>

          )}

        </Grid>

        {totalPages > 1 && (
          <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              sx={{
                '& .MuiPaginationItem-root': {
                  fontWeight: 700,
                  borderRadius: '12px',
                  '&.Mui-selected': {
                    bgcolor: '#3DB843',
                    color: 'white',
                    '&:hover': { bgcolor: '#34a839' }
                  }
                }
              }}
            />
          </Box>
        )}

      </Container>

    </Box>

  );

};

export default BlogList;