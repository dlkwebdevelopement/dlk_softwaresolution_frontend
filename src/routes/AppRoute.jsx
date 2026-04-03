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
import CourseTools from "../pages/product/CourseTools";
import CareerSupport from "../pages/product/CareerSupport";
import CourseFAQ from "../pages/product/CourseFAQ";
import PricingPlans from "../pages/product/PricingPlans";
import ScrollToTop from "../components/ScrollToTop";
import OverviewSection from "../pages/product/CourseOverviewSection";
import Blog from "../pages/home/Blog";
import BlogBanner from "../pages/blog/BlogBanner";
import BlogContentPage from "../pages/blog/BlogContentPage";
import StudentProjects from "../pages/home/StudentProjects";
import StudentProjectBanner from "../pages/student-projects/StudentProjectBanner";
import StudentProjectContentPage from "../pages/student-projects/StudentProjectContentPage";
import StudentProjectList from "../pages/student-projects/StudentProjectList";
import Career from "../pages/career/Career";
import NotFound from "../pages/NotFound";

import Help from "../pages/help/Help";
import Videos from "../pages/videos/Videos";
import Gallery from "../pages/gallery/Gallery";
import Offers from "../pages/offers/Offers";
import Placement from "../pages/placement/Placement";
import GoogleReviewFloatingButton from "../components/GoogleReviewFloatingButton";

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
              <LiveClass />
              <QuickEnquiry />
              <Category />
              <Ads />
              {/* <Companies /> */}
              <LogoCarousel />
              <Comments />
              <Blog />
              <StudentProjects />
              <BottomInfo />
              <Footer />
            </>
          }
        />

        {/* HELP PAGE */}
        <Route path="/help" element={<Help />} />

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
              <CourseTools />
              <CareerSupport />
              <CourseFAQ />
              {/* <PricingPlans /> */}
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
        {/*Student Project PAGE */}
        <Route
          path="/student-projects"
          element={
            <>
              <Navbar />
              <Box sx={{ mt: 10 }}></Box>
              <StudentProjectList />
              <BottomInfo />
              <Footer />
            </>
          }
        />
        <Route
          path="/student-projects/:slug"
          element={
            <>
              <Navbar />
              <Box sx={{ mt: 15 }}></Box>
              <StudentProjectBanner />
              <StudentProjectContentPage />
              <BottomInfo />
              <Footer />
            </>
          }
        />
        {/* VIDEOS PAGE */}
        <Route
          path="/videos"
          element={
            <>
              <Navbar />
              <Box sx={{ mt: 16 }}></Box>
              <Videos />
              <BottomInfo />
              <Footer />
            </>
          }
        />
        {/* GALLERY PAGE */}
        <Route
          path="/gallery"
          element={
            <>
              <Navbar />
              <Box sx={{ mt: 10 }}></Box>
              <Gallery />
              <BottomInfo />
              <Footer />
            </>
          }
        />
        {/* OFFERS PAGE */}
        <Route
          path="/offers"
          element={
            <>
              <Navbar />
              <Box sx={{ mt: 10 }}></Box>
              <Offers />
              <BottomInfo />
              <Footer />
            </>
          }
        />
        {/* CAREER PAGE */}
        <Route
          path="/career"
          element={
            <>
              <Navbar />
              <Box sx={{ mt: { xs: 8, md: 10 } }}></Box>
              <Career />
              <BottomInfo />
              <Footer />
            </>
          }
        />
        {/* PLACEMENT PAGE */}
        <Route
          path="/placement"
          element={<Placement />}
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
      <GoogleReviewFloatingButton />
    </>
  );
};

export default AppRoute;
