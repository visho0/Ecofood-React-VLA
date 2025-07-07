import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


export default function Sidebar() {
  const { userData } = useAuth();

  const adminRoutes = [
    { path: '/admin/dashboard', name: 'Dashboard', icon: 'bi bi-grid-fill' },
    { path: '/admin/productos', name: 'Productos', icon: 'bi bi-box-seam-fill' },
    { path: '/admin/clientes', name: 'Clientes', icon: 'bi bi-people-fill' },
    { path: '/admin/empresas', name: 'Empresas', icon: 'bi bi-shop-window' },
    { path: '/admin/administradores', name: 'Administradores', icon: 'bi bi-person-gear' },
  ];

  const clientRoutes = [
    { path: '/cliente/dashboard', name: 'Mi Dashboard', icon: 'bi bi-house-door-fill' },
    { path: '/cliente/productos', name: 'Ver Productos', icon: 'bi bi-basket-fill' },
    { path: '/cliente/pedidos', name: 'Mis Pedidos', icon: 'bi bi-journal-check' },
  ];

  const companyRoutes = [
    { path: '/empresa/dashboard', name: 'Dashboard Empresa', icon: 'bi bi-building-fill' },
    { path: '/empresa/productos', name: 'Mis Productos', icon: 'bi bi-boxes' },
    { path: '/empresa/solicitudes', name: 'Solicitudes', icon: 'bi bi-envelope-fill' },
  ];

  let routesToRender = [];
  if (userData) {
    switch (userData.tipo) {
      case 'admin':
        routesToRender = adminRoutes;
        break;
      case 'cliente':
        routesToRender = clientRoutes;
        break;
      case 'empresa':
        routesToRender = companyRoutes;
        break;
      default:
        routesToRender = [];
    }
  }

  const getProfileEditPath = () => {
    if (!userData || !userData.tipo) return '/login';
    switch (userData.tipo) {
      case 'admin': return '/admin/perfil';
      case 'cliente': return '/cliente/editar';
      case 'empresa': return '/empresa/perfil';
      default: return '/';
    }
  };

  return (
    <nav className="d-flex flex-column p-3 text-white bg-dark" style={{ width: '250px', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 1000 }}>
      {/* Añadimos "EcoFood" aquí en la parte superior del Sidebar */}
      <h3 className="sidebar-brand text-center text-white fw-bold mb-4">EcoFood</h3>
      <hr className="my-2"/>

      <ul className="nav nav-pills flex-column mb-auto">
        {routesToRender.map((route) => (
          <li className="nav-item" key={route.path}>
            <NavLink
              to={route.path}
              className={({ isActive }) =>
                isActive ? 'nav-link text-white active' : 'nav-link text-white'
              }
            >
              <i className={`${route.icon} me-2`}></i>
              {route.name}
            </NavLink>
          </li>
        ))}
      </ul>

      <hr className="my-3"/>

      <div className="dropdown">
        {userData && (
          <Link
            className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
            id="dropdownUser"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            to={getProfileEditPath()}
          >
            <i className="bi bi-person-circle me-2 fs-5"></i>
            <strong>{userData.nombre}</strong>
          </Link>
        )}
      </div>
    </nav>
  );
}