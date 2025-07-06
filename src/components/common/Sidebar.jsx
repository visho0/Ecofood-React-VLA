import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Ajusta la ruta si es necesario

export default function Sidebar() {
  const { userData } = useAuth(); // Obtener el tipo de usuario del contexto de autenticación

  // Define las rutas para cada tipo de usuario
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
        routesToRender = []; // No hay rutas si el tipo no coincide
    }
  }

  return (
    <nav className="d-flex flex-column p-3 text-white bg-dark" style={{ width: '250px', height: '100vh' }}>
      <ul className="nav nav-pills flex-column mb-auto">
        {routesToRender.map((route) => (
          <li className="nav-item" key={route.path}>
            <NavLink
              to={route.path}
              className={({ isActive }) =>
                isActive ? 'nav-link text-white active' : 'nav-link text-white'
              }
              end // Usar 'end' para que la clase 'active' solo se aplique si la ruta coincide exactamente
            >
              <i className={`${route.icon} me-2`}></i>
              {route.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}