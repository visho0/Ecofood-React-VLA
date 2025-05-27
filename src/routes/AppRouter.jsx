import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import ProtectedRoute from "./ProtectedRoute";
import RecuperarContraseña from "../pages/RecuperarContraseña";
import ProtectedByRole from "./ProtectedByRole";

//CLiente
import ClienteDashboard from '../pages/cliente/ClienteDashboard';

//Admin
import AdminLayout from '../components/admin/layout/AdminLayout';
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProductos from '../pages/admin/AdminProductos';
import AdminUsuarios from '../pages/admin/AdminUsuarios';


export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Login />} />
      <Route path="/recuperar" element={<RecuperarContraseña />} />
      <Route path="/registro" element={<Register />} />

      {/* Ruta protegida para usuarios autenticados (cualquier tipo) */}
      <Route path="/home" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      }/>

      {/* Rutas protegidas por rol */}

      {/* Cliente Dashboard */}
      <Route path="/cliente/dashboard" element={
        <ProtectedByRole allowed={["cliente"]}>
          <ClienteDashboard />
        </ProtectedByRole>
      }/>

      {/* Admin Routes (Nested) */}
      <Route path="/admin" element={
        <ProtectedByRole allowed={["admin"]}>
          <AdminLayout /> {/* Este es el layout principal para las rutas de admin */}
        </ProtectedByRole>
      }>
        {/* Rutas anidadas dentro de /admin */}
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="productos" element={<AdminProductos />} />
        <Route path="usuarios" element={<AdminUsuarios />} />
      </Route>

    </Routes>
  );
}