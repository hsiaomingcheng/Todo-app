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
                <Button variant="outline" className="h-11 cursor-pointer rounded-[10px] border-[#E1E4E8] bg-white px-5 font-semibold text-[#14161A] hover:bg-[#F1F3F5]">Change password</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change password</DialogTitle>
                    <DialogDescription>Update your password</DialogDescription>
                </DialogHeader>

                {/* Input fields */}
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div className="mb-4">
                        <div className="mb-3">
                            <label
                                className="mb-1.5 block text-[13px] font-medium text-[#14161A]"
                                htmlFor="currentPassword">
                                Current password
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
                                    className="h-11 rounded-[10px] border-[#E1E4E8] bg-white px-3.5 text-[15px] shadow-none focus-visible:border-[#0F766E] focus-visible:ring-[#0F766E]/25 pr-11"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleShow("current_password")}
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex size-8 items-center justify-center rounded-lg text-[#5B6270] hover:bg-[#F1F3F5] hover:text-[#14161A] outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]"
                                >
                                    {showPasswords.current_password ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label
                                className="mb-1.5 block text-[13px] font-medium text-[#14161A]"
                                htmlFor="newPassword">
                                New password
                            </label>
                            <div className="relative">
                                <Input
                                    autoComplete="off"
                                    id="newPassword"
                                    type={showPasswords.new_password ? "text" : "password"}
                                    placeholder="New password"
                                    value={passwords.new_password}
                                    onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
                                    className="h-11 rounded-[10px] border-[#E1E4E8] bg-white px-3.5 text-[15px] shadow-none focus-visible:border-[#0F766E] focus-visible:ring-[#0F766E]/25 pr-11"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleShow("new_password")}
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex size-8 items-center justify-center rounded-lg text-[#5B6270] hover:bg-[#F1F3F5] hover:text-[#14161A] outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]"
                                >
                                    {showPasswords.new_password ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label
                                className="mb-1.5 block text-[13px] font-medium text-[#14161A]"
                                htmlFor="newPasswordConfirmation">
                                Confirm new password
                            </label>
                            <div className="relative">
                                <Input
                                    autoComplete="off"
                                    id="newPasswordConfirmation"
                                    type={showPasswords.new_password_confirmation ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    value={passwords.new_password_confirmation}
                                    onChange={(e) => setPasswords({ ...passwords, new_password_confirmation: e.target.value })}
                                    className="h-11 rounded-[10px] border-[#E1E4E8] bg-white px-3.5 text-[15px] shadow-none focus-visible:border-[#0F766E] focus-visible:ring-[#0F766E]/25 pr-11"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleShow("new_password_confirmation")}
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex size-8 items-center justify-center rounded-lg text-[#5B6270] hover:bg-[#F1F3F5] hover:text-[#14161A] outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]"
                                >
                                    {showPasswords.new_password_confirmation ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" className="h-10 rounded-[10px]">Cancel</Button>
                        </DialogClose>

                        <Button type="submit" disabled={isProcessing} className="h-10 rounded-[10px] bg-[#0F766E] font-semibold text-white hover:bg-[#0F766E]/90">Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}