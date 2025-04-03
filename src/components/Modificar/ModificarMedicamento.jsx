import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ModificarMedicamento() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [medicamento, setMedicamento] = useState({
        idMedicamento: id,
        nombre: "",
        descripcion: "",
        precio: 0
    });
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMedicamento = async () => {
            try {
                const response = await fetch(`https://localhost:7167/api/Medicamento/${id}`);
                if (!response.ok) throw new Error("Error al cargar medicamento");
                
                const data = await response.json();
                setMedicamento({
                    idMedicamento: data.idMedicamento,
                    nombre: data.nombre,
                    descripcion: data.descripcion,
                    precio: data.precio
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setCargando(false);
            }
        };

        if (id) fetchMedicamento();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMedicamento(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://localhost:7167/api/Medicamento/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    idMedicamento: parseInt(id),
                    nombre: medicamento.nombre,
                    descripcion: medicamento.descripcion,
                    precio: parseFloat(medicamento.precio)
                })
            });

            if (!response.ok) throw new Error("Error al actualizar");
            navigate("/medicamentos");
        } catch (err) {
            alert(err.message);
        }
    };

    if (cargando) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        
        <div style={styles.container}>
            <h1 style={styles.header}>Modificar Medicamento</h1>
            
            <form onSubmit={handleSubmit} style={styles.editorContainer}>
                
                <div style={styles.formGroup}>
                    <label style={styles.label}>Nombre:</label>
                    <input
                        type="text"
                        name="nombre"
                        value={medicamento.nombre}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Descripción:</label>
                    <textarea
                        name="descripcion"
                        value={medicamento.descripcion}
                        onChange={handleChange}
                        style={{ ...styles.input, minHeight: '80px' }}
                        required
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Precio:</label>
                    <input
                        type="number"
                        name="precio"
                        value={medicamento.precio}
                        onChange={handleChange}
                        style={styles.input}
                        min="0"
                        step="0.01"
                        required
                    />
                </div>
                <div style={styles.buttonContainer}>
                    <button 
                        type="button" 
                        onClick={() => navigate("/medicamentos")}
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
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        maxWidth: '600px',
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
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginTop: '20px'
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
        justifyContent: 'space-between',
        marginTop: '20px'
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
