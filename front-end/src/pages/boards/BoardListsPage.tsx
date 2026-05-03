import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    getBoard,
    createBoardList,
    updateBoardListTitle,
    updateBoardListPosition,
    deleteBoardList,
    createCard,
    updateCardPosition
} from "@/api/apis";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Cards from "@/components/common/Cards";
import ListsFooter from "@/components/common/ListsFooter";
import ListsHeader from "@/components/common/ListsHeader";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { Board } from "@/types/board";

export default function BoardListsPage() {
    const { boardId } = useParams();
    const [board, setBoard] = useState<Board | null>(null);
    const [isAddingList, setIsAddingList] = useState(false);
    const [form, setForm] = useState({
        listName: "",
    });

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
    const createNewCard = async (listId: number, cardName: string, index: number) => {
        try {
            await createCard(Number(listId), cardName, (board?.lists[index]?.cards?.length ?? 0) + 1)
        } catch (error) {
            console.error(error);
        }

        const response = await getBoard(Number(boardId));
        setBoard(response.data);
    }

    const updateTitle = async (list_id: number, title: string) => {
        try {
            await updateBoardListTitle(list_id, title);
        } catch (error) {
            console.error(error);
        }

        const response = await getBoard(Number(boardId));
        setBoard(response.data);
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

    const onDragEnd = async (result: any) => {
        const { destination, source, type } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        // ── List reorder ──────────────────────────────────────────────────────
        if (type === "LIST") {
            const newLists = Array.from(board!.lists);
            const [moved] = newLists.splice(source.index, 1);
            newLists.splice(destination.index, 0, moved);
            setBoard({ ...board!, lists: newLists });

            try {
                await Promise.all(
                    newLists.map((list, index) =>
                        updateBoardListPosition(list.id, index + 1)
                    )
                );
            } catch (error) {
                console.error(error);
                const response = await getBoard(Number(boardId));
                setBoard(response.data);
            }
            return;
        }

        // ── Card move ─────────────────────────────────────────────────────────
        if (type === "CARD") {
            const sourceListId = parseInt(source.droppableId);
            const destListId = parseInt(destination.droppableId);
            const newLists = board!.lists.map(l => ({ ...l, cards: [...l.cards] }));
            const sourceList = newLists.find(l => l.id === sourceListId)!;
            const destList = newLists.find(l => l.id === destListId)!;

            const [movedCard] = sourceList.cards.splice(source.index, 1);
            destList.cards.splice(destination.index, 0, movedCard);
            setBoard({ ...board!, lists: newLists });

            try {
                // Update moved card — include list_id if moved to a different list
                await updateCardPosition(
                    movedCard.id,
                    destination.index + 1,
                    sourceListId !== destListId ? destListId : undefined
                );

                // Re-index source list cards if card moved to a different list
                if (sourceListId !== destListId) {
                    await Promise.all(
                        sourceList.cards.map((card, index) =>
                            updateCardPosition(card.id, index + 1)
                        )
                    );
                }

                // Re-index destination list cards
                await Promise.all(
                    destList.cards.map((card, index) =>
                        updateCardPosition(card.id, index + 1)
                    )
                );
            } catch (error) {
                console.error(error);
                const response = await getBoard(Number(boardId));
                setBoard(response.data);
            }
        }
    }

    const cleanAddingList = () => {
        setIsAddingList(false);
        setForm({ listName: "" });
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-4 overflow-x-auto pb-4 items-start min-h-0">
                <Droppable droppableId="board-lists" direction="horizontal" type="LIST">
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="flex gap-4 items-start"
                        >
                            {board?.lists?.map((boardList, index) => (
                                <Draggable key={boardList.id} draggableId={String(boardList.id)} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className="flex-shrink-0 w-[272px] bg-app-list-bg rounded-xl shadow-sm flex flex-col"
                                        >
                                            {/* List header — drag handle is here only */}
                                            <div
                                                {...provided.dragHandleProps}
                                                className="flex items-center justify-between px-3 pt-3 pb-2"
                                            >
                                                <ListsHeader
                                                    boardList={boardList}
                                                    submitFunc={updateTitle}
                                                    deleteFunc={deleteList}
                                                />
                                            </div>

                                            {/* Cards area */}
                                            <Droppable droppableId={String(boardList.id)} type="CARD">
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.droppableProps}
                                                        className="px-2 flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-280px)] min-h-[4px]"
                                                    >
                                                        {boardList.cards?.map((card, cardIndex) => (
                                                            <Draggable key={card.id} draggableId={`card-${card.id}`} index={cardIndex}>
                                                                {(provided) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                    >
                                                                        <Cards card={card} />
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>

                                            {/* List footer */}
                                            <div className="px-2 pb-2 pt-2">
                                                <ListsFooter
                                                    index={index}
                                                    boardList={boardList}
                                                    handleCreateCard={createNewCard}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>

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
        </DragDropContext>
    );
}
