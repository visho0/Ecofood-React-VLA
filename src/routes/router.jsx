import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
function AppRouter() {
 return (
 <BrowserRouter>
 <Routes>
 <Route path="/" element={<Home />} />
 <Route path="/login" element={<Login />} />
 </Routes>
 </BrowserRouter>
 );
}
export default AppRouter;

<><Link to="/login">Volver al inicio de sesión</Link><Link to="/register">Crear cuenta</Link><Link to="/reset-password">¿Olvidaste tu contraseña?</Link></>
