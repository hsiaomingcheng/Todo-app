import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { BoardLabel } from "@/types/board";
import { getLabelStyle } from "@/lib/labelColors";

export type CompletionFilter = "all" | "active" | "completed";

const COMPLETION_OPTIONS: { value: CompletionFilter; label: string }[] = [
    { value: "all", label: "All cards" },
    { value: "active", label: "Not completed" },
    { value: "completed", label: "Completed" },
];

export default function CardFilter({
    boardLabels,
    selectedLabelIds,
    onToggleLabel,
    completionFilter,
    onCompletionFilterChange,
    matchCount,
    isFilterActive,
    onClear,
}: {
    boardLabels: BoardLabel[];
    selectedLabelIds: Set<number>;
    onToggleLabel: (label_id: number) => void;
    completionFilter: CompletionFilter;
    onCompletionFilterChange: (value: CompletionFilter) => void;
    matchCount: number;
    isFilterActive: boolean;
    onClear: () => void;
}) {
    return (
        <div className="flex items-center gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="h-10 cursor-pointer rounded-[10px] border-[#E1E4E8] bg-white px-4 text-sm font-medium text-[#14161A] shadow-none hover:bg-[#F1F3F5]">
                        Filter{isFilterActive ? ` (${matchCount})` : ""}
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-64 rounded-xl border border-[#E1E4E8] bg-white p-4 shadow-lg ring-0">
                    <div className="flex flex-col gap-4">
                        <div>
                            <p className="text-[13px] font-medium text-[#14161A] mb-2">Status</p>
                            <div className="flex flex-col gap-1.5">
                                {COMPLETION_OPTIONS.map((option) => (
                                    <label
                                        key={option.value}
                                        className="flex items-center gap-2 text-sm cursor-pointer"
                                    >
                                        <input
                                            type="radio"
                                            className="accent-[#0F766E]"
                                            name="completion-filter"
                                            checked={completionFilter === option.value}
                                            onChange={() => onCompletionFilterChange(option.value)}
                                        />
                                        {option.label}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {boardLabels.length > 0 && (
                            <div>
                                <p className="text-[13px] font-medium text-[#14161A] mb-2">Labels</p>
                                <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto">
                                    {boardLabels.map((label) => (
                                        <label
                                            key={label.id}
                                            className="flex items-center gap-2 text-sm cursor-pointer"
                                        >
                                            <Checkbox
                                                checked={selectedLabelIds.has(label.id)}
                                                onCheckedChange={() => onToggleLabel(label.id)}
                                                className="data-checked:border-[#0F766E] data-checked:bg-[#0F766E] data-checked:text-white"
                                            />
                                            <span
                                                className="inline-block w-3 h-3 rounded-full shrink-0"
                                                style={{ backgroundColor: getLabelStyle(label.color).color }}
                                            />
                                            <span className="truncate">{label.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </PopoverContent>
            </Popover>

            {isFilterActive && (
                <>
                    <span className="text-sm text-[#5B6270]">
                        {matchCount} matching card{matchCount === 1 ? "" : "s"}
                    </span>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="cursor-pointer rounded-lg text-[#5B6270] hover:text-[#14161A]"
                        onClick={onClear}
                    >
                        Clear filters
                    </Button>
                </>
            )}
        </div>
    );
}
