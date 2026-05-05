import { useState } from "react";
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
import { Eye, EyeOff } from "lucide-react";

interface PasswordState {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
}

interface PasswordVisibility {
    current_password: boolean;
    new_password: boolean;
    new_password_confirmation: boolean;
}

export default function ChangePasswordModal(
    { submitFunc }: {
        submitFunc: (
            current_password: string,
            new_password: string,
            new_password_confirmation: string
        ) => Promise<void>
    }
) {
    const [open, setOpen] = useState(false);
    const [passwords, setPasswords] = useState<PasswordState>({ current_password: "", new_password: "", new_password_confirmation: "" });
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [showPasswords, setShowPasswords] = useState<PasswordVisibility>({ current_password: false, new_password: false, new_password_confirmation: false });

    const toggleShow = (field: keyof PasswordVisibility) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isProcessing) return;

        setIsProcessing(true);

        try {
            await submitFunc(
                passwords.current_password,
                passwords.new_password,
                passwords.new_password_confirmation
            );
        } finally {
            setIsProcessing(false);
        }

        setOpen(false);
        setPasswords({ current_password: "", new_password: "", new_password_confirmation: "" });
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) setPasswords({ current_password: "", new_password: "", new_password_confirmation: "" });
        }}>
            <DialogTrigger asChild>
                <Button className="cursor-pointer">Change Password</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>Update your password</DialogDescription>
                </DialogHeader>

                {/* Input fields */}
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div className="mb-4">
                        <div className="mb-2">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-1"
                                htmlFor="currentPassword">
                                Current Password
                            </label>
                            <div className="relative">
                                <Input
                                    autoFocus
                                    autoComplete="off"
                                    id="currentPassword"
                                    type={showPasswords.current_password ? "text" : "password"}
                                    placeholder="Current password"
                                    value={passwords.current_password}
                                    onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleShow("current_password")}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPasswords.current_password ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="mb-2">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-1"
                                htmlFor="newPassword">
                                New Password
                            </label>
                            <div className="relative">
                                <Input
                                    autoComplete="off"
                                    id="newPassword"
                                    type={showPasswords.new_password ? "text" : "password"}
                                    placeholder="New password"
                                    value={passwords.new_password}
                                    onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleShow("new_password")}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPasswords.new_password ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="mb-2">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-1"
                                htmlFor="newPasswordConfirmation">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <Input
                                    autoComplete="off"
                                    id="newPasswordConfirmation"
                                    type={showPasswords.new_password_confirmation ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    value={passwords.new_password_confirmation}
                                    onChange={(e) => setPasswords({ ...passwords, new_password_confirmation: e.target.value })}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleShow("new_password_confirmation")}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPasswords.new_password_confirmation ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
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
    )
}