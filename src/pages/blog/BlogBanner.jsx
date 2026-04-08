import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Stack,
} from "@mui/material";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import { useParams } from "react-router-dom";
import { GetRequest } from "../../api/api";
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

  if (!blog) return null;

  return (
    <>
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
          boxShadow: "0 20px 50px rgba(0,0,0,0.15)" 
        }}
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

        {/* Banner is now purely visual - Content moved to Page Body */}
      </Box>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </>
  );
}
