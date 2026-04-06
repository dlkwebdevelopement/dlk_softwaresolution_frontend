import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardMedia,
  Fade,
  CircularProgress,
  Button,
  alpha,
} from "@mui/material";
import { ShoppingBag, ArrowRight } from "@mui/icons-material";
import { GetRequest } from "../../api/config";
import { GET_ALL_OFFERS } from "../../api/endpoints";
import { useNavigate } from "react-router-dom";
import QuickEnquiryModal from "../../components/QuickEnquiryModal";

export default function Offers() {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState("");

  const colors = {
    primary: "#3DB843",
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

      {/* HERO */}
      <Box
        sx={{
          background: `linear-gradient(135deg, #1a4718 0%, #3DB843 100%)`,
          py: { xs: 8, md: 12 },
          color: "white",
          textAlign: "center",
          mb: 6,
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight={900} color="white">
            Special Offers
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress />
          </Box>
        ) : offers.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <ShoppingBag sx={{ fontSize: 80, color: alpha(colors.primary, 0.2) }} />
            <Typography variant="h5" mt={2}>
              No Offers Available
            </Typography>
          </Box>
        ) : (

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 270px)",
                md: "repeat(3, 270px)",
                lg: "repeat(4, 270px)", // 4 cards per row
              },
              justifyContent: "center",
              gap: 4,
            }}
          >

            {offers.map((offer, index) => (

              <Fade in timeout={300 + index * 100} key={offer.id}>

                <Card
                  sx={{
                    width: "270px",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 16px 28px rgba(0,0,0,0.15)",
                    },
                  }}
                >

                  {/* IMAGE */}
                  <CardMedia
                    component="img"
                    image={offer.photoUrl}
                    alt={offer.title}
                    sx={{
                      width: "100%",
                      height: "230px",
                      objectFit: "cover",
                    }}
                  />

                  {/* CONTENT */}
                  <Box sx={{ p: 2 }}>

                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {offer.title}
                    </Typography>

                    <Button
                      fullWidth
                      size="small"
                      variant="outlined"
                      endIcon={<ArrowRight />}
                      onClick={() => {
                        setSelectedOffer(offer.title);
                        setIsModalOpen(true);
                      }}
                    >
                      Claim Offer
                    </Button>

                  </Box>

                </Card>

              </Fade>

            ))}

          </Box>

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