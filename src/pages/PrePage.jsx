import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export const PrePage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="flex justify-center items-center gap-32 mt-2 pb-12 bg-gray-100 text-xl font-semibold">
      <div className="flex gap-10">
        {/* Dropdown Button */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="bg-blue-500 text-white pl-4 pr-2 py-2 rounded flex items-center"
          >
            <span>Costos</span>
            <ChevronDownIcon className="h-5 w-5 ml-2" strokeWidth={4} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute bg-white border border-gray-300 shadow-md mt-2 rounded-md">
              <ul className="p-2">
                <li>
                  <Link
                    to="/telas"
                    className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white"
                  >
                    Telas
                  </Link>
                </li>
                <li>
                  <Link
                    to="/prendas"
                    className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white"
                  >
                    Prendas
                  </Link>
                </li>
                <li>
                  <Link
                    to="/agregados"
                    className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white"
                  >
                    Agregados
                  </Link>
                </li>
                <li>
                  <Link
                    to="/costosProduccion"
                    className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white"
                  >
                    Costos
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Otros botones */}
        <button className="bg-blue-500 text-white px-4 py-2 rounded flex">
          <Link to="/cotizador">Cotizador</Link>
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded flex">
          <Link to="/pedidos">Pedidos</Link>
        </button>
      </div>
    </div>
  );
};
