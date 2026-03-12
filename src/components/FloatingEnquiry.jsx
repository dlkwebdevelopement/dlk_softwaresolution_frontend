import React from "react";
import {
  Box,
  Fab,
  Stack,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

export default function FloatingEnquiry() {
  return (
    <>
      {/* Floating Buttons */}
      <Box
        sx={{
          position: "fixed",
          bottom: 60,
          right: 20,
          zIndex: 1300 }}
      >
        <Stack spacing={2}>
          {/* WhatsApp */}
          <Fab
            sx={{ 
              overflow: 'hidden',
              padding: 0
            }}
            href="https://wa.me/917708150152"
            target="_blank"
          >
            <img 
              src="/photos/whatsapp-icon.png" 
              alt="WhatsApp" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </Fab>
        </Stack>
      </Box>
    </>
  );
}
