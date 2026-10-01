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
import type { BoardLabel, Card } from "@/types/board";

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
    boardLabels,
    submitFunc,
    deleteFunc,
    setLabelsFunc,
    createTaskFunc,
    updateTaskFunc,
    deleteTaskFunc,
}: {
    card: Card;
    open: boolean;
    onOpenChange: (open: boolean) => void;
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
}) {
    const [title, setTitle] = useState(card.title);
    const [description, setDescription] = useState(card.description ?? "");
    const [dueDate, setDueDate] = useState<Date | undefined>(
        card.due_date ? parseDateOnly(card.due_date) : undefined
    );
    const [completed, setCompleted] = useState(card.completed);
    // Label toggles are only applied on Save (see handleSubmit) rather than
    // firing attach/detach immediately — an immediate call would refetch the
    // board and hand this modal a new `card` prop, which the effect below
    // would use to re-sync title/description/etc, silently discarding any
    // unsaved edits the user was mid-typing.
    const [selectedLabelIds, setSelectedLabelIds] = useState<Set<number>>(
        () => new Set(card.labels.map((l) => l.id))
    );
    const [isProcessing, setIsProcessing] = useState(false);
    const [newTaskContent, setNewTaskContent] = useState("");
    const [isAddingTask, setIsAddingTask] = useState(false);

    useEffect(() => {
        // Re-sync only when the modal opens — if the previous session was
        // closed without saving (Cancel/Escape/backdrop click), `card` never
        // changed, so opening is the signal that local edits need to be
        // discarded in favor of the latest data. Deliberately NOT keyed on
        // `card`: subtask add/toggle/delete apply immediately and refetch the
        // board, which hands this modal a new `card`; re-syncing then would
        // wipe unsaved title/description/due date/label edits.
        if (!open) return;

        setTitle(card.title);
        setDescription(card.description ?? "");
        setDueDate(card.due_date ? parseDateOnly(card.due_date) : undefined);
        setCompleted(card.completed);
        setSelectedLabelIds(new Set(card.labels.map((l) => l.id)));
        setNewTaskContent("");
    }, [open]);

    const handleAddTask = async () => {
        const content = newTaskContent.trim();
        if (!content || isAddingTask) return;

        setIsAddingTask(true);
        await createTaskFunc(card.id, content);
        setIsAddingTask(false);
        setNewTaskContent("");
    };

    const toggleLabel = (label_id: number) => {
        setSelectedLabelIds((prev) => {
            const next = new Set(prev);
            if (next.has(label_id)) {
                next.delete(label_id);
            } else {
                next.add(label_id);
            }
            return next;
        });
    };

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

        // Only call the labels endpoint if the selection actually changed
        // from what the card had when the modal opened.
        const originalLabelIds = new Set(card.labels.map((l) => l.id));
        const labelsChanged =
            originalLabelIds.size !== selectedLabelIds.size ||
            [...originalLabelIds].some((id) => !selectedLabelIds.has(id));
        if (labelsChanged) {
            await setLabelsFunc(card.id, [...selectedLabelIds]);
        }

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

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-1">
                            Labels
                        </label>
                        {boardLabels.length === 0 ? (
                            <p className="text-sm text-app-text-subtle">
                                No labels on this board yet — add some from "Manage labels".
                            </p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {boardLabels.map((label) => {
                                    const isSelected = selectedLabelIds.has(label.id);
                                    return (
                                        <button
                                            key={label.id}
                                            type="button"
                                            onClick={() => toggleLabel(label.id)}
                                            className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-opacity ${isSelected ? "text-white" : "text-app-text border border-current opacity-60 hover:opacity-100"
                                                }`}
                                            style={isSelected ? { backgroundColor: label.color } : { color: label.color }}
                                        >
                                            {label.name}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-1">
                            Subtasks
                            {card.tasks.length > 0 && (
                                <span className="ml-2 font-normal text-app-text-subtle">
                                    {card.tasks.filter((t) => t.is_completed).length}/{card.tasks.length}
                                </span>
                            )}
                        </label>

                        {card.tasks.length > 0 && (
                            <div className="flex flex-col gap-1 mb-2 max-h-[200px] overflow-y-auto">
                                {card.tasks.map((task) => (
                                    <div key={task.id} className="flex items-center gap-2">
                                        <Checkbox
                                            checked={task.is_completed}
                                            onCheckedChange={(checked) =>
                                                updateTaskFunc(task.id, { is_completed: checked === true })
                                            }
                                        />
                                        <span
                                            className={`flex-1 text-sm ${task.is_completed ? "line-through text-app-text-subtle" : ""}`}
                                        >
                                            {task.content}
                                        </span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon-sm"
                                            className="cursor-pointer text-app-danger shrink-0"
                                            aria-label="Delete subtask"
                                            onClick={() => deleteTaskFunc(task.id)}
                                        >
                                            ✕
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-2">
                            <Input
                                type="text"
                                placeholder="Add a subtask..."
                                value={newTaskContent}
                                onChange={(e) => setNewTaskContent(e.target.value)}
                                onKeyDown={(e) => {
                                    // Enter would otherwise submit the whole card form (Save + close)
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddTask();
                                    }
                                }}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isAddingTask || !newTaskContent.trim()}
                                onClick={handleAddTask}
                            >
                                Add
                            </Button>
                        </div>
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
