import { useState } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DeletingModal from "@/components/common/DeletingModal";
import { LABEL_COLORS } from "@/lib/labelColors";
import type { BoardLabel } from "@/types/board";

function ColorSwatchPicker({ value, onChange }: { value: string; onChange: (color: string) => void }) {
    return (
        <div className="flex flex-wrap gap-2">
            {LABEL_COLORS.map((c) => (
                <button
                    key={c.value}
                    type="button"
                    title={c.name}
                    onClick={() => onChange(c.value)}
                    className={`h-6 w-6 rounded-full cursor-pointer transition-shadow ${value === c.value ? "ring-2 ring-offset-2 ring-app-text" : ""
                        }`}
                    style={{ backgroundColor: c.value }}
                />
            ))}
        </div>
    );
}

function LabelRow({
    label,
    updateFunc,
    deleteFunc,
}: {
    label: BoardLabel;
    updateFunc: (label_id: number, updates: { name?: string; color?: string }) => Promise<void>;
    deleteFunc: (label_id: number) => Promise<void>;
}) {
    const [name, setName] = useState(label.name);
    const [showColors, setShowColors] = useState(false);

    const handleNameBlur = async () => {
        const trimmed = name.trim();
        if (!trimmed || trimmed === label.name) {
            setName(label.name);
            return;
        }
        await updateFunc(label.id, { name: trimmed });
    };

    const handleColorChange = async (color: string) => {
        setShowColors(false);
        if (color === label.color) return;
        await updateFunc(label.id, { color });
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    title="Change color"
                    onClick={() => setShowColors((s) => !s)}
                    className="h-6 w-6 shrink-0 rounded-full cursor-pointer"
                    style={{ backgroundColor: label.color }}
                />
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={handleNameBlur}
                    onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                    className="h-8 flex-1"
                />
                <DeletingModal
                    title="Delete label"
                    description={
                        label.card_count > 0
                            ? `This label is used on ${label.card_count} card${label.card_count === 1 ? "" : "s"}. Deleting it will remove it from all of them. This action cannot be undone.`
                            : "This action cannot be undone."
                    }
                    button={
                        <Button type="button" variant="ghost" size="icon-sm" className="cursor-pointer text-app-danger shrink-0">
                            ✕
                        </Button>
                    }
                    submission={() => deleteFunc(label.id)}
                />
            </div>
            {showColors && <ColorSwatchPicker value={label.color} onChange={handleColorChange} />}
        </div>
    );
}

export default function ManageLabelsModal({
    labels,
    createFunc,
    updateFunc,
    deleteFunc,
}: {
    labels: BoardLabel[];
    createFunc: (name: string, color: string) => Promise<void>;
    updateFunc: (label_id: number, updates: { name?: string; color?: string }) => Promise<void>;
    deleteFunc: (label_id: number) => Promise<void>;
}) {
    const [open, setOpen] = useState(false);
    const [newName, setNewName] = useState("");
    const [newColor, setNewColor] = useState<string>(LABEL_COLORS[0].value);
    const [isCreating, setIsCreating] = useState(false);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isCreating || !newName.trim()) return;

        setIsCreating(true);
        await createFunc(newName.trim(), newColor);
        setIsCreating(false);

        setNewName("");
        setNewColor(LABEL_COLORS[0].value);
    };

    // newName/newColor live on this component, which stays mounted the
    // whole time (only DialogContent's subtree unmounts on close) — clear
    // them explicitly on close so a half-typed label name doesn't linger
    // for next time the modal opens.
    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen);
        if (!nextOpen) {
            setNewName("");
            setNewColor(LABEL_COLORS[0].value);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" className="cursor-pointer">Manage labels</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Manage labels</DialogTitle>
                    <DialogDescription>Create, rename, recolor, or delete labels for this board.</DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto">
                    {labels.length === 0 && (
                        <p className="text-sm text-app-text-subtle">No labels yet — add one below.</p>
                    )}
                    {labels.map((label) => (
                        <LabelRow key={label.id} label={label} updateFunc={updateFunc} deleteFunc={deleteFunc} />
                    ))}
                </div>

                <form onSubmit={handleCreate} className="flex flex-col gap-2 border-t pt-4">
                    <label className="text-sm font-bold text-gray-700">Add a label</label>
                    <Input
                        placeholder="Label name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                    <ColorSwatchPicker value={newColor} onChange={setNewColor} />
                    <Button type="submit" disabled={isCreating || !newName.trim()} className="cursor-pointer">
                        Add label
                    </Button>
                </form>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
