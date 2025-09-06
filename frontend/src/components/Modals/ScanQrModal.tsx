import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ScanQRModal({ open, onClose }: Props) {
  const [isbn, setIsbn] = useState("");

  const handleAdd = () => {
    console.log("Adding ISBN:", isbn);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 420,
          bgcolor: "#1c1c1f",
          color: "white",
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          mx: "auto",
          mt: "10%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Add a new book
        </Typography>
        <Typography variant="body2" color="gray" textAlign="center">
          Scan a barcode or enter an ISBN to add a book to your library.
        </Typography>

        {/* Camera preview placeholder */}
        <Box
          sx={{
            width: "100%",
            height: 160,
            border: "2px dashed #444",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Typography color="gray">Camera View</Typography>
          <Typography variant="caption" color="gray">
            Position the barcode inside the frame
          </Typography>
        </Box>

        <Divider sx={{ width: "100%", my: 1, bgcolor: "#333" }}>OR</Divider>

        <TextField
          placeholder="e.g., 978-3-16-148410-0"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          fullWidth
          size="small"
          sx={{ input: { color: "white" }, label: { color: "gray" } }}
        />

        <Button
          onClick={handleAdd}
          variant="contained"
          sx={{ bgcolor: "red", "&:hover": { bgcolor: "darkred" }, mt: 1 }}
        >
          Add Book
        </Button>
      </Box>
    </Modal>
  );
}
