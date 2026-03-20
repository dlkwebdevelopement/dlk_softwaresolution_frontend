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
  Stack,
  Collapse
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import DownloadIcon from "@mui/icons-material/Download";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
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
import toast from "react-hot-toast";

const CourseOverviewSection = () => {
  const [value, setValue] = React.useState(0);
  const [expandedModule, setExpandedModule] = useState(0);

  const { slug } = useParams();
  const [course, setCourse] = useState(null);

  const courseIncludes = [
    {
      icon: <PlayCircleFilledIcon sx={{ color: '#10b981' }} />,
      text: "10 hours on-demand video",
    },
    {
      icon: <DownloadIcon sx={{ color: '#10b981' }} />,
      text: "20 downloadable resources",
    },
    {
      icon: <AllInclusiveIcon sx={{ color: '#10b981' }} />,
      text: "Full lifetime access",
    },
    {
      icon: <PhoneIphoneIcon sx={{ color: '#10b981' }} />,
      text: "Access on mobile and TV",
    },
    {
      icon: <WorkspacePremiumIcon sx={{ color: '#10b981' }} />,
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
        toast.error("Course not found for this category");
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

  const toggleModule = (index) => {
    setExpandedModule(expandedModule === index ? null : index);
  }

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
        <Box data-aos="fade-up" sx={{ animation: 'fadeIn 0.5s ease' }}>
          {/* Who Should Enroll */}
          <Typography
            sx={{
              fontSize: "28px",
              fontWeight: 600,
              color: "#0f172a",
              mb: 2.5,
              fontFamily: '"Poppins", sans-serif',
              position: 'relative',
              display: 'inline-block',
              "&::after": {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: 0,
                width: '40px',
                height: '4px',
                borderRadius: '4px',
                bgcolor: '#10b981'
              }
            }}
          >
            Who Should Enroll?
          </Typography>

          <Box sx={{ mb: 5, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
            {course?.whoShouldEnroll?.map((item, index) => (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  p: 2,
                  borderRadius: '16px',
                  bgcolor: '#fff',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  "&:hover": { 
                    transform: 'translateY(-4px)', 
                    borderColor: '#34d399',
                    boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.1)'
                  }
                }}
              >
                <Box sx={{ 
                  bgcolor: '#ecfdf5', 
                  p: 1, 
                  borderRadius: '10px', 
                  display: 'flex', 
                  mr: 2,
                  mt: -0.5
                }}>
                  <CheckCircleIcon sx={{ color: "#10b981", fontSize: 24 }} />
                </Box>
                <Typography
                  sx={{
                    color: "#334155",
                    lineHeight: 1.6,
                    fontSize: "15px",
                    fontWeight: 600
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
              fontWeight: 600,
              color: "#0f172a",
              mb: 2.5,
              fontFamily: '"Poppins", sans-serif',
              position: 'relative',
              display: 'inline-block',
              "&::after": {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: 0,
                width: '40px',
                height: '4px',
                borderRadius: '4px',
                bgcolor: '#10b981'
              }
            }}
          >
            What You'll Learn
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
                  p: 3,
                  borderRadius: '16px',
                  background: 'linear-gradient(145deg, #ecfdf5 0%, #f0fdf4 100%)',
                  border: '1px solid #a7f3d0',
                  transition: '0.3s',
                  "&:hover": {
                    borderColor: '#34d399',
                    background: '#e6fcf5',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.1)'
                  }
                }}
              >
                <Box sx={{ mt: '2px', mr: 2 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" fill="#10B981" fillOpacity="0.2"/>
                    <path d="M7.75 11.9999L10.58 14.8299L16.25 9.16992" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Box>
                <Typography
                  sx={{
                    color: "#0f172a",
                    fontSize: "15px",
                    fontWeight: 600,
                    lineHeight: 1.6
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
        <Box data-aos="fade-up" sx={{ animation: 'fadeIn 0.5s ease' }}>
          <Typography
            sx={{
              fontSize: "28px",
              fontWeight: 600,
              color: "#0f172a",
              mb: 4,
              fontFamily: '"Poppins", sans-serif',
              position: 'relative',
              display: 'inline-block',
              "&::after": {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: 0,
                width: '40px',
                height: '4px',
                borderRadius: '4px',
                bgcolor: '#10b981'
              }
            }}
          >
            Course Curriculum
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {course?.curriculum?.map((module, index) => {
              const isExpanded = expandedModule === index;
              return (
              <Box
                key={module.id}
                sx={{
                  border: "1px solid",
                  borderColor: isExpanded ? "#34d399" : "#e2e8f0",
                  borderRadius: "16px",
                  backgroundColor: "#ffffff",
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  boxShadow: isExpanded ? '0 10px 25px -5px rgba(16, 185, 129, 0.1), 0 8px 10px -6px rgba(16, 185, 129, 0.1)' : '0 1px 3px rgba(0,0,0,0.02)',
                }}
                onClick={() => toggleModule(index)}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                    bgcolor: isExpanded ? '#f8fafc' : 'transparent',
                  }}
                >
                  <Box sx={{ display: 'flex', gap: {xs: 1.5, sm: 2}, alignItems: 'center', width: '90%' }}>
                    <Box sx={{ 
                      minWidth: '36px', 
                      height: '36px', 
                      borderRadius: '10px', 
                      bgcolor: isExpanded ? '#10b981' : '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: '0.3s'
                    }}>
                      <Typography 
                        sx={{ 
                          color: isExpanded ? '#fff' : '#64748b', 
                          fontWeight: 600, 
                          fontSize: '14px',
                        }}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: {xs: "15px", sm: "16px"},
                          color: '#0f172a',
                          mb: 0.2
                        }}
                      >
                        {module.title}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: "13px",
                          color: "#64748b",
                          fontWeight: 500
                        }}
                      >
                        {module.lessons_info || "2 Lessons • 45 Min"}
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isExpanded ? '#10b981' : '#94a3b8',
                      bgcolor: isExpanded ? '#ecfdf5' : 'transparent',
                      transition: 'transform 0.3s ease'
                    }}
                  >
                    {isExpanded ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                  </Box>
                </Box>

                {/* Expanded Content Area */}
                <Collapse in={isExpanded}>
                    <Box sx={{ p: 2.5, pt: 0, px: {xs: 2.5, sm: 6} }}>
                       <Divider sx={{ mb: 2, borderColor: '#f1f5f9' }}/>
                       <Typography sx={{ fontSize: '14px', color: '#475569', lineHeight: 1.5, mb: 1.5 }}>
                          This module covers the core concepts related to {module.title.toLowerCase()}. You'll learn the required theory followed by hands-on practical exercises to make sure you have fully understood the topics.
                       </Typography>
                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#10b981', mt: 1.5 }}>
                           <PlayCircleFilledIcon sx={{ fontSize: '18px' }} />
                           <Typography sx={{ fontSize: '13.5px', fontWeight: 600 }}>Includes Video Lectures & Hands-on Lab</Typography>
                       </Box>
                    </Box>
                </Collapse>
              </Box>
            )})}
          </Box>
        </Box>
      );
    }

    if (value === 2) {
      return (
        <Box data-aos="fade-up" sx={{ animation: 'fadeIn 0.5s ease' }}>
          <Typography
            sx={{
              fontSize: "28px",
              fontWeight: 600,
              mb: 4,
              color: "#0f172a",
              fontFamily: '"Poppins", sans-serif',
              position: 'relative',
              display: 'inline-block',
              "&::after": {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: 0,
                width: '40px',
                height: '4px',
                borderRadius: '4px',
                bgcolor: '#10b981'
              }
            }}
          >
            Student Reviews
          </Typography>

          {/* Rating Summary Card */}
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: "24px",
              p: { xs: 3, md: 5 },
              boxShadow: "0 10px 30px -5px rgba(0,0,0,0.05)",
              mb: 6,
              border: '1px solid #e2e8f0',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
             {/* Decorative blob in review card */}
             <Box sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 150,
                height: 150,
                bgcolor: 'rgba(245, 158, 11, 0.1)',
                borderRadius: '50%',
                filter: 'blur(30px)',
             }}/>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
                gap: 6,
                position: 'relative',
                zIndex: 1
              }}
            >
              {/* Left Big Rating */}
              <Box sx={{ textAlign: "center", minWidth: 160 }}>
                <Typography
                  sx={{
                    fontSize: "64px",
                    fontWeight: 600,
                    color: "#0f172a",
                    lineHeight: 1,
                    fontFamily: '"Poppins", sans-serif',
                  }}
                >
                  {course?.rating || 4.8}
                </Typography>

                <Rating 
                  value={Number(course?.rating) || 4.8} 
                  precision={0.5} 
                  readOnly 
                  size="large"
                  sx={{ my: 1.5, color: '#f59e0b' }} 
                />

                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "#64748b",
                    fontWeight: 600
                  }}
                >
                  Course Rating ({course?.total_ratings || 0})
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
                      mb: 1.5
                    }}
                  >
                    <Rating value={5 - index} max={5 - index} readOnly size="small" sx={{color: '#f59e0b', mr: 2, display: {xs: 'none', sm: 'flex'} }}/>
                    <Typography
                      sx={{ width: {xs: 50, sm: 'auto'}, fontSize: "13px", color: '#475569', fontWeight: 600, display: {xs: 'block', sm: 'none'} }}
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
                      sx={{ width: 40, fontSize: "14px", color: '#0f172a', fontWeight: 600, textAlign: 'right' }}
                    >
                      {item.value}%
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Individual Reviews Grid */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 4 }}>
            {[
              {
                name: "Arun Kumar",
                img: "https://i.pravatar.cc/100?img=11",
                role: "Software Developer",
                content: "Absolutely loved this! The practical sessions helped me land my dream role. Mentoring was world-class and very easy to follow even for beginners.",
                date: "2 weeks ago",
                rating: 5
              },
              {
                name: "Priyanka S",
                img: "https://i.pravatar.cc/100?img=26",
                role: "Data Analyst",
                content: "The curriculum is very well-structured. I found the concepts easy to grasp through the real-world projects. Highly recommended for upgrades.",
                date: "1 month ago",
                rating: 5
              },
              {
                name: "Rahul Verma",
                img: "https://i.pravatar.cc/100?img=33",
                role: "Student",
                content: "Best investment for my career. The projects you build are portfolio-ready and the instructors actually care about your progress.",
                date: "2 months ago",
                rating: 4.5
              },
               {
                name: "Neha Sharma",
                img: "https://i.pravatar.cc/100?img=47",
                role: "Freelancer",
                content: "The depth of topics covered is amazing. They don't just teach the syntax, but also the best industry practices. The support team is also very responsive.",
                date: "3 months ago",
                rating: 5
              }
            ].map((review, i) => (
              <Box
                key={i}
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: "20px",
                  p: 3,
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                  border: '1px solid #e2e8f0',
                  transition: '0.3s',
                  display: 'flex',
                  flexDirection: 'column',
                  "&:hover": { transform: 'translateY(-4px)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)', borderColor: '#e2e8f0' }
                }}
              >
                <Rating value={review.rating} precision={0.5} readOnly size="small" sx={{ color: '#f59e0b', mb: 1.5 }} />
                
                <Typography sx={{ color: "#334155", mb: 3, lineHeight: 1.6, fontSize: '14.5px', flexGrow: 1, fontStyle: 'italic' }}>
                  "{review.content}"
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2, pt: 2, borderTop: '1px solid #f1f5f9' }}>
                  <Avatar 
                    src={review.img} 
                    sx={{ width: 40, height: 40 }} 
                  />
                  <Box>
                    <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>{review.name}</Typography>
                    <Typography sx={{ fontSize: "12px", color: "#64748b" }}>
                      {review.role} • {review.date}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
             <Button variant="outlined" sx={{ borderRadius: '12px', color: '#0f172a', borderColor: '#cbd5e1', fontWeight: 600, px: 4, py: 1.5, '&:hover': { bgcolor: '#f8fafc', borderColor: '#94a3b8' } }}>Show More Reviews</Button>
          </Box>
        </Box>
      );
    }
  };

  if (!course) {
    return (
      <Box sx={{ p: 10, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ color: '#064e3b', fontWeight: 600 }}>Preparing your learning journey...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f8fafc", py: {xs: 6, md: 8}, overflowX: "hidden" }}>
      <Container maxWidth="lg">
        {/* Premium Segmented Tabs */}
        <Box sx={{ display: "flex", justifyContent: {xs: "center", md: "flex-start"}, mb: 4 }}>
          <Tabs
            value={value}
            onChange={handleChange}
            TabIndicatorProps={{ style: { display: "none" } }}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              padding: "6px",
              minHeight: "auto",
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
              border: '1px solid #e2e8f0',
              "& .MuiTabs-flexContainer": {
                gap: 0.5
              }
            }}
          >
            {["Overview", "Curriculum", "Reviews"].map((tab, index) => (
              <Tab
                key={index}
                label={tab}
                disableRipple
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "15px",
                  minHeight: "40px",
                  borderRadius: "12px",
                  px: 3.5,
                  color: "#64748b",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&.Mui-selected": {
                    backgroundColor: "#10b981",
                    color: "#ffffff !important",
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2), 0 2px 4px rgba(16, 185, 129, 0.1)'
                  },
                  "&:hover:not(.Mui-selected)": {
                    backgroundColor: "#f1f5f9",
                    color: "#0f172a",
                  }
                }}
              />
            ))}
          </Tabs>
        </Box>

        {/* 68 / 32 Layout */}
        <Box
          sx={{
            display: "flex",
            gap: {xs: 4, lg: 5},
            flexDirection: { xs: "column", md: "row" }
          }}
        >
          {/* LEFT SIDE 68% */}
          <Box
            sx={{
              width: { xs: "100%", md: "65%" }
            }}
          >
            {renderLeftContent()}
          </Box>

          {/* RIGHT SIDE 32% */}
          <Box
            sx={{
              width: { xs: "100%", md: "35%" },
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              mt: {xs: 3, md: 0}
            }}
          >
            {/* Includes Card */}
            <Card
              elevation={0}
              sx={{
                borderRadius: "24px",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)",
                border: '1px solid #e2e8f0',
                background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                overflow: 'visible'
              }}
            >
              <CardContent sx={{ p: {xs: 2.5, md: 3} }}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: "19.5px",
                    mb: 2,
                    color: "#0f172a",
                    fontFamily: '"Poppins", sans-serif',
                  }}
                >
                  This course includes:
                </Typography>

                <Stack spacing={0}>
                  {courseIncludes.map((item, index) => (
                    <Box key={index}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          py: 1.5,
                          transition: 'transform 0.2s ease',
                          "&:hover": { transform: 'translateX(4px)' }
                        }}
                      >
                        <Box sx={{ p: 0.8, bgcolor: '#ecfdf5', borderRadius: '10px', display: 'flex' }}>
                          {item.icon}
                        </Box>
                        <Typography
                          sx={{
                            ml: 2,
                            fontSize: "14.5px",
                            color: "#334155",
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
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)",
                border: '1px solid #e2e8f0',
                padding: {xs: 2.5, md: 3},
                background: '#fff'
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "19.5px",
                  mb: 2.5,
                  color: "#0f172a",
                  fontFamily: '"Poppins", sans-serif',
                }}
              >
                Top Related Paths
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
                        gap: 2.5,
                        mb: 3,
                        cursor: "pointer",
                        alignItems: "center",
                        p: 1.5,
                        borderRadius: '16px',
                        transition: "all 0.3s ease",
                        "&:hover": { 
                          bgcolor: '#f8fafc',
                          transform: 'translateY(-2px)',
                          "& .related-title": { color: '#059669' }
                        }
                      }}
                    >
                      <Box
                        component="img"
                        src={getImgUrl(cat?.image) || "https://via.placeholder.com/80?text=Course"}
                        alt={cat?.category}
                        sx={{
                          width: 80,
                          height: 60,
                          borderRadius: "12px",
                          objectFit: "cover",
                          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          className="related-title"
                          sx={{
                            fontWeight: 600,
                            fontSize: "15px",
                            color: "#0f172a",
                            transition: 'color 0.2s',
                            lineHeight: 1.3
                          }}
                        >
                          {cat?.categoryName || "N/A"}
                        </Typography>
                        <Typography sx={{ fontSize: '13px', color: '#64748b', mt: 0.5 }}>
                          Certification Path
                        </Typography>
                      </Box>
                    </Box>
                  ))
              )}

              <Button 
                fullWidth 
                variant="outlined"
                sx={{ 
                  mt: 2, 
                  borderRadius: '12px', 
                  py: 1.5, 
                  fontWeight: 600,
                  fontSize: '15px',
                  borderColor: '#cbd5e1',
                  color: '#0f172a',
                  textTransform: 'none',
                  "&:hover": { bgcolor: '#f8fafc', borderColor: '#94a3b8' }
                }}
              >
                Browse All Categories
              </Button>
            </Card>
          </Box>
        </Box>
      </Container>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Box>
  );
};

export default CourseOverviewSection;
