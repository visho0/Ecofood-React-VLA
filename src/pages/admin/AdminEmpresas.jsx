import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getEmpresas, addEmpresa, updateEmpresa, deleteEmpresa } from "../../services/adminService";

export default function AdminEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [empresaActiva, setEmpresaActiva] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ nombre: "", rut: "", direccion: "", comuna: "", email: "", telefono: "" });

  const cargarEmpresas = async () => {
    const data = await getEmpresas();
    setEmpresas(data);
  };

  const guardarEmpresa = async (e) => {
    e.preventDefault();
    try {
      if (empresaActiva) {
        await updateEmpresa(empresaActiva.id, formData);
        Swal.fire("Empresa Actualizada", "", "success");
      } else {
        await addEmpresa(formData);
        Swal.fire("Empresa Agregada", "", "success");
      }
      setShowModal(false);
      setEmpresaActiva(null);
      setFormData({ nombre: "", rut: "", direccion: "", comuna: "", email: "", telefono: "" });
      cargarEmpresas();
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar la empresa. " + error.message, "error");
    }
  };

  const eliminarEmpresa = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar empresa?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No, cancelar"
    });

    if (result.isConfirmed) {
      try {
        await deleteEmpresa(id);
        Swal.fire("Eliminada!", "La empresa ha sido eliminada.", "success");
        cargarEmpresas();
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar la empresa.", "error");
      }
    }
  };

  useEffect(() => {
    cargarEmpresas();
  }, []);

  return (
    <div className="container mt-4">
      <h3>Gestión de Empresas</h3>
      <button className="btn btn-primary mb-3" onClick={() => { setEmpresaActiva(null); setFormData({ nombre: "", rut: "", direccion: "", comuna: "", email: "", telefono: "" }); setShowModal(true); }}>Nueva Empresa</button>

      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>RUT</th>
            <th>Dirección</th>
            <th>Comuna</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empresas.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.nombre}</td>
              <td>{emp.rut}</td>
              <td>{emp.direccion}</td>
              <td>{emp.comuna}</td>
              <td>{emp.email}</td>
              <td>{emp.telefono}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => { setEmpresaActiva(emp); setFormData(emp); setShowModal(true); }}>Editar</button>
                <button className="btn btn-danger btn-sm" onClick={() => eliminarEmpresa(emp.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de Empresa */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{empresaActiva ? "Editar Empresa" : "Nueva Empresa"}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <input className="form-control mb-2" placeholder="Nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
                <input className="form-control mb-2" placeholder="RUT" value={formData.rut} onChange={(e) => setFormData({ ...formData, rut: e.target.value })} />
                <input className="form-control mb-2" placeholder="Dirección" value={formData.direccion} onChange={(e) => setFormData({ ...formData, direccion: e.target.value })} />
                <input className="form-control mb-2" placeholder="Comuna" value={formData.comuna} onChange={(e) => setFormData({ ...formData, comuna: e.target.value })} />
                <input className="form-control mb-2" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                <input className="form-control mb-2" placeholder="Teléfono" value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button className="btn btn-success" onClick={guardarEmpresa}>Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}