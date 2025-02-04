import { Routes, Route } from "react-router-dom";

import { Login } from "../pages/Login";
import { Pedidos } from "../pages/Pedidos";
import { Pedido } from "../pages/Pedido";
import { Articulos } from "../pages/Articulos";
import { Articulo } from "../pages/Articulo";
import { PrePage } from "../pages/PrePage";
import { Cotizador } from "../pages/Cotizador";
import { Cotizacion } from "../pages/Cotizacion";
import { Telas } from "../pages/Telas";
import { Agregados } from "../pages/Agregados";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/prepage" element={<PrePage />} />
      <Route path="/pedidos" element={<Pedidos />} />
      <Route path="/pedidos/:id" element={<Pedido />} />
      <Route path="/cotizador" element={<Cotizador />} />
      <Route path="/cotizador/:id" element={<Cotizacion />} />
      <Route path="/articulos" element={<Articulos />} />
      <Route path="/articulos/:id" element={<Articulo />} />
      <Route path="/telas" element={<Telas />} />
      <Route path="/agregados" element={<Agregados />} />
    </Routes>
  );
};
