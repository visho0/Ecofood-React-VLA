import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { getSolicitudesPorEmpresa, updateSolicitud } from '../../services/pedidoService';
import { useAuth } from '../../context/AuthContext';
import { getUserData } from '../../services/userService'; // Para obtener el nombre del cliente

export default function SolicitudesEmpresa() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth(); // Renombrar loading de useAuth para evitar conflicto

  const cargarSolicitudes = async () => {
    if (user && user.uid) {
      setLoading(true);
      try {
        const data = await getSolicitudesPorEmpresa(user.uid);

        // Para mostrar el nombre del cliente en lugar del UID
        const solicitudesConNombres = await Promise.all(
          data.map(async (solicitud) => {
            const clienteData = await getUserData(solicitud.clienteId);
            return {
              ...solicitud,
              nombreCliente: clienteData ? clienteData.nombre || 'Cliente Desconocido' : 'Cliente Desconocido',
            };
          })
        );
        setSolicitudes(solicitudesConNombres);
      } catch (error) {
        Swal.fire("Error", "No se pudieron cargar las solicitudes.", "error");
        console.error("Error al cargar solicitudes por empresa:", error);
      } finally {
        setLoading(false);
      }
    } else if (!authLoading) { // Si no hay usuario y ya terminó de cargar la autenticación
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      cargarSolicitudes();
    }
  }, [user, authLoading]);

  const manejarCambioEstado = async (solicitudId, nuevoEstado) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas cambiar el estado de esta solicitud a "${nuevoEstado}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cambiar'
    });

    if (result.isConfirmed) {
      try {
        await updateSolicitud(solicitudId, { estado: nuevoEstado });
        Swal.fire('¡Actualizado!', 'El estado de la solicitud ha sido cambiado.', 'success');
        cargarSolicitudes(); // Recargar solicitudes para reflejar el cambio
      } catch (error) {
        Swal.fire("Error", "No se pudo actualizar el estado de la solicitud.", "error");
        console.error("Error al actualizar estado de solicitud:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando solicitudes...</span>
        </div>
        <p>Cargando solicitudes...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mt-4">
        <p>Debes iniciar sesión como empresa para ver las solicitudes.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Solicitudes Recibidas</h3>

      <div className="table-responsive">
        <table className="table table-striped table-hover table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Producto</th>
              <th>Cliente</th>
              <th>Comentario Cliente</th>
              <th>Fecha Solicitud</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.length > 0 ? (
              solicitudes.map((solicitud) => (
                <tr key={solicitud.id}>
                  <td>{solicitud.nombreProducto || 'N/A'}</td>
                  <td>{solicitud.nombreCliente || solicitud.clienteId || 'N/A'}</td> {/* Mostrar nombre o UID */}
                  <td>{solicitud.comentario || 'Sin comentario'}</td>
                  <td>{solicitud.fechaSolicitud ? new Date(solicitud.fechaSolicitud).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <span className={`badge ${
                      solicitud.estado === 'Pendiente' ? 'bg-warning text-dark' :
                      solicitud.estado === 'Aceptada' ? 'bg-success' :
                      solicitud.estado === 'Rechazada' ? 'bg-danger' :
                      solicitud.estado === 'Completada' ? 'bg-primary' :
                      'bg-secondary'
                    }`}>
                      {solicitud.estado || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={solicitud.estado}
                      onChange={(e) => manejarCambioEstado(solicitud.id, e.target.value)}
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="Aceptada">Aceptada</option>
                      <option value="Rechazada">Rechazada</option>
                      <option value="Completada">Completada</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No hay solicitudes recibidas para tus productos.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}