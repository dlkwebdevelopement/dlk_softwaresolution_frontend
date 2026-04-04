import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Container, useTheme, useMediaQuery, IconButton, Fade, LinearProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL, getImgUrl } from "../../api/api";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
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
  <ImageContainer height={height} onClick={onOpen}>
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
    <HoverOverlay className="hover-overlay">
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



const Gallery = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

  const handleOpenAlbum = (album) => {
    navigate("/gallery", { state: { album } });
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 600,
            color: 'var(--green-dark, #1a4a1c)',
            fontSize: 'clamp(1.7rem, 3.2vw, 2.5rem)',
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
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : '1fr 1fr',
          gap: 1,
        }}
      >
        {isMobile ? (
          // MOBILE LAYOUT: Simple 2-column grid
          albums.map((album, idx) => (
            <GalleryItem 
              key={idx} 
              album={album} 
              onOpen={() => handleOpenAlbum(album)} 
              height={220} // Larger height for better visibility on mobile
            />
          ))
        ) : (
          // DESKTOP LAYOUT: Complex split grid
          <>
            {/* LEFT SECTION */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {/* Top (Full width of Left) */}
              {albums[0] && <GalleryItem album={albums[0]} onOpen={() => handleOpenAlbum(albums[0])} height={420} />}

              {/* Bottom (Split L/R) */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                {albums[2] && <GalleryItem album={albums[2]} onOpen={() => handleOpenAlbum(albums[2])} />}
                {albums[4] && <GalleryItem album={albums[4]} onOpen={() => handleOpenAlbum(albums[4])} />}
              </Box>
            </Box>

            {/* RIGHT SECTION */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {/* Top (Split L/R) */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                {albums[3] && <GalleryItem album={albums[3]} onOpen={() => handleOpenAlbum(albums[3])} />}
                {albums[5] && <GalleryItem album={albums[5]} onOpen={() => handleOpenAlbum(albums[5])} />}
              </Box>

              {/* Bottom (Full width of Right) */}
              {albums[1] && <GalleryItem album={albums[1]} onOpen={() => handleOpenAlbum(albums[1])} height={420} />}
            </Box>
          </>
        )}
      </Box>

    </Container>
  );
};

export default Gallery;
