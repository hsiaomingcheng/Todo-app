import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { searchCards } from "@/api/apis";
import type { SearchResult } from "@/types/board";

const SEARCH_DEBOUNCE_MS = 300;

export default function GlobalSearch({
    className,
    autoFocus,
    onResultSelect,
}: {
    className?: string;
    autoFocus?: boolean;
    // Called after navigating to a result — lets a parent (e.g. the mobile
    // search modal) close itself too, on top of GlobalSearch's own reset.
    onResultSelect?: () => void;
}) {
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    // Debounced search — wait for the user to pause typing before hitting the
    // API, rather than firing a request per keystroke.
    useEffect(() => {
        const trimmed = query.trim();
        if (!trimmed) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        const timeoutId = setTimeout(async () => {
            try {
                const response = await searchCards(trimmed);
                setResults(response.data);
                setIsOpen(true);
            } catch (error) {
                console.error(error);
            }
        }, SEARCH_DEBOUNCE_MS);

        return () => clearTimeout(timeoutId);
    }, [query]);

    // Close the results dropdown on an outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (result: SearchResult) => {
        setQuery("");
        setResults([]);
        setIsOpen(false);
        navigate(`/board-lists/${result.board_id}`);
        onResultSelect?.();
    };

    return (
        <div ref={containerRef} className={`relative w-full ${className ?? ""}`}>
            <Input
                autoFocus={autoFocus}
                type="search"
                placeholder="Search cards..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => results.length > 0 && setIsOpen(true)}
                onKeyDown={(e) => e.key === "Escape" && setIsOpen(false)}
                className="h-10 rounded-[10px] border-[#E1E4E8] bg-[#F7F8FA] px-3.5 shadow-none focus:bg-white focus-visible:border-[#0F766E] focus-visible:ring-[#0F766E]/25"
            />

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E1E4E8] rounded-xl shadow-lg max-h-80 overflow-y-auto z-50">
                    {results.length === 0 ? (
                        <p className="p-3 text-sm text-app-text-subtle">No matching cards.</p>
                    ) : (
                        results.map((result) => (
                            <button
                                key={result.id}
                                type="button"
                                onClick={() => handleSelect(result)}
                                className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0 cursor-pointer"
                            >
                                <p className="text-sm font-medium text-app-text truncate">{result.title}</p>
                                <p className="text-xs text-app-text-subtle truncate">
                                    {result.board_title} · {result.list_title}
                                </p>
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
