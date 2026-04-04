import React, { useEffect, useState, useCallback } from "react";
import {
  Box, Typography, Container, Grid, Card, CardMedia, CardContent,
  IconButton, Dialog, Chip, Stack, Fade, CircularProgress,
  Paper, Breadcrumbs, Link, Button
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import {
  X, Image as ImgIcon, Calendar as CalIcon, Clock as ClockIcon,
  ArrowRight as RightIcon, ArrowLeft as LeftIcon,
  FolderOpen as FolderIcon, ChevronRight as ChevronIcon
} from "lucide-react";
import { GetRequest } from "../../api/config";
import { GET_ALL_GALLERY, GET_ALL_GALLERY_EVENTS } from "../../api/endpoints";
import dayjs from "dayjs";
import { getImgUrl } from "../../api/api";

// Animations
const shimmer = keyframes`0%{transform:translateX(-100%)}100%{transform:translateX(100%)}`;
const rotateGradient = keyframes`0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}`;

// Styled Components
const GlassCard = styled(({ $hovered, ...p }) => <Paper {...p} />)(({ $hovered }) => ({
  background: "rgba(255,255,255,0.85)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(61,184,67,0.12)",
  borderRadius: 24,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
  transform: $hovered ? "translateY(-10px)" : "translateY(0)",
  boxShadow: $hovered ? "0 20px 40px rgba(61,184,67,0.15)" : "0 10px 30px rgba(0,0,0,0.05)",
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0, left: "-100%",
    width: "100%", height: "100%",
    background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)",
    animation: $hovered ? `${shimmer} 2s infinite` : "none",
    pointerEvents: "none",
  },
}));

const IconBox = styled(Box)({
  display: "flex", alignItems: "center", justifyContent: "center",
  width: 36, height: 36, borderRadius: 12,
  background: "#f0fbf0", color: "#2e9133",
  transition: "all 0.3s ease",
});

const GlassChip = styled(Chip)({
  background: "rgba(255,255,255,0.25)",
  backdropFilter: "blur(8px)",
  border: "1px solid rgba(255,255,255,0.4)",
  color: "white", fontWeight: 700, fontSize: "0.7rem",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
});

const COLORS = { primary: "#3DB843", dark: "#1a4718", light: "#f0fbf0" };

// ─── Album Card ────────────────────────────────────────────────────────────────
function AlbumCard({ album, onSelect }) {
  const [hovered, setHovered] = useState(false);
  return (
    <GlassCard
      $hovered={hovered}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(album)}
      sx={{ cursor: "pointer" }}
    >
      <Box sx={{ position: "relative", overflow: "hidden", height: 280 }}>
        <CardMedia
          component="img"
          image={getImgUrl(album.thumbnail)}
          alt={album.albumName}
          sx={{
            width: "100%", height: "100%", objectFit: "cover",
            transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)",
            transform: hovered ? "scale(1.1)" : "scale(1)",
          }}
        />
        <Box sx={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg,transparent 30%,rgba(20,53,18,0.85) 100%)",
          opacity: hovered ? 1 : 0.75, transition: "opacity 0.4s ease",
        }} />
        <Box sx={{ position: "absolute", bottom: 24, left: 24, right: 24 }}>
          <Typography variant="h5" sx={{ color: "white", fontWeight: 800, mb: 0.5, letterSpacing: "-0.5px" }}>
            {album.albumName}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "rgba(255,255,255,0.85)" }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>View Events</Typography>
            <RightIcon size={16} />
          </Box>
        </Box>
      </Box>
    </GlassCard>
  );
}

// ─── Event Card ────────────────────────────────────────────────────────────────
function EventCard({ event, onSelect, colors }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Fade in timeout={300}>
        <Box>
          <GlassCard
            $hovered={hovered}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => onSelect(event)}
            sx={{ cursor: "pointer" }}
          >
            <Box sx={{ position: "relative", overflow: "hidden", height: 220 }}>
              <CardMedia
                component="img"
                image={getImgUrl(event.mainImage)}
                alt={event.title}
                sx={{
                  width: "100%", height: "100%", objectFit: "cover",
                  transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)",
                  transform: hovered ? "scale(1.1) rotate(1deg)" : "scale(1)",
                }}
              />
              <Box sx={{
                position: "absolute", inset: 0,
                background: "linear-gradient(180deg,transparent 0%,rgba(0,0,0,0.45) 100%)",
                opacity: hovered ? 0.85 : 0.45, transition: "opacity 0.4s ease",
              }} />
              <Box sx={{ position: "absolute", bottom: 14, right: 14 }}>
                <Chip
                  label={`${event.galleryImages?.length || 0} Photos`}
                  size="small"
                  sx={{ bgcolor: "rgba(0,0,0,0.6)", color: "white", backdropFilter: "blur(4px)", fontWeight: 600, fontSize: "0.65rem" }}
                />
              </Box>
            </Box>

            <CardContent sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}>
              <Typography variant="h6" sx={{
                fontWeight: 700, fontSize: "1.1rem", mb: 2, color: "#1e293b",
                lineHeight: 1.4, minHeight: "3em",
                display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
              }}>
                {event.title}
              </Typography>

              <Stack spacing={1.5} sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <IconBox><CalIcon size={17} /></IconBox>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontWeight: 500 }}>Date</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#334155" }}>
                      {dayjs(event.eventDate).format("DD MMM, YYYY")}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <IconBox sx={{ bgcolor: "#f1f5f9", color: "#0f172a" }}><ClockIcon size={17} /></IconBox>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontWeight: 500 }}>Time</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#334155" }}>{event.eventTime}</Typography>
                  </Box>
                </Box>
              </Stack>

              <Box sx={{
                mt: "auto", pt: 2, borderTop: "1px solid rgba(0,0,0,0.05)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                color: colors.primary, fontWeight: 700, fontSize: "0.9rem",
              }}>
                View Gallery <RightIcon size={18} />
              </Box>
            </CardContent>
          </GlassCard>
        </Box>
      </Fade>
    </Grid>
  );
}

// ─── Main Gallery Page ─────────────────────────────────────────────────────────
export default function Gallery() {
  const [albums, setAlbums] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [activeEvent, setActiveEvent] = useState(null);
  const [sliderIndex, setSliderIndex] = useState(0);

  const openEvent = useCallback((event) => {
    setActiveEvent(event);
    setSliderIndex(0);
  }, []);

  const closeModal = useCallback(() => {
    setActiveEvent(null);
    setSliderIndex(0);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [albumRes, eventRes] = await Promise.all([
          GetRequest(GET_ALL_GALLERY),
          GetRequest(GET_ALL_GALLERY_EVENTS),
        ]);
        setAlbums(albumRes || []);
        setEvents((eventRes?.data) || []);
      } catch (err) {
        console.error("Gallery fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const filteredEvents = selectedAlbum
    ? events.filter(e =>
        e.categoryId?._id === selectedAlbum.id ||
        e.categoryId?.albumName === selectedAlbum.albumName
      )
    : [];

  return (
    <Box sx={{ minHeight: "80vh", bgcolor: "#f8faf7", pb: 10 }}>
      {/* Header */}
      <Box sx={{
        background: `linear-gradient(135deg,${COLORS.dark} 0%,${COLORS.primary} 100%)`,
        py: { xs: 8, md: 12 }, color: "white", textAlign: "center",
        mb: 6, position: "relative", overflow: "hidden",
      }}>
        <Box sx={{
          position: "absolute", top: "-20%", right: "-10%",
          width: 400, height: 400,
          background: "radial-gradient(circle,rgba(255,255,255,0.1) 0%,transparent 70%)",
          borderRadius: "50%",
          animation: `${rotateGradient} 20s linear infinite`,
        }} />

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 2 }}>
          <Breadcrumbs
            separator={<ChevronIcon size={14} color="rgba(255,255,255,0.7)" />}
            sx={{ justifyContent: "center", display: "flex", mb: 2, "& *": { color: "rgba(255,255,255,0.8)" } }}
          >
            <Link underline="hover" onClick={() => setSelectedAlbum(null)}
              sx={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 0.5, fontWeight: 600 }}>
              <FolderIcon size={14} /> Gallery
            </Link>
            {selectedAlbum && (
              <Typography sx={{ color: "white", fontWeight: 800 }}>{selectedAlbum.albumName}</Typography>
            )}
          </Breadcrumbs>

          <Typography variant="h2" sx={{ fontWeight: 900, fontSize: { xs: "2.4rem", md: "3.8rem" }, mb: 2, lineHeight: 1.1 }}>
            {selectedAlbum ? selectedAlbum.albumName : "Memories & Milestones"}
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9, maxWidth: 640, mx: "auto", mb: 4 }}>
            {selectedAlbum
              ? `Explore events in our ${selectedAlbum.albumName} collection.`
              : "Browse albums of workshops, training and project captures from DLK Software Solutions."}
          </Typography>

          {selectedAlbum && (
            <Button
              startIcon={<LeftIcon size={17} />}
              onClick={() => setSelectedAlbum(null)}
              variant="outlined"
              sx={{ color: "white", borderColor: "rgba(255,255,255,0.5)", borderRadius: 3, fontWeight: 700, "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.1)" } }}
            >
              Back to Albums
            </Button>
          )}
        </Container>
      </Box>

      {/* Content */}
      <Container maxWidth="xl">
        {loading ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 15, gap: 3 }}>
            <CircularProgress size={56} sx={{ color: COLORS.primary }} />
            <Typography variant="h6" color="text.secondary">Curating your visual experience...</Typography>
          </Box>
        ) : !selectedAlbum ? (
          /* Albums Grid */
          <Grid container spacing={4} justifyContent="center">
            {albums.map((album, i) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={album.id || i}>
                <Fade in timeout={400 + i * 100}>
                  <Box>
                    <AlbumCard album={album} onSelect={setSelectedAlbum} />
                  </Box>
                </Fade>
              </Grid>
            ))}
          </Grid>
        ) : filteredEvents.length === 0 ? (
          /* Empty state */
          <Box sx={{ textAlign: "center", py: 15, bgcolor: "white", borderRadius: 8, border: "1px dashed #ced4cd" }}>
            <ImgIcon size={64} color="#ced4cd" style={{ marginBottom: 16 }} />
            <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 600 }}>
              No events in this album yet.
            </Typography>
            <Button sx={{ mt: 3, color: COLORS.primary, fontWeight: 700 }} startIcon={<LeftIcon size={17} />} onClick={() => setSelectedAlbum(null)}>
              Explore other Albums
            </Button>
          </Box>
        ) : (
          /* Events Grid */
          <Grid container spacing={4} justifyContent="center">
            {filteredEvents.map((event, i) => (
              <EventCard key={event._id || i} event={event} onSelect={openEvent} colors={COLORS} />
            ))}
          </Grid>
        )}
      </Container>

      {/* Slider Lightbox Modal */}
      <Dialog
        open={Boolean(activeEvent)}
        onClose={closeModal}
        maxWidth="xl" fullWidth
        PaperProps={{ sx: { borderRadius: 0, bgcolor: "#0a0a0a", maxHeight: "100vh", m: 0, width: "100vw", height: "100vh" } }}
        sx={{ '& .MuiDialog-container': { p: 0 } }}
      >
        {activeEvent && (() => {
          const allImages = [activeEvent.mainImage, ...(activeEvent.galleryImages || [])];
          const total = allImages.length;
          const prev = () => setSliderIndex(i => (i - 1 + total) % total);
          const next = () => setSliderIndex(i => (i + 1) % total);
          return (
            <Box sx={{ position: 'relative', width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#0a0a0a' }}>
              {/* Close button */}
              <IconButton
                onClick={closeModal}
                sx={{ position: 'absolute', top: 16, right: 16, zIndex: 20, bgcolor: 'rgba(255,255,255,0.1)', color: 'white', backdropFilter: 'blur(8px)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
              >
                <X size={22} />
              </IconButton>

              {/* Title bar */}
              <Box sx={{ px: 3, pt: 2.5, pb: 1.5, display: 'flex', alignItems: 'center', gap: 2, zIndex: 10 }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, flex: 1 }}>{activeEvent.title}</Typography>
                <Chip label={activeEvent.categoryId?.albumName} size="small" sx={{ bgcolor: COLORS.primary, color: 'white', fontWeight: 700 }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalIcon size={13} /> {dayjs(activeEvent.eventDate).format('DD MMM YYYY')}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', minWidth: 60, textAlign: 'right' }}>
                  {sliderIndex + 1} / {total}
                </Typography>
              </Box>

              {/* Main image area */}
              <Box sx={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', px: 10 }}>
                <Fade in key={sliderIndex} timeout={300}>
                  <Box
                    component="img"
                    src={getImgUrl(allImages[sliderIndex])}
                    alt=""
                    sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 2, userSelect: 'none' }}
                  />
                </Fade>

                {/* Left arrow */}
                <IconButton
                  onClick={prev}
                  sx={{
                    position: 'absolute', left: 16,
                    bgcolor: 'rgba(255,255,255,0.12)', color: 'white',
                    width: 52, height: 52,
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    '&:hover': { bgcolor: COLORS.primary, transform: 'scale(1.1)' },
                    transition: 'all 0.25s ease'
                  }}
                >
                  <LeftIcon size={24} />
                </IconButton>

                {/* Right arrow */}
                <IconButton
                  onClick={next}
                  sx={{
                    position: 'absolute', right: 16,
                    bgcolor: 'rgba(255,255,255,0.12)', color: 'white',
                    width: 52, height: 52,
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    '&:hover': { bgcolor: COLORS.primary, transform: 'scale(1.1)' },
                    transition: 'all 0.25s ease'
                  }}
                >
                  <RightIcon size={24} />
                </IconButton>
              </Box>

              {/* Thumbnail strip */}
              <Box sx={{
                display: 'flex', gap: 1, px: 3, py: 2,
                overflowX: 'auto',
                '&::-webkit-scrollbar': { height: 4 },
                '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.2)', borderRadius: 2 },
                justifyContent: total <= 6 ? 'center' : 'flex-start'
              }}>
                {allImages.map((img, i) => (
                  <Box
                    key={i}
                    onClick={() => setSliderIndex(i)}
                    sx={{
                      width: 72, height: 52, flexShrink: 0, cursor: 'pointer',
                      borderRadius: 1.5, overflow: 'hidden',
                      border: sliderIndex === i ? `2.5px solid ${COLORS.primary}` : '2.5px solid transparent',
                      opacity: sliderIndex === i ? 1 : 0.5,
                      transition: 'all 0.2s ease',
                      '&:hover': { opacity: 1 }
                    }}
                  >
                    <Box component="img" src={getImgUrl(img)} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                ))}
              </Box>
            </Box>
          );
        })()}
      </Dialog>
    </Box>
  );
}
