import { useState } from "react";

import TaskForm from "./TaskForm";

export default function TaskCard({
    task,
    onUpdate,
    onDelete
}) {
    const [editing, setEditing] =
        useState(false);

    if (editing) {
        return (
            <TaskForm
                initialData={task}
                onSubmit={async (data) => {
                    await onUpdate(task.id, data);
                    setEditing(false);
                }}
                onCancel={() =>
                    setEditing(false)
                }
                submitText="Save Changes"
            />
        );
    }

    return (
        <div className="bg-white border rounded-2xl p-5">

            <div className="flex items-start justify-between gap-4">

                <div>
                    <h3 className="font-bold text-lg">
                        {task.title}
                    </h3>

                    <p className="text-gray-500 mt-1">
                        {task.description}
                    </p>
                </div>

                <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">
                    {task.priority}
                </span>

            </div>

            <div className="flex flex-wrap gap-2 mt-4 text-sm">

                <span className="bg-gray-100 px-3 py-1 rounded-full">
                    {task.status}
                </span>

                {task.dueDate && (
                    <span className="bg-gray-100 px-3 py-1 rounded-full">
                        Due:{" "}
                        {new Date(
                            task.dueDate
                        ).toLocaleString()}
                    </span>
                )}

            </div>

            <div className="flex gap-3 mt-5">

                <button
                    onClick={() =>
                        setEditing(true)
                    }
                    className="text-sm font-medium"
                >
                    Edit
                </button>

                <button
                    onClick={() =>
                        onDelete(task.id)
                    }
                    className="text-sm text-red-500"
                >
                    Delete
                </button>

            </div>

        </div>
    );
}