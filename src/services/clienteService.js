import { db } from './firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export const getClienteById = async (uid) => {
  try {
    const docRef = doc(db, 'clientes', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("No such client document!");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener el cliente:", error);
    return null;
  }
};

export const updateCliente = async (uid, clienteData) => {
  try {
    const docRef = doc(db, 'clientes', uid);
    await updateDoc(docRef, clienteData);
    console.log("Perfil del cliente actualizado correctamente.");
    return true;
  } catch (error) {
    console.error("Error al actualizar el perfil del cliente:", error);
    throw error;
  }
};