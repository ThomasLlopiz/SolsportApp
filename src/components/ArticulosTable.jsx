import { useState } from "react";
import { toast } from "react-toastify";

const ArticulosTable = ({
  articulos,
  handleStartEdit,
  handleRemoveArticulo,
  formatCurrency,
  onPrioridadChange,
}) => {
  const [prioridades, setPrioridades] = useState({});
  const API_URL = import.meta.env.VITE_API_URL;

  const total = articulos.reduce((sum, item) => {
    return (
      sum +
      (item.precio
        ? (item.precio * item.cantidad * item.ganancia) / 100 +
          item.precio * item.cantidad
        : 0)
    );
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
              <th className="py-2 px-4 text-left">Precio Total</th>
              <th className="py-2 px-4 text-left">Prioridad</th>
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
                    {articulo.precio ? formatCurrency(articulo.precio) : "0.00"} $
                  </td>
                  <td className="py-2 px-4">
                    {articulo.precio
                      ? formatCurrency(articulo.precio * articulo.cantidad)
                      : "0.00"} $
                  </td>
                  <td className="py-2 px-4">
                    {articulo.ganancia ? `${articulo.ganancia}%` : "0%"}
                  </td>
                  <td className="py-2 px-4">
                    {articulo.precio
                      ? formatCurrency(
                          (articulo.precio *
                            articulo.cantidad *
                            articulo.ganancia) /
                            100 +
                            articulo.precio * articulo.cantidad
                        )
                      : "0.00"} $
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
                  <td className="py-2 px-4 text-center">
                    <button
                      onClick={() => handleStartEdit(articulo)}
                      className="text-blue-500 hover:text-blue-700 mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleRemoveArticulo(articulo.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="py-4 text-center text-gray-500">
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