import { useState } from "react";
import { Link } from "react-router-dom";
import api from "@/api/client";

export default function RegisterPage() {

    const [form, setForm] = useState({
        accountName: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await api.post("/auth/register", {
                user_account: form.accountName,
                password: form.password,
                first_name: form.firstName,
                last_name: form.lastName,
                email: form.email,
            });
        } catch (error) {
            console.error("Error registering user:", error);
        } finally {
            console.log("The finally of the register request");
        }
    };

    return (
        <section className="h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-xs">
                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
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
                            onChange={(e) => setForm({...form, accountName: e.target.value})} />
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
                            onChange={(e) => setForm({...form, password: e.target.value})} />
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
                            onChange={(e) => setForm({...form, firstName: e.target.value})} />
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
                            onChange={(e) => setForm({...form, lastName: e.target.value})} />
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
                            onChange={(e) => setForm({...form, email: e.target.value})} />
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