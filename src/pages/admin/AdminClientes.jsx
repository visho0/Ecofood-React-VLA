// src/pages/admin/AdminClientes.jsx (Confirmado con la versión de la Guía 7)
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getClientes,
  updateCliente, // Mantener para edición de datos de Firestore
  deleteCliente,
  registrarClienteConAuth // Para añadir nuevos clientes (con cuenta de auth)
} from "../../services/clienteFirebase";

export default function AdminClientes() {
  const [clientes, setClientes] = useState([]);
  const [clienteActivo, setClienteActivo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  // Añade password para el formulario, solo se usará para registrar
  const [formData, setFormData] = useState({ nombre: "", email: "", comuna: "", password: "" });

  const cargarClientes = async () => {
    const data = await getClientes(); // getClientes ya filtra por tipo: "cliente"
    setClientes(data);
  };

  const guardar = async (e) => {
    e.preventDefault();
    try {
      if (clienteActivo) {
        // Si es una edición, solo actualiza los datos de Firestore
        await updateCliente(clienteActivo.id, {
          nombre: formData.nombre,
          email: formData.email, // Podría ser complejo cambiar el email de Auth. Asumimos que no se cambia aquí.
          comuna: formData.comuna
        });
        Swal.fire("Cliente Actualizado", "", "success");
      } else {
        // Si es un nuevo cliente, usa registrarClienteConAuth para crear la cuenta y los datos
        await registrarClienteConAuth(formData);
        Swal.fire("Cliente Registrado", "Se envió un correo de verificación al cliente.", "success");
      }
      setShowModal(false);
      setClienteActivo(null);
      setFormData({ nombre: "", email: "", comuna: "", password: "" }); // Resetear formulario
      cargarClientes();
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar el cliente. " + error.message, "error");
    }
  };

  const eliminar = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar cliente?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No, cancelar"
    });

    if (result.isConfirmed) {
      try {
        await deleteCliente(id);
        Swal.fire("Eliminado!", "El cliente ha sido eliminado.", "success");
        cargarClientes();
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el cliente.", "error");
      }
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  return (
    <div className="container mt-4">
      <h3>Clientes Registrados</h3>
      <button className="btn btn-primary" onClick={() => { setClienteActivo(null); setFormData({ nombre: "", email: "", comuna: "", password: "" }); setShowModal(true); }}>Nuevo Cliente</button>

      <table className="table mt-3">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Comuna</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.id}>
              <td>{c.nombre}</td>
              <td>{c.email}</td>
              <td>{c.comuna}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => { setClienteActivo(c); setFormData(c); setShowModal(true); }}>Editar</button>
                <button className="btn btn-danger btn-sm" onClick={() => eliminar(c.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de Nuevo/Editar Cliente */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{clienteActivo ? "Editar Cliente" : "Nuevo Cliente"}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <input className="form-control mb-2" placeholder="Nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
                <input className="form-control mb-2" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                <input className="form-control mb-2" placeholder="Comuna" value={formData.comuna} onChange={(e) => setFormData({ ...formData, comuna: e.target.value })} />
                {!clienteActivo && (
                  <input type="password" className="form-control mb-2" placeholder="Contraseña" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button className="btn btn-success" onClick={guardar}>Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}