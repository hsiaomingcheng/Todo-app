import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, CheckSquare } from "lucide-react";

import api from "@/api/client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    accountName: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/login", {
        user_account: form.accountName,
        password: form.password,
      });

      // TODO: Need to store the access token in the local storage or cookie for future authenticated requests
      // TODO: Handle the response from the server, such as showing error messages or redirecting to the dashboard
      navigate("/boards");
    } catch (error) {
      console.error("Error login user:", error);
    } finally {
      setLoading(false);
      console.log("The finally of the login request");
    }
  };

  return (
    <section className="theme relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-10">
      <div className="absolute left-[-8rem] top-[-6rem] size-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-[-8rem] right-[-4rem] size-80 rounded-full bg-muted blur-3xl" />
      <div className="absolute inset-x-0 top-24 h-px bg-border/60" />

      <div className="relative grid w-full max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden flex-col justify-center lg:flex">
          <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <CheckSquare className="size-7" />
          </div>
          <p className="mb-3 text-sm uppercase tracking-[0.25em] text-muted-foreground">
            Welcome back
          </p>
          <h1 className="max-w-md text-4xl font-semibold leading-tight">
            Sign in and pick up your boards where you left off.
          </h1>
          <p className="mt-4 max-w-lg text-base text-muted-foreground">
            A clean workspace, fast navigation, and a UI foundation now aligned
            with shadcn so the rest of the app can grow consistently.
          </p>
        </div>

        <Card className="border-border/60 bg-background/95 shadow-2xl backdrop-blur">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your account name and password to continue.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="accountName">User Account</Label>
                <Input
                  id="accountName"
                  type="text"
                  placeholder="your-account"
                  value={form.accountName}
                  required
                  onChange={(e) =>
                    setForm({ ...form, accountName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  required
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <p className="text-sm text-muted-foreground">
                  Your authentication flow is still the same, just with the new
                  component styling.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button className="sm:flex-1" type="submit" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                  {!loading && <ArrowRight className="size-4" />}
                </Button>

                <Link
                  to="/register"
                  className={buttonVariants({
                    variant: "outline",
                    className: "sm:flex-1",
                  })}
                >
                  Create account
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
