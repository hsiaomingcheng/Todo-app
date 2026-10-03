import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getBoards, createBoard, updateBoard, deleteBoard } from "@/api/apis";
import DeletingModal from "@/components/common/DeletingModal";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useSuppressOutsideClickThrough } from "@/lib/useSuppressOutsideClickThrough";
import { Trash2, Palette } from "lucide-react";

interface Board {
    id: number;
    title: string;
    background: string | null;
    active: boolean;
}

const BOARD_COLORS = [
    "#0052CC",
    "#00875A",
    "#FF9F1A",
    "#C377E0",
    "#00C2E0",
    "#EB5A46",
    "#F2D600",
    "#61BD4F",
];

const DEFAULT_BOARD_COLOR = "#DFE1E6";

export default function BoardsPage() {
    const navigate = useNavigate();
    const [boards, setBoards] = useState<Board[]>([]);
    const [isAddingBoard, setIsAddingBoard] = useState(false);
    const [form, setForm] = useState({ boardName: "" });

    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const response = await getBoards();
                setBoards(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchBoards();
    }, []);

    const createNewBoard = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.boardName) return console.error("Board name is required");
        try {
            await createBoard(form.boardName);
        } catch (error) {
            console.error(error);
        }
        const response = await getBoards();
        setBoards(response.data);
        cleanAddingBoard();
    };

    const handleRenameBoard = async (boardId: number, title: string) => {
        try {
            await updateBoard(boardId, { title });
        } catch (error) {
            console.error(error);
        }
        const response = await getBoards();
        setBoards(response.data);
    };

    const handleChangeBoardBackground = async (boardId: number, background: string) => {
        try {
            await updateBoard(boardId, { background });
        } catch (error) {
            console.error(error);
        }
        const response = await getBoards();
        setBoards(response.data);
    };

    const handleDeleteBoard = async (boardId: number) => {
        try {
            await deleteBoard(boardId);
        } catch (error) {
            console.error(error);
        }
        const response = await getBoards();
        setBoards(response.data);
    };

    const cleanAddingBoard = () => {
        setIsAddingBoard(false);
        setForm({ boardName: "" });
    };

    const activeBoards = boards.filter((b) => b.active);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Page heading */}
            <div className="mb-8">
                <h2 className="text-[28px] font-bold leading-[1.15] tracking-[-0.02em] text-[#14161A]">My boards</h2>
                <p className="mt-1.5 font-[Geist_Mono_Variable,ui-monospace,monospace] text-xs uppercase tracking-[0.12em] text-[#5B6270]">
                    {activeBoards.length} {activeBoards.length === 1 ? "board" : "boards"}
                </p>
            </div>

            {/* Board grid */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
                {activeBoards.map((board) => (
                    <BoardCard
                        key={board.id}
                        board={board}
                        onClick={() => navigate(`/board-lists/${board.id}`)}
                        onRename={(title) => handleRenameBoard(board.id, title)}
                        onChangeBackground={(background) => handleChangeBoardBackground(board.id, background)}
                        onDelete={() => handleDeleteBoard(board.id)}
                    />
                ))}

                {/* New board tile */}
                {!isAddingBoard ? (
                    <button
                        onClick={() => setIsAddingBoard(true)}
                        className="group h-[132px] rounded-[14px] border-[1.5px] border-dashed border-[#C9CED6] flex flex-col items-center justify-center gap-2 text-[#5B6270] hover:border-[#0F766E] hover:bg-[color-mix(in_srgb,#0F766E_6%,#FFFFFF)] hover:text-[#0F766E] transition-colors duration-200 cursor-pointer bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]"
                    >
                        <span className="text-2xl font-light leading-none">+</span>
                        <span className="text-sm font-medium">New board</span>
                    </button>
                ) : (
                    <form
                        onSubmit={createNewBoard}
                        className="h-[132px] rounded-[14px] border-[1.5px] border-[#0F766E] bg-white p-3 flex flex-col gap-2 shadow-sm"
                    >
                        <Input
                            autoFocus
                            type="text"
                            placeholder="Board name..."
                            value={form.boardName}
                            onChange={(e) => setForm({ ...form, boardName: e.target.value })}
                            className="text-sm h-9 rounded-[10px] border-[#E1E4E8] bg-white shadow-none focus-visible:border-[#0F766E] focus-visible:ring-[#0F766E]/25"
                            onKeyDown={(e) => e.key === "Escape" && cleanAddingBoard()}
                        />
                        <div className="flex gap-1.5">
                            <Button
                                type="submit"
                                size="sm"
                                className="flex-1 h-8 rounded-[8px] text-xs font-semibold bg-[#0F766E] hover:bg-[#0F766E]/90"
                            >
                                Create
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                className="h-8 rounded-[8px] text-xs px-2.5 text-[#5B6270]"
                                onClick={cleanAddingBoard}
                            >
                                ✕
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

function BoardCard({
    board,
    onClick,
    onRename,
    onChangeBackground,
    onDelete,
}: {
    board: Board;
    onClick: () => void;
    onRename: (title: string) => Promise<void>;
    onChangeBackground: (background: string) => Promise<void>;
    onDelete: () => void;
}) {
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [titleInput, setTitleInput] = useState(board.title);
    const [isColorDialogOpen, setIsColorDialogOpen] = useState(false);
    const [isSavingColor, setIsSavingColor] = useState(false);
    const [selectedColor, setSelectedColor] = useState(board.background || BOARD_COLORS[0]);
    const colorDialogContentRef = useSuppressOutsideClickThrough<HTMLDivElement>(isColorDialogOpen);
    const color = board.background || DEFAULT_BOARD_COLOR;

    const handleColorDialogOpenChange = (open: boolean) => {
        setIsColorDialogOpen(open);
        if (open) setSelectedColor(board.background || BOARD_COLORS[0]);
    };

    const handleSaveColor = async () => {
        setIsSavingColor(true);
        await onChangeBackground(selectedColor);
        setIsSavingColor(false);
        setIsColorDialogOpen(false);
    };

    const startEditing = (e: React.MouseEvent) => {
        e.stopPropagation();
        setTitleInput(board.title);
        setIsEditingTitle(true);
    };

    const cleanInput = () => {
        setIsEditingTitle(false);
        setTitleInput(board.title);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isProcessing) return;

        const trimmed = titleInput.trim();
        if (!trimmed || trimmed === board.title) {
            cleanInput();
            return;
        }

        setIsProcessing(true);
        await onRename(trimmed);
        setIsProcessing(false);

        setIsEditingTitle(false);
    };

    return (
        <div
            onClick={onClick}
            className="group relative h-[132px] rounded-[14px] overflow-hidden cursor-pointer bg-white border border-[#E6E8EC] hover:border-[#C9CED6] hover:shadow-[0_12px_24px_-12px_rgba(20,22,26,0.2)] transition-[border-color,box-shadow] duration-200"
        >
            {/* Color strip */}
            <div className="h-2 w-full" style={{ backgroundColor: color }} />

            {/* Content */}
            <div className="px-4 pt-3.5 pb-2.5 flex flex-col justify-between h-[calc(100%-8px)]">
                {!isEditingTitle ? (
                    <p
                        onClick={startEditing}
                        className="font-semibold text-[#14161A] text-[15px] leading-snug line-clamp-2 hover:bg-[#F1F3F5] rounded-md p-0.5 -m-0.5 transition-colors duration-150"
                    >
                        {board.title}
                    </p>
                ) : (
                    <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
                        <Input
                            autoFocus
                            type="text"
                            value={titleInput}
                            onChange={(e) => setTitleInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Escape" && cleanInput()}
                            onBlur={() => cleanInput()}
                            disabled={isProcessing}
                            className="text-sm h-8 rounded-[8px] border-[#E1E4E8] bg-white shadow-none focus-visible:border-[#0F766E] focus-visible:ring-[#0F766E]/25"
                        />
                    </form>
                )}

                {/* Color and delete actions */}
                <div className="flex justify-end items-center gap-1">
                    <Dialog open={isColorDialogOpen} onOpenChange={handleColorDialogOpenChange}>
                        <DialogTrigger
                            asChild
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="cursor-pointer inline-flex size-8 items-center justify-center text-[#5B6270] hover:text-[#14161A] hover:bg-[#F1F3F5] rounded-lg transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]"
                                aria-label="Change board color"
                            >
                                <Palette size={16} strokeWidth={2} />
                            </button>
                        </DialogTrigger>

                        <DialogContent
                            ref={colorDialogContentRef}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <DialogHeader>
                                <DialogTitle>Board color</DialogTitle>
                            </DialogHeader>

                            <div className="flex gap-2 flex-wrap">
                                {BOARD_COLORS.map((swatch) => (
                                    <button
                                        key={swatch}
                                        onClick={() => setSelectedColor(swatch)}
                                        className={`w-8 h-8 rounded-full cursor-pointer border-2 transition-transform duration-100 ${selectedColor === swatch ? "border-[#14161A] scale-110" : "border-black/10 hover:scale-110"}`}
                                        style={{ backgroundColor: swatch }}
                                        aria-label={`Set board color to ${swatch}`}
                                    />
                                ))}
                            </div>

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline" className="cursor-pointer">Cancel</Button>
                                </DialogClose>

                                <Button
                                    onClick={handleSaveColor}
                                    disabled={isSavingColor}
                                    className="cursor-pointer bg-[#0F766E] hover:bg-[#0F766E]/90"
                                >
                                    Save
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <DeletingModal
                        title={`Delete ${board.title}`}
                        description={`Are you sure you want to delete "${board.title}"?`}
                        submission={onDelete}
                        button={
                            <button
                                onClick={(e) => e.stopPropagation()}
                                className="cursor-pointer inline-flex size-8 items-center justify-center text-[#5B6270] hover:text-[#14161A] hover:bg-[#F1F3F5] rounded-lg transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]"
                            >
                                <Trash2 size={16} color="#dc2626" strokeWidth={2} />
                            </button>
                        }
                    />
                </div>
            </div>
        </div>
    );
}
