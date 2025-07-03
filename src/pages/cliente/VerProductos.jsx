import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getProductos } from "../../services/productoService";
import { crearSolicitud } from "../../services/pedidoService";
import { useAuth } from "../../context/AuthContext";

export default function VerProductosCliente() {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [filtroEmpresaId, setFiltroEmpresaId] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroUbicacion, setFiltroUbicacion] = useState("");
  const [filtroTipoPrecio, setFiltroTipoPrecio] = useState(""); // Nuevo estado para el filtro de tipo de precio
  const [empresasUnicas, setEmpresasUnicas] = useState([]);
  const [estadosUnicos, setEstadosUnicos] = useState([]);
  const [ubicacionesUnicas, setUbicacionesUnicas] = useState([]);
  const [tiposPrecioUnicos, setTiposPrecioUnicos] = useState([]); // Nuevo estado para tipos de precio únicos
  const [orden, setOrden] = useState({ campo: "", direccion: "" });

  const { user } = useAuth();

  useEffect(() => {
    const cargarProductosYFiltros = async () => {
      try {
        const data = await getProductos();
        setProductos(data);

        // Obtener listas únicas para filtros
        const empresas = [...new Set(data.map(p => p.empresaId).filter(Boolean))];
        setEmpresasUnicas(empresas);

        const estados = [...new Set(data.map(p => p.estado).filter(Boolean))];
        setEstadosUnicos(estados);

        const ubicaciones = [...new Set(data.map(p => p.ubicacion).filter(Boolean))];
        setUbicacionesUnicas(ubicaciones);

        const tiposPrecio = [...new Set(data.map(p => p.tipoPrecio).filter(Boolean))]; // Recolectar tipos de precio únicos
        setTiposPrecioUnicos(tiposPrecio);

      } catch (error) {
        Swal.fire("Error", "No se pudieron cargar los productos.", "error");
        console.error("Error al cargar productos:", error);
      }
    };

    cargarProductosYFiltros();
  }, []);

  useEffect(() => {
    let productosTemp = [...productos];

    // Aplicar filtros
    if (filtroEmpresaId) {
      productosTemp = productosTemp.filter(p => p.empresaId === filtroEmpresaId);
    }
    if (filtroEstado) {
      productosTemp = productosTemp.filter(p => p.estado === filtroEstado);
    }
    if (filtroUbicacion) {
      productosTemp = productosTemp.filter(p => p.ubicacion && p.ubicacion.toLowerCase().includes(filtroUbicacion.toLowerCase()));
    }
    if (filtroTipoPrecio) { // Aplicar filtro de tipo de precio
      productosTemp = productosTemp.filter(p => p.tipoPrecio === filtroTipoPrecio);
    }

    // Aplicar ordenamiento
    if (orden.campo) {
      productosTemp.sort((a, b) => {
        const valA = typeof a[orden.campo] === 'string' ? a[orden.campo].toLowerCase() : a[orden.campo];
        const valB = typeof b[orden.campo] === 'string' ? b[orden.campo].toLowerCase() : b[orden.campo];

        if (valA < valB) return orden.direccion === 'asc' ? -1 : 1;
        if (valA > valB) return orden.direccion === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setProductosFiltrados(productosTemp);
  }, [productos, filtroEmpresaId, filtroEstado, filtroUbicacion, filtroTipoPrecio, orden]); // Añadir filtroTipoPrecio a las dependencias

  const manejarSolicitud = async (producto) => {
    if (!user) {
      Swal.fire("Error", "Debes iniciar sesión para solicitar un producto.", "error");
      return;
    }

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
      try {
        const solicitudData = {
          productoId: producto.id,
          nombreProducto: producto.nombre,
          empresaId: producto.empresaId,
          clienteId: user.uid,
          comentario: comentario || "Sin mensaje adicional",
          estado: "Pendiente",
          fechaSolicitud: new Date().toISOString()
        };
        await crearSolicitud(solicitudData);
        Swal.fire("Solicitud enviada", "Tu solicitud fue registrada correctamente.", "success");
      } catch (error) {
        Swal.fire("Error", "No se pudo enviar la solicitud.", "error");
        console.error("Error al crear solicitud:", error);
      }
    }
  };

  const handleOrdenChange = (campo) => {
    setOrden(prevOrden => ({
      campo,
      direccion: prevOrden.campo === campo && prevOrden.direccion === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Productos Disponibles</h3>

      {/* Controles de Filtro y Ordenamiento */}
      <div className="row mb-3">
        <div className="col-md-3 mb-2">
          <select
            className="form-select"
            value={filtroEmpresaId}
            onChange={(e) => setFiltroEmpresaId(e.target.value)}
          >
            <option value="">Todas las Empresas</option>
            {empresasUnicas.map((empresa) => (
              <option key={empresa} value={empresa}>{empresa}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3 mb-2">
          <select
            className="form-select"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="">Todos los Estados</option>
            {estadosUnicos.map((estado) => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Filtrar por Ubicación"
            value={filtroUbicacion}
            onChange={(e) => setFiltroUbicacion(e.target.value)}
          />
        </div>
        <div className="col-md-3 mb-2">
          {/* Nuevo filtro para Tipo de Precio */}
          <select
            className="form-select"
            value={filtroTipoPrecio}
            onChange={(e) => setFiltroTipoPrecio(e.target.value)}
          >
            <option value="">Todos los Tipos</option>
            {tiposPrecioUnicos.map((tipo) => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3 mb-2">
          <select
            className="form-select"
            onChange={(e) => handleOrdenChange(e.target.value)}
            value={orden.campo}
          >
            <option value="">Ordenar por...</option>
            <option value="nombre">Nombre</option>
            <option value="precio">Precio</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover table-bordered">
          <thead className="table-dark">
            <tr>
              <th onClick={() => handleOrdenChange('nombre')} style={{ cursor: 'pointer' }}>
                Nombre {orden.campo === 'nombre' && (orden.direccion === 'asc' ? '▲' : '▼')}
              </th>
              <th>Descripción</th>
              <th onClick={() => handleOrdenChange('precio')} style={{ cursor: 'pointer' }}>
                Precio {orden.campo === 'precio' && (orden.direccion === 'asc' ? '▲' : '▼')}
              </th>
              <th>Cantidad</th>
              <th>Vencimiento</th>
              <th>Estado</th>
              <th>Tipo de Precio</th> {/* Nueva columna para tipo de precio */}
              <th>Empresa</th>
              <th>Ubicación</th>
              <th>Acción</th>
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
                  <td>{prod.empresaId || 'N/A'}</td>
                  <td>{prod.ubicacion || 'N/A'}</td>
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
                <td colSpan="10" className="text-center">No hay productos disponibles con los filtros aplicados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}