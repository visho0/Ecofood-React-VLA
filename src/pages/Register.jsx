import { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import { saveUserData } from "../services/userService";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("cliente");
  const [phone, setPhone] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      console.log("Usuario creado:", cred.user.uid, { nombre, tipo, email, phone } );
      await saveUserData(cred.user.uid, { nombre, tipo, email, phone });


      await sendEmailVerification(cred.user);

      Swal.fire("Registrado", "Usuario creado correctamente", "success");
      navigate("/login");
    } catch (error) {
      Swal.fire("Error", "No se pudo registrar", "error");
      // ¡Aquí se ha añadido el console.error para ver más detalles!
      console.error("Error detallado de registro:", error);
    }
  };

  return (
    // Contenedor principal para centrar el formulario en la pantalla
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row justify-content-center w-100">
        <div className="col-12 col-md-8 col-lg-6 col-xl-5"> {/* Columnas para controlar el ancho del formulario */}
          <div className="card shadow-lg"> {/* Tarjeta con sombra */}
            <div className="card-header text-center bg-success text-white p-3"> {/* Color diferente para distinguir */}
              <h2 className="mb-0">Registro</h2>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label htmlFor="nombreInput" className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombreInput"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>

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

                <div className="mb-3">
                  <label htmlFor="phoneInput" className="form-label">Teléfono</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phoneInput"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    pattern="[0-9]{10,15}"
                    minLength={10}
                    maxLength={15}
                    placeholder="Ej. 3001234567"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="tipoUsuarioSelect" className="form-label">Tipo de usuario</label>
                  <select
                    className="form-select"
                    id="tipoUsuarioSelect"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                  >
                    <option value="cliente">Cliente</option>
                    <option value="empresa">Empresa</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                <div className="d-grid gap-2"> {/* Botones apilados con un poco de espacio */}
                    <button type="submit" className="btn btn-success">Registrarse</button>
                </div>
              </form>
            </div>
            <div className="card-footer text-center p-3">
              <p className="mb-0">
                ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}