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

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/pedidos" element={<Pedidos />} />
      <Route path="/pedidos/:id" element={<Pedido />} />
      <Route path="/articulos" element={<Articulos />} />
      <Route path="/articulos/:id" element={<Articulo />} />
      <Route path="/prepage" element={<PrePage />}></Route>
      <Route path="/cotizador" element={<Cotizador />}></Route>
      <Route path="/cotizacion" element={<Cotizacion />}></Route>
      <Route path="/telas" element={<Telas />}></Route>
    </Routes>
  );
};
