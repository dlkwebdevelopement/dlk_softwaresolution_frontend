import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BottomInfo from "../components/BottomInfo";
import ScrollToTop from "../components/ScrollToTop";
import GoogleReviewFloatingButton from "../components/GoogleReviewFloatingButton";

// Direct imports for Home page components (immediate paint, zero flash)
import Banner from "../pages/home/Banner";
import Category from "../pages/home/Category";
import Gallerys from "../pages/home/Gallery";
import Ads from "../pages/home/Ads";
import LogoCarousel from "../pages/home/LogoCarousel";
import QuickEnquiry from "../pages/home/QuickEnquiry";
import LiveClass from "../pages/home/LiveClasses";
import Comments from "../pages/home/Comments";
import WorkshopPage from "../pages/workshop/WorkshopPage";

// Lazy-loaded routes for optimal initial bundle size and smooth execution
const Product = lazy(() => import("../pages/product/Product"));
const OverviewSection = lazy(() => import("../pages/product/CourseOverviewSection"));
const ServicesCards = lazy(() => import("../pages/product/ServicesCards"));
const CourseTools = lazy(() => import("../pages/product/CourseTools"));
const CareerSupport = lazy(() => import("../pages/product/CareerSupport"));
const CourseFAQ = lazy(() => import("../pages/product/CourseFAQ"));
const ContactForm = lazy(() => import("../pages/contact/ContactForm"));
const Videos = lazy(() => import("../pages/videos/Videos"));
const Gallery = lazy(() => import("../pages/gallery/Gallery"));
const OfficeGallery = lazy(() => import("../pages/gallery/OfficeGallery"));
const Offers = lazy(() => import("../pages/offers/Offers"));
const Career = lazy(() => import("../pages/career/Career"));
const Placement = lazy(() => import("../pages/placement/Placement"));
const InternshipPage = lazy(() => import("../pages/internship/InternshipPage"));
const CategoryCourseList = lazy(() => import("../pages/product/CategoryCourseList"));
const PrivacyPolicy = lazy(() => import("../pages/legal/PrivacyPolicy"));
const TermsOfService = lazy(() => import("../pages/legal/TermsOfService"));
const CertificatePage = lazy(() => import("../pages/certificate/CertificatePage"));
const Help = lazy(() => import("../pages/help/Help"));
const NotFound = lazy(() => import("../pages/NotFound"));

const PageFallback = () => (
  <Box sx={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <CircularProgress sx={{ color: "#3DB843" }} size={40} />
  </Box>
);

const AppRoute = () => {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* HOME PAGE */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Box sx={{ mt: 10 }}></Box>
                <Banner />
                <LiveClass />

                <WorkshopPage viewMode="scroll" />
                <Gallerys />
                <QuickEnquiry />

                <Category />
                <Ads />
                <LogoCarousel />
                <Comments />

                <BottomInfo />
                <Footer />
              </>
            }
          />

          {/* HELP PAGE */}
          <Route path="/help" element={<Help />} />

          {/* PRODUCT/COURSE PAGE */}
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
                <BottomInfo />
                <Footer />
              </>
            }
          />

          {/* CONTACT PAGE */}
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

          {/* VIDEOS PAGE */}
          <Route
            path="/videos"
            element={
              <>
                <Navbar />
                <Videos />
                <BottomInfo />
                <Footer />
              </>
            }
          />

          {/* GALLERY PAGES */}
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

          <Route
            path="/office-gallery"
            element={
              <>
                <Navbar />
                <Box sx={{ mt: 10 }}></Box>
                <OfficeGallery />
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
            element={
              <>
                <Navbar />
                <Box sx={{ mt: 10 }}></Box>
                <Placement />
                <BottomInfo />
                <Footer />
              </>
            }
          />

          {/* INTERNSHIP PAGE */}
          <Route
            path="/internship"
            element={
              <>
                <Navbar />
                <Box sx={{ mt: 10 }}></Box>
                <InternshipPage />
                <BottomInfo />
                <Footer />
              </>
            }
          />
          <Route
            path="/internships"
            element={
              <>
                <Navbar />
                <Box sx={{ mt: 10 }}></Box>
                <InternshipPage />
                <BottomInfo />
                <Footer />
              </>
            }
          />

          {/* WORKSHOP PAGE - Grid View Only */}
          <Route
            path="/workshop"
            element={
              <>
                <Navbar />
                <Box sx={{ mt: 10 }}></Box>
                <WorkshopPage viewMode="grid" />
                <BottomInfo />
                <Footer />
              </>
            }
          />

          {/* CATEGORY COURSE LIST PAGE */}
          <Route
            path="/category/:id"
            element={
              <>
                <Navbar />
                <Box sx={{ mt: 10 }}></Box>
                <CategoryCourseList />
                <BottomInfo />
                <Footer />
              </>
            }
          />

          {/* LEGAL PAGES */}
          <Route
            path="/privacy-policy"
            element={
              <>
                <Navbar />
                <Box sx={{ mt: 10 }}></Box>
                <PrivacyPolicy />
                <BottomInfo />
                <Footer />
              </>
            }
          />

          <Route
            path="/terms-of-service"
            element={
              <>
                <Navbar />
                <Box sx={{ mt: 10 }}></Box>
                <TermsOfService />
                <BottomInfo />
                <Footer />
              </>
            }
          />

          <Route
            path="/certificate"
            element={
              <>
                <Navbar />
                <Box sx={{ mt: { xs: 8, md: 10 } }}></Box>
                <CertificatePage />
                <BottomInfo />
                <Footer />
              </>
            }
          />

          {/* 404 NOT FOUND PAGE */}
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
      </Suspense>
      <GoogleReviewFloatingButton />
    </>
  );
};

export default AppRoute;
