import { useAuth } from "../hooks/useAuthContext";
import { useBooks } from "../hooks/useBooks";
import Navbar from "../components/Navbar";
import Filters from "../components/Filters";
import BookGrid from "../components/BookGrid";
import AddBookMenu from "../components/AddBookMenu";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { data: books, isLoading, error } = useBooks();

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
            <a
              href="/login"
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Get Started
            </a>
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
            <Filters />
            <BookGrid />
          </>
        )}

        <AddBookMenu />
      </div>
    </div>
  );
}
