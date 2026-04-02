import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  alpha,
  CircularProgress,
  Fade,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import VerifiedIcon from "@mui/icons-material/Verified";
import { PostRequest } from "../api/config";
import { ADMIN_POST_ENQUIRIES } from "../api/endpoints";
import toast from "react-hot-toast";
import ReCAPTCHA from "react-google-recaptcha";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: "32px",
    padding: theme.spacing(1),
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(61, 184, 67, 0.1)",
    boxShadow: "0 25px 70px rgba(0, 0, 0, 0.15)",
    overflow: "visible",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: "16px",
    transition: "all 0.3s ease",
    "& fieldset": {
      borderColor: "rgba(61, 184, 67, 0.1)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(61, 184, 67, 0.3)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#3DB843",
      borderWidth: "2px",
    },
  },
}));

const locations = ["Vadapalani", "Porur", "Online"];
const timeslots = ["Morning", "Afternoon", "Evening"];

export default function QuickEnquiryModal({ open, onClose, initialCourse = "" }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    course: "", // This will be pre-filled
    location: "Vadapalani",
    timeslot: "Morning",
  });

  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const recaptchaRef = React.useRef(null);

  useEffect(() => {
    if (open) {
      setFormData((prev) => ({ ...prev, course: initialCourse }));
    }
  }, [open, initialCourse]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { name, email, mobile, course, location, timeslot } = formData;
    if (!name || !email || !mobile || !course || !location || !timeslot) {
      toast.error("Please fill all mandatory fields");
      setLoading(false);
      return;
    }

    if (!captchaToken) {
      toast.error("Please verify that you are not a robot");
      setLoading(false);
      return;
    }

    try {
      await PostRequest(ADMIN_POST_ENQUIRIES, { ...formData, captchaToken });
      toast.success("Enquiry submitted! We will contact you shortly.");
      setFormData({
        name: "",
        email: "",
        mobile: "",
        course: "",
        location: "Vadapalani",
        timeslot: "Morning",
      });
      onClose();
    } catch (err) {
      toast.error("Failed to submit enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: -20,
          right: -20,
          bgcolor: "white",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          color: "#3DB843",
          "&:hover": { bgcolor: "#f8fdf8", transform: "rotate(90deg)" },
          transition: "all 0.3s ease",
          zIndex: 10,
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ p: { xs: 3, md: 5 } }}>
        <Stack spacing={4}>
          <Box textAlign="center">
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                bgcolor: alpha("#3DB843", 0.08),
                color: "#1a4718",
                px: 2,
                py: 0.5,
                borderRadius: "50px",
                mb: 2,
              }}
            >
              <VerifiedIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption" sx={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: 1 }}>
                Quick Enquiry
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#111c12", mb: 1, letterSpacing: "-0.5px" }}>
              Claim Your <span style={{ color: "#3DB843" }}>Offer</span>
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b8f6d", fontWeight: 500 }}>
              Fill in your details and our team will get back to you with the next steps.
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <StyledTextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <StyledTextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <StyledTextField
                  fullWidth
                  label="Mobile Number"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                />
              </Stack>
              <StyledTextField
                fullWidth
                label="Course / Inquiry Type"
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <StyledTextField
                  select
                  fullWidth
                  label="Preferred Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                >
                  {locations.map((loc) => (
                    <MenuItem key={loc} value={loc}>
                      {loc}
                    </MenuItem>
                  ))}
                </StyledTextField>
                <StyledTextField
                  select
                  fullWidth
                  label="Preferred Timeslot"
                  name="timeslot"
                  value={formData.timeslot}
                  onChange={handleChange}
                  required
                >
                  {timeslots.map((slot) => (
                    <MenuItem key={slot} value={slot}>
                      {slot}
                    </MenuItem>
                  ))}
                </StyledTextField>
              </Stack>

              <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey="6Lc_DJAsAAAAADKYIf74PvRX5a5dUCy8GTxlxP5D"
                  onChange={(val) => setCaptchaToken(val)}
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                sx={{
                  bgcolor: "#3DB843",
                  color: "white",
                  py: 1.8,
                  borderRadius: "18px",
                  fontWeight: 700,
                  fontSize: "1rem",
                  textTransform: "none",
                  boxShadow: "0 10px 25px rgba(61, 184, 67, 0.3)",
                  "&:hover": { bgcolor: "#1a4718", transform: "translateY(-3px)" },
                  transition: "all 0.3s ease",
                  mt: 2,
                }}
              >
                {loading ? "Submitting..." : "Send Request Now"}
              </Button>
            </Stack>
          </form>
        </Stack>
      </DialogContent>
    </StyledDialog>
  );
}
