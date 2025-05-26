const firebaseErrorMap = {
  "auth/user-not-found": "Usuario no registrado",
  "auth/wrong-password": "Contraseña incorrecta",
  "auth/email-already-in-use": "El correo ya está en uso",
  "auth/invalid-email": "Correo inválido",
  "auth/weak-password": "Contraseña muy débil",
  // Agrega más según sea necesario
};

const getErrorMessage = (errorCode) =>
  firebaseErrorMap[errorCode] || "Ocurrió un error inesperado";

{error && <p className="text-red-500">{getErrorMessage(error.code)}</p>}

<Link to="/reset-password">¿Olvidaste tu contraseña?</Link>

