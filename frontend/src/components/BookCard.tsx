import { useNavigate } from "react-router-dom";
import type { Book } from "../types";

export interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const navigate = useNavigate();
  const defaultCover = "/assets/covers/default-book.svg";

  const handleClick = () => {
    navigate(`/book/${book.id}`);
  };

  return (
    <div
      className="rounded-lg shadow hover:shadow-lg transition p-3 cursor-pointer group"
      onClick={handleClick}
    >
      <div className="relative">
        <img
          src={book.coverUrl || defaultCover}
          alt={book.title}
          className="rounded-md w-full h-60 object-cover group-hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultCover;
          }}
        />
        {book.genre && (
          <span className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
            {book.genre}
          </span>
        )}
      </div>
      <div className="mt-2">
        <h3 className="text-white text-sm font-semibold line-clamp-2 group-hover:text-purple-400 transition-colors">
          {book.title}
        </h3>
        <p className="text-gray-400 text-xs">{book.author}</p>
        {book.pages && (
          <p className="text-gray-500 text-xs mt-1">{book.pages} pages</p>
        )}
      </div>
    </div>
  );
}
