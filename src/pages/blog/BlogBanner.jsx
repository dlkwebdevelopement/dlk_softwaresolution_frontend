import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Stack,
} from "@mui/material";
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

  const formattedDate = blog?.created_at
  ? new Date(blog.created_at).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  : "";

  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: "300px", md: "360px" },
        borderRadius: "16px",
        overflow: "hidden",
        m: { xs: "20px 20px", md: "20px auto" },
        px: "20px",
        width: "100%",
        maxWidth: "1200px",
        backgroundImage: `
          linear-gradient(
            90deg,
            rgba(14, 60, 60, 0.85) 0%,
            rgba(30, 130, 130, 0.6) 40%,
            rgba(255, 255, 255, 0.1) 100%
          ),
          url("${getImgUrl(blog?.image)}")
        `,
        backgroundSize: "cover",
        backgroundPosition: "center" }}
    >
      {/* Content */}
      <Box
        sx={{
          height: "100%",
          px: { xs: 3, md: 6 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          color: "#fff",
          maxWidth: "900px" }}
      >
        {/* Optional Category */}
        <Chip
          label="Blog"
          sx={{
            width: "fit-content",
            mb: 2,
            bgcolor: "#fff",
            color: "#000",
            fontWeight: 600,
            
            borderRadius: "10px" }}
        />

        {/* Blog Title */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            lineHeight: 1.2,
            mb: 3,
            fontSize: { xs: "26px", md: "40px" } }}
        >
          {blog.title}
        </Typography>

        {/* Meta Info */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography sx={{ opacity: 0.85 }}>
            • {formattedDate}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
