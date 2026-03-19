import React, { useEffect, useState, useRef } from "react";
import { 
  Box, 
  Typography, 
  Stack, 
  Divider,
  Container,
  Button,
  TextField,
  alpha,
  MenuItem,
  Card,
  CardContent,
  Avatar,
  Fade,
  Grow
} from "@mui/material";
import { 
  Calendar, 
  ChevronRight, 
  TrendingUp, 
  School, 
  Phone, 
  Mail, 
  User
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { GetRequest, PostRequest } from "../../api/config";
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
  const [cats, setCats] = useState([]);

  // Auto-scroll logic array
  useEffect(() => {
    let intervalId;
    if (!isHovered && sliderRef.current && latestPosts.length > 0) {
      intervalId = setInterval(() => {
        const slider = sliderRef.current;
        if (slider) {
          if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10) {
             // Reset back to start if we reached the end
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
        setLatestPosts(posts.filter(p => p.slug !== slug).slice(0, 10)); // don't show current post
      } catch (err) {
        console.error("Error fetching latest posts:", err);
      }
    };
    fetchLatestPosts();
  }, [slug]);

  // No longer fetching categories for the Quick Enquiry form as it uses a text field.
  // Fetching categories removed as Quick Enquiry uses text input for course.



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

    try {
      const data = await PostRequest(ADMIN_POST_ENQUIRIES, formData);
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
      } else {
        toast.error(data.message || "Submission failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  // Removed scrollSlider function as navigation buttons are removed.
  // const scrollSlider = (direction) => {
  //   if (sliderRef.current) {
  //     const scrollAmount = direction === "left" ? -350 : 350;
  //     sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  //   }
  // };

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
    <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh", pb: 10 }}>
      <Container maxWidth="lg" sx={{ mt: 8, position: 'relative', zIndex: 10 }}>
        
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 380px" },
            gap: { xs: 6, lg: 8 },
            alignItems: "start"
          }}
        >           {/* LEFT CONTENT (ARTICLE) */}
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
                  fontWeight: 800, 
                  mb: 3, 
                  mt: 6, 
                  color: "#0f172a",
                  fontFamily: '"Bricolage Grotesque", sans-serif',
                },
                "& h3": { 
                  fontSize: { xs: "1.25rem", md: "1.5rem" }, 
                  fontWeight: 700, 
                  mb: 2, 
                  mt: 4, 
                  color: "#1e293b",
                  fontFamily: '"Bricolage Grotesque", sans-serif',
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
                  fontWeight: 700
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
                <Typography variant="h5" fontWeight={800} sx={{ fontFamily: '"Bricolage Grotesque", sans-serif', mb: 1, position: 'relative', zIndex: 1,color: 'green' }}>
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
                        fontWeight: 700,
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
        <Box sx={{ bgcolor: '#fff', py: { xs: 8, md: 10 }, mt: 8, borderTop: '1px solid #e2e8f0' }}>
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 6 }} data-aos="fade-up">
              <Box>
                <Typography sx={{ color: '#10b981', fontWeight: 800, fontSize: '14px', letterSpacing: 1.5, textTransform: 'uppercase', mb: 1 }}>
                  More Reads
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#0f172a', fontFamily: '"Bricolage Grotesque", sans-serif' }}>
                  Latest Insights
                </Typography>
              </Box>
            </Box>

            <Box 
              ref={sliderRef}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              sx={{ 
                display: 'flex', 
                gap: 4, 
                overflowX: 'auto', 
                pb: 4,
                scrollSnapType: 'x mandatory',
                "&::-webkit-scrollbar": { display: 'none' },
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
              }}
            >
              {latestPosts.map((post, index) => (
                <Card 
                  key={post.id}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  onClick={() => navigate(`/blogs/${post.slug}`)}
                  sx={{ 
                    minWidth: { xs: 280, md: 340 },
                    scrollSnapAlign: 'start',
                    borderRadius: '20px',
                    border: '1px solid #e2e8f0',
                    boxShadow: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    "&:hover": {
                      boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
                      transform: 'translateY(-6px)',
                      "& .thumb": { transform: 'scale(1.05)' },
                      "& .title": { color: '#10b981' }
                    }
                  }}
                >
                  <Box sx={{ width: '100%', height: 200, overflow: 'hidden' }}>
                    <Box 
                      component="img"
                      className="thumb"
                      src={getImgUrl(post.image)}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                    />
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary', mb: 1.5 }}>
                      <Calendar size={14} />
                      <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>{getFormattedDate(post.createdAt)}</Typography>
                    </Stack>
                    <Typography 
                      className="title"
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700, 
                        lineHeight: 1.4,
                        mb: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        transition: 'color 0.2s'
                      }}
                    >
                      {post.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#64748b',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {post.short_description}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Container>
        </Box>
      )}
    </Box>
  );
}
