import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getProductosByEmpresaId, addProducto, updateProducto, deleteProducto } from "../../services/productoService";
import { useAuth } from "../../context/AuthContext";
import moment from 'moment'; // Importar moment para manejar fechas

export default function ProductosEmpresa() {
  const [productos, setProductos] = useState([]);
  const [productoActivo, setProductoActivo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  // Unificar formData para incluir vencimiento y cantidad
  const [formData, setFormData] = useState({ nombre: "", descripcion: "", precio: 0, stock: 0, vencimiento: "", cantidad: 0, estado: "Disponible" });
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const { user } = useAuth();

  const cargarProductos = async () => {
    if (user && user.uid) {
      const data = await getProductosByEmpresaId(user.uid);
      setProductos(data);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, [user]);

  const handleNuevoProducto = () => {
    setProductoActivo(null);
    setFormData({ nombre: "", descripcion: "", precio: 0, stock: 0, vencimiento: "", cantidad: 0, estado: "Disponible" });
    setShowModal(true);
  };

  const handleEditarProducto = (producto) => {
    setProductoActivo(producto);
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      vencimiento: producto.vencimiento || "", // Asegurarse de cargar vencimiento
      cantidad: producto.cantidad || 0,     // Asegurarse de cargar cantidad
      estado: producto.estado || "Disponible"
    });
    setShowModal(true);
  };

  const guardarProducto = async (e) => {
    e.preventDefault();
    try {
      const productoToSave = { ...formData, empresaId: user.uid };
      if (productoActivo) {
        await updateProducto(productoActivo.id, productoToSave);
        Swal.fire("Producto Actualizado", "", "success");
      } else {
        await addProducto(productoToSave);
        Swal.fire("Producto Agregado", "", "success");
      }
      setShowModal(false);
      setProductoActivo(null);
      setFormData({ nombre: "", descripcion: "", precio: 0, stock: 0, vencimiento: "", cantidad: 0, estado: "Disponible" });
      cargarProductos();
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar el producto. " + error.message, "error");
    }
  };

  const eliminarProducto = async (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#1c1e',
      confirmButtonText: 'Sí, eliminarlo!'
    }).then(async (result) => {
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
        }
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isExpiringSoon = (vencimiento) => {
    if (!vencimiento) return false;
    const expirationDate = moment(vencimiento);
    const today = moment();
    const diffDays = expirationDate.diff(today, 'days');
    return diffDays >= 0 && diffDays <= 3;
  };

  // Filtrado de productos
  const filteredProductos = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Mis Productos</h2>
      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-primary" onClick={handleNuevoProducto}>
          Agregar Nuevo Producto
        </button>
        <input
          type="text"
          className="form-control w-25"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredProductos.length === 0 ? (
        <p>No tienes productos registrados o no se encontraron resultados para la búsqueda.</p>
      ) : (
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Cantidad</th>
              <th>Vencimiento</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProductos.map((producto) => (
              <tr key={producto.id} className={isExpiringSoon(producto.vencimiento) ? 'table-warning' : ''}>
                <td>{producto.nombre}</td>
                <td>{producto.descripcion}</td>
                <td>${producto.precio.toLocaleString()}</td>
                <td>{producto.stock}</td>
                <td>{producto.cantidad}</td>
                <td>
                  {producto.vencimiento}
                  {isExpiringSoon(producto.vencimiento) && (
                    <span className="badge bg-warning ms-2">¡Pronto a vencer!</span>
                  )}
                </td>
                <td>{producto.estado}</td>
                <td>
                  <button
                    className="btn btn-sm btn-info me-2"
                    onClick={() => handleEditarProducto(producto)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => eliminarProducto(producto.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{productoActivo ? "Editar Producto" : "Nuevo Producto"}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
                <textarea
                  className="form-control mb-2"
                  placeholder="Descripción"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                ></textarea>
                <label htmlFor="precio">Precio:</label>
                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Precio"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="stock">Stock:</label>
                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />
                {/* Nuevos campos para vencimiento y cantidad */}
                <label htmlFor="vencimiento">Fecha de Vencimiento</label>
                <input
                  type="date"
                  className="form-control mb-2"
                  placeholder="Fecha de Vencimiento"
                  name="vencimiento"
                  value={formData.vencimiento}
                  onChange={handleChange}
                />
                <label htmlFor="cantidad">Cantidad a Pedir:</label>
                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Cantidad"
                  name="cantidad"
                  value={formData.cantidad}
                  onChange={handleChange}
                  required
                />
                <select
                  className="form-control mb-2"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                >
                  <option value="Disponible">Disponible</option>
                  <option value="Reservado">Reservado</option>
                  <option value="Vendido">Vendido</option>
                </select>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button className="btn btn-success" onClick={guardarProducto}>Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}