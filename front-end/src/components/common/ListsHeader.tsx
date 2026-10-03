import { useState } from "react";
import { Input } from "@/components/ui/input";
import DeletingModal from "@/components/common/DeletingModal";
import { Trash2, Archive } from "lucide-react";
import type { BoardList } from "@/types/board";

export default function ListsHeader({ boardList, submitFunc, deleteFunc, archiveFunc }: { boardList: BoardList, submitFunc: (listId: number, title: string) => Promise<void>, deleteFunc: (list_id: number) => Promise<void>, archiveFunc: (list_id: number) => Promise<void> }) {
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
                    className="w-full cursor-pointer hover:bg-[#E6E8EC] rounded-md p-1 transition-colors duration-150"
                >
                    <h3 className="font-semibold text-sm text-[#14161A]">
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
                        className="w-full text-sm h-9 rounded-[10px] border-[#E1E4E8] bg-white shadow-none focus-visible:border-[#0F766E] focus-visible:ring-[#0F766E]/25"
                    />
                </form>
            )}

            <button
                onClick={() => archiveFunc(boardList.id)}
                className="cursor-pointer inline-flex size-8 shrink-0 items-center justify-center text-[#5B6270] hover:text-[#14161A] hover:bg-[#E6E8EC] rounded-lg transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]"
                aria-label="Archive list"
            >
                <Archive size={16} strokeWidth={2} />
            </button>

            <DeletingModal
                title={`Delete ${boardList.title}`}
                description={`Are you sure you want to delete "${boardList.title}"?`}
                button={
                    <button
                        className="cursor-pointer inline-flex size-8 shrink-0 items-center justify-center text-[#5B6270] hover:text-[#14161A] hover:bg-[#E6E8EC] rounded-lg transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]"
                    >
                        <Trash2 size={16} color="#dc2626" strokeWidth={2} />
                    </button>
                }
                submission={() => deleteFunc(boardList.id)}
            />
        </>
    )
}