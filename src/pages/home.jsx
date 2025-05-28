import { useEffect } from 'react';

import { getUserData } from "../services/userService";
import { useAuth } from "../context/AuthContext";



import CerrarSesion from "../components/CerrarSesion";

export default function Home() {
  

    return (
        <div>
            <h2>Bienvenido a EcoFood</h2>
            <CerrarSesion />
        </div>
    );
}
