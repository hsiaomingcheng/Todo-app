import { Badge } from "../ui/badge";

const STEPS = [
    {
        title: "Create an account",
        description: "Sign up and you are ready to start your first board.",
    },
    {
        title: "Set up a board and lists",
        description:
            "Create a board, pick a color, then add lists like To do, In progress and Done.",
    },
    {
        title: "Add cards and get organized",
        description:
            "Add cards with labels, subtasks and due dates, then drag them along as work moves.",
    },
];

export default function HowItWorksSection() {
    return (
        <section
            id="how-it-works"
            aria-labelledby="how-title"
            className="px-6 py-16 lg:py-26"
        >
            <div className="mx-auto flex max-w-[1200px] flex-col gap-12">
                <div className="flex max-w-[640px] flex-col items-start gap-3.5">
                    <Badge
                        variant="outline"
                        className="h-[26px] rounded-full border-[#E1E4E8] bg-white px-2.5 text-xs font-semibold text-[#0F766E]"
                    >
                        How it works
                    </Badge>
                    <h2
                        id="how-title"
                        className="text-[28px] font-bold leading-[1.15] tracking-[-0.02em] md:text-[34px] lg:text-[40px]"
                    >
                        Up and running in three steps
                    </h2>
                </div>

                <ol className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {STEPS.map((step, index) => (
                        <li
                            key={step.title}
                            className="flex flex-col gap-3.5 border-t border-[#E6E8EC] pt-6"
                        >
                            <span className="flex size-9 items-center justify-center rounded-full bg-[#0F766E] text-[15px] font-bold text-white">
                                {index + 1}
                            </span>
                            <h3 className="text-lg font-semibold">{step.title}</h3>
                            <p className="text-[15px] leading-[1.6] text-[#5B6270]">
                                {step.description}
                            </p>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
