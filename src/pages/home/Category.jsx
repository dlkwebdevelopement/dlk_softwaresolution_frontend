import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, Container, Paper, useTheme, alpha } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { GetRequest } from "../../api/config";
import { ADMIN_GET_CATEGORIES } from "../../api/endpoints";
import { BASE_URL, getImgUrl } from "../../api/api";


// Animations
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

const pulseGlow = keyframes`
  0% { box-shadow: 0 8px 20px rgba(61, 184, 67, 0.2); }
  50% { box-shadow: 0 15px 30px rgba(61, 184, 67, 0.4); }
  100% { box-shadow: 0 8px 20px rgba(61, 184, 67, 0.2); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const marquee = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

// Styled Components
const CategoryCard = styled(({ $index, ...other }) => <Box {...other} />)(({ theme }) => ({
  textAlign: 'center',
  cursor: 'pointer',
  flex: '0 0 auto',
  position: 'relative',
  padding: theme.spacing(1),
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const CategoryImage = styled(Box)({
  position: 'relative',
  borderRadius: '24px',
  overflow: 'hidden',
});

const MarqueeContainer = styled(({ $duration, ...other }) => <Box {...other} />)(({ theme, $duration }) => ({
  display: 'flex',
  width: 'max-content',
  animation: `${marquee} ${$duration}s linear infinite`,
  '&:hover': {
    animationPlayState: 'paused',
  },
}));

const SectionTitle = styled(Typography)({
  position: 'relative',
  display: 'inline-block',
});

const SkeletonCard = () => (
  <Box sx={{ textAlign: 'center', flex: '0 0 auto' }}>
    <Box
      sx={{
        width: { xs: "70px", sm: "80px", lg: "90px" },
        height: { xs: "70px", sm: "80px", lg: "90px" },
        borderRadius: "18px",
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: `${shimmer} 1.5s infinite`,
        mb: 1,
      }}
    />
    <Box
      sx={{
        width: 100,
        height: 14,
        margin: '0 auto',
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: `${shimmer} 1.5s infinite`,
        borderRadius: 7,
      }}
    />
  </Box>
);

const Category = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await GetRequest(ADMIN_GET_CATEGORIES);
        setCats(data);
      } catch (err) {
        console.error("Failed to fetch Categories", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Removed auto-sliding interval and manual scroll logic to use CSS animation

  return (
    <Box sx={{
      width: "100%",
      background: 'linear-gradient(180deg, #ffffff 0%, #f8faf7 100%)',
      position: 'relative',
      py: 6,
    }}>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{
          textAlign: "center",
          mb: 5,
          position: 'relative',
        }}>


          <SectionTitle
            variant="h4"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
              color: 'var(--green-dark)',
              mb: 1
            }}
          >
            <Box component="span" sx={{ color: 'black' }}>Explore</Box> Categories
          </SectionTitle>


        </Box>

        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          }}
        >
          {/* Categories Container */}
          {!loading && cats.length > 0 && (
            <MarqueeContainer
              $duration={cats.length * 5} // Dynamic speed based on count
            >
              {/* Doubled list for seamless looping */}
              {[...cats, ...cats].map((cat, index) => (
                <CategoryCard
                  key={`${cat._id}-${index}`}
                  $index={index}
                  sx={{
                    width: 'calc(100vw / 6)',
                    maxWidth: '180px',
                    minWidth: '120px',
                    px: 1,
                  }}
                >
                  <CategoryImage
                    onClick={() => navigate(`/category/${cat._id}`)}
                    sx={{
                      width: { xs: "80px", sm: "110px", lg: "135px" },
                      height: { xs: "80px", sm: "110px", lg: "135px" },
                      mx: 'auto'
                    }}
                  >
                    <Box
                      component="img"
                      src={getImgUrl(cat?.image) || "https://via.placeholder.com/100x100?text=No+Img"}
                      alt={cat?.category || "Category"}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "24px",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          transform: "scale(1.1) rotate(2deg)",
                          boxShadow: "0 15px 30px var(--green-light)",
                        },
                      }}
                    />
                  </CategoryImage>

                  <Typography
                    sx={{
                      mt: "12px",
                      fontSize: { xs: "12px", sm: "14px", lg: "16px" },
                      fontWeight: 700,
                      color: "black",
                      lineHeight: 1.3,
                      textAlign: 'center',
                      maxWidth: { xs: "75px", sm: "90px", lg: "110px" },
                      mx: 'auto',
                    }}
                  >
                    {cat?.category || "N/A"}
                  </Typography>
                </CategoryCard>
              ))}
            </MarqueeContainer>
          )}

          {/* Loading State Skeleton */}
          {loading && (
            <Box sx={{ display: 'flex', gap: 4, overflow: 'hidden' }}>
              {[...Array(10)].map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </Box>
          )}
        </Box>

        {/* Decorative Elements */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            width: 150,
            height: 150,
            background: 'radial-gradient(circle, rgba(191,219,129,0.1) 0%, rgba(255,255,255,0) 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 40,
            left: 20,
            width: 100,
            height: 100,
            background: 'radial-gradient(circle, rgba(72,114,62,0.1) 0%, rgba(255,255,255,0) 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
      </Container>
    </Box>
  );
};

export default Category;