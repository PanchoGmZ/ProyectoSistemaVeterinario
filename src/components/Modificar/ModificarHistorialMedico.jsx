import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ModificarHistorialMedico() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Estado inicial para el historial médico
    const [historial, setHistorial] = useState({
        idHistorial: id,
        idMascota: "",
        fechaRegistro: "",
        motivoConsulta: "",
        diagnostico: "",
        tratamiento: "",
        observaciones: "",
        peso: "",
        temperatura: "",
        vacunas: []
    });

    const [mascotas, setMascotas] = useState([]);
    const [todasVacunas, setTodasVacunas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    // Cargar datos del historial médico, mascotas y vacunas al cargar el componente
    useEffect(() => {
        const fetchData = async () => {
            try {
                setCargando(true);
                setError(null);
                
                // Cargar datos del historial médico
                const resHistorial = await fetch(`https://localhost:7167/api/HistorialMedico/${id}`);
                
                const responseText = await resHistorial.text();
                if (!responseText) {
                    throw new Error("El servidor devolvió una respuesta vacía");
                }
                
                const dataHistorial = JSON.parse(responseText);
                
                if (!resHistorial.ok) {
                    throw new Error(dataHistorial.message || "Error al cargar historial médico");
                }
                
                // Cargar datos adicionales de mascotas y vacunas
                const [resMascotas, resVacunas] = await Promise.all([
                    fetch("https://localhost:7167/api/Mascota"),
                    fetch("https://localhost:7167/api/Vacuna")
                ]);
                
                const [dataMascotas, dataVacunas] = await Promise.all([
                    resMascotas.ok ? resMascotas.json() : Promise.resolve([]),
                    resVacunas.ok ? resVacunas.json() : Promise.resolve([])
                ]);
                
                setHistorial({
                    ...dataHistorial,
                    fechaRegistro: dataHistorial.fechaRegistro?.substring(0, 10) || ""
                });
                setMascotas(dataMascotas);
                setTodasVacunas(dataVacunas);
                
            } catch (err) {
                console.error("Error en fetchData:", err);
                setError(`Error al cargar datos: ${err.message}`);
                
                setHistorial({
                    idHistorial: id,
                    idMascota: "",
                    fechaRegistro: new Date().toISOString().substring(0, 10),
                    motivoConsulta: "",
                    diagnostico: "",
                    tratamiento: "",
                    observaciones: "",
                    peso: "",
                    temperatura: "",
                    vacunas: []
                });
            } finally {
                setCargando(false);
            }
        };

        if (id) {
            fetchData();
        } else {
            setError("No se proporcionó un ID válido");
            setCargando(false);
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setHistorial(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectVacunas = (e) => {
        const { options } = e.target;
        const selectedVacunas = Array.from(options)
            .filter(option => option.selected)
            .map(option => option.value);
        setHistorial(prev => ({ ...prev, vacunas: selectedVacunas }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Enviar datos al backend usando PUT (si estás actualizando un historial)
            const res = await fetch(`https://localhost:7167/api/HistorialMedico/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(historial),  // Enviar los datos del historial en formato JSON
            });

            const data = await res.json();
            
            if (res.ok) {
                alert('Historial médico actualizado con éxito');
                navigate("/historial-medico");  // Redirigir al listado después de la actualización
            } else {
                throw new Error(data.message || 'Error al actualizar el historial médico');
            }
        } catch (err) {
            console.error('Error en la actualización:', err);
            alert(`Error: ${err.message}`);
        }
    };

    if (cargando) return (
        <div style={styles.loading}>
            <h3>Cargando historial médico...</h3>
            <p>Por favor espere</p>
        </div>
    );

    if (error) return (
        <div style={styles.errorContainer}>
            <h2 style={styles.errorHeader}>Error al cargar el historial médico</h2>
            <p style={styles.errorText}>{error}</p>
            
            <div style={styles.errorSolutions}>
                <h4>Posibles soluciones:</h4>
                <ol>
                    <li>Verifica que el servidor esté funcionando correctamente</li>
                    <li>Comprueba que el ID {id} exista en la base de datos</li>
                    <li>Intenta recargar la página</li>
                    <li>Contacta al administrador del sistema</li>
                </ol>
            </div>
            
            <div style={styles.errorButtons}>
                <button 
                    onClick={() => window.location.reload()}
                    style={styles.retryButton}
                >
                    Reintentar
                </button>
                <button 
                    onClick={() => navigate("/historial-medico")}
                    style={styles.backButton}
                >
                    Volver al listado
                </button>
            </div>
        </div>
    );

    return (
        <div style={styles.container}>
            <h1>Modificar Historial Médico</h1>
            <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                    <label>Motivo de la consulta</label>
                    <input
                        type="text"
                        name="motivoConsulta"
                        value={historial.motivoConsulta}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div style={styles.formGroup}>
                    <label>Diagnóstico</label>
                    <input
                        type="text"
                        name="diagnostico"
                        value={historial.diagnostico}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div style={styles.formGroup}>
                    <label>Tratamiento</label>
                    <input
                        type="text"
                        name="tratamiento"
                        value={historial.tratamiento}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div style={styles.formGroup}>
                    <label>Observaciones</label>
                    <input
                        type="text"
                        name="observaciones"
                        value={historial.observaciones}
                        onChange={handleChange}
                    />
                </div>

                <div style={styles.formGroup}>
                    <label>Peso</label>
                    <input
                        type="number"
                        name="peso"
                        value={historial.peso}
                        onChange={handleChange}
                    />
                </div>

                <div style={styles.formGroup}>
                    <label>Temperatura</label>
                    <input
                        type="number"
                        name="temperatura"
                        value={historial.temperatura}
                        onChange={handleChange}
                    />
                </div>

                <div style={styles.formGroup}>
                    <label>Vacunas</label>
                    <select
                        multiple
                        value={historial.vacunas}
                        onChange={handleSelectVacunas}
                    >
                        {todasVacunas.map(vacuna => (
                            <option key={vacuna.id} value={vacuna.id}>
                                {vacuna.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={styles.formGroup}>
                    <label>Fecha Registro</label>
                    <input
                        type="date"
                        name="fechaRegistro"
                        value={historial.fechaRegistro}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div style={styles.buttonContainer}>
                    <button 
                        type="button"
                        onClick={() => navigate("/historial-medico")}
                        style={styles.cancelButton}
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit"
                        style={styles.saveButton}
                    >
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    );
}

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
    },
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        padding: '8px',
        marginTop: '5px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    cancelButton: {
        backgroundColor: '#e74c3c',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginRight: '10px',
    },
    saveButton: {
        backgroundColor: '#2ecc71',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    loading: {
        padding: '20px',
        textAlign: 'center',
    },
    errorContainer: {
        backgroundColor: '#ffebee',
        padding: '20px',
        borderRadius: '4px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    errorHeader: {
        color: '#c62828',
    },
    errorText: {
        color: '#d32f2f',
    },
    errorSolutions: {
        marginTop: '20px',
    },
    errorButtons: {
        marginTop: '20px',
        display: 'flex',
        gap: '10px',
    },
    retryButton: {
        backgroundColor: '#1565c0',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '4px',
    },
    backButton: {
        backgroundColor: '#424242',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '4px',
    }
};
