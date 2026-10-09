import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import Loading from "./loading";

export default function ProtectedRoute() {
    const {
        isAuthenticated,
        initialized
    } = useSelector((state) => state.auth);

    if (!initialized) {
        return <Loading />;
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return <Outlet />;
}