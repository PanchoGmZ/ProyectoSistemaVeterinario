import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ModificarConsulta() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Estado inicial para la consulta con las propiedades correctas
    const [consulta, setConsulta] = useState({
        idConsulta: id,
        fecha: "",
        hora: "",
        idVeterinario: "",
        idMascota: "",
        diagnóstico: "", // Corregido con tilde
        tratamiento: "",
        veterinario: {
            idVeterinario: 0,
            nombre: "",
            apellidos: "",
            especialidad: "",
            fechaDeContrato: ""
        },
        mascota: {
            idMascota: 0,
            nombre: "",
            especie: "",
            raza: "",
            edad: 0,
            genero: "",
            idPropietario: 0, // Campo faltante
            propietario: {
                idPropietario: 0,
                nombre: "",
                apellidos: "",
                teléfono: "", // Corregido con tilde
                dirección: "" // Corregido con tilde
            }
        }
    });

    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    // Cargar datos de la consulta al cargar el componente
    useEffect(() => {
        const fetchData = async () => {
            try {
                setCargando(true);
                setError(null);
                
                // Cargar datos de la consulta
                const resConsulta = await fetch(`https://localhost:7167/api/Consulta/idConsulta?idConsulta=${id}`);
                const dataConsulta = await resConsulta.json();
                
                if (!resConsulta.ok) {
                    throw new Error(dataConsulta.message || "Error al cargar la consulta");
                }
                
                // Asegurarse de que los datos recibidos se adaptan al formato requerido
                setConsulta({
                    idConsulta: dataConsulta.idConsulta,
                    fecha: dataConsulta.fecha?.substring(0, 10) || "",
                    hora: dataConsulta.hora?.substring(0, 19) || "",
                    idVeterinario: dataConsulta.idVeterinario || "",
                    idMascota: dataConsulta.idMascota || "",
                    diagnóstico: dataConsulta.diagnóstico || dataConsulta.diagnostico || "", // Maneja ambas versiones
                    tratamiento: dataConsulta.tratamiento || "",
                    veterinario: {
                        idVeterinario: dataConsulta.veterinario?.idVeterinario || 0,
                        nombre: dataConsulta.veterinario?.nombre || "",
                        apellidos: dataConsulta.veterinario?.apellidos || "",
                        especialidad: dataConsulta.veterinario?.especialidad || "",
                        fechaDeContrato: dataConsulta.veterinario?.fechaDeContrato || ""
                    },
                    mascota: {
                        idMascota: dataConsulta.mascota?.idMascota || 0,
                        nombre: dataConsulta.mascota?.nombre || "",
                        especie: dataConsulta.mascota?.especie || "",
                        raza: dataConsulta.mascota?.raza || "",
                        edad: dataConsulta.mascota?.edad || 0,
                        genero: dataConsulta.mascota?.genero || "",
                        idPropietario: dataConsulta.mascota?.idPropietario || dataConsulta.mascota?.propietario?.idPropietario || 0,
                        propietario: {
                            idPropietario: dataConsulta.mascota?.propietario?.idPropietario || 0,
                            nombre: dataConsulta.mascota?.propietario?.nombre || "",
                            apellidos: dataConsulta.mascota?.propietario?.apellidos || "",
                            teléfono: dataConsulta.mascota?.propietario?.teléfono || dataConsulta.mascota?.propietario?.telefono || "",
                            dirección: dataConsulta.mascota?.propietario?.dirección || dataConsulta.mascota?.propietario?.direccion || ""
                        }
                    }
                });
            } catch (err) {
                console.error("Error en fetchData:", err);
                setError(`Error al cargar la consulta: ${err.message}`);
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
        
        // Manejo de campos anidados
        if (name.includes('.')) {
            const [parentKey, childKey] = name.split('.');
            setConsulta(prev => ({
                ...prev,
                [parentKey]: {
                    ...prev[parentKey],
                    [childKey]: value
                }
            }));
        } else {
            setConsulta(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Asegurarse de que los campos críticos estén presentes y con el formato correcto
            const consultaToSend = {
                idConsulta: parseInt(consulta.idConsulta),
                fecha: consulta.fecha,
                hora: consulta.hora,
                idVeterinario: parseInt(consulta.idVeterinario),
                idMascota: parseInt(consulta.idMascota),
                diagnóstico: consulta.diagnóstico, // Con tilde
                tratamiento: consulta.tratamiento,
                veterinario: consulta.veterinario,
                mascota: {
                    ...consulta.mascota,
                    idPropietario: parseInt(consulta.mascota.idPropietario),
                    edad: parseInt(consulta.mascota.edad),
                    propietario: consulta.mascota.propietario
                }
            };

            console.log("Datos a enviar:", JSON.stringify(consultaToSend));

            // Enviar datos al backend usando PUT para modificar la consulta
            const res = await fetch(`https://localhost:7167/api/Consulta/idConsulta?idConsulta=${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(consultaToSend),
            });

            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.message || 'Error al modificar la consulta');
            }
            
            alert('Consulta modificada con éxito');
            navigate("/consultas");  // Redirigir al listado después de la actualización
        } catch (err) {
            console.error('Error en la actualización:', err);
            alert(`Error: ${err.message}`);
        }
    };

    if (cargando) return (
        <div style={styles.loading}>
            <h3>Cargando consulta...</h3>
            <p>Por favor espere</p>
        </div>
    );

    if (error) return (
        <div style={styles.errorContainer}>
            <h2 style={styles.errorHeader}>Error al cargar la consulta</h2>
            <p style={styles.errorText}>{error}</p>
        </div>
    );

    return (
        <div style={styles.container}>
            <h1>Modificar Consulta</h1>
            <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Fecha</label>
                    <input
                        type="date"
                        name="fecha"
                        value={consulta.fecha}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Hora</label>
                    <input
                        type="datetime-local"
                        name="hora"
                        value={consulta.hora}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>ID Veterinario</label>
                    <input
                        type="number"
                        name="idVeterinario"
                        value={consulta.idVeterinario}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>ID Mascota</label>
                    <input
                        type="number"
                        name="idMascota"
                        value={consulta.idMascota}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Diagnóstico</label>
                    <input
                        type="text"
                        name="diagnóstico"
                        value={consulta.diagnóstico}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Tratamiento</label>
                    <input
                        type="text"
                        name="tratamiento"
                        value={consulta.tratamiento}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                </div>

                <div style={styles.buttonContainer}>
                    <button 
                        type="button"
                        onClick={() => navigate("/consultas")}
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
    }
};