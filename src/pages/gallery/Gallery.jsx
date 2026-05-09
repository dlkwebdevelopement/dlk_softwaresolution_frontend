import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  Box, Typography, Container, Grid, Card, CardMedia, CardContent,
  IconButton, Dialog, Chip, Stack, Fade, CircularProgress,
  Paper, Breadcrumbs, Link, Button, alpha,
  MenuItem, Select, FormControl, InputLabel, InputAdornment,
  useTheme, useMediaQuery
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import {
  X, Image as ImgIcon, Calendar as CalIcon, Building2 as CollegeIcon,
  ArrowRight as RightIcon, ArrowLeft as LeftIcon,
  FolderOpen as FolderIcon, ChevronRight as ChevronIcon,
  Clock, Share2
} from "lucide-react";
import { GetRequest } from "../../api/api";
import { GET_ALL_GALLERY, GET_ALL_GALLERY_EVENTS } from "../../api/endpoints";
import dayjs from "dayjs";
import { getImgUrl } from "../../api/api";

// Animations
const shimmer = keyframes`0%{transform:translateX(-100%)}100%{transform:translateX(100%)}`;
const rotateGradient = keyframes`0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}`;

// Color Palette
const COLORS = {
  primary: "#3DB843",
  dark: "#1a4718",
  light: "#f0fbf0",
  textPrimary: "#1e293b",
  textSecondary: "#64748b"
};
const colors = COLORS;

const SAMPLE_IMAGES = [
  "/photos/services.png",
  "/photos/realestate.png",
  "/photos/travel.png"
];

const getDailyRandomImage = (images, identifier) => {
  if (!images || images.length === 0) return null;
  const date = new Date();
  const dateSeed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const idHash = identifier?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
  const randomIndex = (dateSeed + idHash) % images.length;
  const img = images[randomIndex];
  return typeof img === 'string' ? img : img?.url || img;
};

// Styled Components
const GlassCard = styled(({ $hovered, ...p }) => <Paper {...p} />)(({ $hovered }) => ({
  background: "rgba(255,255,255,0.85)",
  backdropFilter: "blur(10px)",
  border: `1px solid ${$hovered ? "rgba(61,184,67,0.8)" : "rgba(61,184,67,0.25)"}`,
  borderRadius: 24,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
  transform: $hovered ? "translateY(-10px)" : "translateY(0)",
  boxShadow: $hovered ? "0 20px 40px rgba(61,184,67,0.25)" : "0 10px 30px rgba(0,0,0,0.05)",
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

const ScrollTrack = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '30px',
  overflowX: 'auto',
  scrollBehavior: 'smooth',
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  padding: '10px 4px 30px 4px',
  '&::-webkit-scrollbar': { display: 'none' },
  [theme.breakpoints.down('sm')]: {
    gap: '12px',
    padding: '5px 10px 20px 10px',
  },
}));

const ScrollButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "$direction",
})(({ theme, $direction }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  [$direction === 'left' ? 'left' : 'right']: -25,
  zIndex: 10,
  backgroundColor: 'white',
  color: COLORS.primary,
  boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
  transition: 'all 0.4s ease',
  '&:hover': {
    backgroundColor: COLORS.primary,
    color: 'white',
    transform: 'translateY(-50%) scale(1.1)',
  },
  [theme.breakpoints.down('lg')]: { display: 'none' },
}));

// ─── Album Card ────────────────────────────────────────────────────────────────
function AlbumCard({ album, onSelect }) {
  const [hovered, setHovered] = useState(false);

  const getAlbumCover = () => {
    const allBatchImages = album.batches?.flatMap(batch => batch.images || []) || [];
    const randomImage = getDailyRandomImage(allBatchImages, album.id);
    if (randomImage) return getImgUrl(randomImage);
    if (album.thumbnail) return getImgUrl(album.thumbnail);

    // Pick a sample image based on album ID
    const idHash = album.id?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
    return SAMPLE_IMAGES[idHash % SAMPLE_IMAGES.length];
  };

  const coverImage = getAlbumCover();

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
          image={coverImage}
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
          {album.batches?.length > 0 && (
            <Chip
              label={`${album.batches.length} Batches`}
              size="small"
              sx={{
                bgcolor: alpha(COLORS.primary, 0.9),
                color: "white",
                fontWeight: 800,
                fontSize: "0.65rem",
                height: 20,
                mb: 1,
                borderRadius: 1,
              }}
            />
          )}
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
function EventCard({ event, onSelect }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Fade in timeout={300}>
      <Box sx={{ height: "100%" }}>
        <GlassCard
          $hovered={hovered}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => onSelect(event)}
          sx={{ cursor: "pointer" }}
        >
          <Box sx={{ position: "relative", overflow: "hidden", height: 180 }}>
            <CardMedia
              component="img"
              image={event.mainImage ? getImgUrl(event.mainImage) : SAMPLE_IMAGES[(event._id || "").split('').reduce((a, b) => a + b.charCodeAt(0), 0) % SAMPLE_IMAGES.length]}
              alt={event.title}
              sx={{
                width: "100%", height: "100%", objectFit: "cover",
                transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)",
                transform: "none",
              }}
            />

            {/* Overlay */}
            <Box sx={{
              position: "absolute", inset: 0,
              background: "linear-gradient(180deg,transparent 0%,rgba(0,0,0,0.5) 100%)",
              opacity: hovered ? 0.7 : 0.3, transition: "opacity 0.4s ease",
            }} />

            {/* Top Tags */}
            <Box sx={{ position: "absolute", top: 16, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {event.isBatch ? (
                <Chip
                  label={`BATCH ${event.batchNumber || ''}`}
                  size="small"
                  sx={{
                    bgcolor: "#f5c842",
                    color: "#000",
                    fontWeight: 900,
                    fontSize: "0.65rem",
                    px: 1,
                    height: 22,
                    borderRadius: "4px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                  }}
                />
              ) : <Box />}

              <Chip
                label={`${(event.galleryImages?.length || 0) + (event.mainImage ? 1 : 0)} Photos`}
                size="small"
                sx={{
                  bgcolor: "rgba(255,255,255,0.9)",
                  color: "#1a2b1b",
                  backdropFilter: "blur(8px)",
                  fontWeight: 800,
                  fontSize: "0.65rem",
                  border: "1px solid rgba(255,255,255,0.2)",
                  height: 24
                }}
              />
            </Box>
          </Box>

          <CardContent sx={{ p: 2, flexGrow: 1, display: "flex", flexDirection: "column", gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconBox sx={{ bgcolor: alpha(COLORS.primary, 0.08), color: COLORS.primary, width: 28, height: 28 }}>
                <CollegeIcon size={14} />
              </IconBox>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b", fontSize: '0.8rem' }}>
                  {event.collegeName || "DLK Solutions"}
                </Typography>
              </Box>
            </Box>

            <Typography variant="h6" sx={{
              fontWeight: 800, fontSize: "0.95rem", color: "#0f172a",
              lineHeight: 1.2, minHeight: "2.4em",
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
            }}>
              {event.title}
            </Typography>

            <Box sx={{ mt: 'auto', pt: 1, borderTop: '1px solid rgba(0,0,0,0.05)', display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Clock size={12} color={COLORS.primary} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.textSecondary, fontSize: '0.7rem' }}>
                  {dayjs(event.eventDate).format("DD MMM, YY")}
                </Typography>
              </Box>
              <IconButton size="small" sx={{ color: COLORS.primary, p: 0.5 }}>
                <RightIcon size={14} />
              </IconButton>
            </Box>
          </CardContent>
        </GlassCard>
      </Box>
    </Fade>
  );
}

// ─── Main Gallery Page ─────────────────────────────────────────────────────────
export default function Gallery() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const [albums, setAlbums] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [activeEvent, setActiveEvent] = useState(null);
  const [showLightbox, setShowLightbox] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [selectedYear, setSelectedYear] = useState("All");
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const scrollAmount = direction === 'left' ? -container.clientWidth : container.clientWidth;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const availableYears = useMemo(() => {
    const yearsSet = new Set();
    if (Array.isArray(events)) {
      events.forEach(e => {
        if (e.eventDate) yearsSet.add(dayjs(e.eventDate).year());
      });
    }
    if (Array.isArray(albums)) {
      albums.forEach(a => {
        if (a.updatedAt) yearsSet.add(dayjs(a.updatedAt).year());
      });
    }
    return [...yearsSet].sort((a, b) => b - a);
  }, [events, albums]);



  const allImages = useMemo(() => {
    if (!activeEvent) return [];
    const images = [];
    if (activeEvent.mainImage) images.push(activeEvent.mainImage);
    if (activeEvent.galleryImages) {
      activeEvent.galleryImages.forEach(img => {
        const imgUrl = typeof img === 'string' ? img : img.url;
        const mainUrl = typeof activeEvent.mainImage === 'string' ? activeEvent.mainImage : activeEvent.mainImage?.url;
        if (imgUrl && imgUrl !== mainUrl) {
          images.push(img);
        }
      });
    }
    return images;
  }, [activeEvent]);

  const total = allImages.length;

  useEffect(() => {
    if (showLightbox) {
      setSliderIndex(0);
    }
  }, [showLightbox, activeEvent]);

  const openEvent = useCallback((event) => {
    setActiveEvent(event);
    setShowLightbox(true);
  }, []);

  const openLightbox = useCallback((index) => {
    setSliderIndex(index);
    setShowLightbox(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowLightbox(false);
  }, []);

  // ─── Keyboard Navigation for Lightbox ───────────────────────────────────────
  useEffect(() => {
    if (!showLightbox) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        setSliderIndex(i => total > 0 ? (i - 1 + total) % total : 0);
      } else if (e.key === "ArrowRight") {
        setSliderIndex(i => total > 0 ? (i + 1) % total : 0);
      } else if (e.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showLightbox, activeEvent, closeModal]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [albumRes, eventRes] = await Promise.all([
          GetRequest(GET_ALL_GALLERY),
          GetRequest(GET_ALL_GALLERY_EVENTS),
        ]);
        const albumData = albumRes.success ? albumRes.data : albumRes;
        setAlbums(Array.isArray(albumData) ? albumData : []);

        const eventData = eventRes?.data || (eventRes?.success ? eventRes.data : eventRes) || [];
        setEvents(Array.isArray(eventData) ? eventData : []);

        // Auto-select album if passed from navigation state
        if (location.state?.album) {
          const albumFromState = location.state.album;
          const matchingAlbum = (Array.isArray(albumData) ? albumData : []).find(a => a.id === albumFromState.id);
          setSelectedAlbum(matchingAlbum || albumFromState);
        }
      } catch (err) {
        console.error("Gallery fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [location.state]);

  const filteredEvents = useMemo(() => {
    let result = events;
    if (selectedAlbum) {
      result = result.filter(e =>
        e.categoryId?._id === selectedAlbum.id ||
        e.categoryId?.albumName === selectedAlbum.albumName
      );

      // Add batches as virtual events
      if (selectedAlbum.batches && selectedAlbum.batches.length > 0) {
        const batchEvents = selectedAlbum.batches.map((batch, index) => ({
          _id: `batch-${batch._id}`,
          title: batch.batchName,
          mainImage: getDailyRandomImage(batch.images, batch._id) || batch.images?.[0],
          galleryImages: batch.images?.filter(img => (typeof img === 'string' ? img : img.url) !== getDailyRandomImage(batch.images, batch._id)) || [],
          eventDate: selectedAlbum.updatedAt || new Date(),
          collegeName: "DLK Solutions",
          isBatch: true,
          batchNumber: index + 1,
          categoryId: { albumName: selectedAlbum.albumName }
        }));
        result = [...batchEvents, ...result];
      }
    }
    if (selectedYear && selectedYear !== "All") {
      result = result.filter(e => dayjs(e.eventDate).year().toString() === selectedYear.toString());
    }
    return result;
  }, [events, selectedAlbum, selectedYear]);

  const filteredAlbums = useMemo(() => {
    const albumsArray = Array.isArray(albums) ? albums : [];
    if (!selectedYear || selectedYear === "All") return albumsArray;

    const targetYear = selectedYear.toString();

    return albumsArray.filter(a => {
      // Check if album itself was updated in that year (relevant for batches)
      if (a.updatedAt && dayjs(a.updatedAt).year().toString() === targetYear) return true;

      // Check if any specific event for this album exists in that year
      const hasEventInYear = (events || []).some(e =>
        (e.categoryId?._id === a.id || e.categoryId?.albumName === a.albumName) &&
        dayjs(e.eventDate).year().toString() === targetYear
      );

      return hasEventInYear;
    });
  }, [albums, events, selectedYear]);

  // ─── Render Helpers ──────────────────────────────────────────────────────────
  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 15, gap: 3 }}>
          <CircularProgress size={56} sx={{ color: COLORS.primary }} />
          <Typography variant="h6" color="text.secondary">Curating your visual experience...</Typography>
        </Box>
      );
    }

    if (!selectedAlbum) {
      return (
        <Grid container spacing={4} justifyContent="center">
          {filteredAlbums.map((album, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }} key={album.id || i}>
              <Fade in timeout={400 + i * 100}>
                <Box>
                  <AlbumCard album={album} onSelect={setSelectedAlbum} />
                </Box>
              </Fade>
            </Grid>
          ))}
        </Grid>
      );
    }

    if (filteredEvents.length === 0) {
      return (
        <Box sx={{ textAlign: "center", py: 15, bgcolor: "white", borderRadius: 8, border: "1px dashed #ced4cd" }}>
          <ImgIcon size={64} color="#ced4cd" style={{ marginBottom: 16 }} />
          <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 600 }}>
            No events in {selectedYear} for this album yet.
          </Typography>
          <Button sx={{ mt: 3, color: COLORS.primary, fontWeight: 700 }} startIcon={<LeftIcon size={17} />} onClick={() => setSelectedAlbum(null)}>
            Explore other Albums
          </Button>
        </Box>
      );
    }

    return (
      <Grid container spacing={4} justifyContent="flex-start">
        {filteredEvents.map((event, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={event._id || i}>
            <Fade in timeout={400 + i * 100}>
              <Box sx={{ height: "100%" }}>
                <EventCard event={event} onSelect={openEvent} />
              </Box>
            </Fade>
          </Grid>
        ))}
      </Grid>
    );
  };

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
            <Link underline="hover" onClick={() => { setSelectedAlbum(null); setActiveEvent(null); }}
              sx={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 0.5, fontWeight: 600 }}>
              <FolderIcon size={14} /> Gallery
            </Link>
            {selectedAlbum && (
              <Typography sx={{ color: "white", fontWeight: 800 }}>{selectedAlbum.albumName}</Typography>
            )}
          </Breadcrumbs>

          <Typography variant="h3" sx={{ fontWeight: 600, fontSize: { xs: "2.4rem", md: "3.2rem" }, mb: 2, lineHeight: 1.1 }} color="white">
            {selectedAlbum ? selectedAlbum.albumName : "Memories & Milestones"}
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
            {selectedAlbum ? (
              <Button
                startIcon={<LeftIcon size={17} />}
                onClick={() => setSelectedAlbum(null)}
                variant="outlined"
                sx={{ color: "white", borderColor: "rgba(255,255,255,0.5)", borderRadius: 3, fontWeight: 700, "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.1)" } }}
              >
                Back to Albums
              </Button>
            ) : null}
          </Stack>
        </Container>
      </Box>

      {/* Year Filter Dropdown */}
      <Container maxWidth="xl" sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle2" sx={{ color: COLORS.textSecondary, fontWeight: 700, display: { xs: 'none', sm: 'block' } }}>
            Browse by Year:
          </Typography>
          <FormControl
            variant="outlined"
            size="small"
            sx={{
              minWidth: 160,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                bgcolor: 'white',
                '& fieldset': { borderColor: 'rgba(0,0,0,0.1)' },
                '&:hover fieldset': { borderColor: COLORS.primary },
                '&.Mui-focused fieldset': { borderColor: COLORS.primary },
              }
            }}
          >
            <Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              displayEmpty
              startAdornment={
                <InputAdornment position="start">
                  <CalIcon size={16} color={COLORS.primary} style={{ marginRight: 4 }} />
                </InputAdornment>
              }
              sx={{ fontWeight: 750, color: COLORS.dark }}
            >
              <MenuItem value="All" sx={{ fontWeight: 700, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                All Years
              </MenuItem>
              {availableYears.map(year => (
                <MenuItem key={year} value={year.toString()} sx={{ fontWeight: 600 }}>
                  Year {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Container>

      {/* Content Area */}
      <Container maxWidth="xl">
        {renderContent()}
      </Container>

      {/* Medium-Sized Card-Style Modal */}
      <Dialog
        open={showLightbox}
        onClose={closeModal}
        maxWidth="lg"
        fullWidth
        fullScreen={isMobile}
        sx={{
          zIndex: isMobile ? 9999 : 1300
        }}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 4,
            overflow: "hidden",
            background: "white",
            boxShadow: "0 24px 60px rgba(0,0,0,0.15)",
            maxHeight: isMobile ? "100%" : "85vh"
          }
        }}
      >
        {activeEvent && (
          <Box sx={{
            display: "flex",
            flexDirection: { xs: "column-reverse", md: "row" },
            minHeight: { md: 400 },
            height: isMobile ? "100%" : "auto"
          }}>
            {/* Left Section: Information & Highlights */}
            <Box sx={{
              width: { xs: "100%", md: "340px" },
              p: { xs: 2.5, md: 3.5 },
              borderRight: { md: "1px solid rgba(0,0,0,0.06)" },
              bgcolor: "white",
              display: "flex",
              flexDirection: "column",
              maxHeight: { md: "85vh" },
              overflowY: "auto",
              flexShrink: 0
            }}>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                  <Chip
                    label={activeEvent.categoryId?.albumName || "Gallery"}
                    size="small"
                    sx={{
                      bgcolor: alpha(COLORS.primary, 0.08),
                      color: COLORS.primary,
                      fontWeight: 800,
                      fontSize: "0.7rem",
                      height: 22,
                      px: 0.5,
                      borderRadius: '6px'
                    }}
                  />
                  <Typography variant="caption" sx={{ color: COLORS.textSecondary, fontWeight: 700, letterSpacing: 0.5 }}>
                    {dayjs(activeEvent.eventDate).format("MMM DD, YYYY")}
                  </Typography>
                </Box>

                <Typography variant="h4" sx={{ color: "#0f172a", fontWeight: 900, lineHeight: 1.1, mb: 1.5, letterSpacing: "-1px" }}>
                  {activeEvent.title}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                  <Box sx={{ width: 32, height: 2, bgcolor: COLORS.primary, borderRadius: 1 }} />
                  <Typography variant="body2" sx={{ color: COLORS.textSecondary, fontWeight: 600 }}>
                    {total} Photos in this batch
                  </Typography>
                </Box>
              </Box>

              {/* Highlights Section */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="overline" sx={{ color: COLORS.primary, fontWeight: 900, mb: 2, display: 'block', letterSpacing: 2 }}>
                  Project Highlights
                </Typography>

                <Stack spacing={2}>
                  {(allImages[sliderIndex]?.highlights || []).length > 0 ? (
                    allImages[sliderIndex].highlights.map((h, i) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                        <Box sx={{
                          mt: 0.5,
                          color: COLORS.primary,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <RightIcon size={16} weight="bold" />
                        </Box>
                        <Typography variant="body2" sx={{ color: "#334155", fontWeight: 600, lineHeight: 1.5 }}>
                          {h}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" sx={{ color: COLORS.textSecondary, fontStyle: 'italic' }}>
                      No specific highlights for this photo.
                    </Typography>
                  )}
                </Stack>
              </Box>

              {/* Footer Actions */}
              <Box sx={{ pt: 3, mt: 'auto', borderTop: "1px solid rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="caption" sx={{ color: COLORS.textSecondary, fontWeight: 700 }}>
                  DLK SOFTWARE SOLUTIONS
                </Typography>
                <Stack direction="row" spacing={1}>
                  <IconButton
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Link copied!");
                    }}
                    size="small"
                    sx={{ color: "#94a3b8", "&:hover": { color: COLORS.primary, bgcolor: alpha(COLORS.primary, 0.05) } }}
                  >
                    <Share2 size={16} />
                  </IconButton>
                  <IconButton onClick={closeModal} size="small" sx={{ color: "#94a3b8", "&:hover": { color: "#ef4444", bgcolor: "#fef2f2" } }}>
                    <X size={20} />
                  </IconButton>
                </Stack>
              </Box>
            </Box>

            {/* Right Section: Image Viewport */}
            <Box sx={{
              flex: 1,
              bgcolor: "#0f172a",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              height: { xs: "60vh", md: "85vh" },
              minHeight: { xs: "400px", md: "auto" }
            }}>
              {/* Mobile Close Button */}
              {isMobile && (
                <IconButton
                  onClick={closeModal}
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    zIndex: 10,
                    bgcolor: "rgba(0,0,0,0.5)",
                    color: "white",
                    backdropFilter: "blur(8px)",
                    "&:hover": { bgcolor: "rgba(0,0,0,0.7)" }
                  }}
                >
                  <X size={24} />
                </IconButton>
              )}
              <Box sx={{
                flex: 1,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                p: { xs: 2, md: 3 }
              }}>
                {total > 0 ? (
                  <Fade in key={sliderIndex} timeout={400}>
                    <Box
                      component="img"
                      src={getImgUrl(allImages[sliderIndex]?.url || allImages[sliderIndex])}
                      alt=""
                      sx={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                        borderRadius: 2,
                        boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                        userSelect: "none"
                      }}
                    />
                  </Fade>
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, color: "rgba(255,255,255,0.2)" }}>
                    <ImgIcon size={64} />
                    <Typography>No Image Available</Typography>
                  </Box>
                )}

                {/* Navigation Controls Overlay */}
                {total > 1 && (
                  <>
                    <IconButton
                      onClick={() => setSliderIndex(i => (i - 1 + total) % total)}
                      sx={{
                        position: "absolute",
                        left: 20,
                        bgcolor: "rgba(255,255,255,0.08)",
                        color: "white",
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        "&:hover": { bgcolor: COLORS.primary, border: `1px solid ${COLORS.primary}` }
                      }}
                    >
                      <LeftIcon size={24} />
                    </IconButton>
                    <IconButton
                      onClick={() => setSliderIndex(i => (i + 1) % total)}
                      sx={{
                        position: "absolute",
                        right: 20,
                        bgcolor: "rgba(255,255,255,0.08)",
                        color: "white",
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        "&:hover": { bgcolor: COLORS.primary, border: `1px solid ${COLORS.primary}` }
                      }}
                    >
                      <RightIcon size={24} />
                    </IconButton>
                  </>
                )}
              </Box>

              {/* Progress & Thumbnails Row */}
              <Box sx={{
                px: 3,
                py: 2,
                bgcolor: "rgba(0,0,0,0.2)",
                backdropFilter: "blur(20px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderTop: "1px solid rgba(255,255,255,0.05)"
              }}>
                <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: 1 }}>
                  IMAGE {sliderIndex + 1} OF {total}
                </Typography>

                <Box sx={{ display: "flex", gap: 1 }}>
                  {allImages.slice(Math.max(0, sliderIndex - 2), Math.min(total, sliderIndex + 3)).map((img, idx) => {
                    const actualIdx = allImages.indexOf(img);
                    return (
                      <Box
                        key={actualIdx}
                        onClick={() => setSliderIndex(actualIdx)}
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1,
                          overflow: 'hidden',
                          cursor: 'pointer',
                          border: `2px solid ${sliderIndex === actualIdx ? COLORS.primary : 'transparent'}`,
                          transition: 'all 0.2s ease',
                          opacity: sliderIndex === actualIdx ? 1 : 0.4,
                          '&:hover': { opacity: 1 }
                        }}
                      >
                        <img src={getImgUrl(img.url || img)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Dialog>
    </Box>
  );
}