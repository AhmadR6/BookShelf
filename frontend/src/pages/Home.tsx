import Navbar from "../components/Navbar";
import Filters from "../components/Filters";
import BookGrid from "../components/BookGrid";
import AddBookMenu from "../components/AddBookMenu";

export default function Home() {
  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />

      <div className="px-6 py-6">
        <h1 className="text-3xl font-bold">My Library</h1>
        <p className="text-gray-400 text-sm mt-1">
          All your saved and read books in one place.
        </p>

        <Filters />
        <BookGrid />
        <AddBookMenu />
      </div>
    </div>
  );
}
