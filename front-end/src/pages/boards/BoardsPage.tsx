import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getBoards, createBoard, deleteBoards } from "@/api/apis";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface Board {
    id: number;
    title: string;
    active: boolean;
}

export default function BoardsPage() {
    const navigate = useNavigate();
    const [boards, setBoards] = useState<Board[]>([]);
    const [isAddingBoard, setIsAddingBoard] = useState(false);
    const [form, setForm] = useState({
        boardName: "",
    });

    // Get user's boards
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
    }, [])

    const createNewBoard = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prevent empty list name
        if (!form.boardName) {
            return console.error("Board name is required");
        }

        try {
            await createBoard(form.boardName);
        } catch (error) {
            console.error(error);
        }

        const response = await getBoards();
        setBoards(response.data);

        cleanAddingBoard();
    }

    const cleanAddingBoard = () => {
        setIsAddingBoard(false);
        setForm({
            boardName: "",
        });
    }

    return (
        <div>
            <div className="flex gap-4">
                {boards && boards.map((board) => (
                    board.active &&
                    <Card
                        key={board.id}
                        size="sm"
                        className={`w-full max-w-sm bg-gray-100 cursor-pointer`}
                        onClick={() => navigate(`/board-lists/${board.id}`)}
                    >
                        <CardHeader>
                            <CardTitle>{board.title}</CardTitle>
                        </CardHeader>
                        <CardContent />
                        <CardFooter className="justify-end">
                            <Button
                                variant="destructive"
                                size="sm"
                                className="w-auto cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteBoards(board.id);
                                }}
                            >
                                Delete
                            </Button>
                        </CardFooter>
                    </Card>
                ))}

                <div>
                    {!isAddingBoard && <Button onClick={() => setIsAddingBoard(true)}>Add Another Board</Button>}

                    {isAddingBoard &&
                        <form onSubmit={createNewBoard}>
                            <input
                                type="text"
                                placeholder="Enter board name..."
                                value={form.boardName}
                                onChange={(e) => setForm({ ...form, boardName: e.target.value })}
                            />

                            <Button type="submit">Add Board</Button>
                            <Button onClick={cleanAddingBoard}>Cancel</Button>
                        </form>
                    }
                </div>
            </div>
        </div >
    );
}