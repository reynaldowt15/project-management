import { useEffect, useState } from "react";
import {
    Link,
    useParams
} from "react-router";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "../components/Navbar";
import ProjectForm from "../components/ProjectForm";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";

import {
    fetchProjectById,
    updateProject
} from "../store/projectSlice";

import {
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    clearTasks
} from "../store/taskSlice";
import AITaskGenerator from "../components/AITaskGenerator";

export default function ProjectDetail() {
    const { id } = useParams();
    const dispatch = useDispatch();

    const {
        currentProject
    } = useSelector(
        (state) => state.projects
    );

    const {
        tasks,
        loading
    } = useSelector(
        (state) => state.tasks
    );

    const [editingProject, setEditingProject] =
        useState(false);

    const [showTaskForm, setShowTaskForm] =
        useState(false);

    useEffect(() => {
        dispatch(fetchProjectById(id));
        dispatch(fetchTasks(id));

        return () => {
            dispatch(clearTasks());
        };
    }, [dispatch, id]);

    async function handleProjectUpdate(data) {
        await dispatch(
            updateProject({
                id,
                data
            })
        ).unwrap();

        setEditingProject(false);
    }

    async function handleCreateTask(data) {
        await dispatch(
            createTask({
                projectId: id,
                task: data
            })
        ).unwrap();

        setShowTaskForm(false);
    }

    async function handleUpdateTask(
        taskId,
        data
    ) {
        await dispatch(
            updateTask({
                id: taskId,
                data
            })
        ).unwrap();
    }

    function handleDeleteTask(taskId) {
        const confirmed = window.confirm(
            "Delete this task?"
        );

        if (confirmed) {
            dispatch(deleteTask(taskId));
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">

            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-10">

                <Link
                    to="/"
                    className="text-gray-500"
                >
                    ← Back to projects
                </Link>

                {currentProject && (
                    <div className="mt-6">

                        {editingProject ? (
                            <ProjectForm
                                initialData={
                                    currentProject
                                }
                                onSubmit={
                                    handleProjectUpdate
                                }
                                onCancel={() =>
                                    setEditingProject(false)
                                }
                                submitText="Save Project"
                            />
                        ) : (
                            <div className="flex items-start justify-between">

                                <div>
                                    <h1 className="text-4xl font-bold">
                                        {currentProject.name}
                                    </h1>

                                    <p className="text-gray-500 mt-2">
                                        {currentProject.description}
                                    </p>
                                </div>

                                <button
                                    onClick={() =>
                                        setEditingProject(true)
                                    }
                                    className="border px-4 py-2 rounded-lg"
                                >
                                    Edit Project
                                </button>

                            </div>

                        )}

                        <AITaskGenerator projectId={id} />

                        <div className="mt-10">

                            <div className="flex items-center justify-between mb-6">

                                <h2 className="text-2xl font-bold">
                                    Tasks
                                </h2>

                                <button
                                    onClick={() =>
                                        setShowTaskForm(
                                            !showTaskForm
                                        )
                                    }
                                    className="bg-black text-white px-5 py-3 rounded-lg"
                                >
                                    {showTaskForm
                                        ? "Cancel"
                                        : "+ New Task"}
                                </button>

                            </div>

                            {showTaskForm && (
                                <div className="mb-6">
                                    <TaskForm
                                        onSubmit={
                                            handleCreateTask
                                        }
                                    />
                                </div>
                            )}

                            {loading && tasks.length === 0 ? (
                                <p>Loading tasks...</p>
                            ) : tasks.length === 0 ? (
                                <div className="bg-white border rounded-2xl p-10 text-center">
                                    <h3 className="text-xl font-semibold">
                                        No tasks yet
                                    </h3>

                                    <p className="text-gray-500 mt-2">
                                        Create your first task.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid lg:grid-cols-2 gap-5">

                                    {tasks.map((task) => (
                                        <TaskCard
                                            key={task.id}
                                            task={task}
                                            onUpdate={
                                                handleUpdateTask
                                            }
                                            onDelete={
                                                handleDeleteTask
                                            }
                                        />
                                    ))}

                                </div>
                            )}

                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}