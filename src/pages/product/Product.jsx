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
        background: "linear-gradient(135deg, var(--green-deep) 0%, var(--green-dark) 40%, var(--green) 100%)",
        color: "#fff",
        py: { xs: 8, md: 12 },
        px: { xs: 3, md: 8 },
        mt: { xs: -2.4, md: -2 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Circles */}
      <Box
        sx={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 8,
          maxWidth: "1200px",
          margin: "auto",
          alignItems: "center",
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* LEFT SIDE */}
        <Box 
          sx={{ 
            flex: 1,
            animation: 'fadeInLeft 0.8s ease-out'
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Chip 
              label="Bestseller" 
              sx={{ 
                bgcolor: 'var(--yellow)', 
                color: 'var(--dark)', 
                fontWeight: 700,
                fontSize: '12px',
                mb: 2
              }} 
            />
          </Box>
          <Typography
            sx={{
              fontSize: { xs: "36px", md: "52px" },
              fontWeight: 800,
              mb: 3,
              lineHeight: 1.1,
              fontFamily: '"Bricolage Grotesque", sans-serif',
            }}
          >
            {course?.title}
          </Typography>

          <Typography
            sx={{
              fontSize: "18px",
              opacity: 0.9,
              lineHeight: 1.6,
              mb: 4,
              maxWidth: "600px",
              fontWeight: 500,
            }}
          >
            {course?.full_description}
          </Typography>

          {/* Rating Row */}
          <Box sx={{ display: "flex", flexWrap: 'wrap', alignItems: "center", gap: 4, mb: 5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 0.5, borderRadius: '8px', display: 'flex' }}>
                <StarIcon sx={{ color: "#facc15", fontSize: 20 }} />
              </Box>
              <Typography sx={{ fontWeight: 600 }}>{`${course?.rating} (${course?.total_ratings} reviews)`}</Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 0.5, borderRadius: '8px', display: 'flex' }}>
                <PeopleIcon sx={{ color: "#fff", fontSize: 20 }} />
              </Box>
              <Typography sx={{ fontWeight: 600 }}>{`${course?.total_students} students`}</Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 0.5, borderRadius: '8px', display: 'flex' }}>
                <CircleIcon sx={{ color: "#fff", fontSize: 10 }} />
              </Box>
              <Typography sx={{ fontWeight: 600 }}>{course?.mode} Mode</Typography>
            </Box>
          </Box>

          <Button
            onClick={() => navigate("/contact")}
            variant="contained"
            sx={{
              bgcolor: "#fff",
              color: "var(--green-dark)",
              px: 5,
              py: 1.8,
              borderRadius: "14px",
              fontWeight: 800,
              fontSize: '16px',
              boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
              "&:hover": {
                backgroundColor: "var(--green-pale)",
                transform: 'translateY(-3px)',
                boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            Start Learning Now →
          </Button>
        </Box>

        {/* RIGHT CARD */}
        <Box
          sx={{
            width: { xs: "100%", md: "420px" },
            bgcolor: "#fff",
            color: "#0f172a",
            borderRadius: "24px",
            overflow: "hidden",
            p: 4,
            boxShadow: "0px 30px 60px rgba(0,0,0,0.3)",
            animation: 'fadeInRight 0.8s ease-out',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: 240,
              position: "relative",
              overflow: "hidden",
              borderRadius: "16px",
              bgcolor: "#f8fafc",
              mb: 3,
              border: '1px solid #e2e8f0',
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
                width: "90%",
                height: "90%",
                objectFit: "contain",
                transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  transform: "translate(-50%, -50%) scale(1.1)",
                },
              }}
            />
          </Box>

          {/* Price Section */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
              <Typography
                sx={{
                  fontSize: "36px",
                  fontWeight: 800,
                  color: "#e11d48",
                  fontFamily: '"Bricolage Grotesque", sans-serif',
                }}
              >
                ₹{course?.price?.toLocaleString("en-IN")}
              </Typography>
              <Typography
                sx={{
                  fontSize: "18px",
                  textDecoration: "line-through",
                  color: "#64748b",
                  fontWeight: 500
                }}
              >
                ₹{course?.original_price?.toLocaleString("en-IN")}
              </Typography>
            </Box>
            
            <Chip
              label={`${course?.discount_percentage}% OFF - LIMITED OFFER`}
              sx={{
                bgcolor: "#fff1f2",
                color: "#e11d48",
                fontWeight: 800,
                fontSize: '11px',
                borderRadius: '8px',
                height: '28px',
                mt: 1,
                border: '1px solid #fecdd3'
              }}
            />
          </Box>

          <Stack spacing={2}>
            <Button
              onClick={() => navigate("/contact")}
              fullWidth
              variant="contained"
              sx={{
                bgcolor: "var(--green)",
                color: "#fff",
                py: 2,
                borderRadius: "16px",
                fontWeight: 700,
                fontSize: '16px',
                "&:hover": { 
                  bgcolor: "var(--green-dark)",
                  transform: 'scale(1.02)'
                },
                transition: 'all 0.3s ease',
              }}
            >
              <SchoolIcon sx={{ mr: 1.5 }} />
              Enroll in Course
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                const pdfUrl = course?.syllabus_pdf_url;
                if (!pdfUrl) return;
                const link = document.createElement("a");
                link.href = pdfUrl;
                link.setAttribute("download", course?.title?.replace(/\s+/g, '_') + "_Syllabus.pdf");
                document.body.appendChild(link);
                link.click();
                link.remove();
              }}
              sx={{
                borderColor: "var(--green-mid)",
                color: "var(--green-dark)",
                py: 1.8,
                borderRadius: "16px",
                fontWeight: 700,
                borderWidth: '2px',
                "&:hover": { 
                  bgcolor: "var(--green-pale)",
                  borderColor: "var(--green)",
                  borderWidth: '2px',
                },
              }}
            >
              <DownloadIcon sx={{ mr: 1.5 }} />
              Download Curriculum
            </Button>
          </Stack>
          
          <Typography 
            sx={{ 
              textAlign: 'center', 
              mt: 3, 
              fontSize: '13px', 
              color: '#64748b',
              fontWeight: 500
            }}
          >
            Secure Checkout • 30-Day Money Back Guarantee
          </Typography>
        </Box>
      </Box>

      <style>
        {`
          @keyframes fadeInLeft {
            from { opacity: 0; transform: translateX(-30px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes fadeInRight {
            from { opacity: 0; transform: translateX(30px); }
            to { opacity: 1; transform: translateX(0); }
          }
        `}
      </style>
    </Box>
  );
};

  );
};

export default Product;
