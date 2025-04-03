import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function ListarRecetas() {
    const [recetas, setRecetas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecetas = async () => {
            try {
                const response = await fetch('https://localhost:7167/api/Receta?include=consulta,medicamento');
                
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                
                const data = await response.json();
                setRecetas(data);
            } catch (error) {
                console.error('Error al obtener recetas:', error);
                setError(error.message);
            } finally {
                setCargando(false);
            }
        };

        fetchRecetas();
    }, []);

    const handleCrearReceta = () => {
        navigate("/crear-receta");
    };

    const handleEditar = (idReceta) => {
        navigate(`/editar-receta/${idReceta}`);
    };

    const handleEliminar = async (idReceta) => {
        if (window.confirm('¿Estás seguro de eliminar esta receta?')) {
            try {
                const response = await fetch(`https://localhost:7167/api/Receta/${idReceta}`, {
                    method: 'DELETE'
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error al eliminar receta');
                }
                
                setRecetas(prevRecetas => 
                    prevRecetas.filter(receta => 
                        (receta.idReceta || receta.IdReceta) !== idReceta
                    )
                );
                
                alert('Receta eliminada correctamente');
                
            } catch (error) {
                console.error('Error al eliminar:', error);
                alert(error.message || 'No se pudo eliminar la receta');
            }
        }
    };

    const formatFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-MX');
    };

    if (cargando) {
        return <div className="loading">Cargando recetas...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    if (recetas.length === 0) {
        return (
            <div>
                <button 
                    onClick={handleCrearReceta}
                    className="create-button"
                >
                    ➕ Crear Receta
                </button>
                <div className="empty">No hay recetas registradas</div>
            </div>
        );
    }

    return (
        <div className="table-container">
            <button 
                onClick={handleCrearReceta}
                className="create-button"
            >
                ➕ Crear Receta
            </button>
            
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Consulta</th>
                        <th>Medicamento</th>
                        <th>Dosis</th>
                        <th>Indicaciones</th>
                        <th>Fecha Prescripción</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {recetas.map((receta) => (
                        <tr key={receta.idReceta || receta.IdReceta}>
                            <td>{receta.idReceta || receta.IdReceta}</td>
                            <td>Consulta #{receta.consulta?.idConsulta || receta.Consulta?.IdConsulta || 'N/A'}</td>
                            <td>{receta.medicamento?.nombre || receta.Medicamento?.Nombre || 'N/A'}</td>
                            <td>{receta.dosis || receta.Dosis}</td>
                            <td className="truncate-text">{receta.indicaciones || receta.Indicaciones || '-'}</td>
                            <td>{formatFecha(receta.fechaPrescripcion || receta.FechaPrescripcion)}</td>
                            <td className="actions-cell">
                                <button 
                                    onClick={() => handleEditar(receta.idReceta || receta.IdReceta)}
                                    className="action-button edit-button"
                                >
                                    ✏️ Editar
                                </button>
                                <button 
                                    onClick={() => handleEliminar(receta.idReceta || receta.IdReceta)}
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