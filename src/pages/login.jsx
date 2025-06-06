import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";
import { getUserData } from "../services/userService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await setPersistence(auth, browserLocalPersistence);
      const cred = await signInWithEmailAndPassword(auth, email, password);

      if (!cred.user.emailVerified) {
        Swal.fire("Verificación requerida", "Debes verificar tu correo antes de ingresar.", "warning");
        return;
      }

      const datos = await getUserData(cred.user.uid);

      
      if (datos && datos.tipo) { 
          if (datos.tipo === "admin") {
            navigate("/admin/dashboard");
          } else if (datos.tipo === "cliente") {
            navigate("/cliente/dashboard");
          } else if (datos.tipo === "empresa") {
            navigate("/empresa/perfil");
          } else {
            
            Swal.fire("Error", "Tipo de usuario no reconocido. Contacta al soporte.", "error");
          
          }
      } else {
          Swal.fire("Error", "No se pudieron cargar los datos del usuario. Asegúrate de que tu cuenta esté configurada correctamente.", "error");
          
      }

    } catch (error) {
      console.error("Error en handleLogin:", error); 
      Swal.fire("Error", "Credenciales incorrectas o problema al iniciar sesión. " + error.message, "error");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Correo Electrónico</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
      </form>
    </div>
  );
}