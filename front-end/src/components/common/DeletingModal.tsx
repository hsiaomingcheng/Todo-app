import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function DeletingModal({
    title,
    description,
    button,
    submission
}: {
    title: string;
    description: string;
    button: React.ReactNode;
    submission: () => void;
}) {
    const [text, setText] = useState("");

    const submissionHandler = () => {
        submission();
        setText("");
    }

    return (
        <Dialog>
            <DialogTrigger
                asChild
                onClick={() => setText("")}
            >
                {button}
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <div>
                    <label htmlFor="confirmText" className="text-sm">Type <strong className="text-red-600 font-bold">Delete</strong> to confirm</label>
                    <Input
                        id="confirmText"
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>

                <DialogFooter>
                    <DialogClose
                        asChild
                        onClick={() => setText("")}
                    >
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>

                    <Button
                        variant="destructive"
                        onClick={() => submissionHandler()}
                        disabled={text.toLowerCase() !== "delete"}
                    >Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}