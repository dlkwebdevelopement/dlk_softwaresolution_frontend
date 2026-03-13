import { Box, Typography, Button, Avatar, Chip, Rating ,Stack} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import DownloadIcon from "@mui/icons-material/Download";
import StarIcon from "@mui/icons-material/Star";
import PeopleIcon from "@mui/icons-material/People";
import CircleIcon from "@mui/icons-material/Circle";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
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
        background: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #059669 100%)", // Rich dark green gradient
        color: "#fff",
        py: { xs: 8, md: 14 },
        px: { xs: 3, md: 8 },
        mt: { xs: -2.4, md: -2 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Premium Decorative Grid & Glows */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Animated Glow Orbs */}
      <Box
        sx={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(52, 211, 153, 0.2) 0%, transparent 60%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'pulseGlow 8s infinite alternate',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-20%',
          left: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 60%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'pulseGlow 10s infinite alternate-reverse',
          pointerEvents: 'none',
        }}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: { xs: 6, lg: 10 },
          maxWidth: "1280px",
          margin: "auto",
          alignItems: "center",
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* LEFT SIDE: Hero Content */}
        <Box 
          sx={{ 
            flex: 1,
            animation: 'fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards'
          }}
        >
          <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
            <Chip 
              label="Bestseller" 
              icon={<StarIcon sx={{ color: '#fbbf24 !important', fontSize: '14px !important' }}/>}
              sx={{ 
                background: 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)', 
                color: '#fff', 
                fontWeight: 800,
                fontSize: '13px',
                border: 'none',
                px: 1,
                boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)'
              }} 
            />
            <Chip 
              label="New Updated Curriculum" 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.15)', 
                color: '#fff', 
                backdropFilter: 'blur(10px)',
                fontWeight: 600,
                fontSize: '13px',
                border: '1px solid rgba(255,255,255,0.3)',
              }} 
            />
          </Box>
          <Typography
            sx={{
              fontSize: { xs: "40px", md: "56px", lg: "64px" },
              fontWeight: 800,
              mb: 3,
              lineHeight: 1.1,
              fontFamily: '"Bricolage Grotesque", sans-serif',
              textShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}
          >
            {course?.title || "Mastering The Course"}
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "18px", md: "20px" },
              color: 'rgba(255,255,255,0.9)',
              lineHeight: 1.6,
              mb: 5,
              maxWidth: "680px",
              fontWeight: 400,
            }}
          >
            {course?.full_description || "Comprehensive training program designed to take you from beginner to industry-ready professional with hands-on projects."}
          </Typography>

          {/* Premium Stats Row */}
          <Box sx={{ 
            display: "flex", 
            flexWrap: 'wrap', 
            alignItems: "center", 
            gap: { xs: 2, md: 4 }, 
            mb: 5,
            p: 2,
            bgcolor: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            width: 'fit-content'
          }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ bgcolor: 'rgba(250, 204, 21, 0.2)', p: 0.8, borderRadius: '10px', display: 'flex' }}>
                <StarIcon sx={{ color: "#facc15", fontSize: 22 }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: '16px', lineHeight: 1 }}>{course?.rating || 4.8}</Typography>
                <Typography sx={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', mt: 0.5 }}>{course?.total_ratings || 0} reviews</Typography>
              </Box>
            </Box>

            <Box sx={{ width: '1px', height: '40px', bgcolor: 'rgba(255,255,255,0.2)' }} />

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ bgcolor: 'rgba(56, 189, 248, 0.2)', p: 0.8, borderRadius: '10px', display: 'flex' }}>
                <PeopleIcon sx={{ color: "#38bdf8", fontSize: 22 }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: '16px', lineHeight: 1 }}>{course?.total_students || 0}+</Typography>
                <Typography sx={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', mt: 0.5 }}>Active Students</Typography>
              </Box>
            </Box>

            <Box sx={{ width: '1px', height: '40px', bgcolor: 'rgba(255,255,255,0.2)' }} />

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ bgcolor: 'rgba(167, 139, 250, 0.2)', p: 0.8, borderRadius: '10px', display: 'flex' }}>
                <PlayArrowIcon sx={{ color: "#a78bfa", fontSize: 22 }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: '16px', lineHeight: 1 }}>{course?.mode || "Online"}</Typography>
                <Typography sx={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', mt: 0.5 }}>Learning Mode</Typography>
              </Box>
            </Box>
          </Box>

          <Button
            onClick={() => navigate("/contact")}
            variant="contained"
            size="large"
            endIcon={<SchoolIcon />}
            sx={{
              bgcolor: "#fff",
              color: "#064e3b",
              px: 6,
              py: 2,
              borderRadius: "16px",
              fontWeight: 800,
              fontSize: '18px',
              textTransform: 'none',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              "&:hover": {
                bgcolor: "#f8fafc",
                transform: 'translateY(-4px)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            Enroll in Course Now
          </Button>
          
          <Typography sx={{ mt: 3, fontSize: '14px', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleIcon sx={{ fontSize: 16, color: '#34d399' }} /> 30-Day Money-Back Guarantee
          </Typography>
        </Box>

        {/* RIGHT SIDE: Floating Glass Card */}
        <Box
          sx={{
            width: { xs: "100%", md: "460px" },
            bgcolor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            color: "#0f172a",
            borderRadius: "28px",
            overflow: "hidden",
            p: { xs: 3, md: 5 },
            boxShadow: "0 30px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,1)",
            animation: 'float 6s ease-in-out infinite, fadeInUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
            border: '1px solid rgba(255,255,255,0.8)',
            transformStyle: 'preserve-3d',
            position: 'relative',
          }}
        >
          {/* Card Image */}
          <Box
            sx={{
              width: "100%",
              height: 260,
              position: "relative",
              overflow: "hidden",
              borderRadius: "20px",
              bgcolor: "#f1f5f9",
              mb: 4,
              border: '1px solid rgba(0,0,0,0.05)',
              boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.05)',
            }}
          >
            <Box
              component="img"
              src={course?.thumbnail_url || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80"}
              alt={course?.title}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  transform: "scale(1.08)",
                },
              }}
            />
            {/* Play Button Overlay */}
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 60,
              height: 60,
              bgcolor: 'rgba(255,255,255,0.9)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              transition: 'all 0.3s',
              "&:hover": { transform: 'translate(-50%, -50%) scale(1.1)'}
            }}>
               <PlayArrowIcon sx={{ color: 'var(--green-dark)', fontSize: 32, ml: 0.5 }} />
            </Box>
          </Box>

          {/* Price Section */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 1.5 }}>
              <Typography
                sx={{
                  fontSize: "42px",
                  fontWeight: 800,
                  color: "#0f172a",
                  fontFamily: '"Bricolage Grotesque", sans-serif',
                  lineHeight: 1
                }}
              >
                ₹{course?.price?.toLocaleString("en-IN") || "29,999"}
              </Typography>
              <Typography
                sx={{
                  fontSize: "20px",
                  textDecoration: "line-through",
                  color: "#94a3b8",
                  fontWeight: 500
                }}
              >
                ₹{course?.original_price?.toLocaleString("en-IN") || "45,000"}
              </Typography>
            </Box>
            
            <Chip
              label={`${course?.discount_percentage || "30"}% OFF - LIMITED TIME`}
              icon={<CircleIcon sx={{ fontSize: '8px !important', color: '#fff', ml: 1 }} />}
              sx={{
                bgcolor: "#ef4444",
                color: "#fff",
                fontWeight: 800,
                fontSize: '12px',
                borderRadius: '8px',
                height: '32px',
                mt: 2,
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
              }}
            />
          </Box>

          <Stack spacing={2.5}>
            <Button
              onClick={() => navigate("/contact")}
              fullWidth
              variant="contained"
              sx={{
                background: "linear-gradient(90deg, #10b981 0%, #059669 100%)",
                color: "#fff",
                py: 2.2,
                borderRadius: "16px",
                fontWeight: 800,
                fontSize: '16px',
                boxShadow: '0 10px 20px rgba(16, 185, 129, 0.3)',
                "&:hover": { 
                  background: "linear-gradient(90deg, #059669 0%, #047857 100%)",
                  transform: 'translateY(-2px)',
                  boxShadow: '0 15px 30px rgba(16, 185, 129, 0.4)'
                },
                transition: 'all 0.3s ease',
              }}
            >
              Enroll & Start Learning
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
                borderColor: "#cbd5e1",
                color: "#475569",
                py: 2,
                borderRadius: "16px",
                fontWeight: 700,
                borderWidth: '2px',
                bgcolor: '#f8fafc',
                "&:hover": { 
                  bgcolor: "#f1f5f9",
                  borderColor: "#94a3b8",
                  borderWidth: '2px',
                  color: '#0f172a'
                },
              }}
            >
              <DownloadIcon sx={{ mr: 1.5 }} />
              Download Curriculum PDF
            </Button>
          </Stack>
        </Box>
      </Box>

      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulseGlow {
            form { opacity: 0.4; transform: scale(1); }
            to { opacity: 0.8; transform: scale(1.1); }
          }
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0px); }
          }
        `}
      </style>
    </Box>
  );
};

export default Product;
