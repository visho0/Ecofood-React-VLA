import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import RecuperarContraseña from "../pages/RecuperarContraseña";
import ProtectedRoute from "./ProtectedRoute";
import ProtectedByRole from "./ProtectedByRole";

// Componentes generales/públicos
import LandingPage from "../pages/LandingPage"; // ¡IMPORTA TU NUEVO COMPONENTE DE LANDING PAGE!

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
import AdminPerfil from '../pages/admin/AdminPerfil';

// Componentes de la Empresa
import EmpresaLayout from '../components/empresa/layout/EmpresaLayout';
import PerfilEmpresa from '../pages/empresa/PerfilEmpresa';
import ProductosEmpresa from '../pages/empresa/ProductosEmpresa';
import SolicitudesEmpresa from '../pages/empresa/SolicitudesEmpresa';

export default function AppRouter() {
  return (
    <Routes>
      {/* Ruta pública para la Landing Page */}
      <Route path="/" element={<LandingPage />} /> {/* ¡Define tu LandingPage como la ruta raíz! */}

      {/* Rutas de autenticación */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/recuperar-contrasena" element={<RecuperarContraseña />} />

      {/* Rutas Protegidas para Cliente */}
      <Route path="/cliente" element={
        <ProtectedRoute>
          <ProtectedByRole allowed={["cliente"]}>
            <ClienteLayout />
          </ProtectedByRole>
        </ProtectedRoute>
      }>
        <Route index element={<HomeCliente />} />
        <Route path="dashboard" element={<HomeCliente />} />
        <Route path="productos" element={<VerProductos />} />
        <Route path="pedidos" element={<MisPedidos />} />
        <Route path="editar" element={<EditarPerfil />} />
      </Route>

      {/* Rutas Protegidas para Administrador */}
      <Route path="/admin" element={
        <ProtectedRoute>
          <ProtectedByRole allowed={["admin"]}>
            <AdminLayout />
          </ProtectedByRole>
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="productos" element={<AdminProductos />} />
        <Route path="clientes" element={<AdminClientes />} />
        <Route path="empresas" element={<AdminEmpresas />} />
        <Route path="administradores" element={<AdminAdministradores />} />
        <Route path="perfil" element={<AdminPerfil />} />
      </Route>

      {/* Rutas Protegidas para Empresa */}
      <Route path="/empresa" element={
        <ProtectedRoute>
          <ProtectedByRole allowed={["empresa"]}>
            <EmpresaLayout />
          </ProtectedByRole>
        </ProtectedRoute>
      }>
        <Route index element={<h2>Dashboard Empresa</h2>} />
        <Route path="dashboard" element={<h2>Dashboard Empresa</h2>} />
        <Route path="perfil" element={<PerfilEmpresa />} />
        <Route path="productos" element={<ProductosEmpresa />} />
        <Route path="solicitudes" element={<SolicitudesEmpresa />} />
      </Route>

      {/* Ruta para cualquier otra URL no definida (puede ser una página 404) */}
      <Route path="*" element={<h1>404: Página no encontrada</h1>} />
    </Routes>
  );
}