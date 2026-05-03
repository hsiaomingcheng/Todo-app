import { useState } from "react";
import { Input } from "@/components/ui/input";
import DeletingModal from "@/components/common/DeletingModal";
import { Trash2 } from "lucide-react";
import type { BoardList } from "@/types/board";

export default function ListsHeader({ boardList, submitFunc, deleteFunc }: { boardList: BoardList, submitFunc: (listId: number, title: string) => Promise<void>, deleteFunc: (list_id: number) => Promise<void> }) {
    const [isEditingTitle, setIsEditingTitle] = useState<number | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const [formBoardListTitle, setFormBoardListTitle] = useState({
        title: "",
    })

    const cleanInput = () => {
        setFormBoardListTitle({ title: "" });
        setIsEditingTitle(null);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, listId: number) => {
        e.preventDefault();

        if (isProcessing) {
            return;
        }

        setIsProcessing(true);
        await submitFunc(listId, formBoardListTitle.title);
        setIsProcessing(false);

        cleanInput();
    }

    return (
        <>
            {isEditingTitle !== boardList.id ? (
                <div
                    onClick={() => setIsEditingTitle(boardList.id)}
                    className="w-full cursor-pointer hover:bg-gray-200 rounded p-1 transition-colors duration-150"
                >
                    <h3 className="font-bold text-sm text-app-text">
                        {boardList.title}
                    </h3>
                </div>
            ) : (
                <form onSubmit={(e) => handleSubmit(e, boardList.id)}>
                    <Input
                        autoFocus
                        type="text"
                        value={formBoardListTitle.title || boardList.title}
                        onChange={(e) => setFormBoardListTitle({ ...formBoardListTitle, title: e.target.value })}
                        onKeyDown={(e) => e.key === "Escape" && cleanInput()}
                        onBlur={() => cleanInput()}
                        disabled={isProcessing}
                        className="w-full text-sm h-8 border-gray-200 focus-visible:ring-app-primary bg-white"
                    />
                </form>
            )}

            <DeletingModal
                title={`Delete ${boardList.title}`}
                description={`Are you sure you want to delete "${boardList.title}"?`}
                button={
                    <button
                        className="cursor-pointer text-app-text-subtle hover:text-app-text hover:bg-gray-200 rounded p-1 transition-colors duration-150"
                    >
                        <Trash2 size={16} color="#dc2626" strokeWidth={2} />
                    </button>
                }
                submission={() => deleteFunc(boardList.id)}
            />
        </>
    )
}