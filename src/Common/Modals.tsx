import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  errorMessage?: string;
  color?: string;
}

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4
};

const CustomModal: React.FC<CustomModalProps> = ({ open, onClose, title, message, color = "black" }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="custom-modal-title"
      aria-describedby="custom-modal-description"
    >
      <Box sx={style}>
        <Typography id="custom-modal-title" variant="h6" sx={{ color }}>
          {title}
        </Typography>
        <Typography id="custom-modal-description" sx={{ mt: 2 }}>
          {message}
        </Typography>
        <Button onClick={onClose} sx={{ mt: 2 }} variant="contained" color="primary">
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default CustomModal;