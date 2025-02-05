import { useState, useEffect } from "react";
import { PencilIcon, PlusIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

export const Articulos = ({ pedidoId }) => {

  const [newArticulo, setNewArticulo] = useState({
    numero_articulo: "",
    nombre: "",
    cantidad: "",
    talle: "",
    agregados: "",
    comentario: "",
  });
  const [talles] = useState(["XS", "S", "M", "L", "XL", "XXL", "XXXL"]);
  const [prendas] = useState([
    "Buzo",
    "Remera",
    "Campera",
    "Pantalones",
    "Chombas",
  ]);
  const [todosLosAgregados, setTodosLosAgregados] = useState([]);
  const [selectedAgregados, setSelectedAgregados] = useState([]);
  const [agregadoParaAgregar, setAgregadoParaAgregar] = useState("");
  const [telas, setTelas] = useState([]);
  const [articulos, setArticulos] = useState([]);
  const [articulo, setArticulo] = useState([]);
  const [editArticulo, setEditArticulo] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [etapasMap, setEtapasMap] = useState({});
  const navigate = useNavigate();
  
  //FETCHS
  useEffect(() => {
    const fetchData = async () => {
      await fetchArticulos();
      await fetchEtapas();
      await fetchTelas();
      await fetchAgregados();
    };
    fetchData();
  }, [pedidoId]);
  const fetchTelas = async () => {
    try {
      const response = await axios.get("/telas");
      setTelas(response.data);
    } catch (error) {
      console.error("Error fetching telas", error);
    }
  };
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
  const fetchAgregados = async () => {
    try {
      const response = await axios.get("/agregados");
      setTodosLosAgregados(response.data);
    } catch (error) {
      console.error("Error fetching agregados", error);
    }
  };
  //AGREGADOS
  const handleAgregarAgregado = () => {
    if (
      agregadoParaAgregar &&
      !selectedAgregados.includes(agregadoParaAgregar)
    ) {
      setSelectedAgregados((prev) => [...prev, agregadoParaAgregar]);
      setAgregadoParaAgregar("");
    }
  };
  const handleRemoveAgregado = (agregado) => {
    setSelectedAgregados((prev) => prev.filter((item) => item !== agregado));
  };
  //CREATE
  const handleCreateArticulo = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/articulos", {
        ...newArticulo,
        tela: newArticulo.tela,
        pedidos_id: pedidoId,
        agregados: selectedAgregados,
      });
      setNewArticulo({
        numero_articulo: "",
        nombre: "",
        cantidad: "",
        talle: "",
        agregados: "",
        comentario: "",
        tela: "",
      });
      setIsCreateModalOpen(false);
      fetchArticulos();
    } catch (error) {
      console.error('Error al crear el artículo:', error.response ? error.response.data : error.message);
    }
  };
  //UPDATE
  const handleUpdateArticulo = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/articulos/${editArticulo.id}`, {
        ...editArticulo,
        tela: editArticulo.tela,
        pedidos_id: pedidoId,
        agregados: editArticulo.agregados,
      });
      setEditArticulo(null);
      setIsEditModalOpen(false);
      fetchArticulos();
    } catch (error) {
      console.error("Error updating articulo", error);
    }
  };
  //EDIT
  const handleEditClick = (articulo) => {
    setEditArticulo({
      ...articulo,
      fecha_inicio: articulo.fecha_inicio ? articulo.fecha_inicio.slice(0, 10) : "",
      fecha_fin: articulo.fecha_fin ? articulo.fecha_fin.slice(0, 10) : "",
      agregados: articulo.agregados || [],
    });
    setIsEditModalOpen(true);
  };
  //VIEW ARITCULO
  const handleViewClick = (id) => {
    navigate(`/articulos/${id}`);
  };
  return (
    <div className="p-4">
      {/* Modal de creación */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Crear Artículo</h2>
            <form onSubmit={handleCreateArticulo}>
              {/* NÚMERO DE ARTÍCULO */}
              <div className="mb-4">
                <label className="block text-gray-700">Número de Artículo</label>
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
                  min="1"
                  required
                />
              </div>

              {/* PRENDA */}
              <div className="mb-4">
                <label className="block text-gray-700">Prenda</label>
                <select
                  value={newArticulo.nombre}
                  onChange={(e) =>
                    setNewArticulo({
                      ...newArticulo,
                      nombre: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                >
                  <option value="">Selecciona una prenda</option>
                  {prendas.map((prenda) => (
                    <option key={prenda} value={prenda}>
                      {prenda}
                    </option>
                  ))}
                </select>
              </div>

              {/* TALLE */}
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
                  <option value="">Selecciona un talle</option>
                  {talles.map((talle) => (
                    <option key={talle} value={talle}>
                      {talle}
                    </option>
                  ))}
                </select>
              </div>
              {/* TELA */}
              <div className="mb-4">
                <label className="block text-gray-700">Tela</label>
                <select
                  value={newArticulo.tela}
                  onChange={(e) =>
                    setNewArticulo({
                      ...newArticulo,
                      tela: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                >
                  <option value="">Selecciona una tela</option>
                  {telas.map((tela) => (
                    <option key={tela.id} value={tela.nombre}>
                      {tela.nombre}
                    </option>
                  ))}
                </select>
              </div>
              {/* AGREGADOS */}
              <div className="flex flex-col gap-3">
                <select
                  value={agregadoParaAgregar} // Cambié esto para usar `agregadoParaAgregar`
                  onChange={(e) => setAgregadoParaAgregar(e.target.value)} // Actualizamos el agregado seleccionado
                  className="py-2 px-4 border border-gray-300 rounded mt-12"
                >
                  <option value="">Seleccionar agregado</option>
                  {todosLosAgregados
                    .filter(
                      (agregado) => !selectedAgregados.includes(agregado.nombre) // Filtramos para no mostrar los agregados ya seleccionados
                    )
                    .map((agregado, index) => (
                      <option key={index} value={agregado.nombre} >
                        {agregado.nombre}
                      </option>
                    ))}
                </select>
                <button
                  type="button" // Cambié el tipo de botón a "button" ya que estamos manejando la lógica por fuera
                  onClick={handleAgregarAgregado} // Llamamos la función para agregar el agregado
                  className="py-2 px-4 bg-blue-500 text-white rounded"
                >
                  Agregar
                </button>
              </div>
              <div>
                <ul className="list-disc pl-4 font-semibold mt-10 mr-3">
                  {selectedAgregados.map((agregado, index) => (
                    <li key={index} className="flex justify-between items-center">
                      {agregado}
                      <button
                        type="button"
                        onClick={() => handleRemoveAgregado(agregado)} // Eliminamos el agregado
                        className="ml-2 text-red-500"
                      >
                        Eliminar
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              {/* CANTIDAD */}
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
                  min="1"
                  required
                />
              </div>
              {/* COMENTARIO */}
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

      {/* Modal de edición */}
      {isEditModalOpen && editArticulo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Editar Artículo</h2>
            <form onSubmit={handleUpdateArticulo}>
              {/* Número de Artículo */}
              <div className="mb-4">
                <label className="block text-gray-700">Número de Artículo</label>
                <input
                  type="number"
                  value={editArticulo.numero_articulo}
                  onChange={(e) =>
                    setEditArticulo({
                      ...editArticulo,
                      numero_articulo: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                  min="1"
                  required
                />
              </div>

              {/* Select para Prenda */}
              <div className="mb-4">
                <label className="block text-gray-700">Prenda</label>
                <select
                  value={editArticulo.nombre}
                  onChange={(e) =>
                    setEditArticulo({
                      ...editArticulo,
                      nombre: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                >
                  <option value="">Selecciona una prenda</option>
                  {prendas.map((prenda) => (
                    <option key={prenda} value={prenda}>
                      {prenda}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select para Talle */}
              <div className="mb-4">
                <label className="block text-gray-700">Talle</label>
                <select
                  value={editArticulo.talle}
                  onChange={(e) =>
                    setEditArticulo({
                      ...editArticulo,
                      talle: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                >
                  <option value="">Selecciona un talle</option>
                  {talles.map((talle) => (
                    <option key={talle} value={talle}>
                      {talle}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select para Tela */}
              <div className="mb-4">
                <label className="block text-gray-700">Tela</label>
                <select
                  value={editArticulo.tela}
                  onChange={(e) =>
                    setEditArticulo({
                      ...editArticulo,
                      tela: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                >
                  <option value="">Selecciona una tela</option>
                  {telas.map((tela) => (
                    <option key={tela.id} value={tela.nombre}>
                      {tela.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Agregados */}
              <div className="flex flex-col gap-3">
                <select
                  value={agregadoParaAgregar}
                  onChange={(e) => setAgregadoParaAgregar(e.target.value)}
                  className="py-2 px-4 border border-gray-300 rounded mt-12"
                >
                  <option value="">Seleccionar agregado</option>
                  {todosLosAgregados
                    .filter(
                      (agregado) => !editArticulo.agregados.includes(agregado.nombre) // No mostrar los agregados ya seleccionados
                    )
                    .map((agregado, index) => (
                      <option key={index} value={agregado.nombre}>
                        {agregado.nombre}
                      </option>
                    ))}
                </select>
                <button
                  type="button"
                  onClick={handleAgregarAgregado}
                  className="py-2 px-4 bg-blue-500 text-white rounded"
                >
                  Agregar
                </button>
              </div>

              {/* Lista de agregados seleccionados */}
              <div>
                <ul className="list-disc pl-4 font-semibold mt-10 mr-3">
                  {Array.isArray(editArticulo.agregados) && editArticulo.agregados.map((agregado, index) => (
                    <li key={index} className="flex justify-between items-center">
                      {agregado}
                      <button
                        type="button"
                        onClick={() =>
                          setEditArticulo({
                            ...editArticulo,
                            agregados: editArticulo.agregados.filter(
                              (item) => item !== agregado
                            ),
                          })
                        }
                        className="ml-2 text-red-500"
                      >
                        Eliminar
                      </button>
                    </li>
                  ))}


                </ul>
              </div>

              {/* Cantidad */}
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
                  min="1"
                  required
                />
              </div>

              {/* Comentario */}
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


      {/* Botón para abrir el modal de creación */}
      <div className="flex mb-6">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          <PlusIcon className="h-5 w-5 inline mr-2" />
          Agregar Artículo
        </button>
      </div>

      {/* Tabla de Artículos */}
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="text-left">
            <th className="py-2 px-4 border-b">Número de Artículo</th>
            <th className="py-2 px-4 border-b">Prenda</th>
            <th className="py-2 px-4 border-b">Cantidad</th>
            <th className="py-2 px-4 border-b">Talle</th>
            <th className="py-2 px-4 border-b">Tela</th>
            <th className="py-2 px-4 border-b">Agregados</th>
            <th className="py-2 px-4 border-b">Fecha Inicio</th>
            <th className="py-2 px-4 border-b">Fecha Fin</th>
            <th className="py-2 px-4 border-b">Última Etapa</th>
            <th className="py-2 px-4 border-b">Usuario</th>
            <th className="py-2 px-4 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {articulos.map((articulo) => {
            const etapas = etapasMap[articulo.id] || [];
            etapas.sort(
              (a, b) => new Date(a.fecha_inicio) - new Date(b.fecha_inicio)
            );
            const firstDate = etapas.length
              ? formatDate(etapas[0].fecha_inicio)
              : "";
            const lastDate = etapas.length
              ? formatDate(etapas[etapas.length - 1].fecha_fin)
              : "";
            const lastEtapa = etapas.length
              ? etapas[etapas.length - 1].nombre
              : "";

            return (
              <tr key={articulo.id}>
                <td className="py-2 px-4 border-b">
                  {articulo.numero_articulo}
                </td>
                <td className="py-2 px-4 border-b">{articulo.nombre}</td>
                <td className="py-2 px-4 border-b">{articulo.cantidad}</td>
                <td className="py-2 px-4 border-b">{articulo.talle}</td>
                <td className="py-2 px-4 border-b">{articulo.tela}</td>
                <td className="py-2 px-4 border-b w-10">{articulo.agregados}</td>
                <td className="py-2 px-4 border-b">{firstDate}</td>
                <td className="py-2 px-4 border-b">{lastDate}</td>
                <td className="py-2 px-4 border-b">{lastEtapa}</td>
                <td className="py-2 px-4 border-b">
                  {articulo.usuario_nombre}
                </td>
                <td className="py-2 px-4 border-b">
                  <button onClick={() => handleEditClick(articulo)}>
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button onClick={() => handleViewClick(articulo.id)}>
                    <EyeIcon className="h-5 w-5 ml-5" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
