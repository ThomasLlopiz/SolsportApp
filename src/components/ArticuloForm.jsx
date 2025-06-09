import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

const ArticuloForm = ({
  prendas,
  talles,
  telas,
  todosLosAgregados,
  numeroArticulo,
  selectedPrenda,
  selectedTalle,
  selectedTela,
  selectedAgregados,
  agregadoParaAgregar,
  cantidad,
  ganancia,
  comentario,
  setNumeroArticulo,
  setSelectedPrenda,
  setSelectedTalle,
  setSelectedTela,
  setSelectedAgregados,
  setAgregadoParaAgregar,
  setCantidad,
  setGanancia,
  setComentario,
  handleAgregarAgregado,
  handleRemoveAgregado,
  handleIncrementAgregado,
  handleDecrementAgregado,
}) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex w-full gap-4">
        {/* Número de Artículo */}
        <div className="w-full">
          <label className="block text-gray-700">Número de Artículo</label>
          <input
            type="text"
            value={numeroArticulo}
            onChange={(e) => setNumeroArticulo(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        {/* PRENDA */}
        <div className="w-full">
          <label className="block text-gray-700">Prenda</label>
          <select
            value={selectedPrenda}
            onChange={(e) => setSelectedPrenda(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          >
            <option value="">Seleccione una prenda</option>
            {prendas.map((prenda) => (
              <option key={prenda.id} value={prenda.nombre} required>
                {prenda.nombre}
              </option>
            ))}
          </select>
        </div>
        {/* TALLE */}
        <div className="w-full">
          <label className="block text-gray-700">Talle</label>
          <select
            value={selectedTalle}
            onChange={(e) => setSelectedTalle(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          >
            <option value="">Seleccione un talle</option>
            {talles.map((talle) => (
              <option key={talle} value={talle}>
                {talle}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex w-full gap-4">
        {/* TELA */}
        <div className="w-full">
          <label className="block text-gray-700">Tela</label>
          <select
            value={selectedTela}
            onChange={(e) => setSelectedTela(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          >
            <option value="">Seleccione una tela</option>
            {telas.map((tela) => (
              <option key={tela.id} value={tela.nombre}>
                {tela.nombre}
              </option>
            ))}
          </select>
        </div>
        {/* GANANCIA */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ganancia (%)
          </label>
          <input
            type="number"
            value={ganancia}
            onChange={(e) =>
              setGanancia(Math.min(parseFloat(e.target.value), 100))
            }
            className="w-full p-2 border border-gray-300 rounded"
            min="0"
            max="100"
            step="0.1"
          />
        </div>
        {/* CANTIDAD */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cantidad Total
          </label>
          <input
            type="number"
            value={cantidad}
            onChange={(e) =>
              setCantidad(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="w-full p-2 border border-gray-300 rounded"
            min="1"
            required
          />
        </div>
      </div>
      <div className="flex w-full gap-4">
        {/* AGREGADOS */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Agregados
          </label>
          <div className="flex">
            <select
              value={agregadoParaAgregar || ""}
              onChange={(e) => setAgregadoParaAgregar(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded"
            >
              <option value="">Seleccionar agregado</option>
              {todosLosAgregados
                .filter(
                  (agregado) =>
                    !selectedAgregados.some(
                      (sel) => sel.nombre === agregado.nombre
                    )
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
              className="ml-2 bg-blue-500 text-white py-2 px-4 rounded"
            >
              +
            </button>
          </div>
        </div>
        {/* AGREGADOS SELECCIONADOS */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Agregados seleccionados
          </label>
          <div className="border border-gray-300 rounded py-2 px-4">
            {selectedAgregados.length > 0 ? (
              <ul className="space-y-1">
                {selectedAgregados.map((agregado, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>
                      {agregado.nombre} (x{agregado.count})
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleIncrementAgregado(agregado.nombre)}
                        className="text-green-500 hover:text-green-700"
                      >
                        <PlusIcon className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDecrementAgregado(agregado.nombre)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <MinusIcon className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveAgregado(agregado.nombre)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">Ningún agregado seleccionado</p>
            )}
          </div>
        </div>
        {/* COMENTARIO */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700">
            Comentario
          </label>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            rows="3"
            placeholder="Ingrese un comentario (opcional)"
          />
        </div>
      </div>
    </div>
  );
};

export default ArticuloForm;
