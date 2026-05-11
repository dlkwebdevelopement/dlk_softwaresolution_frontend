import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  Box, Typography, Container, Grid, Card, CardMedia,
  IconButton, Dialog, Chip, Stack, Fade, CircularProgress,
  Paper, Breadcrumbs, Link, Button, alpha,
  MenuItem, Select, FormControl, InputLabel, InputAdornment,
  useTheme, useMediaQuery
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import {
  X, Image as ImgIcon, Calendar as CalIcon,
  ChevronRight as ChevronIcon, ChevronLeft as LeftIcon,
  Clock, Share2, Info, Check, Filter, Layers,
  ChevronDown, ArrowRight as RightIcon
} from "lucide-react";
import { GetRequest } from "../../api/api";
import { GET_ALL_OFFICE_GALLERY } from "../../api/endpoints";
import dayjs from "dayjs";
import { getImgUrl } from "../../api/api";

// --- Animations ---
const fadeIn = keyframes`from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); }`;
const shimmer = keyframes`0%{transform:translateX(-100%)}100%{transform:translateX(100%)}`;
const rotateGradient = keyframes`0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}`;

// --- Color Palette (Exact match with Gallery.jsx) ---
const COLORS = {
  primary: "#3DB843",
  dark: "#1a4718",
  light: "#f8faf7",
  textPrimary: "#1e293b",
  textSecondary: "#64748b",
  border: "rgba(61,184,67,0.2)"
};

// --- Styled Components ---

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  minWidth: 160,
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: 'white',
    fontSize: '0.9rem',
    fontWeight: 750,
    color: COLORS.dark,
    transition: 'all 0.3s ease',
    '& fieldset': { borderColor: 'rgba(0,0,0,0.1)' },
    '&:hover fieldset': { borderColor: COLORS.primary },
    '&.Mui-focused fieldset': { borderColor: COLORS.primary },
  },
  '& .MuiSelect-select': {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 14px',
  }
}));

const CategoryScrollContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(6),
  '&::after': {
    content: '""',
    position: 'absolute',
    right: 0, top: 0, bottom: 0,
    width: '40px',
    background: `linear-gradient(to left, ${COLORS.light}, transparent)`,
    pointerEvents: 'none',
    zIndex: 2,
  }
}));

const CategoryTrack = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  overflowX: 'auto',
  scrollBehavior: 'smooth',
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  padding: theme.spacing(1, 0),
  '&::-webkit-scrollbar': { display: 'none' },
  whiteSpace: 'nowrap',
}));

const CategoryPill = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$active'
})(({ $active }) => ({
  padding: '10px 22px',
  borderRadius: '12px',
  fontSize: '0.85rem',
  fontWeight: 800,
  cursor: 'pointer',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  userSelect: 'none',
  border: `1px solid ${$active ? COLORS.primary : "rgba(0,0,0,0.08)"}`,
  backgroundColor: $active ? COLORS.primary : 'white',
  color: $active ? 'white' : COLORS.textSecondary,
  boxShadow: $active ? `0 8px 16px ${alpha(COLORS.primary, 0.2)}` : '0 2px 4px rgba(0,0,0,0.02)',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  '&:hover': {
    transform: 'translateY(-1px)',
    borderColor: COLORS.primary,
    color: $active ? 'white' : COLORS.primary,
  }
}));

const GlassCard = styled(Card)(({ theme }) => ({
  background: "rgba(255,255,255,0.85)",
  backdropFilter: "blur(10px)",
  border: `1px solid rgba(61,184,67,0.25)`,
  borderRadius: 24,
  overflow: "hidden",
  cursor: "zoom-in",
  position: "relative",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  height: "100%",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  '&:hover': {
    transform: "translateY(-10px)",
    boxShadow: "0 20px 40px rgba(61,184,67,0.25)",
    borderColor: "rgba(61,184,67,0.8)",
    '& img': { transform: 'scale(1.1)' },
    '& .overlay': { opacity: 1 },
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0, left: "-100%",
      width: "100%", height: "100%",
      background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)",
      animation: `${shimmer} 2s infinite`,
      pointerEvents: "none",
      zIndex: 2
    },
  }
}));

const ImageOverlay = styled(Box)({
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(180deg, transparent 30%, rgba(20, 53, 18, 0.85) 100%)',
  opacity: 0,
  transition: 'opacity 0.4s ease',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  padding: '20px',
  zIndex: 1,
});

// --- Main Page Component ---
export default function OfficeGallery() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const scrollRef = useRef(null);

  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  
  const [showLightbox, setShowLightbox] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [activeImages, setActiveImages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await GetRequest(GET_ALL_OFFICE_GALLERY);
        const data = res.success ? res.data : res;
        const batchesData = Array.isArray(data) ? data : [];
        setBatches(batchesData);

        if (batchesData.length > 0) {
          const years = [...new Set(batchesData.map(b => b.date ? dayjs(b.date).year().toString() : dayjs().year().toString()))].sort((a, b) => b - a);
          const latestYear = years[0];
          setSelectedYear(latestYear);

          const batchesInYear = batchesData.filter(b => (b.date ? dayjs(b.date).year().toString() : dayjs().year().toString()) === latestYear);
          const sortedBatches = [...batchesInYear].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
          const latestBatch = sortedBatches[0];
          
          if (latestBatch) {
            setSelectedBatchId(latestBatch._id);
            if (latestBatch.categories?.length > 0) {
              setSelectedCategoryId(latestBatch.categories[0]._id);
            }
          }
        }
      } catch (err) {
        console.error("Gallery Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const years = useMemo(() => {
    return [...new Set(batches.map(b => b.date ? dayjs(b.date).year().toString() : dayjs().year().toString()))].sort((a, b) => b - a);
  }, [batches]);

  const batchesInSelectedYear = useMemo(() => {
    return batches
      .filter(b => (b.date ? dayjs(b.date).year().toString() : dayjs().year().toString()) === selectedYear)
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  }, [batches, selectedYear]);

  const currentBatch = useMemo(() => {
    return batches.find(b => b._id === selectedBatchId);
  }, [batches, selectedBatchId]);

  const currentCategory = useMemo(() => {
    return currentBatch?.categories?.find(c => c._id === selectedCategoryId);
  }, [currentBatch, selectedCategoryId]);

  const handleYearChange = (year) => {
    setSelectedYear(year);
    const inYear = batches.filter(b => (b.date ? dayjs(b.date).year().toString() : dayjs().year().toString()) === year);
    const latest = [...inYear].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))[0];
    if (latest) {
      setSelectedBatchId(latest._id);
      if (latest.categories?.length > 0) {
        setSelectedCategoryId(latest.categories[0]._id);
      } else {
        setSelectedCategoryId("");
      }
    }
  };

  const handleBatchChange = (batchId) => {
    setSelectedBatchId(batchId);
    const batch = batches.find(b => b._id === batchId);
    if (batch?.categories?.length > 0) {
      setSelectedCategoryId(batch.categories[0]._id);
    } else {
      setSelectedCategoryId("");
    }
  };

  const handleOpenLightbox = (images, index) => {
    setActiveImages(images);
    setSliderIndex(index);
    setShowLightbox(true);
  };

  useEffect(() => {
    if (!showLightbox) return;
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") setSliderIndex(i => (i - 1 + activeImages.length) % activeImages.length);
      else if (e.key === "ArrowRight") setSliderIndex(i => (i + 1) % activeImages.length);
      else if (e.key === "Escape") setShowLightbox(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showLightbox, activeImages]);

  return (
    <Box sx={{ minHeight: "80vh", bgcolor: COLORS.light, pb: 10 }}>
      {/* Exact Header Alignment from Gallery.jsx */}
      <Box sx={{
        background: `linear-gradient(135deg, ${COLORS.dark} 0%, ${COLORS.primary} 100%)`,
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
            <Link underline="hover" color="inherit" href="/" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}>
               Home
            </Link>
            <Typography sx={{ color: "white", fontWeight: 800 }}>Office Gallery</Typography>
          </Breadcrumbs>

          <Typography variant="h3" sx={{ fontWeight: 600, fontSize: { xs: "2.4rem", md: "3.2rem" }, mb: 2, lineHeight: 1.1 }}>
            Office & Culture
          </Typography>
          
          <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500, maxWidth: 600, mx: 'auto' }}>
            A visual journey through our professional milestones and team celebrations.
          </Typography>
        </Container>
      </Box>

      {/* Filter Row - Exact Right Alignment from Gallery.jsx */}
      <Container maxWidth="xl" sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle2" sx={{ color: COLORS.textSecondary, fontWeight: 700, display: { xs: 'none', sm: 'block' } }}>
            Filter by:
          </Typography>
          <Stack direction="row" spacing={2}>
            <StyledFormControl variant="outlined" size="small">
              <Select
                value={selectedYear}
                onChange={(e) => handleYearChange(e.target.value)}
                displayEmpty
                startAdornment={<CalIcon size={16} color={COLORS.primary} style={{ marginRight: 8 }} />}
                IconComponent={() => <ChevronDown size={16} />}
              >
                {years.map(y => (
                  <MenuItem key={y} value={y} sx={{ fontWeight: 600 }}>Year {y}</MenuItem>
                ))}
              </Select>
            </StyledFormControl>

            <StyledFormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
              <Select
                value={selectedBatchId}
                onChange={(e) => handleBatchChange(e.target.value)}
                displayEmpty
                startAdornment={<Layers size={16} color={COLORS.primary} style={{ marginRight: 8 }} />}
                IconComponent={() => <ChevronDown size={16} />}
              >
                {batchesInSelectedYear.map(b => (
                  <MenuItem key={b._id} value={b._id} sx={{ fontWeight: 600 }}>
                    {b.batchName}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
          </Stack>
        </Box>
      </Container>

      <Container maxWidth="xl">
        {/* Horizontal Category Track */}
        {currentBatch && (
          <CategoryScrollContainer>
            <CategoryTrack ref={scrollRef}>
              {currentBatch.categories?.map((cat) => (
                <CategoryPill
                  key={cat._id}
                  $active={selectedCategoryId === cat._id}
                  onClick={() => setSelectedCategoryId(cat._id)}
                >
                  {cat.categoryName}
                </CategoryPill>
              ))}
            </CategoryTrack>
          </CategoryScrollContainer>
        )}

        {/* Image Gallery Grid - No Paper wrapper, direct Grid */}
        {loading ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 10 }}>
            <CircularProgress size={50} thickness={5} sx={{ color: COLORS.primary }} />
          </Box>
        ) : (
          <Box>
            {currentCategory ? (
              <Grid container spacing={4} sx={{ animation: `${fadeIn} 0.6s ease-out` }}>
                {currentCategory.images?.map((img, i) => (
                  <Grid item xs={6} sm={4} md={3} key={i}>
                    <GlassCard onClick={() => handleOpenLightbox(currentCategory.images, i)}>
                      <Box sx={{ position: 'relative', pt: '100%', overflow: 'hidden' }}>
                        <CardMedia
                          component="img"
                          image={getImgUrl(img.url)}
                          sx={{
                            position: 'absolute', top: 0, left: 0,
                            width: '100%', height: '100%',
                            objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}
                        />
                        <ImageOverlay className="overlay">
                          <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '0.85rem', mb: 0.5 }}>
                            {currentCategory.categoryName}
                          </Typography>
                          <Typography sx={{ color: alpha('#ffffff', 0.8), fontSize: '0.7rem', fontWeight: 600, lineClamp: 1, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {img.highlights?.[0] || "View Highlights"}
                          </Typography>
                        </ImageOverlay>
                      </Box>
                    </GlassCard>
                  </Grid>
                ))}
                {(!currentCategory.images || currentCategory.images.length === 0) && (
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: "center", py: 12, bgcolor: "white", borderRadius: 8, border: '1px dashed #ced4cd' }}>
                      <Typography variant="h6" color="text.secondary">No images found.</Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            ) : (
              <Box sx={{ textAlign: "center", py: 12 }}>
                <Typography color="text.secondary">Select a category to view images.</Typography>
              </Box>
            )}
          </Box>
        )}
      </Container>

      {/* Lightbox - Exact structure from Gallery.jsx */}
      <Dialog
        open={showLightbox}
        onClose={() => setShowLightbox(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { borderRadius: isMobile ? 0 : 4, overflow: "hidden", background: "white", boxShadow: "0 24px 60px rgba(0,0,0,0.15)" }
        }}
      >
        {activeImages.length > 0 && (
          <Box sx={{ display: "flex", flexDirection: { xs: "column-reverse", md: "row" }, minHeight: { md: 400 } }}>
            {/* Info Section */}
            <Box sx={{
              width: { xs: "100%", md: "340px" }, p: 4,
              borderRight: { md: "1px solid rgba(0,0,0,0.06)" },
              bgcolor: "white", display: "flex", flexDirection: "column"
            }}>
              <Box sx={{ mb: 3 }}>
                <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                  <Chip label={selectedYear} size="small" sx={{ fontWeight: 800, bgcolor: alpha(COLORS.primary, 0.1), color: COLORS.primary }} />
                  <Chip label={currentCategory?.categoryName} size="small" sx={{ fontWeight: 800 }} />
                </Stack>
                <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, color: COLORS.textPrimary }}>Gallery Details</Typography>
                <Typography variant="body2" sx={{ color: COLORS.textSecondary, fontWeight: 600 }}>
                  Image {sliderIndex + 1} of {activeImages.length}
                </Typography>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="overline" sx={{ color: COLORS.primary, fontWeight: 900, mb: 2, display: 'block' }}>Key Highlights</Typography>
                <Stack spacing={2}>
                  {activeImages[sliderIndex].highlights?.length > 0 ? (
                    activeImages[sliderIndex].highlights.map((h, i) => (
                      <Box key={i} sx={{ display: 'flex', gap: 1.5 }}>
                        <Check size={16} color={COLORS.primary} strokeWidth={4} />
                        <Typography sx={{ fontWeight: 600, color: "#334155", fontSize: '0.9rem' }}>{h}</Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" sx={{ color: COLORS.textSecondary, fontStyle: 'italic' }}>No highlights available.</Typography>
                  )}
                </Stack>
              </Box>

              <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: COLORS.textSecondary }}>DLK SOLUTIONS</Typography>
                <IconButton onClick={() => setShowLightbox(false)}><X size={24} /></IconButton>
              </Box>
            </Box>

            {/* Viewport */}
            <Box sx={{ flex: 1, bgcolor: "#0f172a", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
              <Fade in key={sliderIndex} timeout={400}>
                <Box
                  component="img"
                  src={getImgUrl(activeImages[sliderIndex].url)}
                  sx={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 2 }}
                />
              </Fade>
              {activeImages.length > 1 && (
                <>
                  <IconButton
                    onClick={() => setSliderIndex(i => (i - 1 + activeImages.length) % activeImages.length)}
                    sx={{ position: "absolute", left: 20, bgcolor: "rgba(255,255,255,0.1)", color: "white", "&:hover": { bgcolor: COLORS.primary } }}
                  >
                    <LeftIcon size={24} />
                  </IconButton>
                  <IconButton
                    onClick={() => setSliderIndex(i => (i + 1) % activeImages.length)}
                    sx={{ position: "absolute", right: 20, bgcolor: "rgba(255,255,255,0.1)", color: "white", "&:hover": { bgcolor: COLORS.primary } }}
                  >
                    <ChevronIcon size={24} />
                  </IconButton>
                </>
              )}
            </Box>
          </Box>
        )}
      </Dialog>
    </Box>
  );
}