import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Avatar,
  Paper,
  MenuItem,
  Container
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import Close from "@mui/icons-material/Close";
import CheckCircle from "@mui/icons-material/CheckCircle";
import School from "@mui/icons-material/School";
import StarIcon from "@mui/icons-material/Star";
import AOS from "aos";
import "aos/dist/aos.css";
import { PostRequest } from "../../api/config";
import { ADMIN_POST_REGISTRATIONS } from "../../api/endpoints";
import { BASE_URL, getImgUrl } from "../../api/api";
import toast from "react-hot-toast";

/* ---------------- PRICING DATA ---------------- */

const pricingData = [
  {
    duration: "3 Months",
    title: "AI Starter Program",
    subtitle: "Foundation in Python, Statistics & Visualization",
    price: "₹35,000",
    highlightColor: "#10b981", // Emerald 500
    buttonText: "Enroll in Starter",
    buttonVariant: "outlined",
    recommended: false,
    features: [
      { text: "Python for Data Science", available: true },
      { text: "Statistics & Probability", available: true },
      { text: "Excel & SQL Basics", available: true },
      { text: "2 Mini Projects + Certificate", available: true },
      { text: "Machine Learning Models", available: false },
      { text: "Deep Learning & Transformers", available: false },
      { text: "Capstone & Career Services", available: false },
    ],
  },
  {
    duration: "6 Months",
    title: "Professional Program",
    subtitle: "Hands-on ML, DL, and Data Visualization",
    price: "₹55,000",
    highlightColor: "#059669", // Emerald 600
    buttonText: "Join Professional",
    buttonVariant: "contained",
    recommended: true,
    features: [
      { text: "Everything in Starter Program", available: true },
      { text: "Supervised & Unsupervised ML", available: true },
      { text: "Power BI, Matplotlib & Seaborn", available: true },
      { text: "Basics of Deep Learning & NLP", available: true },
      { text: "5+ Guided Projects", available: true },
      { text: "Free Laptop Included", available: true },
      { text: "Capstone Project", available: true },
      { text: "1-on-1 Mentorship", available: false },
    ],
  },
  {
    duration: "12 Months",
    title: "AI Master Program",
    subtitle: "Full-Stack AI with LLMs & Real-Time Projects",
    price: "₹1,05,000",
    highlightColor: "#0f172a", // Slate 900
    buttonText: "Enroll in Master",
    buttonVariant: "contained",
    recommended: false,
    features: [
      { text: "Everything in Professional Program", available: true },
      { text: "Advanced Deep Learning (CNNs)", available: true },
      { text: "Transformers, BERT, GPT & LLMs", available: true },
      { text: "Weekly Mentorship", available: true },
      { text: "Resume & Mock Interviews", available: true },
      { text: "100% Placement Assistance", available: true },
      { text: "Free Laptop + Internship", available: true },
    ],
  },
];

/* ---------------- REUSABLE CARD ---------------- */

const PricingCard = ({
  duration,
  title,
  subtitle,
  price,
  features,
  highlightColor,
  buttonText,
  buttonVariant,
  recommended,
  onEnroll,
}) => {
  return (
    <Card
      sx={{
        width: 380,
        height: "100%",
        borderRadius: "24px",
        border: recommended ? `2px solid ${highlightColor}` : '1px solid #e2e8f0',
        boxShadow: recommended 
          ? "0 20px 40px -5px rgba(16, 185, 129, 0.2)" 
          : "0 10px 25px -5px rgba(0,0,0,0.05)",
        transform: recommended ? 'scale(1.05)' : 'scale(1)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'visible',
        bgcolor: '#fff',
        "&:hover": {
          transform: recommended ? 'scale(1.08)' : 'scale(1.03)',
          boxShadow: recommended 
            ? "0 30px 60px -10px rgba(16, 185, 129, 0.3)" 
            : "0 20px 40px -5px rgba(0,0,0,0.1)",
        }
      }}
    >
      {recommended && (
        <Box
          sx={{
            position: 'absolute',
            top: -16,
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor: highlightColor,
            color: '#fff',
            px: 3,
            py: 0.8,
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            zIndex: 2
          }}
        >
          <StarIcon sx={{ fontSize: 16 }} />
          MOST POPULAR
        </Box>
      )}

      <CardContent
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          p: { xs: 4, sm: 5 }
        }}
      >
        <Chip
          label={duration}
          sx={{
            bgcolor: recommended ? 'rgba(16, 185, 129, 0.1)' : '#f1f5f9',
            color: recommended ? highlightColor : '#475569',
            fontWeight: 700,
            mx: "auto",
            mb: 3
          }}
        />

        <Typography 
          variant="h5" 
          fontWeight="800"
          sx={{ fontFamily: '"Bricolage Grotesque", sans-serif', color: '#0f172a' }}
        >
          {title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
          {subtitle}
        </Typography>

        <Typography variant="h3" fontWeight="800" sx={{ color: '#0f172a', fontFamily: '"Bricolage Grotesque", sans-serif' }}>
          {price}
          <Typography component="span" variant="body1" sx={{ color: '#94a3b8', fontWeight: 500, ml: 1 }}>
            /course
          </Typography>
        </Typography>

        <Divider sx={{ my: 4, borderColor: '#f1f5f9' }} />

        <Stack spacing={2} sx={{ flexGrow: 1, textAlign: "left", mb: 4 }}>
          {features.map((item, index) => (
            <Box key={index} sx={{ display: "flex", alignItems: "flex-start" }}>
              <Box sx={{ mt: 0.5, mr: 1.5 }}>
                {item.available ? (
                  <CheckCircle sx={{ color: highlightColor, fontSize: 20 }} />
                ) : (
                  <CloseIcon sx={{ color: "#cbd5e1", fontSize: 20 }} />
                )}
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: item.available ? "#334155" : "#94a3b8",
                  fontWeight: item.available ? 600 : 400,
                  fontSize: '15px'
                }}
              >
                {item.text}
              </Typography>
            </Box>
          ))}
        </Stack>

        <Button
          fullWidth
          variant={buttonVariant}
          onClick={onEnroll}
          sx={{
            py: 1.8,
            borderRadius: '16px',
            fontSize: '16px',
            fontWeight: 700,
            textTransform: 'none',
            bgcolor: buttonVariant === "contained" ? highlightColor : "transparent",
            color: buttonVariant === "contained" ? "#fff" : highlightColor,
            borderColor: highlightColor,
            borderWidth: buttonVariant === "outlined" ? '2px' : 0,
            "&:hover": {
              bgcolor: buttonVariant === "contained" ? (highlightColor === '#10b981' ? '#059669' : '#0f172a') : 'rgba(16, 185, 129, 0.05)',
               borderWidth: buttonVariant === "outlined" ? '2px' : 0,
            }
          }}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

/* ---------------- PAGE ---------------- */

const PricingPlans = () => {
  const [open, setOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
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
    AOS.refresh();
  }, []);

  /* ✅ FETCH CATEGORIES */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${BASE_URL}/admin/categories`);
        const data = await res.json();
        setCats(data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCategories();
  }, []);

  const handleOpen = (plan) => {
    setSelectedPlan(plan);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPlan(null);
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

  /* ✅ SUBMIT */
  const handleSubmit = async () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim() || !validateEmail(formData.email)) return toast.error("Valid email is required");
    if (!formData.phone.trim() || formData.phone.length !== 10) return toast.error("Phone number must be 10 digits");
    if (!formData.courseId) return toast.error("Please select a course category");

    try {
      const data = await PostRequest(ADMIN_POST_REGISTRATIONS, formData);

      if (data?.message === "Registration successful") {
        const selectedCat = cats.find((c) => (c._id || c.id) === formData.courseId);
        toast.success(
          `Registration successful for ${selectedCat?.categoryName || selectedCat?.category || "Selected Course"}!`,
        );
      } else {
        toast.error(data.message || "Registration failed");
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
    <Box sx={{ bgcolor: "#f1f5f9", pt: {xs: 10, md: 14}, pb: {xs: 12, md: 16}, position: 'relative', overflow: 'hidden' }}>
      
      {/* Decorative Blob */}
      <Box sx={{
        position: 'absolute',
        top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', height: '500px',
        background: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(241,245,249,0) 100%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: "center", mb: { xs: 8, md: 12 }, animation: 'fadeIn 0.8s ease' }}>
          <Typography
            sx={{
              color: "#10b981",
              fontWeight: 800,
              fontSize: "14px",
              letterSpacing: 1.5,
              textTransform: "uppercase",
              mb: 2,
            }}
          >
            Flexible Pricing
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "36px", md: "48px" },
              fontWeight: 800,
              fontFamily: '"Bricolage Grotesque", sans-serif',
              color: "#0f172a",
              mb: 3,
            }}
          >
            Choose the Right Plan <br/> For Your Goal
          </Typography>
          <Typography
            sx={{
              fontSize: "18px",
              color: "#64748b",
              maxWidth: "600px",
              mx: "auto",
              lineHeight: 1.6
            }}
          >
            Whether you want to learn the basics or master the entire stack with placement guarantee, we have a plan for everyone.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: {xs: 6, md: 4, lg: 6},
            flexDirection: {xs: 'column', md: 'row'},
            flexWrap: {xs: 'nowrap', md: 'nowrap'},
            px: {xs: 2, md: 0}
          }}
        >
          {pricingData.map((plan, index) => (
            <Box key={index} data-aos="fade-up" data-aos-delay={index * 150} sx={{ height: '100%' }}>
              <PricingCard {...plan} onEnroll={() => handleOpen(plan)} />
            </Box>
          ))}
        </Box>
      </Container>


      {/* ---------------- REGISTRATION MODAL ---------------- */}

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            overflow: 'hidden',
          }
        }}
      >
        {selectedPlan && (
          <>
            <DialogTitle
              sx={{
                bgcolor: selectedPlan.highlightColor,
                color: "#fff",
                position: "relative",
                p: 3
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "#fff"
                  }}
                >
                  <School />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    {selectedPlan.title}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Complete your registration details
                  </Typography>
                </Box>
              </Box>

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

            <DialogContent sx={{ p: 4 }}>
              <Stack spacing={3} mt={1}>
                {/* Plan Preview Badge */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  p: 2, 
                  bgcolor: "#f8fafc",
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0'
                }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Selected Plan
                    </Typography>
                    <Typography fontWeight="800" color="#0f172a">
                      {selectedPlan.title}
                    </Typography>
                  </Box>
                  <Typography variant="h6" fontWeight="800" color={selectedPlan.highlightColor}>
                    {selectedPlan.price}
                  </Typography>
                </Box>

                <TextField
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
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

                <TextField
                  select
                  label="Select Course Category"
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
                      sx={{ color: 'black', fontWeight: 500, py: 1.2 }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        {course.image && <img src={getImgUrl(course.image)} alt={course.categoryName || course.category} style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }} />}
                        <Typography fontWeight={500}>{course.categoryName || course.category}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 4, pt: 0 }}>
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
                  bgcolor: selectedPlan.highlightColor,
                  px: 4,
                  py: 1.5,
                  borderRadius: '12px',
                  fontWeight: 700,
                  boxShadow: `0 4px 12px ${selectedPlan.highlightColor}40`,
                  "&:hover": {
                    bgcolor: selectedPlan.highlightColor,
                    filter: 'brightness(0.9)'
                  }
                }}
              >
                Confirm Registration
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Box>
  );
};

export default PricingPlans;
