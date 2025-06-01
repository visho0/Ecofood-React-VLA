import { db } from "./firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

const productosCollection = collection(db, "productos");

export const getProductos = async () => {
  const snapshot = await getDocs(productosCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addProducto = async (productoData) => {
  return await addDoc(productosCollection, productoData);
};

export const updateProducto = async (id, productoData) => {
  const ref = doc(db, "productos", id);
  return await updateDoc(ref, productoData);
};

export const deleteProducto = async (id) => {
  const ref = doc(db, "productos", id);
  return await deleteDoc(ref);
};