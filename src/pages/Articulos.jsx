import { useState, useEffect } from "react";
import { PencilIcon, PlusIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { CreateArticuloModal } from "../components/CreateArticuloModal";
import { EditArticuloModal } from "../components/EditArticuloModal";
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
  //AGREGADOS EDIT
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
  //AGREGADOS CREATE
  const handleAgregarAgregadoCreate = () => {
    if (
      agregadoParaAgregar &&
      !selectedAgregados.includes(agregadoParaAgregar)
    ) {
      setSelectedAgregados((prev) => [...prev, agregadoParaAgregar]);
      setAgregadoParaAgregar("");
    }
  };
  const handleRemoveAgregadoCreate = (agregado) => {
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
        agregados: [],
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
    console.log(articulo.agregados);
    setIsEditModalOpen(true);
  };
  //VIEW ARITCULO
  const handleViewClick = (id) => {
    navigate(`/articulos/${id}`);
  };
  return (
    <div className="text-md">
      <CreateArticuloModal
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        newArticulo={newArticulo}
        setNewArticulo={setNewArticulo}
        handleCreateArticulo={handleCreateArticulo}
        prendas={prendas}
        talles={talles}
        telas={telas}
        todosLosAgregados={todosLosAgregados}
        agregadoParaAgregar={agregadoParaAgregar}
        setAgregadoParaAgregar={setAgregadoParaAgregar}
        handleAgregarAgregadoCreate={handleAgregarAgregadoCreate}
        selectedAgregados={selectedAgregados}
        handleRemoveAgregadoCreate={handleRemoveAgregadoCreate}
      />
      <EditArticuloModal
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        editArticulo={editArticulo}
        setEditArticulo={setEditArticulo}
        handleUpdateArticulo={handleUpdateArticulo}
        prendas={prendas}
        talles={talles}
        telas={telas}
        todosLosAgregados={todosLosAgregados}
        agregadoParaAgregar={agregadoParaAgregar}
        setAgregadoParaAgregar={setAgregadoParaAgregar}
        handleAgregarAgregado={handleAgregarAgregado}
      />
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
                <td className="py-2 px-4 border-b w-">{articulo.agregados}</td>
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
