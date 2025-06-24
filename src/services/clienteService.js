import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

// Obtener cliente por ID
export const getClienteById = async (uid) => {
  const docRef = doc(db, "clientes", uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

// Actualizar perfil cliente
export const updateCliente = async (uid, data) => {
  const docRef = doc(db, "clientes", uid);
  await updateDoc(docRef, data);
};
