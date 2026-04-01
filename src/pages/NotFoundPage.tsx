import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="text-7xl mb-4">🗺️</p>
      <h1 className="text-3xl font-bold text-slate-800">Page not found</h1>
      <p className="text-slate-500 mt-2 mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/boards" className="btn-primary">
        Back to boards
      </Link>
    </div>
  );
}