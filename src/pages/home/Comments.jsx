import React, { useEffect, useState } from "react";
import { Box, Typography, Avatar, IconButton } from "@mui/material";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import { GetRequest } from "../../api/config";
import { GET_ALL_TESTIMONIALS } from "../../api/endpoints";

export default function Comments() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await GetRequest(GET_ALL_TESTIMONIALS);

        if (res?.success) {
          const activeData = res.data.filter((item) => item.is_active === 1);
          setTestimonials(activeData);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  /** -------------------------
   * 🔥 RESPONSIVE CARD COUNT
   * ------------------------- **/
  useEffect(() => {
    const calculate = () => {
      const w = window.innerWidth;

      if (w < 600)
        setCardsPerView(1); // phone
      else if (w < 960)
        setCardsPerView(2); // tablet
      else setCardsPerView(3); // desktop
    };

    calculate();
    window.addEventListener("resize", calculate);
    return () => window.removeEventListener("resize", calculate);
  }, []);

  /** NAVIGATION **/
  const maxIndex = Math.max(0, testimonials.length - cardsPerView);

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev - 1 < 0 ? maxIndex : prev - 1));

  const handleNext = () =>
    setCurrentIndex((prev) => (prev + 1 > maxIndex ? 0 : prev + 1));

  /** ⭐ FIX — correct slide % calculation **/
  const translateXPercent = -(currentIndex * (100 / cardsPerView));

  return (
    <Box
      sx={{
        maxWidth: "1300px",
        margin: "0px auto",
        width: "100%",
        // background: "rgb(236, 236, 236)",
        color: "white",
        py: { xs: 10, md: 6 },
        position: "relative",
        textAlign: "center" }}
    >
      {/** DARK OVERLAY **/}
      <Box />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1200px",
          mx: "auto",
          px: 2 }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 4,
            color: "#1a4718" }}
        >
          Flashbacks From <span style={{ color: "#83a561" }}> The Past</span>
        </Typography>

        {/** CAROUSEL VIEWPORT **/}
        <Box
          sx={{
            width: "100%",
            overflow: "hidden",
            py: 6,
            position: "relative" }}
        >
          {/** TRACK **/}
          <Box
            sx={{
              display: "flex",
              transition: "transform 0.6s cubic-bezier(.2,.8,.2,1)",
              transform: `translateX(${translateXPercent}%)` }}
          >
            {testimonials.map((item) => (
              <Box
                key={item.id}
                sx={{
                  flex: `0 0 ${100 / cardsPerView}%`,
                  display: "flex",
                  justifyContent: "center",
                  px: 1.5,
                  boxSizing: "border-box" }}
              >
                {/** CARD **/}
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: 300,
                    position: "relative",
                    background: "white",
                    color: "#333",
                    borderRadius: "14px",
                    px: 3,
                    pt: 7,
                    pb: 4,
                    minHeight: 250,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
                    transition: "all 250ms ease",
                    textAlign: "justify",
                    "&:hover": {
                      backgroundColor: "#eae69e",
                      color: "#1a4718",
                      transform: "translateY(-8px)",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                      "& .testimonial-avatar": {
                        borderColor: "white",
                      },
                    } }}
                >
                  <Avatar
                    src={item.image || "/default-avatar.png"}
                    alt={item.name}
                    className="testimonial-avatar"
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      border: "4px solid #48723e",
                      position: "absolute",
                      top: -40,
                      left: "50%",
                      transform: "translateX(-50%)",
                      bgcolor: "white",
                      boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
                      transition: "border-color 200ms ease" }}
                  />

                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, mt: 3 }}
                  >
                    {item.name}{" "}
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ fontWeight: 400 }}
                    >
                      - {item.role}
                    </Typography>
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1.2,
                      lineHeight: 1.6,
                      fontSize: "0.9rem" }}
                  >
                    {item.text}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/** LEFT ARROW **/}
        <IconButton
          onClick={handlePrev}
          sx={{
            position: "absolute",
            top: "55%",
            left: 0,
            transform: "translateY(-50%)",
            bgcolor: "rgba(0,0,0,0.5)",
            color: "white",
            "&:hover": { bgcolor: "#48723e", color: "white" },
            zIndex: 3 }}
        >
          <ArrowBackIosNew />
        </IconButton>

        {/** RIGHT ARROW **/}
        <IconButton
          onClick={handleNext}
          sx={{
            position: "absolute",
            top: "55%",
            right: 0,
            transform: "translateY(-50%)",
            bgcolor: "rgba(0,0,0,0.5)",
            color: "white",
            "&:hover": { bgcolor: "#48723e", color: "white" },
            zIndex: 3 }}
        >
          <ArrowForwardIos />
        </IconButton>
      </Box>
    </Box>
  );
}
