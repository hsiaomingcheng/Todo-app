import { useState } from "react";
import { FilePen } from "lucide-react";
import type { BoardLabel, Card } from "@/types/board";
import CardDetailModal from "@/components/common/CardDetailModal";

export default function Cards({
    card,
    boardLabels,
    submitFunc,
    deleteFunc,
    setLabelsFunc,
}: {
    card: Card;
    boardLabels: BoardLabel[];
    submitFunc: (card_id: number, updates: {
        title?: string;
        description?: string;
        due_date?: string;
        completed?: boolean;
    }) => Promise<void>;
    deleteFunc: (card_id: number) => Promise<void>;
    setLabelsFunc: (card_id: number, label_ids: number[]) => Promise<void>;
}) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div
                onClick={() => setOpen(true)}
                className={`cursor-pointer bg-white group flex justify-between items-center shadow-sm rounded-md p-2 hover:bg-gray-50 transition-colors duration-150 ${card.completed ? "border-l-4 border-app-success" : ""
                    }`}
            >
                <div className={`text-sm ${card.completed ? "line-through text-app-text-subtle" : ""}`}>
                    {card.title}
                </div>

                <FilePen size={16} color="#000" strokeWidth={2} className="opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
            </div>

            <CardDetailModal
                card={card}
                open={open}
                onOpenChange={setOpen}
                boardLabels={boardLabels}
                submitFunc={submitFunc}
                deleteFunc={deleteFunc}
                setLabelsFunc={setLabelsFunc}
            />
        </>
    )
}
