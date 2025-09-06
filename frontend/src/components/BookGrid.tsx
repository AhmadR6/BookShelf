import { useBooks } from "../hooks/useBooks";
import BookCard from "./BookCard";
import type { Book } from "../types";

interface BookGridProps {
  books?: Book[];
  isLoading?: boolean;
  error?: Error | null;
}

export default function BookGrid({
  books: propBooks,
  isLoading: propIsLoading,
  error: propError,
}: BookGridProps) {
  const {
    data: hookBooks,
    isLoading: hookIsLoading,
    error: hookError,
  } = useBooks();

  // Use props if provided, otherwise use hook data
  const books = propBooks ?? hookBooks;
  const isLoading = propIsLoading ?? hookIsLoading;
  const error = propError ?? hookError;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="animate-pulse">
            <div className="bg-gray-700 rounded-md w-full h-60"></div>
            <div className="mt-2">
              <div className="bg-gray-700 h-4 rounded w-3/4 mb-1"></div>
              <div className="bg-gray-700 h-3 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400">Error loading books: {error.message}</p>
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No books found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
