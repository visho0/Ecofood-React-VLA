import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getProductos, addProducto, updateProducto, deleteProducto } from "../../services/productoService"; 



export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [productoActivo, setProductoActivo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ nombre: "", descripcion: "", precio: 0, stock: 0, empresaId: "" }); 


  const cargarProductos = async () => {
    const data = await getProductos();
    setProductos(data);
  };

  

  const guardarProducto = async (e) => {
    e.preventDefault();
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
      <button className="btn btn-primary mb-3" onClick={() => { setProductoActivo(null); setFormData({ nombre: "", descripcion: "", precio: 0, stock: 0, empresaId: "" }); setShowModal(true); }}>Nuevo Producto</button>

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
              <td>{prod.precio}</td>
              <td>{prod.stock}</td>
              <td>{prod.empresaId}</td> 
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => { setProductoActivo(prod); setFormData(prod); setShowModal(true); }}>Editar</button>
                <button className="btn btn-danger btn-sm" onClick={() => eliminarProducto(prod.id)}>Eliminar</button>
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
                <input className="form-control mb-2" placeholder="Nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
                <textarea className="form-control mb-2" placeholder="Descripción" value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}></textarea>
                <input type="number" className="form-control mb-2" placeholder="Precio" value={formData.precio} onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) || 0 })} />
                <input type="number" className="form-control mb-2" placeholder="Stock" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })} />
                <input className="form-control mb-2" placeholder="ID de Empresa" value={formData.empresaId} onChange={(e) => setFormData({ ...formData, empresaId: e.target.value })} />

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