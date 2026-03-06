import { Box, Typography, Stack, useTheme, useMediaQuery } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import TelegramIcon from "@mui/icons-material/Telegram";

const BottomInfo = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "35px",
        background: "#e1e864",
        zIndex: 1400,
        display: "flex",
        alignItems: "center",
        px: { xs: 1, md: 10 },
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
      >
        {/* Left */}
        <Stack direction="row" spacing={4} alignItems="center">
          <Stack direction="row" spacing={0.5} alignItems="center" padding={1}>
            <PhoneIcon sx={{ fontSize: 16, color: "#1a4718" }} />
            <Typography
              sx={{
                fontSize: { xs: 11, md: 15 },
                fontWeight: 700,
                background:
                  "linear-gradient(270deg, #121111, #b3bd68, #242416)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "textMove 3s linear infinite",

                "@keyframes textMove": {
                  "0%": { backgroundPosition: "200% center" },
                  "100%": { backgroundPosition: "-200% center" },
                },
              }}
            >
              Business No:{" "}
              {isMobile
                ? "+91 7708150152"
                : "+91 7708150152, +91 9751800789, +91 7904320834"}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={0.5} alignItems="center">
            <EmailIcon sx={{ fontSize: 16, color: "#1a4718" }} />
            <Typography sx={{ color: "#1a4718", fontSize: { xs: 11, md: 14 } }}>
              dlksoftwaresolutions@gmail.com
            </Typography>
          </Stack>
        </Stack>

        {/* Right */}
        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
          sx={{
            background: "#1a4718",
            height: "35px",
            width: "300px",
            display: { xs: "none", sm: "flex" },
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TelegramIcon sx={{ fontSize: 16, color: "#fff" }} />
          <Typography sx={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>
            FREE CAREER COUNSELLING
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default BottomInfo;
