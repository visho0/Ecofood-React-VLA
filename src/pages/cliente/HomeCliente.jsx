import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomeCliente = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <h2>¡Bienvenido a EcoFood, Cliente!</h2>
      <p>¿Qué deseas hacer hoy?</p>
      <button onClick={() => navigate('/cliente/productos')} className="btn btn-primary m-2">
        Ver Productos
      </button>
      <button onClick={() => navigate('/cliente/pedidos')} className="btn btn-success m-2">
        Mis Solicitudes
      </button>
      <button onClick={() => navigate('/cliente/editar')} className="btn btn-warning m-2">
        Editar Perfil
      </button>
    </div>
  );
};

export default HomeCliente;
