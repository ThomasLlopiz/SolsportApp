import { Navigate } from "react-router-dom";

export const PrivateAdminRoute = ({ element, ...rest }) => {
    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol");
    if (token && rol === "admin") {
        return element;
    }
    if (token && rol !== "admin") {
        return <Navigate to="/prepage" />;
    }
    return <Navigate to="/sesion" />;
};

export const PrivateUserRoute = ({ element, ...rest }) => {
    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol");
    if (token && rol === "user") {
        return element;
    }
    if (token && rol !== "user") {
        return <Navigate to="/pedidos" />;
    }
    return <Navigate to="/sesion" />;
};
