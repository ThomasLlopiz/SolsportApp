import { BrowserRouter as Routes, Route, Router } from "react-router-dom";

import { Login } from "../pages/Login";
import { Pedidos } from "../pages/Pedidos";
import { Pedido } from "../pages/Pedido";
import { Articulos } from "../pages/Articulos";
import { Articulo } from "../pages/Articulo";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/pedidos" element={<Pedidos />} />
      <Route path="/pedidos/:id" element={<Pedido />} />
      <Route path="/articulos" element={<Articulos />} />
      <Route path="/articulos/:id" element={<Articulo />} />
    </Routes>
  );
};
