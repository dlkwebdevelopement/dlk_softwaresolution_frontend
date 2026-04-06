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
  Collapse,
  Dialog,
  TextField,
  Rating,
  Avatar,
  Button
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import DownloadIcon from "@mui/icons-material/Download";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate, useParams } from "react-router-dom";
import { GetRequest, PostRequest } from "../../api/config";
import {
  ADMIN_GET_CATEGORIES,
  ADMIN_GET_COURSE_SLUG,
} from "../../api/endpoints";
import { BASE_URL, getImgUrl } from "../../api/api";
import toast from "react-hot-toast";
import QuickEnquiryModal from "../../components/QuickEnquiryModal";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const CourseOverviewSection = () => {
  const [value, setValue] = React.useState(0);
  const [expandedModule, setExpandedModule] = useState(0);
  const [openEnquiry, setOpenEnquiry] = useState(false);

  const { slug } = useParams();
  const [course, setCourse] = useState(null);

  // Review Posting State
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    student_name: "",
    rating: 5,
    review: ""
  });

  // Icon mapping for dynamic courseIncludes
  const iconMap = {
    PlayCircleFilled: <PlayCircleFilledIcon sx={{ color: '#10b981' }} />,
    Download: <DownloadIcon sx={{ color: '#10b981' }} />,
    AllInclusive: <AllInclusiveIcon sx={{ color: '#10b981' }} />,
    PhoneIphone: <PhoneIphoneIcon sx={{ color: '#10b981' }} />,
    WorkspacePremium: <WorkspacePremiumIcon sx={{ color: '#10b981' }} />,
    CheckCircle: <CheckCircleIcon sx={{ color: '#10b981' }} />,
  };

  const defaultIncludes = [
    {
      icon_name: "PlayCircleFilled",
      text: "10 hours on-demand video",
    },
    {
      icon_name: "Download",
      text: "20 downloadable resources",
    },
    {
      icon_name: "AllInclusive",
      text: "Full lifetime access",
    },
    {
      icon_name: "PhoneIphone",
      text: "Access on mobile and TV",
    },
    {
      icon_name: "WorkspacePremium",
      text: "Certificate of completion",
    },
  ];

  const currentIncludes = (course?.courseIncludes && course.courseIncludes.length > 0) 
    ? course.courseIncludes 
    : defaultIncludes;

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

  const fetchCourse = async () => {
    try {
      const res = await GetRequest(ADMIN_GET_COURSE_SLUG(slug));
      setCourse(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.student_name || !reviewForm.review) return toast.error("Please fill all fields");

    const payload = {
      ...reviewForm,
      course_id: course?._id || course?.id
    };

    console.log("Submitting Review Payload:", payload);

    try {
      setSubmittingReview(true);
      await PostRequest("/admin/course/review", payload);
      toast.success("Thank you for your review!");
      setOpenReviewModal(false);
      setReviewForm({ student_name: "", rating: 5, review: "" });
      fetchCourse(); // Refresh data
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    if (slug) fetchCourse();
  }, [slug]);

  // Dynamic Rating Calculations
  const ratingStats = React.useMemo(() => {
    const reviews = course?.reviews || [];
    if (reviews.length === 0) {
      return {
        average: Number(course?.rating) || 0,
        total: Number(course?.total_ratings) || 0,
        breakdown: [
          { label: "5 star", value: 0 },
          { label: "4 star", value: 0 },
          { label: "3 star", value: 0 },
          { label: "2 star", value: 0 },
          { label: "1 star", value: 0 },
        ]
      };
    }

    const counts = [0, 0, 0, 0, 0]; // index 0 = 5 star, 4 = 1 star
    reviews.forEach(r => {
      const star = Math.round(r.rating);
      if (star >= 1 && star <= 5) {
        counts[5 - star]++;
      }
    });

    const total = reviews.length;
    return {
      average: (reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1),
      total,
      breakdown: [
        { label: "5 star", value: Math.round((counts[0] / total) * 100) },
        { label: "4 star", value: Math.round((counts[1] / total) * 100) },
        { label: "3 star", value: Math.round((counts[2] / total) * 100) },
        { label: "2 star", value: Math.round((counts[3] / total) * 100) },
        { label: "1 star", value: Math.round((counts[4] / total) * 100) },
      ]
    };
  }, [course]);

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
                       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, mb: 2 }}>
                          {(module.description || `This module covers the core concepts related to ${module.title.toLowerCase()}. You'll learn the required theory followed by hands-on practical exercises to make sure you have fully understood the topics.`)
                            .split('\n')
                            .filter(line => line.trim() !== "")
                            .map((line, lIdx) => (
                              <Box key={lIdx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.2 }}>
                                <Box sx={{ 
                                  minWidth: '18px', 
                                  height: '18px', 
                                  borderRadius: '50%', 
                                  bgcolor: '#ecfdf5', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  mt: '2px'
                                }}>
                                  <CheckCircleIcon sx={{ fontSize: '14px', color: '#10b981' }} />
                                </Box>
                                <Typography sx={{ fontSize: '14px', color: '#475569', lineHeight: 1.5, fontWeight: 500 }}>
                                  {line.trim()}
                                </Typography>
                              </Box>
                          ))}
                       </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#10b981', mt: 1.5 }}>
                            <PlayCircleFilledIcon sx={{ fontSize: '18px', color: '#10b981' }} />
                            {module.link ? (
                              <Typography
                                component="a"
                                href={module.link.startsWith('http') ? module.link : `https://${module.link}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                  fontSize: '13.5px',
                                  fontWeight: 700,
                                  color: '#10b981',
                                  textDecoration: 'none',
                                  '&:hover': { textDecoration: 'underline' }
                                }}
                              >
                                View Course Resource / Lab
                              </Typography>
                            ) : (
                              <Typography sx={{ fontSize: '13.5px', fontWeight: 600 }}>
                                Includes Video Lectures & Hands-on Lab
                              </Typography>
                            )}
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
                  {ratingStats.average}
                </Typography>

                <Rating 
                  value={Number(ratingStats.average)} 
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
                  Course Rating ({ratingStats.total})
                </Typography>
              </Box>

              {/* Rating Bars */}
              <Box sx={{ flex: 1, width: "100%" }}>
                {ratingStats.breakdown.map((item, index) => (
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
            {course?.reviews && course.reviews.length > 0 ? (
              course.reviews.map((review, i) => (
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
                    "{review.review}"
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, pt: 2, borderTop: '1px solid #f1f5f9' }}>
                    <Avatar 
                      src={getImgUrl(review.student_avatar)} 
                      sx={{ width: 40, height: 40 }} 
                    >
                      {review.student_name?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>{review.student_name}</Typography>
                      <Typography sx={{ fontSize: "12px", color: "#64748b" }}>
                        Verified Student • {dayjs(review.createdAt).fromNow()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))
            ) : (
              <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', py: 6, bgcolor: '#fff', borderRadius: '24px', border: '1px dashed #cbd5e1' }}>
                <Typography sx={{ color: '#64748b', fontSize: '16px', fontWeight: 500 }}>
                  No reviews yet for this course. Be the first to share your experience!
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 2, flexWrap: 'wrap' }}>
             <Button 
               variant="contained" 
               onClick={() => setOpenReviewModal(true)}
               sx={{ 
                 borderRadius: '12px', 
                 bgcolor: '#10b981', 
                 fontWeight: 600, 
                 px: 4, 
                 py: 1.5, 
                 boxShadow: '0 4px 12px rgba(16,185,129,0.2)',
                 '&:hover': { bgcolor: '#059669' } 
               }}
             >
               Write a Review
             </Button>
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
                  {currentIncludes.map((item, index) => (
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
                          {iconMap[item.icon_name] || <CheckCircleIcon sx={{ color: '#10b981' }} />}
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
                      {index !== currentIncludes.length - 1 && (
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

      <QuickEnquiryModal 
        open={openEnquiry} 
        onClose={() => setOpenEnquiry(false)}
        initialCourse={course?.title}
      />

      <Dialog 
        open={openReviewModal} 
        onClose={() => setOpenReviewModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '24px' } }}
      >
        <Box sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 1, color: '#0f172a', fontFamily: '"Poppins", sans-serif' }}>
            Write a Review
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 4 }}>
            Share your experience with other students.
          </Typography>

          <form onSubmit={handleReviewSubmit}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#475569', mb: 1, fontWeight: 600 }}>Your Rating</Typography>
                <Rating 
                  size="large"
                  value={reviewForm.rating}
                  onChange={(e, val) => setReviewForm({ ...reviewForm, rating: val })}
                  sx={{ color: '#f59e0b' }}
                />
              </Box>

              <TextField 
                fullWidth 
                label="Full Name" 
                placeholder="Enter your name"
                required
                value={reviewForm.student_name}
                onChange={(e) => setReviewForm({ ...reviewForm, student_name: e.target.value })}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: '12px' } }}
              />

              <TextField 
                fullWidth 
                multiline
                rows={4}
                label="Your Review" 
                placeholder="What did you like most about the course?"
                required
                value={reviewForm.review}
                onChange={(e) => setReviewForm({ ...reviewForm, review: e.target.value })}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: '12px' } }}
              />

              <Box sx={{ display: 'flex', gap: 2, pt: 2 }}>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  onClick={() => setOpenReviewModal(false)}
                  sx={{ borderRadius: '12px', py: 1.5, fontWeight: 600, color: '#64748b', borderColor: '#cbd5e1' }}
                >
                  Cancel
                </Button>
                <Button 
                  fullWidth 
                  type="submit"
                  disabled={submittingReview}
                  variant="contained" 
                  sx={{ borderRadius: '12px', py: 1.5, fontWeight: 600, bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}
                >
                  {submittingReview ? "Posting..." : "Post Review"}
                </Button>
              </Box>
            </Stack>
          </form>
        </Box>
      </Dialog>
    </Box>
  );
};

export default CourseOverviewSection;
