import { Outlet } from "react-router-dom";
import NavAdmin from "./NavAdmin";

export default function AdminLayout() {
  return (
    <div>
      <NavAdmin />
      <main className="container mt-3">
        <Outlet /> {/* <Outlet> renderiza los componentes hijos de las rutas anidadas */}
      </main>
    </div>
  );
}