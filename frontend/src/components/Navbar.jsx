import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";

import { logout } from "../store/authSlice";

export default function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector(
        (state) => state.auth.user
    );

    function handleLogout() {
        dispatch(logout());
        navigate("/login");
    }

    return (
        <nav className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                <button
                    onClick={() => navigate("/")}
                    className="text-xl font-bold"
                >
                    Project Manager
                </button>

                <div className="flex items-center gap-4">

                    <Link to={`/setting`}>
                        <span className="text-sm text-gray-600">
                            {user?.name}
                        </span>
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="text-red-500 font-medium"
                    >
                        Logout
                    </button>

                </div>

            </div>
        </nav>
    );
}