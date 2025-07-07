import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // ✅ Ahora importa App en lugar de AppRouter
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App /> {/* ✅ Renderiza el componente App.jsx */}
  </React.StrictMode>
);
