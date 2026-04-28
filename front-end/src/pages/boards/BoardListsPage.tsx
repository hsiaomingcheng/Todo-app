import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    getBoard,
    createBoardList,
    updateBoardList,
    deleteBoardList,
    createCard
} from "@/api/apis";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, FilePen } from "lucide-react";

interface Card {
    id: number;
    list_id: number;
    title: string;
    created_at: string;
    position: number;
    description: string;
}
interface BoardList {
    id: number;
    board_id: number;
    title: string;
    created_at: string;
    position: number;
    cards: Card[];
}
interface Board {
    id: number;
    title: string;
    created_at: string;
    lists: BoardList[];
}

export default function BoardListsPage() {
    const { boardId } = useParams();
    const [board, setBoard] = useState<Board | null>(null);
    const [isAddingList, setIsAddingList] = useState(false);
    const [addingCardListId, setAddingCardListId] = useState<number | null>(null);
    const [isEditingTitle, setIsEditingTitle] = useState<number | null>(null);
    const [form, setForm] = useState({
        listName: "",
    });
    const [formCard, setFormCard] = useState({
        cardName: "",
    });
    const [formBoardListTitle, setFormBoardListTitle] = useState({
        title: "",
    })

    // fetch board lists
    useEffect(() => {
        const fetchBoard = async () => {
            try {
                const response = await getBoard(Number(boardId));
                setBoard(response.data);
                console.log("response.data: ", response.data)
            } catch (error) {
                console.error(error);
            }
        };

        fetchBoard();
    }, [])

    // Clean up form when user click other lists to edit title, or click outside the list
    useEffect(() => {
        if (isEditingTitle) {
            setFormBoardListTitle({ title: "" });
        }
    }, [isEditingTitle])

    const createNewList = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prevent empty list name
        if (!form.listName) {
            return console.error("List name is required");
        }

        try {
            await createBoardList(Number(boardId), form.listName, (board?.lists?.length ?? 0) + 1)
        } catch (error) {
            console.error(error);
        }

        const response = await getBoard(Number(boardId));
        setBoard(response.data);

        cleanAddingList();
    }
    const createNewCard = async (e: React.FormEvent, listId: number, index: number) => {
        e.preventDefault();

        // Prevent empty card name
        if (!formCard.cardName) {
            return console.error("Card name is required");
        }

        try {
            await createCard(Number(listId), formCard.cardName, (board?.lists[index]?.cards?.length ?? 0) + 1)
        } catch (error) {
            console.error(error);
        }

        const response = await getBoard(Number(boardId));
        setBoard(response.data);

        cleanAddingCard();
    }

    const updateTitle = async (list_id: number, title: string) => {
        try {
            await updateBoardList(list_id, title);
        } catch (error) {
            console.error(error);
        }

        const response = await getBoard(Number(boardId));
        setBoard(response.data);

        cleanEditingTitle();
    }

    const deleteList = async (list_id: number) => {
        try {
            await deleteBoardList(list_id);
        } catch (error) {
            console.error(error);
        }

        const response = await getBoard(Number(boardId));
        setBoard(response.data);
    }

    const cleanAddingList = () => {
        setIsAddingList(false);
        setForm({ listName: "" });
    }
    const cleanAddingCard = () => {
        setAddingCardListId(null);
        setFormCard({ cardName: "" });
    }
    const cleanEditingTitle = () => {
        setIsEditingTitle(null);
        setFormBoardListTitle({ title: "" });
    }

    // handle board list title input
    const handleTitleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>, listId: number, title: string) => {
        if (e.key === "Enter") {
            await updateTitle(listId, title);
        }

        if (e.key === "Escape") {
            cleanEditingTitle();
        }
    }

    return (
        <div className="flex gap-4 overflow-x-auto pb-4 items-start min-h-0">
            {board?.lists?.map((boardList, index) => (
                <div
                    key={boardList.id}
                    className="flex-shrink-0 w-[272px] bg-app-list-bg rounded-xl shadow-sm flex flex-col"
                >
                    {/* List header */}
                    <div className="flex items-center justify-between px-3 pt-3 pb-2">
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
                            <Input
                                autoFocus
                                type="text"
                                value={formBoardListTitle.title || boardList.title}
                                onChange={(e) => setFormBoardListTitle({ ...formBoardListTitle, title: e.target.value })}
                                onKeyDown={(e) => handleTitleKeyDown(e, boardList.id, formBoardListTitle.title)}
                                onBlur={() => cleanEditingTitle()}
                                className="w-full text-sm h-8 border-gray-200 focus-visible:ring-app-primary bg-white"
                            />
                        )}

                        <button
                            className="cursor-pointer text-app-text-subtle hover:text-app-text hover:bg-gray-200 rounded p-1 transition-colors duration-150"
                            onClick={() => deleteList(boardList.id)}
                        >
                            <Trash2 size={16} color="#dc2626" strokeWidth={2} />
                        </button>
                    </div>

                    {/* Cards area */}
                    <div className="px-2 flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-280px)]">
                        {/* TODO: Render cards — fetch from GET /lists/:id/cards and map over them */}
                        {boardList.cards?.map((card) => (
                            <div key={card.id} className="cursor-pointer bg-white group flex justify-between items-center shadow-sm rounded-md p-2 hover:bg-gray-50 transition-colors duration-150">
                                <div className="text-sm">
                                    {card.title}
                                </div>

                                <FilePen size={16} color="#000" strokeWidth={2} className="opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                            </div>
                        ))}
                    </div>

                    {/* Add a card footer */}
                    <div className="px-2 pb-2 pt-2">
                        {/* TODO: Add a card — show inline input on click, calls POST /lists/:id/cards */}
                        {addingCardListId !== boardList.id ? (
                            <button
                                className="cursor-pointer w-full text-left text-sm text-app-text-subtle hover:text-app-text hover:bg-gray-200 rounded-lg px-2 py-1.5 transition-colors duration-150"
                                onClick={() => setAddingCardListId(boardList.id)}
                            >
                                + Add a card
                            </button>
                        ) : (
                            <form
                                onSubmit={(e) => createNewCard(e, boardList.id, index)}
                                className=""
                            >
                                <Input
                                    autoFocus
                                    type="text"
                                    placeholder="Card name..."
                                    value={formCard.cardName}
                                    onChange={(e) => setFormCard({ ...formCard, cardName: e.target.value })}
                                    onKeyDown={(e) => e.key === "Escape" && cleanAddingCard()}
                                    onBlur={() => cleanAddingCard()}
                                    className="text-sm h-8 border-gray-200 focus-visible:ring-app-primary bg-white"
                                />
                                <div className="flex gap-1.5">
                                    <Button
                                        type="submit"
                                        size="sm"
                                        className="flex-1 h-7 text-xs bg-app-primary hover:bg-app-primary-hover"
                                    >
                                        Add card
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        className="h-7 text-xs px-2"
                                        onClick={cleanAddingCard}
                                    >
                                        ✕
                                    </Button>
                                </div>
                            </form>
                        )}
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
