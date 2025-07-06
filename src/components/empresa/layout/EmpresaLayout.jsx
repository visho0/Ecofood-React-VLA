import { Outlet } from "react-router-dom";
import Header from "../../common/Header"; // Importa el nuevo Header
import Sidebar from "../../common/Sidebar"; // Importa el nuevo Sidebar
// import NavEmpresa from "./NavEmpresa"; // <--- ESTA LÍNEA SE PUEDE ELIMINAR O COMENTAR

export default function EmpresaLayout() {
  return (
    <div className="d-flex flex-column min-vh-100"> {/* Contenedor principal para toda la altura */}
      <Header /> {/* Header en la parte superior */}
      <div className="d-flex flex-grow-1"> {/* Contenedor para Sidebar y Contenido */}
        <Sidebar /> {/* Sidebar a la izquierda */}
        <main className="flex-grow-1 p-3"> {/* Contenido principal que ocupa el espacio restante */}
          <Outlet /> {/* Aquí se renderizarán los componentes hijos de las rutas anidadas */}
        </main>
      </div>
    </div>
  );
}