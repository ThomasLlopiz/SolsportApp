import { useState, useEffect } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export const CostoProduccion = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [costosProduccion, setCostosProduccion] = useState([]);
  const [editCosto, setEditCosto] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [costoToDelete, setCostoToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchCostosProduccion = async () => {
    try {
      const response = await fetch(`${API_URL}/costos_produccion`);
      const data = await response.json();
      setCostosProduccion(data);
    } catch (error) {
      console.error("Error fetching costos de producción", error);
    }
  };

  useEffect(() => {
    fetchCostosProduccion();
  }, []);

  const handleUpdateCosto = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/costos_produccion/${editCosto.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editCosto),
      });
      setIsEditModalOpen(false);
      setEditCosto(null);
      fetchCostosProduccion();
    } catch (error) {
      console.error("Error updating costo de producción", error);
    }
  };

  const handleDeleteCosto = async () => {
    try {
      await fetch(`${API_URL}/costos_produccion/${costoToDelete.id}`, {
        method: "DELETE",
      });
      setIsDeleteModalOpen(false);
      fetchCostosProduccion();
    } catch (error) {
      console.error("Error deleting costo de producción", error);
    }
  };

  const handleEditClick = (costo) => {
    setEditCosto(costo);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (costo) => {
    setCostoToDelete(costo);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Costos de Producción
      </h1>

      {/* Modal de edición */}
      {isEditModalOpen && editCosto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">
              Editar Costo de Producción
            </h2>
            <form onSubmit={handleUpdateCosto}>
              <div className="mb-4">
                <label className="block text-gray-700">Nombre</label>
                <input
                  type="text"
                  value={editCosto.nombre}
                  onChange={(e) =>
                    setEditCosto({ ...editCosto, nombre: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Precio</label>
                <input
                  type="number"
                  value={editCosto.precio || ""}
                  onChange={(e) =>
                    setEditCosto({ ...editCosto, precio: e.target.value })
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
      {isDeleteModalOpen && costoToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-4">Confirmación</h2>
            <p className="mb-4">
              ¿Estás seguro de que deseas eliminar este costo de producción?
            </p>
            <div className="flex justify-end">
              <button
                onClick={handleDeleteCosto}
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

      {/* Tabla de Costos de Producción */}
      <table className="w-3/4 mx-auto bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Nombre</th>
            <th className="py-2 px-4 border-b text-left">Precio</th>
            <th className="py-2 px-4 border-b text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {costosProduccion.length > 0 ? (
            costosProduccion.map((costo) => (
              <tr key={costo.id}>
                <td className="py-2 px-4 border-b">{costo.nombre}</td>
                <td className="py-2 px-4 border-b">
                  {costo.precio ? costo.precio.toFixed(2) : "N/A"}
                </td>
                <td className="py-2 px-4 border-b space-x-2">
                  <button
                    onClick={() => handleEditClick(costo)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(costo)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr>
                  <th className="border px-4 py-2">
                    No hay costos de producción
                  </th>
                </tr>
              </thead>
            </table>
          )}
        </tbody>
      </table>
    </div>
  );
};
