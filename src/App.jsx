import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import { ListarMascotas } from './components/ListarMascota';
import { ListarPropietarios } from './components/ListarPropietarios';
import { ListarVeterinarios } from './components/ListarVeterinarios';
import { ListarConsultas } from './components/ListarConsultas';
import { ListarMedicamentos } from './components/ListarMedicamentos';
import { ListarRecetas } from './components/ListarRecetas';
import { ListarHistorialMedico } from './components/ListarHistorialMedico';
import { ListarAdministradores } from './components/ListarAdministradores';
import { Login } from './components/Login';
import CrearVeterinario from "./components/Crear/CrearVeterinario";
import CrearPropietario from "./components/Crear/CrearPropietario";
import CrearMascota from './components/Crear/CrearMascota';
import CrearConsulta from './components/Crear/CrearConsulta';
import CrearMedicamento from './components/Crear/CrearMedicamento';
import CrearRecetas from './components/Crear/CrearRecetas';
import CrearHistorialMedico from './components/Crear/CrearHistorialMedico';
import CrearAdministrador from './components/Crear/CrearAdministrador';
import ModificarPropietarios from "./components/Modificar/ModificarPropietarios";
import ModificarMascotas from "./components/Modificar/ModificarMascotas";
import ModificarAdministrador from "./components/Modificar/ModificarAdministrador";
import ModificarMedicamento from "./components/Modificar/ModificarMedicamento";
import ModificarHistorialMedico from './components/Modificar/ModificarHistorialMedico';
import ModificarReceta from './components/Modificar/ModificarReceta';
import ModificarConsulta from './components/Modificar/ModificarConsultas';
import ModificarVeterinarios from './components/Modificar/ModificarVeterinarios';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<ProtectedLayout />} />
      </Routes>
    </Router>
  );
}

function ProtectedLayout() {
  const [activeTab, setActiveTab] = useState('mascotas');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('vetAdmin');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro que deseas cerrar sesión?")) {
      localStorage.removeItem('vetAdmin');
      localStorage.removeItem('vetToken');
      navigate('/login');
    }
  };

  // Función modificada para cambiar de tab y navegar a la ruta raíz
  const changeTab = (tab) => {
    setActiveTab(tab);
    navigate('/'); // Navega a la ruta raíz cuando cambia de tab
  };

  if (!user) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="app-layout">
      {/* Panel lateral */}
      <div className="sidebar">
        <div className="user-info">
          <span className="user-name">{user.Nombre || user.nombre}</span>
          <span className="user-email">{user.Correo || user.correo}</span>
        </div>

        <h2 className="sidebar-title">Menú</h2>

        <nav className="nav-menu">
          <button
            className={`nav-button ${activeTab === 'mascotas' ? 'active' : ''}`}
            onClick={() => changeTab('mascotas')}
          >
            🐾 Mascotas
          </button>

          <button
            className={`nav-button ${activeTab === 'propietarios' ? 'active' : ''}`}
            onClick={() => changeTab('propietarios')}
          >
            👤 Propietarios
          </button>

          <button
            className={`nav-button ${activeTab === 'veterinarios' ? 'active' : ''}`}
            onClick={() => changeTab('veterinarios')}
          >
            🩺 Veterinarios
          </button>

          <button
            className={`nav-button ${activeTab === 'consultas' ? 'active' : ''}`}
            onClick={() => changeTab('consultas')}
          >
            📅 Consultas
          </button>

          <button
            className={`nav-button ${activeTab === 'medicamentos' ? 'active' : ''}`}
            onClick={() => changeTab('medicamentos')}
          >
            💊 Medicamentos
          </button>

          <button
            className={`nav-button ${activeTab === 'recetas' ? 'active' : ''}`}
            onClick={() => changeTab('recetas')}
          >
            📝 Recetas
          </button>

          <button
            className={`nav-button ${activeTab === 'historial' ? 'active' : ''}`}
            onClick={() => changeTab('historial')}
          >
            🏥 Historial Médico
          </button>

          <button
            className={`nav-button ${activeTab === 'administradores' ? 'active' : ''}`}
            onClick={() => changeTab('administradores')}
          >
            👔 Administradores
          </button>
          <button
            className="nav-button logout-button"
            onClick={handleLogout}
          >
            🚪 Cerrar Sesión
          </button>
        </nav>
      </div>

      {/* Contenido principal */}
      <div className="main-content">
        <header className="content-header">
          <h1>
            {activeTab === 'mascotas' && 'Listado de Mascotas'}
            {activeTab === 'propietarios' && 'Listado de Propietarios'}
            {activeTab === 'veterinarios' && 'Listado de Veterinarios'}
            {activeTab === 'consultas' && 'Listado de Consultas'}
            {activeTab === 'medicamentos' && 'Listado de Medicamentos'}
            {activeTab === 'recetas' && 'Listado de Recetas'}
            {activeTab === 'historial' && 'Historial Médico'}
            {activeTab === 'administradores' && 'Listado de Administradores'}
          </h1>
        </header>

        <div className="content-body">
          {activeTab === 'mascotas' && (
            <Routes>
              <Route path="/" element={<ListarMascotas />} />
              <Route path="/crear-mascota" element={<CrearMascota />} />
              <Route path="/editar-mascota/:id" element={<ModificarMascotas/>} /> 
            </Routes>
          )}
          {activeTab === 'propietarios' && (
            <Routes>
              <Route path="/" element={<ListarPropietarios />} />
              <Route path="/crear-propietario" element={<CrearPropietario />} />
              <Route path="/propietarios/editar/:id" element={<ModificarPropietarios/>} /> 


            </Routes>
          )}
          {activeTab === 'veterinarios' && (
            <Routes>
              <Route path="/" element={<ListarVeterinarios />} />
              <Route path="/crear-veterinario" element={<CrearVeterinario />} />
              <Route path="/editar-veterinario/:id" element={<ModificarVeterinarios/>} />
            </Routes>
          )}
          {activeTab === 'consultas' && (
            <Routes>
              <Route path="/" element={<ListarConsultas />} />
              <Route path="/crear-consulta" element={<CrearConsulta />} />
              <Route path="/editar-consulta/:id" element={<ModificarConsulta />} />
            </Routes>
          )}
          {activeTab === 'medicamentos' && (
            <Routes>
              <Route path="/" element={<ListarMedicamentos />} />
              <Route path="/crear-medicamento" element={<CrearMedicamento />} />
              <Route path="/editar-medicamento/:id" element={<ModificarMedicamento />} />
            </Routes>
          )}
          {activeTab === 'recetas' && (
            <Routes>
              <Route path="/" element={<ListarRecetas />} />
              <Route path="/crear-receta" element={<CrearRecetas />} />
              <Route path="/editar-receta/:id" element={<ModificarReceta />} />
            </Routes>
          )}
          {activeTab === 'historial' && (
            <Routes>
              <Route path="/" element={<ListarHistorialMedico />} />
              <Route path="/crear-historial" element={<CrearHistorialMedico />} />
              <Route path="/editar-historial/:id" element={<ModificarHistorialMedico />} />
            </Routes>
          )}
          {activeTab === 'administradores' && (
            <Routes>
              <Route path="/" element={<ListarAdministradores />} />
              <Route path="/crear-administrador" element={<CrearAdministrador />} />
              <Route path="/editar-administrador/:id" element={<ModificarAdministrador />} />
            </Routes>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;