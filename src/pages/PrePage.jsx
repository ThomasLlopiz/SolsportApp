import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
export const PrePage = () => {
  const handleLogout = () => {
    navigate("/");
  };
  return (
    <div className="flex justify-center items-center gap-32 mt-32">
      <button className="bg-blue-500 text-white px-4 py-2 rounded flex">
        <Link to="/pedidos">Ir a Pedidos</Link>
      </button>
      <button className="bg-green-500 text-white px-4 py-2 rounded flex">
        <Link to="/cotizador">Ir a Cotizador</Link>
      </button>
      <button className="bg-green-500 text-white px-4 py-2 rounded flex">
        <Link to="/telas">Ir a Cotizador</Link>
      </button>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded flex items-center"
      >
        <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
        Cerrar sesión
      </button>
    </div>
  );
};
