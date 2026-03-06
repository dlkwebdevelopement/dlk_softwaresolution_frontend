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
  Paper,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LaptopIcon from "@mui/icons-material/Laptop";
import GroupsIcon from "@mui/icons-material/Groups";
import WorkIcon from "@mui/icons-material/Work";
import Close from "@mui/icons-material/Close";
import School from "@mui/icons-material/School";
import AOS from "aos";
import "aos/dist/aos.css";
import { PostRequest, GetRequest } from "../../api/config";
import {
  ADMIN_POST_REGISTRATIONS,
  ADMIN_GET_CATEGORIES,
} from "../../api/endpoints";

/* ---------------- DUMMY DATA ---------------- */

const servicesData = [
  {
    title: "Online Courses",
    description:
      "Self-paced learning with industry-expert instructors and hands-on projects.",
    icon: <LaptopIcon />,
    features: [
      "24/7 Access to course materials",
      "Interactive coding exercises",
      "Real-world projects",
      "Community support",
    ],
    buttonText: "Learn More",
  },
  {
    title: "Corporate Training",
    description: "Customized training programs for teams and organizations.",
    icon: <GroupsIcon />,
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
      "Job placement assistance and career guidance for our graduates.",
    icon: <WorkIcon />,
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
  buttonText,
  onClick,
}) => {
  return (
    <Card
      sx={{
        width: 350,
        height: 450,
        borderRadius: 4,
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        textAlign: "center",
        p: 2,
        transition: "0.3s",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
        } }}
    >
      <CardContent>
        <Avatar
          sx={{
            bgcolor: "#48723e",
            color: "#fff",
            width: 80,
            height: 80,
            mx: "auto",
            mb: 2 }}
        >
          {icon}
        </Avatar>

        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{}}
          gutterBottom
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{}}
          color="text.secondary"
          mb={2}
        >
          {description}
        </Typography>

        <Stack spacing={1} alignItems="flex-start" mb={3}>
          {features.map((item, index) => (
            <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
              <CheckCircleIcon sx={{ color: "#00c853", fontSize: 18, mr: 1 }} />
              <Typography variant="body2" sx={{}}>
                {item}
              </Typography>
            </Box>
          ))}
        </Stack>

        <Button
          onClick={onClick}
          variant="outlined"
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 3,
            borderColor: "#48723e",
            color: "#48723e",
            "&:hover": {
              bgcolor: "#48723e",
              color: "#fff",
            } }}
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
      duration: 500,
      once: false,
      mirror: true,
      easing: "ease-in-out-back",
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
        {servicesData.map((service, index) => (
          <Box key={index} data-aos="fade-up" data-aos-delay={index * 150}>
            <ServiceCard {...service} onClick={() => handleOpen(service)} />
          </Box>
        ))}
      </Box>

      {/* ---------------- MODAL ---------------- */}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        {selectedService && (
          <>
            <DialogTitle
              sx={{ bgcolor: "#48723e", color: "#fff", position: "relative" }}
            >
              <Typography variant="h6">{selectedService.title}</Typography>

              <IconButton
                onClick={handleClose}
                sx={{ position: "absolute", right: 16, top: 16, color: "#fff" }}
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

                <Paper sx={{ p: 2, bgcolor: "#f5f5f5" }}>
                  <Typography variant="subtitle2">Selected Service:</Typography>
                  <Typography fontWeight="bold">
                    {selectedService.title}
                  </Typography>
                </Paper>
              </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                startIcon={<CheckCircleIcon />}
                sx={{
                  bgcolor: "#48723e",
                  color: "#fff",
                  "&:hover": { bgcolor: "#1a4718" } }}
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

export default ServicesCards;
