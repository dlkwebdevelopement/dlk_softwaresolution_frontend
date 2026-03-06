import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GetRequest } from "../../api/config";
import { ADMIN_GET_CATEGORIES } from "../../api/endpoints";
import { BASE_URL } from "../../api/api";

const Category = () => {
  const navigate = useNavigate();
  const [cats, setCats] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await GetRequest(ADMIN_GET_CATEGORIES);
        setCats(data);
      } catch (err) {
        console.error("Failed to fetch Categories", err);
      }
    };
    fetch();
  }, []);
  return (
    <Box
      sx={{
        
        width: "100%",
        margin: "auto",
        display: "flex",
        justifyContent: { xs: "flex-start", lg: "start" },
        gap: { xs: "18px", md: "25px" },
        maxWidth: "80%",
        padding: "75px 20px 40px 20px",
        overflowX: { xs: "auto", lg: "visible" },
        overflowY: "hidden",
        flexWrap: "nowrap",
        scrollBehavior: "smooth",

        /* hide scrollbar */
        "&::-webkit-scrollbar": { display: "none" },
        scrollbarWidth: "none",
        msOverflowStyle: "none" }}
    >
      {cats.map((cat, index) => (
        <Box
          key={index}
          sx={{
            textAlign: "center",
            cursor: "pointer",
            flex: "0 0 auto" }}
        >
          <Box
            component="img"
            onClick={() => navigate("/")}
            src={`${BASE_URL}/${cat.image}`}
            alt={cat.label}
            sx={{
              width: { xs: "70px", sm: "80px", lg: "90px" },
              height: { xs: "70px", sm: "80px", lg: "90px" },
              objectFit: "cover",
              borderRadius: "18px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 18px rgba(0,0,0,0.25)",
              } }}
          />

          <Typography
            sx={{
              mt: "8px",
              fontSize: { xs: "12px", sm: "13px", lg: "14px" },
              fontWeight: 600,
              width: "150px",
              color: "#333",
              lineHeight: { xs: "16px", lg: "18px" },
              whiteSpace: "pre-line" }}
          >
            {cat.category}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default Category;
