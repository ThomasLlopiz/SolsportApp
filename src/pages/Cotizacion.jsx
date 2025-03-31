import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export const Cotizacion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { id: pedidoId } = useParams();
  const [prendas] = useState([
    "Buzo",
    "Remera",
    "Campera",
    "Pantalones",
    "Chombas",
  ]);
  const [talles] = useState(["XS", "S", "M", "L", "XL", "XXL", "XXXL"]);
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
  const [articulos, setArticulos] = useState([]);
  const [editingArticulo, setEditingArticulo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [costosCantidades, setCostosCantidades] = useState({});

  const API_URL = import.meta.env.VITE_API_URL;

  const handlePrendaChange = (e) => setSelectedPrenda(e.target.value);
  const handleTalleChange = (e) => setSelectedTalle(e.target.value);
  const handleTelaChange = (e) => setSelectedTela(e.target.value);
  const handleAgregadoChange = (e) => setAgregadoParaAgregar(e.target.value);
  const handleNumeroArticuloChange = (e) => setNumeroArticulo(e.target.value);
  const handleCantidadChange = (e) => setCantidad(e.target.value);

  const handleCostoCantidadChange = (costoId, value) => {
    setCostosCantidades({
      ...costosCantidades,
      [costoId]: value ? parseInt(value) : 0,
    });
  };

  useEffect(() => {
    fetchPedido();
    fetchAgregados();
    fetchTelas();
    fetchArticulosDelPedido();
    fetchCostosProduccion();
  }, [pedidoId]);

  useEffect(() => {
    // Inicializar las cantidades de costos en 0 cuando se cargan los costos
    if (costosProduccion.length > 0) {
      const initialCostos = {};
      costosProduccion.forEach((costo) => {
        initialCostos[costo.id] = costosCantidades[costo.id] || 0;
      });
      setCostosCantidades(initialCostos);
    }
  }, [costosProduccion]);

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

  const handleBackClick = () => {
    navigate(`/cotizador`);
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

  const calculatePrice = (prenda, talle, tela, agregados, cant) => {
    if (!tela) return 0;

    const telaObj = telas.find((t) => t.nombre === tela);
    const basePrice = telaObj ? telaObj.precio : 0;
    const talleFactor = {
      XS: 0.3,
      S: 0.4,
      M: 0.5,
      L: 0.6,
      XL: 0.7,
      XXL: 0.7,
      XXXL: 0.7,
    };
    const tallePrice = talleFactor[talle] || 0;

    const agregadoPrices = agregados.reduce((sum, agregado) => {
      const agregadoData = todosLosAgregados.find((a) => a.nombre === agregado);
      return sum + (agregadoData ? agregadoData.precio : 0);
    }, 0);

    // Calcular costos de producción
    const costosTotal = costosProduccion.reduce((sum, costo) => {
      const cantidad = costosCantidades[costo.id] || 0;
      return sum + costo.precio * cantidad;
    }, 0);

    return (basePrice * (1 + tallePrice) + agregadoPrices + costosTotal) * cant;
  };

  const handleGuardar = async () => {
    if (!selectedPrenda || !selectedTalle || !selectedTela || !numeroArticulo) {
      alert("Por favor complete todos los campos obligatorios");
      return;
    }

    const precio = calculatePrice(
      selectedPrenda,
      selectedTalle,
      selectedTela,
      selectedAgregados,
      cantidad
    );

    // Preparar los costos con sus cantidades para guardar
    const costosConCantidades = costosProduccion
      .filter((costo) => costosCantidades[costo.id] > 0)
      .map((costo) => ({
        costo_id: costo.id,
        nombre: costo.nombre,
        cantidad: costosCantidades[costo.id],
        precio_unitario: costo.precio,
      }));

    const articuloData = {
      numero_articulo: numeroArticulo,
      nombre: selectedPrenda,
      talle: selectedTalle,
      tela: selectedTela,
      agregados: selectedAgregados,
      costos_produccion: costosConCantidades,
      cantidad: cantidad,
      precio: precio,
      pedidos_id: pedidoId,
    };

    try {
      const response = await fetch(`${API_URL}/articulos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(articuloData),
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${responseText}`);
      }

      const nuevoArticulo = JSON.parse(responseText);
      setArticulos([...articulos, nuevoArticulo]);
      resetForm();
    } catch (error) {
      console.error("Error al guardar el artículo:", error);
      alert("Error al guardar el artículo: " + error.message);
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
    setIsEditing(false);
    setEditingArticulo(null);

    const resetCostos = {};
    costosProduccion.forEach((costo) => {
      resetCostos[costo.id] = 0;
    });
    setCostosCantidades(resetCostos);
  };

  const handleStartEdit = (articulo) => {
    setNumeroArticulo(articulo.numero_articulo);
    setSelectedPrenda(articulo.prenda);
    setSelectedTalle(articulo.talle);
    setSelectedTela(articulo.tela);
    setSelectedAgregados([...articulo.agregados]);
    setCantidad(articulo.cantidad);
    setIsEditing(true);
    setEditingArticulo(articulo);

    if (articulo.costos_produccion && articulo.costos_produccion.length > 0) {
      const costosEdit = {};
      articulo.costos_produccion.forEach((costo) => {
        costosEdit[costo.costo_id] = costo.cantidad;
      });
      setCostosCantidades(costosEdit);
    }
  };

  const handleUpdateArticulo = async () => {
    if (!editingArticulo) return;

    const precio = calculatePrice(
      selectedPrenda,
      selectedTalle,
      selectedTela,
      selectedAgregados,
      cantidad
    );

    const costosConCantidades = costosProduccion
      .filter((costo) => costosCantidades[costo.id] > 0)
      .map((costo) => ({
        costo_id: costo.id,
        nombre: costo.nombre,
        cantidad: costosCantidades[costo.id],
        precio_unitario: costo.precio,
      }));

    const articuloActualizado = {
      ...editingArticulo,
      numero_articulo: numeroArticulo,
      prenda: selectedPrenda,
      talle: selectedTalle,
      tela: selectedTela,
      agregados: selectedAgregados,
      costos_produccion: costosConCantidades,
      cantidad: cantidad,
      precio: precio,
    };

    try {
      const response = await fetch(
        `${API_URL}/articulos/${editingArticulo.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(articuloActualizado),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar el artículo");
      }

      const articuloActualizadoResp = await response.json();
      setArticulos(
        articulos.map((a) =>
          a.id === articuloActualizado.id ? articuloActualizadoResp : a
        )
      );
      resetForm();
    } catch (error) {
      console.error("Error al actualizar el artículo:", error);
      alert("Error al actualizar el artículo");
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
      alert("Error al eliminar el artículo");
    }
  };

  const total = articulos.reduce((sum, item) => {
    const precio = parseFloat(item.precio) || 0;
    return sum + precio;
  }, 0);

  if (!pedido) {
    return (
      <div className="text-center mt-8">
        <p>Cargando el pedido...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className=" mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl text-left font-semibold">
            Pedido #{pedido.numero_pedido}
          </h2>
          <p className="text-gray-600 text-xl">
            Cliente: {pedido.nombre_cliente}
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

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Agregar Artículo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            {/* Numero articulo */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de Artículo
            </label>
            <input
              type="number"
              value={numeroArticulo}
              onChange={handleNumeroArticuloChange}
              className="w-full p-2 border border-gray-300 rounded"
              min="1"
              required
            />
          </div>
          {/* Prenda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prenda
            </label>
            <select
              value={selectedPrenda}
              onChange={handlePrendaChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Seleccionar prenda</option>
              {prendas.map((prenda, index) => (
                <option key={index} value={prenda}>
                  {prenda}
                </option>
              ))}
            </select>
          </div>
          {/* Talle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Talle
            </label>
            <select
              value={selectedTalle}
              onChange={handleTalleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Seleccionar talle</option>
              {talles.map((talle, index) => (
                <option key={index} value={talle}>
                  {talle}
                </option>
              ))}
            </select>
          </div>
          {/* Tela */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tela
            </label>
            <select
              value={selectedTela}
              onChange={handleTelaChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Seleccionar tela</option>
              {telas.map((tela, index) => (
                <option key={index} value={tela.nombre}>
                  {tela.nombre}
                </option>
              ))}
            </select>
          </div>
          {/* Cantidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cantidad
            </label>
            <input
              type="number"
              value={cantidad}
              onChange={handleCantidadChange}
              className="w-full p-2 border border-gray-300 rounded"
              min="1"
              required
            />
          </div>
          {/* Agregados */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Agregados
            </label>
            <div className="flex">
              <select
                value={agregadoParaAgregar}
                onChange={handleAgregadoChange}
                className="flex-1 p-2 border border-gray-300 rounded"
              >
                <option value="">Seleccionar agregado</option>
                {todosLosAgregados
                  .filter(
                    (agregado) => !selectedAgregados.includes(agregado.nombre)
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
                className="ml-2 bg-blue-500 text-white p-2 rounded"
              >
                +
              </button>
            </div>
          </div>
          {/* Agregados seleccionados */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Agregados seleccionados
            </label>
            <div className="border border-gray-300 rounded p-2 min-h-12">
              {selectedAgregados.length > 0 ? (
                <ul className="space-y-1">
                  {selectedAgregados.map((agregado, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span>{agregado}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAgregado(agregado)}
                        className="text-red-500"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">Ningún agregado seleccionado</p>
              )}
            </div>
          </div>

          {/* Sección de Costos de Producción */}
          <div className="col-span-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Costos de Producción
            </label>
            <div className="border border-gray-300 rounded p-2">
              {costosProduccion.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="py-1 px-2">Costo</th>
                      <th className="py-1 px-2">Precio Unitario</th>
                      <th className="py-1 px-2">Cantidad</th>
                      <th className="py-1 px-2">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {costosProduccion.map((costo) => (
                      <tr key={costo.id} className="border-t border-gray-200">
                        <td className="py-1 px-2">{costo.nombre}</td>
                        <td className="py-1 px-2">
                          {costo.precio.toFixed(2)} $
                        </td>
                        <td className="py-1 px-2">
                          <input
                            type="number"
                            min="0"
                            value={costosCantidades[costo.id]}
                            onChange={(e) =>
                              handleCostoCantidadChange(
                                costo.id,
                                e.target.value
                              )
                            }
                            className="w-20 p-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="py-1 px-2">
                          {(
                            costo.precio * (costosCantidades[costo.id] || 0)
                          ).toFixed(2)}{" "}
                          $
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-400">
                  No hay costos de producción disponibles
                </p>
              )}
            </div>
          </div>

          <div className="flex items-end gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">
                Costo Unitario:
              </p>
              <p className="text-lg font-semibold">
                {calculatePrice(
                  selectedPrenda,
                  selectedTalle,
                  selectedTela,
                  selectedAgregados,
                  1
                ).toFixed(2)}{" "}
                $
              </p>
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">Precio total:</p>
              <p className="text-lg font-semibold">
                {calculatePrice(
                  selectedPrenda,
                  selectedTalle,
                  selectedTela,
                  selectedAgregados,
                  cantidad
                ).toFixed(2)}{" "}
                $
              </p>
            </div>
          </div>
        </div>

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

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Artículos del Pedido</h3>
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
                <th className="py-2 px-4 text-left">Costos Producción</th>
                <th className="py-2 px-4 text-left">Costo Unitario</th>
                <th className="py-2 px-4 text-left">Costo Total</th>
                <th className="py-2 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {articulos.length > 0 ? (
                articulos.map((articulo) => (
                  <tr
                    key={articulo.id}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-2 px-4">{articulo.numero_articulo}</td>
                    <td className="py-2 px-4">{articulo.prenda}</td>
                    <td className="py-2 px-4">{articulo.talle}</td>
                    <td className="py-2 px-4">{articulo.tela}</td>
                    <td className="py-2 px-4">{articulo.cantidad}</td>
                    <td className="py-2 px-4">
                      {Array.isArray(articulo.agregados)
                        ? articulo.agregados.join(", ")
                        : articulo.agregados}
                    </td>
                    <td className="py-2 px-4">
                      {articulo.costos_produccion &&
                      articulo.costos_produccion.length > 0 ? (
                        <ul>
                          {articulo.costos_produccion.map((costo, i) => (
                            <li key={i}>
                              {costo.nombre} ({costo.cantidad} x{" "}
                              {costo.precio_unitario.toFixed(2)})
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "Ninguno"
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {(
                        parseFloat(articulo.precio) / articulo.cantidad
                      ).toFixed(2)}{" "}
                      $
                    </td>
                    <td className="py-2 px-4">
                      {parseFloat(articulo.precio).toFixed(2)} $
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
                  <td colSpan="10" className="py-4 text-center text-gray-500">
                    No hay artículos en este pedido
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
