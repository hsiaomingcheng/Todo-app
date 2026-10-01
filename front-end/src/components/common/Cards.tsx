import { useState } from "react";
import { FilePen, ListChecks } from "lucide-react";
import type { BoardLabel, Card } from "@/types/board";
import { Badge } from "@/components/ui/badge";
import CardDetailModal from "@/components/common/CardDetailModal";

export default function Cards({
    card,
    boardLabels,
    submitFunc,
    deleteFunc,
    setLabelsFunc,
    createTaskFunc,
    updateTaskFunc,
    deleteTaskFunc,
    isFilteredOut = false,
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
    createTaskFunc: (card_id: number, content: string) => Promise<void>;
    updateTaskFunc: (task_id: number, updates: { content?: string; is_completed?: boolean }) => Promise<void>;
    deleteTaskFunc: (task_id: number) => Promise<void>;
    // When a filter is active and this card doesn't match it, keep it in
    // place (so list/board layout stays stable and scroll position keeps
    // meaning) but dim it and block opening it.
    isFilteredOut?: boolean;
}) {
    const [open, setOpen] = useState(false);
    const doneTaskCount = card.tasks.filter((t) => t.is_completed).length;

    return (
        <>
            <div
                onClick={() => !isFilteredOut && setOpen(true)}
                className={`bg-white group flex justify-between items-start shadow-sm rounded-md p-2 transition-colors duration-150 ${card.completed ? "border-l-4 border-app-success" : ""
                    } ${isFilteredOut ? "opacity-40 cursor-default" : "cursor-pointer hover:bg-gray-50"
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

                    {card.tasks.length > 0 && (
                        <div
                            className={`flex items-center gap-1 text-xs ${doneTaskCount === card.tasks.length ? "text-app-success" : "text-app-text-subtle"}`}
                        >
                            <ListChecks size={14} strokeWidth={2} />
                            <span>{doneTaskCount}/{card.tasks.length}</span>
                        </div>
                    )}
                </div>

                {!isFilteredOut && (
                    <FilePen size={16} color="#000" strokeWidth={2} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                )}
            </div>

            <CardDetailModal
                card={card}
                open={open}
                onOpenChange={setOpen}
                boardLabels={boardLabels}
                submitFunc={submitFunc}
                deleteFunc={deleteFunc}
                setLabelsFunc={setLabelsFunc}
                createTaskFunc={createTaskFunc}
                updateTaskFunc={updateTaskFunc}
                deleteTaskFunc={deleteTaskFunc}
            />
        </>
    )
}
