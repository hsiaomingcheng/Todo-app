import { useEffect, useState } from "react";
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
import type { UserDetails } from "@/types/board";

export default function EditProfileModal(
    { user, submitFunc }: {
        user: UserDetails,
        submitFunc: (id: number, email: string, first_name: string, last_name: string) => Promise<void>
    }
) {
    const [open, setOpen] = useState(false);
    const [userData, setUserData] = useState<UserDetails>(user);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    useEffect(() => {
        setUserData(user);
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isProcessing) return;

        if (!userData.first_name.trim() || !userData.last_name.trim() || !userData.email.trim()) return;

        setIsProcessing(true);
        await submitFunc(
            userData.id,
            userData.email,
            userData.first_name,
            userData.last_name
        );
        setIsProcessing(false);

        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="cursor-pointer">Edit Profile</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>Update your profile information</DialogDescription>
                </DialogHeader>

                {/* Input fields */}
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div className="mb-4">
                        <div className="mb-2">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-1"
                                htmlFor="firstName">
                                First name
                            </label>
                            <Input
                                autoFocus
                                autoComplete="off"
                                id="firstName"
                                type="text"
                                placeholder="First name"
                                value={userData.first_name}
                                onChange={(e) => setUserData({ ...userData, first_name: e.target.value })}
                            />
                        </div>

                        <div className="mb-2">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-1"
                                htmlFor="lastName">
                                Last name
                            </label>
                            <Input
                                autoComplete="off"
                                id="lastName"
                                type="text"
                                placeholder="Last name"
                                value={userData.last_name}
                                onChange={(e) => setUserData({ ...userData, last_name: e.target.value })}
                            />
                        </div>

                        <div className="mb-2">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-1"
                                htmlFor="email">
                                Email
                            </label>
                            <Input
                                autoComplete="off"
                                id="email"
                                type="email"
                                placeholder="Email"
                                value={userData.email}
                                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>

                        <Button type="submit" disabled={isProcessing}>Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
