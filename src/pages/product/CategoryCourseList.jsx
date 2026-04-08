import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Button,
  Chip,
  Rating,
  Fade,
  Grow,
  Breadcrumbs,
  Link as MuiLink,
  CircularProgress,
  Divider,
  alpha
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import {
  School,
  AccessTime,
  NavigateNext as NavigateNextIcon
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { GetRequest } from "../../api/api";
import { ADMIN_GET_CATEGORIES } from "../../api/endpoints";
import { getImgUrl } from "../../api/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import BottomInfo from "../../components/BottomInfo";

const colors = {
  primary: "#3DB843",
  secondary: "#c2eac4",
  dark: "#1a4718",
  light: "#ffffff",
  textPrimary: "#111c12",
  textSecondary: "#6b8f76",
  background: "#f8faf7",
};

const floatAnimation = keyframes`
0% { transform: translateY(0px); }
50% { transform: translateY(-10px); }
100% { transform: translateY(0px); }
`;

const HeaderSection = styled(Box)({
  background: `linear-gradient(135deg, ${colors.dark} 0%, ${colors.primary} 100%)`,
  padding: "100px 0 80px 0",
  position: "relative",
  overflow: "hidden",
  color: colors.light,
});

const GlassCard = styled(Paper)(({ theme }) => ({
  background: "#ffffff",
  borderRadius: "18px",
  overflow: "hidden",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.3s ease",
  border: "1px solid #e5e7eb",
  maxWidth: "350px",
  margin: "0 auto",

  "&:hover": {
    transform: "translateY(-6px)",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },
}));

const CategoryCourseList = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const cats = await GetRequest(ADMIN_GET_CATEGORIES);
        const currentCat = cats.find(c => c.id === id || c._id === id);
        setCategory(currentCat);

        const res = await GetRequest(`/admin/course/category/${id}`);
        setCourses(res?.data || []);

      } catch (err) {
        console.error("Failed to fetch category data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh"
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: colors.background }}>

      <Navbar />

      {/* HEADER */}
      <HeaderSection>
        <Container maxWidth="lg">

          <Fade in timeout={800}>
            <Box>

              <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" sx={{ color: "#fff" }} />}
                sx={{ mb: 2 }}
              >
                <MuiLink component={Link} to="/" color="inherit">
                  Home
                </MuiLink>

                <Typography color="inherit">
                  {category?.categoryName || "Category"}
                </Typography>

              </Breadcrumbs>

              <Typography
                variant="h3"
                sx={{
                  color: "white",
                  fontWeight: 800,
                  mb: 2
                }}
              >
                {category?.categoryName || "Courses"}
              </Typography>

              <Typography sx={{ maxWidth: 600 }}>
                Explore our industry-focused programs in {category?.categoryName}.
              </Typography>

            </Box>
          </Fade>

        </Container>
      </HeaderSection>


      {/* COURSES */}
      <Container maxWidth={false} sx={{ maxWidth: "1400px", py: 8 }}>

        {courses.length === 0 ? (

          <Typography>No courses found</Typography>

        ) : (

          <Grid container spacing={3}>

            {courses.map((course, index) => (

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                lg={3}
                key={course.id || course._id}
              >

                <Grow in timeout={500 + index * 100}>

                  <GlassCard>

                    {/* IMAGE */}
                    <Box
                      sx={{
                        height: 180,
                        overflow: "hidden",
                        cursor: "pointer"
                      }}
                      onClick={() => navigate(`/course/${course.slug}`)}
                    >

                      <Box
                        component="img"
                        src={
                          getImgUrl(course?.thumbnail) ||
                          "https://via.placeholder.com/400x250"
                        }
                        alt={course.title}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover"
                        }}
                      />

                    </Box>


                    {/* CONTENT */}
                    <Box sx={{ p: 2, flexGrow: 1 }}>

                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: "16px",
                          mb: 1,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden"
                        }}
                      >
                        {course.title}
                      </Typography>


                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>

                        <Rating
                          value={Number(course.rating) || 4.5}
                          precision={0.1}
                          readOnly
                          size="small"
                        />

                        <Typography sx={{ ml: 1, fontSize: 12 }}>
                          ({course.total_ratings || 120})
                        </Typography>

                      </Box>


                      <Typography
                        variant="body2"
                        sx={{
                          color: "#6b7280",
                          mb: 2,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden"
                        }}
                      >
                        {course.short_description}
                      </Typography>


                      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>

                        <Chip
                          icon={<AccessTime />}
                          label={`${course.duration_months || 3} Months`}
                          size="small"
                        />

                        <Chip
                          icon={<School />}
                          label={course.level || "Intermediate"}
                          size="small"
                        />

                      </Box>

                      <Divider />

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mt: 2
                        }}
                      >

                        <Typography
                          sx={{
                            fontWeight: 800,
                            color: colors.primary
                          }}
                        >
                          ₹{course.price || "Free"}
                        </Typography>

                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => navigate(`/course/${course.slug}`)}
                          sx={{
                            borderRadius: "30px",
                            textTransform: "none",
                            bgcolor: colors.primary
                          }}
                        >
                          Details
                        </Button>

                      </Box>

                    </Box>

                  </GlassCard>

                </Grow>

              </Grid>

            ))}

          </Grid>

        )}

      </Container>

      <BottomInfo />
      <Footer />

    </Box>
  );
};

export default CategoryCourseList;
