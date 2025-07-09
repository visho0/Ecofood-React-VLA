import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getProductosByEmpresaId, addProducto, updateProducto, deleteProducto } from "../../services/productoService";
import { useAuth } from "../../context/AuthContext";
import ProductoModal from "../../components/empresa/ProductoModal";

export default function ProductosEmpresa() {
  const [productos, setProductos] = useState([]);
  const [productoActivo, setProductoActivo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, loading } = useAuth();

  const cargarProductos = async () => {
    if (user && user.uid) {
      try {
        const data = await getProductosByEmpresaId(user.uid);
        setProductos(data);
      } catch (error) {
        Swal.fire("Error", "No se pudieron cargar tus productos.", "error");
        console.error("Error al cargar productos por empresa:", error);
      }
    }
  };

  useEffect(() => {
    if (!loading) {
      cargarProductos();
    }
  }, [user, loading]);

  const productosFiltrados = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNuevoProducto = () => {
    setProductoActivo(null);
    setShowModal(true);
  };

  const handleEditar = (producto) => {
    setProductoActivo(producto);
    setShowModal(true);
  };

  const handleEliminar = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, ¡eliminarlo!'
    });

    if (result.isConfirmed) {
      try {
        await deleteProducto(id);
        Swal.fire(
          '¡Eliminado!',
          'El producto ha sido eliminado.',
          'success'
        );
        cargarProductos();
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el producto.", "error");
        console.error("Error al eliminar producto:", error);
      }
    }
  };

  const handleSaveProducto = async (formData) => {
    const handleSaveProducto = async (formData) => {
  if (!user || !user.uid) {
    Swal.fire("Error", "No hay usuario autenticado para guardar el producto.", "error");
    return;
  }

  if (formData.nombre.length > 50) {
    Swal.fire("Error", "El nombre no puede tener más de 50 caracteres.", "warning");
    return;
  }
  if (formData.descripcion.length > 200) {
    Swal.fire("Error", "La descripción no puede tener más de 200 caracteres.", "warning");
    return;
  }

  try {
    if (productoActivo) {
      await updateProducto(productoActivo.id, formData);
      Swal.fire("Actualizado", "Producto actualizado correctamente.", "success");
    } else {
      const nuevoProductoData = { ...formData, empresaId: user.uid };
      await addProducto(nuevoProductoData);
      Swal.fire("Añadido", "Producto añadido correctamente.", "success");
    }
    setShowModal(false);
    cargarProductos();
  } catch (error) {
    Swal.fire("Error", "No se pudo guardar el producto.", "error");
    console.error("Error al guardar producto:", error);
  }
};


    try {
      if (productoActivo) {
        await updateProducto(productoActivo.id, formData);
        Swal.fire("Actualizado", "Producto actualizado correctamente.", "success");
      } else {
        const nuevoProductoData = { ...formData, empresaId: user.uid };
        await addProducto(nuevoProductoData);
        Swal.fire("Añadido", "Producto añadido correctamente.", "success");
      }
      setShowModal(false);
      cargarProductos();
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar el producto.", "error");
      console.error("Error al guardar producto:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Mis Productos</h3>

      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Buscar por nombre o descripción..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-success" onClick={handleNuevoProducto}>
          Añadir Nuevo Producto
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Vencimiento</th>
              <th>Estado</th>
              <th>Tipo de Precio</th> {/* Nueva columna para tipo de precio */}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.length > 0 ? (
              productosFiltrados.map((prod) => (
                <tr key={prod.id}>
                  <td>{prod.nombre}</td>
                  <td>{prod.descripcion}</td>
                  <td>${prod.precio?.toLocaleString() || 'N/A'}</td>
                  <td>{prod.cantidad || 'N/A'}</td>
                  <td>{prod.vencimiento ? new Date(prod.vencimiento).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <span className={`badge ${
                      prod.estado === 'Disponible' ? 'bg-success' :
                      prod.estado === 'Reservado' ? 'bg-warning text-dark' :
                      prod.estado === 'Vendido' ? 'bg-danger' :
                      'bg-secondary'
                    }`}>
                      {prod.estado || 'N/A'}
                    </span>
                  </td>
                  <td>{prod.tipoPrecio || 'N/A'}</td> {/* Mostrar el tipo de precio */}
                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleEditar(prod)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleEliminar(prod.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">No tienes productos registrados o no coinciden con la búsqueda.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ProductoModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        productoInicial={productoActivo}
        handleSave={handleSaveProducto}
      />
    </div>
  );
}