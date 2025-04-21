import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Articulos } from "./Articulos";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const Pedido = () => {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [articulos, setArticulos] = useState([]);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/pedidos/${id}`);
        if (!response.ok) {
          throw new Error("Error fetching data");
        }
        const data = await response.json();
        setPedido(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id, API_URL]);

  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        const response = await fetch(`${API_URL}/articulos?pedido_id=${id}`);
        if (!response.ok) {
          throw new Error("Error fetching articulos");
        }
        const data = await response.json();
        setArticulos(data);
      } catch (error) {
        console.error("Error fetching articulos:", error);
      }
    };
    fetchArticulos();
  }, [id, API_URL]);

  const generarPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [
        [
          "Número Artículo",
          "Nombre",
          "Tela",
          "Cantidad",
          "Talle",
          "Agregados",
          "Colores",
          "Comentario",
        ],
      ],
      body: articulos.map((articulo) => [
        articulo.numero_articulo,
        articulo.nombre,
        articulo.tela || "-",
        articulo.cantidad,
        articulo.talle || "-",
        articulo.agregados || "-",
        articulo.colores || "-",
        articulo.comentario || "-",
      ]),
      startY: 50,
      theme: "grid",
      headStyles: { fillColor: [100, 100, 100] },
      styles: { fontSize: 10 },
    });

    doc.setFontSize(18);
    doc.text(`Pedido: ${pedido.numero_pedido}`, 14, 20);
    doc.setFontSize(14);
    doc.text(`Cliente: ${pedido.nombre_cliente}`, 14, 30);
    doc.text(`Localidad: ${pedido.localidad}`, 14, 40);

    doc.save(`pedido_${pedido.numero_pedido}.pdf`);
  };

  const handleBackClick = () => {
    navigate("/pedidos");
  };

  if (!pedido) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <div className="flex bg-gray-300 rounded-md p-3 gap-10">
            <h3 className="text-2xl font-bold text-center">
              Pedido: {pedido.numero_pedido}
            </h3>
            <h3 className="text-2xl font-bold text-center">
              {pedido.nombre_cliente}
            </h3>
            <h3 className="text-2xl font-bold text-center">
              {pedido.localidad}
            </h3>
          </div>

          <div className="flex gap-4">
            <button
              onClick={generarPDF}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition flex items-center"
            >
              Descargar PDF
            </button>
            <button
              onClick={handleBackClick}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition flex items-center"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Volver
            </button>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4 text-center">Artículos</h2>
          <Articulos pedidoId={id} />
        </div>
      </div>
    </div>
  );
};
