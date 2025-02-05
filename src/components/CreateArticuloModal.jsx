export const CreateArticuloModal = ({
    isCreateModalOpen,
    setIsCreateModalOpen,
    newArticulo,
    setNewArticulo,
    handleCreateArticulo,
    prendas,
    talles,
    telas,
    todosLosAgregados,
    agregadoParaAgregar,
    setAgregadoParaAgregar,
    handleAgregarAgregadoCreate,
    selectedAgregados,
    handleRemoveAgregadoCreate,
}) => {
    return (
        isCreateModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                    <h2 className="text-xl font-semibold mb-4">Crear Artículo</h2>
                    <form onSubmit={handleCreateArticulo}>
                        {/* NÚMERO DE ARTÍCULO */}
                        <div className="mb-4">
                            <label className="block text-gray-700">Número de Artículo</label>
                            <input
                                type="number"
                                value={newArticulo.numero_articulo}
                                onChange={(e) =>
                                    setNewArticulo({
                                        ...newArticulo,
                                        numero_articulo: e.target.value,
                                    })
                                }
                                className="w-full border border-gray-300 p-2 rounded"
                                min="1"
                                required
                            />
                        </div>

                        {/* PRENDA */}
                        <div className="mb-4">
                            <label className="block text-gray-700">Prenda</label>
                            <select
                                value={newArticulo.nombre}
                                onChange={(e) =>
                                    setNewArticulo({
                                        ...newArticulo,
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

                        {/* TALLE */}
                        <div className="mb-4">
                            <label className="block text-gray-700">Talle</label>
                            <select
                                value={newArticulo.talle}
                                onChange={(e) =>
                                    setNewArticulo({
                                        ...newArticulo,
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
                                value={newArticulo.tela}
                                onChange={(e) =>
                                    setNewArticulo({
                                        ...newArticulo,
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
                                onClick={handleAgregarAgregadoCreate}
                                className="py-2 px-4 bg-blue-500 text-white rounded"
                            >
                                Agregar
                            </button>
                        </div>

                        {/* Lista de agregados seleccionados */}
                        <div>
                            <ul className="list-disc pl-4 font-semibold mt-10 mr-3">
                                {selectedAgregados.map((agregado, index) => (
                                    <li key={index} className="flex justify-between items-center">
                                        {agregado}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveAgregadoCreate(agregado)}
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
                                value={newArticulo.cantidad}
                                onChange={(e) =>
                                    setNewArticulo({
                                        ...newArticulo,
                                        cantidad: e.target.value,
                                    })
                                }
                                className="w-full border border-gray-300 p-2 rounded"
                                min="1"
                                required
                            />
                        </div>

                        {/* Comentario */}
                        <div className="mb-4">
                            <label className="block text-gray-700">Comentario</label>
                            <input
                                type="text"
                                value={newArticulo.comentario}
                                onChange={(e) =>
                                    setNewArticulo({
                                        ...newArticulo,
                                        comentario: e.target.value,
                                    })
                                }
                                className="w-full border border-gray-300 p-2 rounded"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
                            >
                                Crear
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(false)}
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
