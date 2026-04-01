import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/api/client";

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
    }

    return (
        <section className="h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-xs">
                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
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
                                { loading ? "Logging in..." : "Login" }
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