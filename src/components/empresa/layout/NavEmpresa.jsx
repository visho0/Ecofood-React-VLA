import { NavLink, Link } from 'react-router-dom'; // Asegúrate de importar NavLink
import CerrarSesion from '../../CerrarSesion';
import { useAuth } from '../../../context/AuthContext';

export default function NavEmpresa() {
  const { userData } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/empresa/perfil">
          Ecofood Empresa {userData ? `(${userData.nombre})` : ''}
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/empresa/dashboard">
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/empresa/perfil">
                Mi Perfil
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/empresa/productos">
                Mis Productos
              </NavLink>
            </li>
            {/* ¡NUEVO ENLACE PARA SOLICITUDES! */}
            <li className="nav-item">
              <NavLink className="nav-link" to="/empresa/solicitudes">
                Mis Solicitudes
              </NavLink>
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