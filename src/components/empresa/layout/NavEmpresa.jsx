import { Link } from 'react-router-dom';
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
              <Link className="nav-link active" aria-current="page" to="/empresa/perfil">
                Mi Perfil
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/empresa/productos">
                Mis Productos
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