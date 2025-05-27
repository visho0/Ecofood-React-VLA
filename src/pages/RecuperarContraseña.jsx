import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";

const firebaseErrorMap = {
  "auth/user-not-found": "Usuario no registrado. Verifica el correo.",
  "auth/invalid-email": "El formato del correo electrónico es inválido.",
  "auth/too-many-requests": "Demasiados intentos. Intenta más tarde.",
};

const getErrorMessage = (errorCode) =>
  firebaseErrorMap[errorCode] || "Ocurrió un error inesperado. Intenta de nuevo.";

export default function RecuperarContraseña() {
    const [email, setEmail] = useState("");
    const [submitError, setSubmitError] = useState(null);

    const handleReset = async (e) => {
        e.preventDefault();
        setSubmitError(null);
        try {
            await sendPasswordResetEmail(auth, email);
            Swal.fire("Correo enviado", "Revisa tu bandeja de entrada (y spam) para restablecer la contraseña", "success");
        } catch (error) {
            const userFriendlyMessage = getErrorMessage(error.code);
            Swal.fire("Error", userFriendlyMessage, "error");
            setSubmitError(error);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Recuperar Contraseña</h2>
            <form onSubmit={handleReset}>
                <div className="mb-3">
                    <label className="form-label">Correo electrónico</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                {submitError && <p className="text-danger mt-2">{getErrorMessage(submitError.code)}</p>}
                <button type="submit" className="btn btn-primary">Enviar correo de recuperación</button>
            </form>
        </div>
    );
}