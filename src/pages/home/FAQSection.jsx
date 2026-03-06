import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { GetRequest } from "../../api/config";
import { ADMIN_GET_ALL_QUESTIONS } from "../../api/endpoints";

export default function FAQSection() {
  const [qa, setQa] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await GetRequest(ADMIN_GET_ALL_QUESTIONS);
        setQa(data);
      } catch (err) {
        console.error("Failed to fetch Question and answers:", err);
      }
    };
    fetch();
  }, []);

  return (
    <Box
      sx={{
        py: { xs: 4, md: 5 } }}
    >
      <Box
        sx={{
          maxWidth: "900px",
          mx: "auto",
          px: { xs: 2, md: 0 } }}
      >
        {/* HEADER */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 2,
              
              color: "#1a4718"
            }}
          >
            Frequently Asked{" "}
            <Box component="span" sx={{ color: "#83a561" }}>
              Questions
            </Box>
          </Typography>

          <Typography sx={{ color: "text.secondary" }}>
            Everything you need to know before getting started
          </Typography>
        </Box>

        {/* FAQ LIST */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {qa.map((item, i) => (
            <Accordion
              key={i}
              disableGutters
              elevation={0}
              sx={{
                borderRadius: "14px",
                overflow: "hidden",
                border: "1px solid rgba(0,0,0,0.05)",
                "&:before": { display: "none" },
                backgroundColor: "#fff",
                boxShadow: "0 10px 30px rgba(0,0,0,0.04)" }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "#22c55e" }} />}
                sx={{
                  px: 3,
                  py: 2,
                  "& .MuiAccordionSummary-content": {
                    margin: 0,
                  } }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: "16px" }}
                >
                  {item.question}
                </Typography>
              </AccordionSummary>

              <AccordionDetails
                sx={{
                  px: 3,
                  pb: 3,
                  pt: 0 }}
              >
                {item.answers.map((ans) => (
                  <Typography
                    sx={{
                      color: "text.secondary",
                      lineHeight: 1.7 }}
                  >
                    {ans.answer}
                  </Typography>
                ))}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
