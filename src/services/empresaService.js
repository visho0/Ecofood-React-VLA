import { db } from "./firebase";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";

export const getEmpresaData = async (uid) => {
  try {
    const empresaRef = doc(db, "usuarios", uid);
    const empresaSnap = await getDoc(empresaRef);
    if (empresaSnap.exists()) {
      return { id: empresaSnap.id, ...empresaSnap.data() };
    } else {
      console.warn("No se encontraron datos para la empresa con UID:", uid);
      return null;
    }
  } catch (error) {
    console.error("Error al obtener datos de la empresa:", error);
    throw error;
  }
};


export const updateEmpresaData = async (uid, data) => {
    try {
        const empresaRef = doc(db, "usuarios", uid);
        await updateDoc(empresaRef, data);
        return true;
    } catch (error) {
        console.error("Error al actualizar datos de empresa:", error);
        throw error;
    }
};

