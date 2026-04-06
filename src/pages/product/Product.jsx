import { Box, Typography, Button, Avatar, Chip, Rating, Stack, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SchoolIcon from "@mui/icons-material/School";
import DownloadIcon from "@mui/icons-material/Download";
import StarIcon from "@mui/icons-material/Star";
import PeopleIcon from "@mui/icons-material/People";
import CircleIcon from "@mui/icons-material/Circle";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { GetRequest, PostRequest } from "../../api/config";
import { ADMIN_GET_COURSE_SLUG, ADMIN_POST_REGISTRATIONS } from "../../api/endpoints";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import QuickEnquiryModal from "../../components/QuickEnquiryModal";

const Product = () => {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const navigate = useNavigate();

  const [openDownloadDialog, setOpenDownloadDialog] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [openEnquiry, setOpenEnquiry] = useState(false);

  const handleDownloadSubmit = async (e) => {
    e.preventDefault();
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!email.trim() || !validateEmail(email)) return toast.error("Please enter a valid email");

    try {
      setSubmitting(true);
      await PostRequest(ADMIN_POST_REGISTRATIONS, {
        fullName: "Curriculum Downloader",
        email,
        phone: "0000000000",
        courseId: course?._id || course?.id,
        inquiryType: `Curriculum Download: ${course?.title || "Course"}`
      });

      toast.success("Curriculum PDF sent to your email successfully!");
      setOpenDownloadDialog(false);
      setEmail("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to process request. Please try again.");
    } finally {
      setSubmitting(false);
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
              icon={<StarIcon sx={{ color: '#fbbf24 !important', fontSize: '14px !important' }} />}
              sx={{
                background: 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)',
                color: '#fff',
                fontWeight: 600,
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
              fontSize: { xs: '28px', md: '38px', lg: '44px' },
              fontWeight: 600,
              mb: 3,
              lineHeight: 1.1,
              fontFamily: '"Poppins", sans-serif',
              textShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}
          >
            {course?.title || "Mastering The Course"}
          </Typography>

          <Typography
            sx={{
              fontSize: '15px',
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
                <Typography sx={{ fontWeight: 600, fontSize: '18px', lineHeight: 1 }}>
                  {course?.rating > 0 ? course.rating : "New"}
                </Typography>
                <Typography sx={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', mt: 0.5 }}>
                  {course?.total_ratings || 0} reviews
                </Typography>
              </Box>
            </Box>

            <Box sx={{ width: '1px', height: '40px', bgcolor: 'rgba(255,255,255,0.2)' }} />

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ bgcolor: 'rgba(56, 189, 248, 0.2)', p: 0.8, borderRadius: '10px', display: 'flex' }}>
                <PeopleIcon sx={{ color: "#38bdf8", fontSize: 22 }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: '16px', lineHeight: 1 }}>{course?.enquiryCount || 0}+</Typography>
                <Typography sx={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', mt: 0.5 }}>Total Enquiries</Typography>
              </Box>
            </Box>

            <Box sx={{ width: '1px', height: '40px', bgcolor: 'rgba(255,255,255,0.2)' }} />

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ bgcolor: 'rgba(167, 139, 250, 0.2)', p: 0.8, borderRadius: '10px', display: 'flex' }}>
                <PlayArrowIcon sx={{ color: "#a78bfa", fontSize: 22 }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: '16px', lineHeight: 1 }}>{course?.mode || "Online"}</Typography>
                <Typography sx={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', mt: 0.5 }}>Learning Mode</Typography>
              </Box>
            </Box>
          </Box>
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
          </Box>

          {course?.price && (
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 1.5 }}>
                <Typography
                  sx={{
                    fontSize: "42px",
                    fontWeight: 600,
                    color: "#0f172a",
                    fontFamily: '"Poppins", sans-serif',
                    lineHeight: 1
                  }}
                >
                  ₹{course?.price?.toLocaleString("en-IN")}
                </Typography>
                {course?.original_price && (
                  <Typography
                    sx={{
                      fontSize: "20px",
                      textDecoration: "line-through",
                      color: "#94a3b8",
                      fontWeight: 500
                    }}
                  >
                    ₹{course?.original_price?.toLocaleString("en-IN")}
                  </Typography>
                )}
              </Box>

              {course?.discount_percentage && (
                <Chip
                  label={`${course?.discount_percentage}% OFF - LIMITED TIME`}
                  icon={<CircleIcon sx={{ fontSize: '8px !important', color: '#fff', ml: 1 }} />}
                  sx={{
                    bgcolor: "#ef4444",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: '12px',
                    borderRadius: '8px',
                    height: '32px',
                    mt: 2,
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                  }}
                />
              )}
            </Box>
          )}

          <Stack spacing={2.5}>
            <Button
              onClick={() => setOpenEnquiry(true)}
              fullWidth
              variant="contained"
              sx={{
                background: "linear-gradient(90deg, #10b981 0%, #059669 100%)",
                color: "#fff",
                py: 2.2,
                borderRadius: "16px",
                fontWeight: 600,
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
              onClick={() => setOpenDownloadDialog(true)}
              sx={{
                borderColor: "#cbd5e1",
                color: "#475569",
                py: 2,
                borderRadius: "16px",
                fontWeight: 600,
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

      {/* CURRICULUM DOWNLOAD DIALOG */}
      <Dialog
        open={openDownloadDialog}
        onClose={() => setOpenDownloadDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '24px' } }}
      >
        <DialogTitle sx={{ bgcolor: '#0f172a', color: '#fff', position: "relative", p: 4 }}>
          <Typography
            variant="h5"
            fontWeight={600}
            sx={{
              fontFamily: '"Poppins", sans-serif',
              color: "#ffffff", // white color
            }}
          >
            Download Curriculum
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
            Enter your email to receive the download link.
          </Typography>
          <IconButton onClick={() => setOpenDownloadDialog(false)} sx={{ position: "absolute", right: 16, top: 20, color: "#fff", bgcolor: 'rgba(255,255,255,0.1)', "&:hover": { bgcolor: 'rgba(255,255,255,0.2)' } }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleDownloadSubmit}>
          <DialogContent sx={{ p: 4, pt: 5 }}>
            <TextField label="Your Email Address *" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth sx={{ "& .MuiOutlinedInput-root": { borderRadius: '12px' } }} />
          </DialogContent>
          <DialogActions sx={{ p: 4, pt: 0, justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={() => setOpenDownloadDialog(false)} sx={{ color: '#64748b', fontWeight: 600 }}>Cancel</Button>
            <Button type="submit" disabled={submitting} variant="contained" sx={{ bgcolor: '#10b981', px: 4, py: 1.5, borderRadius: '12px', fontWeight: 600, boxShadow: '0 4px 12px rgba(16,185,129,0.3)', "&:hover": { bgcolor: '#059669' } }}>
              {submitting ? "Processing..." : "Download Now"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

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

      <QuickEnquiryModal 
        open={openEnquiry} 
        onClose={() => setOpenEnquiry(false)}
        initialCourse={course?.title}
      />
    </Box>
  );
};

export default Product;
