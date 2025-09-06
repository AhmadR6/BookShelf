import { useState, type ReactNode } from "react";
import { useBookSearch } from "../hooks/useBookSearch";
import { SearchContext } from "../contexts/SearchContext";

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider = ({ children }: SearchProviderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { searchResults, search, clearResults, isSearching, searchError } =
    useBookSearch();

  const performSearch = (query: string) => {
    if (query.trim()) {
      search(query);
    } else {
      clearResults();
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    clearResults();
    setIsSearchOpen(false);
  };

  const value = {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    searchError,
    performSearch,
    clearSearch,
    isSearchOpen,
    setIsSearchOpen,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};
