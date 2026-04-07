import { useState, FormEvent } from "react";
import { useLocation } from "wouter";
import { Search } from "lucide-react";

interface Props {
  onClose?: () => void;
}

export default function SearchBar({ onClose }: Props) {
  const [query, setQuery] = useState("");
  const [, navigate] = useLocation();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setQuery("");
    onClose?.();
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari anime..."
        className="w-full pl-9 pr-4 py-2 bg-[#111118] border border-white/10 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
      />
    </form>
  );
}
