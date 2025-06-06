import { db, auth, secondaryAuth } from "./firebase";
import {
  collection, query, where, getDocs, addDoc,
  updateDoc, deleteDoc, doc, setDoc, getDoc
} from "firebase/firestore";
import { createUserWithEmailAndPassword, sendEmailVerification, updateEmail, updatePassword } from "firebase/auth";

// --- Funciones para Empresas ---
// (No cambian, las incluyo por completitud)
export const getEmpresas = async () => {
  const q = query(collection(db, "usuarios"), where("tipo", "==", "empresa"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addEmpresa = async (empresaData) => {
  return await addDoc(collection(db, "usuarios"), {
    ...empresaData,
    tipo: "empresa"
  });
};

export const updateEmpresa = async (id, empresaData) => {
  const ref = doc(db, "usuarios", id);
  return await updateDoc(ref, empresaData);
};

export const deleteEmpresa = async (id) => {
  const ref = doc(db, "usuarios", id);
  return await deleteDoc(ref);
};

// --- Funciones para Administradores ---

export const getAdministradores = async () => {
  const q = query(collection(db, "usuarios"), where("tipo", "==", "admin"));
  const snapshot = await await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Función mejorada para obtener el administrador principal
export const getAdminPrincipal = async () => {
    const q = query(collection(db, "usuarios"), where("tipo", "==", "admin"), where("isPrincipal", "==", true));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
        const principalDoc = snapshot.docs[0];
        return { id: principalDoc.id, ...principalDoc.data() };
    }
    return null; 
};

// Añadir un nuevo administrador con autenticación
export const addAdminConAuth = async (datos) => {
  try {
    const cred = await createUserWithEmailAndPassword(secondaryAuth, datos.email, datos.password);
    await sendEmailVerification(cred.user);

    await setDoc(doc(db, "usuarios", cred.user.uid), {
      nombre: datos.nombre || "",
      tipo: "admin",
      email: datos.email || "",
      isPrincipal: false 
    });

    await secondaryAuth.signOut();
    return cred;
  } catch (error) {
    console.error("Error al añadir administrador:", error);
    throw error;
  }
};

export const updateAdminData = async (id, adminData) => {
  const ref = doc(db, "usuarios", id);
  return await updateDoc(ref, adminData);
};

export const deleteAdmin = async (id) => {
  const ref = doc(db, "usuarios", id);
  return await deleteDoc(ref);
};

