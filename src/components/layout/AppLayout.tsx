import { CheckSquare, LayoutGrid } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function AppLayout() {
  return (
    <div className="theme min-h-screen bg-muted/40 text-foreground">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/boards" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <CheckSquare className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium tracking-wide text-muted-foreground">
                Todo App
              </p>
              <h1 className="text-lg font-semibold">Workspace</h1>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            <Link to="/boards" className={buttonVariants({ variant: "outline" })}>
              <LayoutGrid className="size-4" />
              Boards
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 px-6 py-8">
        <Outlet />
      </main>

      <footer className="mt-auto px-6 pb-6">
        <Separator className="mx-auto mb-4 max-w-6xl" />
        <p className="text-center text-sm text-muted-foreground">
          &copy; 2026 Chris Hsiao. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
