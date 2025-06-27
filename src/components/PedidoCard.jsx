// src/components/PedidoCard.jsx
import React from 'react';

const PedidoCard = ({ pedido }) => {
  // Verifica que 'pedido' y sus propiedades existan para evitar errores si los datos son incompletos
  if (!pedido) {
    return <div className="card my-2 p-3">No hay datos de pedido para mostrar.</div>;
  }

  // Puedes ajustar las propiedades según la estructura real de tus datos de pedido
  const { id, productoId, nombreProducto, cantidadSolicitada, estado, fecha, empresaId } = pedido;

  return (
    <div className="card my-3 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">Pedido # {id}</h5>
        <h6 className="card-subtitle mb-2 text-muted">Producto: {nombreProducto || 'Desconocido'}</h6>
        <p className="card-text">
          <strong>Cantidad Solicitada:</strong> {cantidadSolicitada}
        </p>
        <p className="card-text">
          <strong>Estado:</strong> <span className={`badge ${estado === 'pendiente' ? 'bg-warning' : estado === 'aprobado' ? 'bg-success' : 'bg-danger'}`}>{estado}</span>
        </p>
        {fecha && <p className="card-text"><small className="text-muted">Fecha: {fecha}</small></p>}
        {empresaId && <p className="card-text"><small className="text-muted">Empresa ID: {empresaId}</small></p>}
        {/* Puedes añadir más detalles aquí según tus datos de pedido */}
      </div>
    </div>
  );
};

export default PedidoCard;