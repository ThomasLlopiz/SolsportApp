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
import { PrivateAdminRoute, PrivateUserRoute } from "../hooks/PrivateRoutes";
export const AppRouter = () => {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/" element={<Login />} />
      <Route path="/prepage" element={<PrePage />} />
      {/* Ruta privada para user (solo /pedidos y /pedidos/:id) */}
      <Route path="/pedidos" element={<PrivateUserRoute element={<Pedidos />} />} />
      <Route path="/pedidos/:id" element={<PrivateUserRoute element={<Pedido />} />} />
      <Route path="/articulos" element={<PrivateUserRoute element={<Articulos />} />} />
      <Route path="/articulos/:id" element={<PrivateUserRoute element={<Articulos />} />} />
      {/* Rutas privadas para admin (solo admin puede acceder a estas) */}
      <Route path="/cotizador" element={<PrivateAdminRoute element={<Cotizador />} />} />
      <Route path="/cotizador/:id" element={<PrivateAdminRoute element={<Cotizacion />} />} />
      <Route path="/articulos" element={<Articulos />} />
      <Route path="/articulos/:id" element={<Articulo />} />
      <Route path="/telas" element={<PrivateAdminRoute element={<Telas />} />} />
      <Route path="/agregados" element={<PrivateAdminRoute element={<Agregados />} />} />
    </Routes>
  );
};
