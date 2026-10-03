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
                    <label htmlFor="confirmText" className="text-sm">Type <strong className="text-[#B91C1C] font-bold">Delete</strong> to confirm</label>
                    <Input
                        id="confirmText"
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="mt-1.5 h-11 rounded-[10px] border-[#E1E4E8] bg-white px-3.5 text-[15px] shadow-none focus-visible:border-[#0F766E] focus-visible:ring-[#0F766E]/25"
                    />
                </div>

                <DialogFooter>
                    <DialogClose
                        asChild
                        onClick={() => setText("")}
                    >
                        <Button variant="outline" className="h-10 cursor-pointer rounded-[10px]">Cancel</Button>
                    </DialogClose>

                    <Button
                        variant="destructive"
                        className="h-10 rounded-[10px] font-semibold"
                        onClick={() => submissionHandler()}
                        disabled={text.toLowerCase() !== "delete"}
                    >Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}