import { AppRouter } from "./router/AppRouter";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

export const App = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    navigate("/");
  };
  return (
    <>
      <div className="absolute right-0 top-0">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded flex items-center left-0 top-0"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
          Cerrar sesión
        </button>
      </div>
      <AppRouter />
    </>
  );
};
