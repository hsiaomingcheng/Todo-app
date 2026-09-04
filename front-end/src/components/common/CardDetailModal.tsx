import { useEffect, useState } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import DeletingModal from "@/components/common/DeletingModal";
import type { Card } from "@/types/board";

// Parse a "YYYY-MM-DD" (or ISO timestamp) date-only value as a local date,
// avoiding the UTC interpretation `new Date(str)` uses for date-only strings.
function parseDateOnly(value: string): Date {
    const [year, month, day] = value.slice(0, 10).split("-").map(Number);
    return new Date(year, month - 1, day);
}

// Format a local Date as "YYYY-MM-DD" without shifting through UTC
// (Date.toISOString() converts to UTC first, which can roll the date
// forward/back a day depending on the viewer's timezone offset).
function formatDateOnly(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export default function CardDetailModal({
    card,
    open,
    onOpenChange,
    submitFunc,
    deleteFunc,
}: {
    card: Card;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    submitFunc: (card_id: number, updates: {
        title?: string;
        description?: string;
        due_date?: string;
        completed?: boolean;
    }) => Promise<void>;
    deleteFunc: (card_id: number) => Promise<void>;
}) {
    const [title, setTitle] = useState(card.title);
    const [description, setDescription] = useState(card.description ?? "");
    const [dueDate, setDueDate] = useState<Date | undefined>(
        card.due_date ? parseDateOnly(card.due_date) : undefined
    );
    const [completed, setCompleted] = useState(card.completed);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        // Re-sync whenever the modal opens, not just when `card` changes —
        // if the previous session was closed without saving (Cancel/Escape/
        // backdrop click), `card` never changed, so this is the only signal
        // that local edits need to be discarded in favor of the latest data.
        if (!open) return;

        setTitle(card.title);
        setDescription(card.description ?? "");
        setDueDate(card.due_date ? parseDateOnly(card.due_date) : undefined);
        setCompleted(card.completed);
    }, [card, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isProcessing) return;
        if (!title.trim()) return;

        setIsProcessing(true);
        await submitFunc(card.id, {
            title: title.trim(),
            description,
            ...(dueDate && { due_date: formatDateOnly(dueDate) }),
            completed,
        });
        setIsProcessing(false);

        onOpenChange(false);
    };

    const handleDelete = async () => {
        await deleteFunc(card.id);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Card details</DialogTitle>
                    <DialogDescription>
                        View and edit this card's information.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="completed"
                            checked={completed}
                            onCheckedChange={(checked) => setCompleted(checked === true)}
                        />
                        <label htmlFor="completed" className="text-sm text-app-text-subtle">
                            Mark as completed
                        </label>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="cardTitle">
                            Title
                        </label>
                        <Input
                            id="cardTitle"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={completed ? "line-through text-app-text-subtle" : ""}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="cardDescription">
                            Description
                        </label>
                        <Textarea
                            id="cardDescription"
                            placeholder="Add a more detailed description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-1">
                            Due date
                        </label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button type="button" variant="outline" className="w-full justify-start font-normal">
                                    {dueDate ? dueDate.toLocaleDateString() : "No due date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={dueDate}
                                    onSelect={setDueDate}
                                />
                                {dueDate && (
                                    <div className="p-2 border-t">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="w-full"
                                            onClick={() => setDueDate(undefined)}
                                        >
                                            Clear date
                                        </Button>
                                    </div>
                                )}
                            </PopoverContent>
                        </Popover>
                    </div>

                    <DialogFooter className="justify-between sm:justify-between">
                        <DeletingModal
                            title="Delete card"
                            description="This action cannot be undone. This will permanently delete this card."
                            button={
                                <Button type="button" variant="destructive">
                                    Delete
                                </Button>
                            }
                            submission={handleDelete}
                        />

                        <div className="flex gap-2">
                            <DialogClose asChild>
                                <Button type="button" variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" disabled={isProcessing || !title.trim()}>
                                Save
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
