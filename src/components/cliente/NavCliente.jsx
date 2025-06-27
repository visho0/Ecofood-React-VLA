import React from 'react';
import { Link } from 'react-router-dom';
import CerrarSesion from '../CerrarSesion';
import { useAuth } from '../../context/AuthContext';

export default function NavCliente() {
  const { userData } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/cliente/dashboard">
          Ecofood Cliente {userData ? `(${userData.nombre || userData.email})` : ''}
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/cliente/productos">
                Ver Productos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cliente/pedidos">
                Mis Solicitudes
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cliente/editar">
                Editar Perfil
              </Link>
            </li>
          </ul>
          <span className="navbar-text">
            <CerrarSesion />
          </span>
        </div>
      </div>
    </nav>
  );
}