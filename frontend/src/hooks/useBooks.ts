import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuthContext";
import apiClient from "../utils/api";
import type {
  BooksResponse,
  BookResponse,
  CreateBookRequest,
  UpdateBookRequest,
} from "../types";

// Books API functions
const booksApi = {
  getBooks: async (): Promise<BooksResponse> => {
    const response = await apiClient.get("/books");
    return response.data;
  },

  getBook: async (id: string): Promise<BookResponse> => {
    const response = await apiClient.get(`/books/${id}`);
    return response.data;
  },

  createBook: async (bookData: CreateBookRequest): Promise<BookResponse> => {
    const response = await apiClient.post("/books", bookData);
    return response.data;
  },

  updateBook: async ({
    id,
    ...bookData
  }: UpdateBookRequest & { id: string }): Promise<BookResponse> => {
    const response = await apiClient.put(`/books/${id}`, bookData);
    return response.data;
  },

  deleteBook: async (
    id: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/books/${id}`);
    return response.data;
  },
};

// Custom hooks
export const useBooks = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["books"],
    queryFn: booksApi.getBooks,
    enabled: isAuthenticated,
    select: (data) => data.data,
  });
};

export const useBook = (id: string) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["book", id],
    queryFn: () => booksApi.getBook(id),
    enabled: isAuthenticated && !!id,
    select: (data) => data.data,
  });
};

export const useCreateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: booksApi.createBook,
    onSuccess: () => {
      // Invalidate and refetch books list
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
};

export const useUpdateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: booksApi.updateBook,
    onSuccess: (data, variables) => {
      // Invalidate and refetch books list
      queryClient.invalidateQueries({ queryKey: ["books"] });
      // Update specific book cache
      queryClient.setQueryData(["book", variables.id], data);
    },
  });
};

export const useDeleteBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: booksApi.deleteBook,
    onSuccess: (_, deletedId) => {
      // Invalidate and refetch books list
      queryClient.invalidateQueries({ queryKey: ["books"] });
      // Remove specific book from cache
      queryClient.removeQueries({ queryKey: ["book", deletedId] });
    },
  });
};
