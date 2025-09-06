// User types
export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

// Book types
export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string | null;
  pages: number | null;
  isbn: string | null;
  coverUrl: string | null;
  summary: string | null;
  publishedAt: string | null;
  createdAt: string;
}

export interface CreateBookRequest {
  title: string;
  author: string;
  genre?: string;
  pages?: number;
  isbn?: string;
  coverUrl?: string;
  summary?: string;
  publishedAt?: string;
}

export type UpdateBookRequest = Partial<CreateBookRequest>;

export interface BooksResponse {
  success: boolean;
  message: string;
  data: Book[];
}

export interface BookResponse {
  success: boolean;
  message: string;
  data: Book;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
