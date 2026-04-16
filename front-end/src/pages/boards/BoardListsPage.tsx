import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBoardLists, createBoardList } from "@/api/apis";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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
        setForm({
            listName: "",
        });
    }

    return (
        <div className="flex gap-4">
            {boardLists && boardLists.map((boardList) => (
                <Card
                    key={boardList.id}
                    size="sm"
                    className="w-3/12 max-w-xs bg-gray-100"
                >
                    <CardHeader>
                        <CardTitle className="flex justify-between">
                            <div>{boardList.title}</div>
                            <div>...</div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent />
                    <CardFooter className="justify-end">
                        123
                    </CardFooter>
                </Card>
            ))}

            <div>
                {!isAddingList && <Button onClick={() => setIsAddingList(true)}>Add Another List</Button>}

                {isAddingList &&
                    <form onSubmit={createNewList}>
                        <input
                            type="text"
                            placeholder="Enter list name..."
                            value={form.listName}
                            onChange={(e) => setForm({ ...form, listName: e.target.value })}
                        />

                        <Button type="submit">Add List</Button>
                        <Button onClick={cleanAddingList}>Cancel</Button>
                    </form>
                }
            </div>
        </div>
    );
}