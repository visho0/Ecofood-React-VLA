import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import { auth } from '../../services/firebase';
import { signOut } from 'firebase/auth';


export default function Header() {
  const { userData, logout } = useAuth();
  const navigate = useNavigate();

  const shortenName = (name, maxLength = 10) => {
    if (!name) return '';
    return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Swal.fire("Sesión cerrada", "Has cerrado sesión correctamente", "success");
      navigate("/login");
      if (logout) logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      Swal.fire("Error", "No se pudo cerrar la sesión", "error");
    }
  };

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
    // Cambiamos 'navbar-dark bg-dark' por 'navbar-light bg-white'
    <header className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm" style={{ zIndex: 1020, paddingLeft: '265px' }}>
      <div className="container-fluid">
        {/* Eliminamos el logo/nombre "EcoFood" de aquí */}
        {/* <Link className="navbar-brand" to="/">
          <span className="fw-bold">EcoFood</span>
        </Link> */}

        <div className="d-flex align-items-center ms-auto"> {/* Añadimos ms-auto para mover los elementos a la derecha si no hay logo en el centro */}
          {userData && (
            <span className="me-2 text-dark d-none d-md-block"> {/* Cambiado a text-dark */}
              Hola, {shortenName(userData.nombre)}
            </span>
          )}
          <div className="dropdown">
            <button
              className="btn btn-outline-dark rounded-circle d-flex align-items-center justify-content-center" // Cambiado a btn-outline-dark
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ width: '40px', height: '40px' }}
            >
              <i className="bi bi-person-fill fs-5 text-dark"></i> {/* Cambiado a text-dark */}
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton1">
              <li>
                <Link className="dropdown-item" to={getProfileEditPath()}>
                  Editar Perfil
                </Link>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item" onClick={handleLogout}>
                  Cerrar Sesión
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}