import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
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

      console.log(cred, cred.user.uid);

      const datos = await getUserData(cred.user.uid);

      if (datos && datos.tipo) {
          if (datos.tipo === "admin") {
            navigate("/admin/dashboard");
          } else if (datos.tipo === "cliente") {
            navigate("/cliente/dashboard");
          } else if (datos.tipo === "empresa") {
            navigate("/empresa/perfil"); // Cambiado a /empresa/perfil según AppRouter.jsx
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
    // Contenedor principal para centrar el formulario en la pantalla
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row justify-content-center w-100">
        <div className="col-12 col-md-8 col-lg-6 col-xl-5"> {/* Columnas para controlar el ancho del formulario */}
          <div className="card shadow-lg"> {/* Tarjeta con sombra */}
            <div className="card-header text-center bg-primary text-white p-3">
              <h2 className="mb-0">Iniciar Sesión</h2>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="emailInput" className="form-label">Correo Electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    id="emailInput"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="passwordInput" className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    id="passwordInput"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="d-grid gap-2"> {/* Botones apilados con un poco de espacio */}
                    <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
                    <Link to="/recuperar-contrasena" className="btn btn-link">
                      ¿Olvidaste tu contraseña?
                    </Link>
                </div>
              </form>
            </div>
            <div className="card-footer text-center p-3">
              <p className="mb-0">¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}