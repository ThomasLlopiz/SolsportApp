import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { PencilIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${year}-${month}-${day}`;
};

const formatDateForDisplay = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

const NOMBRE_OPTIONS = [
  "Corte",
  "Bordado",
  "Subilmado",
  "Estampado",
  "DTF",
  "Prep.Confeccion",
  "Confeccion",
  "Calidad",
];

export const Etapas = ({ articuloId, pedidosId }) => {
  const [etapas, setEtapas] = useState([]);
  const [editEtapa, setEditEtapa] = useState(null);
  const [newEtapa, setNewEtapa] = useState({
    nombre: "",
    fecha_inicio: "",
    fecha_fin: "",
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();
  const [firstDate, setFirstDate] = useState("");
  const [lastDate, setLastDate] = useState("");
  const [lastEtapa, setLastEtapa] = useState(null);

  useEffect(() => {
    fetchEtapas();
  }, [articuloId]);

  const fetchEtapas = async () => {
    try {
      const response = await axios.get(`/etapas?articulos_id=${articuloId}`);
      const filteredEtapas = response.data.filter(
        (etapa) => etapa.articulos_id == articuloId
      );
      setEtapas(filteredEtapas);
      if (filteredEtapas.length > 0) {
        const sortedEtapas = [...filteredEtapas].sort(
          (a, b) => new Date(a.fecha_inicio) - new Date(b.fecha_inicio)
        );
        const firstDate = sortedEtapas[0].fecha_inicio;
        const lastDate = sortedEtapas[sortedEtapas.length - 1].fecha_fin;

        setFirstDate(formatDateForDisplay(firstDate));
        setLastDate(formatDateForDisplay(lastDate));

        const lastEtapa = filteredEtapas.find(
          (etapa) => etapa.fecha_fin === lastDate
        );
        setLastEtapa(lastEtapa);
      }
    } catch (error) {
      console.error("Error fetching etapas", error);
    }
  };

  const handleUpdateEtapa = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/etapas/${editEtapa.id}`, {
        nombre: editEtapa.nombre,
        fecha_inicio: editEtapa.fecha_inicio,
        fecha_fin: editEtapa.fecha_fin,
        articulos_id: articuloId,
        pedidos_id: pedidosId,
      });
      setEditEtapa(null);
      setIsEditModalOpen(false);
      fetchEtapas();
    } catch (error) {
      console.error("Error updating etapa", error);
    }
  };

  const handleCreateEtapa = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/etapas", {
        ...newEtapa,
        articulos_id: articuloId,
        pedidos_id: pedidosId,
      });
      setNewEtapa({
        nombre: "",
        fecha_inicio: "",
        fecha_fin: "",
      });
      setIsCreateModalOpen(false);
      fetchEtapas();
    } catch (error) {
      console.error("Error creating etapa", error);
    }
  };

  const handleEditClick = (etapa) => {
    setEditEtapa({
      ...etapa,
      fecha_inicio: formatDateForInput(etapa.fecha_inicio),
      fecha_fin: formatDateForInput(etapa.fecha_fin),
    });
    setIsEditModalOpen(true);
  };

  const handleViewClick = (id) => {
    navigate(`/etapas/${id}`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-center">ETAPAS</h1>

      {/* Modal de edición */}
      {isEditModalOpen && editEtapa && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Editar Etapa</h2>
            <form onSubmit={handleUpdateEtapa}>
              <div className="mb-4">
                <label className="block text-gray-700">Nombre</label>
                <select
                  value={editEtapa.nombre}
                  onChange={(e) =>
                    setEditEtapa({ ...editEtapa, nombre: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                >
                  <option value="" disabled>
                    Selecciona un nombre
                  </option>
                  {NOMBRE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Fecha de Inicio</label>
                <input
                  type="date"
                  value={editEtapa.fecha_inicio}
                  onChange={(e) =>
                    setEditEtapa({ ...editEtapa, fecha_inicio: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Fecha de Fin</label>
                <input
                  type="date"
                  value={editEtapa.fecha_fin}
                  onChange={(e) =>
                    setEditEtapa({ ...editEtapa, fecha_fin: e.target.value })
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
                  Actualizar Etapa
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

      {/* Modal de creación */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Crear Etapa</h2>
            <form onSubmit={handleCreateEtapa}>
              <div className="mb-4">
                <label className="block text-gray-700">Nombre</label>
                <select
                  value={newEtapa.nombre}
                  onChange={(e) =>
                    setNewEtapa({ ...newEtapa, nombre: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                >
                  <option value="" disabled>
                    Selecciona un nombre
                  </option>
                  {NOMBRE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Fecha de Inicio</label>
                <input
                  type="date"
                  value={newEtapa.fecha_inicio}
                  onChange={(e) =>
                    setNewEtapa({ ...newEtapa, fecha_inicio: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Fecha de Fin</label>
                <input
                  type="date"
                  value={newEtapa.fecha_fin}
                  onChange={(e) =>
                    setNewEtapa({ ...newEtapa, fecha_fin: e.target.value })
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
                  Crear Etapa
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

      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mb-4"
      >
        <PlusIcon className="h-5 w-5 inline-block mr-2" />
        Crear Etapa
      </button>

      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Nombre</th>
            <th className="py-2 px-4 border-b text-left">Fecha de Inicio</th>
            <th className="py-2 px-4 border-b text-left">Fecha de Fin</th>
            <th className="py-2 px-4 border-b text-left">Usuario</th>
            <th className="py-2 px-4 border-b text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {etapas.map((etapa) => (
            <tr key={etapa.id}>
              <td className="py-2 px-4 border-b">{etapa.nombre}</td>
              <td className="py-2 px-4 border-b">
                {formatDateForDisplay(etapa.fecha_inicio)}
              </td>
              <td className="py-2 px-4 border-b">
                {formatDateForDisplay(etapa.fecha_fin)}
              </td>
              <td className="py-2 px-4 border-b">{etapa.usuario_nombre}</td>
              <td className="py-2 px-4 border-b">
                <button onClick={() => handleEditClick(etapa)}>
                  <PencilIcon className="h-5 w-5 ml-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
