import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBoard } from "@/api/apis";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface BoardList {
    id: number;
    board_id: number;
    title: string;
    created_at: string;
}

export default function BoardPage() {
    const { boardId } = useParams();
    const [boardLists, setBoardList] = useState<BoardList[]>([]);

    useEffect(() => {
        const fetchBoard = async () => {
            try {
                const response = await getBoard(Number(boardId));
                console.log(response);
                setBoardList(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchBoard();
    }, [])

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
        </div>
    );
}