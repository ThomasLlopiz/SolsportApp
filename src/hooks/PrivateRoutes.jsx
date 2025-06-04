import { Navigate } from "react-router-dom";

export const PrivateUserRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  if (
    token &&
    rol &&
    (rol === "usuario" || rol === "admin" || rol === "superadmin")
  ) {
    return element;
  }

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

export const PrivateSuperAdminRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");
  if (token && rol === "superadmin") {
    return element;
  }
  if (token && rol !== "superadmin") {
    return <Navigate to="/prepage" />;
  }
  return <Navigate to="/" />;
};
