import { useEffect, useState } from "react";

export default function TaskForm({
    initialData,
    onSubmit,
    onCancel,
    loading,
    submitText = "Create Task"
}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] =
        useState("");
    const [status, setStatus] =
        useState("TODO");
    const [priority, setPriority] =
        useState("MEDIUM");
    const [dueDate, setDueDate] = useState("");

    useEffect(() => {
        setTitle(initialData?.title || "");
        setDescription(
            initialData?.description || ""
        );

        setStatus(
            initialData?.status || "TODO"
        );

        setPriority(
            initialData?.priority || "LOW"
        );

        setDueDate(
            initialData?.dueDate
                ? initialData.dueDate.slice(0, 16)
                : ""
        );
    }, [initialData]);

    function handleSubmit(e) {
        e.preventDefault();

        onSubmit({
            title,
            description,
            status,
            priority,
            dueDate: dueDate || null
        });
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white border rounded-2xl p-6"
        >
            <div className="grid md:grid-cols-2 gap-4">

                <div className="md:col-span-2">
                    <label className="block mb-2 font-medium">
                        Task title
                    </label>

                    <input
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                        className="w-full border rounded-lg p-3"
                        placeholder="Task title"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block mb-2 font-medium">
                        Description
                    </label>

                    <textarea
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        rows="3"
                        className="w-full border rounded-lg p-3"
                        placeholder="Task description"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">
                        Status
                    </label>

                    <select
                        value={status}
                        onChange={(e) =>
                            setStatus(e.target.value)
                        }
                        className="w-full border rounded-lg p-3"
                    >
                        <option value="TODO">
                            TODO
                        </option>

                        <option value="IN_PROGRESS">
                            IN PROGRESS
                        </option>

                        <option value="DONE">
                            DONE
                        </option>
                    </select>
                </div>

                <div>
                    <label className="block mb-2 font-medium">
                        Priority
                    </label>

                    <select
                        value={priority}
                        onChange={(e) =>
                            setPriority(e.target.value)
                        }
                        className="w-full border rounded-lg p-3"
                    >
                        <option value="LOW">
                            LOW
                        </option>

                        <option value="MEDIUM">
                            MEDIUM
                        </option>

                        <option value="HIGH">
                            HIGH
                        </option>
                    </select>
                </div>

                <div>
                    <label className="block mb-2 font-medium">
                        Due date
                    </label>

                    <input
                        type="datetime-local"
                        value={dueDate}
                        onChange={(e) =>
                            setDueDate(e.target.value)
                        }
                        className="w-full border rounded-lg p-3"
                    />
                </div>

            </div>

            <div className="flex gap-3 mt-6">

                <button
                    disabled={loading}
                    className="bg-black text-white px-5 py-3 rounded-lg"
                >
                    {loading
                        ? "Saving..."
                        : submitText}
                </button>

                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-5 py-3"
                    >
                        Cancel
                    </button>
                )}

            </div>
        </form>
    );
}