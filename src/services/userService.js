import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export const getUserData = async (uid) => {
  try {
    const ref = doc(db, "usuarios", uid);
    const snapshot = await getDoc(ref);
    if (snapshot.exists()) {
      console.log("getUserData: Documento encontrado!", snapshot.data());
      return snapshot.data();
    } else {
      console.error("getUserData: Documento NO encontrado para UID:", uid);
      return null;
    }
  } catch (error) {
    console.error("getUserData: Error al obtener datos (catch block):", error);
    throw error;
  }
};

export const saveUserData = async (uid, data) => {
  try {
    await setDoc(doc(db, "usuarios", uid), data, { merge: true });
    return true;
  } catch (error) {
    console.error("Error al guardar datos:", error);
    throw error;
  }
};

// Función para obtener empresas
export const getEmpresas = async () => {
  try {
    const usuariosCollection = collection(db, "usuarios");
    // Línea modificada: ahora busca 'tipo' en lugar de 'role'
    const q = query(usuariosCollection, where("tipo", "==", "empresa")); 
    const querySnapshot = await getDocs(q);
    const empresas = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log("Empresas obtenidas:", empresas);
    return empresas;
  } catch (error) {
    console.error("Error al obtener empresas:", error);
    return [];
  }
};