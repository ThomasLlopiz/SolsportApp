import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Etapas } from "./Etapas";

const API_URL = import.meta.env.VITE_API_URL;

export const Articulo = () => {
  const { id } = useParams();
  const [articulo, setArticulo] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/articulos/${id}`);
        if (!response.ok) {
          throw new Error("Error fetching data");
        }
        const data = await response.json();
        setArticulo(data);
        setEditedComment(data.comentario || "");
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [id]);

  const handleBackClick = () => {
    if (articulo && articulo.pedidos_id) {
      navigate(`/pedidos/${articulo.pedidos_id}`);
    }
  };

  const handleCommentChange = (e) => {
    setEditedComment(e.target.value);
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch(`${API_URL}/articulos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...articulo,
          comentario: editedComment,
        }),
      });
      if (!response.ok) {
        throw new Error("Error saving comment");
      }
      const updatedArticulo = await response.json();
      setArticulo((prev) => ({ ...prev, comentario: editedComment }));
    } catch (error) {
      console.error("Error saving comment", error);
    }
  };

  if (!articulo) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-3 font-semibold text-center bg-gray-500 rounded-md p-1 text-white">
            <h3 className="text-2xl">Artículo: {articulo.numero_articulo}</h3>
            <h3 className="text-2xl">{articulo.nombre}</h3>
            <h3 className="text-2xl">{articulo.talle}</h3>
          </div>

          <button
            onClick={handleBackClick}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition flex items-center"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Volver
          </button>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Comentario</h2>
          <textarea
            value={editedComment}
            onChange={handleCommentChange}
            rows="4"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleSaveClick}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mt-2"
          >
            Guardar
          </button>
        </div>

        <div className="mt-6">
          <Etapas
            articuloId={id}
            pedidosId={articulo.pedidos_id}
            cantidadArticulo={articulo.cantidad}
          />
        </div>
      </div>
    </div>
  );
};
