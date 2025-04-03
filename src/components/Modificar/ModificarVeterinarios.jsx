import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ModificarVeterinarios() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [veterinario, setVeterinario] = useState({
        idVeterinario: id,
        nombre: "",
        apellidos: "",
        especialidad: "",
        fechaDeContrato: ""
    });
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVeterinario = async () => {
            try {
                const response = await fetch(`https://localhost:7167/api/Veterinario/IdVeterinario?id=${id}`);
                if (!response.ok) throw new Error("Error al cargar veterinario");
                
                const data = await response.json();
                setVeterinario({
                    ...data,
                    fechaDeContrato: data.fechaDeContrato.substring(0, 10) // Formato para input date
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setCargando(false);
            }
        };

        if (id) fetchVeterinario();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVeterinario(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://localhost:7167/api/Veterinario/IdVeterinario?id=${id}` , {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(veterinario)
            });

            if (!response.ok) throw new Error("Error al actualizar veterinario");
            navigate("/veterinarios");
        } catch (err) {
            alert(err.message);
        }
    };

    if (cargando) return <div>Cargando...</div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Modificar Veterinario</h1>
            
            <div style={styles.editorContainer}>
                <h2 style={styles.editorTitle}>Editor Veterinario</h2>
                <div style={styles.editorContent}>
                    <div style={styles.systemInfo}>Sistema Veterinario.com</div>
                    <div style={styles.idInfo}>ID: {id}</div>
                    
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Nombre:</label>
                        <input
                            type="text"
                            name="nombre"
                            value={veterinario.nombre}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>
                    
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Apellidos:</label>
                        <input
                            type="text"
                            name="apellidos"
                            value={veterinario.apellidos}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>
                    
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Especialidad:</label>
                        <input
                            type="text"
                            name="especialidad"
                            value={veterinario.especialidad}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>
                    
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Fecha de Contrato:</label>
                        <input
                            type="date"
                            name="fechaDeContrato"
                            value={veterinario.fechaDeContrato}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>
                    
                    <div style={styles.buttonContainer}>
                        <button 
                            type="button" 
                            onClick={() => navigate("/veterinarios")}
                            style={styles.cancelButton}
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            onClick={handleSubmit}
                            style={styles.saveButton}
                        >
                            Guardar Cambios
                        </button>
                    </div>
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
        fontSize: '16px'
    },
    saveButton: {
        padding: '10px 20px',
        backgroundColor: '#2ecc71',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px'
    }
};