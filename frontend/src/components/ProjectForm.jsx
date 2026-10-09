import { useEffect, useState } from "react";

export default function ProjectForm({
    initialData,
    onSubmit,
    onCancel,
    loading,
    submitText = "Create Project"
}) {
    const [name, setName] = useState("");
    const [description, setDescription] =
        useState("");

    useEffect(() => {
        setName(initialData?.name || "");
        setDescription(
            initialData?.description || ""
        );
    }, [initialData]);

    function handleSubmit(e) {
        e.preventDefault();

        onSubmit({
            name,
            description
        });
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border p-6"
        >
            <div className="mb-4">
                <label className="block font-medium mb-2">
                    Project name
                </label>

                <input
                    value={name}
                    onChange={(e) =>
                        setName(e.target.value)
                    }
                    className="w-full border rounded-lg p-3"
                    placeholder="My project"
                />
            </div>

            <div className="mb-4">
                <label className="block font-medium mb-2">
                    Description
                </label>

                <textarea
                    value={description}
                    onChange={(e) =>
                        setDescription(e.target.value)
                    }
                    rows="4"
                    className="w-full border rounded-lg p-3"
                    placeholder="Describe your project..."
                />
            </div>

            <div className="flex gap-3">

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