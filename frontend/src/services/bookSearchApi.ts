import axios from "axios";

// Google Books API configuration
const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

export interface BookSearchResult {
  id: string;
  title: string;
  authors: string[];
  publishedDate?: string;
  description?: string;
  pageCount?: number;
  categories?: string[];
  imageLinks?: {
    thumbnail?: string;
    small?: string;
    medium?: string;
    large?: string;
  };
  industryIdentifiers?: Array<{
    type: string;
    identifier: string;
  }>;
  language?: string;
  previewLink?: string;
  infoLink?: string;
}

export interface GoogleBooksResponse {
  items: Array<{
    id: string;
    volumeInfo: BookSearchResult;
  }>;
  totalItems: number;
}

// Search books by title and author
export const searchBooks = async (
  query: string,
  maxResults: number = 10
): Promise<BookSearchResult[]> => {
  try {
    const response = await axios.get<GoogleBooksResponse>(GOOGLE_BOOKS_API, {
      params: {
        q: query,
        maxResults,
        printType: "books",
        orderBy: "relevance",
      },
    });

    return (
      response.data.items?.map((item) => ({
        ...item.volumeInfo,
        id: item.id,
      })) || []
    );
  } catch (error) {
    console.error("Error searching books:", error);
    throw new Error("Failed to search books");
  }
};

// Search books by specific title and author
export const searchBooksByTitleAndAuthor = async (
  title: string,
  author: string,
  maxResults: number = 5
): Promise<BookSearchResult[]> => {
  const query = `intitle:"${title}"+inauthor:"${author}"`;
  return searchBooks(query, maxResults);
};

// Get book details by ISBN
export const searchBookByISBN = async (
  isbn: string
): Promise<BookSearchResult | null> => {
  try {
    const response = await axios.get<GoogleBooksResponse>(GOOGLE_BOOKS_API, {
      params: {
        q: `isbn:${isbn}`,
        maxResults: 1,
      },
    });

    if (response.data.items && response.data.items.length > 0) {
      return {
        ...response.data.items[0].volumeInfo,
        id: response.data.items[0].id,
      };
    }
    return null;
  } catch (error) {
    console.error("Error searching book by ISBN:", error);
    return null;
  }
};

// Helper function to get the best available cover image
export const getBestCoverImage = (
  imageLinks?: BookSearchResult["imageLinks"]
): string | null => {
  if (!imageLinks) return null;

  return (
    imageLinks.large ||
    imageLinks.medium ||
    imageLinks.small ||
    imageLinks.thumbnail ||
    null
  );
};

// Helper function to get ISBN
export const getISBN = (
  industryIdentifiers?: BookSearchResult["industryIdentifiers"]
): string | null => {
  if (!industryIdentifiers) return null;

  const isbn13 = industryIdentifiers.find((id) => id.type === "ISBN_13");
  const isbn10 = industryIdentifiers.find((id) => id.type === "ISBN_10");

  return isbn13?.identifier || isbn10?.identifier || null;
};

// Get popular/trending books
export const getPopularBooks = async (
  maxResults: number = 20
): Promise<BookSearchResult[]> => {
  try {
    const response = await axios.get<GoogleBooksResponse>(GOOGLE_BOOKS_API, {
      params: {
        q: "bestseller OR popular OR trending",
        maxResults,
        orderBy: "relevance",
        printType: "books",
      },
    });

    return (
      response.data.items?.map((item) => ({
        ...item.volumeInfo,
        id: item.id,
      })) || []
    );
  } catch (error) {
    console.error("Error fetching popular books:", error);
    throw new Error("Failed to fetch popular books");
  }
};

// Get books by category
export const getBooksByCategory = async (
  category: string,
  maxResults: number = 20
): Promise<BookSearchResult[]> => {
  try {
    const response = await axios.get<GoogleBooksResponse>(GOOGLE_BOOKS_API, {
      params: {
        q: `subject:${category}`,
        maxResults,
        orderBy: "relevance",
        printType: "books",
      },
    });

    return (
      response.data.items?.map((item) => ({
        ...item.volumeInfo,
        id: item.id,
      })) || []
    );
  } catch (error) {
    console.error(`Error fetching books for category ${category}:`, error);
    throw new Error(`Failed to fetch books for category ${category}`);
  }
};

// Get new releases
export const getNewReleases = async (
  maxResults: number = 20
): Promise<BookSearchResult[]> => {
  try {
    const currentYear = new Date().getFullYear();
    const response = await axios.get<GoogleBooksResponse>(GOOGLE_BOOKS_API, {
      params: {
        q: `publishedDate:${currentYear}`,
        maxResults,
        orderBy: "newest",
        printType: "books",
      },
    });

    return (
      response.data.items?.map((item) => ({
        ...item.volumeInfo,
        id: item.id,
      })) || []
    );
  } catch (error) {
    console.error("Error fetching new releases:", error);
    throw new Error("Failed to fetch new releases");
  }
};
