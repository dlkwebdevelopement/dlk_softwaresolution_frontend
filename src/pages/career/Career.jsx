import React, { useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  Stack,
  alpha,
  useTheme,
  useMediaQuery,
  Divider,
  Paper,
} from "@mui/material";

import {
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Globe,
  Rocket,
  CheckCircle,
  Target,
  Zap,
  Users,
  BookOpen,
  Search,
  Layers,
  Monitor,
  Clock,
  TrendingUp,
  Heart,
  Eye,
  Flag,
} from "lucide-react";

import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";

const Career = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
    });
  }, []);

  const colors = {
    primary: "#10B981",
    primaryDark: "#059669",
    secondary: "#F59E0B",
    dark: "#111827",
    light: "#FFFFFF",
    accent: "#F3F4F6",
  };

  const sections = {
    hero: {
      title: "Careers at DLK Software Solutions",
      highlighted: "Build Your Future with Real-Time Industry Experience",
      description:
        "DLK Software Solutions offers industry-focused internship and placement training programs designed for students and fresh graduates who want to build a successful career in the IT industry. Our programs provide real-time project experience, hands-on training, and placement assistance to help you become job-ready.",
      collaboration:
        "We collaborate with colleges and institutions through guest lectures, MOUs, internships, and placement training programs to bridge the gap between academic learning and industry requirements.",
    },

    whatWeOffer: [
      {
        title: "Placement Assistance",
        description:
          "We provide dedicated placement support to help you start your career with confidence. Our team assists you with resume building, interview preparation, and connecting you with suitable job opportunities to increase your chances of getting placed in the IT industry.",
        icon: <Target />,
      },
      {
        title: "Internship Opportunities",
        description:
          "Gain valuable experience through our structured internship programs designed to give you real-time exposure. You will work on live projects, collaborate with a team, and understand how professional environments operate.",
        icon: <Briefcase />,
      },
      {
        title: "Internship Certificate",
        description:
          "Upon successful completion of the internship, you will receive a recognized certificate that validates your skills and experience. This certificate adds value to your profile and strengthens your job applications.",
        icon: <Award />,
      },
      {
        title: "Real-Time Project Experience",
        description:
          "Work on actual projects that simulate real client requirements and industry scenarios. This experience helps you understand project workflows, improve problem-solving skills, and build confidence to handle real-world tasks.",
        icon: <Code />,
      },
      {
        title: "Industry-Level Training",
        description:
          "Our training is designed to match current industry standards, ensuring you learn the latest tools, technologies, and best practices. With guidance from experienced professionals, you will be prepared to meet real job expectations.",
        icon: <Zap />,
      },
    ],

    whatYouGain: [
      {
        title: "Real-Time Experience",
        description:
          "Work on live projects that reflect real industry requirements, allowing you to understand how actual workflows, deadlines, and client expectations are managed. This hands-on exposure helps you gain confidence and prepares you to handle real-world challenges effectively.",
        icon: <Globe />,
      },
      {
        title: "Industry Exposure",
        description:
          "Get a clear understanding of how companies operate in the IT industry, including project execution, team collaboration, and delivery processes. This exposure helps you align your skills with industry standards and expectations.",
        icon: <Users />,
      },
      {
        title: "Hands-on Training",
        description:
          "Learn by doing through practical sessions guided by experienced mentors. Instead of focusing only on theory, you will actively work on tasks, solve real problems, and develop strong technical skills that are directly applicable in the industry.",
        icon: <Rocket />,
      },
      {
        title: "Portfolio Development",
        description:
          "Create a professional portfolio by working on real-time projects that showcase your skills and experience. This portfolio will help you stand out during job applications and demonstrate your capabilities to potential employers.",
        icon: <Layers />,
      },
      {
        title: "Flexible Learning",
        description:
          "Enjoy the flexibility of choosing between offline and online training modes based on your convenience. Our structured approach ensures you receive the same quality learning experience in both formats.",
        icon: <Monitor />,
      },
    ],

    whoCanApply: [
      { title: "UG & PG Students", subtitle: "(All Streams)", icon: <GraduationCap size={20} /> },
      { title: "Non-IT Students", subtitle: "who want to start a career in IT", icon: <Code size={20} /> },
      { title: "Career Switchers", subtitle: "looking to move into the IT industry", icon: <TrendingUp size={20} /> },
      { title: "Fresh Graduates", subtitle: "seeking practical experience", icon: <BookOpen size={20} /> },
      { title: "Anyone passionate", subtitle: "about learning technology", icon: <Heart size={20} /> },
    ],

    trainingTimeline: [
      {
        title: "Basic Concepts & Foundations",
        description:
          "We start with strong fundamentals to ensure every student, regardless of background, understands the core concepts. This phase focuses on building a solid base in technology, programming basics, and essential tools required for further learning.",
        icon: <BookOpen />,
      },
      {
        title: "Advanced Technical Training",
        description:
          "Once the basics are clear, we move into advanced topics that align with current industry standards. You will learn modern technologies, frameworks, and best practices that are highly demanded in the IT industry.",
        icon: <TrendingUp />,
      },
      {
        title: "Real-Time Project Work",
        description:
          "In this phase, you will work on live projects that simulate real client requirements. This helps you understand project workflows, teamwork, deadlines, and problem-solving in a real-world environment.",
        icon: <Code />,
      },
      {
        title: "Internship & Evaluation",
        description:
          "You will undergo a structured internship where your performance is evaluated based on your work, skills, and understanding. This phase helps you gain confidence and prepares you for professional job roles.",
        icon: <Award />,
      },
      {
        title: "Placement Support",
        description:
          "After completing the training and internship, we provide complete placement assistance including resume building, interview preparation, and job referrals to help you secure opportunities in the IT industry.",
        icon: <Target />,
      },
    ],

    whyChoose: [
      {
        title: "Real-Time Working Environment",
        description:
          "At DLK Software Solutions, you will not just learn — you will work in a real-time environment that reflects actual industry conditions. You will be involved in live projects, team collaboration, and real workflows, helping you gain practical experience and confidence to handle real job responsibilities.",
        icon: <Briefcase />,
      },
      {
        title: "Industry-Level Mentorship",
        description:
          "Learn directly from experienced professionals who understand current industry trends and requirements. Our mentors guide you throughout your journey, helping you improve your technical skills, solve challenges, and prepare for real-world scenarios.",
        icon: <Users />,
      },
      {
        title: "Career-Focused Training",
        description:
          "Our training programs are designed with a clear focus on your career growth. We teach what is actually required in the industry, ensuring you gain relevant skills that make you job-ready from day one.",
        icon: <Target />,
      },
      {
        title: "Strong Placement Support",
        description:
          "We provide complete placement assistance, including resume preparation, interview training, and job referrals. Our goal is to help you secure the right opportunity and successfully start your career in the IT industry.",
        icon: <Rocket />,
      },
    ],

    visionMission: {
      vision: {
        title: "Our Vision",
        description:
          "Our vision is to become a leading platform that transforms aspiring individuals into industry-ready professionals by providing real-time experience, practical knowledge, and career-focused training. We aim to bridge the gap between academic learning and industry requirements, empowering students from all backgrounds to build successful careers in the IT field.",
        icon: <Eye size={32} />,
      },
      mission: {
        title: "Our Mission",
        description:
          "Our mission is to deliver high-quality, hands-on training combined with real-time project experience that prepares individuals for the demands of the modern IT industry. We are committed to providing mentorship, internship opportunities, and placement support while creating an environment where learners can work on live projects, gain industry exposure, and develop the skills needed to succeed in their careers.",
        icon: <Flag size={32} />,
      },
    },
  };

  const FeatureCard = ({ item, idx }) => (
    <Card
      data-aos="fade-up"
      data-aos-delay={idx * 100}
      sx={{
        height: "100%",
        borderRadius: "20px",
        transition: "0.3s",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Avatar
          sx={{
            bgcolor: alpha(colors.primary, 0.15),
            color: colors.primary,
            mb: 2,
            width: 48,
            height: 48,
          }}
        >
          {item.icon}
        </Avatar>

        <Typography variant="h6" fontWeight={700} mb={1}>
          {item.title}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {item.description}
        </Typography>
      </CardContent>
    </Card>
  );

  const GainItem = ({ item }) => (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        gap: 2,
        p: 2,
        bgcolor: alpha(colors.primary, 0.04),
        borderRadius: "16px",
        height: "100%",
        transition: "0.3s",
        "&:hover": {
          bgcolor: alpha(colors.primary, 0.08),
        },
      }}
    >
      <Avatar sx={{ bgcolor: alpha(colors.primary, 0.1), color: colors.primary, width: 48, height: 48 }}>
        {item.icon}
      </Avatar>

      <Box>
        <Typography variant="h6" fontWeight={700} mb={0.5}>
          {item.title}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {item.description}
        </Typography>
      </Box>
    </Paper>
  );

  const TimelineCard = ({ item, idx }) => (
    <Box
      data-aos="fade-up"
      data-aos-delay={idx * 100}
      sx={{
        display: "flex",
        gap: 2,
        position: "relative",
        pb: idx !== sections.trainingTimeline.length - 1 ? 3 : 0,
      }}
    >
      {idx !== sections.trainingTimeline.length - 1 && (
        <Box
          sx={{
            position: "absolute",
            left: 23,
            top: 50,
            bottom: 0,
            width: 2,
            bgcolor: alpha(colors.primary, 0.2),
          }}
        />
      )}
      <Avatar
        sx={{
          bgcolor: colors.primary,
          color: "white",
          width: 48,
          height: 48,
          zIndex: 1,
        }}
      >
        {item.icon}
      </Avatar>
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          p: 2.5,
          bgcolor: colors.light,
          borderRadius: "16px",
          border: `1px solid ${alpha(colors.primary, 0.1)}`,
        }}
      >
        <Typography variant="h6" fontWeight={700} mb={1}>
          {item.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {item.description}
        </Typography>
      </Paper>
    </Box>
  );

  const ImageContentRow = ({
    image,
    title,
    description,
    points,
    imageSide = "left",
    bgColor = "transparent",
    textColor,
  }) => {
    const ImageBlock = (
      <Box sx={{ flex: 1, width: "100%", maxWidth: { md: "50%" } }}>
        <Box
          component="img"
          src={image}
          alt={title}
          sx={{
            width: "100%",
            height: { xs: 240, md: 360 },
            objectFit: "cover",
            borderRadius: "24px",
            boxShadow: theme.shadows[4],
          }}
        />
      </Box>
    );

    const ContentBlock = (
      <Box sx={{ flex: 1, width: "100%", maxWidth: { md: "50%" } }}>
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: "1.8rem", md: "2.2rem" },
            fontWeight: 800,
            mb: 2,
            color: textColor || colors.dark,
          }}
        >
          {title}
        </Typography>

        <Typography
          component="div"
          sx={{
            mb: 3,
            color: textColor || "text.secondary",
            lineHeight: 1.6,
          }}
          dangerouslySetInnerHTML={{ __html: description }}
        />

        {points &&
          points.map((p, i) => (
            <Box key={i} sx={{ display: "flex", gap: 2, alignItems: "center", mb: 1.5 }}>
              {typeof p !== 'string' && p.icon ? (
                <Avatar
                  sx={{
                    bgcolor: alpha(colors.primary, 0.15),
                    color: colors.primary,
                    width: 36,
                    height: 36,
                  }}
                >
                  {p.icon}
                </Avatar>
              ) : (
                <CheckCircle size={20} color={colors.primary} />
              )}
              <Typography variant="body1" sx={{ color: textColor || "text.primary" }}>
                {typeof p === 'string' ? p : p.title}{" "}
                {typeof p !== 'string' && p.subtitle && (
                  <span style={{ color: alpha(textColor || colors.dark, 0.7) }}>
                    {p.subtitle}
                  </span>
                )}
              </Typography>
            </Box>
          ))}
      </Box>
    );

    return (
      <Box sx={{ py: { xs: 4, md: 6 }, bgcolor: bgColor }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              gap: { xs: 5, md: 8 },
            }}
          >
            {imageSide === "left" ? (
              <>
                {ImageBlock}
                {ContentBlock}
              </>
            ) : (
              <>
                {ContentBlock}
                {ImageBlock}
              </>
            )}
          </Box>
        </Container>
      </Box>
    );
  };

  return (
    <Box sx={{ overflowX: "hidden", bgcolor: colors.accent }}>
      {/* HERO SECTION */}
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          background: `linear-gradient(135deg, ${colors.dark}, ${colors.primaryDark})`,
          color: "white",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Chip
                label="DLK Software Solutions"
                variant="outlined"
                sx={{
                  mb: 3,
                  color: "white",
                  borderColor: "rgba(255,255,255,0.3)",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  borderRadius: "30px",
                  px: 1,
                }}
              />

              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2rem", md: "3.2rem" },
                  fontWeight: 800,
                  color: "white",
                  mb: 1,
                }}
              >
                {sections.hero.title}
              </Typography>

              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "1.8rem", md: "2.8rem" },
                  fontWeight: 800,
                  color: colors.secondary,
                  mb: 2,
                }}
              >
                {sections.hero.highlighted}
              </Typography>

              <Typography sx={{ mt: 2, mb: 3, lineHeight: 1.6 }}>
                {sections.hero.description}
              </Typography>

              <Typography
                sx={{
                  mb: 4,
                  p: 2,
                  bgcolor: alpha(colors.light, 0.1),
                  borderRadius: "12px",
                  borderLeft: `4px solid ${colors.secondary}`,
                }}
              >
                {sections.hero.collaboration}
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/contact")}
                  sx={{
                    bgcolor: colors.secondary,
                    "&:hover": { bgcolor: "#D97706" },
                    px: 4,
                    py: 1.2,
                    fontSize: "1rem",
                  }}
                >
                  Apply Now
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate("/contact")}
                  sx={{
                    color: "white",
                    borderColor: "white",
                    px: 4,
                    py: 1.2,
                    fontSize: "1rem",
                    "&:hover": { borderColor: colors.secondary, color: colors.secondary },
                  }}
                >
                  Book Free Demo
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* BRIDGE ACADEMIC & INDUSTRY GAP */}
      <ImageContentRow
        image="https://images.unsplash.com/photo-1521737711867-e3b97375f902"
        title="Bridge Academic & Industry Gap"
        description="We collaborate with institutions to prepare students <br> for real IT careers through guest lectures, MOUs, internships, and placement training programs."
        points={[
          "Industry aligned curriculum",
          "Real project exposure",
          "Expert mentorship",
          "Live client interactions",
        ]}
        bgColor={colors.light}
        imageSide="right"
      />

      {/* WHAT WE OFFER */}
      <Box sx={{ py: { xs: 5, md: 8 }, bgcolor: colors.light }}>
        <Container maxWidth="lg">
          <Typography
            textAlign="center"
            variant="h3"
            fontWeight={800}
            mb={1}
            sx={{ fontSize: { xs: "1.8rem", md: "2.5rem" } }}
          >
            What We Offer
          </Typography>
          <Typography
            textAlign="center"
            color="text.secondary"
            mb={5}
            sx={{ maxWidth: "700px", mx: "auto" }}
          >
            Comprehensive programs designed to make you industry-ready
          </Typography>

          <Grid container spacing={{ xs: 2, md: 3 }}>
            {sections.whatWeOffer.map((item, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <FeatureCard item={item} idx={i} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* WHAT YOU GAIN */}
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
        <Typography
          textAlign="center"
          variant="h3"
          fontWeight={800}
          mb={1}
          sx={{ fontSize: { xs: "1.8rem", md: "2.5rem" } }}
        >
          What You Will Gain
        </Typography>
        <Typography
          textAlign="center"
          color="text.secondary"
          mb={5}
          sx={{ maxWidth: "700px", mx: "auto" }}
        >
          Skills and experience that set you apart in the job market
        </Typography>

        <Grid container spacing={3}>
          {sections.whatYouGain.map((item, i) => (
            <Grid item xs={12} md={6} key={i}>
              <GainItem item={item} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* WHO CAN APPLY - REVERTED TO COMPONENT (BUG FIXED) */}
      <ImageContentRow
        image="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4"
        title="Who Can Apply"
        description="This program is open to anyone who has an interest in the IT field, not just IT students.<br>No prior coding knowledge required — we train you from basics to advanced level."
        points={sections.whoCanApply}
        imageSide="right"
        bgColor="#111827"
        textColor="#fff"
      />

      {/* TRAINING TIMELINE */}
      <Box sx={{ py: { xs: 5, md: 8 }, bgcolor: colors.light }}>
        <Container maxWidth="lg">
          <Typography
            textAlign="center"
            variant="h3"
            fontWeight={800}
            mb={1}
            sx={{ fontSize: { xs: "1.8rem", md: "2.5rem" } }}
          >
            Our Training Timeline
          </Typography>
          <Typography
            textAlign="center"
            color="text.secondary"
            mb={5}
            sx={{ maxWidth: "700px", mx: "auto" }}
          >
            A structured journey from fundamentals to job placement
          </Typography>

          <Grid container justifyContent="center">
            <Grid item xs={12} md={10}>
              {sections.trainingTimeline.map((item, i) => (
                <TimelineCard key={i} item={item} idx={i} />
              ))}
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* OUR APPROACH - REAL WORKING ENVIRONMENT */}
      <Box sx={{ py: { xs: 5, md: 8 }, bgcolor: alpha(colors.primary, 0.04) }}>
        <Container maxWidth="lg">
          <Typography
            textAlign="center"
            variant="h3"
            fontWeight={800}
            mb={3}
            sx={{ fontSize: { xs: "1.8rem", md: "2.5rem" } }}
          >
            Our Approach
          </Typography>
          <Typography
            textAlign="center"
            color="text.secondary"
            mb={4}
            sx={{ maxWidth: "800px", mx: "auto", fontSize: "1.1rem" }}
          >
            At DLK Software Solutions, we go beyond traditional training by providing a real-time,
            industry-focused learning experience. We don't just offer opportunities — we ensure that
            you actively work on live projects and gain practical exposure to real-world scenarios.
          </Typography>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              bgcolor: colors.light,
              borderRadius: "24px",
              textAlign: "center",
              maxWidth: "900px",
              mx: "auto",
            }}
          >
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              This is not just a training program. You will collaborate with our team, understand real
              client requirements, and develop solutions in a professional working environment. Our
              approach helps you build confidence, improve problem-solving skills, and gain the
              industry-level experience required to succeed in your IT career.
            </Typography>
          </Paper>
        </Container>
      </Box>

      {/* WHY CHOOSE DLK */}
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
        <Typography
          textAlign="center"
          variant="h3"
          fontWeight={800}
          mb={1}
          sx={{ fontSize: { xs: "1.8rem", md: "2.5rem" } }}
        >
          Why Choose DLK Software Solutions
        </Typography>
        <Typography
          textAlign="center"
          color="text.secondary"
          mb={5}
          sx={{ maxWidth: "700px", mx: "auto" }}
        >
          We focus on delivering practical skills, real experience, and job opportunities
        </Typography>

        <Grid container spacing={3}>
          {sections.whyChoose.map((item, i) => (
            <Grid item xs={12} md={6} key={i}>
              <Paper
                data-aos="fade-up"
                data-aos-delay={i * 100}
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: "20px",
                  border: `1px solid ${alpha(colors.primary, 0.1)}`,
                  transition: "0.3s",
                  "&:hover": {
                    boxShadow: theme.shadows[3],
                    borderColor: alpha(colors.primary, 0.3),
                  },
                }}
              >
                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: colors.primary, color: "white", width: 56, height: 56 }}>
                    {item.icon}
                  </Avatar>
                  <Typography variant="h6" fontWeight={700} sx={{ alignSelf: "center" }}>
                    {item.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ pl: 1 }}>
                  {item.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* VISION & MISSION */}
      <Box sx={{ py: { xs: 5, md: 8 }, bgcolor: alpha(colors.dark, 0.95), color: "white" }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper
                data-aos="fade-right"
                elevation={0}
                sx={{
                  p: 4,
                  bgcolor: alpha(colors.light, 0.08),
                  borderRadius: "24px",
                  height: "100%",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                  <Box sx={{ color: colors.secondary }}>{sections.visionMission.vision.icon}</Box>
                  <Typography variant="h4" fontWeight={700} color={colors.secondary}>
                    {sections.visionMission.vision.title}
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ lineHeight: 1.7, color: alpha(colors.light, 0.9) }}>
                  {sections.visionMission.vision.description}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                data-aos="fade-left"
                elevation={0}
                sx={{
                  p: 4,
                  bgcolor: alpha(colors.light, 0.08),
                  borderRadius: "24px",
                  height: "100%",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                  <Box sx={{ color: colors.secondary }}>{sections.visionMission.mission.icon}</Box>
                  <Typography variant="h4" fontWeight={700} color={colors.secondary}>
                    {sections.visionMission.mission.title}
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ lineHeight: 1.7, color: alpha(colors.light, 0.9) }}>
                  {sections.visionMission.mission.description}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* FINAL CTA */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          textAlign: "center",
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
          color: "white",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            fontWeight={800}
            sx={{ fontSize: { xs: "1.8rem", md: "2.5rem" }, mb: 2 }}
          >
            Start Your IT Career Today
          </Typography>

          <Typography sx={{ mb: 4, opacity: 0.95 }}>
            Take the first step towards your future with DLK Software Solutions. Join our internship and
            placement training program and gain the skills needed to succeed in the IT industry.
          </Typography>

          <Stack
            mt={2}
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: "white",
                color: colors.primary,
                px: 4,
                py: 1.2,
                fontSize: "1rem",
                fontWeight: 700,
                "&:hover": { bgcolor: alpha(colors.light, 0.9) },
              }}
              onClick={() => navigate("/contact")}
            >
              👉 Apply Now
            </Button>

            <Button
              variant="outlined"
              size="large"
              sx={{
                color: "white",
                borderColor: "white",
                px: 4,
                py: 1.2,
                fontSize: "1rem",
                "&:hover": { bgcolor: alpha(colors.light, 0.1), borderColor: "white" },
              }}
              onClick={() => navigate("/contact")}
            >
              👉 Book a Free Demo
            </Button>

            <Button
              variant="text"
              size="large"
              sx={{
                color: "white",
                px: 4,
                py: 1.2,
                fontSize: "1rem",
                "&:hover": { bgcolor: alpha(colors.light, 0.1) },
              }}
              onClick={() => navigate("/contact")}
            >
              👉 Contact Us Today
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Career;
