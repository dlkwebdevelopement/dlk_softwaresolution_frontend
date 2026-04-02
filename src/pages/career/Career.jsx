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
      title: "Build Your Future with",
      highlighted: "Real-Time Industry Experience",
      subtitle: "DLK Software Solutions Careers",
      description:
        "Industry-focused internship and placement training programs designed for students and fresh graduates who want to build a successful career in the IT industry.",
    },

    whatWeOffer: [
      {
        title: "Placement Assistance",
        description:
          "Resume building, interview training and job referrals.",
        icon: <Target />,
      },
      {
        title: "Internship Opportunities",
        description:
          "Real-time internship experience with live project exposure.",
        icon: <Briefcase />,
      },
      {
        title: "Internship Certificate",
        description:
          "Recognized certificate validating your industry experience.",
        icon: <Award />,
      },
      {
        title: "Real-Time Projects",
        description:
          "Work on actual projects simulating real client requirements.",
        icon: <Code />,
      },
      {
        title: "Industry-Level Training",
        description:
          "Training based on modern technologies and tools.",
        icon: <Zap />,
      },
    ],

    whatYouGain: [
      {
        title: "Real-Time Experience",
        description:
          "Work on live projects reflecting industry workflows.",
        icon: <Globe />,
      },
      {
        title: "Industry Exposure",
        description:
          "Understand real IT company operations and delivery process.",
        icon: <Users />,
      },
      {
        title: "Hands-on Training",
        description:
          "Practical sessions guided by experienced mentors.",
        icon: <Rocket />,
      },
      {
        title: "Portfolio Development",
        description:
          "Build a portfolio to showcase your skills to employers.",
        icon: <Layers />,
      },
      {
        title: "Flexible Learning",
        description:
          "Online and offline learning options available.",
        icon: <Monitor />,
      },
    ],

    whoCanApply: [
      "UG & PG Students",
      "Non-IT Students",
      "Career Switchers",
      "Fresh Graduates",
      "Anyone interested in IT",
    ],
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
        },
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Avatar
          sx={{
            bgcolor: alpha(colors.primary, 0.15),
            color: colors.primary,
            mb: 2,
          }}
        >
          {item.icon}
        </Avatar>

        <Typography fontWeight={700} mb={1}>
          {item.title}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {item.description}
        </Typography>
      </CardContent>
    </Card>
  );

  const GainItem = ({ item }) => (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        p: 2,
        bgcolor: colors.light,
        borderRadius: "14px",
      }}
    >
      <Avatar sx={{ bgcolor: alpha(colors.primary, 0.1), color: colors.primary }}>
        {item.icon}
      </Avatar>

      <Box>
        <Typography fontWeight={700}>{item.title}</Typography>

        <Typography variant="body2" color="text.secondary">
          {item.description}
        </Typography>
      </Box>
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
  }) => (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: bgColor }}>
      <Container maxWidth="lg">
        <Grid
          container
          spacing={{ xs: 3, md: 6 }}
          alignItems="center"
          direction={{
            xs: "column",
            md: imageSide === "left" ? "row" : "row-reverse",
          }}
        >
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={image}
              alt={title}
              sx={{
                width: "100%",
                height: { xs: 220, md: 380 },
                objectFit: "cover",
                borderRadius: "16px",
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography
              sx={{
                fontSize: { xs: "1.6rem", md: "2.1rem" },
                fontWeight: 800,
                mb: 2,
                color: textColor || colors.dark,
              }}
            >
              {title}
            </Typography>

            <Typography
              sx={{
                mb: 3,
                color: textColor || "text.secondary",
              }}
            >
              {description}
            </Typography>

            {points &&
              points.map((p, i) => (
                <Box key={i} sx={{ display: "flex", gap: 1, mb: 1 }}>
                  <CheckCircle size={18} color={colors.primary} />
                  <Typography variant="body2" sx={{ color: textColor || "text.primary" }}>
                    {p}
                  </Typography>
                </Box>
              ))}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );

  return (
    <Box sx={{ overflowX: "hidden", bgcolor: colors.accent }}>
      {/* HERO */}

      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: `linear-gradient(135deg,#111827,#059669)`,
          color: "white",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip 
                label={sections.hero.subtitle} 
                variant="outlined"
                sx={{ 
                  mb: 2, 
                  color: "white", 
                  borderColor: "rgba(255,255,255,0.3)",
                  fontSize: "0.9rem",
                  fontWeight: 600
                }} 
              />

              <Typography
                sx={{
                  fontSize: { xs: "2rem", md: "3rem" },
                  fontWeight: 800,
                }}
              >
                {sections.hero.title}
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: "2rem", md: "3rem" },
                  fontWeight: 800,
                  color: colors.secondary,
                }}
              >
                {sections.hero.highlighted}
              </Typography>

              <Typography sx={{ mt: 2, mb: 4 }}>
                {sections.hero.description}
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  variant="contained"
                  onClick={() => navigate("/contact")}
                >
                  Apply Now
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => navigate("/contact")}
                  sx={{ color: "white", borderColor: "white" }}
                >
                  Book Free Demo
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* BRIDGE GAP */}

      <ImageContentRow
        image="https://images.unsplash.com/photo-1521737711867-e3b97375f902"
        title="Bridge Academic & Industry Gap"
        description="We collaborate with institutions to prepare students for real IT careers."
        points={[
          "Industry aligned curriculum",
          "Real project exposure",
          "Expert mentorship",
        ]}
        bgColor={colors.light}
      />

      {/* WHAT WE OFFER */}

      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: colors.light }}>
        <Container maxWidth="lg">
          <Typography
            textAlign="center"
            fontWeight={800}
            mb={6}
            sx={{ fontSize: { xs: "1.6rem", md: "2.2rem" } }}
          >
            What We Offer
          </Typography>

          <Grid container spacing={{ xs: 2, md: 4 }}>
            {sections.whatWeOffer.map((item, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <FeatureCard item={item} idx={i} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* WHAT YOU GAIN */}

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography
          textAlign="center"
          fontWeight={800}
          mb={6}
          sx={{ fontSize: { xs: "1.6rem", md: "2.2rem" } }}
        >
          What You Will Gain
        </Typography>

        <Grid container spacing={3}>
          {sections.whatYouGain.map((item, i) => (
            <Grid item xs={12} md={6} key={i}>
              <GainItem item={item} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* WHO CAN APPLY */}

      <ImageContentRow
        image="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4"
        title="Who Can Apply"
        description="Anyone interested in starting an IT career can apply."
        points={sections.whoCanApply}
        imageSide="right"
        bgColor="#111827"
        textColor="#fff"
      />

      {/* CTA */}

      <Box
        sx={{
          py: { xs: 8, md: 10 },
          textAlign: "center",
          background: colors.primary,
          color: "white",
        }}
      >
        <Container maxWidth="md">
          <Typography
            fontWeight={800}
            sx={{ fontSize: { xs: "1.7rem", md: "2.4rem" } }}
          >
            Start Your IT Career Today
          </Typography>

          <Stack
            mt={4}
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="contained"
              sx={{ bgcolor: "white", color: colors.primary }}
              onClick={() => navigate("/contact")}
            >
              Apply Now
            </Button>

            <Button
              variant="outlined"
              sx={{ color: "white", borderColor: "white" }}
              onClick={() => navigate("/contact")}
            >
              Book Free Demo
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Career;