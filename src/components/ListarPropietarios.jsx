import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function ListarPropietarios() {
    const [propietarios, setPropietarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPropietarios = async () => {
            try {
                const response = await fetch('https://localhost:7167/api/Propietario');
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                setPropietarios(data);
            } catch (error) {
                console.error('Error fetching owners:', error);
                setError(error.message);
            } finally {
                setCargando(false);
            }
        };

        fetchPropietarios();
    }, []);

    const handleCrearPropietario = () => {
        navigate("/crear-propietario"); 
      };

    const handleEditar = (idPropietario) => {
        navigate(`/propietarios/editar/${idPropietario}`);
    };

    const handleEliminar = async (idPropietario) => {
        if (window.confirm('¿Estás seguro de eliminar este propietario?')) {
            try {
                const response = await fetch(`https://localhost:7167/api/Propietario/IdPropietario?id=${idPropietario}`, {
                    method: 'DELETE'
                });
                
                
                
                if (!response.ok) {
                    const errorData = await response.text();
                    throw new Error(errorData || 'Error al eliminar propietario');
                }
                
                setPropietarios(prevPropietarios => 
                    prevPropietarios.filter(prop => 
                        (prop.idPropietario || prop.IdPropietario) !== idPropietario
                    )
                );
                
                alert('Propietario eliminado correctamente');
                
            } catch (error) {
                console.error('Error al eliminar:', error);
                alert(error.message || 'No se pudo eliminar el propietario');
            }
        }
    };

    if (cargando) {
        return <div className="loading">Cargando propietarios...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    if (propietarios.length === 0) {
        return (
            <div>
                <button 
                    onClick={handleCrearPropietario}
                    className="create-button"
                >
                    ➕ Crear Propietario
                </button>
                <div className="empty">No hay propietarios registrados</div>
            </div>
        );
    }

    return (
        <div className="table-container">
            <button 
                onClick={handleCrearPropietario}
                className="create-button"
            >
                ➕ Crear Propietario
            </button>
            
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellidos</th>
                        <th>Teléfono</th>
                        <th>Dirección</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {propietarios.map((prop) => (
                        <tr key={prop.idPropietario || prop.IdPropietario}>
                            <td>{prop.idPropietario || prop.IdPropietario}</td>
                            <td>{prop.nombre || prop.Nombre}</td>
                            <td>{prop.apellidos || prop.Apellidos}</td>
                            <td>{prop.teléfono || prop.Teléfono || 'No especificado'}</td>
                            <td>{prop.dirección || prop.Dirección}</td>
                            <td className="actions-cell">
                                <button 
                                    onClick={() => handleEditar(prop.idPropietario || prop.IdPropietario)}
                                    className="action-button edit-button"
                                >
                                    ✏️ Editar
                                </button>
                                <button 
                                    onClick={() => handleEliminar(prop.idPropietario || prop.IdPropietario)}
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