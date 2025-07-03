import React, { useEffect, useState } from 'react';
import { getProductos, addProducto, updateProducto, deleteProducto } from '../../services/productoService';
import AdminProductoModal from '../../components/admin/AdminProductoModal'; // Importar el modal
import Swal from 'sweetalert2'; // Asegúrate de tener SweetAlert2 instalado (npm install sweetalert2)

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null); // Para editar

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const data = await getProductos(); // Obtiene TODOS los productos
      setProductos(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      Swal.fire("Error", "No se pudieron cargar los productos.", "error");
    }
  };

  const handleShowAddModal = () => {
    setProductoSeleccionado(null); // Para asegurar que es un nuevo producto
    setShowModal(true);
  };

  const handleShowEditModal = (producto) => {
    setProductoSeleccionado(producto);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setProductoSeleccionado(null);
  };

  const handleSaveProducto = async (productoData) => {
    try {
      if (productoSeleccionado) {
        // Editar producto existente
        await updateProducto(productoSeleccionado.id, productoData);
        Swal.fire("¡Actualizado!", "Producto actualizado exitosamente.", "success");
      } else {
        // Añadir nuevo producto
        await addProducto(productoData);
        Swal.fire("¡Añadido!", "Producto añadido exitosamente.", "success");
      }
      cargarProductos(); // Recargar la lista de productos
    } catch (error) {
      console.error("Error al guardar producto:", error);
      Swal.fire("Error", "No se pudo guardar el producto.", "error");
    }
  };

  const handleDeleteProducto = async (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteProducto(id);
          Swal.fire(
            '¡Eliminado!',
            'El producto ha sido eliminado.',
            'success'
          );
          cargarProductos(); // Recargar la lista
        } catch (error) {
          console.error("Error al eliminar producto:", error);
          Swal.fire("Error", "No se pudo eliminar el producto.", "error");
        }
      }
    });
  };

  return (
    <div className="container mt-4">
      <h3>Gestión de Productos (Administrador)</h3>
      <button className="btn btn-primary mb-3" onClick={handleShowAddModal}>
        Añadir Nuevo Producto
      </button>

      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Vencimiento</th>
            <th>Estado</th>
            <th>Tipo Precio</th>
            <th>Ubicación</th>
            <th>ID Empresa</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.length > 0 ? (
            productos.map(producto => (
              <tr key={producto.id}>
                <td>{producto.nombre}</td>
                <td>{producto.descripcion}</td>
                <td>${producto.precio.toLocaleString()}</td>
                <td>{producto.cantidad}</td>
                <td>{producto.vencimiento}</td>
                <td>{producto.estado}</td>
                <td>{producto.tipoPrecio}</td>
                <td>{producto.ubicacion}</td>
                <td>{producto.empresaId}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleShowEditModal(producto)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteProducto(producto.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="text-center">No hay productos disponibles.</td>
            </tr>
          )}
        </tbody>
      </table>

      <AdminProductoModal
        show={showModal}
        handleClose={handleCloseModal}
        productoInicial={productoSeleccionado}
        handleSave={handleSaveProducto}
      />
    </div>
  );
}