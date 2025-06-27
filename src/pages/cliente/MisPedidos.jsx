import React, { useEffect, useState } from 'react';
import { getSolicitudesPorCliente } from '../../services/pedidoService';
import ProductoCard from '../../components/ProductoCard';

const MisPedidos = () => {
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    getSolicitudesPorCliente("uidCliente").then(setSolicitudes); // reemplaza por uid real
  }, []);

  return (
    <div className="container mt-4">
      <h3>Mis Solicitudes</h3>
      {solicitudes.length === 0 ? (
        <p>No tienes solicitudes realizadas.</p>
      ) : (
        solicitudes.map((s) => <ProductoCard key={s.id} pedido={s} />)
      )}
    </div>
  );
};

export default MisPedidos;
