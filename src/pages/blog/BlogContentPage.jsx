import React, { useEffect, useState } from "react";
import { Box, Typography, Stack, Divider } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { GetRequest } from "../../api/config";
import { ADMIN_GET_BLOGS_SLUG, GET_ALL_BLOGS } from "../../api/endpoints";
import { BASE_URL, getImgUrl } from "../../api/api";

export default function BlogContentPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [latestPosts, setLatestPosts] = useState([]);
  const [relatedAds, setRelatedAds] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch blog detail
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await GetRequest(ADMIN_GET_BLOGS_SLUG(slug));
        setBlog(res?.data || null);
      } catch (err) {
        console.error("Error fetching blog detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  // Fetch latest posts
  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const res = await GetRequest(GET_ALL_BLOGS);
        const posts = res?.data?.data || [];
        setLatestPosts(posts.slice(0, 5)); // show top 5
      } catch (err) {
        console.error("Error fetching latest posts:", err);
      }
    };
    fetchLatestPosts();
  }, []);

  // Fetch related ads
  useEffect(() => {
    const fetchRelatedAds = async () => {
      try {
        const res = await GetRequest(GET_ALL_BLOGS);
        const ads = res?.data?.data?.data || [];
        setRelatedAds(ads.slice(0, 5)); // top 5 ads
      } catch (err) {
        console.error("Error fetching ads:", err);
      }
    };
    fetchRelatedAds();
  }, []);

  const formattedDate = blog?.created_at
    ? new Date(blog.created_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  if (!blog) return <Typography align="center">Blog not found</Typography>;

  return (
    <Box
      sx={{
        maxWidth: "1200px",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "70% 30%" },
        gap: { xs: 2, md: 4 },
        alignItems: "start",
        m: "60px auto" }}
    >
      {/* LEFT CONTENT */}
      <Box>
        {/* Blog description (HTML from backend) */}
        <Box
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: blog.description }}
          sx={{ lineHeight: 1.8, mb: 5 }}
        />

        {/* Related Ads */}
        {relatedAds.length > 0 && (
          <Box mb={5}>
            <Typography variant="h5" fontWeight={700} mb={2}>
              Related Ads
            </Typography>
            <Stack spacing={2}>
              {relatedAds.map((ad) => (
                <Box
                  key={ad.id}
                  sx={{
                    cursor: "pointer",
                    borderRadius: 2,
                    overflow: "hidden",
                    p: 1,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    "&:hover": {
                      transform: "scale(1.02)",
                      transition: "all 0.25s",
                    } }}
                  onClick={() => window.open(ad.link || "#", "_blank")}
                >
                  <Box
                    component="img"
                    src={ad.image}
                    alt={ad.title || "Ad"}
                    sx={{
                      width: "100%",
                      height: 150,
                      objectFit: "cover",
                      borderRadius: 1 }}
                  />
                  {ad.title && (
                    <Typography fontSize={14} fontWeight={600} mt={1}>
                      {ad.title}
                    </Typography>
                  )}
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </Box>

      {/* RIGHT SIDEBAR */}
      <Box
        sx={{
          position: "sticky",
          top: "88px",
          border: "1px solid",
          borderColor: "divider",
          margin: "0px 20px",
          borderRadius: 3,
          p: 3,
          background: "linear-gradient(180deg, #ffffff 0%, #fafafa 100%)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.04)",
          alignSelf: "flex-start" }}
      >
        {/* Latest Posts Header */}
        <Typography
          variant="h6"
          fontWeight={700}
          mb={1.5}
          sx={{ letterSpacing: "-0.3px" }}
        >
          Latest Posts
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Stack spacing={3}>
          {latestPosts.map((post) => (
            <Stack
              direction="row"
              spacing={2}
              key={post.id}
              sx={{
                cursor: "pointer",
                borderRadius: 2,
                p: 1,
                transition: "all 0.25s ease",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.03)",
                  transform: "translateY(-2px)",
                } }}
              onClick={() => navigate(`/blogs/${post.slug}`)}
            >
              {/* Thumbnail */}
              <Box
                sx={{
                  minWidth: 72,
                  height: 64,
                  borderRadius: 2,
                  overflow: "hidden",
                  flexShrink: 0 }}
              >
                <Box
                  component="img"
                  src={getImgUrl(blog.image)}
                  alt={post.title}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.35s ease",
                    "&:hover": { transform: "scale(1.08)" } }}
                />
              </Box>

              {/* Text */}
              <Box>
                <Typography
                  fontSize={14.5}
                  fontWeight={600}
                  lineHeight={1.4}
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden" }}
                >
                  {post.title}
                </Typography>
                <Typography
                  fontSize={12}
                  color="text.secondary"
                  mt={0.6}
                  sx={{ }}
                >
                  {formattedDate}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
