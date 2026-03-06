import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { ADMIN_GET_BANNERS } from "../../api/endpoints";
import { GetRequest } from "../../api/config";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../api/api";

export default function Banner() {
  const [index, setIndex] = useState(0);
  const [transition, setTransition] = useState(true);
  const navigate = useNavigate();
  const sliderRef = useRef();
  const [list, setList] = useState([]);
  const loopSlides = list.length > 0 ? [...list, list[0]] : [];

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await GetRequest(ADMIN_GET_BANNERS);
        setList(data);
      } catch (err) {
        console.error("Failed to fetch banners:", err);
      }
    };
    fetch();
  }, []);
  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  // Handle loop reset
  useEffect(() => {
    if (index === list.length) {
      // After animation completes, jump back to first slide
      setTimeout(() => {
        setTransition(false);
        setIndex(0);
      }, 800); // must match transition duration
    } else {
      setTransition(true);
    }
  }, [index]);

  return (
    <Box
      sx={{
        width: "100%",
        height: { xs: "auto", md: "100vh" },
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#fff" }}
    >
      {/* SLIDER */}
      <Box
        ref={sliderRef}
        sx={{
          display: "flex",
          width: `${loopSlides.length * 100}%`,
          transform: `translateX(-${index * (100 / loopSlides.length)}%)`,
          transition: transition ? "transform 0.8s ease-in-out" : "none" }}
      >
        {loopSlides.map((slide, i) => (
          <Box
            key={i}
            sx={{
              width: `${100 / loopSlides.length}%`,
              flexShrink: 0,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              px: { xs: 3, md: 8 },
              py: { xs: 4, md: 0 } }}
          >
            {/* LEFT IMAGE */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                mb: { xs: 4, md: 0 } }}
            >
              <Box
                component="img"
                src={`${BASE_URL}/${slide.photoUrl}`}
                alt={slide.title}
                sx={{ maxWidth: "100%", height: "50vw", objectFit: "contain" }}
              />
            </Box>

            {/* RIGHT CONTENT */}
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, mb: 1 }}
              >
                {slide.title}{" "}
                <Box
                  component="span"
                  sx={{ color: "#48723e" }}
                >
                  {slide.highlight}
                </Box>
              </Typography>

              <Typography
                variant="h4"
                sx={{ fontWeight: 700, mb: 2 }}
              >
                {slide.subtitle}
              </Typography>

              <Typography
                variant="h6"
                sx={{ fontWeight: 500, mb: 2 }}
              >
                {slide.tagline}{" "}
                <Box
                  component="span"
                  sx={{ color: "#48723e" }}
                >
                  Guidance
                </Box>
              </Typography>

              <Typography
                sx={{ color: "text.secondary", mb: 3 }}
              >
                {slide.description}
              </Typography>

              <Button
                variant="contained"
                onClick={() => navigate("/contact")}
                sx={{
                  backgroundColor: "#bfdb81",
                  px: 4,
                  color: "black",
                  py: 1.2,
                  borderRadius: "8px",
                  textTransform: "none",
                  fontSize: "16px",
                  fontWeight: "500",
                  
                  "&:hover": { backgroundColor: "#000000ff", color: "white" } }}
              >
                {slide.button}
              </Button>
            </Box>
          </Box>
        ))}
      </Box>

      {/* DOTS */}
      <Box
        sx={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 1 }}
      >
        {list.map((_, i) => (
          <Box
            key={i}
            onClick={() => setIndex(i)}
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor:
                i === index % list.length ? "#48723e" : "#d0d0d0",
              cursor: "pointer" }}
          />
        ))}
      </Box>
    </Box>
  );
}
