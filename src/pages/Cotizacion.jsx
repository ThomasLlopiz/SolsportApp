import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export const Cotizacion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pedidoId } = useParams();
  const [prendas] = useState(["Buzo", "Remera", "Campera", "Pantalones", "Chombas"]);
  const [talles] = useState(["XS", "S", "M", "L", "XL", "XXL", "XXXL"]);
  const [pedido, setPedido] = useState(null);
  const [todosLosAgregados, setTodosLosAgregados] = useState([]);
  const [telas, setTelas] = useState([]);
  const [selectedPrenda, setSelectedPrenda] = useState("");
  const [selectedTalle, setSelectedTalle] = useState("");
  const [selectedTela, setSelectedTela] = useState("");
  const [selectedAgregados, setSelectedAgregados] = useState([]);
  const [agregadoParaAgregar, setAgregadoParaAgregar] = useState("");
  const [combinaciones, setCombinaciones] = useState([]);
  const [numeroArticulo, setNumeroArticulo] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [articulosExistentes, setArticulosExistentes] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;
  const handlePrendaChange = (e) => setSelectedPrenda(e.target.value);
  const handleTalleChange = (e) => setSelectedTalle(e.target.value);
  const handleTelaChange = (e) => setSelectedTela(e.target.value);
  const handleAgregadoChange = (e) => setAgregadoParaAgregar(e.target.value);
  const handleNumeroArticuloChange = (e) => setNumeroArticulo(e.target.value);
  const handleCantidadChange = (e) => setCantidad(e.target.value);

  useEffect(() => {
    fetchPedido();
    fetchAgregados();
    fetchTelas();
    fetchArticulosDelPedido();
  }, [pedidoId]);

  useEffect(() => {
    const storedCombinaciones = JSON.parse(localStorage.getItem("combinaciones"));
    if (storedCombinaciones) {
      setCombinaciones(storedCombinaciones);
    }
  }, []);

  const fetchAgregados = async () => {
    try {
      const response = await fetch(`${API_URL}/agregados`);
      const data = await response.json();
      setTodosLosAgregados(data);
    } catch (error) {
      console.error("Error fetching agregados", error);
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
      const response = await fetch(`${API_URL}/articulos?pedidos_id=${pedidoId}`);
      const data = await response.json();
      setArticulosExistentes(data);
    } catch (error) {
      console.error("Error fetching articulos del pedido", error);
    }
  };

  const saveCombinacionesToLocalStorage = (combinaciones) => {
    localStorage.setItem("combinaciones", JSON.stringify(combinaciones));
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

  const calculatePrice = () => {
    if (!selectedTela) return 0;

    const tela = telas.find((t) => t.nombre === selectedTela);
    const basePrice = tela ? tela.precio : 0;
    const talleFactor = {
      XS: 0.3,
      S: 0.4,
      M: 0.5,
      L: 0.6,
      XL: 0.7,
      XXL: 0.7,
      XXXL: 0.7,
    };
    const tallePrice = talleFactor[selectedTalle] || 0;

    const agregadoPrices = selectedAgregados.reduce((sum, agregado) => {
      const agregadoData = todosLosAgregados.find((a) => a.nombre === agregado);
      return sum + (agregadoData ? agregadoData.precio : 0);
    }, 0);

    return (basePrice * (1 + tallePrice) + agregadoPrices) * cantidad;
  };

  const handleGuardar = () => {
    if (
      selectedPrenda &&
      selectedTalle &&
      selectedTela &&
      selectedAgregados.length > 0 &&
      numeroArticulo
    ) {
      const articulo = {
        numero_articulo: numeroArticulo,
        prenda: selectedPrenda,
        talle: selectedTalle,
        tela: selectedTela,
        agregados: selectedAgregados,
        cantidad: cantidad,
        precio: calculatePrice(),
        pedidos_id: pedidoId,
      };

      const newCombinaciones = [...combinaciones, articulo];
      setCombinaciones(newCombinaciones);
      saveCombinacionesToLocalStorage(newCombinaciones);

      setNumeroArticulo("");
      setCantidad(1);
      setSelectedPrenda("");
      setSelectedTalle("");
      setSelectedTela("");
      setSelectedAgregados([]);
      setAgregadoParaAgregar("");
    }
  };

  const total = [...articulosExistentes, ...combinaciones].reduce((sum, item) => {
    return sum + (item.precio || 0);
  }, 0);

  return (
    <div>
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold">Pedido #{pedido.numero_pedido}</h2>
      </div>

      <table className="w-3/4 mx-auto bg-white">
        <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <tr>
            <th className="py-3 px-6 text-left">Número de Artículo</th>
            <th className="py-3 px-6 text-left">Prenda</th>
            <th className="py-3 px-6 text-left">Talle</th>
            <th className="py-3 px-6 text-left">Tela</th>
            <th className="py-3 px-6 text-left">Cantidad</th>
            <th className="py-3 px-6 text-left">Agregar</th>
            <th className="py-3 px-6 text-left">Agregado(s) Seleccionado(s)</th>
            <th className="py-3 px-6 text-left">Precio</th>
            <th className="py-3 px-6 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          <tr>
            <td>
              <input
                placeholder="Número de Artículo"
                type="number"
                value={numeroArticulo}
                onChange={handleNumeroArticuloChange}
                className="py-2 px-4 border border-gray-300 rounded"
                min="1"
                required
              />
            </td>
            <td>
              <select
                value={selectedPrenda}
                onChange={handlePrendaChange}
                className="py-2 px-4 border border-gray-300 rounded"
              >
                <option value="">Seleccionar prenda</option>
                {prendas.map((prenda, index) => (
                  <option key={index} value={prenda}>
                    {prenda}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <select
                value={selectedTalle}
                onChange={handleTalleChange}
                className="py-2 px-4 border border-gray-300 rounded"
              >
                <option value="">Seleccionar talle</option>
                {talles.map((talle, index) => (
                  <option key={index} value={talle}>
                    {talle}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <select
                value={selectedTela}
                onChange={handleTelaChange}
                className="py-2 px-4 border border-gray-300 rounded"
              >
                <option value="">Seleccionar tela</option>
                {telas.map((tela, index) => (
                  <option key={index} value={tela.nombre}>
                    {tela.nombre}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <input
                type="number"
                value={cantidad}
                onChange={handleCantidadChange}
                className="py-2 px-4 border border-gray-300 rounded"
                min="1"
                required
              />
            </td>
            <td className="flex flex-col gap-3">
              <select
                value={agregadoParaAgregar}
                onChange={handleAgregadoChange}
                className="py-2 px-4 border border-gray-300 rounded mt-12"
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
                onClick={handleAgregarAgregado}
                className="py-2 px-4 bg-blue-500 text-white rounded"
              >
                Agregar
              </button>
            </td>
            <td>
              <ul className="list-disc pl-4 font-semibold mt-10 mr-3">
                {selectedAgregados.map((agregado, index) => (
                  <li key={index} className="flex justify-between items-center">
                    {agregado}
                    <button
                      onClick={() => handleRemoveAgregado(agregado)}
                      className="ml-2 text-red-500"
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            </td>
            <td>
              <p className="py-2 px-4">{calculatePrice().toFixed(2)} USD</p>
            </td>
            <td>
              <button
                onClick={handleGuardar}
                className="py-2 px-4 bg-blue-500 text-white rounded"
              >
                Guardar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mt-8">
        <div className="flex justify-between w-3/4 mx-auto">
          <h2 className="text-lg font-semibold">Prendas Guardadas</h2>
          <button
            onClick={handleBackClick}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition flex items-center"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Volver
          </button>
        </div>

        <table className="w-11/12 mx-auto mt-4 bg-white">
          <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 text-left">Número Artículo</th>
              <th className="py-3 px-6 text-left">Prenda</th>
              <th className="py-3 px-6 text-left">Talle</th>
              <th className="py-3 px-6 text-left">Tela</th>
              <th className="py-3 px-6 text-left">Cantidad</th>
              <th className="py-3 px-6 text-left">Agregado(s)</th>
              <th className="py-3 px-6 text-left">Precio</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {/* Artículos existentes del pedido */}
            {articulosExistentes.map((articulo, index) => (
              <tr key={`existente-${index}`}>
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
                  {/* Aquí puedes calcular el precio si no lo tienes en la base de datos */}
                  {articulo.precio ? articulo.precio.toFixed(2) + " USD" : "N/A"}
                </td>
              </tr>
            ))}

            {/* Combinaciones nuevas (locales) */}
            {combinaciones.map((combinacion, index) => (
              <tr key={`nuevo-${index}`}>
                <td className="py-2 px-4">{combinacion.numero_articulo}</td>
                <td className="py-2 px-4">{combinacion.prenda}</td>
                <td className="py-2 px-4">{combinacion.talle}</td>
                <td className="py-2 px-4">{combinacion.tela}</td>
                <td className="py-2 px-4">{combinacion.cantidad}</td>
                <td className="py-2 px-4">
                  {combinacion.agregados.join(", ")}
                </td>
                <td className="py-2 px-4">
                  {combinacion.precio.toFixed(2)} USD
                </td>
              </tr>
            ))}

            <tr>
              <td colSpan="6" className="py-2 px-4 font-semibold text-right">
                Total
              </td>
              <td className="py-2 px-4 font-semibold">
                {total.toFixed(2)} USD
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
