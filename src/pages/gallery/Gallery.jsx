import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  IconButton,
  Dialog,
  DialogContent,
  Chip,
  Stack,
  Fade,
  CircularProgress,
  alpha,
  useTheme,
} from "@mui/material";
import { Maximize2, X, Image as ImageIcon, Calendar } from "lucide-react";
import { GetRequest } from "../../api/config";
import { GET_ALL_GALLERY } from "../../api/endpoints";

export default function Gallery() {
  const theme = useTheme();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState("All");
  const [activeImage, setActiveImage] = useState(null);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const res = await GetRequest(GET_ALL_GALLERY);
      setAlbums(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const categories = [
    "All",
    "Workshop",
    "Training",
    "Project",
    "Internship",
    "Project discussion",
    "Certification",
  ];

  // Flatten images with their album names
  const allImages = albums.flatMap((album) =>
    (album.images || []).map((img) => ({
      url: img,
      albumName: album.albumName,
      createdAt: album.createdAt,
    }))
  );

  const filteredImages =
    selectedAlbum === "All"
      ? allImages
      : allImages.filter((img) => img.albumName === selectedAlbum);

  const colors = {
    primary: "#3DB843",
    dark: "#1a4718",
  };

  return (
    <Box sx={{ minHeight: "80vh", bg: "#fbfdf3", pb: 10 }}>
      {/* Header section */}
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
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              fontSize: { xs: "2.5rem", md: "4rem" },
              mb: 2,
              letterSpacing: "-1px",
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Memories & Milestones
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ opacity: 0.9, maxWidth: "600px", mx: "auto", mb: 4 }}
          >
            Explore our continuous logs of workshops, training sessions, sets, and project deliverables with DLK Software Solutions.
          </Typography>

          {/* Album Filters */}
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            justifyContent="center"
            useFlexGap
            sx={{ gap: 1, maxWidth: "800px", mx: "auto" }}
          >
            {categories.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                onClick={() => setSelectedAlbum(cat)}
                sx={{
                  bgcolor:
                    selectedAlbum === cat
                      ? "white"
                      : "rgba(255, 255, 255, 0.15)",
                  color: selectedAlbum === cat ? colors.dark : "white",
                  fontWeight: "bold",
                  px: 1,
                  py: 2,
                  backdropFilter: "blur(10px)",
                  border: `1px solid ${alpha('#ffffff', 0.2)}`,
                  "&:hover": {
                    bgcolor:
                      selectedAlbum === cat
                        ? "white"
                        : "rgba(255, 255, 255, 0.25)",
                  },
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Main Grid content */}
      <Container maxWidth="xl">
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
              Mapping Album Frames...
            </Typography>
          </Box>
        ) : filteredImages.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <ImageIcon sx={{ fontSize: 60, color: "grey.400", mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No photos found in this album yet.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              columnCount: { xs: 1, sm: 2, md: 3, lg: 4 },
              columnGap: 3,
              width: "100%",
              "& > div": {
                breakInside: "avoid",
                mb: 3,
              },
            }}
          >
            {filteredImages.map((item, index) => (
              <Fade in={true} timeout={300 + index * 100} key={index}>
                <Card
                  sx={{
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
                    border: "1px solid rgba(0,0,0,0.04)",
                    bgcolor: "white",
                    cursor: "pointer",
                    position: "relative",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 20px 40px rgba(61, 184, 67, 0.08)",
                      "& .item-overlay": { opacity: 1 },
                      "& img": { transform: "scale(1.04)" },
                    },
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  onClick={() => setActiveImage(item.url)}
                >
                  <Box sx={{ position: "relative", overflow: "hidden" }}>
                    <CardMedia
                      component="img"
                      image={item.url}
                      alt={item.albumName}
                      sx={{
                        width: "100%",
                        height: "auto",
                        maxHeight: "500px",
                        display: "block",
                        transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    />

                    {/* Black Blur Overlay on hover */}
                    <Box
                      className="item-overlay"
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: "rgba(0,0,0,0.4)",
                        backdropFilter: "blur(4px)",
                        opacity: 0,
                        transition: "opacity 0.4s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: 1.5,
                      }}
                    >
                      <IconButton
                        sx={{
                          bgcolor: "white",
                          color: colors.dark,
                          "&:hover": { bgcolor: alpha("#ffffff", 0.9) },
                        }}
                      >
                        <Maximize2 size={20} />
                      </IconButton>
                    </Box>

                    {/* Category Overlay Tag */}
                    <Chip
                      label={item.albumName}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        bgcolor: "white",
                        color: colors.dark,
                        fontWeight: "bold",
                        fontSize: "0.75rem",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                  </Box>
                </Card>
              </Fade>
            ))}
          </Box>
        )}
      </Container>

      {/* Lightbox / View Modal */}
      <Dialog
        open={Boolean(activeImage)}
        onClose={() => setActiveImage(null)}
        maxWidth="lg"
        PaperProps={{
          sx: {
            bgcolor: "transparent",
            boxShadow: "none",
            overflow: "visible",
          },
        }}
      >
        <IconButton
          onClick={() => setActiveImage(null)}
          sx={{
            position: "absolute",
            top: -40,
            right: 0,
            color: "white",
            bgcolor: "rgba(0,0,0,0.5)",
            "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
          }}
        >
          <X size={24} />
        </IconButton>
        <DialogContent sx={{ p: 0, display: "flex", justifyContent: "center" }}>
          {activeImage && (
            <img
              src={activeImage}
              alt="Viewing Full View"
              style={{
                maxWidth: "100%",
                maxHeight: "85vh",
                borderRadius: "16px",
                display: "block",
                boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
