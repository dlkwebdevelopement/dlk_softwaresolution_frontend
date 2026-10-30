import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Stack,
  TextField,
  Dialog,
  DialogContent,
  IconButton,
  MenuItem,
  CircularProgress,
  alpha,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import SchoolIcon from "@mui/icons-material/School";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VerifiedIcon from "@mui/icons-material/Verified";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import EmailIcon from "@mui/icons-material/Email";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import SendIcon from "@mui/icons-material/Send";
import toast from "react-hot-toast";

import { GetRequest, PostRequest, getImgUrl } from "../../api/api";
import {
  GET_ALL_INTERNSHIPS,
  POST_INTERNSHIP_SYLLABUS_REQUEST,
} from "../../api/endpoints";

const DOMAIN_TABS = [
  "All",
  "Web Development",
  "AI & Machine Learning",
  "Data Analytics",
  "Cloud & DevOps",
  "Cyber Security",
];

const YEAR_OPTIONS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "Final Year",
  "Passed Out / Graduate",
];

const MODE_OPTIONS = [
  "Online Live Interactive",
  "Classroom Offline (Vadapalani, Chennai)",
  "Hybrid (Online + Offline)",
];

export default function InternshipPage() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [openModal, setOpenModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    college: "",
    degree: "",
    year: "Final Year",
    mode: "Online Live Interactive",
  });

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const res = await GetRequest(GET_ALL_INTERNSHIPS);
      if (res && res.data) {
        setInternships(res.data);
      } else if (Array.isArray(res)) {
        setInternships(res);
      }
    } catch (err) {
      console.error("Failed to fetch internships:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const handleOpenSyllabusModal = (course) => {
    setSelectedCourse(course);
    setEmailSuccess(false);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCourse(null);
    setEmailSuccess(false);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanEmail = formData.email.trim();
    const cleanMobile = formData.mobile.replace(/\D/g, "");
    const cleanName = formData.name.trim();

    // Mandatory validations
    if (!cleanName) {
      toast.error("Please enter your full name.");
      return;
    }

    if (!cleanEmail) {
      toast.error("Email address is mandatory to receive the syllabus.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!cleanMobile || cleanMobile.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number (mandatory).");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: cleanName,
        email: cleanEmail,
        mobile: cleanMobile,
        college: formData.college.trim(),
        degree: formData.degree.trim(),
        year: formData.year,
        mode: formData.mode,
        internshipId: selectedCourse?._id || selectedCourse?.id,
        internshipTitle: selectedCourse?.title,
      };

      const res = await PostRequest(POST_INTERNSHIP_SYLLABUS_REQUEST, payload);

      if (res?.success) {
        setEmailSuccess(true);
        toast.success("Email sent successfully!");
      } else {
        toast.error("Email not sent");
      }
    } catch (err) {
      console.error("Syllabus Request error:", err);
      toast.error("Email not sent");
    } finally {
      setSubmitting(false);
    }
  };

  // Filter courses
  const filteredCourses = internships.filter((item) => {
    const matchesTab =
      activeTab === "All" ||
      item.category?.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch =
      !searchQuery.trim() ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(item.skills) &&
        item.skills.some((s) =>
          s.toLowerCase().includes(searchQuery.toLowerCase())
        ));
    return matchesTab && matchesSearch;
  });

  return (
    <Box sx={{ bgcolor: "#fafdfa", minHeight: "100vh", pb: 10 }}>
      {/* HERO BANNER SECTION */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #047857 100%)",
          color: "#fff",
          pt: { xs: 6, md: 8 },
          pb: { xs: 8, md: 10 },
          px: 3,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          {/* Badge */}
          <Chip
            icon={<SchoolIcon sx={{ color: "#34d399 !important", fontSize: 16 }} />}
            label="DLK SOFTWARE SOLUTIONS • INTERNSHIP 2026"
            sx={{
              bgcolor: "rgba(52, 211, 153, 0.15)",
              color: "#34d399",
              fontWeight: 700,
              fontSize: "0.78rem",
              letterSpacing: "0.5px",
              py: 1.8,
              px: 1.2,
              borderRadius: "50px",
              border: "1px solid rgba(52, 211, 153, 0.3)",
              mb: 2,
            }}
          />

          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" },
              lineHeight: 1.2,
              letterSpacing: "-0.5px",
              maxWidth: "850px",
              mx: "auto",
              mb: 1.5,
            }}
          >
            Industry Internship Programs
          </Typography>

          <Typography
            sx={{
              color: "rgba(255, 255, 255, 0.85)",
              fontSize: { xs: "0.9rem", md: "1.05rem" },
              maxWidth: "680px",
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            Hands-on client projects, ISO verified certificate & corporate placement assistance.
          </Typography>
        </Container>
      </Box>

      {/* FILTER & SEARCH BAR */}
      <Container maxWidth="lg" sx={{ mt: { xs: -3.5, md: -4 }, position: "relative", zIndex: 2 }}>
        <Box
          sx={{
            bgcolor: "#fff",
            borderRadius: "18px",
            p: { xs: 1.5, md: 2 },
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
            border: "1px solid rgba(61, 184, 67, 0.15)",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          {/* Domain Filter Tabs */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.8,
              overflowX: "auto",
              width: { xs: "100%", md: "auto" },
              pb: { xs: 0.5, md: 0 },
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {DOMAIN_TABS.map((tab) => (
              <Button
                key={tab}
                onClick={() => setActiveTab(tab)}
                size="small"
                sx={{
                  borderRadius: "20px",
                  px: 2,
                  py: 0.6,
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  textTransform: "none",
                  transition: "all 0.25s ease",
                  bgcolor: activeTab === tab ? "#3DB843" : "rgba(61, 184, 67, 0.06)",
                  color: activeTab === tab ? "#fff" : "#1a2b1b",
                  "&:hover": {
                    bgcolor: activeTab === tab ? "#2e9133" : "rgba(61, 184, 67, 0.12)",
                  },
                }}
              >
                {tab}
              </Button>
            ))}
          </Box>

          {/* Search Box */}
          <TextField
            placeholder="Search domain, stack, or course title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{
              width: { xs: "100%", md: "280px" },
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                bgcolor: "#f8fcf8",
                height: "38px",
                fontSize: "0.85rem",
                "& fieldset": { borderColor: "rgba(61, 184, 67, 0.2)" },
                "&:hover fieldset": { borderColor: "#3DB843" },
                "&.Mui-focused fieldset": { borderColor: "#3DB843" },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#3DB843", fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Container>

      {/* COURSES CATALOG - COMPACT RESPONSIVE GRID */}
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#111c12", fontSize: { xs: "1.25rem", md: "1.5rem" } }}>
              Internship Programs
            </Typography>
            <Typography sx={{ color: "#6b8f6d", fontSize: "0.85rem", mt: 0.3 }}>
              Click "Get Syllabus" to receive the official curriculum on your email
            </Typography>
          </div>
          <Typography sx={{ color: "#3DB843", fontWeight: 700, fontSize: "0.85rem" }}>
            {filteredCourses.length} Courses
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <CircularProgress sx={{ color: "#3DB843" }} size={40} />
            <Typography sx={{ color: "#6b8f6d", mt: 1.5, fontSize: "0.85rem" }}>
              Loading internship programs...
            </Typography>
          </Box>
        ) : filteredCourses.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              bgcolor: "#fff",
              borderRadius: "20px",
              border: "1px dashed rgba(61, 184, 67, 0.3)",
              p: 4,
            }}
          >
            <MenuBookIcon sx={{ fontSize: 42, color: "#a7f3d0", mb: 1.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#111c12", fontSize: "1rem" }}>
              No internship courses match your search
            </Typography>
            <Button
              onClick={() => {
                setActiveTab("All");
                setSearchQuery("");
              }}
              variant="outlined"
              size="small"
              sx={{
                mt: 2,
                borderRadius: "20px",
                borderColor: "#3DB843",
                color: "#3DB843",
                textTransform: "none",
                fontSize: "0.8rem",
              }}
            >
              Reset Filters
            </Button>
          </Box>
        ) : (
          /* RESPONSIVE CSS GRID: 3 COLUMNS ON DESKTOP, 2 ON TABLET, 1 ON MOBILE */
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 2.5,
            }}
          >
            {filteredCourses.map((course) => {
              const imgUrl =
                course.image_url ||
                course.image ||
                "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80";

              return (
                <Card
                  key={course._id || course.id}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "16px",
                    overflow: "hidden",
                    bgcolor: "#fff",
                    border: "1px solid rgba(61, 184, 67, 0.15)",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.03)",
                    transition: "all 0.25s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 28px rgba(61, 184, 67, 0.12)",
                      borderColor: "rgba(61, 184, 67, 0.4)",
                    },
                  }}
                >
                  {/* Compact Thumbnail Banner */}
                  <Box sx={{ position: "relative", height: 140, overflow: "hidden", bgcolor: "#0f172a" }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={getImgUrl(imgUrl)}
                      alt={course.title}
                      sx={{
                        objectFit: "cover",
                        transition: "transform 0.4s ease",
                        "&:hover": { transform: "scale(1.05)" },
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        bgcolor: "rgba(17, 28, 18, 0.88)",
                        backdropFilter: "blur(6px)",
                        color: "#34d399",
                        fontWeight: 700,
                        fontSize: "0.7rem",
                        px: 1.5,
                        py: 0.4,
                        borderRadius: "20px",
                        border: "1px solid rgba(52, 211, 153, 0.3)",
                      }}
                    >
                      {course.category}
                    </Box>
                  </Box>

                  {/* Compact Card Content */}
                  <CardContent sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column" }}>
                    {/* Meta: Duration & Mode */}
                    <Stack direction="row" spacing={1.5} sx={{ mb: 1, alignItems: "center" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.4, color: "#6b8f6d", fontSize: "0.74rem", fontWeight: 600 }}>
                        <AccessTimeIcon sx={{ fontSize: 14, color: "#3DB843" }} />
                        <span>{course.duration || "3 Months"}</span>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.4, color: "#6b8f6d", fontSize: "0.74rem", fontWeight: 600 }}>
                        <LaptopMacIcon sx={{ fontSize: 14, color: "#3DB843" }} />
                        <span style={{ maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {course.mode || "Online / Classroom"}
                        </span>
                      </Box>
                    </Stack>

                    {/* Course Title */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: "#111c12",
                        fontSize: "0.98rem",
                        lineHeight: 1.35,
                        mb: 1,
                        height: "40px",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {course.title}
                    </Typography>

                    {/* Description snippet */}
                    <Typography
                      sx={{
                        color: "#4a634c",
                        fontSize: "0.8rem",
                        lineHeight: 1.45,
                        mb: 1.5,
                        height: "36px",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {course.description || "Hands-on internship curriculum with industry projects and mentorship."}
                    </Typography>

                    {/* Compact Skills Badges */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, height: "26px", overflow: "hidden" }}>
                        {Array.isArray(course.skills) && course.skills.length > 0 ? (
                          course.skills.slice(0, 3).map((skill, sIdx) => (
                            <Chip
                              key={sIdx}
                              label={skill}
                              size="small"
                              sx={{
                                bgcolor: "rgba(61, 184, 67, 0.08)",
                                color: "#1f6b24",
                                fontWeight: 600,
                                fontSize: "0.68rem",
                                height: "22px",
                                borderRadius: "6px",
                              }}
                            />
                          ))
                        ) : (
                          <Chip
                            label="Industry Standard"
                            size="small"
                            sx={{
                              bgcolor: "rgba(61, 184, 67, 0.08)",
                              color: "#1f6b24",
                              fontWeight: 600,
                              fontSize: "0.68rem",
                              height: "22px",
                            }}
                          />
                        )}
                        {course.skills?.length > 3 && (
                          <Chip
                            label={`+${course.skills.length - 3}`}
                            size="small"
                            sx={{
                              bgcolor: "#f1f5f9",
                              color: "#64748b",
                              fontWeight: 600,
                              fontSize: "0.68rem",
                              height: "22px",
                              borderRadius: "6px",
                            }}
                          />
                        )}
                      </Box>
                    </Box>

                    {/* Spacer */}
                    <Box sx={{ flexGrow: 1 }} />

                    {/* "Get Syllabus" Button */}
                    <Button
                      onClick={() => handleOpenSyllabusModal(course)}
                      fullWidth
                      variant="contained"
                      size="small"
                      startIcon={<EmailIcon sx={{ fontSize: "16px !important" }} />}
                      sx={{
                        bgcolor: "#3DB843",
                        color: "#fff",
                        py: 0.9,
                        borderRadius: "10px",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        textTransform: "none",
                        boxShadow: "0 4px 12px rgba(61, 184, 67, 0.22)",
                        "&:hover": {
                          bgcolor: "#2e9133",
                          boxShadow: "0 6px 16px rgba(61, 184, 67, 0.3)",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      Get Syllabus
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        )}
      </Container>

      {/* STUDENT DETAILS & SYLLABUS EMAIL MODAL */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            p: 0.5,
            overflow: "hidden",
            boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
          },
        }}
      >
        <DialogContent sx={{ p: { xs: 2.5, sm: 3.5 }, position: "relative" }}>
          {/* Close Icon */}
          <IconButton
            onClick={handleCloseModal}
            size="small"
            sx={{
              position: "absolute",
              top: 14,
              right: 14,
              color: "#6b8f6d",
              "&:hover": { bgcolor: "rgba(61, 184, 67, 0.1)", color: "#111c12" },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          {!emailSuccess ? (
            /* STEP 1: STUDENT DETAILS FORM */
            <Box component="form" onSubmit={handleSubmit}>
              {/* Modal Header */}
              <Box sx={{ mb: 2.5 }}>
                <Chip
                  label="Free Syllabus PDF via Email"
                  size="small"
                  sx={{
                    bgcolor: "rgba(61, 184, 67, 0.12)",
                    color: "#2e9133",
                    fontWeight: 700,
                    fontSize: "0.72rem",
                    borderRadius: "6px",
                    mb: 1,
                    height: "22px",
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#111c12", lineHeight: 1.25, fontSize: "1.2rem" }}>
                  Get Course Syllabus
                </Typography>
                <Typography sx={{ color: "#3DB843", fontWeight: 700, fontSize: "0.88rem", mt: 0.3 }}>
                  {selectedCourse?.title}
                </Typography>
                <Typography sx={{ color: "#6b8f6d", fontSize: "0.8rem", mt: 0.3 }}>
                  Enter your details below to receive the complete syllabus PDF directly in your email inbox.
                </Typography>
              </Box>

              {/* Form Fields */}
              <Stack spacing={1.8}>
                <TextField
                  label="Full Name"
                  name="name"
                  required
                  fullWidth
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                    },
                  }}
                />

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5 }}>
                  <TextField
                    label="Email Address"
                    name="email"
                    type="email"
                    required
                    fullWidth
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    size="small"
                    helperText="PDF will be delivered to this email"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                      },
                    }}
                  />
                  <TextField
                    label="Mobile / WhatsApp"
                    name="mobile"
                    required
                    fullWidth
                    placeholder="10-digit number"
                    value={formData.mobile}
                    onChange={handleChange}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                      },
                    }}
                  />
                </Box>

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1.3fr 1fr" }, gap: 1.5 }}>
                  <TextField
                    label="College / Institution"
                    name="college"
                    required
                    fullWidth
                    placeholder="e.g. Anna University / SRM"
                    value={formData.college}
                    onChange={handleChange}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                      },
                    }}
                  />
                  <TextField
                    label="Degree & Branch"
                    name="degree"
                    required
                    fullWidth
                    placeholder="e.g. B.E CSE / B.Tech"
                    value={formData.degree}
                    onChange={handleChange}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                      },
                    }}
                  />
                </Box>

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5 }}>
                  <TextField
                    select
                    label="Year of Study"
                    name="year"
                    fullWidth
                    value={formData.year}
                    onChange={handleChange}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                      },
                    }}
                  >
                    {YEAR_OPTIONS.map((y) => (
                      <MenuItem key={y} value={y}>
                        {y}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    label="Preferred Mode"
                    name="mode"
                    fullWidth
                    value={formData.mode}
                    onChange={handleChange}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                      },
                    }}
                  >
                    {MODE_OPTIONS.map((m) => (
                      <MenuItem key={m} value={m}>
                        {m}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>

                <Box sx={{ pt: 0.5 }}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={submitting}
                    startIcon={
                      submitting ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        <SendIcon sx={{ fontSize: "16px !important" }} />
                      )
                    }
                    sx={{
                      bgcolor: "#3DB843",
                      color: "#fff",
                      py: 1.3,
                      borderRadius: "12px",
                      fontWeight: 700,
                      fontSize: "0.92rem",
                      textTransform: "none",
                      boxShadow: "0 8px 20px rgba(61, 184, 67, 0.25)",
                      "&:hover": { bgcolor: "#2e9133" },
                    }}
                  >
                    {submitting ? "Sending Syllabus..." : "Send Syllabus to My Email"}
                  </Button>
                </Box>

                <Typography
                  sx={{
                    textAlign: "center",
                    fontSize: "0.72rem",
                    color: "#6b8f6d",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.5,
                  }}
                >
                  <VerifiedIcon sx={{ fontSize: 13, color: "#3DB843" }} />
                  Email & mobile number are mandatory. We never spam.
                </Typography>
              </Stack>
            </Box>
          ) : (
            /* STEP 2: EMAIL SENT CONFIRMATION STATE (NO DIRECT DOWNLOAD) */
            <Box sx={{ textAlign: "center", py: 4, px: 2 }}>
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  bgcolor: "rgba(61, 184, 67, 0.12)",
                  color: "#3DB843",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2.5,
                }}
              >
                <MarkEmailReadIcon sx={{ fontSize: 44 }} />
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 800, color: "#111c12", mb: 1, fontSize: "1.25rem" }}>
                Syllabus Sent to Your Email! 📩
              </Typography>

              <Typography sx={{ color: "#334155", fontSize: "0.9rem", lineHeight: 1.6, maxWidth: "440px", mx: "auto", mb: 2 }}>
                We have emailed the official syllabus PDF for <strong>{selectedCourse?.title}</strong> to:
              </Typography>

              <Box
                sx={{
                  display: "inline-block",
                  bgcolor: "rgba(61, 184, 67, 0.08)",
                  border: "1px solid rgba(61, 184, 67, 0.25)",
                  color: "#1f6b24",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  px: 2.5,
                  py: 0.8,
                  borderRadius: "30px",
                  mb: 2.5,
                }}
              >
                {formData.email}
              </Box>

              <Typography sx={{ color: "#64748b", fontSize: "0.82rem", lineHeight: 1.5, maxWidth: "420px", mx: "auto", mb: 3 }}>
                Please check your inbox (and check your spam/junk folder if you don't see it within a minute). Our career advisor will also connect with you at <strong>{formData.mobile}</strong>.
              </Typography>

              <Box>
                <Button
                  onClick={handleCloseModal}
                  variant="contained"
                  sx={{
                    bgcolor: "#3DB843",
                    color: "#fff",
                    py: 1.1,
                    px: 4,
                    borderRadius: "20px",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    textTransform: "none",
                    boxShadow: "0 6px 18px rgba(61, 184, 67, 0.25)",
                    "&:hover": { bgcolor: "#2e9133" },
                  }}
                >
                  Close & Explore More Courses
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
