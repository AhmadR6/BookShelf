import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-black text-white">
      <div className="flex items-center gap-2">
        <span className=" text-2xl font-bold">📖</span>
        <Link to="/" className="font-semibold text-lg">
          BookShelf
        </Link>
      </div>

      <div className="flex gap-6">
        <Link to="/" className="hover:text-red-400">
          Home
        </Link>
        <Link to="/explore" className="hover:text-red-400">
          Explore
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search books, authors..."
          className="bg-gray-800 rounded px-3 py-1 text-sm focus:outline-none"
        />
        <img
          src="/assets/avatar.jpg"
          alt="profile"
          className="w-8 h-8 rounded-full"
        />
      </div>
    </nav>
  );
}
