import React, { useEffect, useState } from "react";
import { Box, Typography, Container, Grid, alpha } from "@mui/material";
import { useParams } from "react-router-dom";
import { GetRequest } from "../../api/api";
import { ADMIN_GET_COURSE_SLUG } from "../../api/endpoints";

// Standard CDNs/Icons for backwards compatibility or fallback
const toolsList = [
  { name: "Javascript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "HTML", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  { name: "CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
  { name: "Tailwind CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
  { name: "React Js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Redux", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg" },
  { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  { name: "Node Js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "Express js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
  { name: "Postman", icon: "https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg" },
  { name: "AWS", icon: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
];

export default function CourseTools() {
  const { slug } = useParams();
  const [skills, setSkills] = useState([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await GetRequest(ADMIN_GET_COURSE_SLUG(slug));
        if (res?.success) {
          setSkills(res.data?.skills || []);
          setCourseTitle(res.data?.title || "");
        }
      } catch (err) {
        console.error("Failed to fetch skills:", err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchCourse();
  }, [slug]);

  const displayTools = skills.length > 0 ? skills : toolsList;
  return (
    <Box sx={{ py: 8, bgcolor: "#fff", textAlign: "center" }}>
      <Container maxWidth="lg">
        {/* Title */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: "#1e293b",
            fontSize: { xs: "1.75rem", md: "2.4rem" },
            mb: 1,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Build Real-World Skills with {courseTitle || "MERN"} Tools
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="subtitle1"
          sx={{
            color: "#64748b",
            maxWidth: "600px",
            mx: "auto",
            mb: 6,
            fontSize: "1.05rem",
          }}
        >
          Get hands-on experience with industry-standard tools to solidify your learning!
        </Typography>

        {/* Grid Items */}
        <Grid container spacing={5} justifyContent="center" sx={{ maxWidth: "1100px", mx: "auto" }}>
          {displayTools.map((tool, index) => (
            <Grid
              item
              key={index}
              size={{ xs: 6, sm: 4, md: 2 }}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
              }}
            >
              {/* Hexagon/Shield Container */}
              <Box
                sx={{
                  position: "relative",
                  width: "100px",
                  height: "112px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  // CSS Polygon Hexagon resembling the screenshot shields
                  clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                  bgcolor: "rgba(224, 231, 255, 0.4)", // Light cyan/blue translucent glow
                  border: "2px solid rgba(99, 102, 241, 0.1)", // soft blue border
                  "&:hover": {
                    transform: "translateY(-5px)",
                    bgcolor: "#10b981", // Emerald Green
                  },
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
              >
                {/* Inner smaller shield layout bounds safe sizing */}
                <Box
                  sx={{
                    width: "84px",
                    height: "94px",
                    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    bgcolor: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)",
                  }}
                >
                  <img
                    src={tool.icon}
                    alt={tool.name}
                    style={{
                      width: "42px",
                      height: "42px",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              </Box>

              {/* Tool Name */}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: "#0f172a",
                  fontSize: "0.95rem",
                  mt: 0.5,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {tool.name}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
