import { useState, useEffect } from "react";
import { PencilIcon, PlusIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { EditArticuloModal } from "../components/EditArticuloModal";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

export const Articulos = ({ pedidoId }) => {
  const [talles] = useState(["XS", "S", "M", "L", "XL", "XXL", "XXXL"]);
  const [prendas] = useState([
    "Buzo",
    "Remera",
    "Campera",
    "Pantalones",
    "Chombas",
  ]);
  const [todosLosAgregados, setTodosLosAgregados] = useState([]);
  const [agregadoParaAgregar, setAgregadoParaAgregar] = useState("");
  const [telas, setTelas] = useState([]);
  const [articulos, setArticulos] = useState([]);
  const [editArticulo, setEditArticulo] = useState({
    numero_articulo: "",
    nombre: "",
    cantidad: "",
    talle: "",
    agregados: [],
    comentario: "",
    tela: "",
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [etapasMap, setEtapasMap] = useState({});
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;
  const API_URL_PDF = import.meta.env.VITE_API_URL_PDF;

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
      const response = await fetch(`${API_URL}/telas`);
      const data = await response.json();
      setTelas(data);
    } catch (error) {
      console.error("Error fetching telas", error);
    }
  };

  const fetchArticulos = async () => {
    try {
      const response = await fetch(`${API_URL}/articulos`);
      const data = await response.json();
      const filteredArticulos = data.filter(
        (articulo) => articulo.pedidos_id == pedidoId
      );
      setArticulos(filteredArticulos);
    } catch (error) {
      console.error("Error fetching articulos", error);
    }
  };

  const fetchEtapas = async () => {
    try {
      const response = await fetch(`${API_URL}/etapas?pedidos_id=${pedidoId}`);
      const data = await response.json();
      const filteredEtapas = data.filter(
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
      const response = await fetch(`${API_URL}/agregados`);
      const data = await response.json();
      setTodosLosAgregados(data);
    } catch (error) {
      console.error("Error fetching agregados", error);
    }
  };

  const handleAgregarAgregado = () => {
    if (agregadoParaAgregar) {
      const agregado = todosLosAgregados.find(
        (item) => item.nombre === agregadoParaAgregar
      );

      if (
        agregado &&
        Array.isArray(editArticulo.agregados) &&
        !editArticulo.agregados.some((item) => item.id === agregado.id)
      ) {
        setEditArticulo({
          ...editArticulo,
          agregados: [...editArticulo.agregados, agregado],
        });

        setAgregadoParaAgregar("");
      }
    }
  };

  const handleRemoveAgregado = (agregado) => {
    setEditArticulo({
      ...editArticulo,
      agregados: editArticulo.agregados.filter((item) =>
        agregado.id ? item.id !== agregado.id : item.nombre !== agregado.nombre
      ),
    });
  };

  const handleUpdateArticulo = async (e, file) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      formData.append("numero_articulo", editArticulo.numero_articulo);
      formData.append("nombre", editArticulo.nombre);
      formData.append("cantidad", editArticulo.cantidad);
      formData.append("talle", editArticulo.talle);
      formData.append("tela", editArticulo.tela);
      formData.append("pedidos_id", pedidoId);

      if (editArticulo.agregados && editArticulo.agregados.length > 0) {
        const agregadosString = editArticulo.agregados
          .map((agregado) => agregado.nombre)
          .join(", ");
        formData.append("agregados", agregadosString);
      }

      if (file) {
        formData.append("file", file);
      }

      const response = await fetch(`${API_URL}/articulos/${editArticulo.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error: ${JSON.stringify(errorData)}`);
      }

      const updatedArticulo = await response.json();

      setArticulos((prevArticulos) =>
        prevArticulos.map((art) =>
          art.id === updatedArticulo.id ? updatedArticulo : art
        )
      );

      setEditArticulo(null);
      setIsEditModalOpen(false);
      await fetchArticulos();
    } catch (error) {
      console.error("Error updating articulo:", error.message);
    }
  };

  const handleEditClick = (articulo) => {
    let agregadosArray = [];

    if (Array.isArray(articulo.agregados)) {
      if (
        articulo.agregados.length > 0 &&
        typeof articulo.agregados[0] === "string"
      ) {
        agregadosArray = articulo.agregados.map((nombre) => {
          const agregadoExistente = todosLosAgregados.find(
            (a) => a.nombre === nombre
          );
          return agregadoExistente || { nombre };
        });
      } else {
        agregadosArray = [...articulo.agregados];
      }
    } else if (typeof articulo.agregados === "string") {
      agregadosArray = articulo.agregados.split(", ").map((nombre) => {
        const agregadoExistente = todosLosAgregados.find(
          (a) => a.nombre === nombre
        );
        return agregadoExistente || { nombre };
      });
    }

    setEditArticulo({
      ...articulo,
      fecha_inicio: articulo.fecha_inicio
        ? articulo.fecha_inicio.slice(0, 10)
        : "",
      fecha_fin: articulo.fecha_fin ? articulo.fecha_fin.slice(0, 10) : "",
      agregados: agregadosArray,
    });

    setIsEditModalOpen(true);
  };

  const handleViewClick = (id) => {
    navigate(`/articulos/${id}`);
  };

  return (
    <div className="text-sm">
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
        handleRemoveAgregado={handleRemoveAgregado}
        pedidoId={pedidoId}
      />

      {/* Tabla de Artículos */}
      <table className="min-w-full bg-white border border-gray-200 text-xl">
        <thead>
          <tr className="text-left">
            <th className="py-2 px-4 border-b">Excel</th>
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
                  {articulo.ruta ? (
                    <a
                      href={`${API_URL_PDF}/storage/${articulo.ruta}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500"
                    >
                      Ver archivo
                    </a>
                  ) : (
                    "Sin archivo"
                  )}
                </td>
                <td className="py-2 px-4 border-b">
                  {articulo.numero_articulo}
                </td>
                <td className="py-2 px-4 border-b">{articulo.nombre}</td>
                <td className="py-2 px-4 border-b">{articulo.cantidad}</td>
                <td className="py-2 px-4 border-b">{articulo.talle}</td>
                <td className="py-2 px-4 border-b">{articulo.tela}</td>
                <td className="py-2 px-4 border-b">
                  {articulo.agregados ? articulo.agregados.join(", ") : ""}
                </td>
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
