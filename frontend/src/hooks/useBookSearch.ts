import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  searchBooks,
  searchBooksByTitleAndAuthor,
  searchBookByISBN,
  type BookSearchResult,
} from "../services/bookSearchApi";

export const useBookSearch = () => {
  const [searchResults, setSearchResults] = useState<BookSearchResult[]>([]);

  const searchMutation = useMutation({
    mutationFn: searchBooks,
    onSuccess: (data) => {
      setSearchResults(data);
    },
    onError: (error) => {
      console.error("Search failed:", error);
      setSearchResults([]);
    },
  });

  const searchByTitleAndAuthorMutation = useMutation({
    mutationFn: ({ title, author }: { title: string; author: string }) =>
      searchBooksByTitleAndAuthor(title, author),
    onSuccess: (data) => {
      setSearchResults(data);
    },
    onError: (error) => {
      console.error("Search by title and author failed:", error);
      setSearchResults([]);
    },
  });

  const searchByISBNMutation = useMutation({
    mutationFn: searchBookByISBN,
    onSuccess: (data) => {
      if (data) {
        setSearchResults([data]);
      } else {
        setSearchResults([]);
      }
    },
    onError: (error) => {
      console.error("Search by ISBN failed:", error);
      setSearchResults([]);
    },
  });

  const clearResults = () => {
    setSearchResults([]);
  };

  return {
    searchResults,
    search: searchMutation.mutate,
    searchByTitleAndAuthor: searchByTitleAndAuthorMutation.mutate,
    searchByISBN: searchByISBNMutation.mutate,
    clearResults,
    isSearching:
      searchMutation.isPending ||
      searchByTitleAndAuthorMutation.isPending ||
      searchByISBNMutation.isPending,
    searchError:
      searchMutation.error ||
      searchByTitleAndAuthorMutation.error ||
      searchByISBNMutation.error,
  };
};
