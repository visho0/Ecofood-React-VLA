import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase"; 

export const getUserData = async (uid) => {
  try {
    const ref = doc(db, "usuarios", uid);
    const snapshot = await getDoc(ref);
    if (snapshot.exists()) {
      console.log("getUserData: Documento encontrado!", snapshot.data()); // <--- Nuevo log
      return snapshot.data();
    } else {
      console.error("getUserData: Documento NO encontrado para UID:", uid); // <--- Nuevo log
      throw new Error("Usuario no encontrado"); // Si llega aquí, DEBERÍA lanzar un error
    }
  } catch (error) {
    console.error("getUserData: Error al obtener datos (catch block):", error); // <--- Nuevo log
    throw error;
  }
};


export const saveUserData = async (uid, data) => {
  try {
    await setDoc(doc(db, "usuarios", uid), data, { merge: true });
    return true; // ✅ Añadir esta línea es clave
  } catch (error) {
    console.error("Error al guardar datos:", error);
    throw error;
  }
};


