import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { PostRequest } from "../../api/config";
import { ADMIN_POST_ENQUIRIES } from "../../api/endpoints";

export default function EnquiryFormAlone() {
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

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
    <Box
      sx={{
        flex: 1,
        backgroundColor: "white",
        boxShadow:
          "0px 10px 30px rgba(0,0,0,0.08), 0px 4px 12px rgba(0,0,0,0.05)",
        padding: "30px",
        borderRadius: "15px" }}
    >
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Quick{" "}
        <Box component="span" sx={{ color: "#48723e" }}>
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
            "&:hover": { background: "#000", color: "white" } }}
        >
          {loading ? "Submitting..." : "Let’s get Started!"}
        </Button>
      </Box>
    </Box>
  );
}