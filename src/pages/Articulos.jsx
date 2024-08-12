import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { PencilIcon, PlusIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

const talles = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

export const Articulos = ({ pedidoId }) => {
  const [newArticulo, setNewArticulo] = useState({
    numero_articulo: "",
    nombre: "",
    cantidad: "",
    talle: "",
    comentario: "",
  });
  const [articulos, setArticulos] = useState([]);
  const [editArticulo, setEditArticulo] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [etapasMap, setEtapasMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await fetchArticulos();
      await fetchEtapas();
    };
    fetchData();
  }, [pedidoId]);

  const fetchArticulos = async () => {
    try {
      const response = await axios.get("/articulos");
      const filteredArticulos = response.data.filter(
        (articulo) => articulo.pedidos_id == pedidoId
      );
      setArticulos(filteredArticulos);
    } catch (error) {
      console.error("Error fetching articulos", error);
    }
  };

  const fetchEtapas = async () => {
    try {
      const response = await axios.get(`/etapas?pedidos_id=${pedidoId}`);
      const filteredEtapas = response.data.filter(
        (etapa) => etapa.pedidos_id == pedidoId
      );

      const etapasMap = filteredEtapas.reduce((acc, etapa) => {
        if (!acc[etapa.articulos_id]) {
          acc[etapa.articulos_id] = [];
        }
        acc[etapa.articulos_id].push(etapa);
        return acc;
      }, {});
      setEtapasMap(etapasMap);
    } catch (error) {
      console.error("Error fetching etapas", error);
    }
  };

  const handleUpdateArticulo = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/articulos/${editArticulo.id}`, {
        numero_articulo: editArticulo.numero_articulo,
        nombre: editArticulo.nombre,
        cantidad: editArticulo.cantidad,
        talle: editArticulo.talle,
        comentario: editArticulo.comentario,
        pedidos_id: pedidoId,
      });
      setEditArticulo(null);
      setIsEditModalOpen(false);
      fetchArticulos();
    } catch (error) {
      console.error("Error updating articulo", error);
    }
  };

  const handleCreateArticulo = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/articulos", { ...newArticulo, pedidos_id: pedidoId });
      setNewArticulo({
        numero_articulo: "",
        nombre: "",
        cantidad: "",
        talle: "",
        comentario: "",
      });
      setIsCreateModalOpen(false);
      fetchArticulos();
    } catch (error) {
      console.error("Error creating articulo", error);
    }
  };

  const handleEditClick = (articulo) => {
    setEditArticulo({
      ...articulo,
      fecha_inicio: articulo.fecha_inicio
        ? articulo.fecha_inicio.slice(0, 10)
        : "",
      fecha_fin: articulo.fecha_fin ? articulo.fecha_fin.slice(0, 10) : "",
    });
    setIsEditModalOpen(true);
  };

  const handleViewClick = (id) => {
    navigate(`/articulos/${id}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">ARTÍCULOS</h1>

      {/* Modal de edición */}
      {isEditModalOpen && editArticulo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Editar Artículo</h2>
            <form onSubmit={handleUpdateArticulo}>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Número de Artículo
                </label>
                <input
                  type="text"
                  value={editArticulo.numero_articulo}
                  onChange={(e) =>
                    setEditArticulo({
                      ...editArticulo,
                      numero_articulo: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Nombre</label>
                <input
                  type="text"
                  value={editArticulo.nombre}
                  onChange={(e) =>
                    setEditArticulo({
                      ...editArticulo,
                      nombre: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Cantidad</label>
                <input
                  type="number"
                  value={editArticulo.cantidad}
                  onChange={(e) =>
                    setEditArticulo({
                      ...editArticulo,
                      cantidad: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Talle</label>
                <select
                  value={editArticulo.talle || ""}
                  onChange={(e) =>
                    setEditArticulo({
                      ...editArticulo,
                      talle: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                >
                  {talles.map((talle) => (
                    <option key={talle} value={talle}>
                      {talle}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Comentario</label>
                <input
                  type="text"
                  value={editArticulo.comentario}
                  onChange={(e) =>
                    setEditArticulo({
                      ...editArticulo,
                      comentario: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
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
            <h2 className="text-xl font-semibold mb-4">Crear Artículo</h2>
            <form onSubmit={handleCreateArticulo}>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Número de Artículo
                </label>
                <input
                  type="number"
                  value={newArticulo.numero_articulo}
                  onChange={(e) =>
                    setNewArticulo({
                      ...newArticulo,
                      numero_articulo: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Nombre</label>
                <input
                  type="text"
                  value={newArticulo.nombre}
                  onChange={(e) =>
                    setNewArticulo({
                      ...newArticulo,
                      nombre: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Cantidad</label>
                <input
                  type="number"
                  value={newArticulo.cantidad}
                  onChange={(e) =>
                    setNewArticulo({
                      ...newArticulo,
                      cantidad: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Talle</label>
                <select
                  value={newArticulo.talle}
                  onChange={(e) =>
                    setNewArticulo({
                      ...newArticulo,
                      talle: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                >
                  {talles.map((talle) => (
                    <option key={talle} value={talle}>
                      {talle}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Comentario</label>
                <input
                  type="text"
                  value={newArticulo.comentario}
                  onChange={(e) =>
                    setNewArticulo({
                      ...newArticulo,
                      comentario: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
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

      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-green-500 text-white py-2 px-4 rounded flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Agregar Artículo
        </button>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Número de Artículo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cantidad
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Talle
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Comentario
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {articulos.map((articulo) => (
            <tr key={articulo.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {articulo.numero_articulo}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{articulo.nombre}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {articulo.cantidad}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{articulo.talle}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {articulo.comentario}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleEditClick(articulo)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleViewClick(articulo.id)}
                  className="text-blue-600 hover:text-blue-900 ml-4"
                >
                  <EyeIcon className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
