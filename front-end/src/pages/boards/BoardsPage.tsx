import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getBoards, deleteBoards } from "@/api/apis";
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

    return (
        <div>
            <div className="flex gap-4">
                {boards && boards.map((board) => (
                    board.active &&
                    <Card
                        key={board.id}
                        size="sm"
                        className={`w-full max-w-sm bg-gray-100 cursor-pointer`}
                        onClick={() => navigate(`/boards/${board.id}`)}
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
            </div>
        </div >
    );
}