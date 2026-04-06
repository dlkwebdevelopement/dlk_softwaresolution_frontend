import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  Skeleton,
  useTheme,
  alpha,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { GetRequest } from "../../api/config";
import { GET_ALL_PLACEMENTS } from "../../api/endpoints";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import BottomInfo from "../../components/BottomInfo";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SchoolIcon from "@mui/icons-material/School";

const Placement = () => {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchPlacements = async () => {
      try {
        setLoading(true);
        const data = await GetRequest(GET_ALL_PLACEMENTS);
        setPlacements(data?.filter((p) => p.isActive) || []);
      } catch (err) {
        console.error("Failed to fetch placements:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlacements();
  }, []);

  return (
    <>
      <Navbar />

      <Box sx={{ mt: { xs: 10, md: 12 }, minHeight: "80vh", pb: 8 }}>

        {/* HERO SECTION */}
        <Box
          sx={{
            background: `linear-gradient(135deg, #1a4718 0%, #3DB843 100%)`,
            py: { xs: 5, md: 8 },
            mb: 4,
            color: "white",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="h3" fontWeight={900} color="white" gutterBottom>
              Our Success Stories
            </Typography>

          </Container>

          <EmojiEventsIcon
            sx={{
              position: "absolute",
              top: -20,
              right: -20,
              fontSize: 160,
              opacity: 0.1,
              transform: "rotate(15deg)",
            }}
          />

          <SchoolIcon
            sx={{
              position: "absolute",
              bottom: -20,
              left: -20,
              fontSize: 140,
              opacity: 0.1,
              transform: "rotate(-15deg)",
            }}
          />
        </Box>

        <Container maxWidth="xl">

          {/* BREADCRUMBS */}
          <Breadcrumbs sx={{ mb: 3 }} color="text.secondary">
            <Link underline="hover" color="inherit" href="/">
              Home
            </Link>
            <Typography color="primary" fontWeight={600}>
              Placements
            </Typography>
          </Breadcrumbs>

          {/* PLACEMENT GRID */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2,1fr)",
                md: "repeat(3,1fr)",
              },
              gap: 2,
            }}
          >
            {loading
              ? Array.from(new Array(6)).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  sx={{ borderRadius: "14px", height: "340px" }}
                />
              ))
              : placements.length > 0
                ? placements.map((placement) => (
                  <Card
                    key={placement.id}
                    sx={{
                      borderRadius: "14px",
                      overflow: "hidden",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: "0 18px 40px rgba(0,0,0,0.15)",
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={placement.photoUrl}
                      alt="Placement Achievement"
                      sx={{
                        width: "100%",
                        height: "450px",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </Card>
                ))
                : (
                  <Box
                    sx={{
                      gridColumn: "span 3",
                      textAlign: "center",
                      py: 8,
                    }}
                  >
                    <EmojiEventsIcon
                      sx={{
                        fontSize: 70,
                        color: alpha(theme.palette.primary.main, 0.2),
                        mb: 2,
                      }}
                    />

                    <Typography
                      variant="h5"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      Achievements Coming Soon!
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      Our students are busy building their careers. Stay tuned for
                      their success stories.
                    </Typography>
                  </Box>
                )}
          </Box>
        </Container>
      </Box>

      <BottomInfo />
      <Footer />
    </>
  );
};

export default Placement;