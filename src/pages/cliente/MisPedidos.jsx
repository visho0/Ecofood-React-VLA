import React, { useEffect, useState } from 'react';
import { getSolicitudesPorCliente, updateSolicitud } from '../../services/pedidoService';
import Swal from 'sweetalert2';
import { useAuth } from "../../context/AuthContext";

const MisPedidos = () => {
  const { user } = useAuth();
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    const cargarSolicitudes = async () => {
      if (user && user.uid) {
        try {
          const data = await getSolicitudesPorCliente(user.uid);
          setSolicitudes(data);
        } catch (error) {
          Swal.fire("Error", "No se pudieron cargar tus solicitudes.", "error");
        }
      } else {
        console.warn("Usuario no logueado o UID no disponible para cargar solicitudes.");
        Swal.fire("Advertencia", "Debes iniciar sesión para ver tus solicitudes.", "warning");
      }
    };

    cargarSolicitudes();
  }, [user]);

  const manejarCancelacion = async (solicitudId) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cancelar solicitud'
    });

    if (result.isConfirmed) {
      try {
        await updateSolicitud(solicitudId, { estado: 'Cancelado' });
        Swal.fire(
          '¡Cancelada!',
          'Tu solicitud ha sido marcada como cancelada.',
          'success'
        );
        setSolicitudes(solicitudes.map(s => s.id === solicitudId ? { ...s, estado: 'Cancelado' } : s));
      } catch (error) {
        console.error("Error al cancelar la solicitud:", error);
        Swal.fire("Error", "No se pudo cancelar la solicitud.", "error");
      }
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Mis Solicitudes Realizadas</h3>
      {solicitudes.length === 0 ? (
        <p className="text-center">No tienes solicitudes realizadas aún.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Producto</th>
                <th>Empresa ID</th>
                <th>Estado</th>
                <th>Fecha Solicitud</th>
                <th>Comentario</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.map((solicitud) => (
                <tr key={solicitud.id}>
                  <td>{solicitud.nombreProducto || 'N/A'}</td>
                  <td>{solicitud.empresaId || 'N/A'}</td>
                  <td>
                    <span className={`badge ${
                      solicitud.estado === 'Pendiente' ? 'bg-warning text-dark' :
                      solicitud.estado === 'Aceptada' ? 'bg-success' :
                      solicitud.estado === 'Rechazada' ? 'bg-danger' :
                      'bg-secondary'
                    }`}>
                      {solicitud.estado || 'N/A'}
                    </span>
                  </td>
                  <td>{solicitud.fechaSolicitud ? new Date(solicitud.fechaSolicitud).toLocaleDateString() : 'N/A'}</td>
                  <td>{solicitud.comentario || 'Sin mensaje'}</td>
                  <td>
                    {solicitud.estado === 'Pendiente' && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => manejarCancelacion(solicitud.id)}
                      >
                        Cancelar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MisPedidos;