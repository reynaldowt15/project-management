import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { GoogleLogin } from '@react-oauth/google';

import api from "../api";
import { loginSuccess } from "../store/authSlice";

export default function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const { data } = await api.post(
                "/login",
                {
                    email,
                    password
                }
            );

            dispatch(loginSuccess(data));

            navigate("/");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Login failed"
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleGoogleLogin(credentialResponse) {
        try {
            setLoading(true);
            setError("");

            const { data } = await api.post("/google-login", {}, {
                headers: {
                    token: credentialResponse.credential
                }
            });

            dispatch(loginSuccess(data));

            navigate("/");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Login failed"
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
                    Welcome back
                </h1>

                <p className="text-gray-500 mb-8">
                    Login to your project manager
                </p>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

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
                    {loading ? "Logging in..." : "Login"}
                </button>

                <div className="divider">OR</div>

                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                    />
                </div>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="text-black font-semibold"
                    >
                        Register
                    </Link>
                </p>
            </form>
        </div>
    );
}