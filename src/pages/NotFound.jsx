import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                    textAlign: "center",
                    py: 10,
                }}
            >
                <SentimentVeryDissatisfiedIcon
                    sx={{ fontSize: 120, mb: 4, color: "primary.main" }}
                />
                <Typography
                    variant="h1"
                    sx={{
                        fontWeight: 800,
                        fontSize: { xs: "80px", md: "120px" },
                        color: "primary.dark",
                        lineHeight: 1,
                        mb: 2,
                    }}
                >
                    404
                </Typography>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 600,
                        mb: 3,
                        color: "text.primary",
                    }}
                >
                    Oops! Page Not Found
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        maxWidth: "500px",
                        mb: 5,
                        color: "text.secondary",
                        fontSize: "1.1rem",
                    }}
                >
                    The page you are looking for might have been removed, had its name
                    changed, or is temporarily unavailable.
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate("/")}
                    sx={{
                        px: 6,
                        py: 1.5,
                        borderRadius: "12px",
                        textTransform: "none",
                        fontSize: "1.1rem",
                        boxShadow: "0 10px 20px rgba(72, 114, 62, 0.2)",
                        "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 15px 30px rgba(72, 114, 62, 0.3)",
                        },
                        transition: "all 0.3s ease",
                    }}
                >
                    Back to Homepage
                </Button>
            </Box>
        </Container>
    );
};

export default NotFound;
