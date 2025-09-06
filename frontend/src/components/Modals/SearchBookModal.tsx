import {
  Box,
  Modal,
  TextField,
  Typography,
  Button,
  List,
  ListItem,
} from "@mui/material";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SearchBookModal({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);

  const handleSearch = () => {
    // TODO: Replace with API call
    setResults(["The Great Gatsby", "To Kill a Mockingbird", "1984"]);
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
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Search for a Book
        </Typography>

        <TextField
          placeholder="Search by title, author, ISBN..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          fullWidth
          size="small"
          sx={{ input: { color: "white" }, label: { color: "gray" } }}
        />

        <Button
          onClick={handleSearch}
          variant="contained"
          sx={{ bgcolor: "red", "&:hover": { bgcolor: "darkred" } }}
        >
          Search
        </Button>

        <List>
          {results.map((r, i) => (
            <ListItem
              key={i}
              sx={{
                borderBottom: "1px solid #333",
                cursor: "pointer",
                "&:hover": { bgcolor: "#2a2a2a" },
              }}
              onClick={() => {
                console.log("Selected:", r);
                onClose();
              }}
            >
              {r}
            </ListItem>
          ))}
        </List>
      </Box>
    </Modal>
  );
}
