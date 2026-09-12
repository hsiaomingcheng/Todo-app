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
import { useSuppressOutsideClickThrough } from "@/lib/useSuppressOutsideClickThrough";
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
    const [isOpen, setIsOpen] = useState(false);
    const contentRef = useSuppressOutsideClickThrough<HTMLDivElement>(isOpen);

    const submissionHandler = () => {
        submission();
        setText("");
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger
                asChild
                onClick={() => setText("")}
            >
                {button}
            </DialogTrigger>

            <DialogContent
                ref={contentRef}
                onCloseAutoFocus={(e) => e.preventDefault()}
                onClick={(e) => e.stopPropagation()}
            >
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
                        <Button variant="outline" className="cursor-pointer">Cancel</Button>
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