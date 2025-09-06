import { useState } from "react";

interface FiltersProps {
  onSortChange?: (sortBy: string) => void;
  onGenreFilter?: (genre: string) => void;
  onSearchFilter?: (searchTerm: string) => void;
}

export default function Filters({
  onSortChange,
  onGenreFilter,
  onSearchFilter,
}: FiltersProps) {
  const [sortBy, setSortBy] = useState("title");
  const [genre, setGenre] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSortChange = (value: string) => {
    setSortBy(value);
    onSortChange?.(value);
  };

  const handleGenreChange = (value: string) => {
    setGenre(value);
    onGenreFilter?.(value);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearchFilter?.(value);
  };

  const clearFilters = () => {
    setSortBy("title");
    setGenre("all");
    setSearchTerm("");
    onSortChange?.("title");
    onGenreFilter?.("all");
    onSearchFilter?.("");
  };

  return (
    <div className="mt-6 space-y-4">
      {/* Search Filter */}
      <div className="w-full">
        <input
          type="text"
          placeholder="Search in your library..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full bg-gray-800 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
        {/* Sort Dropdown */}
        <div className="flex-1 min-w-0">
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full bg-gray-800 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="title">Sort by: Title</option>
            <option value="author">Sort by: Author</option>
            <option value="dateAdded">Sort by: Date Added</option>
            <option value="publishedAt">Sort by: Published Date</option>
            <option value="pages">Sort by: Pages</option>
          </select>
        </div>

        {/* Genre Filter */}
        <div className="flex-1 min-w-0">
          <select
            value={genre}
            onChange={(e) => handleGenreChange(e.target.value)}
            className="w-full bg-gray-800 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Genres</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-fiction">Non-fiction</option>
            <option value="Mystery">Mystery</option>
            <option value="Romance">Romance</option>
            <option value="Science Fiction">Science Fiction</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Biography">Biography</option>
            <option value="History">History</option>
            <option value="Self-Help">Self-Help</option>
            <option value="Business">Business</option>
            <option value="Technology">Technology</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors whitespace-nowrap"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
