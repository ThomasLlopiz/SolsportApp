import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export const Telas = () => {
  const [newTela, setNewTela] = useState({
    nombre: "",
    precio: "",
  });
  const [telas, setTelas] = useState([]);
  const [editTela, setEditTela] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [telaToDelete, setTelaToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTelas = async () => {
      try {
        const response = await axios.get("/telas");
        console.log(response.data); // Verifica los datos recibidos
        setTelas(response.data);
      } catch (error) {
        console.error("Error fetching telas", error);
      }
    };

    fetchTelas();
  }, []);

  const handleUpdateTela = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/telas/${editTela.id}`, editTela);
      setEditTela(null);
      setIsEditModalOpen(false);
      fetchTelas();
    } catch (error) {
      console.error("Error updating tela", error);
    }
  };

  const handleCreateTela = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/telas", newTela);
      setNewTela({ nombre: "", precio: "" });
      setIsCreateModalOpen(false);
      fetchTelas();
    } catch (error) {
      console.error("Error creating tela", error);
    }
  };

  const handleDeleteTela = async () => {
    try {
      await axios.delete(`/telas/${telaToDelete.id}`);
      setIsDeleteModalOpen(false);
      fetchTelas();
    } catch (error) {
      console.error("Error deleting tela", error);
    }
  };

  const handleEditClick = (tela) => {
    setEditTela(tela);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (tela) => {
    setTelaToDelete(tela);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">TELAS</h1>

      {/* Modal de edición */}
      {isEditModalOpen && editTela && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Editar Tela</h2>
            <form onSubmit={handleUpdateTela}>
              <div className="mb-4">
                <label className="block text-gray-700">Nombre</label>
                <input
                  type="text"
                  value={editTela.nombre}
                  onChange={(e) =>
                    setEditTela({ ...editTela, nombre: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Precio</label>
                <input
                  type="number"
                  value={editTela.precio || ""}
                  onChange={(e) =>
                    setEditTela({ ...editTela, precio: e.target.value })
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
            <h2 className="text-xl font-semibold mb-4">Crear Tela</h2>
            <form onSubmit={handleCreateTela}>
              <div className="mb-4">
                <label className="block text-gray-700">Nombre</label>
                <input
                  type="text"
                  value={newTela.nombre}
                  onChange={(e) =>
                    setNewTela({ ...newTela, nombre: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Precio</label>
                <input
                  type="number"
                  value={newTela.precio || ""}
                  onChange={(e) =>
                    setNewTela({ ...newTela, precio: e.target.value })
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
      {isDeleteModalOpen && telaToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-4">Confirmación</h2>
            <p className="mb-4">
              ¿Estás seguro de que deseas eliminar esta tela?
            </p>
            <div className="flex justify-end">
              <button
                onClick={handleDeleteTela}
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
      <div className="flex mb-6">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-500 text-white py-2 px-4 rounded flex items-center"
        >
          <PlusIcon className="h-5 w-5 inline mr-2" />
          Agregar Tela
        </button>
      </div>

      {/* Tabla de Telas */}
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Nombre</th>
            <th className="py-2 px-4 border-b">Precio</th>
            <th className="py-2 px-4 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {telas.map((tela) => (
            <tr key={tela.id}>
              <td className="py-2 px-4 border-b">{tela.nombre}</td>
              <td className="py-2 px-4 border-b">
                {tela.precio ? tela.precio.toFixed(2) : "N/A"}
              </td>
              <td className="py-2 px-4 border-b flex space-x-2">
                <button
                  onClick={() => handleEditClick(tela)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteClick(tela)}
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
