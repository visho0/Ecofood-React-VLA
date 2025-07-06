import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedByRole({ allowed, children }) {
  const { userData, loading, user } = useAuth(); // También obtenemos 'user' para más contexto

  console.log("ProtectedByRole: Render.");
  console.log("  Loading:", loading);
  console.log("  User (UID):", user ? user.uid : "null"); // Muestra el UID si el usuario existe
  console.log("  UserData:", userData);
  console.log("  Allowed roles (prop):", allowed);

  if (loading) {
    console.log("ProtectedByRole: Todavía cargando. Mostrando mensaje de carga.");
    return <p>Cargando...</p>;
  }

  // Después de que loading sea false, si userData sigue siendo null o su tipo no coincide
  if (!userData) {
    console.log("ProtectedByRole: UserData es null después de que la carga finalizó. Redirigiendo a /login.");
    return <Navigate to="/login" />;
  }

  if (!allowed.includes(userData.tipo)) {
    console.log("ProtectedByRole: Rol del usuario no permitido para esta ruta.");
    console.log("  Tipo de usuario actual:", userData.tipo);
    console.log("  Roles permitidos para esta ruta:", allowed);
    return <Navigate to="/login" />;
  }

  console.log("ProtectedByRole: Acceso permitido. Rol del usuario:", userData.tipo);
  return children;
}