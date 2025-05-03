import { CreateEtapaModal } from "./CreateEtapaModal";
import { useState } from "react";

export const EditArticuloModal = ({
  isEditModalOpen,
  setIsEditModalOpen,
  editArticulo,
  setEditArticulo,
  handleUpdateArticulo,
  prendas,
  talles,
  telas,
  todosLosAgregados,
  agregadoParaAgregar,
  setAgregadoParaAgregar,
  handleAgregarAgregado,
  handleRemoveAgregado,
  pedidoId,
}) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    isEditModalOpen &&
    editArticulo && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-xl font-semibold mb-4">Editar Artículo</h2>
          <CreateEtapaModal pedidoId={pedidoId} articuloId={editArticulo.id} />
          <form onSubmit={(e) => handleUpdateArticulo(e, file)}>
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

            {/* Nuevo campo para subir archivo */}
            <div className="mb-4">
              <label className="block text-gray-700">Archivo</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
              {editArticulo.ruta && (
                <a
                  href={`${import.meta.env.VITE_API_URL}/storage/${
                    editArticulo.ruta
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 text-sm mt-1 inline-block"
                >
                  Ver archivo actual
                </a>
              )}
            </div>

            {/* Select para Prenda */}
            <select
              value={editArticulo.nombre || ""} // Ensure the current prenda nombre is selected
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
              {prendas.map((prenda, index) => (
                <option
                  key={`prenda-${prenda.id || index}`}
                  value={prenda.nombre}
                >
                  {prenda.nombre}
                </option>
              ))}
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
