import { Box, Typography, Button, Avatar, Chip, Rating } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import DownloadIcon from "@mui/icons-material/Download";
import StarIcon from "@mui/icons-material/Star";
import PeopleIcon from "@mui/icons-material/People";
import CircleIcon from "@mui/icons-material/Circle";
import { GetRequest } from "../../api/config";
import { ADMIN_GET_COURSE_SLUG } from "../../api/endpoints";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Product = () => {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const navigate = useNavigate();

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

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #3a6b49 0%, #b8fd72 100%)",
        color: "#fff",
        py: { xs: 6, md: 10 },
        px: { xs: 3, md: 8 },
        mt: { xs: -2.4, md: -2 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 6,
          maxWidth: "1200px",
          margin: "auto",
          alignItems: "center",
        }}
      >
        {/* LEFT SIDE */}
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              fontSize: { xs: "32px", md: "42px" },
              fontWeight: 700,
              mb: 3,
            }}
          >
            {course?.title}
          </Typography>

          <Typography
            sx={{
              fontSize: "16px",
              opacity: 0.9,
              lineHeight: 1.7,
              mb: 3,
            }}
          >
            {course?.full_description}
          </Typography>

          {/* Rating Row */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <StarIcon sx={{ color: "#facc15" }} />
              <Typography>{`${course?.rating} (${course?.total_ratings} ratings)`}</Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PeopleIcon sx={{ color: "#22d3ee" }} />
              <Typography>{`${course?.total_students} students`}</Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircleIcon sx={{ color: "#22c55e", fontSize: 12 }} />
              <Typography>{course?.mode} Mode</Typography>
            </Box>
          </Box>

          <Button
            onClick={() => navigate("/contact")}
            variant="outlined"
            sx={{
              borderColor: "#fff",
              color: "#fff",
              px: 4,
              py: 1.2,
              borderRadius: "10px",
              "&:hover": {
                backgroundColor: "#fff",
                color: "#48723e",
              },
            }}
          >
            Join Now →
          </Button>
        </Box>

        {/* Divider */}
        <Box
          sx={{
            width: "1px",
            height: { xs: 0, md: "400px" },
            bgcolor: "rgba(255,255,255,0.3)",
            display: { xs: "none", md: "block" },
          }}
        />

        {/* RIGHT CARD */}
        <Box
          sx={{
            width: { xs: "100%", md: "380px" },
            bgcolor: "#fff",
            color: "#0f172a",
            borderRadius: "18px",
            overflow: "hidden",
            p: 3,
            boxShadow: "0px 15px 40px rgba(0,0,0,0.2)",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: 220,
              position: "relative",
              overflow: "hidden",
              borderRadius: "12px",
              bgcolor: "#f5f5f5",
            }}
          >
            <Box
              component="img"
              src={course?.thumbnail_url}
              alt={course?.title}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                transition: "transform 0.4s ease",
                "&:hover": {
                  transform: "translate(-50%, -50%) scale(1.05)",
                },
              }}
            />
          </Box>
          {/* Price */}
          <Typography
            sx={{
              fontSize: "30px",
              fontWeight: 700,
              color: "#ef4444",
            }}
          >
            ₹{course?.price?.toLocaleString("en-IN")}
            <Typography
              component="span"
              sx={{
                fontSize: "14px",
                textDecoration: "line-through",
                color: "#64748b",
                ml: 1,
              }}
            >
              ₹{course?.original_price?.toLocaleString("en-IN")}
            </Typography>
          </Typography>

          <Chip
            label={`${course?.discount_percentage}% off - Limited time!`}
            sx={{
              bgcolor: "#ef4444",
              color: "#fff",
              mt: 2,
              mb: 3,
            }}
          />

          <Button
            onClick={() => navigate("/contact")}
            fullWidth
            sx={{
              bgcolor: "#7c3aed",
              color: "#fff",
              py: 1.3,
              borderRadius: "12px",
              mb: 2,
              "&:hover": { bgcolor: "#6d28d9" },
            }}
          >
            <SchoolIcon sx={{ mr: 1 }} />
            Enroll Now
          </Button>

          <Button
            fullWidth
            onClick={() => {
              fetch(course?.syllabus_pdf_url)
                .then((res) => res.blob())
                .then((blob) => {
                  const url = window.URL.createObjectURL(new Blob([blob]));
                  const link = document.createElement("a");
                  link.href = url;
                  link.setAttribute(
                    "download",
                    course?.syllabus_pdf?.split("/").pop() || "syllabus.pdf",
                  );
                  document.body.appendChild(link);
                  link.click();
                  link.parentNode.removeChild(link);
                  window.URL.revokeObjectURL(url);
                });
            }}
            sx={{
              bgcolor: "#f43f5e",
              color: "#fff",
              py: 1.3,
              borderRadius: "12px",
              "&:hover": { bgcolor: "#e11d48" },
            }}
          >
            <DownloadIcon sx={{ mr: 1 }} />
            Download Syllabus
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Product;
