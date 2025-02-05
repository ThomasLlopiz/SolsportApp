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
}) => {
    return (
        isEditModalOpen && editArticulo && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                    <h2 className="text-xl font-semibold mb-4">Editar Artículo</h2>
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

                        {/* Select para Prenda */}
                        <div className="mb-4">
                            <label className="block text-gray-700">Prenda</label>
                            <select
                                value={editArticulo.nombre}
                                onChange={(e) =>
                                    setEditArticulo({
                                        ...editArticulo,
                                        nombre: e.target.value,
                                    })
                                }
                                className="w-full border border-gray-300 p-2 rounded"
                                required
                            >
                                <option value="">Selecciona una prenda</option>
                                {prendas.map((prenda) => (
                                    <option key={prenda} value={prenda}>
                                        {prenda}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Select para Talle */}
                        <div className="mb-4">
                            <label className="block text-gray-700">Talle</label>
                            <select
                                value={editArticulo.talle}
                                onChange={(e) =>
                                    setEditArticulo({
                                        ...editArticulo,
                                        talle: e.target.value,
                                    })
                                }
                                className="w-full border border-gray-300 p-2 rounded"
                                required
                            >
                                <option value="">Selecciona un talle</option>
                                {talles.map((talle) => (
                                    <option key={talle} value={talle}>
                                        {talle}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Tela */}
                        <div className="mb-4">
                            <label className="block text-gray-700">Tela</label>
                            <select
                                value={editArticulo.tela}
                                onChange={(e) =>
                                    setEditArticulo({
                                        ...editArticulo,
                                        tela: e.target.value,
                                    })
                                }
                                className="w-full border border-gray-300 p-2 rounded"
                                required
                            >
                                <option value="">Selecciona una tela</option>
                                {telas.map((tela) => (
                                    <option key={tela.id} value={tela.nombre}>
                                        {tela.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Agregados */}
                        <div className="flex flex-col gap-3">
                            <select
                                value={agregadoParaAgregar}
                                onChange={(e) => setAgregadoParaAgregar(e.target.value)}
                                className="py-2 px-4 border border-gray-300 rounded mt-12"
                            >
                                <option value="">Seleccionar agregado</option>
                                {todosLosAgregados
                                    .filter(
                                        (agregado) => !editArticulo.agregados.includes(agregado)
                                    )
                                    .map((agregado, index) => (
                                        <option key={index} value={agregado}>
                                            {agregado}
                                        </option>
                                    ))}
                            </select>
                            <button
                                type="button"
                                onClick={handleAgregarAgregado}
                                className="py-2 px-4 bg-blue-500 text-white rounded"
                            >
                                Agregar
                            </button>
                        </div>

                        {/* Lista de agregados seleccionados */}
                        <div>
                            <ul className="list-disc pl-4 font-semibold mt-10 mr-3">
                                {editArticulo.agregados.map((agregado, index) => (
                                    <li key={index} className="flex justify-between items-center">
                                        {agregado}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveAgregado(agregado)}
                                            className="ml-2 text-red-500"
                                        >
                                            Eliminar
                                        </button>
                                    </li>
                                ))}
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
