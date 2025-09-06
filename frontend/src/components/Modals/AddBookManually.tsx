import {
  Box,
  Button,
  Modal,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

interface AddBookModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddBookModal({ open, onClose }: AddBookModalProps) {
  const [book, setBook] = useState({
    title: "",
    author: "",
    isbn: "",
    year: "",
    genre: "",
    description: "",
  });

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setBook({ ...book, [field]: e.target.value });

  const handleSubmit = () => {
    console.log("Book to add:", book);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 400,
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
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Add Book Manually
        </Typography>

        <TextField
          label="Title"
          placeholder="e.g., The Great Gatsby"
          value={book.title}
          onChange={handleChange("title")}
          fullWidth
          size="small"
          sx={{ input: { color: "white" }, label: { color: "gray" } }}
        />
        <TextField
          label="Author"
          placeholder="e.g., F. Scott Fitzgerald"
          value={book.author}
          onChange={handleChange("author")}
          fullWidth
          size="small"
          sx={{ input: { color: "white" }, label: { color: "gray" } }}
        />
        <TextField
          label="ISBN"
          placeholder="e.g., 9780743273565"
          value={book.isbn}
          onChange={handleChange("isbn")}
          fullWidth
          size="small"
          sx={{ input: { color: "white" }, label: { color: "gray" } }}
        />
        <TextField
          label="Publication Year"
          placeholder="e.g., 1925"
          value={book.year}
          onChange={handleChange("year")}
          fullWidth
          size="small"
          sx={{ input: { color: "white" }, label: { color: "gray" } }}
        />
        <TextField
          select
          label="Genre"
          value={book.genre}
          onChange={handleChange("genre")}
          fullWidth
          size="small"
          sx={{
            label: { color: "gray" },
            ".MuiSelect-icon": { color: "white" },
          }}
        >
          <MenuItem value="fiction">Fiction</MenuItem>
          <MenuItem value="classic">Classic</MenuItem>
          <MenuItem value="biography">Biography</MenuItem>
        </TextField>
        <TextField
          label="Description"
          placeholder="A brief summary..."
          multiline
          rows={3}
          value={book.description}
          onChange={handleChange("description")}
          fullWidth
          size="small"
          sx={{ textarea: { color: "white" }, label: { color: "gray" } }}
        />

        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{ mt: 1, bgcolor: "red", "&:hover": { bgcolor: "darkred" } }}
        >
          Add Book
        </Button>
      </Box>
    </Modal>
  );
}
