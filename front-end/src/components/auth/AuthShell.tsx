import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";

import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import AuthPreview from "./AuthPreview";

interface AuthShellProps {
    title: string;
    subtitle: string;
    children: ReactNode;
    footer: ReactNode;
}

export default function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
    return (
        <div className="grid min-h-screen bg-white font-[Geist_Variable,ui-sans-serif,system-ui,sans-serif] text-[#14161A] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <div className="flex min-h-screen flex-col px-6 py-8 sm:px-10">
                <Link
                    to="/"
                    className="inline-flex w-fit items-center gap-2.5 rounded-md text-[17px] font-bold tracking-[-0.02em] outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]"
                >
                    <span className="size-3 rounded-[4px] bg-[#0F766E]" aria-hidden="true" />
                    TodoFlow
                </Link>

                <main className="flex flex-1 items-center justify-center py-10">
                    <div className="w-full max-w-[400px]">
                        <h1 className="text-[32px] font-bold leading-[1.1] tracking-[-0.03em]">
                            {title}
                        </h1>
                        <p className="mt-2 text-[15px] leading-[1.6] text-[#4B5260]">{subtitle}</p>
                        <div className="mt-8">{children}</div>
                        <p className="mt-6 text-sm text-[#5B6270]">{footer}</p>
                    </div>
                </main>

                <p className="text-xs text-[#5B6270]">&copy;2026 Chris Hsiao. All rights reserved.</p>
            </div>

            <aside
                aria-hidden="true"
                className="hidden items-center justify-center overflow-hidden border-l border-[#E1E4E8] bg-[#F7F8FA] p-12 lg:flex"
            >
                <AuthPreview />
            </aside>
        </div>
    );
}
