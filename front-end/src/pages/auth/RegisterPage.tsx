import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import api from "@/api/client";

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
            await api.post("/auth/register", {
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
                            Account Name
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="accountName"
                            type="text"
                            placeholder="Account Name"
                            value={form.accountName}
                            required
                            onChange={(e) => setForm({ ...form, accountName: e.target.value })} />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            placeholder="Password"
                            value={form.password}
                            required
                            onChange={(e) => setForm({ ...form, password: e.target.value })} />
                        <p className="text-red-500 text-xs italic">Please choose a password.</p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                            First Name
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="firstName"
                            type="text"
                            placeholder="First Name"
                            value={form.firstName}
                            required
                            onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                            Last Name
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="lastName"
                            type="text"
                            placeholder="Last Name"
                            value={form.lastName}
                            required
                            onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            required
                            onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>

                    <div className="text-center">
                        <button className="mb-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                            Register
                        </button>

                        <div>
                            <p className="mb-1 inline-block align-baseline font-bold text-sm">
                                Already have an account?
                            </p>
                            <Link to="/login">
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                                    Sign In
                                </button>
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}