import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getBoards, createBoard, deleteBoard } from "@/api/apis";
import DeletingModal from "@/components/common/DeletingModal";
import { Trash2 } from "lucide-react";

interface Board {
    id: number;
    title: string;
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
                <h2 className="text-2xl font-bold text-app-text">My Boards</h2>
                <p className="text-sm text-app-text-subtle mt-0.5">
                    {activeBoards.length} {activeBoards.length === 1 ? "board" : "boards"}
                </p>
            </div>

            {/* Board grid */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
                {activeBoards.map((board, index) => (
                    <BoardCard
                        key={board.id}
                        board={board}
                        color={BOARD_COLORS[index % BOARD_COLORS.length]}
                        onClick={() => navigate(`/board-lists/${board.id}`)}
                        onDelete={() => handleDeleteBoard(board.id)}
                    />
                ))}

                {/* New board tile */}
                {!isAddingBoard ? (
                    <button
                        onClick={() => setIsAddingBoard(true)}
                        className="group h-[120px] rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-app-text-subtle hover:border-app-primary hover:text-app-primary transition-colors duration-200 cursor-pointer bg-transparent"
                    >
                        <span className="text-2xl font-light leading-none">+</span>
                        <span className="text-sm font-medium">New board</span>
                    </button>
                ) : (
                    <form
                        onSubmit={createNewBoard}
                        className="h-[120px] rounded-xl border-2 border-app-primary bg-white p-3 flex flex-col gap-2 shadow-sm"
                    >
                        <Input
                            autoFocus
                            type="text"
                            placeholder="Board name..."
                            value={form.boardName}
                            onChange={(e) => setForm({ ...form, boardName: e.target.value })}
                            className="text-sm h-8 border-gray-200 focus-visible:ring-app-primary"
                            onKeyDown={(e) => e.key === "Escape" && cleanAddingBoard()}
                        />
                        <div className="flex gap-1.5">
                            <Button
                                type="submit"
                                size="sm"
                                className="flex-1 h-7 text-xs bg-app-primary hover:bg-app-primary-hover"
                            >
                                Create
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                className="h-7 text-xs px-2"
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
    color,
    onClick,
    onDelete,
}: {
    board: Board;
    color: string;
    onClick: () => void;
    onDelete: () => void;
}) {
    return (
        <div
            onClick={onClick}
            className="group relative h-[120px] rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-200 bg-white border border-gray-100"
        >
            {/* Color strip */}
            <div className="h-2 w-full" style={{ backgroundColor: color }} />

            {/* Content */}
            <div className="p-3 flex flex-col justify-between h-[calc(100%-8px)]">
                <p className="font-semibold text-app-text text-sm leading-snug line-clamp-2">
                    {board.title}
                </p>

                {/* Delete button */}
                <div className="flex justify-end">
                    <DeletingModal
                        title={`Delete ${board.title}`}
                        description={`Are you sure you want to delete "${board.title}"?`}
                        submission={onDelete}
                        button={
                            <button
                                onClick={(e) => e.stopPropagation()}
                                className="cursor-pointer text-app-text-subtle hover:text-app-text hover:bg-gray-200 rounded p-1 transition-colors duration-150"
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
