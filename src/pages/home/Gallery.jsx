import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Container, useTheme, useMediaQuery, IconButton, Dialog, Fade, LinearProgress } from "@mui/material";
import axios from "axios";
import { BASE_URL, getImgUrl } from "../../api/api";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { styled } from "@mui/material/styles";
import img1 from "../../assets/gallery/industrial_training_gallery_1_1773298102030.png";
import img2 from "../../assets/gallery/software_development_gallery_2_1773298118042.png";
import img3 from "../../assets/gallery/hands_on_learning_gallery_3_1773298135126.png";
import img4 from "../../assets/gallery/technical_training_gallery_4_1773298179548.png";
import img5 from "../../assets/gallery/collaboration_gallery_5_1773298194443.png";
import img6 from "../../assets/gallery/creative_studio_gallery_6_1773298215256.png";

const GalleryImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '16px',
  border: '4px solid white',
  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
  transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
});

const ImageContainer = styled(Box)(({ height }) => ({
  position: 'relative',
  width: '100%',
  height: height || '250px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  borderRadius: '16px',
  cursor: 'pointer',
  '&:hover img': {
    transform: 'scale(1.1)',
  },
  '&:hover .hover-overlay': {
    opacity: 1,
    transform: 'scale(1)',
  },
}));

const ImageLayer = styled(Box)({
  position: 'absolute',
  width: '100%',
  height: '100%',
});

const HoverOverlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.4)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  opacity: 0,
  transform: 'scale(1.05)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  borderRadius: '16px',
  zIndex: 3,
});

const getCategoryIcon = (category) => {
  const iconStyle = { 
    fontSize: '3rem', 
    transform: 'rotate(-12deg)',
    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
    transition: 'all 0.3s ease'
  };

  switch (category) {
    case 'Workshop': 
      return <WorkOutlineIcon sx={{ ...iconStyle, color: '#FFB300' }} />;
    case 'Training': 
      return <SchoolOutlinedIcon sx={{ ...iconStyle, color: '#4FC3F7' }} />;
    case 'Project': 
      return <ScienceOutlinedIcon sx={{ ...iconStyle, color: '#4DB6AC' }} />;
    case 'Internship': 
      return <BadgeOutlinedIcon sx={{ ...iconStyle, color: '#7986CB' }} />;
    case 'Project discussion': 
      return <ForumOutlinedIcon sx={{ ...iconStyle, color: '#81C784' }} />;
    case 'Certification': 
      return <WorkspacePremiumOutlinedIcon sx={{ ...iconStyle, color: '#FFD54F' }} />;
    default: 
      return <VisibilityOutlinedIcon sx={{ ...iconStyle, color: 'white' }} />;
  }
};

const IconButtonStyled = styled(IconButton)({
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  color: 'white',
  backdropFilter: 'blur(4px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  padding: '12px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    transform: 'scale(1.1)',
  }
});

const CountBadge = styled(Box)({
  position: 'absolute',
  top: 15,
  right: 15,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: 'white',
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: '0.85rem',
  fontWeight: 600,
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  zIndex: 4,
  pointerEvents: 'none',
});

const GalleryItem = ({ album, onOpen, height }) => (
  <ImageContainer height={height}>
    <ImageLayer>
      <GalleryImage
        src={album.images && album.images.length > 0 ? getImgUrl(album.images[album.images.length - 1]) : ""}
        alt={album.albumName}
      />
    </ImageLayer>
    {album.images && album.images.length > 1 && (
      <CountBadge>
        {album.images.length}+
      </CountBadge>
    )}
    <HoverOverlay className="hover-overlay" onClick={onOpen}>
      <Box sx={{ color: 'white', textAlign: 'center' }}>
        {getCategoryIcon(album.albumName)}
        <Typography variant="h6" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'white' }}>
          {album.albumName}
        </Typography>
      </Box>
      <IconButtonStyled>
        <VisibilityOutlinedIcon sx={{ fontSize: '1.8rem' }} />
      </IconButtonStyled>
    </HoverOverlay>
  </ImageContainer>
);

const Lightbox = ({ open, images, currentIndex, onClose, onNext, onPrev, isPlaying, onTogglePlay }) => {
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (open && isPlaying) {
      setProgress(0);
      const startTime = Date.now();
      const duration = 4000;

      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / duration) * 100, 100);
        setProgress(newProgress);

        if (elapsed >= duration) {
          clearInterval(timerRef.current);
        }
      }, 10);
    } else {
      setProgress(0);
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [open, isPlaying, currentIndex]);

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
                bgcolor: '#1a4a1c',
              }
            }}
          />
        </Box>
      )}

      {/* Top Controls Container */}
      <Box sx={{
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0,
        px: 4,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 5
      }}>
        {/* Top Left: Counter */}
        <Typography
          sx={{
            color: 'white',
            fontWeight: 600,
            letterSpacing: 1.5,
            bgcolor: 'rgba(255,255,255,0.1)',
            px: 2,
            py: 1,
            borderRadius: '12px',
            backdropFilter: 'blur(4px)'
          }}
        >
          {currentIndex + 1} / {images.length}
        </Typography>

        {/* Top Right: Play/Pause & Close */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <IconButton
            onClick={onTogglePlay}
            sx={{
              color: 'white',
              bgcolor: 'rgba(255,255,255,0.1)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
            }}
          >
            {isPlaying ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
          </IconButton>

          <IconButton
            onClick={onClose}
            sx={{
              color: 'white',
              bgcolor: 'rgba(255,255,255,0.1)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
            }}
          >
            <CloseIcon fontSize="large" />
          </IconButton>
        </Box>
      </Box>

      <IconButton
        onClick={onPrev}
        sx={{
          position: 'absolute',
          left: { xs: 10, md: 40 },
          color: 'white',
          bgcolor: 'rgba(255,255,255,0.1)',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
          zIndex: 5
        }}
      >
        <ArrowBackIosNewIcon fontSize="large" />
      </IconButton>

      <Box
        component="img"
        src={getImgUrl(images[currentIndex])}
        sx={{
          maxHeight: '80vh',
          maxWidth: '90vw',
          objectFit: 'contain',
          boxShadow: '0 0 50px rgba(0,0,0,0.5)',
          borderRadius: '8px',
          userSelect: 'none',
          transition: 'all 0.5s ease-in-out'
        }}
      />

      <IconButton
        onClick={onNext}
        sx={{
          position: 'absolute',
          right: { xs: 10, md: 40 },
          color: 'white',
          bgcolor: 'rgba(255,255,255,0.1)',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
          zIndex: 5
        }}
      >
        <ArrowForwardIosIcon fontSize="large" />
      </IconButton>
    </Dialog>
  );
};

const Gallery = () => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeAlbum, setActiveAlbum] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/gallery`);
        // Sort to maintain requested order if needed, but here we just set what we get
        setAlbums(response.data);
      } catch (err) {
        console.error("Error fetching gallery albums:", err);
      }
    };
    fetchAlbums();
  }, []);

  useEffect(() => {
    let interval;
    if (lightboxOpen && isPlaying) {
      interval = setInterval(() => {
        handleNext();
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [lightboxOpen, isPlaying, activeAlbum.length]);

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

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeAlbum.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeAlbum.length) % activeAlbum.length);
  };

  const toggleAutoplay = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            color: 'var(--green-dark, #1a4a1c)',
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            mb: 2
          }}
        >
          Our <Box component="span" sx={{ color: 'black' }}>Gallery</Box>
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
          Explore our state-of-the-art facilities and vibrant learning environment through these moments.
        </Typography>
      </Box>

      {/* Main Layout */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: 1,
        }}
      >
        {/* LEFT SECTION */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {/* Top (Full width of Left) */}
          {albums[0] && <GalleryItem album={albums[0]} onOpen={() => handleOpenLightbox(albums[0].images)} height={420} />}

          {/* Bottom (Split L/R) */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1 }}>
            {albums[2] && <GalleryItem album={albums[2]} onOpen={() => handleOpenLightbox(albums[2].images)} />}
            {albums[4] && <GalleryItem album={albums[4]} onOpen={() => handleOpenLightbox(albums[4].images)} />}
          </Box>
        </Box>

        {/* RIGHT SECTION */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {/* Top (Split L/R) */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1 }}>
            {albums[3] && <GalleryItem album={albums[3]} onOpen={() => handleOpenLightbox(albums[3].images)} />}
            {albums[5] && <GalleryItem album={albums[5]} onOpen={() => handleOpenLightbox(albums[5].images)} />}
          </Box>

          {/* Bottom (Full width of Right) */}
          {albums[1] && <GalleryItem album={albums[1]} onOpen={() => handleOpenLightbox(albums[1].images)} height={420} />}
        </Box>
      </Box>

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
    </Container>
  );
};

export default Gallery;
