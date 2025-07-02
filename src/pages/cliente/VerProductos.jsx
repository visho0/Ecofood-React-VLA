import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getProductos } from "../../services/productoService";

export default function VerProductosCliente() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const data = await getProductos();
        setProductos(data);
      } catch (error) {
        Swal.fire("Error", "No se pudieron cargar los productos.", "error");
      }
    };

    cargarProductos();
  }, []);

  const manejarSolicitud = async (producto) => {
    const { value: comentario } = await Swal.fire({
      title: `Solicitar "${producto.nombre}"`,
      input: 'textarea',
      inputLabel: 'Mensaje para el administrador (opcional)',
      inputPlaceholder: 'Ej: Necesito este producto urgente...',
      inputAttributes: {
        'aria-label': 'Mensaje para el administrador',
      },
      showCancelButton: true,
      confirmButtonText: "Enviar Solicitud",
      cancelButtonText: "Cancelar"
    });

    if (comentario !== undefined) {
      // Aquí puedes enviar la solicitud al backend o guardar en Firebase
      console.log("Solicitud enviada:", {
        productoId: producto.id,
        nombre: producto.nombre,
        comentario: comentario || "Sin mensaje adicional"
      });

      Swal.fire("Solicitud enviada", "Tu solicitud fue registrada correctamente.", "success");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Productos Disponibles</h3>

      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>ID Empresa</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {productos.length > 0 ? (
            productos.map((prod) => (
              <tr key={prod.id}>
                <td>{prod.nombre}</td>
                <td>{prod.descripcion}</td>
                <td>${prod.precio.toLocaleString()}</td>
                <td>{prod.stock}</td>
                <td>{prod.empresaId}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => manejarSolicitud(prod)}
                  >
                    Solicitar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">No hay productos disponibles.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
