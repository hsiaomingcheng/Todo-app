import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { userRegister } from "@/api/apis";
import { Button } from "@/components/ui/button";
import AuthShell from "@/components/auth/AuthShell";
import AuthField from "@/components/auth/AuthField";
import AuthError from "@/components/auth/AuthError";

export default function RegisterPage() {
    const navigate = useNavigate();

    const [errorMsg, setErrorMsg] = useState("");
    const [form, setForm] = useState({
        accountName: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMsg("");

        try {
            await userRegister({
                user_account: form.accountName,
                password: form.password,
                first_name: form.firstName,
                last_name: form.lastName,
                email: form.email,
            });

            // Redirect to dashboard
            navigate("/login");
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                setErrorMsg(error.response.data.message || "Registration failed");
            } else {
                setErrorMsg("An unexpected error occurred");
            }
        } finally {
            console.log("The finally of the register request");
        }
    };

    return (
        <AuthShell
            title="Create your account"
            subtitle="Set up a free account and start your first board."
            footer={
                <>
                    Already have an account?{" "}
                    <Link to="/login" className="font-semibold text-[#0F766E] hover:underline">
                        Log in
                    </Link>
                </>
            }
        >
            <form onSubmit={handleSubmit}>
                {errorMsg && <AuthError message={errorMsg} />}

                <AuthField
                    className="mb-4"
                    id="accountName"
                    label="Account name"
                    type="text"
                    placeholder="Choose an account name"
                    autoComplete="username"
                    value={form.accountName}
                    required
                    onChange={(e) => setForm({ ...form, accountName: e.target.value })} />

                <AuthField
                    className="mb-4"
                    id="password"
                    label="Password"
                    type="password"
                    placeholder="Choose a password"
                    autoComplete="new-password"
                    value={form.password}
                    required
                    onChange={(e) => setForm({ ...form, password: e.target.value })} />

                <div className="mb-4 grid gap-4 sm:grid-cols-2">
                    <AuthField
                        id="firstName"
                        label="First name"
                        type="text"
                        placeholder="First name"
                        autoComplete="given-name"
                        value={form.firstName}
                        required
                        onChange={(e) => setForm({ ...form, firstName: e.target.value })} />

                    <AuthField
                        id="lastName"
                        label="Last name"
                        type="text"
                        placeholder="Last name"
                        autoComplete="family-name"
                        value={form.lastName}
                        required
                        onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                </div>

                <AuthField
                    className="mb-6"
                    id="email"
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={form.email}
                    required
                    onChange={(e) => setForm({ ...form, email: e.target.value })} />

                <Button
                    type="submit"
                    className="h-11 w-full rounded-[10px] bg-[#0F766E] text-[15px] font-semibold text-white hover:bg-[#0F766E]/90">
                    Create account
                </Button>
            </form>
        </AuthShell>
    );
}
