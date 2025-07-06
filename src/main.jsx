import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './routes/AppRouter'; // ¡RUTA CORRECTA AQUÍ: './routes/AppRouter'!
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/* BrowserRouter es necesario para que React Router funcione */}
        <BrowserRouter>
            {/* AuthProvider envuelve todo el enrutador para que el contexto esté disponible */}
            <AuthProvider>
                {/* Aquí se monta tu AppRouter con todas tus rutas */}
                <AppRouter />
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);