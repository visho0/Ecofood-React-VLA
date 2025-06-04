import React from 'react';

const AdminUsuarios = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>
      <p className="text-gray-600">Aquí podrás ver, editar y eliminar usuarios registrados.</p>

      {/* Aquí podrías poner una tabla o lista más adelante */}
      <div className="mt-6 border rounded p-4 bg-white shadow">
        <p className="text-center text-gray-500">No hay usuarios por mostrar todavía.</p>
      </div>
    </div>
  );
};

export default AdminUsuarios;
