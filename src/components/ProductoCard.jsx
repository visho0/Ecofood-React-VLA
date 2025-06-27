import React from 'react';

function CardProducto({ producto }) { 
  const { nombre, precio } = producto; 

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{nombre}</h5> {/* Ahora 'nombre' está definido */}
        <p className="card-text">Precio: {precio}</p> {/* Ahora 'precio' está definido */}
        <i className="fas fa-apple-alt"></i>
      </div>
    </div>
  );
}

export default CardProducto;