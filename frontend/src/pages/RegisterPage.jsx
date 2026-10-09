import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import api from "../api";

export default function RegisterPage() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            await api.post("/register", {
                name,
                email,
                password
            });

            navigate("/login");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Registration failed"
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (localStorage.getItem(`access_token`)) {
            navigate(`/`)
        }
    }, [])

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <form
                onSubmit={handleSubmit}
                className="bg-white w-full max-w-md rounded-2xl shadow p-8"
            >
                <h1 className="text-3xl font-bold mb-2">
                    Create account
                </h1>

                <p className="text-gray-500 mb-8">
                    Start managing your projects
                </p>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <div className="mb-4">
                    <label className="block mb-2 font-medium">
                        Name
                    </label>

                    <input
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        className="w-full border rounded-lg p-3"
                        placeholder="Your name"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2 font-medium">
                        Email
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        className="w-full border rounded-lg p-3"
                        placeholder="you@example.com"
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-2 font-medium">
                        Password
                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        className="w-full border rounded-lg p-3"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    disabled={loading}
                    className="w-full bg-black text-white p-3 rounded-lg"
                >
                    {loading
                        ? "Creating account..."
                        : "Create account"}
                </button>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-black font-semibold"
                    >
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}