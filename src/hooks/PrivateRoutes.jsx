import { Navigate } from "react-router-dom";

export const PrivateUserRoute = ({ element }) => {
    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol");

    // Si hay token y un rol válido (user o admin), permite el acceso
    if (token && rol && (rol === "usuario" || rol === "admin")) {
        return element;
    }

    // Si no hay token o rol, redirige al login
    return <Navigate to="/" />;
};

export const PrivateAdminRoute = ({ element }) => {
    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol");
    if (token && rol === "admin") {
        return element;
    }
    if (token && rol !== "admin") {
        return <Navigate to="/prepage" />;
    }
    return <Navigate to="/" />;
};