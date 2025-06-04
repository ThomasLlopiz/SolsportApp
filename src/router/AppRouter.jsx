import { Routes, Route } from "react-router-dom";
import {
  PrivateAdminRoute,
  PrivateUserRoute,
  PrivateSuperAdminRoute,
} from "../hooks/PrivateRoutes";
import { Login } from "../pages/Login";
import { Pedidos } from "../pages/Pedidos";
import { Pedido } from "../pages/Pedido";
import { Articulos } from "../pages/Articulos";
import { Articulo } from "../pages/Articulo";
import { Cotizador } from "../pages/Cotizador";
import { Cotizacion } from "../pages/Cotizacion";
import { Telas } from "../pages/Telas";
import { Agregados } from "../pages/Agregados";

import { CostoProduccion } from "../pages/CostoProduccion";
import { Prendas } from "../pages/Prendas";
import { Usuarios } from "../pages/Usuarios";
import { Colores } from "../pages/Colores";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      {/* RUTAS USUARIOS */}
      <Route
        path="/pedidos"
        element={<PrivateUserRoute element={<Pedidos />} />}
      />
      <Route
        path="/pedidos/:id"
        element={<PrivateUserRoute element={<Pedido />} />}
      />
      <Route
        path="/articulos"
        element={<PrivateUserRoute element={<Articulos />} />}
      />
      <Route
        path="/articulos/:id"
        element={<PrivateUserRoute element={<Articulo />} />}
      />

      {/* RUTAS ADMIN */}
      <Route
        path="/cotizador"
        element={<PrivateAdminRoute element={<Cotizador />} />}
      />
      <Route
        path="/cotizador/:id"
        element={<PrivateAdminRoute element={<Cotizacion />} />}
      />
      <Route
        path="/telas"
        element={<PrivateAdminRoute element={<Telas />} />}
      />
      <Route
        path="/prendas"
        element={<PrivateAdminRoute element={<Prendas />} />}
      />
      <Route
        path="/costosProduccion"
        element={<PrivateAdminRoute element={<CostoProduccion />} />}
      />
      <Route
        path="/agregados"
        element={<PrivateAdminRoute element={<Agregados />} />}
      />
      <Route
        path="/colores"
        element={<PrivateAdminRoute element={<Colores />} />}
      />
            <Route
        path="/usuarios"
        element={<PrivateSuperAdminRoute element={<Usuarios />} />}
      />
    </Routes>
  );
};
