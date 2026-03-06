import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import Banner from "../pages/home/Banner";
import Category from "../pages/home/Category";
import Ads from "../pages/home/Ads";
import Product from "../pages/product/Product";
import LogoCarousel from "../pages/home/LogoCarousel";
import QuickEnquiry from "../pages/home/QuickEnquiry";
import FAQSection from "../pages/home/FAQSection";
import Companies from "../pages/home/Companies";
import ContactForm from "../pages/contact/ContactForm";
import LiveClass from "../pages/home/LiveClasses";
import { Box } from "@mui/material";
import BottomInfo from "../components/BottomInfo";
import Comments from "../pages/home/Comments";
import ServicesCards from "../pages/product/ServicesCards";
import PricingPlans from "../pages/product/PricingPlans";
import ScrollToTop from "../components/ScrollToTop";
import OverviewSection from "../pages/product/CourseOverviewSection";
import Blog from "../pages/home/Blog";
import BlogBanner from "../pages/blog/BlogBanner";
import BlogContentPage from "../pages/blog/BlogContentPage";
import NotFound from "../pages/NotFound";

const AppRoute = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* HOME */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Box sx={{ mt: 10 }}></Box>
              <Banner />
              <Category />
              <LiveClass />
              <QuickEnquiry />
              <Ads />
              {/* <Companies /> */}
              <LogoCarousel />
              <Comments />
              <Blog />
              <FAQSection />
              <BottomInfo />
              <Footer />
            </>
          }
        />

        {/*PRODUCT PAGE */}
        <Route
          path="/course/:slug"
          element={
            <>
              <Navbar />
              <Box sx={{ mt: 12 }}></Box>
              <Product />
              <OverviewSection />
              <ServicesCards />
              <PricingPlans />
              <BottomInfo />
              <Footer />
            </>
          }
        />
        {/*CONTACT PAGE */}
        <Route
          path="/contact"
          element={
            <>
              <Navbar />
              <Box sx={{ mt: 8 }}></Box>
              <ContactForm />
              <BottomInfo />
              <Footer />
            </>
          }
        />
        {/*Blog PAGE */}
        <Route
          path="/blogs/:slug"
          element={
            <>
              <Navbar />
              <Box sx={{ mt: 15 }}></Box>
              <BlogBanner />
              <BlogContentPage />
              <BottomInfo />
              <Footer />
            </>
          }
        />
        {/* 404 PAGE */}
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <NotFound />
              <BottomInfo />
              <Footer />
            </>
          }
        />
      </Routes>
    </>
  );
};

export default AppRoute;
