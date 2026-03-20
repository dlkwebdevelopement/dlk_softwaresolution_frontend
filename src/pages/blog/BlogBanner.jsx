import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Stack,
} from "@mui/material";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import { useParams } from "react-router-dom";
import { GetRequest } from "../../api/config";
import { ADMIN_GET_BLOGS_SLUG } from "../../api/endpoints";
import { BASE_URL, getImgUrl } from "../../api/api";

export default function BlogBanner() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await GetRequest(ADMIN_GET_BLOGS_SLUG(slug));
        setBlog(res?.data || null);
      } catch (error) {
        console.error("Error fetching blog banner data:", error);
      }
    };

    fetchBlog();
  }, [slug]);

  if (!blog) return null; // or loader

  const formattedDate = blog?.createdAt
  ? new Date(blog.createdAt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  : "";

  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: "auto", md: "450px" },
        minHeight: { xs: "320px", md: "450px" },
        borderRadius: { xs: "0px", md: "24px" },
        overflow: "hidden",
        m: { xs: "0px", md: "20px auto" },
        width: "100%",
        maxWidth: "1300px",
        display: "flex",
        alignItems: "center",
        backgroundImage: `
          linear-gradient(
            to right,
            rgba(0, 0, 0, 0.8) 0%,
            rgba(0, 0, 0, 0.6) 30%,
            rgba(0, 0, 0, 0) 100%
          ),
          url("${getImgUrl(blog?.image)}")
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: "0 20px 50px rgba(0,0,0,0.15)" }}
    >
      {/* Decorative Overlay for depth */}
      <Box 
        sx={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 40%)",
          zIndex: 1
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          px: { xs: 3, md: 10 },
          py: { xs: 8, md: 0 },
          display: "flex",
          flexDirection: "column",
          color: "#fff",
          maxWidth: "850px",
          animation: "fadeInUp 0.8s ease-out" }}
      >
        {/* Breadcrumb / Category */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
          <Chip
            label="Articles"
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(10px)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              borderRadius: "8px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              height: "28px" }}
          />
          <ChevronRight size={14} className="opacity-50" />
          <Typography sx={{ fontSize: "12px", fontWeight: 600, opacity: 0.7, textTransform: "uppercase", letterSpacing: "1px" }}>
            Reading Now
          </Typography>
        </Stack>

        {/* Blog Title */}
        <Typography
          variant="h1"
          sx={{
            fontWeight: 600,
            lineHeight: 1.1,
            mb: 4,
            fontSize: { xs: "28px", md: "42px" },
            background: "linear-gradient(to bottom, #ffffff, #e2e8f0)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
        >
          {blog.title}
        </Typography>

        {/* Meta Info */}
        <Stack 
          direction={{ xs: "column", sm: "row" }} 
          spacing={{ xs: 2, sm: 4 }} 
          alignItems={{ xs: "flex-start", sm: "center" }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ p: 1, bgcolor: "rgba(255,255,255,0.1)", borderRadius: "10px", backdropFilter: "blur(5px)" }}>
              <Calendar size={18} className="text-white" />
            </Box>
            <Box>
              <Typography sx={{ fontSize: "10px", fontWeight: 700, opacity: 0.5, textTransform: "uppercase" }}>Published On</Typography>
              <Typography sx={{ fontWeight: 600, fontSize: "14px" }}>{formattedDate}</Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ p: 1, bgcolor: "rgba(255,255,255,0.1)", borderRadius: "10px", backdropFilter: "blur(5px)" }}>
              <Clock size={18} className="text-white" />
            </Box>
            <Box>
              <Typography sx={{ fontSize: "10px", fontWeight: 700, opacity: 0.5, textTransform: "uppercase" }}>Reading Time</Typography>
              <Typography sx={{ fontWeight: 600, fontSize: "14px" }}>5 Min Read</Typography>
            </Box>
          </Stack>
        </Stack>
      </Box>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </Box>
  );
}
