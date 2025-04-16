import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PencilIcon, EyeIcon } from "@heroicons/react/24/outline";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date)) return "";
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

export const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [editPedido, setEditPedido] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showTerminados, setShowTerminados] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchPedidos();
  }, []);

  useEffect(() => {
    const filtered = pedidos.filter((pedido) =>
      showTerminados ? pedido.terminado === 1 : pedido.terminado === 0
    );
    // Sort by fecha_estimada in ascending order
    const sorted = filtered.sort((a, b) => {
      const dateA = a.fecha_estimada
        ? new Date(a.fecha_estimada)
        : new Date(9999, 11, 31);
      const dateB = b.fecha_estimada
        ? new Date(b.fecha_estimada)
        : new Date(9999, 11, 31);
      return dateA - dateB;
    });
    setFilteredPedidos(sorted);
  }, [showTerminados, pedidos]);

  const fetchPedidos = async () => {
    try {
      const response = await fetch(`${API_URL}/pedidos`);
      const data = await response.json();
      console.log("Datos de la API:", data); // Para depuración
      const pedidosFiltrados = data.filter((pedido) => pedido.estado === 1);
      setPedidos(pedidosFiltrados);
    } catch (error) {
      console.error("Error fetching pedidos", error);
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
      if (response.ok) {
        setEditPedido(null);
        setIsEditModalOpen(false);
        fetchPedidos();
      } else {
        console.error("Error updating pedido");
      }
    } catch (error) {
      console.error("Error updating pedido", error);
    }
  };

  const handleToggleTerminado = async (pedidoId, currentTerminado) => {
    const newTerminado = currentTerminado === 1 ? 0 : 1;
    try {
      const response = await fetch(`${API_URL}/pedidos/${pedidoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ terminado: newTerminado }),
      });
      if (response.ok) {
        setPedidos((prevPedidos) =>
          prevPedidos.map((pedido) =>
            pedido.id === pedidoId
              ? { ...pedido, terminado: newTerminado }
              : pedido
          )
        );
      } else {
        console.error("Error updating terminado");
      }
    } catch (error) {
      console.error("Error updating terminado", error);
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
    navigate(`/pedidos/${pedidoId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex items-center justify-center mb-6">
        <h1 className="text-2xl font-bold mr-6">
          {showTerminados ? "PEDIDOS TERMINADOS" : "PEDIDOS EN PRODUCCIÓN"}
        </h1>
        <div className="flex items-center">
          <div className="relative inline-block w-11 h-5">
            <input
              id="toggle-filter"
              type="checkbox"
              checked={showTerminados}
              onChange={() => setShowTerminados(!showTerminados)}
              className="peer appearance-none w-11 h-5 bg-slate-100 border border-slate-300 rounded-full checked:bg-blue-600 checked:border-blue-600 cursor-pointer transition-colors duration-300"
            />
            <label
              htmlFor="toggle-filter"
              className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-slate-800 cursor-pointer"
            ></label>
          </div>
        </div>
      </div>

      {/* Tabla de Pedidos */}
      <div className="overflow-x-auto bg-white shadow-md rounded coordenador">
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
              <th className="py-3 px-6 text-center">Terminado</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {filteredPedidos.map((pedido) => (
              <tr
                key={pedido.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {pedido.numero_pedido}
                </td>
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
                  <div className="relative inline-block w-11 h-5">
                    <input
                      id={`switch-${pedido.id}`}
                      type="checkbox"
                      checked={pedido.terminado === 1}
                      onChange={() =>
                        handleToggleTerminado(pedido.id, pedido.terminado)
                      }
                      className="peer appearance-none w-11 h-5 bg-slate-100 border border-slate-300 rounded-full checked:bg-slate-800 checked:border-slate-800 cursor-pointer transition-colors duration-300"
                    />
                    <label
                      htmlFor={`switch-${pedido.id}`}
                      className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-slate-800 cursor-pointer"
                    ></label>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Edición de Pedido */}
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
                  className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-100"
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
              <div className="mb-4">
                <label className="block text-gray-700">Fecha de Pago</label>
                <input
                  type="date"
                  value={editPedido.fecha_pago}
                  onChange={(e) =>
                    setEditPedido({ ...editPedido, fecha_pago: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Fecha Estimada</label>
                <input
                  type="date"
                  value={editPedido.fecha_estimada}
                  onChange={(e) =>
                    setEditPedido({
                      ...editPedido,
                      fecha_estimada: e.target.value,
                    })
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
                  Guardar Cambios
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
    </div>
  );
};
