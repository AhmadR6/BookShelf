import { useState } from "react";
import { useAuth } from "../hooks/useAuthContext";
import { useCreateBook } from "../hooks/useBooks";
import {
  usePopularBooks,
  useNewReleases,
  useBooksByCategory,
} from "../hooks/useExplore";
import { getBestCoverImage, getISBN } from "../services/bookSearchApi";
import Navbar from "../components/Navbar";
import {
  Box,
  Typography,
  Grid,
  Chip,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Snackbar,
  IconButton,
} from "@mui/material";
import { Add, Star, NewReleases, Category } from "@mui/icons-material";
import type { BookSearchResult } from "../services/bookSearchApi";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`explore-tabpanel-${index}`}
      aria-labelledby={`explore-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const categories = [
  "Fiction",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Fantasy",
  "Biography",
  "History",
  "Self-Help",
  "Business",
  "Technology",
];

const BookCard = ({
  book,
  onAdd,
  disabled,
}: {
  book: BookSearchResult;
  onAdd: () => void;
  disabled: boolean;
}) => {
  const cover =
    getBestCoverImage(book.imageLinks) || "/assets/covers/default-book.svg";

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    if (target.src !== "/assets/covers/default-book.svg") {
      target.src = "/assets/covers/default-book.svg";
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "#1a1a1a",
        border: "1px solid #333",
        borderRadius: 1,
        width: 280,
        height: 380,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "transform 0.15s, box-shadow 0.15s",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
        },
      }}
    >
      <Box
        sx={{
          height: 200,
          width: "100%",
          position: "relative",
          bgcolor: "#2a2a2a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          component="img"
          src={cover}
          alt={book.title || "Book cover"}
          onError={handleImageError}
          sx={{
            maxWidth: "100%",
            maxHeight: "100%",
            width: "auto",
            height: "auto",
            objectFit: "contain",
            borderRadius: "4px 4px 0 0",
          }}
        />
      </Box>
      <Box
        sx={{
          p: 1.5,
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          minHeight: 0,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            color: "white",
            fontWeight: 600,
            lineHeight: 1.2,
            mb: 0.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "2.4em",
          }}
        >
          {book.title}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: "#888",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            mb: 0.5,
            minHeight: "1.2em",
          }}
        >
          {book.authors?.join(", ") || "Unknown Author"}
        </Typography>
        {book.categories?.length ? (
          <Chip
            label={book.categories[0]}
            size="small"
            sx={{
              bgcolor: "#7b1fa2",
              color: "white",
              fontSize: "0.65rem",
              mb: 1,
              alignSelf: "flex-start",
              maxWidth: "100%",
            }}
          />
        ) : (
          <Box sx={{ mb: 4 }} />
        )}
        <Box
          sx={{
            mt: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pt: 1,
          }}
        >
          <Typography variant="caption" sx={{ color: "#888" }}>
            {book.publishedDate
              ? new Date(book.publishedDate).getFullYear()
              : ""}
          </Typography>
          <IconButton
            onClick={onAdd}
            disabled={disabled}
            size="small"
            sx={{
              bgcolor: "#7b1fa2",
              color: "white",
              width: 32,
              height: 32,
              "&:hover": { bgcolor: "#6a1b9a" },
              "&:disabled": { bgcolor: "#555", color: "#888" },
            }}
          >
            <Add fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default function Explore() {
  const { isAuthenticated } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("Fiction");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const createBookMutation = useCreateBook();

  const {
    data: popularBooks,
    isLoading: popularLoading,
    error: popularError,
  } = usePopularBooks(24);
  const {
    data: newReleases,
    isLoading: newReleasesLoading,
    error: newReleasesError,
  } = useNewReleases(24);
  const {
    data: categoryBooks,
    isLoading: categoryLoading,
    error: categoryError,
  } = useBooksByCategory(selectedCategory, 24);

  const handleAddToLibrary = async (book: BookSearchResult) => {
    if (!isAuthenticated) {
      setSnackbarMessage("Please log in to add books to your library");
      setSnackbarOpen(true);
      return;
    }
    try {
      await createBookMutation.mutateAsync({
        title: book.title,
        author: book.authors?.join(", ") || "Unknown Author",
        isbn: getISBN(book.industryIdentifiers) || undefined,
        genre: book.categories?.[0] || undefined,
        summary: book.description || undefined,
        coverUrl: getBestCoverImage(book.imageLinks) || undefined,
        pages: book.pageCount || undefined,
        publishedAt: book.publishedDate || undefined,
      });
      setSnackbarMessage(`"${book.title}" added to your library!`);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Failed to add book:", error);
      setSnackbarMessage("Failed to add book to library");
      setSnackbarOpen(true);
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-black min-h-screen text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <Alert severity="info">
            Please log in to explore books and add them to your library
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />

      <Box sx={{ px: 4, py: 3 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Explore Books
        </Typography>
        <Typography variant="h6" color="gray" sx={{ mb: 3 }}>
          Discover new books and add them to your library
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              "& .MuiTab-root": { color: "gray" },
              "& .Mui-selected": { color: "purple" },
              "& .MuiTabs-indicator": { bgcolor: "purple" },
            }}
          >
            <Tab icon={<Star />} label="Popular" iconPosition="start" />
            <Tab
              icon={<NewReleases />}
              label="New Releases"
              iconPosition="start"
            />
            <Tab icon={<Category />} label="Categories" iconPosition="start" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {popularLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : popularError ? (
            <Alert severity="error">Failed to load popular books.</Alert>
          ) : (
            <Grid container spacing={2}>
              {popularBooks?.map((book) => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={book.id}>
                  <BookCard
                    book={book}
                    onAdd={() => handleAddToLibrary(book)}
                    disabled={createBookMutation.isPending}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {newReleasesLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : newReleasesError ? (
            <Alert severity="error">Failed to load new releases.</Alert>
          ) : (
            <Grid container spacing={2}>
              {newReleases?.map((book) => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={book.id}>
                  <BookCard
                    book={book}
                    onAdd={() => handleAddToLibrary(book)}
                    disabled={createBookMutation.isPending}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ mb: 3, display: "flex", flexWrap: "wrap", gap: 1 }}>
            {categories.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                onClick={() => setSelectedCategory(cat)}
                variant={selectedCategory === cat ? "filled" : "outlined"}
                sx={{
                  bgcolor: selectedCategory === cat ? "purple" : "transparent",
                  color: selectedCategory === cat ? "white" : "purple",
                  borderColor: "purple",
                  "&:hover": { bgcolor: "rgba(128,0,128,0.1)" },
                }}
              />
            ))}
          </Box>

          {categoryLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : categoryError ? (
            <Alert severity="error">
              Failed to load books for this category.
            </Alert>
          ) : (
            <Grid container spacing={2}>
              {categoryBooks?.map((book) => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={book.id}>
                  <BookCard
                    book={book}
                    onAdd={() => handleAddToLibrary(book)}
                    disabled={createBookMutation.isPending}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </div>
  );
}
