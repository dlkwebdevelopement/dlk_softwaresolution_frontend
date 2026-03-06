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
import { BASE_URL } from "../../api/api";

const CourseOverviewSection = () => {
  const [value, setValue] = React.useState(0);

  const { slug } = useParams();
  const [course, setCourse] = useState(null);

  const courseIncludes = [
    {
      icon: <PlayCircleFilledIcon />,
      text: "10 hours on-demand video",
    },
    {
      icon: <DownloadIcon />,
      text: "20 downloadable resources",
    },
    {
      icon: <AllInclusiveIcon />,
      text: "Full lifetime access",
    },
    {
      icon: <PhoneIphoneIcon />,
      text: "Access on mobile and TV",
    },
    {
      icon: <WorkspacePremiumIcon />,
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
    console.log("Current slug:", slug);
    const fetchCourse = async () => {
      try {
        const res = await GetRequest(ADMIN_GET_COURSE_SLUG(slug));
        setCourse(res.data); // because response = { success, data }
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
      once: false, // important for animation on scroll up & down
      mirror: true, // allows animation when scrolling back up
      offset: 50,
    });
  }, []);

  const renderLeftContent = () => {
    if (value === 0) {
      return (
        <>
          <Box
            data-aos="fade-up"
            sx={{
              width: "100%" }}
          >
            {/* Who Should Enroll */}
            <Typography
              data-aos="fade-up"
              data-aos-delay="100"
              sx={{
                fontSize: "26px",
                fontWeight: 700,
                color: "#0f172a",
                mb: 3 }}
            >
              Who Should Enroll?
            </Typography>

            {course?.whoShouldEnroll?.map((item, index) => (
              <Box
                key={item.id}
                data-aos="fade-up"
                data-aos-delay={150 + index * 100}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  mb: 2.5 }}
              >
                <CheckCircleIcon
                  sx={{
                    color: "#16a34a",
                    fontSize: 20,
                    mr: 2,
                    mt: "4px",
                    lineHeight: 2 }}
                />
                <Typography
                  sx={{
                    color: "#475569",
                    lineHeight: 2,
                    fontSize: "15px" }}
                >
                  {item.content}
                </Typography>
              </Box>
            ))}

            {/* What You'll Learn */}
            <Typography
              data-aos="fade-up"
              data-aos-delay="150"
              sx={{
                fontSize: "26px",
                fontWeight: 700,
                color: "#0f172a",
                mt: 7,
                mb: 3 }}
            >
              What You'll Learn?
            </Typography>

            <Box
              data-aos="fade-up"
              sx={{
                width: "100%",
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr", // 1 column on mobile
                  sm: "1fr 1fr", // 2 equal columns from small screens up
                },
                gap: 2 }}
            >
              {course?.learningPoints?.map((item) => (
                <Box
                  key={item.id}
                  sx={{ display: "flex", alignItems: "flex-start" }}
                >
                  <CheckCircleIcon
                    sx={{
                      color: "#16a34a",
                      fontSize: 20,
                      mr: 2,
                      mt: "3px",
                      lineHeight: 2 }}
                  />
                  <Typography
                    sx={{
                      color: "#475569",
                      fontSize: "15px",
                      lineHeight: 2 }}
                  >
                    {item.content}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </>
      );
    }

    if (value === 1) {
      return (
        <>
          {/* Curriculum Section */}
          <Typography
            sx={{
              fontSize: "26px",
              fontWeight: 700,
              color: "#0f172a",
              mb: 3 }}
          >
            Course Curriculum
          </Typography>

          {course?.curriculum?.map((module) => (
            <Box
              key={module.id}
              sx={{
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: 3,
                mb: 0.5,
                backgroundColor: "#ffffff" }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center" }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: "16px" }}
                  >
                    {module.title}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "13px",
                      color: "#64748b" }}
                  >
                    {module.lessons_info || "No lessons available"}
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    color: "#64748b",
                    fontSize: "20px" }}
                >
                  ⌄
                </Typography>
              </Box>
            </Box>
          ))}
        </>
      );
    }

    if (value === 2) {
      return (
        <>
          {/* Title */}
          <Typography
            sx={{
              fontSize: "26px",
              fontWeight: 700,
              mb: 3,
              color: "#0f172a",
              position: "relative",
              display: "inline-block",
              "&:after": {
                content: '""',
                position: "absolute",
                left: 0,
                bottom: -6,
                width: "40%",
                height: "3px",
                backgroundColor: "#48723e",
                borderRadius: "10px",
              } }}
          >
            Student Reviews
          </Typography>

          {/* Rating Summary Card */}
          <Box
            data-aos="fade-"
            sx={{
              backgroundColor: "#fff",
              borderRadius: "14px",
              p: 4,
              boxShadow: "0px 5px 20px rgba(0,0,0,0.05)",
              mb: 5 }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
                gap: 5 }}
            >
              {/* Left Big Rating */}
              <Box sx={{ textAlign: "center", minWidth: 120 }}>
                <Typography
                  sx={{
                    fontSize: "48px",
                    fontWeight: 700,
                    color: "#f59e0b" }}
                >
                  {course?.rating || 0}
                </Typography>

                <Rating value={Number(course?.rating) || 0} />

                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "#64748b",
                    mt: 1 }}
                >
                  {course?.total_ratings || 0} Ratings
                </Typography>
              </Box>

              {/* Rating Bars */}
              <Box sx={{ flex: 1, width: "100%" }}>
                {[
                  { label: "5 star", value: 0 },
                  { label: "4 star", value: 0 },
                  { label: "3 star", value: 0 },
                  { label: "2 star", value: 0 },
                  { label: "1 star", value: 0 },
                ].map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1.5 }}
                  >
                    <Typography
                      sx={{ width: 60, fontSize: "14px" }}
                    >
                      {item.label}
                    </Typography>

                    <Box
                      sx={{
                        flex: 1,
                        height: 6,
                        backgroundColor: "#e2e8f0",
                        borderRadius: 10,
                        mx: 2,
                        overflow: "hidden" }}
                    >
                      <Box
                        sx={{
                          width: `${item.value}%`,
                          height: "100%",
                          backgroundColor: "#bfdb81" }}
                      />
                    </Box>

                    <Typography
                      sx={{ width: 35, fontSize: "14px" }}
                    >
                      {item.value}%
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Individual Review */}
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: "14px",
              p: 4,
              boxShadow: "0px 5px 20px rgba(0,0,0,0.05)" }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Avatar src="https://i.pravatar.cc/100?img=3" />

              <Box>
                <Typography sx={{ fontWeight: 600 }}>Aruna</Typography>
                <Rating value={5} readOnly size="small" />
                <Typography
                  sx={{
                    fontSize: "13px",
                    color: "#64748b" }}
                >
                  2 weeks ago
                </Typography>
              </Box>
            </Box>

            <Typography sx={{ color: "#334155", mb: 3 }}>
              “Absolutely loved the AI Master Program! The LLM and NLP modules
              helped me land an NLP Research role. Weekly mentoring was a huge
              plus!”
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2 }}
            >
              <Typography
                sx={{ fontSize: "14px", color: "#64748b" }}
              >
                Was this helpful?
              </Typography>

              <Button size="small" variant="outlined">
                👍 Yes (42)
              </Button>

              <Button size="small" variant="outlined">
                👎 No (1)
              </Button>
            </Box>
          </Box>
          {/* individual rating 2 */}
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: "14px",
              p: 4,
              mt: 2,
              boxShadow: "0px 5px 20px rgba(0,0,0,0.05)" }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Avatar src="https://i.pravatar.cc/120?img03" />

              <Box>
                <Typography sx={{ fontWeight: 600 }}>Sandy</Typography>
                <Rating value={5} readOnly size="small" />
                <Typography
                  sx={{
                    fontSize: "13px",
                    color: "#64748b" }}
                >
                  12 weeks ago
                </Typography>
              </Box>
            </Box>

            <Typography sx={{ color: "#334155", mb: 3 }}>
              “Absolutely loved the AI Master Program! The LLM and NLP modules
              helped me land an NLP Research role. Weekly mentoring was a huge
              plus!”
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2 }}
            >
              <Typography sx={{ fontSize: "14px", color: "#64748b" }}>
                Was this helpful?
              </Typography>

              <Button size="small" variant="outlined">
                👍 Yes (42)
              </Button>

              <Button size="small" variant="outlined">
                👎 No (1)
              </Button>
            </Box>
          </Box>
        </>
      );
    }
  };

  if (!course) {
    return (
      <Box sx={{ p: 5 }}>
        <Typography>Loading course...</Typography>
      </Box>
    );
  }
  return (
    <Box sx={{ backgroundColor: "#f8fafc", py: 8, overflowX: "hidden" }}>
      <Container maxWidth="lg">
        {/* Centered Button Tabs */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 6 }}>
          <Tabs
            value={value}
            onChange={handleChange}
            TabIndicatorProps={{ style: { display: "none" } }}
            sx={{
              backgroundColor: "#f1f5f9",
              borderRadius: "999px",
              padding: "4px",
              minHeight: "auto" }}
          >
            {["Overview", "Curriculum", "Reviews"].map((tab, index) => (
              <Tab
                key={index}
                label={tab}
                disableRipple
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "14px",
                  minHeight: "36px",
                  borderRadius: "999px",
                  px: 3,
                  color: "#334155",
                  transition: "all 0.25s ease",

                  "&.Mui-selected": {
                    backgroundColor: "#48723e",
                    color: "#ffffff !important",
                  },

                  "&:hover": {
                    backgroundColor: "rgba(72, 114, 62, 0.1)",
                  } }}
              />
            ))}
          </Tabs>
        </Box>

        {/* FLEX 70 / 30 Layout */}
        <Box
          sx={{
            display: "flex",
            gap: 5,
            flexDirection: { xs: "column", md: "row" } }}
        >
          {/* LEFT SIDE 70% */}
          <Box
            sx={{
              width: { xs: "100%", md: "70%" } }}
          >
            {renderLeftContent()}
          </Box>

          {/* RIGHT SIDE 30% */}
          <Box
            data-aos="fade-left"
            sx={{
              width: { xs: "100%", md: "30%" } }}
          >
            <Card
              data-aos="fade-left"
              data-aos-delay="100"
              elevation={0}
              sx={{
                borderRadius: "16px",
                boxShadow: "0px 15px 35px rgba(0,0,0,0.06)" }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "18px",
                    mb: 3,
                    color: "#0f172a" }}
                >
                  This course includes:
                </Typography>

                {courseIncludes.map((item, index) => (
                  <Box key={index}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        py: 2 }}
                    >
                      {item.icon}
                      <Typography
                        sx={{
                          ml: 2,
                          fontSize: "14px",
                          color: "#475569" }}
                      >
                        {item.text}
                      </Typography>
                    </Box>

                    {index !== courseIncludes.length - 1 && (
                      <Divider sx={{ borderColor: "#e2e8f0" }} />
                    )}
                  </Box>
                ))}
              </CardContent>
            </Card>

            {/* Related Courses */}
            <Card
              data-aos="fade-left"
              data-aos-delay="200"
              elevation={0}
              sx={{
                borderRadius: "16px",
                boxShadow: "0px 15px 35px rgba(0,0,0,0.06)",
                padding: 3,
                mt: 2 }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "18px",
                  mb: 3,
                  color: "#0f172a" }}
              >
                Related Courses
              </Typography>

              {cats.length === 0 ? (
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "#64748b" }}
                >
                  No related courses found
                </Typography>
              ) : (
                cats
                  .filter((cat) => cat.id !== course.category_id) // optional: exclude current category
                  .slice(0, 3) // show only 3
                  .map((cat) => (
                    <Box
                      key={cat.id}
                      onClick={() => handleCardClick(cat.id)}
                      sx={{
                        display: "flex",
                        gap: 2,
                        mb: 4,
                        cursor: "pointer",
                        alignItems: "flex-start",
                        transition: "0.2s",
                        "&:hover": { opacity: 0.8 } }}
                    >
                      {/* Thumbnail */}
                      <Box
                        component="img"
                        src={`${BASE_URL}/${cat.image}`}
                        alt={cat.category}
                        sx={{
                          width: 80,
                          height: 60,
                          borderRadius: "8px",
                          objectFit: "cover" }}
                      />

                      {/* Content */}
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: "14px",
                            color: "#0f172a" }}
                        >
                          {cat.category}
                        </Typography>
                      </Box>
                    </Box>
                  ))
              )}
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CourseOverviewSection;
