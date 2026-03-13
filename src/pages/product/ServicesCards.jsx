import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  MenuItem,
  Container,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LaptopIcon from "@mui/icons-material/Laptop";
import GroupsIcon from "@mui/icons-material/Groups";
import WorkIcon from "@mui/icons-material/Work";
import Close from "@mui/icons-material/Close";
import School from "@mui/icons-material/School";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AOS from "aos";
import "aos/dist/aos.css";
import { PostRequest, GetRequest } from "../../api/config";
import {
  ADMIN_POST_REGISTRATIONS,
  ADMIN_GET_CATEGORIES,
} from "../../api/endpoints";
import toast from "react-hot-toast";

/* ---------------- DUMMY DATA ---------------- */

const servicesData = [
  {
    title: "Online Courses",
    description:
      "Self-paced learning with industry-expert instructors and hands-on projects.",
    icon: <LaptopIcon sx={{ fontSize: 30 }} />,
    color: "#0284c7", // Sky 600
    features: [
      "24/7 Access to course materials",
      "Interactive coding exercises",
      "Real-world projects",
      "Community support",
    ],
    buttonText: "Explore Courses",
  },
  {
    title: "Corporate Training",
    description: "Customized training programs for teams and organizations to upskill effectively.",
    icon: <GroupsIcon sx={{ fontSize: 30 }} />,
    color: "#10b981", // Emerald 500
    features: [
      "Tailored curriculum",
      "On-site or remote delivery",
      "Progress tracking",
      "Certification programs",
    ],
    buttonText: "Get Quote",
  },
  {
    title: "Career Services",
    description:
      "Job placement assistance and career guidance for our dedicated graduates.",
    icon: <WorkIcon sx={{ fontSize: 30 }} />,
    color: "#8b5cf6", // Violet 500
    features: [
      "Resume optimization",
      "Interview preparation",
      "Job placement assistance",
      "Salary negotiation",
    ],
    buttonText: "Apply Now",
  },
];

/* ---------------- CARD COMPONENT ---------------- */

const ServiceCard = ({
  title,
  description,
  icon,
  features,
  color,
  buttonText,
  onClick,
}) => {
  return (
    <Card
      sx={{
        width: "100%",
        height: "100%",
        borderRadius: "20px",
        boxShadow: "0 8px 30px -10px rgba(0,0,0,0.08)",
        border: '1px solid #e2e8f0',
        textAlign: "left",
        p: { xs: 2.5, sm: 3 },
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#fff',
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: `0 15px 35px -10px ${color}30`,
          borderColor: `${color}50`,
          "& .service-icon": {
            transform: 'scale(1.1) rotate(5deg)',
            bgcolor: color,
            color: '#fff'
          }
        }
      }}
    >
      <Box sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: 120,
        height: 120,
        background: `radial-gradient(circle at top right, ${color}15, transparent 70%)`,
        zIndex: 0
      }}/>
      
      <CardContent sx={{ p: 0, zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Avatar
          className="service-icon"
          sx={{
            bgcolor: `${color}15`,
            color: color,
            width: 60,
            height: 60,
            mb: 2.5,
            transition: 'all 0.3s ease'
          }}
        >
          {icon}
        </Avatar>

        <Typography
          variant="h6"
          fontWeight="800"
          sx={{ fontFamily: '"Bricolage Grotesque", sans-serif', color: '#0f172a', mb: 1, fontSize: '20px' }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: '#64748b', mb: 3, lineHeight: 1.5, fontSize: '14px' }}
        >
          {description}
        </Typography>

        <Stack spacing={2} alignItems="flex-start" mb={4} sx={{ flexGrow: 1 }}>
          {features.map((item, index) => (
            <Box key={index} sx={{ display: "flex", alignItems: "flex-start" }}>
              <Box sx={{ mt: 0.2, mr: 1.5 }}>
                 <CheckCircleIcon sx={{ color: color, fontSize: 18 }} />
              </Box>
              <Typography variant="body2" sx={{ color: '#334155', fontWeight: 500, fontSize: '14px' }}>
                {item}
              </Typography>
            </Box>
          ))}
        </Stack>

        <Button
          onClick={onClick}
          endIcon={<ArrowForwardIcon />}
          sx={{
            borderRadius: '10px',
            textTransform: "none",
            py: 1,
            px: 2.5,
            fontWeight: 700,
            fontSize: '14px',
            color: color,
            bgcolor: `${color}10`,
            alignSelf: 'flex-start',
            transition: 'all 0.2s',
            "&:hover": {
              bgcolor: color,
              color: "#fff",
              transform: 'translateX(4px)'
            }
          }}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

/* ---------------- MAIN PAGE ---------------- */

const ServicesCards = () => {
  const [open, setOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [cats, setCats] = useState([]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    courseId: "",
  });

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
      easing: "ease-in-out",
    });
  }, []);

  /* ✅ FETCH CATEGORIES */
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await GetRequest(ADMIN_GET_CATEGORIES);
        setCats(data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCats();
  }, []);

  const handleOpen = (service) => {
    setSelectedService(service);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedService(null);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const numbersOnly = value.replace(/[^0-9]/g, "");
      if (numbersOnly.length <= 10) {
        setFormData({ ...formData, [name]: numbersOnly });
      }
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim() || !validateEmail(formData.email)) return toast.error("Valid email is required");
    if (!formData.phone.trim() || formData.phone.length !== 10) return toast.error("Phone number must be 10 digits");
    if (!formData.courseId) return toast.error("Please select a course");

    try {
      const data = await PostRequest(ADMIN_POST_REGISTRATIONS, {
        ...formData,
        inquiryType: selectedService.title
      });

      if (data?.message === "Registration successful") {
        const selectedCat = cats.find((c) => (c._id || c.id) === formData.courseId);
        toast.success(
          `Inquiry submitted successfully for ${selectedCat?.categoryName || selectedCat?.category || "Selected Course"}!`,
        );
      } else {
        toast.error(data.message || "Submission failed");
      }

      handleClose();
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        courseId: "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  return (
    <Box sx={{ bgcolor: "#fff", pt: {xs: 6, md: 8}, pb: {xs: 6, md: 8} }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 }, animation: 'fadeIn 0.8s ease' }}>
          <Typography
            sx={{
              color: "#10b981",
              fontWeight: 800,
              fontSize: "14px",
              letterSpacing: 1.5,
              textTransform: "uppercase",
              mb: 1,
            }}
          >
            Enhance Your Experience
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "32px", md: "40px" },
              fontWeight: 800,
              fontFamily: '"Bricolage Grotesque", sans-serif',
              color: "#0f172a",
              mb: 2,
            }}
          >
            Additional Student Services
          </Typography>
          <Typography
            sx={{
              fontSize: "16px",
              color: "#64748b",
              maxWidth: "600px",
              mx: "auto",
              lineHeight: 1.6
            }}
          >
            We go beyond just teaching. Discover how we support your educational journey and career advancement.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: {xs: 3, md: 3, lg: 4},
            flexDirection: {xs: "column", md: "row"},
            alignItems: "stretch"
          }}
        >
          {servicesData.map((service, index) => (
            <Box key={index} data-aos="fade-up" data-aos-delay={index * 150} sx={{ display: 'flex', flex: 1 }}>
              <ServiceCard {...service} onClick={() => handleOpen(service)} />
            </Box>
          ))}
        </Box>
      </Container>


      {/* ---------------- MODAL ---------------- */}

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: '24px' }
        }}
      >
        {selectedService && (
          <>
            <DialogTitle
              sx={{ 
                bgcolor: selectedService.color, 
                color: "#fff", 
                position: "relative",
                p: {xs: 3, sm: 4}
              }}
            >
              <Typography variant="h5" fontWeight={800} sx={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}>
                {selectedService.title}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5, maxWidth: '90%' }}>
                Fill out the form below and our team will get in touch with you shortly.
              </Typography>

              <IconButton
                onClick={handleClose}
                sx={{ 
                  position: "absolute", 
                  right: 16, 
                  top: 24, 
                  color: "#fff",
                  bgcolor: 'rgba(0,0,0,0.1)',
                  "&:hover": { bgcolor: 'rgba(0,0,0,0.2)' }
                }}
              >
                <Close />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: {xs: 3, sm: 4} }}>
              <Stack spacing={3} mt={1}>
                <TextField
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  fullWidth
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: '12px' } }}
                />

                <TextField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: '12px' } }}
                />

                <TextField
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  fullWidth
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: '12px' } }}
                />

                {/* ✅ CATEGORY DROPDOWN */}
                <TextField
                  select
                  label="Interested Discipline / Course"
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleChange}
                  fullWidth
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: '12px' } }}
                >
                  {cats.map((course) => (
                    <MenuItem 
                      key={course._id || course.id} 
                      value={course._id || course.id}
                      sx={{ color: 'black', fontWeight: 500 }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <School sx={{ fontSize: 20, color: 'var(--green)' }} />
                        <Typography fontWeight={500}>{course.categoryName || course.category}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>

                <Box sx={{ 
                  p: 2.5, 
                  bgcolor: `${selectedService.color}10`, 
                  borderRadius: '16px',
                  border: `1px solid ${selectedService.color}30`
                }}>
                  <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                    Inquiry Type:
                  </Typography>
                  <Typography fontWeight="700" color={selectedService.color} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon fontSize="small" />
                    {selectedService.title} Inquiry
                  </Typography>
                </Box>
              </Stack>
            </DialogContent>

            <DialogActions sx={{ p: {xs: 3, sm: 4}, pt: 0 }}>
              <Button 
                onClick={handleClose}
                 sx={{ 
                  color: '#64748b', 
                  fontWeight: 600,
                  px: 3 
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                sx={{
                  bgcolor: selectedService.color,
                  px: 4,
                  py: 1.5,
                  borderRadius: '12px',
                  fontWeight: 700,
                  boxShadow: `0 4px 12px ${selectedService.color}40`,
                  "&:hover": { 
                    bgcolor: selectedService.color,
                    filter: 'brightness(0.9)'
                  }
                }}
              >
                Submit Inquiry
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ServicesCards;
