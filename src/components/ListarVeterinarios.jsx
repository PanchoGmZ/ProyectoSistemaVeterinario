import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate

export function ListarVeterinarios() {
    const [veterinarios, setVeterinarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Obtén la función navigate

    useEffect(() => {
        const fetchVeterinarios = async () => {
            try {
                const response = await fetch('https://localhost:7167/api/Veterinario');
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                setVeterinarios(data);
            } catch (error) {
                console.error('Error fetching veterinarians:', error);
                setError(error.message);
            } finally {
                setCargando(false);
            }
        };

        fetchVeterinarios();
    }, []);

    const handleCrearVeterinario = () => {
        // Navega a la ruta de CrearVeterinario
        navigate("/crear-veterinario");
    };

    const handleEditar = (idVeterinario) => {
        // Puedes navegar a una ruta de edición también si lo deseas
        navigate(`/editar-veterinario/${idVeterinario}`);
    };

    const handleEliminar = async (idVeterinario) => {
        if (window.confirm('¿Estás seguro de eliminar este veterinario?')) {
            try {
                const response = await fetch(`https://localhost:7167/api/Veterinario/IdVeterinario?id=${idVeterinario}`, {
                    method: 'DELETE'
                });
                
                if (!response.ok) {
                    const errorData = await response.text();
                    throw new Error(errorData || 'Error al eliminar veterinario');
                }
                
                setVeterinarios(prevVeterinarios => 
                    prevVeterinarios.filter(vet => 
                        (vet.idVeterinario || vet.IdVeterinario) !== idVeterinario
                    )
                );
                
                alert('Veterinario eliminado correctamente');
                
            } catch (error) {
                console.error('Error al eliminar:', error);
                alert(error.message || 'No se pudo eliminar el veterinario');
            }
        }
    };

    // El resto del componente permanece igual...
    if (cargando) {
        return <div className="loading">Cargando veterinarios...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    if (veterinarios.length === 0) {
        return (
            <div>
                <button 
                    onClick={handleCrearVeterinario}
                    className="create-button"
                >
                    ➕ Crear Veterinario
                </button>
                <div className="empty">No hay veterinarios registrados</div>
            </div>
        );
    }

    return (
        <div className="table-container">
            <button 
                onClick={handleCrearVeterinario}
                className="create-button"
            >
                ➕ Crear Veterinario
            </button>
            
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellidos</th>
                        <th>Especialidad</th>
                        <th>Fecha de Contrato</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {veterinarios.map((vet) => (
                        <tr key={vet.idVeterinario || vet.IdVeterinario}>
                            <td>{vet.idVeterinario || vet.IdVeterinario}</td>
                            <td>{vet.nombre || vet.Nombre}</td>
                            <td>{vet.apellidos || vet.Apellidos}</td>
                            <td>{vet.especialidad || vet.Especialidad}</td>
                            <td>{new Date(vet.fechaDeContrato || vet.FechaDeContrato).toLocaleDateString()}</td>
                            <td className="actions-cell">
                                <button 
                                    onClick={() => handleEditar(vet.idVeterinario || vet.IdVeterinario)}
                                    className="action-button edit-button"
                                >
                                    ✏️ Editar
                                </button>
                                <button 
                                    onClick={() => handleEliminar(vet.idVeterinario || vet.IdVeterinario)}
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