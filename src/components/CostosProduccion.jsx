const CostosProduccion = ({
  costosProduccion,
  costosCantidades,
  handleCostoCantidadChange,
  calculatePrice,
  selectedPrenda,
  selectedColor,
  selectedTalle,
  selectedTela,
  selectedAgregados,
  cantidad,
}) => {
  const canCalculatePrice =
    selectedPrenda && selectedColor && selectedTalle && selectedTela;

  return (
    <div className="mt-4">
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
                {costosProduccion.map((costo) => {
                  const cantidadExistente = costosCantidades[costo.id] || 0;
                  return (
                    <tr key={costo.id} className="border-t border-gray-200">
                      <td className="py-1 px-2">{costo.nombre}</td>
                      <td className="py-1 px-2">{costo.precio.toFixed(2)} $</td>
                      <td className="py-1 px-2">
                        <input
                          type="number"
                          min="0"
                          value={cantidadExistente}
                          onChange={(e) =>
                            handleCostoCantidadChange(costo.id, e.target.value)
                          }
                          className="w-20 p-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="py-1 px-2">
                        {(costo.precio * cantidadExistente).toFixed(2)} $
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-400">
              No hay costos de producción disponibles
            </p>
          )}
        </div>
      </div>
      {/* --- CAMBIO: Actualizar cálculos con guardia y selectedColor --- */}
      <div className="flex items-end gap-4 mt-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">Costo Unitario:</p>
          <p className="text-lg font-semibold">
            {canCalculatePrice
              ? calculatePrice(
                  selectedPrenda,
                  selectedColor,
                  selectedTalle,
                  selectedTela,
                  selectedAgregados || []
                ).costoUnitario.toFixed(2)
              : "0.00"}
            $
          </p>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">Costo total:</p>
          <p className="text-lg font-semibold">
            {canCalculatePrice
              ? calculatePrice(
                  selectedPrenda,
                  selectedColor,
                  selectedTalle,
                  selectedTela,
                  selectedAgregados || []
                ).costoTotal.toFixed(2)
              : "0.00"}
            $
          </p>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">Precio total:</p>
          <p className="text-lg font-semibold">
            {canCalculatePrice
              ? (
                  calculatePrice(
                    selectedPrenda,
                    selectedColor,
                    selectedTalle,
                    selectedTela,
                    selectedAgregados || []
                  ).precioUnitario * cantidad
                ).toFixed(2)
              : "0.00"}
            $
          </p>
        </div>
      </div>
    </div>
  );
};

export default CostosProduccion;
