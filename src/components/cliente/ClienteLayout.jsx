import React from 'react';
import { Outlet } from 'react-router-dom';
import NavCliente from './NavCliente';

export default function ClienteLayout() {
  return (
    <div>
      <NavCliente />
      <main className="container mt-3">
        <Outlet />
      </main>
    </div>
  );
}