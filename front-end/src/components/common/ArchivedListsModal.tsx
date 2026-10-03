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
import { getArchivedBoardLists, updateBoardListArchived } from "@/api/apis";
import type { ArchivedBoardList } from "@/types/board";

export default function ArchivedListsModal({
    boardId,
    onRestored,
}: {
    boardId: number;
    onRestored: () => Promise<void>;
}) {
    const [open, setOpen] = useState(false);
    const [archivedLists, setArchivedLists] = useState<ArchivedBoardList[]>([]);
    const [restoringId, setRestoringId] = useState<number | null>(null);

    const fetchArchivedLists = async () => {
        try {
            const response = await getArchivedBoardLists(boardId);
            setArchivedLists(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen);
        if (nextOpen) fetchArchivedLists();
    };

    const handleRestore = async (list_id: number) => {
        setRestoringId(list_id);
        try {
            await updateBoardListArchived(list_id, false);
            await Promise.all([fetchArchivedLists(), onRestored()]);
        } catch (error) {
            console.error(error);
        }
        setRestoringId(null);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" className="h-10 cursor-pointer rounded-[10px] border-[#E1E4E8] bg-white px-4 text-sm font-medium text-[#14161A] shadow-none hover:bg-[#F1F3F5]">Archived lists</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Archived lists</DialogTitle>
                    <DialogDescription>Restore a list to bring it back onto the board.</DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
                    {archivedLists.length === 0 && (
                        <p className="text-sm text-app-text-subtle">No archived lists.</p>
                    )}
                    {archivedLists.map((list) => (
                        <div key={list.id} className="flex items-center justify-between gap-2 border rounded-md px-3 py-2">
                            <span className="text-sm font-medium text-app-text">{list.title}</span>
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="cursor-pointer"
                                disabled={restoringId === list.id}
                                onClick={() => handleRestore(list.id)}
                            >
                                Restore
                            </Button>
                        </div>
                    ))}
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
