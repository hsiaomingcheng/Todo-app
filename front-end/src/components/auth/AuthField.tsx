import type { ComponentProps } from "react";

import { Input } from "../ui/input";

interface AuthFieldProps extends ComponentProps<"input"> {
    id: string;
    label: string;
}

export default function AuthField({ id, label, className, ...props }: AuthFieldProps) {
    return (
        <div className={className}>
            <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-[#14161A]">
                {label}
            </label>
            <Input
                id={id}
                className="h-11 rounded-[10px] border-[#E1E4E8] bg-white px-3.5 text-[15px] shadow-none placeholder:text-[#8A92A0] focus-visible:border-[#0F766E] focus-visible:ring-[#0F766E]/25"
                {...props}
            />
        </div>
    );
}
