import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export default function SettingPage() {
    const navigate = useNavigate()

    const [telegramChatId, setTelegramChatId] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const { data } = await api.patch("/users/telegram", {
                TelegramChatId: telegramChatId
            });
            const temp = JSON.parse(localStorage.getItem(`user`))
            const user = { ...temp, TelegramChatId: telegramChatId }
            localStorage.setItem(`user`, JSON.stringify(user))
            navigate(`/`)
        } catch (error) {
            setError(error.response?.data?.message || `Failed`)
        }
    }

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem(`user`))
        if (user.TelegramChatId) {
            setTelegramChatId(user.TelegramChatId)
        }
    }, [])
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <form
                onSubmit={handleSubmit}
                className="bg-white w-full max-w-md rounded-2xl shadow p-8"
            >
                <h1 className="text-xl font-bold mb-2">
                    Input your telegram id to receive notification
                </h1>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <div className="mb-4">
                    <label className="block mb-2 font-medium">
                        Telegram ID
                    </label>

                    <input
                        type="text"
                        value={telegramChatId}
                        onChange={(e) => setTelegramChatId(e.target.value)}
                        placeholder="123456789"
                        className="w-full border rounded-lg p-3"
                    />
                </div>


                <button
                    className="w-full bg-black text-white p-3 rounded-lg"
                >
                    Add
                </button>
            </form>
        </div>
    )
}