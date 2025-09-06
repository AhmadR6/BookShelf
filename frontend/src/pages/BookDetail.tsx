import { useParams, useNavigate } from "react-router-dom";
import { useBook, useDeleteBook } from "../hooks/useBooks";
import { useAuth } from "../hooks/useAuthContext";
import Navbar from "../components/Navbar";
import EditBookModal from "../components/Modals/EditBookModal";
import {
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { Delete, Edit, ArrowBack } from "@mui/icons-material";

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data: book, isLoading, error } = useBook(id || "");
  const deleteBookMutation = useDeleteBook();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="animate-pulse text-white">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="bg-black min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-red-500">Book not found</div>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      await deleteBookMutation.mutateAsync(book.id);
      navigate("/");
    } catch (error) {
      console.error("Failed to delete book:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-8">
          {/* Back Button */}
          <div className="mb-8">
            <IconButton
              onClick={() => navigate("/")}
              sx={{
                color: "white",
                bgcolor: "rgba(255, 255, 255, 0.1)",
                "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
              }}
            >
              <ArrowBack />
            </IconButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Book Cover */}
            <div className="md:col-span-1 flex justify-center md:justify-start">
              <div className="relative group">
                <img
                  src={book.coverUrl || "/assets/covers/default-book.svg"}
                  alt={book.title}
                  className="w-64 h-96 object-cover rounded-lg shadow-2xl transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/assets/covers/default-book.svg";
                  }}
                />
              </div>
            </div>

            {/* Book Info */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <Typography
                  variant="h2"
                  className="font-bold mb-2 text-4xl md:text-5xl lg:text-6xl"
                >
                  {book.title}
                </Typography>
                <Typography variant="h5" className="text-gray-300 mb-4">
                  by {book.author}
                </Typography>
              </div>

              {/* Metadata Row */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                {book.publishedAt && (
                  <span className="bg-gray-800 px-3 py-1 rounded">
                    {formatDate(book.publishedAt)}
                  </span>
                )}
                {book.pages && (
                  <span className="bg-gray-800 px-3 py-1 rounded">
                    {book.pages} pages
                  </span>
                )}
                {book.genre && (
                  <Chip
                    label={book.genre}
                    size="small"
                    sx={{
                      bgcolor: "#e50914",
                      color: "white",
                      fontSize: "0.75rem",
                    }}
                  />
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Edit />}
                  onClick={() => setShowEditModal(true)}
                  sx={{
                    bgcolor: "#e50914",
                    color: "white",
                    px: 4,
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: "bold",
                    borderRadius: "4px",
                    "&:hover": { bgcolor: "#b8070f" },
                    textTransform: "none",
                  }}
                >
                  Edit Book
                </Button>

                <IconButton
                  onClick={() => setShowDeleteDialog(true)}
                  sx={{
                    color: "#e50914",
                    bgcolor: "rgba(42, 42, 42, 0.6)",
                    border: "2px solid rgba(229, 9, 20, 0.5)",
                    "&:hover": {
                      bgcolor: "rgba(42, 42, 42, 0.8)",
                      borderColor: "#e50914",
                    },
                  }}
                >
                  <Delete />
                </IconButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {book.summary && (
              <div>
                <Typography variant="h5" className="font-bold mb-4 text-white">
                  About this Book
                </Typography>
                <Typography
                  variant="body1"
                  className="text-gray-300 leading-relaxed text-lg"
                  sx={{ lineHeight: 1.7 }}
                >
                  {book.summary}
                </Typography>
              </div>
            )}

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Typography variant="h6" className="font-bold text-white">
                  Book Details
                </Typography>

                {book.isbn && (
                  <div>
                    <Typography
                      variant="body2"
                      className="text-gray-500 uppercase tracking-wider text-xs"
                    >
                      ISBN
                    </Typography>
                    <Typography
                      variant="body1"
                      className="text-gray-300 font-mono"
                    >
                      {book.isbn}
                    </Typography>
                  </div>
                )}

                <div>
                  <Typography
                    variant="body2"
                    className="text-gray-500 uppercase tracking-wider text-xs"
                  >
                    Added to Library
                  </Typography>
                  <Typography variant="body1" className="text-gray-300">
                    {new Date(book.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Typography>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-lg p-6 space-y-6">
              <Typography variant="h6" className="font-bold text-white">
                Quick Info
              </Typography>

              <div className="space-y-4">
                <div>
                  <Typography
                    variant="body2"
                    className="text-gray-500 uppercase tracking-wider text-xs mb-1"
                  >
                    Author
                  </Typography>
                  <Typography variant="body1" className="text-white">
                    {book.author}
                  </Typography>
                </div>

                {book.genre && (
                  <div>
                    <Typography
                      variant="body2"
                      className="text-gray-500 uppercase tracking-wider text-xs mb-1"
                    >
                      Genre
                    </Typography>
                    <Chip
                      label={book.genre}
                      sx={{
                        bgcolor: "#333",
                        color: "white",
                        borderRadius: "16px",
                      }}
                    />
                  </div>
                )}

                {book.pages && (
                  <div>
                    <Typography
                      variant="body2"
                      className="text-gray-500 uppercase tracking-wider text-xs mb-1"
                    >
                      Length
                    </Typography>
                    <Typography variant="body1" className="text-white">
                      {book.pages} pages
                    </Typography>
                  </div>
                )}

                {book.publishedAt && (
                  <div>
                    <Typography
                      variant="body2"
                      className="text-gray-500 uppercase tracking-wider text-xs mb-1"
                    >
                      Published
                    </Typography>
                    <Typography variant="body1" className="text-white">
                      {formatDate(book.publishedAt)}
                    </Typography>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        PaperProps={{
          sx: {
            bgcolor: "#141414",
            color: "white",
            borderRadius: "8px",
            minWidth: "400px",
          },
        }}
      >
        <DialogTitle sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>
          Remove from Library?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
            "{book.title}" will be removed from your library. This action cannot
            be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setShowDeleteDialog(false)}
            sx={{
              color: "white",
              bgcolor: "rgba(255, 255, 255, 0.1)",
              "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
              borderRadius: "4px",
              px: 3,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={deleteBookMutation.isPending}
            sx={{
              bgcolor: "#e50914",
              color: "white",
              "&:hover": { bgcolor: "#b8070f" },
              "&:disabled": { bgcolor: "rgba(229, 9, 20, 0.5)" },
              borderRadius: "4px",
              px: 3,
            }}
          >
            {deleteBookMutation.isPending ? "Removing..." : "Remove"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Book Modal */}
      {book && (
        <EditBookModal
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          book={book}
        />
      )}
    </div>
  );
}
