import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import ArticuloForm from "../components/ArticuloForm";
import CostosProduccion from "../components/CostosProduccion";
import ArticulosTable from "../components/ArticulosTable";
import {
  GenerarCotizacionPdf,
  EnviarCotizacionPorEmail,
} from "../components/EnviarCotizacionPdf";

export const Cotizacion = () => {
  const { id } = useParams();
  const { id: pedidoId } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const [prendas, setPrendas] = useState([]);
  const [colores, setColores] = useState([]);
  const [talles] = useState([
    "2",
    "4",
    "6",
    "8",
    "10",
    "12",
    "14",
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "2XL",
    "3XL",
    "4XL",
  ]);
  const [pedido, setPedido] = useState(null);
  const [todosLosAgregados, setTodosLosAgregados] = useState([]);
  const [telas, setTelas] = useState([]);
  const [costosProduccion, setCostosProduccion] = useState([]);
  const [selectedPrenda, setSelectedPrenda] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedTalle, setSelectedTalle] = useState("");
  const [selectedTela, setSelectedTela] = useState("");
  const [selectedAgregados, setSelectedAgregados] = useState([]);
  const [agregadoParaAgregar, setAgregadoParaAgregar] = useState("");
  const [numeroArticulo, setNumeroArticulo] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [comentario, setComentario] = useState("");
  const [prioridad, setPrioridad] = useState(null);
  const [articulos, setArticulos] = useState([]);
  const [editingArticulo, setEditingArticulo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [costosCantidades, setCostosCantidades] = useState({});
  const [ganancia, setGanancia] = useState(0);
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState(null);

  useEffect(() => {
    fetchPedido();
    fetchAgregados();
    fetchTelas();
    fetchArticulosDelPedido();
    fetchCostosProduccion();
    fetchPrendas();
    fetchColores();
  }, [pedidoId]);

  useEffect(() => {
    if (costosProduccion.length > 0) {
      const initialCostos = {};
      costosProduccion.forEach((costo) => {
        initialCostos[costo.id] = costosCantidades[costo.id] || 0;
      });
      setCostosCantidades(initialCostos);
    }
  }, [costosProduccion]);

  useEffect(() => {
    fetchCostosConCantidades();
  }, [editingArticulo]);

  const fetchPrendas = async () => {
    try {
      const response = await fetch(`${API_URL}/prendas`);
      const data = await response.json();
      setPrendas(data);
    } catch (error) {
      console.error("Error fetching prendas", error);
    }
  };

  const fetchCostosConCantidades = async () => {
    if (editingArticulo && editingArticulo.id) {
      try {
        const response = await fetch(
          `${API_URL}/costos_articulo_produccion?articulo_id=${editingArticulo.id}`
        );
        const data = await response.json();

        const cantidades = {};
        data.forEach((item) => {
          cantidades[item.costo_id] = item.cantidad;
        });
        setCostosCantidades(cantidades);
      } catch (error) {
        console.error("Error al cargar costos existentes:", error);
      }
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

  const fetchCostosProduccion = async () => {
    try {
      const response = await fetch(`${API_URL}/costos_produccion`);
      const data = await response.json();
      setCostosProduccion(data);
    } catch (error) {
      console.error("Error fetching costos de producción", error);
    }
  };

  const fetchTelas = async () => {
    try {
      const response = await fetch(`${API_URL}/telas`);
      const data = await response.json();
      setTelas(data);
    } catch (error) {
      console.error("Error fetching telas", error);
    }
  };

  const fetchPedido = async () => {
    try {
      const response = await fetch(`${API_URL}/pedidos/${id}`);
      const data = await response.json();
      setPedido(data);
    } catch (error) {
      console.error("Error fetching pedido", error);
    }
  };

  const fetchArticulosDelPedido = async () => {
    try {
      const response = await fetch(
        `${API_URL}/articulos?pedidos_id=${pedidoId}`
      );
      const data = await response.json();
      setArticulos(data);
    } catch (error) {
      console.error("Error fetching articulos del pedido", error);
    }
  };

  const fetchColores = async () => {
    try {
      const response = await fetch(`${API_URL}/colores`);
      const data = await response.json();
      setColores(data);
    } catch (error) {
      console.error("Error fetching colores", error);
    }
  };

  const enviarCotizacionPorEmail = async () => {
    try {
      await EnviarCotizacionPorEmail({
        pedido,
        articulos,
        email,
        pedidoId,
        API_URL,
        setIsSending,
        setSendStatus,
      });
    } catch (error) {
      console.error("Error en enviarCotizacionPorEmail:", error);
    }
  };

  const descargarCotizacionPdf = () => {
    try {
      const doc = GenerarCotizacionPdf({ pedido, articulos });
      doc.save(`cotizacion_pedido_${pedido.numero_pedido}.pdf`);
    } catch (error) {
      console.error("Error al descargar PDF:", error);
      alert("Error al generar el PDF para descarga");
    }
  };

  const handleBackClick = () => {
    navigate(`/cotizador`);
  };

  const handleCostoCantidadChange = (costoId, value) => {
    const nuevaCantidad = value ? parseInt(value) : 0;
    setCostosCantidades((prev) => ({
      ...prev,
      [costoId]: nuevaCantidad,
    }));
  };

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

  const calculatePrice = (prenda, color, talle, tela, agregados) => {
    if (!tela || !prenda || !color)
      return {
        costoUnitario: 0,
        costoTotal: 0,
        precioUnitario: 0,
      };

    const telaObj = telas.find((t) => t.nombre === tela);
    const prendaObj = prendas.find((p) => p.nombre === prenda);
    const colorObj = colores.find((c) => c.nombre === color);
    const basePrice = telaObj ? telaObj.precio : 0;
    const consumoPrenda = prendaObj ? prendaObj.consumo : 0;
    const consumoColor = colorObj ? colorObj.consumo : 0;

    const talleFactor = {
      2: 0.4,
      4: 0.45,
      6: 0.5,
      8: 0.55,
      10: 0.6,
      12: 0.65,
      14: 0.7,
      XS: 0.7,
      S: 0.7,
      M: 0.75,
      L: 0.8,
      XL: 0.85,
      "2XL": 1.03,
      "3XL": 1.15,
      "4XL": 1.2,
    };

    const talleMultiplier = talleFactor[talle] || 0.7;

    const consumoTotal = consumoPrenda + consumoColor;
    const costoBase = basePrice * consumoTotal * talleMultiplier;

    const agregadoPrices = agregados.reduce((sum, agregado) => {
      const agregadoData = todosLosAgregados.find((a) => a.nombre === agregado);
      return sum + (agregadoData ? agregadoData.precio : 0);
    }, 0);

    const costosTotal = costosProduccion.reduce((sum, costo) => {
      const cantidad = costosCantidades[costo.id] || 0;
      return sum + costo.precio * cantidad;
    }, 0);

    const costoUnitario = costoBase + agregadoPrices + costosTotal;
    const costoTotal = costoUnitario * cantidad;
    const precioUnitario = costoUnitario * (1 + ganancia / 100);

    return {
      costoUnitario: Number(costoUnitario.toFixed(2)),
      costoTotal: Number(costoTotal.toFixed(2)),
      precioUnitario: Number(precioUnitario.toFixed(2)),
    };
  };

  const handleGuardar = async () => {
    try {
      if (!selectedColor) {
        alert("Por favor seleccione un color.");
        return;
      }

      const colorObj = colores.find((c) => c.nombre === selectedColor);
      if (!colorObj) {
        alert("Color seleccionado no encontrado.");
        return;
      }

      const calculos = calculatePrice(
        selectedPrenda,
        selectedColor,
        selectedTalle,
        selectedTela,
        selectedAgregados
      ) || {
        costoUnitario: 0,
        costoTotal: 0,
        precioUnitario: 0,
      };

      const articuloData = {
        numero_articulo: numeroArticulo,
        nombre: selectedPrenda,
        color_id: colorObj.id,
        talle: selectedTalle,
        tela: selectedTela,
        agregados: selectedAgregados,
        cantidad: Number(cantidad),
        costo: Number(calculos.costoUnitario),
        precio: Number(calculos.precioUnitario),
        ganancia: Number(ganancia),
        comentario: comentario,
        prioridad: prioridad ? Number(prioridad) : null,
        pedidos_id: pedidoId,
        ruta: "",
      };

      const articuloResponse = await fetch(`${API_URL}/articulos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(articuloData),
      });

      if (!articuloResponse.ok) {
        const errorData = await articuloResponse.json();
        throw new Error(errorData.message || "Error al guardar artículo");
      }

      const nuevoArticulo = await articuloResponse.json();

      const costosAGuardar = costosProduccion
        .filter((costo) => (costosCantidades[costo.id] || 0) > 0)
        .map((costo) => ({
          articulo_id: nuevoArticulo.id,
          costo_id: costo.id,
          cantidad: Number(costosCantidades[costo.id] || 0),
        }));

      await Promise.all(
        costosAGuardar.map(async (costo) => {
          const response = await fetch(
            `${API_URL}/costos_articulo_produccion`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify(costo),
            }
          );

          if (!response.ok) {
            const error = await response.json();
            throw new Error(
              `Error al guardar costo ${costo.costo_id}: ${error.message}`
            );
          }
          return await response.json();
        })
      );

      setArticulos((prev) => [...prev, nuevoArticulo]);
      resetForm();
      fetchArticulosDelPedido();
    } catch (error) {
      console.error("Error completo en handleGuardar:", error);
      alert("Error al guardar el artículo: " + error.message);
    }
  };

  const resetForm = () => {
    setNumeroArticulo("");
    setCantidad(1);
    setSelectedPrenda("");
    setSelectedColor("");
    setSelectedTalle("");
    setSelectedTela("");
    setSelectedAgregados([]);
    setAgregadoParaAgregar("");
    setComentario("");
    setPrioridad(null);
    setIsEditing(false);
    setEditingArticulo(null);
    setGanancia(0);
    const resetCostos = {};
    costosProduccion.forEach((costo) => {
      resetCostos[costo.id] = 0;
    });
    setCostosCantidades(resetCostos);
  };

  const handleStartEdit = async (articulo) => {
    try {
      const colorObj = colores.find((c) => c.id === articulo.color_id);
      setNumeroArticulo(articulo.numero_articulo);
      setSelectedPrenda(articulo.nombre);
      setSelectedColor(colorObj ? colorObj.nombre : "");
      setSelectedTalle(articulo.talle);
      setSelectedTela(articulo.tela);
      setSelectedAgregados(
        Array.isArray(articulo.agregados) ? [...articulo.agregados] : []
      );
      setCantidad(articulo.cantidad);
      setComentario(articulo.comentario || "");
      setGanancia(articulo.ganancia || 0);
      setPrioridad(articulo.prioridad || null);
      setIsEditing(true);
      setEditingArticulo(articulo);

      const response = await fetch(
        `${API_URL}/costos_articulo_produccion?articulo_id=${articulo.id}`
      );
      const costosExistentes = await response.json();

      const nuevosCostos = {};
      costosExistentes.forEach((costo) => {
        nuevosCostos[costo.costo_id] = costo.cantidad;
      });

      setCostosCantidades(nuevosCostos);
    } catch (error) {
      console.error("Error al cargar costos existentes:", error);
    }
  };

  const handleUpdateArticulo = async () => {
    if (!editingArticulo) return;

    try {
      const colorObj = colores.find((c) => c.nombre === selectedColor);
      if (!colorObj) {
        alert("Color seleccionado no encontrado.");
        return;
      }

      const calculos = calculatePrice(
        selectedPrenda,
        selectedColor,
        selectedTalle,
        selectedTela,
        selectedAgregados
      ) || {
        costoUnitario: 0,
        costoTotal: 0,
        precioUnitario: 0,
      };

      const articuloActualizado = {
        numero_articulo: numeroArticulo,
        nombre: selectedPrenda,
        color_id: colorObj.id,
        talle: selectedTalle,
        tela: selectedTela,
        agregados: selectedAgregados,
        cantidad: Number(cantidad),
        costo: Number(calculos.costoUnitario.toFixed(2)),
        precio: Number(calculos.precioUnitario.toFixed(2)),
        ganancia: Number(ganancia),
        comentario: comentario,
        prioridad: prioridad ? Number(prioridad) : null,
        pedidos_id: pedidoId,
      };

      const response = await fetch(
        `${API_URL}/articulos/${editingArticulo.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(articuloActualizado),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar artículo");
      }

      const articuloActualizadoResp = await response.json();

      const existingCostsResponse = await fetch(
        `${API_URL}/costos_articulo_produccion?articulo_id=${editingArticulo.id}`
      );
      const existingCosts = await existingCostsResponse.json();

      const costosConCantidades = costosProduccion
        .filter((costo) => (costosCantidades[costo.id] || 0) >= 0)
        .map((costo) => ({
          articulo_id: editingArticulo.id,
          costo_id: costo.id,
          cantidad: Number(costosCantidades[costo.id] || 0),
        }));

      await Promise.all(
        costosConCantidades.map(async (costoData) => {
          const existingCost = existingCosts.find(
            (c) => c.costo_id === costoData.costo_id
          );

          if (existingCost) {
            if (costoData.cantidad > 0) {
              return fetch(
                `${API_URL}/costos_articulo_produccion/${existingCost.id}`,
                {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(costoData),
                }
              );
            } else {
              return fetch(
                `${API_URL}/costos_articulo_produccion/${existingCost.id}`,
                { method: "DELETE" }
              );
            }
          } else if (costoData.cantidad > 0) {
            return fetch(`${API_URL}/costos_articulo_produccion`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(costoData),
            });
          }
        })
      );

      setArticulos(
        articulos.map((a) =>
          a.id === articuloActualizadoResp.id ? articuloActualizadoResp : a
        )
      );
      resetForm();
      fetchArticulosDelPedido();
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Error al actualizar el artículo: " + error.message);
    }
  };

  const handleRemoveArticulo = async (articuloId) => {
    if (!window.confirm("¿Está seguro de que desea eliminar este artículo?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/articulos/${articuloId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el artículo");
      }

      setArticulos(articulos.filter((a) => a.id !== articuloId));
    } catch (error) {
      console.error("Error al eliminar el artículo:", error);
    }
  };

  const formatCurrency = (value) => {
    const num = Number(value) || 0;
    return num.toFixed(2);
  };

  return (
    <div className="p-6 w-3/4 mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl text-left font-semibold">
            Pedido #{pedido?.numero_pedido}
          </h2>
          <p className="text-gray-600 text-xl">
            Cliente: {pedido?.nombre_cliente}
          </p>
        </div>
        <div className="mt-4">
          <button
            onClick={handleBackClick}
            className="flex items-center bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Volver a la lista de pedidos
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8 mx-auto">
        <h3 className="text-lg font-semibold mb-4">Agregar Artículo</h3>
        <ArticuloForm
          prendas={prendas}
          colores={colores}
          talles={talles}
          telas={telas}
          todosLosAgregados={todosLosAgregados}
          numeroArticulo={numeroArticulo}
          selectedPrenda={selectedPrenda}
          selectedColor={selectedColor}
          selectedTalle={selectedTalle}
          selectedTela={selectedTela}
          selectedAgregados={selectedAgregados}
          agregadoParaAgregar={agregadoParaAgregar}
          cantidad={cantidad}
          ganancia={ganancia}
          comentario={comentario}
          setNumeroArticulo={setNumeroArticulo}
          setSelectedPrenda={setSelectedPrenda}
          setSelectedColor={setSelectedColor}
          setSelectedTalle={setSelectedTalle}
          setSelectedTela={setSelectedTela}
          setSelectedAgregados={setSelectedAgregados}
          setAgregadoParaAgregar={setAgregadoParaAgregar}
          setCantidad={setCantidad}
          setGanancia={setGanancia}
          setComentario={setComentario}
          handleAgregarAgregado={handleAgregarAgregado}
          handleRemoveAgregado={handleRemoveAgregado}
        />

        <CostosProduccion
          costosProduccion={costosProduccion}
          costosCantidades={costosCantidades}
          handleCostoCantidadChange={handleCostoCantidadChange}
          calculatePrice={calculatePrice}
          selectedPrenda={selectedPrenda}
          selectedColor={selectedColor}
          selectedTalle={selectedTalle}
          selectedTela={selectedTela}
          selectedAgregados={selectedAgregados}
          cantidad={cantidad}
        />

        <div className="mt-4 flex justify-end space-x-2">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleUpdateArticulo}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Actualizar Artículo
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleGuardar}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Guardar Artículo
            </button>
          )}
        </div>
      </div>

      <ArticulosTable
        articulos={articulos}
        handleStartEdit={handleStartEdit}
        handleRemoveArticulo={handleRemoveArticulo}
        formatCurrency={formatCurrency}
        onPrioridadChange={fetchArticulosDelPedido}
      />
      <div className="mt-4 flex justify-between items-center space-x-4">
        <button
          onClick={descargarCotizacionPdf}
          className="bg-green-600 text-white px-4 py-3 rounded hover:bg-green-700"
        >
          Descargar PDF
        </button>
        <div className="flex gap-2">
          {sendStatus && (
            <div
              className={`mt-2 p-2 rounded ${
                sendStatus.success
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {sendStatus.message}
            </div>
          )}
          <div className="flex items-center justify-center">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-56 rounded-md border-gray-300 shadow-sm px-4 py-3 border"
              placeholder="Ingrese el email del cliente"
            />
          </div>

          <button
            onClick={enviarCotizacionPorEmail}
            disabled={isSending}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isSending ? "Enviando..." : "Enviar por Email"}
          </button>
        </div>
      </div>
    </div>
  );
};
