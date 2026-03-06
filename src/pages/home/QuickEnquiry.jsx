import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { PostRequest } from "../../api/config";
import { ADMIN_POST_ENQUIRIES } from "../../api/endpoints";

export default function QuickEnquiry() {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    course: "",
    location: "",
    timeslot: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    // Basic validation
    const { name, email, mobile, course, location, timeslot } = formData;
    if (!name || !email || !mobile || !course || !location || !timeslot) {
      setError("Please fill all fields");
      setLoading(false);
      return;
    }

    try {
      const response = await PostRequest(ADMIN_POST_ENQUIRIES, formData);
      setSuccess("Enquiry submitted successfully!");
      setFormData({
        name: "",
        email: "",
        mobile: "",
        course: "",
        location: "",
        timeslot: "",
      });
      console.log(response);
    } catch (err) {
      setError("Failed to submit enquiry: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", px: { xs: 2, md: 4 }, py: 8 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 6,
          alignItems: { xs: "center", md: "flex-start" } }}
      >
        {/* LEFT FORM */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "white",
            boxShadow:
              "0px 10px 30px rgba(0,0,0,0.08), 0px 4px 12px rgba(0,0,0,0.05)",
            padding: "30px",
            borderRadius: "15px" }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: "#1a4718" }}>
            Quick{" "}
            <Box component="span" sx={{ color: "#83a561" }}>
              Enquiry
            </Box>
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth
              placeholder="Your Name *"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              placeholder="Your Email Address *"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              placeholder="Mobile Number *"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              placeholder="Course you are interested in ? *"
              name="course"
              value={formData.course}
              onChange={handleChange}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                placeholder="Your Location *"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                placeholder="Preferred timeslot to call *"
                name="timeslot"
                value={formData.timeslot}
                onChange={handleChange}
              />
            </Box>

            {error && (
              <Typography color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            {success && (
              <Typography color="success.main" sx={{ mt: 1 }}>
                {success}
              </Typography>
            )}

            <Button
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                mt: 2,
                py: 1.5,
                fontSize: "16px",
                fontWeight: 600,
                borderRadius: "10px",
                textTransform: "none",
                background: "#48723e",
                color: "white",
                "&:hover": { background: "#000000ff", color: "white" } }}
            >
              {loading ? "Submitting..." : "Let’s get Started!"}
            </Button>
          </Box>
        </Box>

        {/* RIGHT CONTENT */}
        <Box
          sx={{
            flex: 1,
            pl: { md: 4 },
            borderLeft: { md: "0.5px solid #999" } }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: "#1a4718" }}>
            The Best{" "}
            <Box component="span" sx={{ color: "#83a561" }}>
              Software Training
            </Box>
          </Typography>

          <Typography
            sx={{ color: "#555", mb: 2, lineHeight: 1.7, textAlign: "justify" }}
          >
            DLK is{" "}
            <strong> the Best Software Training Institute in Chennai </strong>
            for its Prominent IT Training and Placement Institute steered by IT
            experts with 100% placement guidance. With over 20 years of
            experience in Training and Placement, our institute is acclaimed for
            its practical approach, enabling students to master 70+ technologies
            effortlessly.
          </Typography>

          <Typography
            sx={{ color: "#555", lineHeight: 1.7, textAlign: "justify" }}
          >
            Our training is led by IT working professionals from prestigious
            MNCs, offering an authentic corporate experience. We are dedicated
            to nurturing skilled professionals to thrive in the ever-evolving IT
            field with our 500+ hiring partners.
          </Typography>

          <Typography
            sx={{ color: "#555", mb: 2, lineHeight: 1.7, textAlign: "justify" }}
          >
            Our state-of-the-art infrastructure and supportive learning
            environment create the perfect platform for aspiring IT
            professionals to grow. From beginners to experienced professionals
            looking to upskill.
          </Typography>

          <Typography
            sx={{ color: "#555", lineHeight: 1.7, textAlign: "justify" }}
          >
            With a strong network of corporate partnerships and consistent
            placement support, DLK continues to shape successful careers across
            various domains including Full Stack Development, Data Science,
            Cloud Computing, Testing, and Digital Technologies.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
