import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function BoardsPage() {

    useEffect(() => {
        console.log('test')
    }, [])

    return (
        <div>
            <h1>Boards</h1>
            <p>This is the boards page.</p>

            <Button size="lg">Click me</Button>
        </div>
    );
}