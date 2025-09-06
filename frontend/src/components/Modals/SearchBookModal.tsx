import {
  Box,
  Modal,
  TextField,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useBookSearch } from "../../hooks/useBookSearch";
import { useCreateBook } from "../../hooks/useBooks";
import { getBestCoverImage, getISBN } from "../../services/bookSearchApi";
import type { BookSearchResult } from "../../services/bookSearchApi";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SearchBookModal({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const { searchResults, search, isSearching, searchError, clearResults } =
    useBookSearch();
  const createBookMutation = useCreateBook();

  const handleSearch = () => {
    if (query.trim()) {
      search(query.trim());
    }
  };

  const handleSelectBook = async (book: BookSearchResult) => {
    try {
      const bookData = {
        title: book.title,
        author: book.authors?.join(", ") || "Unknown Author",
        genre: book.categories?.[0] || undefined,
        pages: book.pageCount || undefined,
        isbn: getISBN(book.industryIdentifiers) || undefined,
        coverUrl: getBestCoverImage(book.imageLinks) || undefined,
        summary: book.description || undefined,
        publishedAt: book.publishedDate || undefined,
      };

      await createBookMutation.mutateAsync(bookData);
      onClose();
      setQuery("");
      clearResults();
    } catch (error) {
      console.error("Failed to add book:", error);
    }
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
          disabled={isSearching || !query.trim()}
          sx={{
            bgcolor: "purple",
            "&:hover": { bgcolor: "darkpurple" },
            "&:disabled": { bgcolor: "gray" },
          }}
        >
          {isSearching ? <CircularProgress size={20} /> : "Search"}
        </Button>

        {searchError && (
          <Alert severity="error" sx={{ bgcolor: "rgba(244, 67, 54, 0.1)" }}>
            {searchError.message}
          </Alert>
        )}

        {searchResults.length > 0 && (
          <Typography variant="subtitle2" color="gray">
            Found {searchResults.length} results
          </Typography>
        )}

        <List sx={{ maxHeight: 400, overflow: "auto" }}>
          {searchResults.map((book) => (
            <ListItem
              key={book.id}
              sx={{
                borderBottom: "1px solid #333",
                cursor: "pointer",
                "&:hover": { bgcolor: "#2a2a2a" },
                flexDirection: "column",
                alignItems: "flex-start",
                py: 2,
              }}
              onClick={() => handleSelectBook(book)}
            >
              <Box sx={{ display: "flex", width: "100%", gap: 2 }}>
                <ListItemAvatar>
                  <Avatar
                    src={getBestCoverImage(book.imageLinks) || undefined}
                    variant="rounded"
                    sx={{ width: 60, height: 80 }}
                  >
                    📖
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight="bold">
                      {book.title}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="gray">
                        by {book.authors?.join(", ") || "Unknown Author"}
                      </Typography>
                      {book.publishedDate && (
                        <Typography variant="caption" color="gray">
                          Published: {book.publishedDate}
                        </Typography>
                      )}
                      {book.pageCount && (
                        <Typography
                          variant="caption"
                          color="gray"
                          sx={{ ml: 1 }}
                        >
                          {book.pageCount} pages
                        </Typography>
                      )}
                      {book.description && (
                        <Typography
                          variant="body2"
                          color="gray"
                          sx={{
                            mt: 1,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {book.description}
                        </Typography>
                      )}
                    </Box>
                  }
                />
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
    </Modal>
  );
}
