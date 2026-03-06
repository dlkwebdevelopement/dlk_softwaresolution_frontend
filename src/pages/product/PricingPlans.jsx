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
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import Close from "@mui/icons-material/Close";
import CheckCircle from "@mui/icons-material/CheckCircle";
import School from "@mui/icons-material/School";
import AOS from "aos";
import "aos/dist/aos.css";
import { PostRequest } from "../../api/config";
import { ADMIN_POST_REGISTRATIONS } from "../../api/endpoints";
import { BASE_URL } from "../../api/api";

/* ---------------- PRICING DATA ---------------- */

const pricingData = [
  {
    duration: "3 Months",
    title: "AI Starter Program",
    subtitle: "Foundation in Python, Statistics & Visualization",
    price: "₹35,000",
    highlightColor: "#48723e",
    buttonText: "Enroll in Starter",
    buttonVariant: "outlined",
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
    title: "AI Professional Program",
    subtitle: "Hands-on ML, DL, and Data Visualization",
    price: "₹55,000",
    highlightColor: "#48723e",
    buttonText: "Enroll in Professional",
    buttonVariant: "contained",
    features: [
      { text: "Everything in Starter Program", available: true },
      { text: "Supervised & Unsupervised ML", available: true },
      { text: "Power BI, Matplotlib & Seaborn", available: true },
      { text: "Basics of Deep Learning & NLP", available: true },
      { text: "5+ Guided Projects", available: true },
      { text: "Free Laptop Included", available: true },
      { text: "Capstone Project (Industry Standard)", available: true },
      { text: "1-on-1 Mentorship & Job Guarantee", available: false },
    ],
  },
  {
    duration: "12 Months",
    title: "AI Master Program",
    subtitle: "Full-Stack AI with LLMs & Real-Time Projects",
    price: "₹1,05,000",
    highlightColor: "#48723e",
    buttonText: "Enroll in Master",
    buttonVariant: "contained",
    features: [
      { text: "Everything in Professional Program", available: true },
      { text: "Advanced Deep Learning (CNNs, LSTMs)", available: true },
      { text: "Transformers, BERT, GPT & LLMs", available: true },
      { text: "Weekly Mentorship & Doubt Clearing", available: true },
      { text: "Resume Reviews & Mock Interviews", available: true },
      { text: "100% Placement Assistance", available: true },
      { text: "Free Laptop + 3-Month Internship", available: true },
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
  onEnroll,
}) => {
  return (
    <Card
      sx={{
        width: 390,
        height: "100%",
        borderRadius: 4,
        border: `2px solid ${highlightColor}`,
        boxShadow: "0 12px 35px rgba(0,0,0,0.08)" }}
    >
      <CardContent
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          textAlign: "center" }}
      >
        <Chip
          label={duration}
          sx={{
            bgcolor: highlightColor,
            color: "#fff",
            mx: "auto",
            mb: 2 }}
        />

        <Typography variant="h6" fontWeight="bold" sx={{}}>
          {title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{}} mb={2}>
          {subtitle}
        </Typography>

        <Typography variant="h4" fontWeight="bold" sx={{}} color="#1e5bff">
          {price}
          <Typography component="span" variant="body2" sx={{}} color="text.secondary">
            /course
          </Typography>
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={1.4} sx={{ flexGrow: 1, textAlign: "left" }}>
          {features.map((item, index) => (
            <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
              {item.available ? (
                <CheckIcon sx={{ color: "#00c853", mr: 1 }} />
              ) : (
                <CloseIcon sx={{ color: "#f44336", mr: 1 }} />
              )}
              <Typography
                variant="body2"
                sx={{}}
                color={item.available ? "text.primary" : "text.disabled"}
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
            mt: 3,
            py: 1.2,
            borderRadius: 3,
            bgcolor:
              buttonVariant === "contained" ? highlightColor : "transparent",
            color: buttonVariant === "contained" ? "#fff" : highlightColor,
            borderColor: highlightColor,
            "&:hover": {
              bgcolor: highlightColor,
              color: "#fff",
            } }}
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
      duration: 500,
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ✅ SUBMIT */
  const handleSubmit = async () => {
    try {
      const data = await PostRequest(ADMIN_POST_REGISTRATIONS, formData);

      if (data?.message === "Registration successful") {
        alert(
          `✅ Registration successful for ${cats.find((c) => c.id === formData.courseId)?.category
          }!`,
        );
      } else {
        alert(data.message || "Registration failed");
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
      alert("Server error");
    }
  };

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f5f7fb",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 4,
          flexWrap: "wrap",
          p: 4 }}
      >
        {pricingData.map((plan, index) => (
          <Box key={index} data-aos="fade-up" data-aos-delay={index * 200}>
            <PricingCard {...plan} onEnroll={() => handleOpen(plan)} />
          </Box>
        ))}
      </Box>

      {/* ---------------- MODAL ---------------- */}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        {selectedPlan && (
          <>
            <DialogTitle
              sx={{
                bgcolor: selectedPlan.highlightColor,
                color: "#fff",
                position: "relative" }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: "#fff",
                    color: selectedPlan.highlightColor }}
                >
                  <School />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {selectedPlan.title}
                  </Typography>
                  <Typography variant="body2">
                    Complete your registration
                  </Typography>
                </Box>
              </Box>

              <IconButton
                onClick={handleClose}
                sx={{
                  position: "absolute",
                  right: 16,
                  top: 16,
                  color: "#fff" }}
              >
                <Close />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ py: 3 }}>
              <Stack spacing={2.5} mt={1}>
                <TextField
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  fullWidth
                />

                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                />

                <TextField
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  fullWidth
                />

                {/* ✅ CATEGORY DROPDOWN */}
                <TextField
                  select
                  label="Select Course Category"
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleChange}
                  fullWidth
                >
                  {cats.map((course) => (
                    <MenuItem key={course.id} value={course.id}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <School sx={{ fontSize: 20 }} />
                        {course.category}
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>

                {/* Plan Preview */}
                <Paper sx={{ p: 2, bgcolor: "#f5f5f5" }}>
                  <Typography variant="subtitle2" gutterBottom sx={{}}>
                    Selected Plan:
                  </Typography>
                  <Typography fontWeight="bold" sx={{}}>
                    {selectedPlan.title} - {selectedPlan.price}
                  </Typography>
                </Paper>
              </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                startIcon={<CheckCircle />}
                sx={{
                  bgcolor: selectedPlan.highlightColor,
                  "&:hover": {
                    bgcolor: selectedPlan.highlightColor,
                  } }}
              >
                Register Now
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default PricingPlans;
