import {
  Box,
  Button,
  Modal,
  TextField,
  MenuItem,
  Typography,
  Alert,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useUpdateBook } from "../../hooks/useBooks";
import { useBookSearch } from "../../hooks/useBookSearch";
import {
  getBestCoverImage,
  getISBN,
  searchBooks,
} from "../../services/bookSearchApi";
import type { CreateBookRequest, Book } from "../../types";
import type { BookSearchResult } from "../../services/bookSearchApi";

interface EditBookModalProps {
  open: boolean;
  onClose: () => void;
  book: Book;
}

export default function EditBookModal({
  open,
  onClose,
  book,
}: EditBookModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    year: "",
    genre: "",
    description: "",
    pages: "",
    coverUrl: "",
  });
  const [error, setError] = useState("");
  const [isAutoSearching, setIsAutoSearching] = useState(false);

  const updateBookMutation = useUpdateBook();
  const { searchResults, search, isSearching, clearResults } = useBookSearch();

  // Initialize form data when book changes
  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn || "",
        year: book.publishedAt
          ? new Date(book.publishedAt).getFullYear().toString()
          : "",
        genre: book.genre || "",
        description: book.summary || "",
        pages: book.pages?.toString() || "",
        coverUrl: book.coverUrl || "",
      });
    }
  }, [book]);

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setFormData({ ...formData, [field]: e.target.value });

  const handleSearchBook = () => {
    if (formData.title.trim() || formData.author.trim()) {
      const query = `${formData.title} ${formData.author}`.trim();
      search(query);
    }
  };

  const handleSelectSearchResult = (searchBook: BookSearchResult) => {
    setFormData({
      title: searchBook.title,
      author: searchBook.authors?.join(", ") || "",
      isbn: getISBN(searchBook.industryIdentifiers) || "",
      year: searchBook.publishedDate || "",
      genre: searchBook.categories?.[0] || "",
      description: searchBook.description || "",
      pages: searchBook.pageCount?.toString() || "",
      coverUrl: getBestCoverImage(searchBook.imageLinks) || "",
    });
    clearResults();
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.author) {
      setError("Title and author are required");
      return;
    }

    setError("");

    try {
      // Check if we need to search for missing information
      const needsSearch =
        !formData.coverUrl ||
        !formData.isbn ||
        !formData.pages ||
        !formData.description;

      const baseBookData: CreateBookRequest = {
        title: formData.title,
        author: formData.author,
        isbn: formData.isbn || undefined,
        genre: formData.genre || undefined,
        summary: formData.description || undefined,
        coverUrl: formData.coverUrl || undefined,
        pages: formData.pages ? parseInt(formData.pages) : undefined,
        publishedAt: formData.year ? `${formData.year}-01-01` : undefined,
      };

      let finalBookData = { ...baseBookData };

      // If we need to search for missing info, try to find it
      if (needsSearch) {
        setIsAutoSearching(true);
        try {
          const searchResults = await searchBooks(
            `${formData.title} ${formData.author}`,
            1
          );
          if (searchResults.length > 0) {
            const foundBook = searchResults[0];

            // Fill in missing information
            finalBookData = {
              ...finalBookData,
              coverUrl:
                finalBookData.coverUrl ||
                getBestCoverImage(foundBook.imageLinks) ||
                undefined,
              isbn:
                finalBookData.isbn ||
                getISBN(foundBook.industryIdentifiers) ||
                undefined,
              pages: finalBookData.pages || foundBook.pageCount || undefined,
              summary:
                finalBookData.summary || foundBook.description || undefined,
              genre:
                finalBookData.genre || foundBook.categories?.[0] || undefined,
              publishedAt:
                finalBookData.publishedAt ||
                foundBook.publishedDate ||
                undefined,
            };
          }
        } catch (searchError) {
          console.warn(
            "Failed to search for additional book info:",
            searchError
          );
          // Continue with the original data if search fails
        } finally {
          setIsAutoSearching(false);
        }
      }

      await updateBookMutation.mutateAsync({
        id: book.id,
        ...finalBookData,
      });
      onClose();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message || "Failed to update book"
          : "Failed to update book";
      setError(errorMessage);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 500,
          bgcolor: "#1c1c1f",
          color: "white",
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          mx: "auto",
          mt: "5%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Edit Book
        </Typography>

        {error && (
          <Alert severity="error" sx={{ bgcolor: "rgba(244, 67, 54, 0.1)" }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Title"
          placeholder="e.g., The Great Gatsby"
          value={formData.title}
          onChange={handleChange("title")}
          fullWidth
          size="small"
          sx={{ input: { color: "white" }, label: { color: "gray" } }}
        />
        <TextField
          label="Author"
          placeholder="e.g., F. Scott Fitzgerald"
          value={formData.author}
          onChange={handleChange("author")}
          fullWidth
          size="small"
          sx={{ input: { color: "white" }, label: { color: "gray" } }}
        />

        <Button
          onClick={handleSearchBook}
          variant="outlined"
          disabled={
            isSearching || (!formData.title.trim() && !formData.author.trim())
          }
          sx={{
            borderColor: "purple",
            color: "purple",
            "&:hover": {
              borderColor: "darkpurple",
              bgcolor: "rgba(128, 0, 128, 0.1)",
            },
          }}
        >
          {isSearching ? "Searching..." : "🔍 Search for Updated Details"}
        </Button>

        <TextField
          label="ISBN"
          placeholder="e.g., 9780743273565"
          value={formData.isbn}
          onChange={handleChange("isbn")}
          fullWidth
          size="small"
          sx={{ input: { color: "white" }, label: { color: "gray" } }}
        />
        <TextField
          label="Publication Year"
          placeholder="e.g., 1925"
          value={formData.year}
          onChange={handleChange("year")}
          fullWidth
          size="small"
          sx={{ input: { color: "white" }, label: { color: "gray" } }}
        />
        <TextField
          label="Pages"
          placeholder="e.g., 180"
          value={formData.pages}
          onChange={handleChange("pages")}
          fullWidth
          size="small"
          sx={{ input: { color: "white" }, label: { color: "gray" } }}
        />
        <TextField
          label="Cover URL"
          placeholder="e.g., https://example.com/cover.jpg"
          value={formData.coverUrl}
          onChange={handleChange("coverUrl")}
          fullWidth
          size="small"
          sx={{ input: { color: "white" }, label: { color: "gray" } }}
        />
        <TextField
          select
          label="Genre"
          value={formData.genre}
          onChange={handleChange("genre")}
          fullWidth
          size="small"
          sx={{
            label: { color: "gray" },
            ".MuiSelect-icon": { color: "white" },
          }}
        >
          <MenuItem value="">Select Genre</MenuItem>
          <MenuItem value="Fiction">Fiction</MenuItem>
          <MenuItem value="Non-Fiction">Non-Fiction</MenuItem>
          <MenuItem value="Mystery">Mystery</MenuItem>
          <MenuItem value="Romance">Romance</MenuItem>
          <MenuItem value="Science Fiction">Science Fiction</MenuItem>
          <MenuItem value="Fantasy">Fantasy</MenuItem>
          <MenuItem value="Biography">Biography</MenuItem>
          <MenuItem value="History">History</MenuItem>
          <MenuItem value="Self-Help">Self-Help</MenuItem>
          <MenuItem value="Business">Business</MenuItem>
          <MenuItem value="Technology">Technology</MenuItem>
        </TextField>
        <TextField
          label="Description"
          placeholder="A brief summary..."
          multiline
          rows={3}
          value={formData.description}
          onChange={handleChange("description")}
          fullWidth
          size="small"
          sx={{ textarea: { color: "white" }, label: { color: "gray" } }}
        />

        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={updateBookMutation.isPending || isAutoSearching}
          sx={{
            mt: 1,
            bgcolor: "purple",
            "&:hover": { bgcolor: "darkpurple" },
            "&:disabled": { bgcolor: "gray" },
          }}
        >
          {isAutoSearching
            ? "🔍 Finding updated details..."
            : updateBookMutation.isPending
            ? "Updating Book..."
            : "Update Book"}
        </Button>

        {searchResults.length > 0 && (
          <Box sx={{ mt: 2, maxHeight: 200, overflow: "auto" }}>
            <Typography variant="subtitle2" color="gray" sx={{ mb: 1 }}>
              Search Results - Click to auto-fill:
            </Typography>
            {searchResults.slice(0, 3).map((searchBook) => (
              <Box
                key={searchBook.id}
                onClick={() => handleSelectSearchResult(searchBook)}
                sx={{
                  p: 1,
                  border: "1px solid #333",
                  borderRadius: 1,
                  mb: 1,
                  cursor: "pointer",
                  "&:hover": { bgcolor: "#2a2a2a" },
                }}
              >
                <Typography variant="body2" fontWeight="bold">
                  {searchBook.title}
                </Typography>
                <Typography variant="caption" color="gray">
                  by {searchBook.authors?.join(", ") || "Unknown Author"}
                </Typography>
                {searchBook.publishedDate && (
                  <Typography variant="caption" color="gray" sx={{ ml: 1 }}>
                    ({searchBook.publishedDate})
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Modal>
  );
}
