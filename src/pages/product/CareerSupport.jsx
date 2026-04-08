import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, Container, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useParams } from "react-router-dom";
import { GetRequest } from "../../api/api";
import { ADMIN_GET_COURSE_SLUG } from "../../api/endpoints";

// Illustrations from Storyset/Freepik or placeholders resembling the screenshot
const servicesList = [
  {
    title: "Interview Preparation Support",
    description: "Access curated resources to crack technical and HR Interviews.",
    image: "https://img.freepik.com/free-vector/job-interview-concept-illustration_114360-6616.jpg",
    bgColor: "#F0FDF4", // light green
    borderColor: "#DCFCE7",
  },
  {
    title: "Exclusive Networking Opportunities",
    description: "Connect with hiring partners, alumni, and industry professionals.",
    image: "https://img.freepik.com/free-vector/social-network-concept-illustration_114360-1011.jpg",
    bgColor: "#F5F3FF", // light purple
    borderColor: "#DDD6FE",
  },
  {
    title: "One-on-one Mock Interviews",
    description: "Master full-stack skills with expert-led, beginner-friendly content.",
    image: "https://img.freepik.com/free-vector/business-meeting-concept-illustration_114360-5690.jpg",
    bgColor: "#F3E8FF", // light purple shade
    borderColor: "#E9D5FF",
  },
  {
    title: "Resume Optimization Support",
    description: "Practice live interviews and get step-by-step career guidance reviews.",
    image: "https://img.freepik.com/free-vector/resume-concept-illustration_114360-5166.jpg",
    bgColor: "#F0FDF4",
    borderColor: "#DCFCE7",
  },
  {
    title: "Dedicated Placement Support",
    description: "Get placed in top tech companies with our 100+ hiring partners.",
    image: "https://img.freepik.com/free-vector/job-hunt-concept-illustration_114360-6194.jpg",
    bgColor: "#F3E8FF",
    borderColor: "#E9D5FF",
  },
];

export default function CareerSupport() {
  const { slug } = useParams();
  const [courseTitle, setCourseTitle] = useState("");
  const scrollRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (!slug) return;
        const res = await GetRequest(ADMIN_GET_COURSE_SLUG(slug));
        if (res?.success) {
          setCourseTitle(res.data?.title || "");
        }
      } catch (err) {
        console.error("Failed to fetch course title for support section:", err);
      }
    };
    fetchCourse();
  }, [slug]);

  const handleScroll = (direction) => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    let scrollTo = scrollLeft;

    const cardWidth = clientWidth / 3;
    const gap = 24; 

    if (direction === "left") {
      scrollTo -= (cardWidth + gap);
    } else {
      scrollTo += (cardWidth + gap);
    }

    scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
  };

  const updateScrollProgress = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    if (scrollWidth === clientWidth) return setScrollPosition(0);
    const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
    setScrollPosition(progress);
  };

  return (
    <Box sx={{ py: 8, bgcolor: "#fff" }}>
      <Box sx={{ maxWidth: "1320px", mx: "auto", px: { xs: 2, md: 6 } }}>
        {/* Title Section */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: "#0f172a",
              fontSize: { xs: "1.75rem", md: "2.25rem" },
              mb: 1,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Your {courseTitle || "MERN Stack"} Career Journey Starts Here
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "#64748b",
              maxWidth: "600px",
              mx: "auto",
              fontSize: "1rem",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Start strong with industry-relevant training and step-by-step career guidance.
          </Typography>
        </Box>

        {/* Carousel Container */}
        <Box 
          ref={scrollRef}
          onScroll={updateScrollProgress}
          sx={{
            display: "flex",
            gap: 3,
            overflowX: "auto",
            scrollBehavior: "smooth",
            pb: 4,
            width: "100%",
            // Hide Scrollbar
            "&::-webkit-scrollbar": { display: "none" },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {servicesList.map((item, index) => (
            <Box
              key={index}
              sx={{
                minWidth: { xs: "280px", sm: "calc(33.33% - 16px)", md: "calc(33.33% - 16px)" },
                width: { xs: "280px", sm: "calc(33.33% - 16px)", md: "calc(33.33% - 16px)" },
                flex: "0 0 auto",
                borderRadius: "24px",
                border: `1.5px solid ${item.borderColor}`,
                padding: "32px 24px",
                bgcolor: item.bgColor,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 2,
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.03), 0 4px 6px -2px rgba(0,0,0,0.02)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 20px 25px -5px rgba(0,0,0,0.06)",
                }
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 800, 
                  color: "#0f172a", 
                  fontSize: "1.25rem",
                  fontFamily: "'Inter', sans-serif",
                  wordBreak: "break-word",
                }}
              >
                {item.title}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: "#64748b", 
                  fontSize: "0.9rem", 
                  minHeight: "40px",
                  lineHeight: 1.6 
                }}
              >
                {item.description}
              </Typography>

              {/* Illustration Cover */}
              <Box sx={{ mt: 2, width: "100%", height: "180px", display: "flex", justifyContent: "center" }}>
                <img 
                  src={item.image} 
                  alt={item.title} 
                  style={{ 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "contain",
                    borderRadius: "12px",
                  }} 
                />
              </Box>
            </Box>
          ))}
        </Box>

        {/* Carousel Bottom Controls */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2, px: 2 }}>
          {/* Progress Indicator Track */}
          <Box sx={{ width: "200px", height: "4px", bgcolor: "#E2E8F0", borderRadius: "2px", position: "relative" }}>
            <Box 
              sx={{ 
                height: "100%", 
                bgcolor: "#7C3AED", // purple track
                borderRadius: "2px", 
                width: `${Math.min(100, Math.max(0, scrollPosition)) || 10}%`,
                transition: "width 0.2s ease" 
              }} 
            />
          </Box>

          {/* Pagination Arrows */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton 
              onClick={() => handleScroll("left")}
              sx={{ border: "1px solid #E2E8F0", color: "#64748b", "&:hover": { bgcolor: "#F8FAFC" } }}
            >
              <ChevronLeft size={20} />
            </IconButton>
            <IconButton 
              onClick={() => handleScroll("right")}
              sx={{ border: "1px solid #E2E8F0", color: "#64748b", "&:hover": { bgcolor: "#F8FAFC" } }}
            >
              <ChevronRight size={20} />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
