import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { BoardList } from "@/types/board";

export default function ListsFooter({ index, boardList, handleCreateCard }: { index: number, boardList: BoardList, handleCreateCard: (listId: number, cardName: string, index: number) => Promise<void> }) {
    const [addingCardListId, setAddingCardListId] = useState<number | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const [formCard, setFormCard] = useState({
        cardName: "",
    });

    const cleanAddingCard = () => {
        setAddingCardListId(null);
        setFormCard({ cardName: "" });
    }

    const handleSubmit = async (e: React.SyntheticEvent, listId: number, index: number) => {
        e.preventDefault();

        if (isProcessing) {
            return;
        }

        if (!formCard.cardName) {
            return console.error("Card name is required");
        }

        setIsProcessing(true);

        await handleCreateCard(listId, formCard.cardName, index);

        setIsProcessing(false);

        cleanAddingCard();
    }

    return (
        <>
            {addingCardListId !== boardList.id ? (
                <button
                    className="cursor-pointer w-full text-left text-sm text-app-text-subtle hover:text-app-text hover:bg-gray-200 rounded-lg px-2 py-1.5 transition-colors duration-150"
                    onClick={() => setAddingCardListId(boardList.id)}
                >
                    + Add a card
                </button>
            ) : (
                <form onSubmit={(e) => handleSubmit(e, boardList.id, index)}>
                    <Input
                        autoFocus
                        type="text"
                        placeholder="Card name..."
                        value={formCard.cardName}
                        onChange={(e) => setFormCard({ ...formCard, cardName: e.target.value })}
                        onKeyDown={(e) => e.key === "Escape" && cleanAddingCard()}
                        onBlur={() => cleanAddingCard()}
                        disabled={isProcessing}
                        className="text-sm h-8 border-gray-200 focus-visible:ring-app-primary bg-white"
                    />

                    <div className="flex gap-1.5">
                        <Button
                            type="submit"
                            size="sm"
                            className="flex-1 h-7 text-xs bg-app-primary hover:bg-app-primary-hover"
                            onMouseDown={(e) => e.preventDefault()}
                            disabled={isProcessing}
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
        </>
    )
}