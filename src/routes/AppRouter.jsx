import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home"; // Si tienes una Home genérica
import ProtectedRoute from "./ProtectedRoute"; // ¡RUTA CORREGIDA!
import RecuperarContraseña from "../pages/RecuperarContraseña";
import ProtectedByRole from "./ProtectedByRole"; // ¡RUTA CORREGIDA!

// Componentes del Cliente
import ClienteLayout from '../components/cliente/ClienteLayout';
import HomeCliente from '../pages/cliente/HomeCliente';
import MisPedidos from '../pages/cliente/MisPedidos';
import VerProductos from '../pages/cliente/VerProductos';
import EditarPerfil from '../pages/cliente/EditarPerfil';

// Componentes del Administrador
import AdminLayout from '../components/admin/layout/AdminLayout';
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProductos from '../pages/admin/AdminProductos';
import AdminUsuarios from '../pages/admin/AdminUsuarios';
import AdminClientes from '../pages/admin/AdminClientes';
import AdminEmpresas from '../pages/admin/AdminEmpresas';
import AdminAdministradores from '../pages/admin/AdminAdministradores';
import AdminPerfil from '../pages/admin/AdminPerfil'; // ¡NUEVA IMPORTACIÓN!

// Componentes de la Empresa
import EmpresaLayout from '../components/empresa/layout/EmpresaLayout';
import PerfilEmpresa from '../pages/empresa/PerfilEmpresa';
import ProductosEmpresa from '../pages/empresa/ProductosEmpresa';
import SolicitudesEmpresa from '../pages/empresa/SolicitudesEmpresa'; // Asegúrate de que este componente exista si lo usas

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Login />} /> {/* O tu página de inicio si es diferente */}
      <Route path="/recuperar" element={<RecuperarContraseña />} />

      {/* Rutas Protegidas para Cliente */}
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

      {/* Rutas Protegidas para Administrador */}
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
        <Route path="perfil" element={<AdminPerfil />} /> {/* ¡RUTA AÑADIDA! */}
        <Route index element={<AdminDashboard />} />
      </Route>

      {/* Rutas Protegidas para Empresa */}
      <Route path="/empresa" element={
        <ProtectedByRole allowed={["empresa"]}>
          <EmpresaLayout />
        </ProtectedByRole>
      }>
        <Route path="dashboard" element={<h2>Dashboard Empresa</h2>} />
        <Route path="perfil" element={<PerfilEmpresa />} />
        <Route path="productos" element={<ProductosEmpresa />} />
        <Route path="solicitudes" element={<SolicitudesEmpresa />} />
        <Route index element={<h2>Dashboard Empresa</h2>} />
      </Route>

      {/* Ruta para cualquier otra URL no definida */}
      <Route path="*" element={<h2>404: Página no encontrada</h2>} />
    </Routes>
  );
}