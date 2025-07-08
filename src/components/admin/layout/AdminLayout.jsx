import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../../common/Header";
import Sidebar from "../../common/Sidebar";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header con la función toggle */}
      <Header toggleSidebar={toggleSidebar} />
      
      <div className="d-flex flex-grow-1">
        {/* Sidebar con estado isOpen */}
        <Sidebar isOpen={sidebarOpen} />
        
        {/* Contenido principal con margen dinámico */}
        <main 
          className="flex-grow-1 p-4"
          style={{
            marginLeft: sidebarOpen ? '60px' : '80px',
            transition: 'margin-left 0.3s ease',
            overflow: 'auto'
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}