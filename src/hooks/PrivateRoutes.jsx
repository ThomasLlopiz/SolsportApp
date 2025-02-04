import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ element, ...rest }) => {
    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol");

    // Si existe el token
    if (token) {
        // Si el rol es "admin", permitimos el acceso a la ruta
        if (rol === "admin") {
            return element;
        }

        // Si el rol no es "admin", redirigimos a la página predeterminada para ese rol
        return <Navigate to="/prepage" />;
    }

    // Si no existe el token, redirigimos al login
    return <Navigate to="/sesion" />;
};
