import { useQuery } from "@tanstack/react-query";
import {
  getPopularBooks,
  getBooksByCategory,
  getNewReleases,
} from "../services/bookSearchApi";
import type { BookSearchResult } from "../services/bookSearchApi";

export const usePopularBooks = (maxResults: number = 20) => {
  return useQuery({
    queryKey: ["popularBooks", maxResults],
    queryFn: () => getPopularBooks(maxResults),
    staleTime: 1000 * 60 * 30, // 30 minutes
    cacheTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useBooksByCategory = (
  category: string,
  maxResults: number = 20
) => {
  return useQuery({
    queryKey: ["booksByCategory", category, maxResults],
    queryFn: () => getBooksByCategory(category, maxResults),
    enabled: !!category,
    staleTime: 1000 * 60 * 30, // 30 minutes
    cacheTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useNewReleases = (maxResults: number = 20) => {
  return useQuery({
    queryKey: ["newReleases", maxResults],
    queryFn: () => getNewReleases(maxResults),
    staleTime: 1000 * 60 * 30, // 30 minutes
    cacheTime: 1000 * 60 * 60, // 1 hour
  });
};
