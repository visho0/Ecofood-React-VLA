import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getClienteById, updateCliente } from '../../services/clienteService.js';

const EditarPerfil = () => {
  const { user, userData, loading: authLoading } = useAuth();
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("EditarPerfil: Render. authLoading:", authLoading, "user (desde contexto):", user, "userData (desde contexto):", userData);

  useEffect(() => {
    console.log("EditarPerfil: useEffect de carga de datos de perfil ejecutado.");
    console.log("EditarPerfil: En useEffect - authLoading:", authLoading, "user:", user, "userData:", userData);

    const fetchClienteData = async () => {
      if (authLoading || !user) {
        console.log("EditarPerfil: AuthContext aún está cargando o user no está disponible. Esperando...");
        setLoading(true); 
        return;
      }

      if (!user.uid) {
        console.log("EditarPerfil: User disponible, pero user.uid no existe (posiblemente no logueado).");
        setLoading(false); 
        setError("No se pudo obtener el ID de usuario. Asegúrate de haber iniciado sesión.");
        setCliente(null);
        return;
      }

      console.log("EditarPerfil: UID de usuario disponible (desde user.uid):", user.uid); 
      try {
        setLoading(true); 
        const data = await getClienteById(user.uid); 
        console.log("EditarPerfil: Datos de cliente de Firestore (desde getClienteById):", data);
        if (data) {
          setCliente(data);
          setError(null);
        } else {
          setError("No se encontraron datos para este perfil. Crea uno si es necesario.");
          setCliente(null);
        }
      } catch (err) {
        console.error("EditarPerfil: Error al cargar los datos del cliente:", err);
        setError("Error al cargar los datos del perfil. Intente de nuevo más tarde.");
        setCliente(null);
      } finally {
        setLoading(false);
      }
    };

    fetchClienteData();
  }, [user, userData, authLoading]);

  const handleChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user && user.uid) { 
      try {
        await updateCliente(user.uid, cliente); 
        alert("Perfil actualizado correctamente");
      } catch (updateError) {
        console.error("Error al actualizar el perfil:", updateError);
        alert("Error al actualizar el perfil. Por favor, intente de nuevo.");
      }
    } else {
      alert("No se pudo obtener el ID de usuario para actualizar el perfil.");
    }
  };

  if (loading || authLoading) {
    return <p>Cargando datos del perfil...</p>;
  }

  if (error) {
    return <p className="alert alert-danger">{error}</p>;
  }

  if (!cliente) {
    return <p>No se pudieron cargar los datos del perfil. Asegúrate de que tu perfil exista o intente recargar la página.</p>;
  }

  return (
    <div className="container mt-4">
      <h3>Editar Perfil</h3>
      <form onSubmit={handleSubmit}>
        <input name="nombre" value={cliente.nombre || ''} onChange={handleChange} className="form-control my-2" placeholder="Nombre" />
        <input name="direccion" value={cliente.direccion || ''} onChange={handleChange} className="form-control my-2" placeholder="Dirección" />
        <input name="comuna" value={cliente.comuna || ''} onChange={handleChange} className="form-control my-2" placeholder="Comuna" />
        <input name="email" value={cliente.email || user?.email || ''} disabled className="form-control my-2" />
        <button className="btn btn-primary">Guardar</button>
      </form>
    </div>
  );
};

export default EditarPerfil;