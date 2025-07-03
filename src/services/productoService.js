import { db } from "./firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";

const productosCollection = collection(db, "productos");

// Función para obtener TODOS los productos (usada en VerProductos.jsx)
export const getProductos = async () => {
  try {
    const snapshot = await getDocs(productosCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error al obtener todos los productos:", error);
    return [];
  }
};

// Función para obtener productos por ID de empresa
export const getProductosByEmpresaId = async (empresaId) => {
  try {
    const q = query(productosCollection, where("empresaId", "==", empresaId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error al obtener productos por empresa:", error);
    return [];
  }
};

// Función para añadir un nuevo producto
export const addProducto = async (productoData) => {
  try {
    return await addDoc(productosCollection, productoData);
  } catch (error) {
    console.error("Error al añadir producto:", error);
    throw error;
  }
};

// Función para actualizar un producto existente
export const updateProducto = async (id, productoData) => {
  try {
    const ref = doc(db, "productos", id);
    return await updateDoc(ref, productoData);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    throw error;
  }
};

// Función para eliminar un producto
export const deleteProducto = async (id) => {
  try {
    const ref = doc(db, "productos", id);
    return await deleteDoc(ref);
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    throw error;
  }
};