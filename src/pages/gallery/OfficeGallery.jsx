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

// --- Color Palette ---
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

const GlassCard = styled(Card)(({ theme }) => ({
  background: "rgba(255,255,255,0.85)",
  backdropFilter: "blur(10px)",
  border: `1px solid rgba(61,184,67,0.25)`,
  borderRadius: 24,
  overflow: "hidden",
  cursor: "pointer",
  position: "relative",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  height: "100%",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  '&:hover': {
    transform: "translateY(-10px)",
    boxShadow: "0 20px 40px rgba(61,184,67,0.25)",
    borderColor: "rgba(61,184,67,0.8)",
    '& .overlay': { opacity: 1 },
  }
}));

const CategoryOverlay = styled(Box)({
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(180deg, transparent 40%, rgba(20, 53, 18, 0.9) 100%)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  padding: '24px',
  color: 'white',
  zIndex: 2,
});

// --- Helper Components ---

const CategoryCard = ({ category, onClick }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const coverImages = category.coverImages || [];

  useEffect(() => {
    if (coverImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % coverImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [coverImages.length]);

  return (
    <GlassCard onClick={() => onClick(category)}>
      <Box sx={{ position: 'relative', pt: '120%', overflow: 'hidden' }}>
        {coverImages.length > 0 ? (
          <Fade in key={currentImgIndex} timeout={800}>
            <CardMedia
              component="img"
              image={getImgUrl(coverImages[currentImgIndex].url)}
              sx={{
                position: 'absolute', top: 0, left: 0,
                width: '100%', height: '100%',
                objectFit: 'cover', transition: 'transform 0.6s ease'
              }}
            />
          </Fade>
        ) : (
          <Box sx={{ 
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
            bgcolor: alpha(COLORS.primary, 0.05), display: 'flex', alignItems: 'center', justifyContent: 'center' 
          }}>
            <ImgIcon size={48} color={alpha(COLORS.primary, 0.2)} />
          </Box>
        )}
        
        <CategoryOverlay>
          <Typography variant="h5" sx={{ fontWeight: 900, mb: 0.5, letterSpacing: '-0.5px', color: 'white' }}>
            {category.categoryName}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <ImgIcon size={14} />
            <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.9 }}>
              {category.totalCount} Photos
            </Typography>     
            <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'white', opacity: 0.5 }} />
            <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.9 }}>
              {category.imagesByDay.length === 1 
                ? dayjs(category.imagesByDay[0].date).format('DD MMM YYYY')
                : `${category.imagesByDay.length} Days`}
            </Typography>
          </Stack>
        </CategoryOverlay>
      </Box>
    </GlassCard>
  );
};

// --- Main Page Component ---

export default function OfficeGallery() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedYear, setSelectedYear] = useState(""); // Empty means "All"
  const [selectedBatchId, setSelectedBatchId] = useState(""); // Empty means "All"
  

  // For Lightbox inside Modal
  const [showLightbox, setShowLightbox] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [activeImages, setActiveImages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await GetRequest(GET_ALL_OFFICE_GALLERY);
        const data = res?.data || res;
        const batchesData = Array.isArray(data) ? data : (Array.isArray(res) ? res : []);
        console.log("Gallery Batches Loaded:", batchesData);
        setBatches(batchesData);
      } catch (err) {
        console.error("Gallery Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const years = useMemo(() => {
    const uniqueYears = [...new Set(batches.map(b => b.date ? dayjs(b.date).year().toString() : dayjs().year().toString()))];
    return uniqueYears.sort((a, b) => b - a);
  }, [batches]);

  const batchesInSelectedYear = useMemo(() => {
    if (!selectedYear) return batches;
    return batches.filter(b => (b.date ? dayjs(b.date).year().toString() : dayjs().year().toString()) === selectedYear);
  }, [batches, selectedYear]);

  const filteredBatches = useMemo(() => {
    let filtered = batches;
    if (selectedYear) {
      filtered = filtered.filter(b => (b.date ? dayjs(b.date).year().toString() : dayjs().year().toString()) === selectedYear);
    }
    if (selectedBatchId) {
      filtered = filtered.filter(b => (b._id || b.id) === selectedBatchId);
    }
    return filtered;
  }, [batches, selectedYear, selectedBatchId]);

  const mergedCategories = useMemo(() => {
    const map = new Map();
    
    filteredBatches.forEach(batch => {
      batch.categories?.forEach(cat => {
        const name = cat.categoryName;
        if (!map.has(name)) {
          map.set(name, {
            categoryName: name,
            images: [],
            imagesByDayMap: new Map()
          });
        }
        
        const group = map.get(name);
        const catImages = (cat.images || []).map(img => ({
          ...img,
          categoryName: name,
          batchName: batch.batchName,
          batchDate: batch.date
        }));
        
        group.images.push(...catImages);
        
        const dateKey = batch.date ? dayjs(batch.date).format('YYYY-MM-DD') : 'unknown';
        if (!group.imagesByDayMap.has(dateKey)) {
          group.imagesByDayMap.set(dateKey, []);
        }
        group.imagesByDayMap.get(dateKey).push(...catImages);
      });
    });

    return Array.from(map.values()).map(group => {
      // Sort days descending
      const days = Array.from(group.imagesByDayMap.entries())
        .map(([date, imgs]) => ({ date, imgs }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      return {
        ...group,
        totalCount: group.images.length,
        imagesByDay: days,
        // One cover image per day for rotation
        coverImages: days.map(d => d.imgs[0])
      };
    }).sort((a, b) => b.totalCount - a.totalCount);
  }, [filteredBatches]);

  console.log("Merged Categories:", mergedCategories);

  const handleOpenCategory = (category) => {
    setActiveImages(category.images);
    setSliderIndex(0);
    setShowLightbox(true);
  };

  const handleOpenLightbox = (images, index) => {
    setActiveImages(images);
    setSliderIndex(index);
    setShowLightbox(true);
  };

  return (
    <Box sx={{ minHeight: "80vh", bgcolor: COLORS.light, pb: 10 }}>
      {/* Header Section */}
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

          <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: "2.4rem", md: "3.2rem" }, mb: 2, lineHeight: 1.1, color: "white" }}>
            Office & Culture
          </Typography>
          
          <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500, maxWidth: 600, mx: 'auto' }}>
            A visual journey through our professional milestones and team celebrations.
          </Typography>
        </Container>
      </Box>

      {/* Filters Section */}
      <Container maxWidth="xl" sx={{ mb: 6 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', md: 'center' }, 
          gap: 3,
          bgcolor: 'white',
          p: 2,
          borderRadius: 4,
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: COLORS.textPrimary, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Filter size={20} color={COLORS.primary} />
            Browse Categories
          </Typography>

          <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
            <StyledFormControl variant="outlined" size="small">
              <Select
                value={selectedYear}
                onChange={(e) => { setSelectedYear(e.target.value); setSelectedBatchId(""); }}
                displayEmpty
                startAdornment={<CalIcon size={16} color={COLORS.primary} style={{ marginRight: 8 }} />}
                IconComponent={() => <ChevronDown size={16} />}
              >
                <MenuItem value="" sx={{ fontWeight: 600 }}>All Years</MenuItem>
                {years.map(y => (
                  <MenuItem key={y} value={y} sx={{ fontWeight: 600 }}>Year {y}</MenuItem>
                ))}
              </Select>
            </StyledFormControl>

            <StyledFormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
              <Select
                value={selectedBatchId}
                onChange={(e) => setSelectedBatchId(e.target.value)}
                displayEmpty
                startAdornment={<Layers size={16} color={COLORS.primary} style={{ marginRight: 8 }} />}
                IconComponent={() => <ChevronDown size={16} />}
              >
                <MenuItem value="" sx={{ fontWeight: 600 }}>All Batches</MenuItem>
                {batchesInSelectedYear.map(b => (
                  <MenuItem key={b._id || b.id} value={b._id || b.id} sx={{ fontWeight: 600 }}>
                    {b.batchName}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
          </Stack>
        </Box>
      </Container>

      {/* Category Grid */}
      <Container maxWidth="xl">
        {loading ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 15 }}>
            <CircularProgress size={60} thickness={4} sx={{ color: COLORS.primary }} />
            <Typography sx={{ mt: 2, fontWeight: 700, color: COLORS.textSecondary }}>Loading Gallery...</Typography>
          </Box>
        ) : (
          <Box>
            {mergedCategories.length > 0 ? (
              <Grid container spacing={4} sx={{ animation: `${fadeIn} 0.6s ease-out` }}>
                {mergedCategories.map((category, i) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={category.categoryName}>
                    <Fade in timeout={400 + i * 100}>
                      <Box sx={{ height: '100%' }}>
                        <CategoryCard category={category} onClick={handleOpenCategory} />
                      </Box>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: "center", py: 15, bgcolor: "white", borderRadius: 8, border: '1px dashed #ced4cd' }}>
                <ImgIcon size={64} color="#ced4cd" style={{ marginBottom: 16 }} />
                <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 700 }}>No categories found.</Typography>
                <Typography color="text.secondary">Try adjusting your filters.</Typography>
              </Box>
            )}
          </Box>
        )}
      </Container>


      {/* Lightbox - Reused from previous version */}
      <Dialog
        open={showLightbox}
        onClose={() => setShowLightbox(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4, overflow: "hidden", background: "white", boxShadow: "0 24px 60px rgba(0,0,0,0.15)" }
        }}
      >
        {activeImages.length > 0 && (
          <Box sx={{ display: "flex", flexDirection: { xs: "column-reverse", md: "row" }, minHeight: { md: 400 } }}>
            <Box sx={{
              width: { xs: "100%", md: "340px" }, p: 4,
              borderRight: { md: "1px solid rgba(0,0,0,0.06)" },
              bgcolor: "white", display: "flex", flexDirection: "column"
            }}>
              <Box sx={{ mb: 3 }}>
                <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                  <Chip label={dayjs(activeImages[sliderIndex].batchDate).format('YYYY')} size="small" sx={{ fontWeight: 800, bgcolor: alpha(COLORS.primary, 0.1), color: COLORS.primary }} />
                  <Chip label={activeImages[sliderIndex].categoryName} size="small" sx={{ fontWeight: 800 }} />
                </Stack>
                <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, color: COLORS.textPrimary }}>Gallery Details</Typography>
                <Typography variant="body2" sx={{ color: COLORS.textSecondary, fontWeight: 600 }}>
                  {activeImages[sliderIndex].batchName} • {dayjs(activeImages[sliderIndex].batchDate).format('DD MMM YYYY')}
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

const AppBar = styled(Box)(({ theme }) => ({
  backgroundColor: 'white',
  position: 'sticky',
  top: 0,
  zIndex: theme.zIndex.appBar,
}));

const Toolbar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  height: 80,
  padding: '0 24px',
}));