import React, { useEffect, useState } from 'react';
import { getProductosDisponibles, crearSolicitud } from '../../services/pedidoService';
import CardProducto from '../../components/ProductoCard';
import Swal from 'sweetalert2';

const VerProductos = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    getProductosDisponibles().then(setProductos);
  }, []);

  const handleSolicitar = async (producto) => {
    const { value: cantidad } = await Swal.fire({
      title: `Solicitar ${producto.nombre}`,
      input: 'number',
      inputLabel: `Stock disponible: ${producto.stock}`,
      inputAttributes: { min: 1, max: producto.stock },
      showCancelButton: true,
    });

    if (cantidad && cantidad > 0 && cantidad <= producto.stock) {
      const solicitud = {
        clienteId: "uidCliente", // reemplaza con el uid real
        productoId: producto.id,
        empresaId: producto.empresaId,
        cantidadSolicitada: parseInt(cantidad),
        fecha: new Date().toISOString().split('T')[0],
        estado: "pendiente"
      };
      await crearSolicitud(solicitud);
      Swal.fire('Solicitud enviada', '', 'success');
    } else if (cantidad > producto.stock) {
      Swal.fire('Cantidad solicitada excede el stock disponible.', '', 'error');
    }
  };

  return (
    <div className="container mt-4">
      <h3>Productos Disponibles</h3>
      <div className="row">
        {productos.map((p) => (
          <CardProducto key={p.id} producto={p} onSolicitar={handleSolicitar} />
        ))}
      </div>
    </div>
  );
};

export default VerProductos;
