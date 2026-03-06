import React from "react";
import { Box, Typography, TextField, Button, Stack, Link } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: "20px",

        background: "linear-gradient(330deg, #eae69e 0%, #48723e 100%)",
        color: "#1a4718",
        px: { xs: "15px", sm: "40px", md: "70px" },
        py: { xs: "40px", md: "50px" },
      }}
    >
      {/* NEWSLETTER */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          mb: "50px",
          gap: "10px",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "16px", md: "18px" },
            textAlign: { xs: "center", md: "left" },
          }}
        >
          If you want to Leave a Query!
        </Typography>

        <Box
          sx={{
            display: "flex",
            width: { xs: "100%", md: "auto" },
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <TextField
            type="email"
            placeholder="Enter Email Address"
            variant="outlined"
            sx={{
              width: { xs: "100%", md: "300px" },
              backgroundColor: "#fff",
              borderRadius: { xs: "4px", md: "4px 0 0 4px" },
              "& fieldset": { border: "none" },
            }}
            InputProps={{
              sx: {
                height: "44px",
                px: "5px",
              },
            }}
          />

          <Button
            sx={{
              height: "44px",
              px: "20px",
              backgroundColor: "#1a4718",
              color: "#ffffff",
              borderRadius: { xs: "4px", md: "0 4px 4px 0" },
              mt: { xs: "8px", md: "0" },
              "&:hover": {
                backgroundColor: "#798d4f",
                color: "white",
              },
            }}
          >
            Submit
          </Button>
        </Box>
      </Box>

      {/* FOOTER COLUMNS */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: { xs: "30px", md: "50px" },
          justifyContent: "space-between",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* SOCIAL LINKS */}
        <Box>
          <Typography sx={headingStyle}>Follow Us</Typography>

          <Stack direction="row" spacing="15px">
            {socialIcons.map((icon, index) => (
              <Box
                key={index}
                component="a"
                href="#"
                target="_blank"
                sx={{
                  display: "inline-block",
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.2)" },
                }}
              >
                <img
                  src={icon}
                  alt="social"
                  width="30"
                  height="30"
                  style={{ filter: "none" }}
                />
              </Box>
            ))}
          </Stack>
        </Box>

        {/* EXPLORE */}
        <FooterColumn
          title="Explore"
          items={["Register", "Our News", "Contact Us"]}
        />

        {/* TOP CATEGORIES */}
        <FooterColumn
          title="Top Courses"
          items={["AI & ML", "Web Development", "Java", "Python", "AWS"]}
        />

        {/* IMPORTANT LINKS */}
        <FooterColumn
          title="Important Links"
          items={["Help", "About", "Terms & Services"]}
        />
      </Box>
    </Box>
  );
};

const FooterColumn = ({ title, items }) => (
  <Box>
    <Typography sx={headingStyle}>{title}</Typography>
    <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
      {items.map((item, index) => (
        <Box
          component="li"
          key={index}
          sx={{
            mb: { xs: "8px", md: "12px" },
            fontSize: { xs: "12px", md: "14px" },
          }}
        >
          <Link
            href="#"
            sx={{
              textDecoration: "none",
              color: "#48723e",

              "&:hover": { color: "#1a4718" },
            }}
          >
            {item}
          </Link>
        </Box>
      ))}
    </Box>
  </Box>
);

const headingStyle = {
  fontSize: { xs: "14px", md: "16px" },
  fontWeight: "bold",
  mb: "20px",
};

const socialIcons = [
  "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg",
  "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/twitter.svg",
  "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg",
  "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg",
];

export default Footer;
