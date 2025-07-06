// En src/components/cliente/ClienteLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@common/Header'; // ¡USA EL ALIAS!
import Sidebar from '@common/Sidebar'; // ¡USA EL ALIAS!
// import NavCliente from './NavCliente'; // <--- Puedes eliminar o comentar esta línea

export default function ClienteLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <div className="d-flex flex-grow-1">
        <Sidebar />
        <main className="flex-grow-1 p-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
}