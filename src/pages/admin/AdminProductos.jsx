import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getProductos, addProducto, updateProducto, deleteProducto } from "../../services/productoService";

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [productoActivo, setProductoActivo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    nombre: "", 
    descripcion: "", 
    precio: 0, 
    stock: 0, 
    empresaId: "" 
  });

  // Límites de caracteres y validaciones
  const LIMITES = {
    nombre: 100,
    descripcion: 500,
    precio: { min: 0, max: 9999999 },
    stock: { min: 0, max: 99999 },
    empresaId: 10
  };

  const cargarProductos = async () => {
    const data = await getProductos();
    setProductos(data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validaciones específicas para cada campo
    switch(name) {
      case 'nombre':
        if (value.length <= LIMITES.nombre) {
          setFormData({ ...formData, [name]: value });
        }
        break;
      case 'descripcion':
        if (value.length <= LIMITES.descripcion) {
          setFormData({ ...formData, [name]: value });
        }
        break;
      case 'precio':
        const precioValue = parseFloat(value) || 0;
        if (precioValue >= LIMITES.precio.min && precioValue <= LIMITES.precio.max) {
          setFormData({ ...formData, [name]: precioValue });
        }
        break;
      case 'stock':
        const stockValue = parseInt(value) || 0;
        if (stockValue >= LIMITES.stock.min && stockValue <= LIMITES.stock.max) {
          setFormData({ ...formData, [name]: stockValue });
        }
        break;
      case 'empresaId':
        if (value.length <= LIMITES.empresaId) {
          setFormData({ ...formData, [name]: value });
        }
        break;
      default:
        setFormData({ ...formData, [name]: value });
    }
  };

  const guardarProducto = async (e) => {
    e.preventDefault();
    
    // Validaciones antes de guardar
    if (!formData.nombre.trim()) {
      Swal.fire("Error", "El nombre del producto es obligatorio", "error");
      return;
    }
    
    if (formData.precio <= 0) {
      Swal.fire("Error", "El precio debe ser mayor a 0", "error");
      return;
    }
    
    if (formData.stock < 0) {
      Swal.fire("Error", "El stock no puede ser negativo", "error");
      return;
    }

    try {
      if (productoActivo) {
        await updateProducto(productoActivo.id, formData);
        Swal.fire("Producto Actualizado", "", "success");
      } else {
        await addProducto(formData);
        Swal.fire("Producto Agregado", "", "success");
      }
      setShowModal(false);
      setProductoActivo(null);
      setFormData({ nombre: "", descripcion: "", precio: 0, stock: 0, empresaId: "" });
      cargarProductos();
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar el producto. " + error.message, "error");
    }
  };

  const eliminarProducto = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar producto?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No, cancelar"
    });

    if (result.isConfirmed) {
      try {
        await deleteProducto(id);
        Swal.fire("Eliminado!", "El producto ha sido eliminado.", "success");
        cargarProductos();
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el producto.", "error");
      }
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  return (
    <div className="container mt-4">
      <h3>Gestión de Productos</h3>
      <button 
        className="btn btn-primary mb-3" 
        onClick={() => { 
          setProductoActivo(null); 
          setFormData({ nombre: "", descripcion: "", precio: 0, stock: 0, empresaId: "" }); 
          setShowModal(true); 
        }}
      >
        Nuevo Producto
      </button>

      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>ID Empresa</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((prod) => (
            <tr key={prod.id}>
              <td>{prod.nombre}</td>
              <td>{prod.descripcion}</td>
              <td>${prod.precio.toLocaleString()}</td>
              <td>{prod.stock}</td>
              <td>{prod.empresaId}</td>
              <td>
                <button 
                  className="btn btn-warning btn-sm me-2" 
                  onClick={() => { 
                    setProductoActivo(prod); 
                    setFormData(prod); 
                    setShowModal(true); 
                  }}
                >
                  Editar
                </button>
                <button 
                  className="btn btn-danger btn-sm" 
                  onClick={() => eliminarProducto(prod.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{productoActivo ? "Editar Producto" : "Nuevo Producto"}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <input 
                    className="form-control" 
                    name="nombre"
                    placeholder={`Nombre (máx. ${LIMITES.nombre} caracteres)`} 
                    value={formData.nombre} 
                    onChange={handleInputChange} 
                  />
                  <small className="text-muted">
                    {formData.nombre.length}/{LIMITES.nombre} caracteres
                  </small>
                </div>
                
                <div className="mb-3">
                  <textarea 
                    className="form-control" 
                    name="descripcion"
                    placeholder={`Descripción (máx. ${LIMITES.descripcion} caracteres)`} 
                    value={formData.descripcion} 
                    onChange={handleInputChange} 
                    rows="3"
                  />
                  <small className="text-muted">
                    {formData.descripcion.length}/{LIMITES.descripcion} caracteres
                  </small>
                </div>
                
                <div className="mb-3">
                  <input 
                    type="number" 
                    className="form-control" 
                    name="precio"
                    placeholder={`Precio (entre $${LIMITES.precio.min} y $${LIMITES.precio.max.toLocaleString()})`} 
                    value={formData.precio} 
                    onChange={handleInputChange} 
                    min={LIMITES.precio.min}
                    max={LIMITES.precio.max}
                    step="0.01"
                  />
                </div>
                
                <div className="mb-3">
                  <input 
                    type="number" 
                    className="form-control" 
                    name="stock"
                    placeholder={`Stock (entre ${LIMITES.stock.min} y ${LIMITES.stock.max})`} 
                    value={formData.stock} 
                    onChange={handleInputChange} 
                    min={LIMITES.stock.min}
                    max={LIMITES.stock.max}
                  />
                </div>
                
                <div className="mb-3">
                  <input 
                    className="form-control" 
                    name="empresaId"
                    placeholder={`ID Empresa (máx. ${LIMITES.empresaId} caracteres)`} 
                    value={formData.empresaId} 
                    onChange={handleInputChange} 
                  />
                  <small className="text-muted">
                    {formData.empresaId.length}/{LIMITES.empresaId} caracteres
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button className="btn btn-success" onClick={guardarProducto}>
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}