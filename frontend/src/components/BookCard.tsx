interface BookProps {
  title: string;
  author: string;
  cover: string;
}

export default function BookCard({ title, author, cover }: BookProps) {
  return (
    <div className="rounded-lg shadow hover:shadow-lg transition p-3">
      <img
        src={cover}
        alt={title}
        className="rounded-md w-full h-60 object-cover"
      />
      <div className="mt-2">
        <h3 className="text-white text-sm font-semibold">{title}</h3>
        <p className="text-gray-400 text-xs">{author}</p>
      </div>
    </div>
  );
}
