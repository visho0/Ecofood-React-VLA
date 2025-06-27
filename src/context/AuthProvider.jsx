// src/context/AuthProvider.jsx
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
      console.log("AuthProvider: onAuthStateChanged - Estado de autenticación cambiado.");
      console.log("AuthProvider: firebaseUser (desde onAuthStateChanged):", firebaseUser);

      if (firebaseUser) {
        setUser(firebaseUser);
        console.log("AuthProvider: Usuario Firebase detectado. UID:", firebaseUser.uid);
        try {
          console.log("AuthProvider: Intentando obtener userData para UID:", firebaseUser.uid);
          const data = await getUserData(firebaseUser.uid); 
          
          // <--- CAMBIOS CLAVE AQUÍ: VERIFICACIÓN EXPLÍCITA
          if (data === null || data === undefined) {
            console.error("AuthProvider: ERROR CRÍTICO: getUserData regresó null/undefined a pesar de tener un usuario logueado. Esto indica que el documento de usuario no se encontró en Firestore o hubo un problema en getUserData.");
            // Si el documento realmente no existe, podrías querer manejarlo como un caso de usuario sin perfil.
            // Por ahora, lo dejaremos como un error para que veas el mensaje.
            setUserData(null); // Asegura que userData es null si no se encontraron datos
          } else {
            setUserData(data);
            console.log("AuthProvider: Datos de usuario de Firestore cargados:", data);
          }
          // <--- FIN CAMBIOS CLAVE
          
        } catch (error) {
          console.error("AuthProvider: Error capturado al cargar datos de Firestore:", error); // Esto debería aparecer si getUserData lanza un error
          setUserData(null);
        }
      } else {
        setUser(null);
        setUserData(null);
        console.log("AuthProvider: No hay usuario Firebase (deslogueado).");
      }
      setLoading(false);
      console.log("AuthProvider: Carga de autenticación finalizada. Loading:", false);
    });

    return () => {
      unsubscribe();
      console.log("AuthProvider: onAuthStateChanged desuscrito.");
    };
  }, []);

  console.log("AuthProvider: Render. Current loading:", loading, "Current userData:", userData);

  if (loading) {
    return <div>Cargando autenticación...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
};