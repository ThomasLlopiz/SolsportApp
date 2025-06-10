import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import ArticuloForm from "../components/ArticuloForm";
import CostosProduccion from "../components/CostosProduccion";
import ArticulosTable from "../components/ArticulosTable";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  GenerarCotizacionPdf,
  EnviarCotizacionPorEmail,
} from "../components/EnviarCotizacionPdf";

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

export const Cotizacion = () => {
  const { id: pedidoId } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const [prendas, setPrendas] = useState([]);
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
    "2 a 8",
    "10 a XS",
    "S a XL",
    "2XL a 3XL",
  ]);
  const [pedido, setPedido] = useState(null);
  const [todosLosAgregados, setTodosLosAgregados] = useState([]);
  const [telas, setTelas] = useState([]);
  const [costosProduccion, setCostosProduccion] = useState([]);
  const [selectedPrenda, setSelectedPrenda] = useState("");
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
      const response = await fetch(`${API_URL}/prendas`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) throw new Error("Error al cargar prendas");
      const data = await response.json();
      setPrendas(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchCostosConCantidades = async () => {
    if (editingArticulo && editingArticulo.id) {
      try {
        const response = await fetch(
          `${API_URL}/costos_articulo_produccion?articulo_id=${editingArticulo.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) throw new Error("Error al cargar costos existentes");
        const data = await response.json();
        const cantidades = {};
        data.forEach((item) => {
          cantidades[item.costo_id] = item.cantidad;
        });
        setCostosCantidades(cantidades);
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const fetchAgregados = async () => {
    try {
      const response = await fetch(`${API_URL}/agregados`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) throw new Error("Error al cargar agregados");
      const data = await response.json();
      setTodosLosAgregados(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchCostosProduccion = async () => {
    try {
      const response = await fetch(`${API_URL}/costos_produccion`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) throw new Error("Error al cargar costos de producción");
      const data = await response.json();
      setCostosProduccion(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchTelas = async () => {
    try {
      const response = await fetch(`${API_URL}/telas`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) throw new Error("Error al cargar telas");
      const data = await response.json();
      setTelas(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchPedido = async () => {
    try {
      const response = await fetch(`${API_URL}/pedidos/${pedidoId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) throw new Error("Error al cargar pedido");
      const data = await response.json();
      setPedido(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchArticulosDelPedido = async () => {
    try {
      const response = await fetch(
        `${API_URL}/articulos?pedidos_id=${pedidoId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (!response.ok) throw new Error("Error al cargar artículos del pedido");
      const data = await response.json();
      const articulosFiltrados = data.filter(
        (articulo) => articulo.pedidos_id === Number(pedidoId)
      );
      setArticulos(articulosFiltrados);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const enviarCotizacionPorEmail = async () => {
    if (!pedido || !articulos.length) {
      toast.error("Falta el pedido o los artículos para enviar la cotización.");
      return;
    }
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
      toast.success("Cotización enviada correctamente.");
    } catch (error) {
      toast.error("Error al enviar la cotización: " + error.message);
    }
  };

  const descargarCotizacionPdf = async () => {
    if (!pedido || !articulos.length) {
      toast.error("Falta el pedido o los artículos para generar el PDF.");
      return;
    }
    try {
      const doc = await GenerarCotizacionPdf({ pedido, articulos });
      doc.save(`cotizacion_pedido_${pedido.numero_pedido}.pdf`);
      toast.success("PDF generado correctamente.");
    } catch (error) {
      toast.error("Error al generar el PDF: " + error.message);
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
      !selectedAgregados.some((ag) => ag.nombre === agregadoParaAgregar)
    ) {
      setSelectedAgregados((prev) => [
        ...prev,
        { nombre: agregadoParaAgregar, count: 1 },
      ]);
      setAgregadoParaAgregar("");
    }
  };

  const handleRemoveAgregado = (nombre) => {
    setSelectedAgregados((prev) => prev.filter((ag) => ag.nombre !== nombre));
  };

  const handleIncrementAgregado = (nombre) => {
    setSelectedAgregados((prev) =>
      prev.map((ag) =>
        ag.nombre === nombre ? { ...ag, count: ag.count + 1 } : ag
      )
    );
  };

  const handleDecrementAgregado = (nombre) => {
    const agregado = selectedAgregados.find((ag) => ag.nombre === nombre);
    if (agregado && agregado.count > 1) {
      setSelectedAgregados((prev) =>
        prev.map((ag) =>
          ag.nombre === nombre ? { ...ag, count: ag.count - 1 } : ag
        )
      );
    } else {
      handleRemoveAgregado(nombre);
    }
  };

  const formatAgregadosForBackend = (agregados) => {
    return agregados.map((ag) => `${ag.nombre}:${ag.count}`).join(",");
  };

  const parseAgregadosFromBackend = (agregadosInput) => {
    let agregadosString = "";
    if (Array.isArray(agregadosInput)) {
      agregadosString = agregadosInput.join(",");
    } else if (typeof agregadosInput === "string" && agregadosInput.trim()) {
      agregadosString = agregadosInput;
    } else {
      return [];
    }

    const agregadosArray = agregadosString.includes(",")
      ? agregadosString.split(",")
      : [agregadosString];

    return agregadosArray
      .filter((item) => item.includes(":"))
      .map((item) => {
        const [nombre, count] = item.split(":");
        return {
          nombre: nombre ? nombre.trim() : "",
          count: parseInt(count) || 1,
        };
      })
      .filter((ag) => ag.nombre);
  };

  const getTalleRange = (talle) => {
    const talleRanges = {
      "2 a 8": ["2", "4", "6", "8"],
      "10 a XS": ["10", "12", "14", "XS"],
      "S a XL": ["S", "M", "L", "XL"],
      "2XL a 3XL": ["2XL", "3XL"],
    };
    return talleRanges[talle] || [talle];
  };

  const getLargestTalle = (talles) => {
    const talleOrden = [
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
    ];
    return talles.reduce((largest, current) => {
      const currentIdx = talleOrden.indexOf(current);
      const largestIdx = talleOrden.indexOf(largest);
      return currentIdx > largestIdx ? current : largest;
    }, talles[0]);
  };

  const calculatePrice = (prenda, talle, tela, agregados) => {
    let costoUnitario = 0;
    let talleMultiplier = 0.7;
    if (tela && prenda) {
      const telaObj = telas.find((t) => t.nombre === tela);
      const prendaObj = prendas.find((p) => p.nombre === prenda);
      const basePrice = telaObj ? telaObj.precio : 0;
      const consumoPrenda = prendaObj ? prendaObj.consumo : 0;

      talleMultiplier = talleFactor[talle] || 0.7;
      const consumoTotal = consumoPrenda;
      costoUnitario += basePrice * consumoTotal * talleMultiplier;
    }

    const agregadoPrices = agregados.reduce((sum, agregado) => {
      const agregadoData = todosLosAgregados.find(
        (a) => a.nombre === agregado.nombre
      );
      return sum + (agregadoData ? agregadoData.precio * agregado.count : 0);
    }, 0);

    const costosTotal = costosProduccion.reduce((sum, costo) => {
      const cantidad = costosCantidades[costo.id] || 0;
      return sum + costo.precio * cantidad;
    }, 0);

    costoUnitario += agregadoPrices + costosTotal;
    const costoTotal = costoUnitario * cantidad;
    const precioUnitario = costoUnitario * (1 + ganancia / 100);
    const talleRange = getTalleRange(talle);
    const largestTalle = getLargestTalle(talleRange);
    const largestTalleMultiplier = talleFactor[largestTalle] || 0.7;
    const precioUnitarioConMayorTalle =
      (costoUnitario / talleMultiplier) *
      largestTalleMultiplier *
      (1 + ganancia / 100);
    return {
      costoUnitario: Number(costoUnitario.toFixed(2)),
      costoTotal: Number(costoTotal.toFixed(2)),
      precioUnitario: Number(precioUnitarioConMayorTalle.toFixed(2)),
    };
  };

  const handleGuardar = async () => {
    try {
      if (
        selectedAgregados.length === 0 &&
        !selectedPrenda &&
        !selectedTela &&
        !selectedTalle
      ) {
        toast.error("Complete al menos un campo o seleccione un agregado.");
        return;
      }

      const tallesToCreate = getTalleRange(selectedTalle);
      const nuevosArticulos = [];

      for (const talle of tallesToCreate) {
        const calculos = calculatePrice(
          selectedPrenda,
          talle,
          selectedTela,
          selectedAgregados
        ) || {
          costoUnitario: 0,
          costoTotal: 0,
          precioUnitario: 0,
        };

        const calculosMayorTalle = calculatePrice(
          selectedPrenda,
          getLargestTalle(tallesToCreate),
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
          talle: talle,
          tela: selectedTela,
          agregados: formatAgregadosForBackend(selectedAgregados),
          cantidad: Number(cantidad),
          costo: Number(calculos.costoUnitario),
          precio: Number(calculosMayorTalle.precioUnitario),
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
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(articuloData),
        });

        if (!articuloResponse.ok) {
          const errorData = await articuloResponse.json();
          throw new Error(errorData.message || "Error al guardar artículo");
        }

        const nuevoArticulo = await articuloResponse.json();
        nuevosArticulos.push(nuevoArticulo);

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
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
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
      }

      setArticulos((prev) => [...prev, ...nuevosArticulos]);
      resetForm();
      fetchArticulosDelPedido();
      toast.success("Artículo guardado correctamente.");
    } catch (error) {
      toast.error("Error al guardar el artículo: " + error.message);
    }
  };

  const resetForm = () => {
    setNumeroArticulo("");
    setCantidad(1);
    setSelectedPrenda("");
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
      setNumeroArticulo(articulo.numero_articulo || "");
      setSelectedPrenda(articulo.nombre || "");
      setSelectedTalle(articulo.talle || "");
      setSelectedTela(articulo.tela || "");
      const parsedAgregados = parseAgregadosFromBackend(articulo.agregados);
      setSelectedAgregados(parsedAgregados);
      setCantidad(articulo.cantidad || 1);
      setComentario(articulo.comentario || "");
      setGanancia(articulo.ganancia || 0);
      setPrioridad(articulo.prioridad || null);
      setIsEditing(true);
      setEditingArticulo(articulo);
      setAgregadoParaAgregar("");

      const response = await fetch(
        `${API_URL}/costos_articulo_produccion?articulo_id=${articulo.id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (!response.ok) throw new Error("Error al cargar costos existentes");
      const costosExistentes = await response.json();

      const nuevosCostos = {};
      costosExistentes.forEach((costo) => {
        nuevosCostos[costo.costo_id] = costo.cantidad;
      });

      setCostosCantidades(nuevosCostos);
    } catch (error) {
      toast.error("Error al cargar datos para edición: " + error.message);
      setSelectedAgregados([]);
      setAgregadoParaAgregar("");
    }
  };

  const handleUpdateArticulo = async () => {
    if (!editingArticulo) return;

    try {
      if (
        selectedAgregados.length === 0 &&
        !selectedPrenda &&
        !selectedTela &&
        !selectedTalle
      ) {
        toast.error("Complete al menos un campo o seleccione un agregado.");
        return;
      }

      const calculos = calculatePrice(
        selectedPrenda,
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
        talle: selectedTalle,
        tela: selectedTela,
        agregados: formatAgregadosForBackend(selectedAgregados),
        cantidad: Number(cantidad),
        costo: Number(calculos.costoUnitario),
        precio: Number(calculos.precioUnitario),
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
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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
        `${API_URL}/costos_articulo_produccion?articulo_id=${editingArticulo.id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (!existingCostsResponse.ok)
        throw new Error("Error al cargar costos existentes");
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
              const response = await fetch(
                `${API_URL}/costos_articulo_produccion/${existingCost.id}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                  body: JSON.stringify(costoData),
                }
              );
              if (!response.ok) throw new Error("Error al actualizar costo");
            } else {
              const response = await fetch(
                `${API_URL}/costos_articulo_produccion/${existingCost.id}`,
                {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );
              if (!response.ok) throw new Error("Error al eliminar costo");
            }
          } else if (costoData.cantidad > 0) {
            const response = await fetch(
              `${API_URL}/costos_articulo_produccion`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(costoData),
              }
            );
            if (!response.ok) throw new Error("Error al crear costo");
          }
        })
      );

      setArticulos((prev) =>
        prev.map((a) =>
          a.id === articuloActualizadoResp.id ? articuloActualizadoResp : a
        )
      );
      resetForm();
      fetchArticulosDelPedido();
      toast.success("Artículo actualizado correctamente.");
    } catch (error) {
      toast.error("Error al actualizar el artículo: " + error.message);
    }
  };

  const handleRemoveArticulo = async (articuloId) => {
    if (!window.confirm("¿Está seguro de que desea eliminar este artículo?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const etapasResponse = await fetch(
        `${API_URL}/etapas?articulos_id=${articuloId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!etapasResponse.ok) {
        const errorData = await etapasResponse.json();
        throw new Error(errorData.message || "Error al obtener etapas");
      }
      const etapas = await etapasResponse.json();

      await Promise.all(
        etapas.map(async (etapa) => {
          const deleteResponse = await fetch(`${API_URL}/etapas/${etapa.id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!deleteResponse.ok) {
            const errorData = await deleteResponse.json();
            throw new Error(
              errorData.message || `Error al eliminar etapa ${etapa.id}`
            );
          }
        })
      );

      const articuloResponse = await fetch(
        `${API_URL}/articulos/${articuloId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!articuloResponse.ok) {
        const errorData = await articuloResponse.json();
        throw new Error(errorData.message || "Error al eliminar el artículo");
      }

      setArticulos(articulos.filter((a) => a.id !== articuloId));
      toast.success("Artículo y sus etapas eliminados correctamente.");
    } catch (error) {
      toast.error(
        "Error al eliminar el artículo o sus etapas: " + error.message
      );
    }
  };

  const formatCurrency = (value) => {
    const num = Number(value) || 0;
    return num.toFixed(2);
  };

  return (
    <div className="p-6 mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
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
            className="flex items-center bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Volver a la lista de cotizaciones
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8 mx-auto">
        <h3 className="text-lg font-semibold mb-4">Agregar Artículo</h3>
        <ArticuloForm
          prendas={prendas}
          talles={talles}
          telas={telas}
          todosLosAgregados={todosLosAgregados}
          numeroArticulo={numeroArticulo}
          selectedPrenda={selectedPrenda}
          selectedTalle={selectedTalle}
          selectedTela={selectedTela}
          selectedAgregados={selectedAgregados}
          agregadoParaAgregar={agregadoParaAgregar}
          cantidad={cantidad}
          ganancia={ganancia}
          comentario={comentario}
          setNumeroArticulo={setNumeroArticulo}
          setSelectedPrenda={setSelectedPrenda}
          setSelectedTalle={setSelectedTalle}
          setSelectedTela={setSelectedTela}
          setSelectedAgregados={setSelectedAgregados}
          setAgregadoParaAgregar={setAgregadoParaAgregar}
          setCantidad={setCantidad}
          setGanancia={setGanancia}
          setComentario={setComentario}
          handleAgregarAgregado={handleAgregarAgregado}
          handleRemoveAgregado={handleRemoveAgregado}
          handleIncrementAgregado={handleIncrementAgregado}
          handleDecrementAgregado={handleDecrementAgregado}
        />

        <CostosProduccion
          costosProduccion={costosProduccion}
          costosCantidades={costosCantidades}
          handleCostoCantidadChange={handleCostoCantidadChange}
          calculatePrice={calculatePrice}
          selectedPrenda={selectedPrenda}
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
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Actualizar Artículo
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleGuardar}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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
        costosProduccion={costosProduccion}
        costosCantidades={costosCantidades}
        calculatePrice={calculatePrice}
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
              className={`mt-2 p-2 rounded-md shadow-sm ${
                sendStatus.success
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {sendStatus.message}
            </div>
          )}
          <div className="flex items-center">
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
