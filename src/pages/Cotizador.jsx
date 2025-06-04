import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PencilIcon, PlusIcon, EyeIcon } from "@heroicons/react/24/outline";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

const getCurrentDate = () => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

export const Cotizador = () => {
  const { id } = useParams();
  const [pedidos, setPedidos] = useState([]);
  const [newPedido, setNewPedido] = useState({
    numero_pedido: "",
    nombre_cliente: "",
    correo: "",
    telefono: "",
    localidad: "",
    terminado: 0,
  });
  const [editPedido, setEditPedido] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [usuarioNombre, setUsuarioNombre] = useState("Usuario desconocido");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchPedidos();
  }, []);

  useEffect(() => {
    const usuarioId = localStorage.getItem("usuario_id");
    if (usuarioId) {
      fetch(`${API_URL}/usuarios/${usuarioId}`)
        .then((response) => response.json())
        .then((data) => setUsuarioNombre(data.usuario || "Usuario desconocido"))
        .catch(() => setUsuarioNombre("Usuario desconocido"));
    }
  }, []);

  useEffect(() => {
    if (
      Notification.permission !== "granted" &&
      Notification.permission !== "denied"
    ) {
      Notification.requestPermission();
    }
  }, []);

  const handleBackClick = () => {
    navigate(`/prepage`);
  };

  const fetchPedidos = async () => {
    try {
      const response = await fetch(`${API_URL}/pedidos`);
      if (!response.ok) {
        throw new Error("Error fetching pedidos");
      }
      const data = await response.json();
      const pedidosConEstado = data.map((pedido) => ({
        ...pedido,
        estado: pedido.estado || false,
      }));
      setPedidos(pedidosConEstado);
    } catch (error) {}
  };

  const handleCreatePedido = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/pedidos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPedido),
      });

      if (!response.ok) {
        throw new Error("Error creating pedido");
      }

      setNewPedido({
        numero_pedido: "",
        nombre_cliente: "",
        correo: "",
        telefono: "",
        localidad: "",
        fecha_pago: "",
        fecha_estimada: "",
      });
      setIsCreateModalOpen(false);
      fetchPedidos();
      toast.success("Cotización creada exitosamente.", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error("Error al crear la cotización: " + error.message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleUpdatePedido = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/pedidos/${editPedido.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editPedido),
      });

      if (!response.ok) {
        throw new Error("Error updating pedido");
      }

      setEditPedido(null);
      setIsEditModalOpen(false);
      fetchPedidos();
      toast.success("Cotización actualizada exitosamente.", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error("Error al actualizar la cotización: " + error.message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleEditClick = (pedido) => {
    setEditPedido({
      ...pedido,
      fecha_pago: pedido.fecha_pago ? pedido.fecha_pago.slice(0, 10) : "",
      fecha_estimada: pedido.fecha_estimada
        ? pedido.fecha_estimada.slice(0, 10)
        : "",
    });
    setIsEditModalOpen(true);
  };

  const handleViewClick = (pedidoId) => {
    navigate(`/cotizador/${pedidoId}`);
  };

  const handleStateChange = async (pedidoId) => {
    try {
      const pedidoActual = pedidos.find((p) => p.id === pedidoId);
      const nuevoEstado = !pedidoActual.estado;
      const updatedFields = {
        estado: nuevoEstado,
        ...(nuevoEstado && { fecha_pago: getCurrentDate() }),
      };

      const response = await fetch(`${API_URL}/pedidos/${pedidoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFields),
      });

      if (!response.ok) {
        throw new Error("Error updating estado");
      }

      setPedidos((prevPedidos) =>
        prevPedidos.map((pedido) =>
          pedido.id === pedidoId
            ? {
                ...pedido,
                estado: nuevoEstado,
                fecha_pago: nuevoEstado ? getCurrentDate() : pedido.fecha_pago,
              }
            : pedido
        )
      );

      if (Notification.permission === "granted") {
        new Notification(
          `Cambio de estado en pedido #${pedidoActual.numero_pedido}`,
          {
            body: `El pedido ahora está ${
              nuevoEstado ? "Pagado" : "No pagado"
            }. Cambiado por ${usuarioNombre}.`,
            icon: "/path/to/icon.png",
          }
        );
      } else if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          new Notification(
            `Cambio de estado en pedido #${pedidoActual.numero_pedido}`,
            {
              body: `El pedido ahora está ${
                nuevoEstado ? "Pagado" : "No pagado"
              }. Cambiado por ${usuarioNombre}.`,
              icon: "/path/to/icon.png",
            }
          );
        }
      }

      toast.success(
        `El estado del pedido #${pedidoActual.numero_pedido} ha cambiado a ${
          nuevoEstado ? "Pagado" : "No pagado"
        }. Cambiado por ${usuarioNombre}.`,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } catch (error) {
      toast.error("Error al actualizar el estado: " + error.message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer />
      <div className="flex justify-between mb-10">
        <h1 className="text-2xl font-bold mb-6 text-center"></h1>
        <button
          onClick={handleBackClick}
          className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition flex items-center"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Volver
        </button>
      </div>

      <div className="flex justify-between mb-4">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Crear Nueva Cotización
        </button>
        <h1 className="text-2xl font-bold text-center">COTIZADOR</h1>
        <h1></h1>
      </div>

      {/* Modal de Crear Pedido */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">
              Crear nueva cotización
            </h2>
            <form onSubmit={handleCreatePedido}>
              <div className="mb-4">
                <label className="block text-gray-700">Número de Pedido</label>
                <input
                  type="number"
                  value={newPedido.numero_pedido}
                  onChange={(e) =>
                    setNewPedido({
                      ...newPedido,
                      numero_pedido: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Nombre del Cliente
                </label>
                <input
                  type="text"
                  value={newPedido.nombre_cliente}
                  onChange={(e) =>
                    setNewPedido({
                      ...newPedido,
                      nombre_cliente: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Correo</label>
                <input
                  type="email"
                  value={newPedido.correo}
                  onChange={(e) =>
                    setNewPedido({ ...newPedido, correo: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Teléfono</label>
                <input
                  type="number"
                  value={newPedido.telefono}
                  onChange={(e) =>
                    setNewPedido({ ...newPedido, telefono: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Localidad</label>
                <input
                  type="text"
                  value={newPedido.localidad}
                  onChange={(e) =>
                    setNewPedido({ ...newPedido, localidad: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mr-2"
                >
                  Crear Cotización
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Editar Pedido */}
      {isEditModalOpen && editPedido && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Editar Pedido</h2>
            <form onSubmit={handleUpdatePedido}>
              <div className="mb-4">
                <label className="block text-gray-700">Número de Pedido</label>
                <input
                  type="text"
                  value={editPedido.numero_pedido}
                  onChange={(e) =>
                    setEditPedido({
                      ...editPedido,
                      numero_pedido: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Nombre del Cliente
                </label>
                <input
                  type="text"
                  value={editPedido.nombre_cliente}
                  onChange={(e) =>
                    setEditPedido({
                      ...editPedido,
                      nombre_cliente: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Correo</label>
                <input
                  type="email"
                  value={editPedido.correo}
                  onChange={(e) =>
                    setEditPedido({ ...editPedido, correo: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Teléfono</label>
                <input
                  type="text"
                  value={editPedido.telefono}
                  onChange={(e) =>
                    setEditPedido({ ...editPedido, telefono: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Localidad</label>
                <input
                  type="text"
                  value={editPedido.localidad}
                  onChange={(e) =>
                    setEditPedido({ ...editPedido, localidad: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mr-2"
                >
                  Actualizar Cotización
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabla de Pedidos */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 text-left">Número de Pedido</th>
              <th className="py-3 px-6 text-left">Cliente</th>
              <th className="py-3 px-6 text-left">Correo</th>
              <th className="py-3 px-6 text-left">Teléfono</th>
              <th className="py-3 px-6 text-left">Localidad</th>
              <th className="py-3 px-6 text-left">Fecha de Pago</th>
              <th className="py-3 px-6 text-left">Fecha Estimada</th>
              <th className="py-3 px-6 text-center">Acciones</th>
              <th className="py-3 px-6 text-center">Pagado</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {pedidos.map((pedido) => (
              <tr
                key={pedido.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left">{pedido.numero_pedido}</td>
                <td className="py-3 px-6 text-left">{pedido.nombre_cliente}</td>
                <td className="py-3 px-6 text-left">{pedido.correo}</td>
                <td className="py-3 px-6 text-left">{pedido.telefono}</td>
                <td className="py-3 px-6 text-left">{pedido.localidad}</td>
                <td className="py-3 px-6 text-left">
                  {formatDate(pedido.fecha_pago)}
                </td>
                <td className="py-3 px-6 text-left">
                  {formatDate(pedido.fecha_estimada)}
                </td>
                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-center space-x-2">
                    <button
                      onClick={() => handleEditClick(pedido)}
                      className="transform hover:text-purple-500 hover:scale-110"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleViewClick(pedido.id)}
                      className="transform hover:text-blue-500 hover:scale-110"
                    >
                      <EyeIcon className="h-6 w-6" />
                    </button>
                  </div>
                </td>
                <td className="py-3 px-6 text-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pedido.estado || false}
                      onChange={() => handleStateChange(pedido.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:bg-blue-600"></div>
                    <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
