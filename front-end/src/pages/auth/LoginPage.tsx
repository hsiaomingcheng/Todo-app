import { useState } from "react";
import { Link } from "react-router-dom";
import { isAxiosError } from "axios";
import { useAuth } from "@/context/AuthContext";
import { userLogin } from "@/api/apis";
import { Button } from "@/components/ui/button";
import AuthShell from "@/components/auth/AuthShell";
import AuthField from "@/components/auth/AuthField";
import AuthError from "@/components/auth/AuthError";

export default function LoginPage() {
    const { login } = useAuth();

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [form, setForm] = useState({
        accountName: "",
        password: "",
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        try {
            const response = await userLogin({
                user_account: form.accountName,
                password: form.password,
            });

            const token = response.access_token;

            // Use AuthContext to log in (which safely updates state and redirects)
            login(token);
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                // FastAPI returns HTTP errors in the format: {"message": "Error message"}
                setErrorMsg(error.response.data.message || "Login failed");
            } else {
                setErrorMsg("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthShell
            title="Welcome back"
            subtitle="Log in to pick up where you left off."
            footer={
                <>
                    New here?{" "}
                    <Link to="/register" className="font-semibold text-[#0F766E] hover:underline">
                        Create an account
                    </Link>
                </>
            }
        >
            <form onSubmit={handleSubmit}>
                {errorMsg && <AuthError message={errorMsg} />}

                <AuthField
                    className="mb-4"
                    id="accountName"
                    label="User account"
                    type="text"
                    placeholder="Your account name"
                    autoComplete="username"
                    value={form.accountName}
                    required
                    onChange={(e) => setForm({ ...form, accountName: e.target.value })} />

                <AuthField
                    className="mb-6"
                    id="password"
                    label="Password"
                    type="password"
                    placeholder="Your password"
                    autoComplete="current-password"
                    value={form.password}
                    required
                    onChange={(e) => setForm({ ...form, password: e.target.value })} />

                <Button
                    type="submit"
                    disabled={loading}
                    className="h-11 w-full rounded-[10px] bg-[#0F766E] text-[15px] font-semibold text-white hover:bg-[#0F766E]/90">
                    {loading ? "Logging in..." : "Log in"}
                </Button>

                {/* TODO: Implement forgot password functionality */}
                {/* <a className="mt-4 block text-center text-sm font-medium text-[#0F766E]" href="#">
                    Forgot password?
                </a> */}
            </form>
        </AuthShell>
    );
}
