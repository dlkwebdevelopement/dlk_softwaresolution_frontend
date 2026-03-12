import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import DownloadIcon from "@mui/icons-material/Download";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { Rating, Avatar, Button } from "@mui/material";

import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate, useParams } from "react-router-dom";
import { GetRequest } from "../../api/config";
import {
  ADMIN_GET_CATEGORIES,
  ADMIN_GET_COURSE_SLUG,
} from "../../api/endpoints";
import { BASE_URL, getImgUrl } from "../../api/api";

const CourseOverviewSection = () => {
  const [value, setValue] = React.useState(0);

  const { slug } = useParams();
  const [course, setCourse] = useState(null);

  const courseIncludes = [
    {
      icon: <PlayCircleFilledIcon sx={{ color: 'var(--green)' }} />,
      text: "10 hours on-demand video",
    },
    {
      icon: <DownloadIcon sx={{ color: 'var(--green)' }} />,
      text: "20 downloadable resources",
    },
    {
      icon: <AllInclusiveIcon sx={{ color: 'var(--green)' }} />,
      text: "Full lifetime access",
    },
    {
      icon: <PhoneIphoneIcon sx={{ color: 'var(--green)' }} />,
      text: "Access on mobile and TV",
    },
    {
      icon: <WorkspacePremiumIcon sx={{ color: 'var(--green)' }} />,
      text: "Certificate of completion",
    },
  ];

  const navigate = useNavigate();
  const [cats, setCats] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await GetRequest(ADMIN_GET_CATEGORIES);
        setCats(data);
      } catch (err) {
        console.error("Failed to fetch Categories", err);
      }
    };
    fetch();
  }, []);

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

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await GetRequest(ADMIN_GET_COURSE_SLUG(slug));
        setCourse(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (slug) fetchCourse();
  }, [slug]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: false,
      mirror: true,
      offset: 50,
    });
  }, []);

  const renderLeftContent = () => {
    if (value === 0) {
      return (
        <Box data-aos="fade-up">
          {/* Who Should Enroll */}
          <Typography
            sx={{
              fontSize: "28px",
              fontWeight: 800,
              color: "var(--dark)",
              mb: 4,
              fontFamily: '"Bricolage Grotesque", sans-serif',
            }}
          >
            Who Should Enroll?
          </Typography>

          <Box sx={{ mb: 6 }}>
            {course?.whoShouldEnroll?.map((item, index) => (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  mb: 3,
                  p: 2,
                  borderRadius: '12px',
                  bgcolor: '#fff',
                  border: '1px solid #f1f5f9',
                  transition: '0.3s',
                  "&:hover": { transform: 'translateX(5px)', borderColor: 'var(--green-mid)' }
                }}
              >
                <CheckCircleIcon
                  sx={{
                    color: "var(--green)",
                    fontSize: 22,
                    mr: 2,
                    mt: "2px",
                  }}
                />
                <Typography
                  sx={{
                    color: "#475569",
                    lineHeight: 1.6,
                    fontSize: "16px",
                    fontWeight: 500
                  }}
                >
                  {item.content}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* What You'll Learn */}
          <Typography
            sx={{
              fontSize: "28px",
              fontWeight: 800,
              color: "var(--dark)",
              mb: 4,
              fontFamily: '"Bricolage Grotesque", sans-serif',
            }}
          >
            What You'll Learn?
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },
              gap: 3
            }}
          >
            {course?.learningPoints?.map((item) => (
              <Box
                key={item.id}
                sx={{ 
                  display: "flex", 
                  alignItems: "flex-start",
                  p: 2.5,
                  borderRadius: '16px',
                  bgcolor: 'var(--green-pale)',
                  border: '1px solid var(--green-mid)',
                }}
              >
                <CheckCircleIcon
                  sx={{
                    color: "var(--green)",
                    fontSize: 20,
                    mr: 2,
                    mt: "3px",
                  }}
                />
                <Typography
                  sx={{
                    color: "var(--text-mid)",
                    fontSize: "15px",
                    fontWeight: 600,
                    lineHeight: 1.5
                  }}
                >
                  {item.content}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      );
    }

    if (value === 1) {
      return (
        <Box data-aos="fade-up">
          <Typography
            sx={{
              fontSize: "28px",
              fontWeight: 800,
              color: "var(--dark)",
              mb: 4,
              fontFamily: '"Bricolage Grotesque", sans-serif',
            }}
          >
            Course Curriculum
          </Typography>

          {course?.curriculum?.map((module, index) => (
            <Box
              key={module.id}
              sx={{
                border: "1px solid #e2e8f0",
                borderRadius: "16px",
                padding: 3,
                mb: 2,
                backgroundColor: "#ffffff",
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                "&:hover": {
                  borderColor: 'var(--green)',
                  boxShadow: '0 4px 12px rgba(61, 184, 67, 0.1)',
                }
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                  <Typography 
                    sx={{ 
                      color: 'var(--green)', 
                      fontWeight: 800, 
                      fontSize: '14px',
                      width: '30px'
                    }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </Typography>
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: "17px",
                        color: 'var(--dark)'
                      }}
                    >
                      {module.title}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "14px",
                        color: "#64748b",
                        mt: 0.5
                      }}
                    >
                      {module.lessons_info || "No lessons available"}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    bgcolor: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-muted)'
                  }}
                >
                  <Typography sx={{ fontSize: '20px', mt: '-4px' }}>⌄</Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      );
    }

    if (value === 2) {
      return (
        <Box data-aos="fade-up">
          <Typography
            sx={{
              fontSize: "28px",
              fontWeight: 800,
              mb: 4,
              color: "var(--dark)",
              fontFamily: '"Bricolage Grotesque", sans-serif',
              position: "relative",
              display: "inline-block",
              "&:after": {
                content: '""',
                position: "absolute",
                left: 0,
                bottom: -8,
                width: "60px",
                height: "4px",
                backgroundColor: "var(--green)",
                borderRadius: "10px",
              }
            }}
          >
            Student Reviews
          </Typography>

          {/* Rating Summary Card */}
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: "20px",
              p: 5,
              boxShadow: "0px 10px 30px rgba(0,0,0,0.04)",
              mb: 6,
              border: '1px solid #f1f5f9'
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
                gap: 6
              }}
            >
              {/* Left Big Rating */}
              <Box sx={{ textAlign: "center", minWidth: 140 }}>
                <Typography
                  sx={{
                    fontSize: "56px",
                    fontWeight: 800,
                    color: "#f59e0b",
                    lineHeight: 1
                  }}
                >
                  {course?.rating || 0}
                </Typography>

                <Rating 
                  value={Number(course?.rating) || 0} 
                  precision={0.5} 
                  readOnly 
                  sx={{ my: 1.5, color: '#f59e0b' }} 
                />

                <Typography
                  sx={{
                    fontSize: "15px",
                    color: "#64748b",
                    fontWeight: 600
                  }}
                >
                  Based on {course?.total_ratings || 0} Ratings
                </Typography>
              </Box>

              {/* Rating Bars */}
              <Box sx={{ flex: 1, width: "100%" }}>
                {[
                  { label: "5 star", value: 85 },
                  { label: "4 star", value: 10 },
                  { label: "3 star", value: 3 },
                  { label: "2 star", value: 1 },
                  { label: "1 star", value: 1 },
                ].map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2
                    }}
                  >
                    <Typography
                      sx={{ width: 60, fontSize: "14px", color: '#475569', fontWeight: 600 }}
                    >
                      {item.label}
                    </Typography>

                    <Box
                      sx={{
                        flex: 1,
                        height: 8,
                        backgroundColor: "#f1f5f9",
                        borderRadius: 10,
                        mx: 2,
                        overflow: "hidden"
                      }}
                    >
                      <Box
                        sx={{
                          width: `${item.value}%`,
                          height: "100%",
                          backgroundColor: "#f59e0b",
                          borderRadius: 10
                        }}
                      />
                    </Box>

                    <Typography
                      sx={{ width: 35, fontSize: "14px", color: '#64748b', fontWeight: 600 }}
                    >
                      {item.value}%
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Individual Reviews */}
          <Stack spacing={3}>
            {[
              {
                name: "Arun Kumar",
                img: "https://i.pravatar.cc/100?img=11",
                content: "Absolutely loved the Digital Marketing program! The practical sessions on SEO and SEM helped me land my dream role. Mentoring was world-class.",
                date: "2 weeks ago"
              },
              {
                name: "Priyanka S",
                img: "https://i.pravatar.cc/100?img=26",
                content: "The Python course curriculum is very well-structured. Even as a beginner, I found the concepts easy to grasp through the real-world projects.",
                date: "1 month ago"
              }
            ].map((review, i) => (
              <Box
                key={i}
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: "20px",
                  p: 4,
                  boxShadow: "0px 5px 20px rgba(0,0,0,0.03)",
                  border: '1px solid #f1f5f9',
                  transition: '0.3s',
                  "&:hover": { transform: 'translateY(-5px)', boxShadow: '0 10px 25px rgba(0,0,0,0.06)' }
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                  <Avatar 
                    src={review.img} 
                    sx={{ width: 50, height: 50, border: '2px solid var(--green-light)' }} 
                  />
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: 'var(--dark)' }}>{review.name}</Typography>
                    <Rating value={5} readOnly size="small" sx={{ color: '#f59e0b' }} />
                    <Typography sx={{ fontSize: "12px", color: "#94a3b8", mt: 0.5 }}>
                      {review.date}
                    </Typography>
                  </Box>
                </Box>

                <Typography sx={{ color: "#334155", mb: 3, lineHeight: 1.7, fontSize: '15.5px' }}>
                  “{review.content}”
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography sx={{ fontSize: "13px", color: "#64748b", fontWeight: 600 }}>
                    Was this helpful?
                  </Typography>
                  <Button size="small" sx={{ color: 'var(--green-dark)', fontWeight: 700, minWidth: 'auto', p: 0.5 }}>
                    👍 Helpful
                  </Button>
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      );
    }
  };

  if (!course) {
    return (
      <Box sx={{ p: 10, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ color: 'var(--green-dark)', fontWeight: 700 }}>Preparing your course journey...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f8fafc", py: 10, overflowX: "hidden" }}>
      <Container maxWidth="lg">
        {/* Centered Button Tabs */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 8 }}>
          <Tabs
            value={value}
            onChange={handleChange}
            TabIndicatorProps={{ style: { display: "none" } }}
            sx={{
              backgroundColor: "#fff",
              borderRadius: "999px",
              padding: "6px",
              minHeight: "auto",
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              border: '1px solid #e2e8f0'
            }}
          >
            {["Overview", "Curriculum", "Reviews"].map((tab, index) => (
              <Tab
                key={index}
                label={tab}
                disableRipple
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "15px",
                  minHeight: "44px",
                  borderRadius: "999px",
                  px: 4,
                  color: "#64748b",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&.Mui-selected": {
                    backgroundColor: "var(--green)",
                    color: "#ffffff !important",
                    boxShadow: '0 4px 12px rgba(61, 184, 67, 0.3)'
                  },
                  "&:hover": {
                    color: "var(--green)",
                  }
                }}
              />
            ))}
          </Tabs>
        </Box>

        {/* 70 / 30 Layout */}
        <Box
          sx={{
            display: "flex",
            gap: 6,
            flexDirection: { xs: "column", md: "row" }
          }}
        >
          {/* LEFT SIDE 70% */}
          <Box
            sx={{
              width: { xs: "100%", md: "68%" }
            }}
          >
            {renderLeftContent()}
          </Box>

          {/* RIGHT SIDE 32% */}
          <Box
            sx={{
              width: { xs: "100%", md: "32%" },
              display: 'flex',
              flexDirection: 'column',
              gap: 3
            }}
          >
            <Card
              elevation={0}
              sx={{
                borderRadius: "24px",
                boxShadow: "0px 20px 40px rgba(0,0,0,0.04)",
                border: '1px solid #f1f5f9',
                overflow: 'visible'
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: "20px",
                    mb: 3,
                    color: "var(--dark)",
                    fontFamily: '"Bricolage Grotesque", sans-serif',
                  }}
                >
                  This course includes:
                </Typography>

                <Stack spacing={1}>
                  {courseIncludes.map((item, index) => (
                    <Box key={index}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          py: 2
                        }}
                      >
                        <Box sx={{ p: 1, bgcolor: 'var(--green-light)', borderRadius: '10px', display: 'flex' }}>
                          {item.icon}
                        </Box>
                        <Typography
                          sx={{
                            ml: 2,
                            fontSize: "14.5px",
                            color: "#475569",
                            fontWeight: 600
                          }}
                        >
                          {item.text}
                        </Typography>
                      </Box>
                      {index !== courseIncludes.length - 1 && (
                        <Divider sx={{ borderColor: "#f1f5f9" }} />
                      )}
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            {/* Related Courses */}
            <Card
              elevation={0}
              sx={{
                borderRadius: "24px",
                boxShadow: "0px 20px 40px rgba(0,0,0,0.04)",
                border: '1px solid #f1f5f9',
                padding: 4
              }}
            >
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: "20px",
                  mb: 4,
                  color: "var(--dark)",
                  fontFamily: '"Bricolage Grotesque", sans-serif',
                }}
              >
                Related Courses
              </Typography>

              {cats.length === 0 ? (
                <Typography sx={{ fontSize: "14px", color: "#94a3b8" }}>
                  Discovering more paths for you...
                </Typography>
              ) : (
                cats
                  .filter((cat) => cat.id !== course.category_id)
                  .slice(0, 3)
                  .map((cat) => (
                    <Box
                      key={cat.id}
                      onClick={() => handleCardClick(cat.id)}
                      sx={{
                        display: "flex",
                        gap: 2,
                        mb: 4,
                        cursor: "pointer",
                        alignItems: "center",
                        transition: "all 0.3s ease",
                        "&:hover": { 
                          transform: 'translateX(5px)',
                          "& .related-title": { color: 'var(--green)' }
                        }
                      }}
                    >
                      <Box
                        component="img"
                        src={getImgUrl(cat?.image) || "https://via.placeholder.com/80x60"}
                        alt={cat?.category}
                        sx={{
                          width: 85,
                          height: 65,
                          borderRadius: "12px",
                          objectFit: "cover",
                          boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          className="related-title"
                          sx={{
                            fontWeight: 700,
                            fontSize: "15px",
                            color: "var(--dark)",
                            transition: '0.2s'
                          }}
                        >
                          {cat?.category || "N/A"}
                        </Typography>
                      </Box>
                    </Box>
                  ))
              )}

              <Button 
                fullWidth 
                variant="outlined"
                sx={{ 
                  mt: 1, 
                  borderRadius: '12px', 
                  py: 1.2, 
                  fontWeight: 700,
                  borderColor: 'var(--green-mid)',
                  color: 'var(--green-dark)',
                  "&:hover": { bgcolor: 'var(--green-pale)', borderColor: 'var(--green)' }
                }}
              >
                Browse All Courses
              </Button>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CourseOverviewSection;
