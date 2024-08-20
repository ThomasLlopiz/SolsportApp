import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export const Agregados = () => {
  const [newAgregado, setNewAgregado] = useState({
    nombre: "",
    precio: "",
  });
  const [agregados, setAgregados] = useState([]);
  const [editAgregado, setEditAgregado] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [agregadoToDelete, setAgregadoToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAgregados();
  }, []);

  const fetchAgregados = async () => {
    try {
      const response = await axios.get("/agregados");
      setAgregados(response.data);
    } catch (error) {
      console.error("Error fetching agregados", error);
    }
  };

  const handleUpdateAgregado = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/agregados/${editAgregado.id}`, editAgregado);
      setEditAgregado(null);
      setIsEditModalOpen(false);
      fetchAgregados();
    } catch (error) {
      console.error("Error updating agregado", error);
    }
  };

  const handleCreateAgregado = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/agregados", newAgregado);
      setNewAgregado({ nombre: "", precio: "" });
      setIsCreateModalOpen(false);
      fetchAgregados();
    } catch (error) {
      console.error("Error creating agregado", error);
    }
  };

  const handleDeleteAgregado = async () => {
    try {
      await axios.delete(`/agregados/${agregadoToDelete.id}`);
      setIsDeleteModalOpen(false);
      fetchAgregados();
    } catch (error) {
      console.error("Error deleting agregado", error);
    }
  };

  const handleEditClick = (agregado) => {
    setEditAgregado(agregado);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (agregado) => {
    setAgregadoToDelete(agregado);
    setIsDeleteModalOpen(true);
  };

  const handleBackClick = () => {
    navigate(`/prepage`);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between w-3/4 mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">AGREGADOS</h1>

        <button
          onClick={handleBackClick}
          className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition flex items-center"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Volver
        </button>
      </div>

      {/* Modal de edición */}
      {isEditModalOpen && editAgregado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Editar Agregado</h2>
            <form onSubmit={handleUpdateAgregado}>
              <div className="mb-4">
                <label className="block text-gray-700">Nombre</label>
                <input
                  type="text"
                  value={editAgregado.nombre}
                  onChange={(e) =>
                    setEditAgregado({ ...editAgregado, nombre: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Precio</label>
                <input
                  type="number"
                  value={editAgregado.precio || ""}
                  onChange={(e) =>
                    setEditAgregado({ ...editAgregado, precio: e.target.value })
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

      {/* Modal de creación */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Crear Agregado</h2>
            <form onSubmit={handleCreateAgregado}>
              <div className="mb-4">
                <label className="block text-gray-700">Nombre</label>
                <input
                  type="text"
                  value={newAgregado.nombre}
                  onChange={(e) =>
                    setNewAgregado({ ...newAgregado, nombre: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Precio</label>
                <input
                  type="number"
                  value={newAgregado.precio || ""}
                  onChange={(e) =>
                    setNewAgregado({ ...newAgregado, precio: e.target.value })
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

      {/* Modal de confirmación de eliminación */}
      {isDeleteModalOpen && agregadoToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-4">Confirmación</h2>
            <p className="mb-4">
              ¿Estás seguro de que deseas eliminar este agregado?
            </p>
            <div className="flex justify-end">
              <button
                onClick={handleDeleteAgregado}
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
          Agregar Agregado
        </button>
      </div>

      {/* Tabla de Agregados */}
      <table className="w-3/4 mx-auto bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Nombre</th>
            <th className="py-2 px-4 border-b text-left">Precio</th>
            <th className="py-2 px-4 border-b text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {agregados.map((agregado) => (
            <tr key={agregado.id}>
              <td className="py-2 px-4 border-b">{agregado.nombre}</td>
              <td className="py-2 px-4 border-b">
                {agregado.precio ? agregado.precio.toFixed(2) : "N/A"}
              </td>
              <td className="py-2 px-4 border-b space-x-2">
                <button
                  onClick={() => handleEditClick(agregado)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteClick(agregado)}
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
