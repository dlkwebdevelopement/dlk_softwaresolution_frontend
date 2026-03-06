import React, { useState } from "react";
import {
  Box,
  Fab,
  Stack,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import MessageIcon from "@mui/icons-material/Message";
import EnquiryFormAlone from "../pages/home/EnquiryFormAlone";

export default function FloatingEnquiry() {
  const [open, setOpen] = useState(false);

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
            color="success"
            href="https://wa.me/917708150152"
            target="_blank"
          >
            <WhatsAppIcon />
          </Fab>

          {/* Message */}
          <Fab
            sx={{ color: "white", background: "black" }}
            onClick={() => setOpen(true)}
          >
            <MessageIcon />
          </Fab>
        </Stack>
      </Box>

      {/* Enquiry Dialog */}
      <Dialog
        open={open}
        disableScrollLock
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ position: "relative" }}>
          {/* Close Button */}
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 1 }}
          >
            <CloseIcon />
          </IconButton>

          <EnquiryFormAlone />
        </DialogContent>
      </Dialog>
    </>
  );
}
