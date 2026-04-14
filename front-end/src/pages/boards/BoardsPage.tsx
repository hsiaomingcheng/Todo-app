import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getBoards } from "@/api/apis";

export default function BoardsPage() {

    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const response = await getBoards();
                console.log(response);
            } catch (error) {
                console.error(error);
            }
        };

        fetchBoards();
    }, [])

    return (
        <div>
            <h1>Boards</h1>
            <p>This is the boards page.</p>

            <Button size="lg">Click me</Button>
        </div>
    );
}