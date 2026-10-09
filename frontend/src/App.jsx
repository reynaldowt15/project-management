import './App.css'
import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { useDispatch } from "react-redux";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import ProjectDetail from "./pages/ProjectDetail";

import ProtectedRoute from "./components/ProtectedRoute";

import { authInitialized, checkAuth } from "./store/authSlice";
import SettingPage from './pages/SettingPage';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      dispatch(checkAuth());
    } else {
      dispatch(authInitialized());
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/setting" element={<SettingPage />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}