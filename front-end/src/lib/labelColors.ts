// Fixed label color palette — labels pick from these 8 options rather than a
// free color picker, to keep boards visually consistent. Each option is a
// soft tint (`value`, the one stored in the DB) paired with a dark `text`
// shade, the same pastel-chip look used on the landing page.
export const LABEL_COLORS = [
    { name: "Green", value: "#DCFCE7", text: "#166534" },
    { name: "Yellow", value: "#FEF3C7", text: "#92400E" },
    { name: "Orange", value: "#FFEDD5", text: "#9A3412" },
    { name: "Red", value: "#FEE2E2", text: "#991B1B" },
    { name: "Purple", value: "#EDE9FE", text: "#5B21B6" },
    { name: "Blue", value: "#DBEAFE", text: "#1E40AF" },
    { name: "Teal", value: "#CCFBF1", text: "#115E59" },
    { name: "Pink", value: "#FCE7F3", text: "#9D174D" },
] as const;

// Chip colors for a stored label color. Labels created before the palette
// change hold a saturated hex that isn't in LABEL_COLORS; for those we derive
// a matching tint and text shade so old and new labels look alike.
export function getLabelStyle(color: string): { backgroundColor: string; color: string } {
    const match = LABEL_COLORS.find((c) => c.value.toLowerCase() === color.toLowerCase());
    if (match) return { backgroundColor: match.value, color: match.text };

    return {
        backgroundColor: `color-mix(in srgb, ${color} 18%, white)`,
        color: `color-mix(in srgb, ${color} 45%, black)`,
    };
}
