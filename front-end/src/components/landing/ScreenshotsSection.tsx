import { Badge } from "../ui/badge";
import ScreenshotFrame from "./ScreenshotFrame";

interface Shot {
    tag: string;
    heading: string;
    description: string;
    frameTitle: string;
    pills?: string[];
    src?: string; // TODO: set to the real screenshot path once the image is added
}

const SHOTS: Shot[] = [
    {
        tag: "Board view",
        heading: "See the whole project at a glance",
        description: "Lists sit side by side, and cards move between them as work progresses.",
        frameTitle: "Board view screenshot",
        src: "/board-view.png",
    },
    {
        tag: "Card detail",
        heading: "Everything about a task in one place",
        description: "Open a card to add labels, check off subtasks and set a due date.",
        frameTitle: "Card detail screenshot",
        pills: ["Labels", "Subtasks", "Due date"],
        src: "/card-detail.png",
    },
];

export default function ScreenshotsSection() {
    return (
        <section
            id="screenshots"
            aria-labelledby="shots-title"
            className="bg-[#F7F8FA] px-6 py-16 lg:py-26"
        >
            <div className="mx-auto flex max-w-[1200px] flex-col gap-14">
                <div className="flex max-w-[640px] flex-col items-start gap-3.5">
                    <Badge
                        variant="outline"
                        className="h-[26px] rounded-full border-[#E1E4E8] bg-white px-2.5 text-xs font-semibold text-[#0F766E]"
                    >
                        Screenshots
                    </Badge>
                    <h2
                        id="shots-title"
                        className="text-[28px] font-bold leading-[1.15] tracking-[-0.02em] md:text-[34px] lg:text-[40px]"
                    >
                        A look inside the app
                    </h2>
                </div>

                {SHOTS.map((shot) => (
                    <div
                        key={shot.tag}
                        className="flex flex-col gap-10 lg:flex-row lg:items-center"
                    >
                        <div className="flex min-w-0 flex-col items-start gap-3 lg:flex-1">
                            <Badge
                                variant="secondary"
                                className="h-6 rounded-full bg-[#ECEEF1] px-2.5 text-xs font-semibold text-[#3A404B]"
                            >
                                {shot.tag}
                            </Badge>
                            <h3 className="text-[22px] font-semibold leading-[1.3]">
                                {shot.heading}
                            </h3>
                            <p className="text-[15px] leading-[1.6] text-[#5B6270]">
                                {shot.description}
                            </p>
                            {shot.pills && (
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {shot.pills.map((pill) => (
                                        <Badge
                                            key={pill}
                                            variant="outline"
                                            className="h-6 rounded-full border-[#E1E4E8] bg-white px-2.5 text-xs font-medium text-[#3A404B]"
                                        >
                                            {pill}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="min-w-0 lg:flex-[2]">
                            <ScreenshotFrame title={shot.frameTitle} src={shot.src} />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
