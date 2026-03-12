import React from "react";
import { Box } from "@mui/material";
import Navbar from "../../components/Navbar";
import FAQSection from "../home/FAQSection";
import BottomInfo from "../../components/BottomInfo";
import Footer from "../../components/Footer";

const Help = () => {
  return (
    <>
      <Navbar />
      <Box sx={{ mt: 12 }}>
        <FAQSection />
      </Box>
      <BottomInfo />
      <Footer />
    </>
  );
};

export default Help;
