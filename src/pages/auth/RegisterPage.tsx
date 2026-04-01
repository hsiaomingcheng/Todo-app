import { useState } from "react";
import { CheckSquare } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

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

export default function RegisterPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    accountName: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/register", {
        user_account: form.accountName,
        password: form.password,
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
      });

      // TODO: Handle the response from the server, such as showing error messages or redirecting to the login page
      navigate("/login");
    } catch (error) {
      console.error("Error registering user:", error);
    } finally {
      setLoading(false);
      console.log("The finally of the register request");
    }
  };

  return (
    <section className="theme relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-10">
      <div className="absolute bottom-[-8rem] left-[-4rem] size-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute right-[-6rem] top-[-4rem] size-72 rounded-full bg-muted blur-3xl" />
      <div className="absolute inset-x-10 top-10 h-px bg-border/60" />
      <div className="absolute inset-y-10 left-10 w-px bg-border/60" />

      <div className="relative grid w-full max-w-5xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="order-2 border-border/60 bg-background/95 shadow-2xl backdrop-blur lg:order-1">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">Create account</CardTitle>
            <CardDescription>
              Set up your workspace access with the same API flow you already
              had.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="accountName">Account Name</Label>
                  <Input
                    id="accountName"
                    type="text"
                    placeholder="Account Name"
                    value={form.accountName}
                    required
                    onChange={(e) =>
                      setForm({ ...form, accountName: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={form.email}
                    required
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="First Name"
                    value={form.firstName}
                    required
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Last Name"
                    value={form.lastName}
                    required
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Choose a secure password"
                  value={form.password}
                  required
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button className="sm:flex-1" type="submit" disabled={loading}>
                  {loading ? "Creating account..." : "Register"}
                </Button>

                <Link
                  to="/login"
                  className={buttonVariants({
                    variant: "outline",
                    className: "sm:flex-1",
                  })}
                >
                  Sign in instead
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="order-1 flex flex-col justify-center lg:order-2 lg:pl-8">
          <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <CheckSquare className="size-7" />
          </div>
          <p className="mb-3 text-sm uppercase tracking-[0.25em] text-muted-foreground">
            New workspace
          </p>
          <h1 className="max-w-md text-4xl font-semibold leading-tight">
            Start organizing boards, lists, and work in one place.
          </h1>
          <p className="mt-4 max-w-lg text-base text-muted-foreground">
            This page now uses the shadcn component layer, so future forms can
            stay visually aligned without repeating custom Tailwind classes.
          </p>
        </div>
      </div>
    </section>
  );
}
