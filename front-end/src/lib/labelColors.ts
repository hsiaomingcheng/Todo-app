// Fixed label color palette from todo-app-spec.md §2.3 — labels pick from
// these 8 options rather than a free color picker, to keep boards visually
// consistent.
export const LABEL_COLORS = [
    { name: "Green", value: "#61BD4F" },
    { name: "Yellow", value: "#F2D600" },
    { name: "Orange", value: "#FF9F1A" },
    { name: "Red", value: "#EB5A46" },
    { name: "Purple", value: "#C377E0" },
    { name: "Blue", value: "#0079BF" },
    { name: "Teal", value: "#00C2E0" },
    { name: "Pink", value: "#FF78CB" },
] as const;
