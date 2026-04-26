import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBoardLists, createBoardList } from "@/api/apis";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface BoardList {
    id: number;
    board_id: number;
    title: string;
    created_at: string;
}

export default function BoardListsPage() {
    const { boardId } = useParams();
    const [boardLists, setBoardList] = useState<BoardList[]>([]);
    const [isAddingList, setIsAddingList] = useState(false);
    const [form, setForm] = useState({
        listName: "",
    });

    useEffect(() => {
        const fetchBoard = async () => {
            try {
                const response = await getBoardLists(Number(boardId));
                setBoardList(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchBoard();
    }, [])

    const createNewList = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prevent empty list name
        if (!form.listName) {
            return console.error("List name is required");
        }

        try {
            await createBoardList(Number(boardId), form.listName, boardLists.length + 1)
        } catch (error) {
            console.error(error);
        }

        const response = await getBoardLists(Number(boardId));
        setBoardList(response.data);

        cleanAddingList();
    }

    const cleanAddingList = () => {
        setIsAddingList(false);
        setForm({ listName: "" });
    }

    return (
        <div className="flex gap-4 overflow-x-auto pb-4 items-start min-h-0">
            {boardLists && boardLists.map((boardList) => (
                <div
                    key={boardList.id}
                    className="flex-shrink-0 w-[272px] bg-app-list-bg rounded-xl shadow-sm flex flex-col"
                >
                    {/* List header */}
                    <div className="flex items-center justify-between px-3 pt-3 pb-2">
                        <h3 className="font-semibold text-sm text-app-text">{boardList.title}</h3>

                        {/* TODO: List options menu — rename, archive, delete (calls PATCH /board-lists/:id or DELETE /board-lists/:id) */}
                        <button className="text-app-text-subtle hover:text-app-text hover:bg-gray-200 rounded p-1 transition-colors duration-150">
                            <span className="text-base leading-none">⋯</span>
                        </button>
                    </div>

                    {/* Cards area */}
                    <div className="px-2 flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-280px)]">
                        {/* TODO: Render cards — fetch from GET /lists/:id/cards and map over them */}
                    </div>

                    {/* Add a card footer */}
                    <div className="px-2 pb-2 pt-2">
                        {/* TODO: Add a card — show inline input on click, calls POST /lists/:id/cards */}
                        <button className="w-full text-left text-sm text-app-text-subtle hover:text-app-text hover:bg-gray-200 rounded-lg px-2 py-1.5 transition-colors duration-150">
                            + Add a card
                        </button>
                    </div>
                </div>
            ))}

            {/* Add list column */}
            <div className="flex-shrink-0 w-[272px]">
                {!isAddingList ? (
                    <button
                        onClick={() => setIsAddingList(true)}
                        className="w-full h-11 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center gap-2 text-app-text-subtle hover:border-app-primary hover:text-app-primary transition-colors duration-200 bg-transparent text-sm font-medium"
                    >
                        <span className="text-lg leading-none">+</span>
                        Add a list
                    </button>
                ) : (
                    <form
                        onSubmit={createNewList}
                        className="bg-app-list-bg rounded-xl border-2 border-app-primary p-3 flex flex-col gap-2 shadow-sm"
                    >
                        <Input
                            autoFocus
                            type="text"
                            placeholder="List name..."
                            value={form.listName}
                            onChange={(e) => setForm({ ...form, listName: e.target.value })}
                            className="text-sm h-8 border-gray-200 focus-visible:ring-app-primary bg-white"
                            onKeyDown={(e) => e.key === "Escape" && cleanAddingList()}
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
                                onClick={cleanAddingList}
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
