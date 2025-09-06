export default function Filters() {
  return (
    <div className="flex gap-4 mt-6">
      <select className="bg-gray-800 text-white px-4 py-2 rounded">
        <option>Sort by: Title</option>
        <option>Sort by: Author</option>
      </select>
      <select className="bg-gray-800 text-white px-4 py-2 rounded">
        <option>Filter: Status</option>
        <option>Read</option>
        <option>Unread</option>
      </select>
      <select className="bg-gray-800 text-white px-4 py-2 rounded">
        <option>Filter: Genre</option>
        <option>Fiction</option>
        <option>Non-fiction</option>
      </select>
    </div>
  );
}
