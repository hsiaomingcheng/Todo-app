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
                className={`bg-white group flex justify-between items-start rounded-lg px-3 py-2.5 shadow-[0_1px_2px_rgba(20,22,26,0.08)] transition-shadow duration-150 ${card.completed ? "border-l-4 border-[#0F766E]" : ""
                    } ${isFilteredOut ? "opacity-40 cursor-default" : "cursor-pointer hover:shadow-[0_6px_14px_-6px_rgba(20,22,26,0.25)]"
                    }`}
            >
                <div className="min-w-0 flex flex-col gap-2">
                    {card.labels.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {card.labels.map((label) => (
                                <Badge
                                    key={label.id}
                                    className="h-auto rounded-full border-0 px-2 py-0.5 text-[11px] font-semibold text-white"
                                    style={{ backgroundColor: label.color }}
                                >
                                    {label.name}
                                </Badge>
                            ))}
                        </div>
                    )}

                    <div className={`text-sm leading-[1.4] text-[#14161A] ${card.completed ? "line-through text-[#5B6270]" : ""}`}>
                        {card.title}
                    </div>

                    {card.tasks.length > 0 && (
                        <div
                            className={`flex items-center gap-1 text-[11px] ${doneTaskCount === card.tasks.length ? "font-semibold text-[#0F766E]" : "text-[#5B6270]"}`}
                        >
                            <ListChecks size={12} strokeWidth={2} />
                            <span>{doneTaskCount}/{card.tasks.length}</span>
                        </div>
                    )}
                </div>

                {!isFilteredOut && (
                    <FilePen size={16} color="#5B6270" strokeWidth={2} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
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
