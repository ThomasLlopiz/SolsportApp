import { CreateEtapaModal } from "./CreateEtapaModal";

export const EditArticuloModal = ({
  isEditModalOpen,
  setIsEditModalOpen,
  editArticulo,
  setEditArticulo,
  prendas,
  talles,
  telas,
  todosLosAgregados,
  agregadoParaAgregar,
  setAgregadoParaAgregar,
  handleAgregarAgregado,
  handleRemoveAgregado,
  pedidoId,
  fetchArticulos,
}) => {
  const API_URL = import.meta.env.VITE_API_URL;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setEditArticulo({
        ...editArticulo,
        ruta: file,
      });
    }
  };

  const handleUpdateArticulo = async (e) => {
    e.preventDefault();

    // Verifica si el número de artículo se está actualizando correctamente
    console.log("Artículos antes de enviar:", editArticulo);

    try {
      const response = await fetch(`${API_URL}/articulos/${editArticulo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editArticulo,
          tela: editArticulo.tela,
          pedidos_id: pedidoId,
          agregados: editArticulo.agregados.map((agregado) => agregado.nombre),
        }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el artículo");
      }

      setEditArticulo(null);
      setIsEditModalOpen(false);
      fetchArticulos(); // Refresca la lista de artículos
    } catch (error) {
      console.error("Error updating articulo", error);
    }
  };

  return (
    isEditModalOpen &&
    editArticulo && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-xl font-semibold mb-4">Editar Artículo</h2>
          <CreateEtapaModal pedidoId={pedidoId} articuloId={editArticulo.id} />
          <form onSubmit={handleUpdateArticulo}>
            {/* Número de Artículo */}
            <div className="mb-4">
              <label className="block text-gray-700">Número de Artículo</label>
              <input
                type="number"
                value={editArticulo.numero_articulo}
                onChange={(e) =>
                  setEditArticulo({
                    ...editArticulo,
                    numero_articulo: e.target.value,
                  })
                }
                className="w-full border border-gray-300 p-2 rounded"
                min="1"
                required
              />
            </div>
            {/* Input para seleccionar archivo */}
            <div className="mb-4">
              <label htmlFor="ruta" className="block text-gray-700">
                Ficha Técnica (PDF)
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
              {editArticulo.ruta && (
                <p className="text-sm text-gray-500 mt-1">
                  Archivo actual:{" "}
                  {typeof editArticulo.ruta === "string"
                    ? editArticulo.ruta.split("/").pop()
                    : editArticulo.ruta.name}
                </p>
              )}
            </div>
            {/* Select para Prenda */}
            <select
              value={editArticulo.nombre}
              onChange={(e) =>
                setEditArticulo({
                  ...editArticulo,
                  nombre: e.target.value,
                })
              }
              className="w-full border border-gray-300 p-2 rounded mb-4"
              required
            >
              <option value="">Selecciona una prenda</option>
              {prendas.map((prenda, index) => {
                return (
                  <option key={`prenda-${index}`} value={prenda}>
                    {prenda}
                  </option>
                );
              })}
            </select>
            {/* Select para Talle */}
            <select
              value={editArticulo.talle}
              onChange={(e) =>
                setEditArticulo({
                  ...editArticulo,
                  talle: e.target.value,
                })
              }
              className="w-full border border-gray-300 p-2 rounded mb-4"
              required
            >
              <option value="">Selecciona un talle</option>
              {talles.map((talle, index) => {
                const key = talle ? `talle-${talle}` : `default-talle-${index}`;
                return (
                  <option key={key} value={talle}>
                    {talle}
                  </option>
                );
              })}
            </select>
            {/* Select para Tela */}
            <select
              value={editArticulo.tela}
              onChange={(e) =>
                setEditArticulo({
                  ...editArticulo,
                  tela: e.target.value,
                })
              }
              className="w-full border border-gray-300 p-2 rounded mb-4"
              required
            >
              <option value="">Selecciona una tela</option>
              {telas.map((tela, index) => {
                const key =
                  tela.id && tela.nombre
                    ? `${tela.id}-${tela.nombre}`
                    : `default-tela-${index}`;
                return (
                  <option key={key} value={tela.nombre}>
                    {tela.nombre}
                  </option>
                );
              })}
            </select>
            {/* Agregados */}
            <select
              value={agregadoParaAgregar || ""}
              onChange={(e) => setAgregadoParaAgregar(e.target.value)}
              className="py-2 px-4 border border-gray-300 rounded mb-4 w-3/4"
            >
              <option value="">Seleccionar agregado</option>
              {todosLosAgregados
                .filter(
                  (agregado) =>
                    !editArticulo.agregados.some(
                      (item) => item.nombre === agregado.nombre
                    )
                )
                .map((agregado) => (
                  <option key={agregado.id} value={agregado.nombre}>
                    {agregado.nombre}
                  </option>
                ))}
            </select>

            <button
              type="button"
              onClick={handleAgregarAgregado}
              className="py-2 px-4 bg-blue-500 text-white rounded mb-4 w-1/4"
            >
              Agregar
            </button>
            <div>
              <ul className="list-disc pl-4 font-semibold mb-4 mr-3">
                {Array.isArray(editArticulo.agregados) &&
                editArticulo.agregados.length > 0 ? (
                  editArticulo.agregados.map((agregado, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center"
                    >
                      {typeof agregado === "string"
                        ? agregado
                        : agregado.nombre}
                      <button
                        type="button"
                        onClick={() => handleRemoveAgregado(agregado)}
                        className="ml-2 text-red-500"
                      >
                        Eliminar
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No hay agregados.</li>
                )}
              </ul>
            </div>

            {/* Cantidad */}
            <div className="mb-4">
              <label className="block text-gray-700">Cantidad</label>
              <input
                type="number"
                value={editArticulo.cantidad}
                onChange={(e) =>
                  setEditArticulo({
                    ...editArticulo,
                    cantidad: e.target.value,
                  })
                }
                className="w-full border border-gray-300 p-2 rounded"
                min="1"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
              >
                Actualizar
              </button>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};
