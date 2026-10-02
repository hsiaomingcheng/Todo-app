import { Calendar, Check, ListChecks, Plus, Search } from "lucide-react";

import { Badge } from "../ui/badge";

const LABEL_STYLES = {
    Design: "bg-[#FEF3C7] text-[#92400E]",
    Research: "bg-[#DBEAFE] text-[#1E40AF]",
    Dev: "bg-[#EDE9FE] text-[#5B21B6]",
    High: "bg-[#FFEDD5] text-[#9A3412]",
} as const;

type LabelName = keyof typeof LABEL_STYLES;

interface MockCard {
    title: string;
    labels?: LabelName[];
    due?: string;
    subtasks?: string;
    progress?: number; // percent
    done?: boolean;
    dragging?: boolean;
}

interface MockList {
    name: string;
    cards: MockCard[];
    showAddCard?: boolean;
}

const LISTS: MockList[] = [
    {
        name: "To do",
        showAddCard: true,
        cards: [
            { title: "Sketch new homepage layout", labels: ["Design"], due: "Oct 12", subtasks: "1/4" },
            { title: "Collect feedback from the team", labels: ["Research"] },
            { title: "Pick a board color" },
        ],
    },
    {
        name: "In progress",
        cards: [
            {
                title: "Build drag & drop for cards",
                labels: ["Dev", "High"],
                due: "Oct 9",
                subtasks: "3/5",
                progress: 60,
                dragging: true,
            },
            { title: "Write copy for the landing page", labels: ["Design"] },
        ],
    },
    {
        name: "Done",
        cards: [
            { title: "Set up the project repo", subtasks: "4/4", done: true },
            { title: "Create the first board", done: true },
        ],
    },
];

function MockCardView({ card }: { card: MockCard }) {
    return (
        <div
            className={`flex flex-col gap-2 rounded-lg bg-white px-3 py-2.5 ${
                card.dragging
                    ? "-rotate-2 shadow-[0_10px_24px_-8px_rgba(20,22,26,0.3)]"
                    : "shadow-[0_1px_2px_rgba(20,22,26,0.08)]"
            }`}
        >
            {card.labels && (
                <div className="flex gap-1.5">
                    {card.labels.map((label) => (
                        <Badge
                            key={label}
                            className={`h-auto rounded-full px-2 py-0.5 text-[11px] font-semibold ${LABEL_STYLES[label]}`}
                        >
                            {label}
                        </Badge>
                    ))}
                </div>
            )}
            <span
                className={`text-[13px] leading-[1.4] ${
                    card.done ? "text-[#5B6270] line-through" : ""
                }`}
            >
                {card.title}
            </span>
            {card.progress !== undefined && (
                <div className="h-1 overflow-hidden rounded-full bg-[#ECEEF1]">
                    <div className="h-1 bg-[#0F766E]" style={{ width: `${card.progress}%` }} />
                </div>
            )}
            {(card.due || card.subtasks) && (
                <div
                    className={`flex gap-3 text-[11px] ${
                        card.done ? "text-[#0F766E]" : "text-[#5B6270]"
                    }`}
                >
                    {card.due && (
                        <span className="inline-flex items-center gap-1">
                            <Calendar className="size-3" aria-hidden="true" />
                            {card.due}
                        </span>
                    )}
                    {card.subtasks && (
                        <span
                            className={`inline-flex items-center gap-1 ${card.done ? "font-semibold" : ""}`}
                        >
                            {card.done ? (
                                <Check className="size-3" aria-hidden="true" />
                            ) : (
                                <ListChecks className="size-3" aria-hidden="true" />
                            )}
                            {card.subtasks}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}

export default function BoardMockup() {
    return (
        <div
            role="img"
            aria-label="Preview of a kanban board with To do, In progress and Done lists"
            className="overflow-hidden rounded-[18px] border border-[#E1E4E8] bg-[color-mix(in_srgb,#0F766E_10%,#FFFFFF)] p-4 shadow-[0_30px_60px_-30px_rgba(20,22,26,0.3)]"
        >
            <div className="flex items-center justify-between gap-3 px-1 pb-4 pt-1">
                <div className="flex items-center gap-2.5">
                    <span className="size-2.5 rounded-[3px] bg-[#0F766E]" />
                    <span className="text-[15px] font-semibold">Website redesign</span>
                </div>
                <div className="flex h-7 items-center gap-1.5 rounded-lg bg-white px-2.5 text-xs text-[#5B6270]">
                    <Search className="size-[13px]" aria-hidden="true" />
                    Filter cards
                </div>
            </div>

            {/* Lists are a fixed 232px and clipped by overflow-hidden on narrow screens (intentional) */}
            <div className="flex items-start gap-3">
                {LISTS.map((list) => (
                    <div
                        key={list.name}
                        className="flex w-[232px] flex-none flex-col gap-2 rounded-xl bg-[#F1F3F5] p-2.5"
                    >
                        <div className="flex items-center justify-between px-1 pb-1 pt-0.5">
                            <span className="text-[13px] font-semibold">{list.name}</span>
                            <span className="text-xs text-[#5B6270]">{list.cards.length}</span>
                        </div>
                        {list.cards.map((card) => (
                            <MockCardView key={card.title} card={card} />
                        ))}
                        {list.showAddCard && (
                            <div className="flex items-center gap-1.5 px-1 py-1.5 text-xs text-[#5B6270]">
                                <Plus className="size-[13px]" aria-hidden="true" />
                                Add a card
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
