import { useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";

const NOMBRE_OPTIONS = [
  "Diseño",
  "Corte",
  "Bordado",
  "Subilmado",
  "Estampado",
  "DTF",
  "Prep.Confeccion",
  "Confeccion",
  "Calidad",
];

export const CreateEtapaModal = ({ articuloId, pedidoId, fetchEtapas }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newEtapa, setNewEtapa] = useState({
    nombre: "",
    comentario: "",
    cantidad: 0,
    fecha_inicio: "",
    fecha_fin: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [etapasExistentes, setEtapasExistentes] = useState([]);
  const [loadingEtapas, setLoadingEtapas] = useState(false);

  const URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const usuarioId = localStorage.getItem("usuario_id");

  const fetchEtapasExistentes = async () => {
    setLoadingEtapas(true);
    try {
      const response = await fetch(`${URL}/etapas?articulos_id=${articuloId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al obtener etapas");

      const data = await response.json();
      const filteredEtapas = data.filter(
        (etapa) => etapa.articulos_id == articuloId
      );
      setEtapasExistentes(filteredEtapas);
    } catch (error) {
      console.error("Error fetching etapas", error);
    } finally {
      setLoadingEtapas(false);
    }
  };

  const opcionesDisponibles = NOMBRE_OPTIONS.filter(
    (option) => !etapasExistentes.some((etapa) => etapa.nombre === option)
  );

  useEffect(() => {
    if (isCreateModalOpen) {
      fetchEtapasExistentes();
    }
  }, [isCreateModalOpen]);

  const handleCreateEtapa = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const requestBody = {
      ...newEtapa,
      articulos_id: articuloId,
      pedidos_id: pedidoId,
      usuario_id: usuarioId,
    };

    try {
      const response = await fetch(`${URL}/etapas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Error completo de la API:", data);

        setErrors({
          general: data.message || "Error al crear la etapa",
          ...(data.errors || {}),
        });
        return;
      }

      setNewEtapa({
        nombre: "",
        comentario: "sin comentario",
        cantidad: 0,
        fecha_inicio: "",
        fecha_fin: "",
      });
      setIsCreateModalOpen(false);

      await fetchEtapasExistentes();
    } catch (err) {
      setErrors({ general: "Error de conexión: " + err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mb-4"
        disabled={
          isSubmitting || loadingEtapas || opcionesDisponibles.length === 0
        }
        title={
          opcionesDisponibles.length === 0
            ? "Todas las etapas ya han sido creadas"
            : ""
        }
      >
        <PlusIcon className="h-5 w-5 inline-block mr-2" />
        {isSubmitting ? "Creando..." : "Crear Etapa"}
      </button>

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Crear Etapa</h2>

            {loadingEtapas ? (
              <div className="text-center py-4">
                <p className="text-gray-600">Cargando etapas existentes...</p>
              </div>
            ) : opcionesDisponibles.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-600">
                  Todas las etapas posibles ya han sido creadas.
                </p>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateEtapa}>
                {errors.general && (
                  <div className="p-2 mb-4 text-red-600 bg-red-100 rounded">
                    Error: {errors.general}
                  </div>
                )}

                {Object.entries(errors).map(
                  ([field, message]) =>
                    field !== "general" && (
                      <div key={field} className="text-red-500 text-sm mt-1">
                        {message}
                      </div>
                    )
                )}
                <div className="mb-4">
                  <label className="block text-gray-700">Nombre</label>
                  <select
                    value={newEtapa.nombre}
                    onChange={(e) =>
                      setNewEtapa({ ...newEtapa, nombre: e.target.value })
                    }
                    className={`w-full p-2 border ${
                      errors.nombre ? "border-red-500" : "border-gray-300"
                    } rounded mt-1`}
                    required
                  >
                    <option value="" disabled>
                      Selecciona un nombre
                    </option>
                    {opcionesDisponibles.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.nombre && (
                    <span className="text-red-500 text-sm">
                      {errors.nombre}
                    </span>
                  )}
                </div>

                {/* <div className="mb-4">
                  <label className="block text-gray-700">Cantidad</label>
                  <input
                    type="number"
                    min="0"
                    value={newEtapa.cantidad}
                    onChange={(e) =>
                      setNewEtapa({
                        ...newEtapa,
                        cantidad: parseInt(e.target.value) || 0,
                      })
                    }
                    className={`w-full p-2 border ${
                      errors.cantidad ? "border-red-500" : "border-gray-300"
                    } rounded mt-1`}
                    required
                  />
                  {errors.cantidad && (
                    <span className="text-red-500 text-sm">
                      {errors.cantidad}
                    </span>
                  )}
                </div> */}

                <div className="mb-4">
                  <label className="block text-gray-700">Fecha de Inicio</label>
                  <input
                    type="date"
                    value={newEtapa.fecha_inicio}
                    onChange={(e) =>
                      setNewEtapa({ ...newEtapa, fecha_inicio: e.target.value })
                    }
                    className={`w-full p-2 border ${
                      errors.fecha_inicio ? "border-red-500" : "border-gray-300"
                    } rounded mt-1`}
                  />
                  {errors.fecha_inicio && (
                    <span className="text-red-500 text-sm">
                      {errors.fecha_inicio}
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Fecha de Fin</label>
                  <input
                    type="date"
                    value={newEtapa.fecha_fin}
                    onChange={(e) =>
                      setNewEtapa({ ...newEtapa, fecha_fin: e.target.value })
                    }
                    className={`w-full p-2 border ${
                      errors.fecha_fin ? "border-red-500" : "border-gray-300"
                    } rounded mt-1`}
                  />
                  {errors.fecha_fin && (
                    <span className="text-red-500 text-sm">
                      {errors.fecha_fin}
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Comentario</label>
                  <textarea
                    value={newEtapa.comentario}
                    onChange={(e) =>
                      setNewEtapa({ ...newEtapa, comentario: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded mt-1"
                  />
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mr-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creando..." : "Crear Etapa"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
