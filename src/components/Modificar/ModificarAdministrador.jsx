import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ModificarAdministrador() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [administrador, setAdministrador] = useState({
        idAdministrador: id,
        nombre: "",
        correo: "",
        contraseña: "",
        telefono: "",
        fecha_registro: ""
    });
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [guardando, setGuardando] = useState(false);
    const [mensajeExito, setMensajeExito] = useState(null);

    useEffect(() => {
        const fetchAdministrador = async () => {
            try {
                const response = await fetch(`https://localhost:7167/api/Administrador/${id}`);
                if (!response.ok) throw new Error("Error al cargar administrador");
                
                const data = await response.json();
                setAdministrador({
                    ...data,
                    fecha_registro: data.fecha_registro.substring(0, 16) // Formato para datetime-local
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setCargando(false);
            }
        };

        if (id) fetchAdministrador();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdministrador(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGuardando(true);
        setError(null);
        setMensajeExito(null);

        try {
            const datosActualizados = {
                ...administrador,
                fecha_registro: `${administrador.fecha_registro}:00Z`
            };

            const response = await fetch(`https://localhost:7167/api/Administrador/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datosActualizados)
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || `Error ${response.status} al actualizar`);
            }

            setMensajeExito("Administrador actualizado correctamente");
            setTimeout(() => {
                navigate("/administradores");
            }, 1500);
            
        } catch (err) {
            console.error("Error al guardar:", err);
            setError(`Error al guardar cambios: ${err.message}`);
        } finally {
            setGuardando(false);
        }
    };

    if (cargando) return <div style={styles.loading}>Cargando datos del administrador...</div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Listado de Administradores</h1>
            
            <div style={styles.editorContainer}>
                <h2 style={styles.editorTitle}>Editor Administrador</h2>
                <div style={styles.editorContent}>
                    <div style={styles.systemInfo}>Sistema Administradores.com</div>
                    <div style={styles.idInfo}>ID: {id}</div>
                    
                    {error && (
                        <div style={styles.errorMessage}>
                            {error}
                        </div>
                    )}
                    
                    {mensajeExito && (
                        <div style={styles.successMessage}>
                            {mensajeExito}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Nombre:</label>
                            <input
                                type="text"
                                name="nombre"
                                value={administrador.nombre}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            />
                        </div>
                        
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Correo electrónico:</label>
                            <input
                                type="email"
                                name="correo"
                                value={administrador.correo}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            />
                        </div>
                        
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Teléfono:</label>
                            <input
                                type="tel"
                                name="telefono"
                                value={administrador.telefono}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            />
                        </div>
                        
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Fecha Registro:</label>
                            <input
                                type="datetime-local"
                                name="fecha_registro"
                                value={administrador.fecha_registro}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            />
                        </div>
                        
                        <div style={styles.buttonContainer}>
                            <button 
                                type="button" 
                                onClick={() => navigate("/administradores")}
                                style={styles.cancelButton}
                                disabled={guardando}
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                style={styles.saveButton}
                                disabled={guardando}
                            >
                                {guardando ? (
                                    <span>Guardando...</span>
                                ) : (
                                    <span>Guardar Cambios</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        color: '#333'
    },
    header: {
        color: '#2c3e50',
        borderBottom: '1px solid #eee',
        paddingBottom: '10px'
    },
    editorContainer: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginTop: '20px',
        overflow: 'hidden'
    },
    editorTitle: {
        backgroundColor: '#f8f9fa',
        margin: 0,
        padding: '15px 20px',
        borderBottom: '1px solid #eee',
        fontSize: '1.2em'
    },
    editorContent: {
        padding: '20px'
    },
    systemInfo: {
        color: '#7f8c8d',
        fontSize: '0.9em',
        marginBottom: '5px'
    },
    idInfo: {
        fontWeight: 'bold',
        marginBottom: '20px'
    },
    formGroup: {
        marginBottom: '15px'
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontWeight: '500'
    },
    input: {
        width: '100%',
        padding: '8px 10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '16px',
        boxSizing: 'border-box'
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '30px',
        gap: '10px'
    },
    cancelButton: {
        padding: '10px 20px',
        backgroundColor: '#e74c3c',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        opacity: 1,
        transition: 'opacity 0.3s'
    },
    saveButton: {
        padding: '10px 20px',
        backgroundColor: '#2ecc71',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '120px'
    },
    loading: {
        padding: '20px',
        textAlign: 'center',
        fontSize: '18px'
    },
    errorMessage: {
        backgroundColor: '#ffebee',
        color: '#c62828',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '20px',
        borderLeft: '4px solid #c62828'
    },
    successMessage: {
        backgroundColor: '#e8f5e9',
        color: '#2e7d32',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '20px',
        borderLeft: '4px solid #2e7d32'
    }
};