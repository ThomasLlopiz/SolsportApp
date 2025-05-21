import { useState, useEffect } from "react";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const API_URL = import.meta.env.VITE_API_URL;

export const Prendas = () => {
  const [newPrenda, setNewPrenda] = useState({
    nombre: "",
    consumo: "",
  });
  const [prendas, setPrendas] = useState([]);
  const [editPrenda, setEditPrenda] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [prendaToDelete, setPrendaToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPrendas();
  }, []);

  const fetchPrendas = async () => {
    try {
      const response = await fetch(`${API_URL}/prendas`);
      const data = await response.json();
      setPrendas(data);
    } catch (error) {
      console.error("Error fetching prendas", error);
    }
  };

  const handleUpdatePrenda = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/prendas/${editPrenda.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editPrenda),
      });
      setEditPrenda(null);
      setIsEditModalOpen(false);
      fetchPrendas();
    } catch (error) {
      console.error("Error updating prenda", error);
    }
  };

  const handleCreatePrenda = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/prendas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPrenda),
      });
      setNewPrenda({ nombre: "", consumo: "" });
      setIsCreateModalOpen(false);
      fetchPrendas();
    } catch (error) {
      console.error("Error creating prenda", error);
    }
  };

  const handleDeletePrenda = async () => {
    try {
      await fetch(`${API_URL}/prendas/${prendaToDelete.id}`, {
        method: "DELETE",
      });
      setIsDeleteModalOpen(false);
      fetchPrendas();
    } catch (error) {
      console.error("Error deleting prenda", error);
    }
  };

  const handleEditClick = (prenda) => {
    setEditPrenda(prenda);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (prenda) => {
    setPrendaToDelete(prenda);
    setIsDeleteModalOpen(true);
  };

  const handleBackClick = () => {
    navigate(`/prepage`);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between w-3/4 mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">PRENDAS</h1>

        <button
          onClick={handleBackClick}
          className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition flex items-center"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Volver
        </button>
      </div>

      {/* Modal de edición */}
      {isEditModalOpen && editPrenda && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Editar Prenda</h2>
            <form onSubmit={handleUpdatePrenda}>
              <div className="mb-4">
                <label className="block text-gray-700">Nombre</label>
                <input
                  type="text"
                  value={editPrenda.nombre}
                  onChange={(e) =>
                    setEditPrenda({ ...editPrenda, nombre: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Consumo</label>
                <input
                  type="number"
                  value={editPrenda.consumo || ""}
                  onChange={(e) =>
                    setEditPrenda({ ...editPrenda, consumo: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                  min="0"
                  step="0.001"
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

      {/* Modal de creación */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Crear Prenda</h2>
            <form onSubmit={handleCreatePrenda}>
              <div className="mb-4">
                <label className="block text-gray-700">Nombre</label>
                <input
                  type="text"
                  value={newPrenda.nombre}
                  onChange={(e) =>
                    setNewPrenda({ ...newPrenda, nombre: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Consumo</label>
                <input
                  type="number"
                  value={newPrenda.consumo || ""}
                  onChange={(e) =>
                    setNewPrenda({ ...newPrenda, consumo: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                  min="0"
                  step="0.0001"
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

      {/* Modal de confirmación de eliminación */}
      {isDeleteModalOpen && prendaToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-4">Confirmación</h2>
            <p className="mb-4">
              ¿Estás seguro de que deseas eliminar esta prenda?
            </p>
            <div className="flex justify-end">
              <button
                onClick={handleDeletePrenda}
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
          Agregar Prenda
        </button>
      </div>

      {/* Tabla de Prendas */}
      <table className="w-3/4 mx-auto bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Nombre</th>
            <th className="py-2 px-4 border-b text-left">Consumo</th>
            <th className="py-2 px-4 border-b text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {prendas.map((prenda) => (
            <tr key={prenda.id}>
              <td className="py-2 px-4 border-b">{prenda.nombre}</td>
              <td className="py-2 px-4 border-b">
                {prenda.consumo ? prenda.consumo.toFixed(4) : "N/A"}
              </td>
              <td className="py-2 px-4 border-b space-x-2">
                <button
                  onClick={() => handleEditClick(prenda)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteClick(prenda)}
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
