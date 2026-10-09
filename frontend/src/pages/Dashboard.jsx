import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import ProjectForm from "../components/ProjectForm";

import {
    fetchProjects,
    createProject,
    deleteProject
} from "../store/projectSlice";

export default function Dashboard() {
    const dispatch = useDispatch();

    const {
        projects,
        loading
    } = useSelector(
        (state) => state.projects
    );

    const [showForm, setShowForm] =
        useState(false);

    useEffect(() => {
        dispatch(fetchProjects());
    }, [dispatch]);

    async function handleCreate(project) {
        await dispatch(
            createProject(project)
        ).unwrap();

        setShowForm(false);
    }

    function handleDelete(id) {
        const confirmed = window.confirm(
            "Delete this project?"
        );

        if (confirmed) {
            dispatch(deleteProject(id));
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">

            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-10">

                <div className="flex items-center justify-between mb-8">

                    <div>
                        <h1 className="text-3xl font-bold">
                            My Projects
                        </h1>

                        <p className="text-gray-500 mt-1">
                            Manage your projects and tasks.
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            setShowForm(!showForm)
                        }
                        className="bg-black text-white px-5 py-3 rounded-lg"
                    >
                        {showForm
                            ? "Cancel"
                            : "+ New Project"}
                    </button>

                </div>

                {showForm && (
                    <div className="mb-8">
                        <ProjectForm
                            onSubmit={handleCreate}
                            loading={loading}
                        />
                    </div>
                )}

                {loading && projects.length === 0 ? (
                    <p>Loading projects...</p>
                ) : projects.length === 0 ? (
                    <div className="bg-white border rounded-2xl p-10 text-center">
                        <h2 className="text-xl font-semibold">
                            No projects yet
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Create your first project.
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {projects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onDelete={handleDelete}
                            />
                        ))}

                    </div>
                )}

            </main>
        </div>
    );
}