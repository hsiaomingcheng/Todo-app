import { useState } from "react";
import { Link } from "react-router-dom";
import { isAxiosError } from "axios";
import { useAuth } from "@/context/AuthContext";
import { userLogin } from "@/api/apis";

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
        <section className="h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-xs">
                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
                    {errorMsg && (
                        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm text-center" role="alert">
                            <span className="block sm:inline">{errorMsg}</span>
                        </div>
                    )}

                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="accountName">
                            User Account
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="accountName"
                            type="text"
                            placeholder="User Account"
                            value={form.accountName}
                            required
                            onChange={(e) => setForm({ ...form, accountName: e.target.value })} />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            placeholder="******************"
                            value={form.password}
                            required
                            onChange={(e) => setForm({ ...form, password: e.target.value })} />
                        <p className="text-red-500 text-xs italic">Please choose a password.</p>
                    </div>

                    <div>
                        <div className="flex justify-around mb-4">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                                disabled={loading}>
                                {loading ? "Logging in..." : "Login"}
                            </button>

                            <Link to="/register">
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                                    Register
                                </button>
                            </Link>
                        </div>

                        {/* TODO: Implement forgot password functionality */}
                        {/* <div className="text-center">
                            <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
                                Forgot Password?
                            </a>
                        </div> */}
                    </div>
                </form>

                <p className="text-center text-gray-500 text-xs">
                    &copy;2026 Chris Hsiao. All rights reserved.
                </p>
            </div>
        </section>
    );
}