import { useState, useEffect } from "react";

export default function ModificarMascota() {
    const [mascotas, setMascotas] = useState([]); // Lista de mascotas
    const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null); // Mascota que se edita
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    // Cargar JSON simulado
    useEffect(() => {
        try {
            const data = [
                {
                    "idMascota": 1,
                    "nombre": "Fido",
                    "especie": "Perro",
                    "raza": "Labrador",
                    "edad": 5,
                    "genero": "Macho",
                    "idPropietario": 2,
                    "propietario": {
                        "idPropietario": 2,
                        "nombre": "palomo",
                        "apellidos": "pjillo",
                        "teléfono": "74585485",
                        "dirección": "barrio los ovulos mmarios"
                    }
                },
                {
                    "idMascota": 2,
                    "nombre": "Max",
                    "especie": "Gato",
                    "raza": "Siames",
                    "edad": 3,
                    "genero": "Macho",
                    "idPropietario": 3,
                    "propietario": {
                        "idPropietario": 3,
                        "nombre": "Ana Ruiz",
                        "apellidos": "Ruiz Fernández",
                        "teléfono": "987-654-321",
                        "dirección": "Avenida Siempre Viva 456, Ciudad, País"
                    }
                },
                {
                    "idMascota": 3,
                    "nombre": "Max",
                    "especie": "Gato",
                    "raza": "Siames",
                    "edad": 3,
                    "genero": "Macho",
                    "idPropietario": 4,
                    "propietario": {
                        "idPropietario": 4,
                        "nombre": "nayer",
                        "apellidos": "miranda",
                        "teléfono": "76837524",
                        "dirección": "ave los mejillones"
                    }
                }
            ];
            setMascotas(data);
            setCargando(false);
        } catch (err) {
            setError("Error al cargar los datos");
            setCargando(false);
        }
    }, []);

    // Manejador para cambiar los valores de la mascota seleccionada
    const handleChange = (e) => {
        const { name, value } = e.target;
        setMascotaSeleccionada(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Guardar cambios en el estado
    const handleGuardar = () => {
        setMascotas(prev => prev.map(m => 
            m.idMascota === mascotaSeleccionada.idMascota ? mascotaSeleccionada : m
        ));
        alert("Mascota actualizada correctamente");
    };

    if (cargando) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Modificar Mascota</h1>

            <label style={styles.label}>Seleccionar Mascota:</label>
            <select
                style={styles.select}
                onChange={(e) => {
                    const id = parseInt(e.target.value, 10);
                    setMascotaSeleccionada(mascotas.find(m => m.idMascota === id));
                }}
            >
                <option value="">Seleccione...</option>
                {mascotas.map((m) => (
                    <option key={m.idMascota} value={m.idMascota}>
                        {m.nombre} ({m.especie} - {m.raza})
                    </option>
                ))}
            </select>

            {mascotaSeleccionada && (
                <div style={styles.form}>
                    <label style={styles.label}>Nombre:</label>
                    <input
                        type="text"
                        name="nombre"
                        value={mascotaSeleccionada.nombre}
                        onChange={handleChange}
                        style={styles.input}
                    />

                    <label style={styles.label}>Especie:</label>
                    <input
                        type="text"
                        name="especie"
                        value={mascotaSeleccionada.especie}
                        onChange={handleChange}
                        style={styles.input}
                    />

                    <label style={styles.label}>Raza:</label>
                    <input
                        type="text"
                        name="raza"
                        value={mascotaSeleccionada.raza}
                        onChange={handleChange}
                        style={styles.input}
                    />

                    <label style={styles.label}>Edad:</label>
                    <input
                        type="number"
                        name="edad"
                        value={mascotaSeleccionada.edad}
                        onChange={handleChange}
                        style={styles.input}
                    />

                    <label style={styles.label}>Género:</label>
                    <input
                        type="text"
                        name="genero"
                        value={mascotaSeleccionada.genero}
                        onChange={handleChange}
                        style={styles.input}
                    />

                    <label style={styles.label}>Propietario:</label>
                    <input
                        type="text"
                        name="propietario"
                        value={`${mascotaSeleccionada.propietario.nombre} ${mascotaSeleccionada.propietario.apellidos}`}
                        disabled
                        style={styles.input}
                    />

                    <button style={styles.button} onClick={handleGuardar}>Guardar Cambios</button>
                </div>
            )}
        </div>
    );
}

// Estilos CSS en objeto
const styles = {
    container: {
        fontFamily: "'Arial', sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)"
    },
    header: {
        textAlign: "center",
        color: "#333"
    },
    label: {
        fontWeight: "bold",
        marginTop: "10px",
        display: "block"
    },
    select: {
        width: "100%",
        padding: "8px",
        marginBottom: "10px",
        borderRadius: "4px",
        border: "1px solid #ccc"
    },
    form: {
        marginTop: "20px",
        padding: "15px",
        backgroundColor: "#fff",
        borderRadius: "5px",
        boxShadow: "0 0 5px rgba(0,0,0,0.1)"
    },
    input: {
        width: "100%",
        padding: "8px",
        borderRadius: "4px",
        border: "1px solid #ccc",
        marginBottom: "10px"
    },
    button: {
        width: "100%",
        padding: "10px",
        backgroundColor: "#28a745",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
    }
};
