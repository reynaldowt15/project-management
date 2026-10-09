import { Outlet, useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import { useEffect } from "react";

export default function MainLayout() {
    const navigate = useNavigate()

    const token = localStorage.getItem(`access_token`)

    useEffect(() => {
        if (!token) {
            navigate(`/login`)
        }
    })

    return (
        <div>
            <Navbar />
            <Outlet />
        </div>
    )
}