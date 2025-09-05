import type { Request, Response } from "express";
import { prisma } from "../config/database.js";
import { asyncHandler } from "../middleware/errorHandler.js";

/**
 * Get all books for the authenticated user
 */
export const getBooks = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const books = await prisma.book.findMany({
    where: { userId: req.user.id },
    select: {
      id: true,
      title: true,
      author: true,
      genre: true,
      pages: true,
      isbn: true,
      coverUrl: true,
      summary: true,
      publishedAt: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  res.json({
    success: true,
    message: "Books retrieved successfully",
    data: books,
  });
});

/**
 * Get a single book by ID
 */
export const getBook = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const { id } = req.params;

  const book = await prisma.book.findFirst({
    where: {
      id,
      userId: req.user.id, // Ensure user owns the book
    },
    select: {
      id: true,
      title: true,
      author: true,
      genre: true,
      pages: true,
      isbn: true,
      coverUrl: true,
      summary: true,
      publishedAt: true,
      createdAt: true,
    },
  });

  if (!book) {
    return res.status(404).json({
      success: false,
      message: "Book not found",
    });
  }

  res.json({
    success: true,
    message: "Book retrieved successfully",
    data: book,
  });
});

/**
 * Create a new book
 */
export const createBook = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const { title, author, genre, pages, isbn, coverUrl, summary, publishedAt } =
    req.body;

  // Basic validation
  if (!title || !author) {
    return res.status(400).json({
      success: false,
      message: "Title and author are required",
    });
  }

  const book = await prisma.book.create({
    data: {
      title,
      author,
      genre: genre || null,
      pages: pages ? parseInt(pages) : null,
      isbn: isbn || null,
      coverUrl: coverUrl || null,
      summary: summary || null,
      publishedAt: publishedAt ? new Date(publishedAt) : null,
      userId: req.user.id,
    },
    select: {
      id: true,
      title: true,
      author: true,
      genre: true,
      pages: true,
      isbn: true,
      coverUrl: true,
      summary: true,
      publishedAt: true,
      createdAt: true,
    },
  });

  res.status(201).json({
    success: true,
    message: "Book created successfully",
    data: book,
  });
});

/**
 * Update a book
 */
export const updateBook = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const { id } = req.params;
  const { title, author, genre, pages, isbn, coverUrl, summary, publishedAt } =
    req.body;

  // Check if book exists and belongs to user
  const existingBook = await prisma.book.findFirst({
    where: {
      id,
      userId: req.user.id,
    },
  });

  if (!existingBook) {
    return res.status(404).json({
      success: false,
      message: "Book not found",
    });
  }

  const book = await prisma.book.update({
    where: { id },
    data: {
      ...(title && { title }),
      ...(author && { author }),
      ...(genre !== undefined && { genre: genre || null }),
      ...(pages !== undefined && { pages: pages ? parseInt(pages) : null }),
      ...(isbn !== undefined && { isbn: isbn || null }),
      ...(coverUrl !== undefined && { coverUrl: coverUrl || null }),
      ...(summary !== undefined && { summary: summary || null }),
      ...(publishedAt !== undefined && {
        publishedAt: publishedAt ? new Date(publishedAt) : null,
      }),
    },
    select: {
      id: true,
      title: true,
      author: true,
      genre: true,
      pages: true,
      isbn: true,
      coverUrl: true,
      summary: true,
      publishedAt: true,
      createdAt: true,
    },
  });

  res.json({
    success: true,
    message: "Book updated successfully",
    data: book,
  });
});

/**
 * Delete a book
 */
export const deleteBook = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const { id } = req.params;

  // Check if book exists and belongs to user
  const existingBook = await prisma.book.findFirst({
    where: {
      id,
      userId: req.user.id,
    },
  });

  if (!existingBook) {
    return res.status(404).json({
      success: false,
      message: "Book not found",
    });
  }

  await prisma.book.delete({
    where: { id },
  });

  res.json({
    success: true,
    message: "Book deleted successfully",
  });
});
