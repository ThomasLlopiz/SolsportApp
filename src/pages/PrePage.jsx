import { Link } from "react-router-dom";

export const PrePage = () => {
  return (
    <div className="flex justify-center items-center gap-32 mt-2 pb-12 bg-gray-100">
      <div className="flex gap-10">
        <button className="bg-blue-500 text-white px-4 py-2 rounded flex">
          <Link to="/cotizador">Cotizador</Link>
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded flex">
          <Link to="/telas">Telas</Link>
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded flex">
          <Link to="/agregados">Agregados</Link>
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded flex">
          <Link to="/pedidos">Pedidos</Link>
        </button>
      </div>
    </div>
  );
};
