import React from "react";
import { Box, Typography, Button, Container, alpha } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Rocket, ArrowLeft } from "lucide-react";

/**
 * NotFound Component - Now serving as a premium "Coming Soon" placeholder
 * Designed to look premium and integrate with existing Navbar/Footer
 */
const NotFound = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minHeight: "70vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(180deg, #ffffff 0%, #f7fdf7 100%)",
                py: { xs: 10, md: 15 },
                position: "relative",
                overflow: "hidden"
            }}
        >
            {/* Decorative background gradients */}
            <Box
                sx={{
                    position: "absolute",
                    top: "-10%",
                    right: "-5%",
                    width: "400px",
                    height: "400px",
                    background: alpha("#3DB843", 0.05),
                    borderRadius: "50%",
                    filter: "blur(80px)",
                    zIndex: 0
                }}
            />
            <Box
                sx={{
                    position: "absolute",
                    bottom: "-10%",
                    left: "-5%",
                    width: "300px",
                    height: "300px",
                    background: alpha("#1a4718", 0.05),
                    borderRadius: "50%",
                    filter: "blur(60px)",
                    zIndex: 0
                }}
            />

            <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
                <Box
                    sx={{
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}
                >
                    <Box
                        sx={{
                            display: "inline-flex",
                            p: 2.5,
                            borderRadius: "24px",
                            bgcolor: alpha("#3DB843", 0.1),
                            color: "#3DB843",
                            mb: 4,
                            animation: "rocketFloat 3s infinite ease-in-out",
                            boxShadow: "0 20px 40px rgba(61, 184, 67, 0.1)"
                        }}
                    >
                        <Rocket size={48} strokeWidth={2} />
                    </Box>

                    <Typography
                        variant="h1"
                        sx={{
                            fontWeight: 900,
                            fontSize: { xs: "3rem", md: "5rem" },
                            color: "#1a4718",
                            letterSpacing: "-0.03em",
                            lineHeight: 1,
                            mb: 2
                        }}
                    >
                        Coming Soon
                    </Typography>

                    <Typography
                        variant="h5"
                        sx={{
                            color: "#3DB843",
                            fontWeight: 700,
                            mb: 3,
                            textTransform: "uppercase",
                            letterSpacing: "4px"
                        }}
                    >
                        Innovation in Progress
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            maxWidth: "550px",
                            mb: 6,
                            color: "text.secondary",
                            fontSize: "1.1rem",
                            lineHeight: 1.7
                        }}
                    >
                        We're building something exceptional. Our teams are currently putting
                        the finishing touches on this section to provide you with the best
                        possible experience.
                    </Typography>


                </Box>
            </Container>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes rocketFloat {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(5deg); }
                }
            `}} />
        </Box>
    );
};

export default NotFound;
