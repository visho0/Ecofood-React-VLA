import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import { AuthContext } from "./AuthContext";
import { getUserData } from "../services/userService";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthProvider: useEffect se ejecuta.");
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("AuthProvider: onAuthStateChanged - Estado de autenticación cambiado. firebaseUser:", firebaseUser);

      // Verificación más robusta: asegúrate de que firebaseUser no sea null y que tenga un UID
      if (firebaseUser && firebaseUser.uid) {
        setUser(firebaseUser);
        console.log("AuthProvider: Usuario Firebase detectado. UID:", firebaseUser.uid);
        try {
          console.log("AuthProvider: Intentando obtener userData para UID:", firebaseUser.uid);
          const data = await getUserData(firebaseUser.uid); // Aquí está la línea donde ocurre el error si firebaseUser.uid es null

          if (data === null || data === undefined) {
            console.error("AuthProvider: ERROR: getUserData regresó null/undefined para UID:", firebaseUser.uid, ". Esto indica que el documento de usuario no se encontró en Firestore o hubo un problema en getUserData.");
            setUserData(null);
          } else {
            setUserData(data);
            console.log("AuthProvider: Datos de usuario de Firestore cargados:", data);
          }

        } catch (error) {
          console.error("AuthProvider: Error capturado al cargar datos de Firestore para UID:", firebaseUser.uid, ":", error);
          setUserData(null);
        }
      } else {
        // Si firebaseUser es null o no tiene UID, significa que no hay sesión activa o hubo un problema.
        setUser(null);
        setUserData(null);
        console.log("AuthProvider: No hay usuario Firebase (firebaseUser es null o no tiene UID). Deslogueado.");
      }
      setLoading(false);
      console.log("AuthProvider: Carga de autenticación finalizada. Loading:", false);
    });

    return () => {
      unsubscribe();
      console.log("AuthProvider: onAuthStateChanged desuscrito.");
    };
  }, []);

  console.log("AuthProvider: Render. Current loading:", loading, "Current user:", user, "Current userData:", userData);

  if (loading) {
    return <div>Cargando autenticación...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
};