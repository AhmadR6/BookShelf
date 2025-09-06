import BookCard from "./BookCard";

const sampleBooks = [
  {
    title: "The Secret Garden",
    author: "Frances Hodgson Burnett",
    cover: "/assets/covers/secret-garden.webp",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    cover: "/assets/covers/pride-prejudice.webp",
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    cover: "/assets/covers/mockingbird.webp",
  },
  {
    title: "The Secret Garden",
    author: "Frances Hodgson Burnett",
    cover: "/assets/covers/secret-garden.webp",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    cover: "/assets/covers/pride-prejudice.webp",
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    cover: "/assets/covers/mockingbird.webp",
  },
  {
    title: "The Secret Garden",
    author: "Frances Hodgson Burnett",
    cover: "/assets/covers/secret-garden.webp",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    cover: "/assets/covers/pride-prejudice.webp",
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    cover: "/assets/covers/mockingbird.webp",
  },
  {
    title: "The Secret Garden",
    author: "Frances Hodgson Burnett",
    cover: "/assets/covers/secret-garden.webp",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    cover: "/assets/covers/pride-prejudice.webp",
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    cover: "/assets/covers/mockingbird.webp",
  },
  {
    title: "The Secret Garden",
    author: "Frances Hodgson Burnett",
    cover: "/assets/covers/secret-garden.webp",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    cover: "/assets/covers/pride-prejudice.webp",
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    cover: "/assets/covers/mockingbird.webp",
  },
  {
    title: "The Secret Garden",
    author: "Frances Hodgson Burnett",
    cover: "/assets/covers/secret-garden.webp",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    cover: "/assets/covers/pride-prejudice.webp",
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    cover: "/assets/covers/mockingbird.webp",
  },
  {
    title: "The Secret Garden",
    author: "Frances Hodgson Burnett",
    cover: "/assets/covers/secret-garden.webp",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    cover: "/assets/covers/pride-prejudice.webp",
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    cover: "/assets/covers/mockingbird.webp",
  },
  {
    title: "The Secret Garden",
    author: "Frances Hodgson Burnett",
    cover: "/assets/covers/secret-garden.webp",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    cover: "/assets/covers/pride-prejudice.webp",
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    cover: "/assets/covers/mockingbird.webp",
  },
];

export default function BookGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">
      {sampleBooks.map((b, idx) => (
        <BookCard key={idx} {...b} />
      ))}
    </div>
  );
}
