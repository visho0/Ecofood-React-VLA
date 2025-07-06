import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import { auth } from '../../services/firebase'; // Asegúrate de que esta ruta sea correcta
import { signOut } from 'firebase/auth';


export default function Header() {
  const { userData, logout } = useAuth(); // Asumo que useAuth proporciona logout
  const navigate = useNavigate();

  // Función para acortar el nombre si es muy largo
  const shortenName = (name, maxLength = 15) => {
    if (!name) return '';
    return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Usamos signOut directamente aquí
      Swal.fire("Sesión cerrada", "Has cerrado sesión correctamente", "success");
      navigate("/login");
      // Opcional: Si tu AuthContext maneja el estado de logout internamente, podrías llamarlo:
      // logout(); 
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      Swal.fire("Error", "No se pudo cerrar la sesión", "error");
    }
  };

  // Determinar la ruta de "Editar Perfil" según el rol
  const getProfileEditPath = () => {
    if (!userData || !userData.tipo) return '/'; // Ruta por defecto o a login
    switch (userData.tipo) {
      case 'admin':
        return '/admin/perfil'; // Asumiendo que tendrás una ruta de perfil para admin
      case 'cliente':
        return '/cliente/editar';
      case 'empresa':
        return '/empresa/perfil';
      default:
        return '/';
    }
  };

  return (
    <header className="navbar navbar-expand-lg navbar-light bg-light sticky-top shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          {/* Aquí puedes insertar tu logo de EcoFood */}
          <img src="/path/to/your/ecofood-logo.png" alt="EcoFood Logo" style={{ height: '40px', marginRight: '10px' }} />
          <span className="fw-bold">EcoFood</span>
        </Link>

        <div className="d-flex align-items-center">
          {userData && (
            <span className="me-2 text-muted d-none d-md-block">
              Hola, {shortenName(userData.nombre)}
            </span>
          )}
          <div className="dropdown">
            <button
              className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ width: '40px', height: '40px' }}
            >
              {/* Icono de usuario simple (puedes usar un icono de librería como FontAwesome) */}
              <i className="bi bi-person-fill fs-5"></i> {/* Ejemplo con Bootstrap Icons */}
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