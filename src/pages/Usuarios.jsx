import { useState, useEffect } from "react";
import { PencilIcon, PlusIcon, TrashIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = import.meta.env.VITE_API_URL;

export const Usuarios = () => {
  const [newUsuario, setNewUsuario] = useState({
    usuario: "",
    contraseña: "",
    confirmarContraseña: "",
    rol: "usuario",
  });
  const [usuarios, setUsuarios] = useState([]);
  const [editUsuario, setEditUsuario] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [showEditConfirmPassword, setShowEditConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/usuarios`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Fetch usuarios error:", error);
      toast.error("Error al cargar usuarios: " + error.message, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUsuario = async (e) => {
    e.preventDefault();
    if (newUsuario.contraseña !== newUsuario.confirmarContraseña) {
      toast.error("Las contraseñas no coinciden", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/usuarios`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario: newUsuario.usuario,
          contraseña: newUsuario.contraseña,
          rol: newUsuario.rol,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setNewUsuario({ usuario: "", contraseña: "", confirmarContraseña: "", rol: "usuario" });
      setIsCreateModalOpen(false);
      fetchUsuarios();
      toast.success("Usuario creado exitosamente", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Create usuario error:", error);
      toast.error("Error al crear usuario: " + error.message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleUpdateUsuario = async (e) => {
    e.preventDefault();
    if (editUsuario.contraseña && editUsuario.contraseña !== editUsuario.confirmarContraseña) {
      toast.error("Las contraseñas no coinciden", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const updateData = {
        usuario: editUsuario.usuario,
        rol: editUsuario.rol,
      };
      if (editUsuario.contraseña) {
        updateData.contraseña = editUsuario.contraseña;
      }
      const response = await fetch(`${API_URL}/usuarios/${editUsuario.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setEditUsuario(null);
      setIsEditModalOpen(false);
      fetchUsuarios();
      toast.success("Usuario actualizado exitosamente", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Update usuario error:", error);
      toast.error("Error al actualizar usuario: " + error.message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleDeleteUsuario = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/usuarios/${usuarioToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setIsDeleteModalOpen(false);
      fetchUsuarios();
      toast.success("Usuario eliminado exitosamente", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Delete usuario error:", error);
      toast.error("Error al eliminar usuario: " + error.message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleEditClick = (usuario) => {
    setEditUsuario({ ...usuario, contraseña: "", confirmarContraseña: "" });
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
      <ToastContainer />
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
              <div className="mb-4 relative">
                <label className="block text-gray-700">Contraseña</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={newUsuario.contraseña}
                  onChange={(e) =>
                    setNewUsuario({ ...newUsuario, contraseña: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 mt-1 rounded"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-10"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              <div className="mb-4 relative">
                <label className="block text-gray-700">Confirmar Contraseña</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={newUsuario.confirmarContraseña}
                  onChange={(e) =>
                    setNewUsuario({ ...newUsuario, confirmarContraseña: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 mt-1 rounded"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-10"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Rol</label>
                <select
                  value={newUsuario.rol}
                  onChange={(e) =>
                    setNewUsuario({ ...newUsuario, rol: e.target.value })
                  }
                  className="w-full border border-gray-4 p-2 mt-1 rounded"
                  required
                  >
                  <option value="superadmin">Superadmin</option>
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
                  className="w-full border border-gray-300 p-2 mt-1 rounded"
                  required
                />
              </div>
              <div className="mb-4 relative">
                <label className="block text-gray-700">New Password (optional)</label>
                <input
                  type={showEditPassword ? "text" : "password"}
                  value={editUsuario.contraseña}
                  onChange={(e) =>
                    setEditUsuario({ ...editUsuario, contraseña: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 mt-1 rounded"
                  placeholder="New password"
                />
                <button
                  type="button"
                  onClick={() => setShowEditPassword(!showEditPassword)}
                  className="absolute right-2 top-10"
                >
                  {showEditPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              <div className="mb-4 relative">
                <label className="block text-gray-700">Confirm New Password</label>
                <input
                  type={showEditConfirmPassword ? "text" : "password"}
                  value={editUsuario.confirmarContraseña}
                  onChange={(e) =>
                    setEditUsuario({ ...editUsuario, confirmarContraseña: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 mt-1 rounded"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowEditConfirmPassword(!showEditConfirmPassword)}
                  className="absolute right-2 top-10"
                >
                  {showEditConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Rol</label>
                <select
                  value={editUsuario.rol}
                  onChange={(e) =>
                    setEditUsuario({ ...editUsuario, rol: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2"
                >
                  <option value="superadmin">Superadmin</option>
                  <option value="admin">Admin</option>
                  <option value="usuario">Usuario</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 rounded mr-2"
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

      {isDeleteModalOpen && usuarioToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Confirmación</h2>
            <p className="mb-4">
              ¿Estás seguro de que estás de eliminar este usuario?
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => handleDeleteUsuario()}
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

      <div className="flex mb-6 w-3/4 mx-auto">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded flex items-center"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <PlusIcon className="h-5 w-5 inline mr-2" />
          Agregar Usuario
        </button>
      </div>

      {isLoading ? (
        <div className="text-center w-3/4 mx-auto">Cargando usuarios...</div>
      ) : usuarios.length === 0 ? (
        <div className="text-center w-3/4 mx-auto">No hay usuarios disponibles.</div>
      ) : (
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
                  {usuario.rol === "superadmin"
                    ? "Superadmin"
                    : usuario.rol === "admin"
                    ? "Admin"
                    : "Usuario"}
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
      )}
    </div>
  );
};