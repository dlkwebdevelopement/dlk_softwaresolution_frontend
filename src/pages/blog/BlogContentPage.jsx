import React, { useEffect, useState } from "react";
import { 
  Box, 
  Typography, 
  Stack, 
  Divider, 
  IconButton, 
  Tooltip,
  Container,
  alpha 
} from "@mui/material";
import { 
  Calendar, 
  Clock, 
  Share2, 
  Twitter, 
  Linkedin, 
  Link as LinkIcon,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { GetRequest } from "../../api/config";
import { ADMIN_GET_BLOGS_SLUG, GET_ALL_BLOGS } from "../../api/endpoints";
import { getImgUrl } from "../../api/api";

const getFormattedDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function BlogContentPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [latestPosts, setLatestPosts] = useState([]);
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
    window.scrollTo(0, 0);
  }, [slug]);

  // Fetch latest posts
  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const res = await GetRequest(GET_ALL_BLOGS);
        const posts = res?.data?.data || [];
        setLatestPosts(posts.slice(0, 6)); // show top 6
      } catch (err) {
        console.error("Error fetching latest posts:", err);
      }
    };
    fetchLatestPosts();
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    // You could add a toast here
  };

  if (loading) return (
    <Box sx={{ py: 20, textAlign: 'center' }}>
      <Typography sx={{ color: 'text.secondary', fontWeight: 500 }}>Loading story...</Typography>
    </Box>
  );

  if (!blog) return (
    <Box sx={{ py: 20, textAlign: 'center' }}>
      <Typography variant="h5" fontWeight={700}>Blog not found</Typography>
      <Typography 
        onClick={() => navigate('/blogs')}
        sx={{ mt: 2, color: 'primary.main', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
      >
        Return to blogs
      </Typography>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 340px" },
          gap: { xs: 6, md: 8 },
          alignItems: "start"
        }}
      > 
        {/* LEFT CONTENT */}
        <Box component="article">
          {/* Social Share Bar */}
          <Stack 
            direction="row" 
            spacing={2} 
            alignItems="center" 
            sx={{ 
              mb: 4, 
              p: 2, 
              bgcolor: 'rgba(248, 250, 252, 0.5)', 
              borderRadius: '20px',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              width: 'fit-content'
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1, ml: 1 }}>
              Share
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            <Stack direction="row" spacing={0.5}>
              <Tooltip title="Share on Twitter" arrow>
                <IconButton size="small" sx={{ color: '#1DA1F2', '&:hover': { bgcolor: alpha('#1DA1F2', 0.1) } }}>
                  <Twitter size={18} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Share on LinkedIn" arrow>
                <IconButton size="small" sx={{ color: '#0A66C2', '&:hover': { bgcolor: alpha('#0A66C2', 0.1) } }}>
                  <Linkedin size={18} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Copy Link" arrow>
                <IconButton onClick={handleCopyLink} size="small" sx={{ color: '#64748b', '&:hover': { bgcolor: alpha('#64748b', 0.1) } }}>
                  <LinkIcon size={18} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          {/* Blog Content */}
          <Box
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: blog.description }}
            sx={{ 
              lineHeight: 1.8, 
              color: "#334155",
              fontSize: { xs: "1.05rem", md: "1.125rem" },
              fontFamily: '"Inter", "system-ui", sans-serif',
              "& h2": { 
                fontSize: { xs: "1.75rem", md: "2.25rem" }, 
                fontWeight: 800, 
                mb: 3, 
                mt: 6, 
                color: "#0f172a",
                letterSpacing: "-0.02em",
                lineHeight: 1.2
              },
              "& h3": { 
                fontSize: { xs: "1.4rem", md: "1.75rem" }, 
                fontWeight: 700, 
                mb: 2, 
                mt: 4, 
                color: "#1e293b",
                letterSpacing: "-0.01em"
              },
              "& p": { 
                mb: 3,
                opacity: 0.95
              },
              "& img": { 
                maxWidth: "100%", 
                height: "auto", 
                borderRadius: "24px", 
                my: 5,
                boxShadow: "0 20px 50px rgba(0,0,0,0.08)"
              },
              "& ul, & ol": {
                ml: 4,
                mb: 4,
                "& li": {
                  mb: 1.5,
                  pl: 1
                }
              },
              "& blockquote": {
                borderLeft: "5px solid #16a34a",
                pl: 4,
                pr: 2,
                fontStyle: "italic",
                bgcolor: alpha("#16a34a", 0.04),
                py: 4,
                borderRadius: "4px 24px 24px 4px",
                mb: 5,
                fontSize: "1.25rem",
                color: "#166534",
                fontWeight: 500,
                lineHeight: 1.6
              },
              "& strong": {
                color: "#0f172a",
                fontWeight: 700
              }
            }}
          />

          <Divider sx={{ my: 8, opacity: 0.6 }} />

          {/* Footer Navigation */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography 
              onClick={() => navigate('/blogs')}
              sx={{ 
                color: 'text.secondary', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                fontWeight: 600,
                transition: 'all 0.2s',
                '&:hover': { color: 'primary.main', transform: 'translateX(-4px)' }
              }}
            >
              <ChevronRight style={{ transform: 'rotate(180deg)' }} size={18} />
              Back to Insights
            </Typography>
          </Stack>
        </Box>

        {/* RIGHT SIDEBAR */}
        <Box
          component="aside"
          sx={{
            position: "sticky",
            top: "100px",
            alignSelf: "flex-start"
          }}
        >
          {/* Latest Insights Card */}
          <Box
            sx={{
              background: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(226, 232, 240, 0.8)",
              borderRadius: "32px",
              p: 4,
              boxShadow: "0 20px 40px rgba(15, 23, 42, 0.04)",
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 4 }}>
              <Box 
                sx={{ 
                  p: 1, 
                  borderRadius: '12px', 
                  bgcolor: alpha('#16a34a', 0.1), 
                  color: '#16a34a',
                  display: 'flex'
                }}
              >
                <TrendingUp size={20} />
              </Box>
              <Typography
                variant="h6"
                sx={{ 
                  fontWeight: 800, 
                  letterSpacing: "-0.02em", 
                  fontSize: "1.25rem", 
                  color: "#0f172a" 
                }}
              >
                Latest Insights
              </Typography>
            </Stack>

            <Stack spacing={4}>
              {latestPosts.map((post) => (
                <Stack
                  direction="row"
                  spacing={2}
                  key={post.id}
                  sx={{
                    cursor: "pointer",
                    group: 'true',
                    "&:hover": {
                      "& .post-thumb": { transform: "scale(1.1)" },
                      "& .post-title": { color: "#16a34a" }
                    } 
                  }}
                  onClick={() => navigate(`/blogs/${post.slug}`)}
                >
                  {/* Thumbnail */}
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "16px",
                      overflow: "hidden",
                      flexShrink: 0,
                      border: '1px solid rgba(226, 232, 240, 0.8)'
                    }}
                  >
                    <Box
                      component="img"
                      src={getImgUrl(post.image)}
                      alt={post.title}
                      className="post-thumb"
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
                      }}
                    />
                  </Box>

                  {/* Text Content */}
                  <Box sx={{ py: 0.5 }}>
                    <Typography
                      className="post-title"
                      sx={{
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        lineHeight: 1.4,
                        color: "#1e293b",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        mb: 1,
                        transition: 'color 0.2s'
                      }}
                    >
                      {post.title}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ color: "text.secondary" }}>
                      <Calendar size={12} />
                      <Typography sx={{ fontSize: "0.75rem", fontWeight: 600 }}>
                        {getFormattedDate(post.createdAt)}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              ))}
            </Stack>

            <Divider sx={{ my: 4, opacity: 0.5 }} />

            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary', 
                textAlign: 'center', 
                fontWeight: 500,
                fontStyle: 'italic'
              }}
            >
              Exploring the edge of software excellence.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
