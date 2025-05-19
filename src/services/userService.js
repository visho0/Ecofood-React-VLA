import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";  

// Obtener datos del usuario
export const getUserData = async (uid) => {
  try {
    const ref = doc(db, "usuarios", uid);
    const snapshot = await getDoc(ref);
    if (snapshot.exists()) {
      return snapshot.data();
    } else {
      throw new Error("Usuario no encontrado");
    }
  } catch (error) {
    console.error("Error al obtener datos:", error);
    throw error;
  }
};

// Guardar datos del usuario
export const saveUserData = async (uid, data) => {
  try {
    await setDoc(doc(db, "usuarios", uid), data);
  } catch (error) {
    console.error("Error al guardar datos:", error);
    throw error;
  }
};
