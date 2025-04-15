const ArticuloForm = ({
  prendas,
  colores, // New prop
  talles,
  telas,
  todosLosAgregados,
  numeroArticulo,
  selectedPrenda,
  selectedColor, // New prop
  selectedTalle,
  selectedTela,
  selectedAgregados,
  agregadoParaAgregar,
  cantidad,
  ganancia,
  comentario,
  setNumeroArticulo,
  setSelectedPrenda,
  setSelectedColor, // New prop
  setSelectedTalle,
  setSelectedTela,
  setSelectedAgregados,
  setAgregadoParaAgregar,
  setCantidad,
  setGanancia,
  setComentario,
  handleAgregarAgregado,
  handleRemoveAgregado,
}) => {
  return (
    <div className="flex flex-col gap-4 w-">
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
              <option key={prenda.id} value={prenda.nombre}>
                {prenda.nombre}
              </option>
            ))}
          </select>
        </div>
        {/*  COLOR */}
        <div className="w-full">
          <label className="block text-gray-700">Color</label>
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          >
            <option value="">Seleccione un color</option>
            {colores.map((color) => (
              <option key={color.id} value={color.nombre}>
                {color.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex w-full gap-4">
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
            min=""
            max="100"
            step="0.1"
          />
        </div>
      </div>
      <div className="flex w-full gap-4">
        {/* CANTIDAD */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cantidad
          </label>
          <input
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            min="1"
            required
          />
        </div>
        {/* AGREGADOS */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Agregados
          </label>
          <div className="flex">
            <select
              value={agregadoParaAgregar}
              onChange={(e) => setAgregadoParaAgregar(e.target.value)}
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
      </div>
      {/* COMENTARIO */}
      <div className="col-span-4">
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
  );
};

export default ArticuloForm;
