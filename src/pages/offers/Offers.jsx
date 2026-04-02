import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  Stack,
  Fade,
  CircularProgress,
  alpha,
  useTheme,
  Button,
} from "@mui/material";
import { LocalOffer as TagIcon, ShoppingBag, ArrowRight } from "@mui/icons-material";
import { GetRequest } from "../../api/config";
import { GET_ALL_OFFERS } from "../../api/endpoints";
import { useNavigate } from "react-router-dom";
import QuickEnquiryModal from "../../components/QuickEnquiryModal";

export default function Offers() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState("");

  const colors = {
    primary: "#3DB843",
    secondary: "#D3F36B",
    dark: "#1a4718",
    accent: "#fbfdf3",
  };

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await GetRequest(GET_ALL_OFFERS);
      setOffers(res || []);
    } catch (err) {
      console.error("Failed to fetch offers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  return (
    <Box sx={{ minHeight: "80vh", bgcolor: colors.accent, pb: 10 }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${colors.dark} 0%, ${colors.primary} 100%)`,
          py: { xs: 8, md: 12 },
          color: "white",
          textAlign: "center",
          mb: 6,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative Background Elements */}
        <Box
          sx={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -30,
            left: "10%",
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.03)",
          }}
        />

        <Container maxWidth="md">
          <Stack spacing={2} alignItems="center">
            <Box
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(4px)",
                px: 2,
                py: 0.5,
                borderRadius: "50px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <TagIcon sx={{ fontSize: 16, color: colors.secondary }} />
              <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
                Exclusive Deals
              </Typography>
            </Box>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                fontSize: { xs: "2.5rem", md: "4rem" },
                letterSpacing: "-1px",
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Special Offers & Rewards
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ opacity: 0.9, maxWidth: "600px", mx: "auto" }}
            >
              Unlock premium savings and career-boosting opportunities with DLK Software Solutions' latest promotional offers.
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg">
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 10,
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <CircularProgress sx={{ color: colors.primary }} />
            <Typography variant="body2" color="text.secondary">
              Fetching current opportunities...
            </Typography>
          </Box>
        ) : offers.length === 0 ? (
          <Fade in={true}>
            <Box
              sx={{
                textAlign: "center",
                py: 12,
                bgcolor: "white",
                borderRadius: "32px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.02)",
                border: "1px solid rgba(0,0,0,0.04)",
              }}
            >
              <ShoppingBag sx={{ fontSize: 80, color: alpha(colors.primary, 0.2), mb: 3 }} />
              <Typography variant="h4" sx={{ fontWeight: 800, color: colors.dark, mb: 1 }}>
                No Active Offers Right Now
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                We're currently preparing new exclusive deals just for you. Please check back later!
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/contact")}
                sx={{
                  bgcolor: colors.primary,
                  color: "white",
                  px: 4,
                  py: 1.5,
                  borderRadius: "50px",
                  fontWeight: 700,
                  "&:hover": { bgcolor: colors.dark }
                }}
              >
                Inquire for Specials
              </Button>
            </Box>
          </Fade>
        ) : (
          <Grid container spacing={4}>
            {offers.map((offer, index) => (
              <Grid item xs={12} sm={6} md={4} key={offer.id}>
                <Fade in={true} timeout={300 + index * 100}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: "24px",
                      overflow: "hidden",
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      border: "1px solid transparent",
                      "&:hover": {
                        transform: "translateY(-10px)",
                        boxShadow: `0 30px 60px ${alpha(colors.primary, 0.15)}`,
                        border: `1px solid ${alpha(colors.primary, 0.1)}`,
                      },
                    }}
                  >
                    <Box sx={{ position: "relative" }}>
                      <CardMedia
                        component="img"
                        height="240"
                        image={offer.photoUrl}
                        alt={offer.title}
                        sx={{
                          objectFit: "cover",
                          transition: "transform 0.8s ease",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          top: 16,
                          right: 16,
                          bgcolor: "white",
                          color: colors.primary,
                          p: 1,
                          borderRadius: "12px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                      >
                        <TagIcon sx={{ fontSize: 20 }} />
                      </Box>
                    </Box>
                    <Box sx={{ p: 4, bgcolor: "white" }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 800,
                          color: colors.dark,
                          mb: 2,
                          lineHeight: 1.3,
                        }}
                      >
                        {offer.title}
                      </Typography>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => {
                          setSelectedOffer(offer.title);
                          setIsModalOpen(true);
                        }}
                        endIcon={<ArrowRight />}
                        sx={{
                          borderRadius: "14px",
                          py: 1.5,
                          borderColor: alpha(colors.primary, 0.3),
                          color: colors.primary,
                          fontWeight: 700,
                          "&:hover": {
                            bgcolor: alpha(colors.primary, 0.05),
                            borderColor: colors.primary,
                          },
                        }}
                      >
                        Claim Offer
                      </Button>
                    </Box>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}

        <QuickEnquiryModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialCourse={selectedOffer}
        />
      </Container>
    </Box>
  );
}
