import { createContext } from "react";
import type { BookSearchResult } from "../services/bookSearchApi";

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: BookSearchResult[];
  isSearching: boolean;
  searchError: Error | null;
  performSearch: (query: string) => void;
  clearSearch: () => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

export const SearchContext = createContext<SearchContextType | undefined>(
  undefined
);
