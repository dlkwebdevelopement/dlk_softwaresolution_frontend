import React, { useEffect, useState } from "react";
import { Box, Typography, Container, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { GetRequest } from "../../api/config";
import { ADMIN_GET_ALL_QUESTIONS } from "../../api/endpoints";

export default function CourseFAQ() {
  const [qa, setQa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("General");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await GetRequest(ADMIN_GET_ALL_QUESTIONS);
        setQa(data || []);
      } catch (err) {
        console.error("Failed to fetch questions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const getFilteredQa = () => {
    if (activeTab === "Placement") return qa.filter(q => /placement|job|hiring/i.test(q.question));
    if (activeTab === "Pricing") return qa.filter(q => /fee|cost|price|pay/i.test(q.question));
    if (activeTab === "Mentor") return qa.filter(q => /mentor|teacher|instructor/i.test(q.question));
    return qa.filter(q => !/placement|job|hiring|fee|cost|price|pay|mentor/i.test(q.question));
  };

  const currentQuestions = getFilteredQa();

  const handleExpand = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ py: 8, bgcolor: "#fff", textAlign: "center" }}>
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, color: "#0f172a", fontFamily: "'Inter', sans-serif" }}>
          Frequently Asked Questions
        </Typography>

        {/* Pill Tabs Categories */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1.5, mb: 6, flexWrap: "wrap" }}>
          {["General", "Placement", "Pricing", "Mentor"].map((tab) => (
            <Box
              key={tab}
              onClick={() => setActiveTab(tab)}
              sx={{
                px: 3.5,
                py: 1.2,
                borderRadius: "30px",
                border: "1px solid #e2e8f0",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "0.95rem",
                transition: "all 0.3s ease",
                bgcolor: activeTab === tab ? "#0f172a" : "transparent",
                color: activeTab === tab ? "#fff" : "#475569",
                boxShadow: activeTab === tab ? "0 4px 6px -1px rgba(0,0,0,0.1)" : "none",
                "&:hover": {
                  bgcolor: activeTab === tab ? "#0f172a" : "#f8fafc",
                }
              }}
            >
              {tab}
            </Box>
          ))}
        </Box>

        {/* FAQ List Accordions Accordions */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {currentQuestions.map((item, index) => (
            <Accordion
              key={item._id || index}
              expanded={expanded === index}
              onChange={handleExpand(index)}
              elevation={0}
              sx={{
                border: "1.5px solid #f1f5f9",
                borderRadius: "16px !important",
                bgcolor: "#F9F8FF", // light lilac tint resembling the screenshot
                "&:before": { display: "none" },
                overflow: "hidden",
                transition: "all 0.3s ease",
                mb: 1
              }}
            >
              <AccordionSummary
                expandIcon={
                  <Box sx={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    bgcolor: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #e2e8f0",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.03)"
                  }}>
                    {expanded === index ? <RemoveIcon sx={{ fontSize: 20 }} /> : <AddIcon sx={{ fontSize: 20 }} />}
                  </Box>
                }
                sx={{
                  "& .MuiAccordionSummary-content": { margin: "22px 0" },
                  px: 3,
                }}
              >
                <Typography sx={{ fontWeight: 700, color: "#1e293b", textAlign: "left", flex: 1, fontSize: "1rem" }}>
                  {item.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pb: 2.5, pt: 0, textAlign: "left" }}>
                {item.answers && item.answers.map((ans, idx) => (
                  <Typography key={ans._id || idx} sx={{ color: "#64748b", mb: 0.8, fontSize: "0.95rem" }}>
                    • {ans.answer}
                  </Typography>
                ))}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
