import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function ListarMedicamentos() {
    const [medicamentos, setMedicamentos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMedicamentos = async () => {
            try {
                const response = await fetch('https://localhost:7167/api/Medicamento');
                
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                
                const data = await response.json();
                setMedicamentos(data);
            } catch (error) {
                console.error('Error al obtener medicamentos:', error);
                setError(error.message);
            } finally {
                setCargando(false);
            }
        };

        fetchMedicamentos();
    }, []);

    const handleCrearMedicamento = () => {
        navigate("/crear-medicamento");
    };

    const handleEditar = (idMedicamento) => {
        navigate(`/editar-medicamento/${idMedicamento}`);
    };

    const handleEliminar = async (idMedicamento) => {
        if (window.confirm('¿Estás seguro de eliminar este medicamento?')) {
            try {
                const response = await fetch(`https://localhost:7167/api/Medicamento/${idMedicamento}`, {
                    method: 'DELETE'
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error al eliminar medicamento');
                }
                
                setMedicamentos(prevMedicamentos => 
                    prevMedicamentos.filter(med => 
                        (med.idMedicamento || med.IdMedicamento) !== idMedicamento
                    )
                );
                
                alert('Medicamento eliminado correctamente');
                
            } catch (error) {
                console.error('Error al eliminar:', error);
                alert(error.message || 'No se pudo eliminar el medicamento');
            }
        }
    };

    const formatPrecio = (precio) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(precio);
    };

    if (cargando) {
        return <div className="loading">Cargando medicamentos...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    if (medicamentos.length === 0) {
        return (
            <div>
                <button 
                    onClick={handleCrearMedicamento}
                    className="create-button"
                >
                    ➕ Crear Medicamento
                </button>
                <div className="empty">No hay medicamentos registrados</div>
            </div>
        );
    }

    return (
        <div className="table-container">
            <button 
                onClick={handleCrearMedicamento}
                className="create-button"
            >
                ➕ Crear Medicamento
            </button>
            
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {medicamentos.map((med) => (
                        <tr key={med.idMedicamento || med.IdMedicamento}>
                            <td>{med.idMedicamento || med.IdMedicamento}</td>
                            <td>{med.nombre || med.Nombre}</td>
                            <td className="truncate-text">{med.descripcion || med.Descripcion}</td>
                            <td className="text-right">{formatPrecio(med.precio || med.Precio)}</td>
                            <td className="actions-cell">
                                <button 
                                    onClick={() => handleEditar(med.idMedicamento || med.IdMedicamento)}
                                    className="action-button edit-button"
                                >
                                    ✏️ Editar
                                </button>
                                <button 
                                    onClick={() => handleEliminar(med.idMedicamento || med.IdMedicamento)}
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