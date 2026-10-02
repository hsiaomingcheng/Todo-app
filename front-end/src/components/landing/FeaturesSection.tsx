import {
    Archive,
    Calendar,
    ListChecks,
    Move,
    Palette,
    Search,
    SquareKanban,
    Tag,
    type LucideIcon,
} from "lucide-react";

import { Badge } from "../ui/badge";
import { Card } from "../ui/card";

interface Feature {
    icon: LucideIcon;
    title: string;
    description: string;
}

const FEATURES: Feature[] = [
    {
        icon: SquareKanban,
        title: "Boards, lists & cards",
        description: "Structure any project in three simple levels.",
    },
    {
        icon: Move,
        title: "Drag & drop",
        description: "Move cards between lists and reorder them in a snap.",
    },
    {
        icon: Tag,
        title: "Labels",
        description: "Color-code cards by type, priority or anything you like.",
    },
    {
        icon: ListChecks,
        title: "Subtasks",
        description: "Break a card into smaller steps and check them off.",
    },
    {
        icon: Calendar,
        title: "Due dates",
        description: "Add a deadline to any card so nothing slips.",
    },
    {
        icon: Search,
        title: "Filter & search",
        description: "Narrow a board down to just the cards you need.",
    },
    {
        icon: Archive,
        title: "List archiving",
        description: "Tuck away finished lists without deleting them.",
    },
    {
        icon: Palette,
        title: "Board colors",
        description: "Give each board its own color to tell them apart.",
    },
];

export default function FeaturesSection() {
    return (
        <section
            id="features"
            aria-labelledby="features-title"
            className="bg-[#F7F8FA] px-6 py-16 lg:py-26"
        >
            <div className="mx-auto flex max-w-[1200px] flex-col gap-12">
                <div className="flex max-w-[640px] flex-col items-start gap-3.5">
                    <Badge
                        variant="outline"
                        className="h-[26px] rounded-full border-[#E1E4E8] bg-white px-2.5 text-xs font-semibold text-[#0F766E]"
                    >
                        Features
                    </Badge>
                    <h2
                        id="features-title"
                        className="text-[28px] font-bold leading-[1.15] tracking-[-0.02em] md:text-[34px] lg:text-[40px]"
                    >
                        Everything you need to keep track
                    </h2>
                    <p className="text-[17px] leading-[1.6] text-[#4B5260]">
                        The essentials of a kanban workflow, without the clutter.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {FEATURES.map(({ icon: Icon, title, description }) => (
                        <Card
                            key={title}
                            className="gap-3 rounded-[14px] border border-[#E6E8EC] bg-white p-6 ring-0"
                        >
                            <div className="flex size-10 items-center justify-center rounded-[10px] bg-[color-mix(in_srgb,#0F766E_10%,#FFFFFF)] text-[#0F766E]">
                                <Icon className="size-5" aria-hidden="true" />
                            </div>
                            <h3 className="text-base font-semibold">{title}</h3>
                            <p className="text-sm leading-[1.55] text-[#5B6270]">{description}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
