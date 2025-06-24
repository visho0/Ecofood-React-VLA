import React, { useState, useEffect } from 'react';
import { getClienteById, updateCliente } from '../../services/clienteService.js';

const EditarPerfil = () => {
  const [cliente, setCliente] = useState(null);

  useEffect(() => {
    getClienteById("uidCliente").then(setCliente); // reemplaza con uid real
  }, []);

  const handleChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateCliente("uidCliente", cliente);
    alert("Perfil actualizado correctamente");
  };

  if (!cliente) return <p>Cargando datos...</p>;

  return (
    <div className="container mt-4">
      <h3>Editar Perfil</h3>
      <form onSubmit={handleSubmit}>
        <input name="nombre" value={cliente.nombre} onChange={handleChange} className="form-control my-2" placeholder="Nombre" />
        <input name="direccion" value={cliente.direccion} onChange={handleChange} className="form-control my-2" placeholder="Dirección" />
        <input name="comuna" value={cliente.comuna} onChange={handleChange} className="form-control my-2" placeholder="Comuna" />
        <input name="email" value={cliente.email} disabled className="form-control my-2" />
        <button className="btn btn-primary">Guardar</button>
      </form>
    </div>
  );
};

export default EditarPerfil;
