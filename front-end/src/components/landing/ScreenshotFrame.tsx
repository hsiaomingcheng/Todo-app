import { ImageIcon } from "lucide-react";

interface ScreenshotFrameProps {
    title: string;
    src?: string;
    alt?: string;
}

export default function ScreenshotFrame({ title, src, alt }: ScreenshotFrameProps) {
    return (
        <figure className="m-0 min-w-0 overflow-hidden rounded-[14px] border border-[#E1E4E8] bg-white shadow-[0_24px_48px_-28px_rgba(20,22,26,0.25)]">
            <div className="flex h-9 items-center gap-1.5 border-b border-[#ECEEF1] bg-[#F7F8FA] px-3.5">
                <span className="size-2.5 rounded-full bg-[#D5D9DF]" />
                <span className="size-2.5 rounded-full bg-[#D5D9DF]" />
                <span className="size-2.5 rounded-full bg-[#D5D9DF]" />
                <span className="ml-3 h-5 max-w-[280px] flex-1 rounded-md bg-[#ECEEF1]" />
            </div>
            {src ? (
                // Real screenshots keep their own aspect ratio so nothing gets cropped
                <img src={src} alt={alt ?? title} className="block h-auto w-full" />
            ) : (
                <div className="flex aspect-video flex-col items-center justify-center gap-2 bg-[#FBFBFC] text-[#5B6270] outline-[1.5px] -outline-offset-16 outline-dashed outline-[#C9CED6]">
                    <ImageIcon className="size-7" strokeWidth={1.75} aria-hidden="true" />
                    <span className="text-sm font-semibold text-[#3A404B]">{title}</span>
                    <span className="text-xs">16:9 · 1920 × 1080</span>
                </div>
            )}
            <figcaption className="sr-only">{title}</figcaption>
        </figure>
    );
}
