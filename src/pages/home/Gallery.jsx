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
  Paper,
  alpha,
  Dialog,
  LinearProgress,
  Fab
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL, getImgUrl } from "../../api/api";
import { styled, keyframes } from "@mui/material/styles";

// Icons (Standardizing on Lucide for premium look)
import { 
  X, 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight,
  Image as ImgIcon,
  Library as PhotoLibraryIcon
} from "lucide-react";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Color Palette
const colors = {
  primary: "#4CAF50",
  primaryDark: "#388E3C",
  primaryLight: "#81C784",
  accent: "#2D3748",
  textPrimary: "#2D3748",
  textSecondary: "#718096",
  white: "#ffffff",
};

// Styled Components
const GalleryItem = ({ album, onOpen, height = 300 }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onOpen}
      sx={{
        position: 'relative',
        height: height,
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: isHovered ? '0 12px 24px rgba(0,0,0,0.2)' : '0 4px 12px rgba(0,0,0,0.1)',
        transform: isHovered ? 'translateY(-4px)' : 'none',
        '&:after': {
          content: '""',
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7) 100%)',
          opacity: isHovered ? 1 : 0.6,
          transition: 'opacity 0.3s ease'
        }
      }}
    >
      <Box
        component="img"
        src={album.images?.length > 0 ? getImgUrl(album.images[0]) : ""}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.6s ease',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)'
        }}
      />
      
      {/* Fallback for missing image */}
      {!album.images?.length && (
        <Box sx={{ 
          position: 'absolute', inset: 0, 
          background: `linear-gradient(135deg, ${colors.primaryLight} 0%, ${colors.white} 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.6
        }}>
          <PhotoLibraryIcon size={40} color={colors.primary} style={{ opacity: 0.5 }} />
        </Box>
      )}

      <Box sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        p: 2.5,
        zIndex: 2,
        color: 'white',
        transform: isHovered ? 'translateY(-5px)' : 'none',
        transition: 'transform 0.3s ease'
      }}>
        <Typography variant="subtitle2" sx={{ 
          opacity: 0.9, 
          fontWeight: 700, 
          textTransform: 'uppercase', 
          letterSpacing: 1.5,
          fontSize: '0.65rem'
        }}>
          {album.images?.length || 0} Photos
        </Typography>
        <Typography variant="h6" sx={{ 
          fontWeight: 800, 
          fontSize: '1.1rem',
          mt: 0.5,
          lineHeight: 1.2
        }}>
          {album.albumName || "Untitled"}
        </Typography>
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
          return prev + 2.5; // 4 seconds total (100 / (4000/100))
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
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }
      }}
    >
      {/* Progress Bar */}
      {isPlaying && (
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 10 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 4,
              bgcolor: 'rgba(26, 74, 28, 0.2)',
              '& .MuiLinearProgress-bar': {
                bgcolor: colors.primary,
              }
            }}
          />
        </Box>
      )}

      {/* Top Controls */}
      <Box sx={{
        position: 'absolute', top: 20, left: 0, right: 0, px: 4,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 5
      }}>
        <Typography sx={{
          color: 'white', fontWeight: 600, letterSpacing: 1.5,
          bgcolor: 'rgba(255,255,255,0.1)', px: 2, py: 1, borderRadius: '12px', backdropFilter: 'blur(4px)'
        }}>
          {currentIndex + 1} / {images.length}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <IconButton onClick={onTogglePlay} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
            {isPlaying ? <Pause size={28} /> : <Play size={28} />}
          </IconButton>
          <IconButton onClick={onClose} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
            <X size={28} />
          </IconButton>
        </Box>
      </Box>

      <IconButton onClick={onPrev} sx={{
        position: 'absolute', left: { xs: 10, md: 40 }, color: 'white',
        bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }, zIndex: 5
      }}>
        <ChevronLeft size={48} />
      </IconButton>

      <Box
        component="img"
        src={getImgUrl(images[currentIndex])}
        sx={{
          maxHeight: '80vh', maxWidth: '90vw', objectFit: 'contain',
          boxShadow: '0 0 50px rgba(0,0,0,0.5)', borderRadius: '8px',
          transition: 'all 0.5s ease-in-out'
        }}
      />

      <IconButton onClick={onNext} sx={{
        position: 'absolute', right: { xs: 10, md: 40 }, color: 'white',
        bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }, zIndex: 5
      }}>
        <ChevronRight size={48} />
      </IconButton>
    </Dialog>
  );
};

const Gallery = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeAlbum, setActiveAlbum] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/admin/gallery`);
        if (isMounted) {
          setAlbums(Array.isArray(response.data) ? response.data : []);
        }
      } catch (err) {
        console.error("Error fetching gallery albums:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchAlbums();
    return () => { isMounted = false; };
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

  const handleOpenLightbox = (albumImages) => {
    setActiveAlbum(albumImages);
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
    <Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: "#fff", position: "relative", overflow: "hidden" }}>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: 8, animation: `${fadeIn} 0.8s ease-out` }}>
          <Stack direction="row" spacing={1.5} justifyContent="center" alignItems="center" sx={{ mb: 3 }}>
            <Chip
              label="KNOWLEDGE HUB"
              icon={<PhotoLibraryIcon size={14} style={{ color: colors.primaryDark }} />}
              sx={{
                background: alpha(colors.primary, 0.08),
                color: colors.primaryDark,
                fontWeight: 800,
                letterSpacing: "0.08em",
                borderRadius: "50px",
                height: "32px",
                border: `1px solid ${alpha(colors.primary, 0.15)}`,
                "& .MuiChip-label": { px: 2, fontSize: "0.65rem" },
              }}
            />
          </Stack>

          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              mb: 2,
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              color: colors.textPrimary,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
            }}
          >
            Our <Box
              component="span"
              sx={{ color: colors.primary }}
            >
              Gallery
            </Box>
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: colors.textSecondary,
              maxWidth: "600px",
              mx: "auto",
              fontSize: "0.95rem",
              fontWeight: 500,
              lineHeight: 1.75,
            }}
          >
            Explore our state-of-the-art facilities and vibrant learning environment through these moments.
          </Typography>
        </Box>

        {/* Gallery Grid Section */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "1fr 1fr",
            gap: { xs: 1.5, md: 2 },
          }}
        >
          {isMobile ? (
            albums.map((album, idx) => (
              <GalleryItem 
                key={album._id || idx} 
                album={album} 
                onOpen={() => handleOpenLightbox(album.images)} 
                height={260} 
              />
            ))
          ) : (
            <>
              {/* LEFT SECTION */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Top (Large) */}
                {albums[0] && (
                  <GalleryItem 
                    album={albums[0]} 
                    onOpen={() => handleOpenLightbox(albums[0].images)} 
                    height={460} 
                  />
                )}

                {/* Bottom (Split) */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  {albums[2] && <GalleryItem album={albums[2]} onOpen={() => handleOpenLightbox(albums[2].images)} height={220} />}
                  {albums[4] && <GalleryItem album={albums[4]} onOpen={() => handleOpenLightbox(albums[4].images)} height={220} />}
                </Box>
              </Box>

              {/* RIGHT SECTION */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Top (Split) */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  {albums[3] && <GalleryItem album={albums[3]} onOpen={() => handleOpenLightbox(albums[3].images)} height={220} />}
                  {albums[5] && <GalleryItem album={albums[5]} onOpen={() => handleOpenLightbox(albums[5].images)} height={220} />}
                </Box>

                {/* Bottom (Large) */}
                {albums[1] && (
                  <GalleryItem 
                    album={albums[1]} 
                    onOpen={() => handleOpenLightbox(albums[1].images)} 
                    height={460} 
                  />
                )}
              </Box>
            </>
          )}
        </Box>

        {albums.length === 0 && !loading && (
          <Box sx={{ py: 10, textAlign: "center", bgcolor: "#f8fafc", borderRadius: "24px" }}>
            <Typography color="textSecondary" fontWeight={600}>No memories shared yet.</Typography>
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
