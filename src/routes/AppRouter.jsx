import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import ProtectedRoute from "./ProtectedRoute";
import RecuperarContraseña from "../pages/RecuperarContraseña";
import ProtectedByRole from "./ProtectedByRole";

import ClienteLayout from '../components/cliente/ClienteLayout';
import HomeCliente from '../pages/cliente/HomeCliente';
import MisPedidos from '../pages/cliente/MisPedidos';
import VerProductos from '../pages/cliente/VerProductos';
import EditarPerfil from '../pages/cliente/EditarPerfil';

import AdminLayout from '../components/admin/layout/AdminLayout';
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProductos from '../pages/admin/AdminProductos';
import AdminUsuarios from '../pages/admin/AdminUsuarios';
import AdminClientes from '../pages/admin/AdminClientes';
import AdminEmpresas from '../pages/admin/AdminEmpresas';
import AdminAdministradores from '../pages/admin/AdminAdministradores';

import EmpresaLayout from '../components/empresa/layout/EmpresaLayout';
import PerfilEmpresa from '../pages/empresa/PerfilEmpresa';
import ProductosEmpresa from '../pages/empresa/ProductosEmpresa';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Login />} />
      <Route path="/recuperar" element={<RecuperarContraseña />} />
      <Route path="/registro" element={<Register />} />

      <Route path="/home" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      }/>

      <Route path="/cliente" element={
        <ProtectedByRole allowed={["cliente"]}>
          <ClienteLayout />
        </ProtectedByRole>
      }>
        <Route index element={<HomeCliente />} />
        <Route path="dashboard" element={<HomeCliente />} />
        <Route path="productos" element={<VerProductos />} />
        <Route path="pedidos" element={<MisPedidos />} />
        <Route path="editar" element={<EditarPerfil />} />
      </Route>

      <Route path="/admin" element={
        <ProtectedByRole allowed={["admin"]}>
          <AdminLayout />
        </ProtectedByRole>
      }>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="productos" element={<AdminProductos />} />
        <Route path="clientes" element={<AdminClientes />} />
        <Route path="empresas" element={<AdminEmpresas />} />
        <Route path="administradores" element={<AdminAdministradores />} />
        <Route index element={<AdminDashboard />} />
      </Route>

      <Route path="/empresa" element={
        <ProtectedByRole allowed={["empresa"]}>
          <EmpresaLayout />
        </ProtectedByRole>
      }>
        <Route path="dashboard" element={<h2>Dashboard Empresa</h2>} />
        <Route path="perfil" element={<PerfilEmpresa />} />
        <Route path="productos" element={<ProductosEmpresa />} />
        <Route index element={<h2>Dashboard Empresa</h2>} />
      </Route>

      <Route path="*" element={<h2>404: Página no encontrada</h2>} />
    </Routes>
  );
}