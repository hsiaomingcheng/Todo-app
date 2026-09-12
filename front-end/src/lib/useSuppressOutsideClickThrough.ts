import { useEffect, useRef } from "react";

// When a Dialog is dismissed by tapping/clicking outside it, the click (or,
// on touch devices, the compatibility click that follows a tap) can fall
// through to whatever's underneath (e.g. a card with its own onClick) once
// the dialog unmounts. Radix handles "outside" detection differently for
// mouse (on pointerdown) vs touch (deferred to the following click event),
// so a fix hung off Radix's own onPointerDownOutside timing only closes the
// gap for mouse. This hook does its own earliest-possible (capture-phase)
// pointerdown detection instead, so it works the same way for both.
export function useSuppressOutsideClickThrough<T extends HTMLElement>(open: boolean) {
    const contentRef = useRef<T | null>(null);

    useEffect(() => {
        if (!open) return;

        const handlePointerDown = (e: PointerEvent) => {
            const content = contentRef.current;
            if (content && !content.contains(e.target as Node)) {
                const swallowClick = (clickEvent: MouseEvent) => {
                    clickEvent.stopPropagation();
                    clickEvent.preventDefault();
                };
                document.addEventListener("click", swallowClick, { capture: true, once: true });
            }
        };

        document.addEventListener("pointerdown", handlePointerDown, { capture: true });
        return () => document.removeEventListener("pointerdown", handlePointerDown, { capture: true });
    }, [open]);

    return contentRef;
}
