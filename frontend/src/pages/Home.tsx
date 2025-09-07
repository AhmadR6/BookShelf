import { useAuth } from "../hooks/useAuthContext";
import { useBooks } from "../hooks/useBooks";
import { useSearch } from "../hooks/useSearch";
import Navbar from "../components/Navbar";
import Filters from "../components/Filters";
import BookGrid from "../components/BookGrid";
import AddBookMenu from "../components/AddBookMenu";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { data: books, isLoading, error } = useBooks();
  const { searchResults, searchError } = useSearch();
  const [filters, setFilters] = useState({
    sortBy: "title",
    genre: "all",
    searchTerm: "",
  });

  // Filter and sort books based on current filters
  const filteredBooks = useMemo(() => {
    if (!books) return [];

    let filtered = [...books];

    // Apply search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchLower) ||
          book.author.toLowerCase().includes(searchLower) ||
          (book.genre && book.genre.toLowerCase().includes(searchLower))
      );
    }

    // Apply genre filter
    if (filters.genre !== "all") {
      filtered = filtered.filter((book) => book.genre === filters.genre);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "author":
          return a.author.localeCompare(b.author);
        case "dateAdded":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "publishedAt":
          if (!a.publishedAt || !b.publishedAt) return 0;
          return (
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
          );
        case "pages":
          return (b.pages || 0) - (a.pages || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [books, filters]);

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-black min-h-screen text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to BookShelf</h1>
            <p className="text-gray-400 text-lg mb-8">
              Please log in to view your library
            </p>
            <Link
              to="/login"
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />

      <div className="px-6 py-6">
        <h1 className="text-3xl font-bold">My Library</h1>
        <p className="text-gray-400 text-sm mt-1">
          All your saved and read books in one place.
        </p>

        {isLoading && (
          <div className="text-center py-8">
            <p className="text-gray-400">Loading your books...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-lg mt-4">
            Error loading books: {error.message}
          </div>
        )}

        {books && books.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <p className="text-gray-400 text-lg mb-4">
              No books in your library yet
            </p>
            <p className="text-gray-500 text-sm">
              Add your first book to get started!
            </p>
          </div>
        )}

        {books && books.length > 0 && (
          <>
            <Filters
              onSortChange={(value) => handleFilterChange("sortBy", value)}
              onGenreFilter={(value) => handleFilterChange("genre", value)}
              onSearchFilter={(value) =>
                handleFilterChange("searchTerm", value)
              }
            />
            <BookGrid books={filteredBooks} />
          </>
        )}

        {/* Search Results Section */}
        {searchResults.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Search Results</h2>
            <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-400 p-4 rounded-lg mb-4">
              <p className="text-sm">
                Found {searchResults.length} book(s) from Google Books. Click
                the + button to add them to your library.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {searchResults.map((book) => (
                <div key={book.id} className="bg-gray-800 rounded-lg p-4">
                  <div className="aspect-w-3 aspect-h-4 mb-3">
                    <img
                      src={
                        book.imageLinks?.thumbnail ||
                        "/assets/covers/default-book.svg"
                      }
                      alt={book.title}
                      className="w-full h-48 object-cover rounded"
                    />
                  </div>
                  <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-gray-400 text-xs mb-2">
                    {book.authors?.join(", ")}
                  </p>
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs py-1 rounded">
                    Add to Library
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {searchError && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-lg mt-4">
            Search error: {searchError.message}
          </div>
        )}

        <AddBookMenu />
      </div>
    </div>
  );
}
