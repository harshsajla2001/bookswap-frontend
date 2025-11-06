"use client";

import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { API } from "@/api";


export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const res = await API.post("/auth/register", { name, email, password });

            if (res.data.message === "User registered successfully") {

                setMessage("🎉 Registration successful! Redirecting to Books...");
                setTimeout(() => router.push("/login"), 1200);
            } else {
                setMessage(res.data.message || "Something went wrong. Try again.");
            }
        } catch (error) {
            console.error(error);
            setMessage(
                error.response?.data?.message || "Server error. Please try again."
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
            <motion.div
                className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
                    Create an Account
                </h1>

                {message && (
                    <p
                        className={`text-center text-sm mb-4 ${message.includes("successful") ? "text-green-600" : "text-red-500"
                            }`}
                    >
                        {message}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-600 text-sm mb-1">Full Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Harsh Sajla"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600 text-sm mb-1">Email Address</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600 text-sm mb-1">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                        Register
                    </button>
                </form>

                <p className="mt-5 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-600 font-semibold hover:underline">
                        Login here
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
