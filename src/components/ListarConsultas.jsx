import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function ListarConsultas() {
  const [consultas, setConsultas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://localhost:7167/api/Consulta');
        if (!response.ok) throw new Error('Error al cargar consultas');
        const data = await response.json();
        setConsultas(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };
    fetchData();
  }, []);

  const handleCrearConsulta = () => {
    navigate("/crear-consulta");
  };

  const handleEditar = (idConsulta) => {
    navigate(`/editar-consulta/${idConsulta}`);
  };

  const handleEliminar = async (idConsulta) => {
    if (window.confirm('¿Estás seguro de eliminar esta consulta?')) {
      try {
        // Cambiar la URL para que coincida con la ruta del controlador
        const response = await fetch(`https://localhost:7167/api/Consulta/idConsulta?id=${idConsulta}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al eliminar consulta');
        }
        
        setConsultas(prevConsultas => 
          prevConsultas.filter(consulta => 
            (consulta.idConsulta || consulta.IdConsulta) !== idConsulta
          )
        );
        
        alert('Consulta eliminada correctamente');
        
      } catch (error) {
        console.error('Error al eliminar:', error);
        alert(error.message || 'No se pudo eliminar la consulta');
      }
    }
  };
  
  const formatFechaHora = (fecha, hora) => {
    const fechaObj = new Date(fecha);
    const horaObj = new Date(hora);
    return `
      ${fechaObj.toLocaleDateString()} 
      ${horaObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    `;
  };

  if (cargando) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  
  if (consultas.length === 0) {
    return (
      <div>
        <button 
          onClick={handleCrearConsulta}
          className="create-button"
        >
          ➕ Crear Consulta
        </button>
        <div className="empty">No hay consultas registradas</div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <button 
        onClick={handleCrearConsulta}
        className="create-button"
      >
        ➕ Crear Consulta
      </button>
      
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha y Hora</th>
            <th>Veterinario</th>
            <th>Mascota</th>
            <th>Diagnóstico</th>
            <th>Tratamiento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {consultas.map((c) => (
            <tr key={c.idConsulta || c.IdConsulta}>
              <td>{c.idConsulta || c.IdConsulta}</td>
              <td>{formatFechaHora(c.fecha || c.Fecha, c.hora || c.Hora)}</td>
              <td>{c.veterinario?.nombre || c.Veterinario?.Nombre || 'N/A'}</td>
              <td>{c.mascota?.nombre || c.Mascota?.Nombre || 'N/A'}</td>
              <td className="truncate-text">{c.diagnóstico || c.Diagnóstico}</td>
              <td className="truncate-text">{c.tratamiento || c.Tratamiento}</td>
              <td className="actions-cell">
                <button 
                  onClick={() => handleEditar(c.idConsulta || c.IdConsulta)}
                  className="action-button edit-button"
                >
                  ✏️ Editar
                </button>
                <button 
                  onClick={() => handleEliminar(c.idConsulta || c.IdConsulta)}
                  className="action-button delete-button"
                >
                  🗑️ Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}