import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Container,
  useTheme,
  useMediaQuery,
  IconButton,
  Fade,
  Skeleton,
  Stack,
  Chip,
  Button,
  alpha,
  Dialog,
  LinearProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL, getImgUrl } from "../../api/api";
import { keyframes } from "@mui/material/styles";

// Icons (Standardizing on Lucide for premium look)
import {
  X,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Award,
  Presentation,
  GraduationCap,
  Users,
  Briefcase,
  Code2,
  Image as ImgIcon,
  Library as PhotoLibraryIcon
} from "lucide-react";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Color Palette
const colors = {
  primary: "#3DB843",
  primaryDark: "#2e9133",
  primaryLight: "#81C784",
  accent: "#2D3748",
  textPrimary: "#2D3748",
  textSecondary: "#718096",
  white: "#ffffff",
};

/**
 * Filter to strictly identify and eliminate AI demo stock pictures and dummy placeholders.
 * All demo stock images uploaded on 2026-04-09 (17753113...) and duplicate AI demos (1773316...)
 * are excluded so only genuine user-uploaded photos are displayed.
 */
export const isAiDemoOrDummyImage = (url) => {
  if (!url) return true;
  const str = String(url).toLowerCase();
  return (
    str.includes("17753113") ||
    str.includes("1773316") ||
    str.includes("_2026_03_12_") ||
    str.includes("services.png") ||
    str.includes("realestate.png") ||
    str.includes("travel.png") ||
    str.includes("dummy") ||
    str.includes("placeholder") ||
    str.includes("17780462104") ||
    str.includes("1778047880979")
  );
};

// Extracts timestamp from multer-generated filename to determine latest upload
const extractTimestamp = (url) => {
  if (!url) return 0;
  const filename = String(url).split("/").pop();
  const match = filename.match(/(\d{10,14})/);
  return match ? parseInt(match[1], 10) : 0;
};

/**
 * Resolves the LATEST uploaded original image for an album.
 * Per user instruction:
 * "no need the thumnail just show the image (get latest upload image show in the front home )"
 * Thumbnail field is intentionally skipped to avoid AI stock demo images.
 */
export const getLatestAlbumImage = (album, events = []) => {
  if (!album) return null;
  const candidates = [];

  // 1. Batches (e.g. Certification has 28 batches of real photos, Workshop has 3 batches)
  if (Array.isArray(album.batches)) {
    album.batches.forEach((b) => {
      if (Array.isArray(b.images)) {
        b.images.forEach((img) => {
          const u = typeof img === "string" ? img : img?.url;
          if (u && !isAiDemoOrDummyImage(u)) {
            candidates.push(u);
          }
        });
      }
    });
  }

  // 2. Events matching this album (e.g. Workshop has college events)
  if (Array.isArray(events)) {
    const matchingEvents = events.filter((e) => {
      const catId = e.categoryId?._id || e.categoryId?.id || e.categoryId;
      const catName = e.categoryId?.albumName;
      return (
        String(catId) === String(album._id) ||
        String(catId) === String(album.id) ||
        (catName && catName.trim().toLowerCase() === album.albumName?.trim().toLowerCase())
      );
    });
    matchingEvents.forEach((ev) => {
      if (ev.mainImage && !isAiDemoOrDummyImage(ev.mainImage)) {
        candidates.push(ev.mainImage);
      }
      if (Array.isArray(ev.galleryImages)) {
        ev.galleryImages.forEach((g) => {
          const u = typeof g === "string" ? g : g?.url;
          if (u && !isAiDemoOrDummyImage(u)) {
            candidates.push(u);
          }
        });
      }
    });
  }

  // 3. Direct album images (genuine non-AI only)
  if (Array.isArray(album.images)) {
    album.images.forEach((img) => {
      const u = typeof img === "string" ? img : img?.url;
      if (u && !isAiDemoOrDummyImage(u)) {
        candidates.push(u);
      }
    });
  }

  // Note: album.thumbnail is skipped completely as requested.

  if (candidates.length === 0) return null;

  // Sort candidates by latest upload timestamp descending
  candidates.sort((a, b) => extractTimestamp(b) - extractTimestamp(a));

  return getImgUrl(candidates[0]);
};

// Maps section names to dedicated high-clarity Lucide icons
const getSectionIcon = (name = "") => {
  const n = String(name).trim().toLowerCase();
  if (n.includes("certif")) return Award;
  if (n.includes("workshop")) return Presentation;
  if (n.includes("training")) return GraduationCap;
  if (n.includes("intern")) return Briefcase;
  if (n.includes("disc") || n.includes("meet") || n.includes("group")) return Users;
  if (n.includes("project")) return Code2;
  return PhotoLibraryIcon;
};

// Styled Components
const GalleryItem = ({ album, events = [], onOpen, height = 300 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();

  if (!album) return null;

  const coverImage = getLatestAlbumImage(album, events);
  const SectionIcon = getSectionIcon(album.albumName);
  const isLarge = height > 300;
  const hasValidImage = Boolean(coverImage) && !imgError;

  // If section has NO real image -> show Icon and Section Name card
  if (!hasValidImage) {
    return (
      <Box
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => navigate("/gallery", { state: { album } })}
        sx={{
          position: "relative",
          height: height,
          borderRadius: "20px",
          overflow: "hidden",
          cursor: "pointer",
          background: "linear-gradient(145deg, #f7fcf8 0%, #ffffff 50%, #edf7f0 100%)",
          border: "1.5px solid",
          borderColor: isHovered ? "rgba(61, 184, 67, 0.45)" : "rgba(61, 184, 67, 0.2)",
          boxShadow: isHovered
            ? "0 16px 32px rgba(61, 184, 67, 0.14)"
            : "0 4px 14px rgba(0,0,0,0.03)",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: isHovered ? "translateY(-4px)" : "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2.5, md: 3.5 },
          textAlign: "center",
        }}
      >
        {/* Soft background aura */}
        <Box
          sx={{
            position: "absolute",
            top: -25,
            right: -25,
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(61, 184, 67, 0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Rounded Icon Badge */}
        <Box
          sx={{
            width: isLarge ? 84 : 58,
            height: isLarge ? 84 : 58,
            borderRadius: isLarge ? "24px" : "18px",
            bgcolor: alpha(colors.primary, 0.1),
            border: `1.5px solid ${alpha(colors.primary, 0.25)}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: isLarge ? 2.5 : 1.5,
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: isHovered ? "scale(1.1) rotate(2deg)" : "none",
            boxShadow: isHovered ? `0 10px 20px ${alpha(colors.primary, 0.2)}` : "none",
          }}
        >
          <SectionIcon
            size={isLarge ? 42 : 28}
            color={colors.primaryDark}
            strokeWidth={2.2}
          />
        </Box>

        {/* Section Name */}
        <Typography
          variant={isLarge ? "h5" : "h6"}
          sx={{
            fontWeight: 900,
            fontSize: isLarge ? "1.45rem" : "1.15rem",
            lineHeight: 1.2,
            color: "#0f172a",
            mb: 1.5,
            letterSpacing: "-0.01em",
          }}
        >
          {album.albumName || "Untitled"}
        </Typography>

        {/* View Events Button */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.8,
            color: colors.primaryDark,
            bgcolor: alpha(colors.primary, 0.08),
            px: 2,
            py: 0.7,
            borderRadius: "50px",
            border: `1px solid ${alpha(colors.primary, 0.22)}`,
            transition: "all 0.3s ease",
            boxShadow: isHovered ? `0 4px 12px ${alpha(colors.primary, 0.15)}` : "none",
          }}
        >
          <Typography sx={{ fontSize: "0.85rem", fontWeight: 800 }}>
            View Events
          </Typography>
          <ArrowRight
            size={16}
            style={{
              transition: "transform 0.3s ease",
              transform: isHovered ? "translateX(3px)" : "none",
            }}
          />
        </Box>
      </Box>
    );
  }

  // Section HAS original uploaded images -> show original photo
  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate("/gallery", { state: { album } })}
      sx={{
        position: "relative",
        height: height,
        borderRadius: "20px",
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: isHovered ? "0 16px 32px rgba(0,0,0,0.22)" : "0 4px 12px rgba(0,0,0,0.08)",
        transform: isHovered ? "translateY(-3px)" : "none",
        "&:after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(to bottom, transparent 35%, rgba(0,0,0,0.78) 100%)",
          opacity: isHovered ? 1 : 0.7,
          transition: "opacity 0.3s ease",
        },
      }}
    >
      <Box
        component="img"
        src={coverImage}
        alt={album.albumName || "DLK Gallery"}
        loading="lazy"
        decoding="async"
        onError={() => setImgError(true)}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: isHovered ? "scale(1.05)" : "none",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          p: { xs: 2, md: 2.5 },
          zIndex: 2,
          color: "white",
          transition: "all 0.3s ease",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 900,
            fontSize: isLarge ? "1.35rem" : "1.15rem",
            lineHeight: 1.15,
            mb: 0.8,
            color: "#fff",
            textShadow: "0 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          {album.albumName || "Untitled"}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.6,
            color: "#fff",
            opacity: isHovered ? 1 : 0.9,
            transition: "all 0.3s ease",
          }}
        >
          <Typography sx={{ fontSize: "0.85rem", fontWeight: 800 }}>
            View Events
          </Typography>
          <ArrowRight
            size={16}
            style={{
              transition: "transform 0.3s ease",
              transform: isHovered ? "translateX(3px)" : "none",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

const Lightbox = ({ open, images, currentIndex, onClose, onNext, onPrev, isPlaying, onTogglePlay }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;
    if (open && isPlaying) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 0;
          return prev + 2.5; // 4 seconds total
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [open, isPlaying, currentIndex]);

  if (!images || images.length === 0) return null;

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 500 }}
      PaperProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.95)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        },
      }}
    >
      {/* Progress Bar */}
      {isPlaying && (
        <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", zIndex: 10 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 4,
              bgcolor: "rgba(26, 74, 28, 0.2)",
              "& .MuiLinearProgress-bar": {
                bgcolor: colors.primary,
              },
            }}
          />
        </Box>
      )}

      {/* Top Controls */}
      <Box
        sx={{
          position: "absolute",
          top: 20,
          left: 0,
          right: 0,
          px: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 5,
        }}
      >
        <Typography
          sx={{
            color: "white",
            fontWeight: 600,
            letterSpacing: 1.5,
            bgcolor: "rgba(255,255,255,0.1)",
            px: 2,
            py: 1,
            borderRadius: "12px",
            backdropFilter: "blur(4px)",
          }}
        >
          {currentIndex + 1} / {images.length}
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <IconButton
            onClick={onTogglePlay}
            sx={{ color: "white", bgcolor: "rgba(255,255,255,0.1)", "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} />}
          </IconButton>
          <IconButton
            onClick={onClose}
            sx={{ color: "white", bgcolor: "rgba(255,255,255,0.1)", "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}
          >
            <X size={28} />
          </IconButton>
        </Box>
      </Box>

      <IconButton
        onClick={onPrev}
        sx={{
          position: "absolute",
          left: { xs: 10, md: 40 },
          color: "white",
          bgcolor: "rgba(255,255,255,0.1)",
          "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
          zIndex: 5,
        }}
      >
        <ChevronLeft size={48} />
      </IconButton>

      <Box
        component="img"
        src={getImgUrl(typeof images[currentIndex] === "string" ? images[currentIndex] : images[currentIndex].url)}
        sx={{
          maxHeight: "80vh",
          maxWidth: "90vw",
          objectFit: "contain",
          boxShadow: "0 0 50px rgba(0,0,0,0.5)",
          borderRadius: "8px",
          transition: "all 0.5s ease-in-out",
        }}
      />

      <IconButton
        onClick={onNext}
        sx={{
          position: "absolute",
          right: { xs: 10, md: 40 },
          color: "white",
          bgcolor: "rgba(255,255,255,0.1)",
          "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
          zIndex: 5,
        }}
      >
        <ChevronRight size={48} />
      </IconButton>
    </Dialog>
  );
};

const Gallery = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const [albums, setAlbums] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeAlbum, setActiveAlbum] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchGalleryData = async () => {
      try {
        setLoading(true);
        const [albumsRes, eventsRes] = await Promise.all([
          axios.get(`${BASE_URL}/admin/gallery`),
          axios.get(`${BASE_URL}/admin/gallery-events`).catch(() => ({ data: [] }))
        ]);
        if (isMounted) {
          const aResult = albumsRes.data;
          const albumsData = aResult.success ? aResult.data : aResult;
          setAlbums(Array.isArray(albumsData) ? albumsData : []);

          const eResult = eventsRes.data;
          const eventsData = eResult.success ? eResult.data : (Array.isArray(eResult) ? eResult : []);
          setEvents(Array.isArray(eventsData) ? eventsData : []);
        }
      } catch (err) {
        console.error("Error fetching gallery albums:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchGalleryData();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let interval;
    if (lightboxOpen && isPlaying) {
      interval = setInterval(() => {
        handleNext();
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [lightboxOpen, isPlaying, activeAlbum]);

  const handleOpenLightbox = (rawImages) => {
    const validImages = (rawImages || []).filter((img) => {
      const u = typeof img === "string" ? img : img?.url;
      return u && !isAiDemoOrDummyImage(u);
    });
    if (validImages.length === 0) return;
    setActiveAlbum(validImages);
    setCurrentIndex(0);
    setIsPlaying(false);
    setLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setLightboxOpen(false);
    setIsPlaying(false);
  };

  const handleNext = useCallback(() => {
    setActiveAlbum((prev) => {
      if (prev.length === 0) return prev;
      setCurrentIndex((curr) => (curr + 1) % prev.length);
      return prev;
    });
  }, []);

  const handlePrev = useCallback(() => {
    setActiveAlbum((prev) => {
      if (prev.length === 0) return prev;
      setCurrentIndex((curr) => (curr - 1 + prev.length) % prev.length);
      return prev;
    });
  }, []);

  const toggleAutoplay = () => setIsPlaying((prev) => !prev);

  if (loading) {
    return (
      <Box sx={{ py: 10, bgcolor: "#fff" }}>
        <Container maxWidth="xl">
          <Skeleton variant="text" width="200px" height={40} sx={{ mx: "auto", mb: 2 }} />
          <Skeleton variant="text" width="60%" height={60} sx={{ mx: "auto", mb: 8 }} />
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
            <Skeleton variant="rectangular" height={420} sx={{ borderRadius: "16px" }} />
            <Skeleton variant="rectangular" height={420} sx={{ borderRadius: "16px" }} />
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box component="section" sx={{ pt: 1, pb: { xs: 8, md: 10 }, bgcolor: "#fff", position: "relative", overflow: "hidden" }}>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: 8, animation: `${fadeIn} 0.8s ease-out` }}>
          <Stack direction="row" spacing={1.5} justifyContent="center" alignItems="center" sx={{ mb: 3 }}>
            <Chip
              label="KNOWLEDGE HUB"
              icon={<PhotoLibraryIcon size={14} style={{ color: colors.primaryDark }} />}
              sx={{
                background: alpha(colors.primary, 0.1),
                color: colors.primaryDark,
                fontWeight: 800,
                letterSpacing: "0.08em",
                borderRadius: "50px",
                height: "32px",
                border: `1px solid ${alpha(colors.primary, 0.2)}`,
                "& .MuiChip-label": { px: 2, fontSize: "0.65rem" },
              }}
            />
          </Stack>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              mb: 2,
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              color: "#0f172a",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            Our{" "}
            <Box component="span" sx={{ color: colors.primary }}>
              Gallery
            </Box>
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#444",
              maxWidth: "600px",
              mx: "auto",
              fontSize: "0.95rem",
              fontWeight: 500,
              lineHeight: 1.75,
              mb: 4,
            }}
          >
            Explore our state-of-the-art facilities and vibrant learning environment through these captured moments.
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={() => navigate("/gallery")}
              endIcon={<ArrowRight size={20} />}
              sx={{
                bgcolor: colors.primary,
                color: "white",
                px: { xs: 4, md: 6 },
                py: 1.5,
                borderRadius: "50px",
                fontWeight: 800,
                fontSize: "0.95rem",
                textTransform: "none",
                boxShadow: `0 10px 20px ${alpha(colors.primary, 0.3)}`,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  bgcolor: colors.primaryDark,
                  transform: "translateY(-4px)",
                  boxShadow: `0 15px 30px ${alpha(colors.primary, 0.4)}`,
                },
              }}
            >
              View All Moments
            </Button>
          </Box>
        </Box>

        {/* Gallery Grid Section */}
        {(() => {
          const findAlbum = (name) => albums.find((a) => a.albumName?.trim().toLowerCase() === name.toLowerCase());

          // Map albums by their exact names
          const certAlbum = findAlbum("Certification") || albums[4] || albums[0];
          const trainingAlbum = findAlbum("Training") || albums[1];
          const projectAlbum = findAlbum("Project") || albums[5] || albums[2];
          const projectDiscAlbum = findAlbum("Project discussion") || albums[2] || albums[3];
          const workshopAlbum = findAlbum("Workshop") || albums[3] || albums[4];
          const internshipAlbum = findAlbum("Internship") || albums[0] || albums[5];

          return (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "1fr 1fr",
                gap: { xs: 1.5, md: 2.5 },
              }}
            >
              {isMobile ? (
                [certAlbum, internshipAlbum, trainingAlbum, projectAlbum, projectDiscAlbum, workshopAlbum]
                  .filter(Boolean)
                  .map((album, idx) => (
                    <GalleryItem
                      key={album._id || album.id || idx}
                      album={album}
                      events={events}
                      onOpen={() => handleOpenLightbox(album.images)}
                      height={220}
                    />
                  ))
              ) : (
                <>
                  {/* LEFT SECTION: Top (Certification Large), Bottom (Training & Project) */}
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                    {/* Top (Large: Certification) */}
                    {certAlbum && (
                      <GalleryItem
                        album={certAlbum}
                        events={events}
                        onOpen={() => handleOpenLightbox(certAlbum.images)}
                        height={460}
                      />
                    )}

                    {/* Bottom (Split: Training & Project) */}
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2.5 }}>
                      {trainingAlbum && (
                        <GalleryItem
                          album={trainingAlbum}
                          events={events}
                          onOpen={() => handleOpenLightbox(trainingAlbum.images)}
                          height={220}
                        />
                      )}
                      {projectAlbum && (
                        <GalleryItem
                          album={projectAlbum}
                          events={events}
                          onOpen={() => handleOpenLightbox(projectAlbum.images)}
                          height={220}
                        />
                      )}
                    </Box>
                  </Box>

                  {/* RIGHT SECTION: Top (Project discussion & Workshop), Bottom (Internship Large) */}
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                    {/* Top (Split: Project discussion & Workshop) */}
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2.5 }}>
                      {projectDiscAlbum && (
                        <GalleryItem
                          album={projectDiscAlbum}
                          events={events}
                          onOpen={() => handleOpenLightbox(projectDiscAlbum.images)}
                          height={220}
                        />
                      )}
                      {workshopAlbum && (
                        <GalleryItem
                          album={workshopAlbum}
                          events={events}
                          onOpen={() => handleOpenLightbox(workshopAlbum.images)}
                          height={220}
                        />
                      )}
                    </Box>

                    {/* Bottom (Large: Internship) */}
                    {internshipAlbum && (
                      <GalleryItem
                        album={internshipAlbum}
                        events={events}
                        onOpen={() => handleOpenLightbox(internshipAlbum.images)}
                        height={460}
                      />
                    )}
                  </Box>
                </>
              )}
            </Box>
          );
        })()}

        {albums.length === 0 && !loading && (
          <Box sx={{ py: 10, textAlign: "center", bgcolor: "#f8fafc", borderRadius: "24px" }}>
            <Typography color="textSecondary" fontWeight={600}>
              No memories shared yet.
            </Typography>
          </Box>
        )}
      </Container>

      {/* Lightbox Slider */}
      <Lightbox
        open={lightboxOpen}
        images={activeAlbum}
        currentIndex={currentIndex}
        onClose={handleCloseLightbox}
        onNext={handleNext}
        onPrev={handlePrev}
        isPlaying={isPlaying}
        onTogglePlay={toggleAutoplay}
      />
    </Box>
  );
};

export default Gallery;
