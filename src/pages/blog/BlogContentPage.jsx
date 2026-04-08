import React, { useEffect, useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import {
  Box,
  Typography,
  Stack,
  Divider,
  Container,
  Button,
  TextField,
  alpha,
  Card,
  CardContent,
  Chip
} from "@mui/material";
import {
  Calendar,
  Clock,
  ChevronRight
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { GetRequest, PostRequest } from "../../api/api";
import { ADMIN_GET_BLOGS_SLUG, GET_ALL_BLOGS, ADMIN_POST_ENQUIRIES } from "../../api/endpoints";
import { getImgUrl } from "../../api/api";
import SendIcon from '@mui/icons-material/Send';
import toast from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css";

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
  const sliderRef = useRef(null);

  const [blog, setBlog] = useState(null);
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const recaptchaRef = useRef(null);

  // Auto-scroll logic array
  useEffect(() => {
    let intervalId;
    if (!isHovered && sliderRef.current && latestPosts.length > 0) {
      intervalId = setInterval(() => {
        const slider = sliderRef.current;
        if (slider) {
          if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10) {
            slider.scrollTo({ left: 0, behavior: "smooth" });
          } else {
            slider.scrollBy({ left: 350, behavior: "smooth" });
          }
        }
      }, 3000);
    }
    return () => clearInterval(intervalId);
  }, [isHovered, latestPosts]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    course: "",
    location: "",
    timeslot: "",
  });

  // Fetch blog detail
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  // Fetch latest posts
  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const res = await GetRequest(GET_ALL_BLOGS);
        const posts = res?.data?.data || [];
        setLatestPosts(posts.filter(p => p.slug !== slug).slice(0, 10));
      } catch (err) {
        console.error("Error fetching latest posts:", err);
      }
    };
    fetchLatestPosts();
  }, [slug]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile") {
      const nums = value.replace(/[^0-9]/g, "");
      if (nums.length <= 10) {
        setFormData({ ...formData, [name]: nums });
      }
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, mobile, course, location, timeslot } = formData;

    if (!name.trim()) return toast.error("Name is required");
    if (!email.trim() || !validateEmail(email)) return toast.error("Valid email is required");
    if (!mobile.trim() || mobile.length !== 10) return toast.error("Mobile number must be 10 digits");
    if (!course.trim() || !location.trim() || !timeslot.trim()) return toast.error("Please fill all fields");
    if (!captchaToken) return toast.error("Please verify CAPTCHA");

    try {
      const data = await PostRequest(ADMIN_POST_ENQUIRIES, { ...formData, captchaToken });
      if (data?.message === "Enquiry submitted successfully!") {
        toast.success("Quick Enquiry submitted successfully! We will contact you soon.");
        setFormData({
          name: "",
          email: "",
          mobile: "",
          course: "",
          location: "",
          timeslot: "",
        });
        setCaptchaToken(null);
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
        }
      } else {
        toast.error(data.message || "Submission failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  if (loading) return (
    <Box sx={{ py: 20, textAlign: 'center' }}>
      <Typography sx={{ color: 'text.secondary', fontWeight: 500 }}>Loading story...</Typography>
    </Box>
  );

  if (!blog) return (
    <Box sx={{ py: 20, textAlign: 'center' }}>
      <Typography variant="h5" fontWeight={600}>Blog not found</Typography>
      <Typography
        onClick={() => navigate('/blogs')}
        sx={{ mt: 2, color: 'primary.main', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
      >
        Return to blogs
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh", pb: 10 }}>
      <Container maxWidth="lg" sx={{ mt: 8, position: 'relative', zIndex: 10 }}>

        {/* Blog Header Section */}
        <Box sx={{ mb: 6, pb: 4, borderBottom: "1px solid #e2e8f0" }} data-aos="fade-up">

          {/* Breadcrumb / Category Chip */}
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
            <Chip
              label="Article"
              sx={{
                bgcolor: alpha("#1b365d", 0.08),
                color: "#1b365d",
                fontWeight: 700,
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                borderRadius: "6px",
                height: "26px"
              }}
            />
            <ChevronRight size={14} className="opacity-50" />
            <Typography sx={{ fontSize: "11px", fontWeight: 700, opacity: 0.6, textTransform: "uppercase", letterSpacing: "1px" }}>
              Reading Now
            </Typography>
          </Stack>

          {/* Blog Title */}
          <Typography
            variant="h1"
            sx={{
              fontWeight: 700,
              lineHeight: 1.2,
              mb: 4,
              fontSize: { xs: "32px", md: "48px" },
              color: "#0f172a",
              letterSpacing: "-0.01em"
            }}
          >
            {blog?.title}
          </Typography>

          {/* Meta Information Bar */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 3, sm: 6 },
              alignItems: { xs: "flex-start", sm: "center" }
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box sx={{ p: 1.2, bgcolor: alpha("#10b981", 0.08), borderRadius: "12px", color: "#10b981" }}>
                <Calendar size={18} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: "11px", fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: 0.5 }}>Published On</Typography>
                <Typography sx={{ fontWeight: 600, fontSize: "15px", color: "#0f172a" }}>{getFormattedDate(blog?.createdAt)}</Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box sx={{ p: 1.2, bgcolor: alpha("#3b82f6", 0.08), borderRadius: "12px", color: "#3b82f6" }}>
                <Clock size={18} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: "11px", fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: 0.5 }}>Reading Time</Typography>
                <Typography sx={{ fontWeight: 600, fontSize: "15px", color: "#0f172a" }}>5 Min Read</Typography>
              </Box>
            </Stack>
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 380px" },
            gap: { xs: 6, lg: 8 },
            alignItems: "start"
          }}
        >
          {/* LEFT CONTENT (ARTICLE) */}
          <Box component="article" data-aos="fade-up" data-aos-delay="100">
            <Box
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: blog.description }}
              sx={{
                textAlign: "justify",
                lineHeight: 1.8,
                color: "#334155",
                fontSize: { xs: "0.95rem", md: "1.05rem" },
                overflowWrap: "break-word",
                wordBreak: "break-word",
                "& h2": {
                  fontSize: { xs: "1.5rem", md: "2rem" },
                  fontWeight: 600,
                  mb: 3,
                  mt: 6,
                  color: "#0f172a",
                  fontFamily: '"Poppins", sans-serif',
                },
                "& h3": {
                  fontSize: { xs: "1.25rem", md: "1.5rem" },
                  fontWeight: 600,
                  mb: 2,
                  mt: 4,
                  color: "#1e293b",
                  fontFamily: '"Poppins", sans-serif',
                },
                "& p": {
                  mb: 3,
                  opacity: 0.95
                },
                "& img": {
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: "20px",
                  my: 4,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
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
                  borderLeft: "6px solid #10b981",
                  pl: 4,
                  pr: 2,
                  fontStyle: "italic",
                  bgcolor: "#f1f5f9",
                  py: 4,
                  borderRadius: "0 16px 16px 0",
                  mb: 5,
                  fontSize: "1.1rem",
                  color: "#0f172a",
                  fontWeight: 500,
                  lineHeight: 1.6
                },
                "& strong": {
                  color: "#0f172a",
                  fontWeight: 600
                }
              }}
            />

            <Divider sx={{ my: 6, borderColor: '#e2e8f0' }} />

            {/* Footer Navigation */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Button
                onClick={() => navigate('/blogs')}
                startIcon={<ChevronRight style={{ transform: 'rotate(180deg)' }} size={18} />}
                sx={{
                  color: '#64748b',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '16px',
                  '&:hover': { color: '#10b981', bgcolor: 'transparent' }
                }}
              >
                Back to all articles
              </Button>
            </Stack>
          </Box>

          {/* RIGHT SIDEBAR (ENQUIRY FORM) */}
          <Box
            component="aside"
            data-aos="fade-left"
            data-aos-delay="200"
            sx={{
              position: "sticky",
              top: "100px",
              alignSelf: "flex-start"
            }}
          >
            <Card
              sx={{
                bgcolor: "#fff",
                borderRadius: "24px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.05)",
                overflow: 'visible'
              }}
            >
              <Box sx={{
                bgcolor: '#0f172a',
                color: '#fff',
                p: 4,
                borderRadius: '24px 24px 0 0',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Box sx={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, bgcolor: 'rgba(16, 185, 129, 0.2)', borderRadius: '50%', filter: 'blur(20px)' }} />
                <Typography variant="h5" fontWeight={600} sx={{ fontFamily: '"Poppins", sans-serif', mb: 1, position: 'relative', zIndex: 1, color: '#10b981' }}>
                  Quick Enquiry
                </Typography>
                <Typography variant="body2" sx={{ color: '#cbd5e1', position: 'relative', zIndex: 1 }}>
                  Get expert guidance and upskill your career today.
                </Typography>
              </Box>

              <CardContent sx={{ p: 4, pt: 5 }}>
                <form onSubmit={handleSubmit}>
                  <Stack spacing={2.5}>
                    <TextField
                      fullWidth
                      placeholder="Your Name *"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          bgcolor: 'rgba(248, 250, 252, 0.5)'
                        }
                      }}
                    />
                    <TextField
                      fullWidth
                      placeholder="Your Email Address *"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          bgcolor: 'rgba(248, 250, 252, 0.5)'
                        }
                      }}
                    />
                    <TextField
                      fullWidth
                      placeholder="Mobile Number *"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          bgcolor: 'rgba(248, 250, 252, 0.5)'
                        }
                      }}
                    />
                    <TextField
                      fullWidth
                      placeholder="Course of Interest *"
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          bgcolor: 'rgba(248, 250, 252, 0.5)'
                        }
                      }}
                    />

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField
                        fullWidth
                        placeholder="Your Location *"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            bgcolor: 'rgba(248, 250, 252, 0.5)'
                          }
                        }}
                      />
                      <TextField
                        fullWidth
                        type="time"
                        label="Preferred Call Time"
                        InputLabelProps={{ shrink: true }}
                        name="timeslot"
                        value={formData.timeslot}
                        onChange={handleChange}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            bgcolor: 'rgba(248, 250, 252, 0.5)'
                          }
                        }}
                      />
                    </Stack>

                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey="6Lc_DJAsAAAAADKYIf74PvRX5a5dUCy8GTxlxP5D"
                        onChange={(value) => setCaptchaToken(value)}
                      />
                    </Box>

                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      endIcon={<SendIcon />}
                      sx={{
                        bgcolor: '#10b981',
                        color: '#fff',
                        py: 1.8,
                        borderRadius: '12px',
                        fontWeight: 600,
                        fontSize: '16px',
                        textTransform: 'none',
                        boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)',
                        transition: 'all 0.3s ease',
                        "&:hover": {
                          bgcolor: '#059669',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 24px rgba(16, 185, 129, 0.3)',
                        }
                      }}
                    >
                      Get Started Now
                    </Button>
                  </Stack>
                </form>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>

      {/* BOTTOM SLIDER: LATEST INSIGHTS */}
      {latestPosts.length > 0 && (
        <Box sx={{ bgcolor: '#f8f9fa', py: { xs: 8, md: 10 }, mt: 8, borderTop: '1px solid #e2e8f0' }}>
          <Container maxWidth="lg">
            {/* Section Header — Knowledge Hub style */}
            <Box sx={{ textAlign: 'center', mb: 6 }} data-aos="fade-up">
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Box sx={{
                  display: 'inline-flex', alignItems: 'center', gap: 1,
                  bgcolor: 'rgba(76,175,80,0.1)', color: '#2D3748',
                  fontWeight: 800, fontSize: '0.78rem', letterSpacing: 1.2,
                  px: 2, py: 0.8, borderRadius: '20px', textTransform: 'uppercase'
                }}>
                  More Reads
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#2D3748', letterSpacing: '-0.02em' }}>
                Latest <span style={{ color: '#4CAF50' }}>Insights</span>
              </Typography>
            </Box>

            {/* Cards Slider */}
            <Box
              ref={sliderRef}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              sx={{
                display: 'flex',
                gap: '30px',
                overflowX: 'auto',
                pb: 4,
                scrollSnapType: 'x mandatory',
                alignItems: 'stretch',
                "&::-webkit-scrollbar": { display: 'none' },
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
              }}
            >
              {latestPosts.map((post, index) => (
                <Box
                  key={post.id}
                  data-aos="fade-up"
                  data-aos-delay={index * 80}
                  sx={{
                    minWidth: { xs: '280px', sm: '340px' },
                    width: { xs: '280px', sm: '340px' },
                    height: '480px',
                    flexShrink: 0,
                    scrollSnapAlign: 'start',
                  }}
                >
                  <Box
                    onClick={() => navigate(`/blogs/${post.slug}`)}
                    sx={{
                      width: '100%',
                      height: '100%',
                      bgcolor: '#ffffff',
                      borderRadius: '24px',
                      overflow: 'hidden',
                      border: '1px solid #edf2f7',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-12px)',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
                        border: '1px solid rgba(76,175,80,0.1)',
                        '& .post-image': { transform: 'scale(1.06)' },
                      },
                    }}
                  >
                    {/* Image */}
                    <Box sx={{ position: 'relative', paddingTop: '56.25%', overflow: 'hidden', bgcolor: '#f5f5f5', flexShrink: 0,
                      '&::after': { content: '""', position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.3) 100%)', pointerEvents: 'none' }
                    }}>
                      <Box
                        component="img"
                        className="post-image"
                        src={getImgUrl(post.image)}
                        alt={post.title}
                        sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1)' }}
                      />
                    </Box>

                    {/* Content */}
                    <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                      {/* Meta */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Calendar size={13} color="#4CAF50" />
                          <Typography sx={{ fontSize: '0.72rem', fontWeight: 500, color: '#718096' }}>
                            {getFormattedDate(post.createdAt)}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Title — fixed 2-line height */}
                      <Typography variant="h6" sx={{
                        fontWeight: 700, fontSize: '1.1rem', lineHeight: 1.4,
                        color: '#2D3748', mb: 1.2,
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                        overflow: 'hidden', textOverflow: 'ellipsis',
                        height: '3.08em',
                        transition: 'color 0.2s ease',
                      }}>
                        {post.title}
                      </Typography>

                      {/* Description — fixed 3-line height */}
                      <Typography variant="body2" sx={{
                        color: '#718096', fontSize: '0.83rem', lineHeight: 1.6,
                        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
                        overflow: 'hidden', textOverflow: 'ellipsis',
                        height: '3.99em', mb: 2,
                      }}>
                        {post.short_description || ''}...
                      </Typography>

                      {/* Read Article CTA */}
                      <Box sx={{ mt: 'auto', pt: 1 }}>
                        <Box sx={{
                          display: 'inline-flex', alignItems: 'center', gap: 0.8,
                          color: '#4CAF50', fontWeight: 700, fontSize: '0.9rem',
                          cursor: 'pointer', transition: 'all 0.3s ease',
                          '&:hover': { opacity: 0.8, '& .arrow': { transform: 'translateX(5px)' } },
                        }}
                          onClick={() => navigate(`/blogs/${post.slug}`)}
                        >
                          Read Article
                          <Box className="arrow" component="span" sx={{ display: 'inline-flex', transition: 'transform 0.3s ease', fontSize: '18px', ml: '2px' }}>→</Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>
      )}
    </Box>
  );
}