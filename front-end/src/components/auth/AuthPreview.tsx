import { Calendar, ListChecks } from "lucide-react";

// Decorative stack of cards, echoing the board on the landing page.
// The tilted card is the one "mid-drag" — the page's single signature element.
export default function AuthPreview() {
    return (
        <div className="relative w-full max-w-[380px]">
            <p className="mb-4 font-[Geist_Mono_Variable,ui-monospace,monospace] text-xs uppercase tracking-[0.12em] text-[#5B6270]">
                Today
            </p>

            <div className="flex flex-col gap-3 rounded-[18px] border border-[#E1E4E8] bg-[color-mix(in_srgb,#0F766E_8%,#FFFFFF)] p-4 shadow-[0_30px_60px_-30px_rgba(20,22,26,0.3)]">
                <div className="flex flex-col gap-2 rounded-lg bg-white px-3.5 py-3 shadow-[0_1px_2px_rgba(20,22,26,0.08)]">
                    <span className="w-fit rounded-full bg-[#DBEAFE] px-2 py-0.5 text-[11px] font-semibold text-[#1E40AF]">
                        Research
                    </span>
                    <span className="text-sm leading-[1.4]">Collect feedback from the team</span>
                </div>

                <div className="-mx-3 flex -rotate-2 flex-col gap-2 rounded-lg bg-white px-3.5 py-3 shadow-[0_14px_28px_-8px_rgba(20,22,26,0.3)]">
                    <div className="flex gap-1.5">
                        <span className="rounded-full bg-[#EDE9FE] px-2 py-0.5 text-[11px] font-semibold text-[#5B21B6]">
                            Dev
                        </span>
                        <span className="rounded-full bg-[#FFEDD5] px-2 py-0.5 text-[11px] font-semibold text-[#9A3412]">
                            High
                        </span>
                    </div>
                    <span className="text-sm leading-[1.4]">Build drag &amp; drop for cards</span>
                    <div className="h-1 overflow-hidden rounded-full bg-[#ECEEF1]">
                        <div className="h-1 w-3/5 bg-[#0F766E]" />
                    </div>
                    <div className="flex gap-3 text-[11px] text-[#5B6270]">
                        <span className="inline-flex items-center gap-1">
                            <Calendar className="size-3" />
                            Oct 9
                        </span>
                        <span className="inline-flex items-center gap-1">
                            <ListChecks className="size-3" />
                            3/5
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-2 rounded-lg bg-white px-3.5 py-3 shadow-[0_1px_2px_rgba(20,22,26,0.08)]">
                    <span className="w-fit rounded-full bg-[#FEF3C7] px-2 py-0.5 text-[11px] font-semibold text-[#92400E]">
                        Design
                    </span>
                    <span className="text-sm leading-[1.4]">Write copy for the landing page</span>
                </div>
            </div>
        </div>
    );
}
