import { useState, useEffect } from "react";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const API_URL = import.meta.env.VITE_API_URL;

export const Colores = () => {
  const [newColor, setNewColor] = useState({
    nombre: "",
    consumo: "",
  });
  const [colores, setColores] = useState([]);
  const [editColor, setEditColor] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [colorToDelete, setColorToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchColores();
  }, []);

  const fetchColores = async () => {
    try {
      const response = await fetch(`${API_URL}/colores`);
      const data = await response.json();
      setColores(data);
    } catch (error) {
      console.error("Error fetching colores", error);
    }
  };

  const handleCreateColor = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/colores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newColor),
      });
      setNewColor({ nombre: "", consumo: "" });
      setIsCreateModalOpen(false);
      fetchColores();
    } catch (error) {
      console.error("Error creating color", error);
    }
  };

  const handleUpdateColor = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/colores/${editColor.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editColor),
      });
      setEditColor(null);
      setIsEditModalOpen(false);
      fetchColores();
    } catch (error) {
      console.error("Error updating color", error);
    }
  };

  const handleDeleteColor = async () => {
    try {
      await fetch(`${API_URL}/colores/${colorToDelete.id}`, {
        method: "DELETE",
      });
      setIsDeleteModalOpen(false);
      fetchColores();
    } catch (error) {
      console.error("Error deleting color", error);
    }
  };

  const handleEditClick = (color) => {
    setEditColor(color);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (color) => {
    setColorToDelete(color);
    setIsDeleteModalOpen(true);
  };

  const handleBackClick = () => {
    navigate(`/prepage`); // Adjust this route as needed
  };

  return (
    <div className="p-4">
      <div className="flex justify-between w-3/4 mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">COLORES</h1>
        <button
          onClick={handleBackClick}
          className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition flex items-center"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Volver
        </button>
      </div>

      {/* Modal de creación */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Crear Color</h2>
            <form onSubmit={handleCreateColor}>
              <div className="mb-4">
                <label className="block text-gray-700">Nombre</label>
                <input
                  type="text"
                  value={newColor.nombre}
                  onChange={(e) =>
                    setNewColor({ ...newColor, nombre: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Consumo</label>
                <input
                  type="number"
                  value={newColor.consumo}
                  onChange={(e) =>
                    setNewColor({ ...newColor, consumo: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
                >
                  Crear
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="bg-gray-500 text-white py-2 px-4 rounded"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de edición */}
      {isEditModalOpen && editColor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Editar Color</h2>
            <form onSubmit={handleUpdateColor}>
              <div className="mb-4">
                <label className="block text-gray-700">Nombre</label>
                <input
                  type="text"
                  value={editColor.nombre}
                  onChange={(e) =>
                    setEditColor({ ...editColor, nombre: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Consumo</label>
                <input
                  type="number"
                  value={editColor.consumo || ""}
                  onChange={(e) =>
                    setEditColor({ ...editColor, consumo: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-500 text-white py-2 px-4 rounded"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {isDeleteModalOpen && colorToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-4">Confirmación</h2>
            <p className="mb-4">
              ¿Estás seguro de que deseas eliminar este color?
            </p>
            <div className="flex justify-end">
              <button
                onClick={handleDeleteColor}
                className="bg-red-500 text-white py-2 px-4 rounded mr-2"
              >
                Eliminar
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botón para abrir el modal de creación */}
      <div className="flex mb-6 w-3/4 mx-auto">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-500 text-white py-2 px-4 rounded flex items-center"
        >
          <PlusIcon className="h-5 w-5 inline mr-2" />
          Agregar Color
        </button>
      </div>

      {/* Tabla de Colores */}
      <table className="w-3/4 mx-auto bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Nombre</th>
            <th className="py-2 px-4 border-b text-left">Consumo</th>
            <th className="py-2 px-4 border-b text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {colores.map((color) => (
            <tr key={color.id}>
              <td className="py-2 px-4 border-b">{color.nombre}</td>
              <td className="py-2 px-4 border-b">
                {color.consumo ? color.consumo : "N/A"}
              </td>
              <td className="py-2 px-4 border-b space-x-2">
                <button
                  onClick={() => handleEditClick(color)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteClick(color)}
                  className="text-red-500 hover:text-red-700"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
