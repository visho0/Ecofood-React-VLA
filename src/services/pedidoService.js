
import { db } from './firebase'; 
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';


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

