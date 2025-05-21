import { useState, useEffect } from "react";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const API_URL = import.meta.env.VITE_API_URL;

export const Usuarios = () => {
  const [newUsuario, setNewUsuario] = useState({
    usuario: "",
    contraseña: "",
    rol: "usuario",
  });
  const [usuarios, setUsuarios] = useState([]);
  const [editUsuario, setEditUsuario] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch(`${API_URL}/usuarios`);
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error fetching usuarios", error);
    }
  };

  const handleCreateUsuario = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUsuario),
      });
      setNewUsuario({ usuario: "", contraseña: "", rol: "usuario" });
      setIsCreateModalOpen(false);
      fetchUsuarios();
    } catch (error) {
      console.error("Error creating usuario", error);
    }
  };

  const handleUpdateUsuario = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        usuario: editUsuario.usuario,
        rol: editUsuario.rol,
      };
      if (editUsuario.contraseña) {
        updateData.contraseña = editUsuario.contraseña;
      }
      await fetch(`${API_URL}/usuarios/${editUsuario.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });
      setEditUsuario(null);
      setIsEditModalOpen(false);
      fetchUsuarios();
    } catch (error) {
      console.error("Error updating usuario", error);
    }
  };

  const handleDeleteUsuario = async () => {
    try {
      await fetch(`${API_URL}/usuarios/${usuarioToDelete.id}`, {
        method: "DELETE",
      });
      setIsDeleteModalOpen(false);
      fetchUsuarios();
    } catch (error) {
      console.error("Error deleting usuario", error);
    }
  };

  const handleEditClick = (usuario) => {
    setEditUsuario({ ...usuario, contraseña: "" });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (usuario) => {
    setUsuarioToDelete(usuario);
    setIsDeleteModalOpen(true);
  };

  const handleBackClick = () => {
    navigate(`/prepage`);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between w-3/4 mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">USUARIOS</h1>
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
            <h2 className="text-xl font-semibold mb-4">Crear Usuario</h2>
            <form onSubmit={handleCreateUsuario}>
              <div className="mb-4">
                <label className="block text-gray-700">Usuario</label>
                <input
                  type="text"
                  value={newUsuario.usuario}
                  onChange={(e) =>
                    setNewUsuario({ ...newUsuario, usuario: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Contraseña</label>
                <input
                  type="password"
                  value={newUsuario.contraseña}
                  onChange={(e) =>
                    setNewUsuario({ ...newUsuario, contraseña: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Rol</label>
                <select
                  value={newUsuario.rol}
                  onChange={(e) =>
                    setNewUsuario({ ...newUsuario, rol: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="usuario">Usuario</option>
                </select>
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
      {isEditModalOpen && editUsuario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Editar Usuario</h2>
            <form onSubmit={handleUpdateUsuario}>
              <div className="mb-4">
                <label className="block text-gray-700">Usuario</label>
                <input
                  type="text"
                  value={editUsuario.usuario}
                  onChange={(e) =>
                    setEditUsuario({ ...editUsuario, usuario: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Nueva Contraseña (opcional)
                </label>
                <input
                  type="password"
                  value={editUsuario.contraseña}
                  onChange={(e) =>
                    setEditUsuario({
                      ...editUsuario,
                      contraseña: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                  placeholder="Dejar en blanco para no cambiar"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Rol</label>
                <select
                  value={editUsuario.rol}
                  onChange={(e) =>
                    setEditUsuario({ ...editUsuario, rol: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="usuario">Usuario</option>
                </select>
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
      {isDeleteModalOpen && usuarioToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-4">Confirmación</h2>
            <p className="mb-4">
              ¿Estás seguro de que deseas eliminar este usuario?
            </p>
            <div className="flex justify-end">
              <button
                onClick={handleDeleteUsuario}
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
          Agregar Usuario
        </button>
      </div>

      {/* Tabla de Usuarios */}
      <table className="w-3/4 mx-auto bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Usuario</th>
            <th className="py-2 px-4 border-b text-left">Rol</th>
            <th className="py-2 px-4 border-b text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td className="py-2 px-4 border-b">{usuario.usuario}</td>
              <td className="py-2 px-4 border-b">
                {usuario.rol === "admin" ? "Admin" : "Usuario"}
              </td>
              <td className="py-2 px-4 border-b space-x-2">
                <button
                  onClick={() => handleEditClick(usuario)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteClick(usuario)}
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
