import React, { useState, useEffect } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

export const Cotizacion = () => {
  const navigate = useNavigate();
  const [prendas] = useState(["Buzo", "Remera", "Campera", "Pantalones", "Chombas"]);
  const [talles] = useState(["XS", "S", "M", "L", "XL", "XXL", "XXXL"]);
  const [todosLosAgregados, setTodosLosAgregados] = useState([]);
  const [telas, setTelas] = useState([]);
  const [selectedPrenda, setSelectedPrenda] = useState("");
  const [selectedTalle, setSelectedTalle] = useState("");
  const [selectedTela, setSelectedTela] = useState("");
  const [selectedAgregados, setSelectedAgregados] = useState([]);
  const [agregadoParaAgregar, setAgregadoParaAgregar] = useState("");
  const [combinaciones, setCombinaciones] = useState([]);

  useEffect(() => {
    const fetchAgregados = async () => {
      try {
        const response = await axios.get("/agregados");
        setTodosLosAgregados(response.data.map((item) => item.nombre));
      } catch (error) {
        console.error("Error fetching agregados", error);
      }
    };

    const fetchTelas = async () => {
      try {
        const response = await axios.get("/telas");
        setTelas(response.data.map((item) => item.nombre));
      } catch (error) {
        console.error("Error fetching telas", error);
      }
    };

    fetchAgregados();
    fetchTelas();
  }, []);

  const handlePrendaChange = (e) => setSelectedPrenda(e.target.value);
  const handleTalleChange = (e) => setSelectedTalle(e.target.value);
  const handleTelaChange = (e) => setSelectedTela(e.target.value);

  const handleAgregadoChange = (e) => {
    setAgregadoParaAgregar(e.target.value);
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

  const handleGuardar = () => {
    if (
      selectedPrenda &&
      selectedTalle &&
      selectedTela &&
      selectedAgregados.length > 0
    ) {
      setCombinaciones((prev) => [
        ...prev,
        {
          prenda: selectedPrenda,
          talle: selectedTalle,
          tela: selectedTela,
          agregados: selectedAgregados,
        },
      ]);
      setSelectedPrenda("");
      setSelectedTalle("");
      setSelectedTela("");
      setSelectedAgregados([]);
      setAgregadoParaAgregar("");
    }
  };

  return (
    <div>
      <table className="w-3/4 mx-auto bg-white">
        <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <tr>
            <th className="py-3 px-6 text-left">Prenda</th>
            <th className="py-3 px-6 text-left">Talle</th>
            <th className="py-3 px-6 text-left">Tela</th>
            <th className="py-3 px-6 text-left">Agregar</th>
            <th className="py-3 px-6 text-left">Agregado(s) Seleccionado(s)</th>
            <th className="py-3 px-6 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          <tr>
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
                  <option key={index} value={tela}>
                    {tela}
                  </option>
                ))}
              </select>
            </td>
            <td className="flex flex-col gap-3">
              <select
                value={agregadoParaAgregar}
                onChange={handleAgregadoChange}
                className="py-2 px-4 border border-gray-300 rounded mt-12"
              >
                <option value="">Seleccionar agregado</option>
                {todosLosAgregados
                  .filter((agregado) => !selectedAgregados.includes(agregado))
                  .map((agregado, index) => (
                    <option key={index} value={agregado}>
                      {agregado}
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
          <h2 className="text-lg font-semibold">
            Prendas Guardadas
          </h2>
          <button
            onClick={handleBackClick}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition flex items-center"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Volver
          </button>
        </div>

        <table className="w-3/4 mx-auto mt-4 bg-white">
          <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 text-left">Prenda</th>
              <th className="py-3 px-6 text-left">Talle</th>
              <th className="py-3 px-6 text-left">Tela</th>
              <th className="py-3 px-6 text-left">Agregado(s)</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {combinaciones.map((combinacion, index) => (
              <tr key={index}>
                <td className="py-2 px-4">{combinacion.prenda}</td>
                <td className="py-2 px-4">{combinacion.talle}</td>
                <td className="py-2 px-4">{combinacion.tela}</td>
                <td className="py-2 px-4">
                  {combinacion.agregados.join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
 