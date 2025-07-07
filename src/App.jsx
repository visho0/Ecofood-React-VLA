import { BrowserRouter } from "react-router-dom";       // Necesario para el enrutamiento
import AppRouter from "./routes/AppRouter";             // Tu archivo de configuración de rutas
import { AuthProvider } from "./context/AuthProvider";   // Tu contexto de autenticación
import './App.css';                                     // Mantener tu archivo CSS principal si lo usas

// Este es el ÚNICO componente App principal de tu aplicación
function App() {
  return (
    // BrowserRouter debe envolver toda la aplicación que usa React Router
    <BrowserRouter>
      {/* AuthProvider debe envolver AppRouter para que el contexto de autenticación esté disponible */}
      <AuthProvider>
        {/* Aquí es donde se renderizan todas tus rutas definidas en AppRouter */}
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;