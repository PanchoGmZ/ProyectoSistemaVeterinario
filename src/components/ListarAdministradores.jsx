import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function ListarAdministradores() {
    const [administradores, setAdministradores] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdministradores = async () => {
            try {
                const response = await fetch('https://localhost:7167/api/Administrador');
                
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                
                const data = await response.json();
                setAdministradores(data);
            } catch (error) {
                console.error('Error al obtener administradores:', error);
                setError(error.message);
            } finally {
                setCargando(false);
            }
        };

        fetchAdministradores();
    }, []);

    const handleCrearAdministrador = () => {
        navigate("/crear-administrador");
    };

    const handleEditar = (idAdministrador) => {
        navigate(`/editar-administrador/${idAdministrador}`);
    };

    const handleEliminar = async (idAdministrador) => {
        if (window.confirm('¿Estás seguro de eliminar este administrador?')) {
            try {
                const response = await fetch(`https://localhost:7167/api/Administrador/${idAdministrador}`, {
                    method: 'DELETE'
                });
                
                // Verificar si hay contenido en la respuesta
                const responseText = await response.text();
                let responseData = {};
                
                try {
                    // Intentar parsear solo si hay contenido
                    responseData = responseText ? JSON.parse(responseText) : {};
                } catch (e) {
                    console.log("La respuesta no es JSON válido:", responseText);
                }
                
                if (!response.ok) {
                    throw new Error(responseData.message || 'Error al eliminar administrador');
                }
                
                // Actualizar el estado local
                setAdministradores(prev => prev.filter(admin => 
                    (admin.idAdministrador || admin.IdAdministrador) !== idAdministrador
                ));
                
                alert(responseData.mensaje || 'Administrador eliminado correctamente');
            } catch (error) {
                console.error('Error al eliminar:', error);
                alert(error.message || 'No se pudo eliminar el administrador');
            }
        }
    };

    const formatFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-MX');
    };

    if (cargando) return <div className="loading">Cargando administradores...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="table-container">
            <button onClick={handleCrearAdministrador} className="create-button">
                ➕ Crear Administrador
            </button>
            
            {administradores.length === 0 ? (
                <div className="empty">No hay administradores registrados</div>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Teléfono</th>
                            <th>Fecha Registro</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {administradores.map((admin) => {
                            const adminId = admin.idAdministrador || admin.IdAdministrador;
                            return (
                                <tr key={adminId}>
                                    <td>{adminId}</td>
                                    <td>{admin.nombre || admin.Nombre}</td>
                                    <td>{admin.correo || admin.Correo}</td>
                                    <td>{admin.telefono || admin.Telefono || 'N/A'}</td>
                                    <td>{formatFecha(admin.fecha_registro || admin.Fecha_registro)}</td>
                                    <td>{admin.estado || admin.Estado ? 'Activo' : 'Inactivo'}</td>
                                    <td className="actions-cell">
                                        <button 
                                            onClick={() => handleEditar(adminId)}
                                            className="action-button edit-button"
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button 
                                            onClick={() => handleEliminar(adminId)}
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