import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { GetRequest } from "../../api/config";
import { ADMIN_GET_COMPANIES } from "../../api/endpoints";
import { BASE_URL } from "../../api/api";

// Duplicate logos for seamless loop

export default function LogoCarousel() {
  const [logos, setLogo] = useState([]);
  const loopLogos = [...logos, ...logos];

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await GetRequest(ADMIN_GET_COMPANIES);
        setLogo(data);
      } catch (err) {
        console.error("Failed to fetch Companies:", err);
      }
    };
    fetch();
  }, []);

  return (
    <Box
      sx={{
        maxWidth: "1300px",
        py: 6,
        overflow: "hidden",
        margin: "auto" }}
    >
      {/* TITLE */}
      <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 4, color: "#1a4718" }}>
        We Tie-Up with 1000+ <span style={{ color: "#83a561" }}> Leading IT and MNC Companies</span>
      </Typography>

      {/* SLIDER WRAPPER */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          overflow: "hidden" }}
      >
        {/* SLIDER */}
        <Box
          className="logo-slider"
          sx={{
            display: "flex",
            width: "max-content",
            animation: "scrollLeft 60s linear infinite",

            // ⏸ Pause animation on hover
            "&:hover": {
              animationPlayState: "paused",
            },

            "@keyframes scrollLeft": {
              "0%": {
                transform: "translateX(0)",
              },
              "100%": {
                transform: "translateX(-50%)",
              },
            } }}
        >
          {loopLogos.map((logo, i) => (
            <Box
              key={i}
              sx={{
                minWidth: 160,
                height: 80,
                mx: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center" }}
            >
              <Box
                component="img"
                src={`${BASE_URL}/${logo.photoUrl}`}
                alt="company logo"
                sx={{
                  maxWidth: "100%",
                  maxHeight: "60px",
                  objectFit: "contain",
                  opacity: 0.8,
                  transition: "all 0.3s ease",
                  cursor: "pointer",

                  "&:hover": {
                    opacity: 1,
                    transform: "scale(1.25)",
                  } }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
