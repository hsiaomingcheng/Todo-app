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
                    className="cursor-pointer w-full text-left text-sm text-[#5B6270] hover:text-[#14161A] hover:bg-[#E6E8EC] rounded-lg px-2 py-2 transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]"
                    onClick={() => setAddingCardListId(boardList.id)}
                >
                    + Add a card
                </button>
            ) : (
                <form
                    onSubmit={(e) => handleSubmit(e, boardList.id, index)}
                    className="flex flex-col gap-2"
                >
                    <Input
                        autoFocus
                        type="text"
                        placeholder="Card name..."
                        value={formCard.cardName}
                        onChange={(e) => setFormCard({ ...formCard, cardName: e.target.value })}
                        onKeyDown={(e) => e.key === "Escape" && cleanAddingCard()}
                        onBlur={() => cleanAddingCard()}
                        disabled={isProcessing}
                        className="text-sm h-9 rounded-[10px] border-[#E1E4E8] bg-white shadow-none focus-visible:border-[#0F766E] focus-visible:ring-[#0F766E]/25"
                    />

                    <div className="flex gap-1.5">
                        <Button
                            type="submit"
                            size="sm"
                            className="flex-1 h-8 rounded-[8px] text-xs font-semibold bg-[#0F766E] text-white hover:bg-[#0F766E]/90"
                            onMouseDown={(e) => e.preventDefault()}
                            disabled={isProcessing}
                        >
                            Add card
                        </Button>

                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="h-8 rounded-[8px] text-xs px-2.5 text-[#5B6270]"
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