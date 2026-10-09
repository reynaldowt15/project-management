import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    generateTasks,
    createTask,
    setGeneratedTasks
} from "../store/taskSlice";

export default function AITaskGenerator({ projectId }) {
    const dispatch = useDispatch();

    const {
        generatedTasks,
        loadingAi,
        error
    } = useSelector((state) => state.tasks);

    const [selectedTasks, setSelectedTasks] = useState([]);

    const handleGenerate = () => {
        setSelectedTasks([]);
        dispatch(generateTasks(projectId));
    };

    const handleSelect = (index) => {
        setSelectedTasks((current) => {
            if (current.includes(index)) {
                return current.filter((item) => item !== index);
            }

            return [...current, index];
        });
    };

    const handleSave = async () => {
        const tasksToSave = generatedTasks.filter((_, index) =>
            selectedTasks.includes(index)
        );

        for (const task of tasksToSave) {
            await dispatch(
                createTask({
                    projectId,
                    task: {
                        title: task.title,
                        description: task.description,
                        priority: task.priority,
                        status: "TODO",
                    }
                })
            ).unwrap();
        }

        setSelectedTasks([]);
        dispatch(setGeneratedTasks([]));
    };

    const handleClear = () => {
        setSelectedTasks([]);
        dispatch(setGeneratedTasks([]));
    };

    return (
        <div className="rounded-lg border bg-white p-6 shadow-sm mt-2">
            <div className="mb-4">
                <h2 className="text-xl font-semibold">
                    AI Task Generator
                </h2>

                <p className="text-sm text-gray-500">
                    Generate task suggestions based on this project.
                </p>
            </div>

            <button
                onClick={handleGenerate}
                disabled={loadingAi}
                className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
            >
                {loadingAi ? "Generating..." : "Generate Tasks"}
            </button>

            {error && (
                <p className="mt-4 text-sm text-red-500">
                    {error}
                </p>
            )}

            {generatedTasks.length > 0 && (
                <div className="mt-6 space-y-3">
                    {generatedTasks.map((task, index) => (
                        <div
                            key={index}
                            className="flex gap-3 rounded border p-4"
                        >
                            <input
                                type="checkbox"
                                checked={selectedTasks.includes(index)}
                                onChange={() => handleSelect(index)}
                                className="mt-1"
                            />

                            <div>
                                <h3 className="font-medium">
                                    {task.title}
                                </h3>

                                <p className="mt-1 text-sm text-gray-600">
                                    {task.description}
                                </p>

                                <span className="mt-2 inline-block rounded bg-gray-100 px-2 py-1 text-xs">
                                    {task.priority}
                                </span>
                            </div>
                        </div>
                    ))}

                    <div className="flex gap-2 pt-2">
                        <button
                            onClick={handleSave}
                            disabled={selectedTasks.length === 0}
                            className="rounded bg-green-600 px-4 py-2 text-white disabled:opacity-50"
                        >
                            Add Selected Tasks
                        </button>

                        <button
                            onClick={handleClear}
                            className="rounded border px-4 py-2"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}