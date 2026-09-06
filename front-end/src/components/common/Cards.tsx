import { useState } from "react";
import { FilePen } from "lucide-react";
import type { BoardLabel, Card } from "@/types/board";
import { Badge } from "@/components/ui/badge";
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
                className={`cursor-pointer bg-white group flex justify-between items-start shadow-sm rounded-md p-2 hover:bg-gray-50 transition-colors duration-150 ${card.completed ? "border-l-4 border-app-success" : ""
                    }`}
            >
                <div className="min-w-0 flex flex-col gap-1">
                    {card.labels.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {card.labels.map((label) => (
                                <Badge
                                    key={label.id}
                                    className="border-0 text-white"
                                    style={{ backgroundColor: label.color }}
                                >
                                    {label.name}
                                </Badge>
                            ))}
                        </div>
                    )}

                    <div className={`text-sm ${card.completed ? "line-through text-app-text-subtle" : ""}`}>
                        {card.title}
                    </div>
                </div>

                <FilePen size={16} color="#000" strokeWidth={2} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
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
