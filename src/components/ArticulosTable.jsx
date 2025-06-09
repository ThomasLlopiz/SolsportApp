import { useState } from "react";
import { toast } from "react-toastify";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const ArticulosTable = ({
  articulos,
  handleStartEdit,
  handleRemoveArticulo,
  formatCurrency,
  onPrioridadChange,
}) => {
  const [prioridades, setPrioridades] = useState({});
  const API_URL = import.meta.env.VITE_API_URL;

  // Definir talleFactor localmente (similar al usado en Cotizacion)
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

  // Función para obtener el multiplicador del talle más grande
  const getLargestTalleMultiplier = (talle) => {
    const talleRange = {
      "2 a 8": ["2", "4", "6", "8"],
      "10 a XS": ["10", "XS"],
      "S a XL": ["S", "M", "L", "XL"],
      "2XL a 3XL": ["2XL", "3XL"],
    };
    const talles = talleRange[talle] || [talle];
    const largestTalle = talles.reduce((largest, current) => {
      const currentIdx = Object.keys(talleFactor).indexOf(current);
      const largestIdx = Object.keys(talleFactor).indexOf(largest);
      return currentIdx > largestIdx ? current : largest;
    }, talles[0]);
    return talleFactor[largestTalle] || 0.7;
  };

  // Recalcular costoUnitario basado en los datos del artículo
  const calculateLocalCost = (articulo) => {
    let costoUnitario = 0;
    const talleMultiplier = talleFactor[articulo.talle] || 0.7;

    if (articulo.tela && articulo.nombre) {
      // Simulamos valores de tela y prenda basados en los logs (ajústalos según tu data real)
      const telaPrecio = 6200; // Valor de telaObj.precio del log
      const consumoPrenda = 1.01; // Valor de prendaObj.consumo del log
      costoUnitario += telaPrecio * consumoPrenda * talleMultiplier;
    }

    // Agregados (simplificado, asumimos que no hay datos de agregados en los logs)
    // Si tienes datos de agregados, intégralos aquí
    const agregadoPrices = 0; // Ajusta si hay agregados con precios

    costoUnitario += agregadoPrices;
    return Number(costoUnitario.toFixed(2));
  };

  // Calcular precio ajustado con el talle más grande
  const getAdjustedPrice = (articulo) => {
    if (!articulo.precio || !articulo.cantidad || !articulo.ganancia) return 0;
    const basePrice = articulo.precio || calculateLocalCost(articulo); // Usa precio si existe, sino calcula
    const currentMultiplier = talleFactor[articulo.talle] || 0.7;
    const largestMultiplier = getLargestTalleMultiplier(articulo.talle);
    const adjustedPrice = (basePrice / currentMultiplier) * largestMultiplier;
    return adjustedPrice * (1 + (articulo.ganancia || 0) / 100);
  };

  const total = articulos.reduce((sum, item) => {
    const adjustedPrice = getAdjustedPrice(item);
    return sum + adjustedPrice * item.cantidad;
  }, 0);

  const handlePrioridadChange = async (articuloId, value) => {
    try {
      const nuevaPrioridad = value ? Number(value) : null;
      setPrioridades((prev) => ({ ...prev, [articuloId]: nuevaPrioridad }));

      const response = await fetch(`${API_URL}/articulos/${articuloId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ prioridad: nuevaPrioridad }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar prioridad");
      }

      if (onPrioridadChange) {
        onPrioridadChange();
      }
      toast.success("Prioridad actualizada correctamente.");
    } catch (error) {
      toast.error("Error al actualizar prioridad: " + error.message);
    }
  };

  const handleConfirmadoChange = async (articuloId, confirmado) => {
    try {
      const response = await fetch(`${API_URL}/articulos/${articuloId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ confirmado }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar confirmado");
      }

      if (onPrioridadChange) {
        onPrioridadChange();
      }
      toast.success("Estado confirmado actualizado correctamente.");
    } catch (error) {
      toast.error("Error al actualizar confirmado: " + error.message);
    }
  };

  const articulosOrdenados = [...articulos].sort((a, b) => {
    if (a.prioridad === null && b.prioridad === null) return 0;
    if (a.prioridad === null) return 1;
    if (b.prioridad === null) return -1;
    return a.prioridad - b.prioridad;
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Artículos de la cotización</h3>
        <div className="text-xl font-bold">
          Total: {typeof total === "number" ? total.toFixed(2) : "0.00"} $
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">N° Artículo</th>
              <th className="py-2 px-4 text-left">Prenda</th>
              <th className="py-2 px-4 text-left">Talle</th>
              <th className="py-2 px-4 text-left">Tela</th>
              <th className="py-2 px-4 text-left">Cantidad</th>
              <th className="py-2 px-4 text-left">Agregados</th>
              <th className="py-2 px-4 text-left">Costo Unitario</th>
              <th className="py-2 px-4 text-left">Costo Total</th>
              <th className="py-2 px-4 text-left">Ganancia</th>
              <th className="py-2 px-4 text-left">Precio Unitario</th>
              <th className="py-2 px-4 text-left">Precio Total</th>
              <th className="py-2 px-4 text-left">Prioridad</th>
              <th className="py-2 px-4 text-left">Confirmado</th>
              <th className="py-2 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {articulosOrdenados.length > 0 ? (
              articulosOrdenados.map((articulo) => (
                <tr
                  key={articulo.id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-2 px-4">{articulo.numero_articulo}</td>
                  <td className="py-2 px-4">{articulo.nombre}</td>
                  <td className="py-2 px-4">{articulo.talle}</td>
                  <td className="py-2 px-4">{articulo.tela}</td>
                  <td className="py-2 px-4">{articulo.cantidad}</td>
                  <td className="py-2 px-4">
                    {Array.isArray(articulo.agregados)
                      ? articulo.agregados.join(", ")
                      : articulo.agregados}
                  </td>
                  <td className="py-2 px-4">
                    {articulo.costo
                      ? formatCurrency(articulo.costo)
                      : formatCurrency(calculateLocalCost(articulo))}{" "}
                    $
                  </td>
                  <td className="py-2 px-4">
                    {articulo.costo
                      ? formatCurrency(articulo.costo * articulo.cantidad)
                      : formatCurrency(
                          calculateLocalCost(articulo) * articulo.cantidad
                        )}{" "}
                    $
                  </td>
                  <td className="py-2 px-4">
                    {articulo.ganancia ? `${articulo.ganancia}%` : "0%"}
                  </td>
                  <td className="py-2 px-4">
                    {formatCurrency(getAdjustedPrice(articulo))} $
                  </td>
                  <td className="py-2 px-4">
                    {formatCurrency(
                      getAdjustedPrice(articulo) * articulo.cantidad
                    )}{" "}
                    $
                  </td>
                  <td className="py-2 px-4">
                    <select
                      value={
                        prioridades[articulo.id] ?? articulo.prioridad ?? ""
                      }
                      onChange={(e) =>
                        handlePrioridadChange(articulo.id, e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    >
                      <option value="">Sin prioridad</option>
                      {[...Array(20)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={articulo.confirmado || false}
                        onChange={(e) =>
                          handleConfirmadoChange(articulo.id, e.target.checked)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </td>
                  <td className="py-2 px-4 text-center flex justify-center space-x-2">
                    <button
                      onClick={() => handleStartEdit(articulo)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Editar"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleRemoveArticulo(articulo.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Eliminar"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="14" className="py-4 text-center text-gray-500">
                  No hay artículos en este pedido
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ArticulosTable;
