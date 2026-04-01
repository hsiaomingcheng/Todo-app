import { Plus, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function BoardsPage() {
  return (
    <section className="w-full space-y-8">
      <div className="flex flex-col gap-4 rounded-3xl border bg-background p-6 shadow-sm md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-sm uppercase tracking-[0.25em] text-muted-foreground">
            Boards
          </p>
          <h2 className="text-3xl font-semibold tracking-tight">
            Your planning space is ready.
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            The page now uses shadcn cards and buttons, giving you a clean base
            for board lists, loading states, and future actions.
          </p>
        </div>

        <Button>
          <Plus className="size-4" />
          Create board
        </Button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              First board
            </CardTitle>
            <CardDescription>
              Replace this placeholder with your real board data.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Use this as the visual pattern for future board cards.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Design System</CardTitle>
            <CardDescription>
              Shared button, card, input, label, and separator primitives are
              installed.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            You can now keep building the rest of the UI with the same shadcn
            style and tokens.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next step</CardTitle>
            <CardDescription>
              Add more components only when a page needs them.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Good next additions are `dialog`, `dropdown-menu`, `sheet`, and
            `toast` once board interactions get richer.
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
