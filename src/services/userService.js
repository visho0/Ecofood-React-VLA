import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";  


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


export const saveUserData = async (uid, data) => {
  try {
    await setDoc(doc(db, "usuarios", uid), data, { merge: true }); 
  } catch (error) {
    console.error("Error al guardar datos:", error);
    throw error;
  }
};