import { db } from './firebase';
import { collection, getDocs, addDoc, query, where, doc, updateDoc } from 'firebase/firestore'; // Asegúrate de importar 'doc' y 'updateDoc'

const productosCollection = collection(db, 'productos');
const solicitudesCollection = collection(db, 'solicitudes');


export const getProductosDisponibles = async () => {
  try {
    const querySnapshot = await getDocs(productosCollection);
    const productos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return productos;
  } catch (error) {
    console.error("Error al obtener productos disponibles:", error);
    return [];
  }
};


export const crearSolicitud = async (solicitud) => {
  try {
    const docRef = await addDoc(solicitudesCollection, solicitud);
    console.log("Solicitud creada con ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error al crear la solicitud:", error);
    throw error;
  }
};


export const getSolicitudesPorCliente = async (clienteId) => {
  try {

    const q = query(solicitudesCollection, where("clienteId", "==", clienteId));
    const querySnapshot = await getDocs(q);

    const solicitudes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return solicitudes;
  } catch (error) {
    console.error("Error al obtener solicitudes por cliente:", error);
    return [];
  }
};

export const updateSolicitud = async (solicitudId, newData) => {
  try {
    const docRef = doc(db, "solicitudes", solicitudId);
    await updateDoc(docRef, newData);
    console.log("Solicitud actualizada con ID: ", solicitudId);
  } catch (error) {
    console.error("Error al actualizar la solicitud:", error);
    throw error;
  }
};

// NUEVA FUNCIÓN: Permite obtener solicitudes para una empresa específica
export const getSolicitudesPorEmpresa = async (empresaId) => {
  try {
    const q = query(solicitudesCollection, where("empresaId", "==", empresaId));
    const querySnapshot = await getDocs(q);
    const solicitudes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return solicitudes;
  } catch (error) {
    console.error("Error al obtener solicitudes por empresa:", error);
    return [];
  }
};