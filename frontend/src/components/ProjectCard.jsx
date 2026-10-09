import { Link } from "react-router";

export default function ProjectCard({
    project,
    onDelete
}) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border p-6">

            <h3 className="text-xl font-bold">
                {project.name}
            </h3>

            <p className="text-gray-500 mt-2 min-h-12">
                {project.description ||
                    "No description"}
            </p>

            <div className="flex gap-3 mt-6">

                <Link
                    to={`/projects/${project.id}`}
                    className="bg-black text-white px-4 py-2 rounded-lg"
                >
                    Open
                </Link>

                <button
                    onClick={() => onDelete(project.id)}
                    className="text-red-500 px-4 py-2"
                >
                    Delete
                </button>

            </div>
        </div>
    );
}