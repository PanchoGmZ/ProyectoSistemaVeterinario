import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function ListarMascotas() {
  const [mascotas, setMascotas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMascotas = async () => {
      try {
        const response = await fetch('https://localhost:7167/api/Mascota');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMascotas(data);
      } catch (error) {
        console.error('Error fetching pets:', error);
        setError(error.message);
      } finally {
        setCargando(false);
      }
    };

    fetchMascotas();
  }, []);

  const handleCrearMascota = () => {
    navigate("/crear-mascota");
  };

  const handleEditar = (idMascota) => {
    navigate(`/editar-mascota/${idMascota}`);
  };

  const handleEliminar = async (idMascota) => {
    if (window.confirm('¿Estás seguro de eliminar esta mascota?')) {
      try {
        const response = await fetch(`https://localhost:7167/api/Mascota/IdMascota?id=${idMascota}`, {
          method: 'DELETE'
        });

        const responseText = await response.text();
        let responseData = {};
        
        try {
          responseData = responseText ? JSON.parse(responseText) : {};
        } catch (e) {
          console.log("La respuesta no es JSON válido:", responseText);
        }

        if (!response.ok) {
          throw new Error(responseData.message || 'Error al eliminar mascota');
        }

        setMascotas(prev => prev.filter(m => (m.idMascota || m.IdMascota) !== idMascota));
        
        alert(responseData.mensaje || 'Mascota eliminada correctamente');
      } catch (error) {
        console.error('Error al eliminar:', error);
        alert(error.message || 'No se pudo eliminar la mascota');
      }
    }
  };

  if (cargando) return <div className="loading">Cargando mascotas...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="table-container">
      <button onClick={handleCrearMascota} className="create-button">
        ➕ Crear Mascota
      </button>
      
      {mascotas.length === 0 ? (
        <div className="empty">No hay mascotas registradas</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Especie</th>
              <th>Raza</th>
              <th>Edad</th>
              <th>Género</th>
              <th>Propietario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {mascotas.map(mascota => {
              const mascotaId = mascota.idMascota || mascota.IdMascota;
              return (
                <tr key={mascotaId}>
                  <td>{mascotaId}</td>
                  <td>{mascota.nombre || mascota.Nombre}</td>
                  <td>{mascota.especie || mascota.Especie}</td>
                  <td>{mascota.raza || mascota.Raza}</td>
                  <td>{mascota.edad || mascota.Edad}</td>
                  <td>{mascota.genero || mascota.Genero}</td>
                  <td>
                    {mascota.propietario ? 
                      `${mascota.propietario.nombre || mascota.propietario.Nombre} ${mascota.propietario.apellidos || mascota.propietario.Apellidos}` : 
                      'No especificado'}
                  </td>
                  <td className="actions-cell">
                    <button 
                      onClick={() => handleEditar(mascotaId)}
                      className="action-button edit-button"
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      onClick={() => handleEliminar(mascotaId)}
                      className="action-button delete-button"
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
