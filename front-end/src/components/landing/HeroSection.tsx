import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import BoardMockup from "./BoardMockup";

export default function HeroSection() {
    return (
        <section
            aria-labelledby="hero-title"
            className="px-6 py-14 sm:py-20 lg:py-26"
        >
            <div className="mx-auto flex max-w-[1200px] flex-col items-stretch gap-14 min-[960px]:flex-row min-[960px]:items-center">
                <div className="flex min-w-0 flex-col items-start gap-6 min-[960px]:flex-1">
                    <Badge
                        variant="outline"
                        className="h-7 rounded-full border-[#E1E4E8] bg-transparent px-3 text-[13px] font-medium text-[#4B5260]"
                    >
                        Kanban task manager · demo
                    </Badge>
                    <h1
                        id="hero-title"
                        className="text-[40px] font-bold leading-[1.05] tracking-[-0.03em] md:text-[52px] min-[1100px]:text-[64px]"
                    >
                        Organize your work with boards
                    </h1>
                    <p className="max-w-[480px] text-lg leading-[1.6] text-[#4B5260]">
                        A Trello-style task manager. Group tasks into boards, lists and cards, and
                        keep every project moving.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                        <Button
                            asChild
                            className="h-12 gap-2 rounded-[10px] bg-[#0F766E] px-[22px] text-[15px] font-semibold text-white hover:bg-[#0F766E]/90"
                        >
                            <Link to="/register">
                                Get started
                                <ArrowRight aria-hidden="true" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="secondary"
                            className="h-12 rounded-[10px] bg-[#F1F3F5] px-[22px] text-[15px] font-semibold text-[#14161A] hover:bg-[#E6E8EC]"
                        >
                            <Link to="/login">Log in</Link>
                        </Button>
                    </div>
                </div>

                <div className="min-w-0 min-[960px]:flex-[1.1]">
                    <BoardMockup />
                </div>
            </div>
        </section>
    );
}
