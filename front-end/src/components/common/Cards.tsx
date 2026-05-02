import { FilePen } from "lucide-react";
import type { Card } from "@/types/board";

export default function Cards({ card }: { card: Card }) {
    return (
        <div className="cursor-pointer bg-white group flex justify-between items-center shadow-sm rounded-md p-2 hover:bg-gray-50 transition-colors duration-150">
            <div className="text-sm">
                {card.title}
            </div>

            <FilePen size={16} color="#000" strokeWidth={2} className="opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
        </div>
    )
}