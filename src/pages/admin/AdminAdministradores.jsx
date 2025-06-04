import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import {
  getAdministradores,
  addAdminConAuth,
  updateAdminData,
  deleteAdmin,
  getAdminPrincipal
} from "../../services/adminService";

export default function AdminAdministradores() {
  const [administradores, setAdministradores] = useState([]);
  const [adminActivo, setAdminActivo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ nombre: "", email: "", password: "" });
  const { user } = useAuth(); 

  const cargarAdministradores = async () => {
    const data = await getAdministradores();
    setAdministradores(data);
  };

  const guardarAdmin = async (e) => {
    e.preventDefault();
    try {
      if (adminActivo) {
        await updateAdminData(adminActivo.id, {
          nombre: formData.nombre,
          
        });
        Swal.fire("Administrador Actualizado", "", "success");
      } else {
        await addAdminConAuth(formData);
        Swal.fire("Administrador Registrado", "Se envió un correo de verificación.", "success");
      }
      setShowModal(false);
      setAdminActivo(null);
      setFormData({ nombre: "", email: "", password: "" });
      cargarAdministradores();
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar el administrador. " + error.message, "error");
    }
  };

  const eliminarAdmin = async (id) => {
    const principal = await getAdminPrincipal();
    if (principal && principal.id === id) {
      Swal.fire("Error", "No se puede eliminar el administrador principal.", "error");
      return;
    }

    if (user && user.uid === id) {
      Swal.fire("Error", "No puedes eliminar tu propia cuenta mientras estás logueado.", "error");
      return;
    }

    const result = await Swal.fire({
      title: "¿Eliminar administrador?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No, cancelar"
    });

    if (result.isConfirmed) {
      try {
        await deleteAdmin(id);
        Swal.fire("Eliminado!", "El administrador ha sido eliminado.", "success");
        cargarAdministradores();
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el administrador.", "error");
      }
    }
  };

  useEffect(() => {
    cargarAdministradores();
  }, []);

  return (
    <div className="container mt-4">
      <h3>Gestión de Administradores</h3>
      <button className="btn btn-primary mb-3" onClick={() => { setAdminActivo(null); setFormData({ nombre: "", email: "", password: "" }); setShowModal(true); }}>Nuevo Administrador</button>

      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {administradores.map((admin) => (
            <tr key={admin.id}>
              <td>{admin.nombre}</td>
              <td>{admin.email}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => { setAdminActivo(admin); setFormData(admin); setShowModal(true); }}>Editar</button>
                <button className="btn btn-danger btn-sm" onClick={() => eliminarAdmin(admin.id)}>Eliminar</button>
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
                <h5 className="modal-title">{adminActivo ? "Editar Administrador" : "Nuevo Administrador"}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <input className="form-control mb-2" placeholder="Nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
                {!adminActivo && (
                  <>
                    <input className="form-control mb-2" type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    <input className="form-control mb-2" type="password" placeholder="Contraseña" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button className="btn btn-success" onClick={guardarAdmin}>Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}