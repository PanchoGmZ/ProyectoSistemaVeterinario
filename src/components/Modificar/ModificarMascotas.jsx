import React, { useState, useEffect } from "react";

// ModificarMascotas Component
export default function ModificarMascotas() {
    const [mascotas, setMascotas] = useState([]); // Lista de mascotas
    const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null); // Mascota que se edita
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [propietarios, setPropietarios] = useState([]); // Lista de propietarios
    const [cargandoPropietarios, setCargandoPropietarios] = useState(true);

    // Cargar mascotas y propietarios
    useEffect(() => {
        const fetchData = async () => {
            try {
                const mascotasResponse = await fetch("https://localhost:7167/api/Mascota");
                const mascotasData = await mascotasResponse.json();
                setMascotas(mascotasData);
                
                const propietariosResponse = await fetch("https://localhost:7167/api/Propietario");
                const propietariosData = await propietariosResponse.json();
                setPropietarios(propietariosData);
                
                setCargando(false);
            } catch (err) {
                setError("Error al cargar los datos");
                setCargando(false);
            }
        };
        fetchData();
    }, []);

    // Manejador para cambiar los valores de la mascota seleccionada
    const handleChange = (e) => {
        const { name, value } = e.target;
        setMascotaSeleccionada((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Guardar cambios en el estado
    const handleGuardar = async () => {
        try {
            const response = await fetch(`https://localhost:7167/api/Mascota/IdMascota?IdMascota=${mascotaSeleccionada.idMascota}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mascotaSeleccionada),
            });

            if (!response.ok) {
                throw new Error("Error al actualizar la mascota");
            }

            alert("Mascota actualizada correctamente");
        } catch (err) {
            console.error(err);
            alert("Error al guardar los cambios");
        }
    };

    if (cargando) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container">
            <h1 className="header">Modificar Mascota</h1>

            <label className="label">Seleccionar Mascota:</label>
            <select
                className="select"
                onChange={(e) => {
                    const id = parseInt(e.target.value, 10);
                    setMascotaSeleccionada(mascotas.find((m) => m.idMascota === id));
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
                <div className="form">
                    <label className="label">Nombre:</label>
                    <input
                        type="text"
                        name="nombre"
                        value={mascotaSeleccionada.nombre}
                        onChange={handleChange}
                        className="input"
                    />

                    <label className="label">Especie:</label>
                    <input
                        type="text"
                        name="especie"
                        value={mascotaSeleccionada.especie}
                        onChange={handleChange}
                        className="input"
                    />

                    <label className="label">Raza:</label>
                    <input
                        type="text"
                        name="raza"
                        value={mascotaSeleccionada.raza}
                        onChange={handleChange}
                        className="input"
                    />

                    <label className="label">Edad:</label>
                    <input
                        type="number"
                        name="edad"
                        value={mascotaSeleccionada.edad}
                        onChange={handleChange}
                        className="input"
                    />

                    <label className="label">Género:</label>
                    <input
                        type="text"
                        name="genero"
                        value={mascotaSeleccionada.genero}
                        onChange={handleChange}
                        className="input"
                    />

                    <label className="label">Propietario:</label>
                    <select
                        className="select"
                        name="idPropietario"
                        value={mascotaSeleccionada.idPropietario}
                        onChange={handleChange}
                    >
                        {propietarios.map((prop) => (
                            <option key={prop.idPropietario} value={prop.idPropietario}>
                                {prop.nombre} {prop.apellidos}
                            </option>
                        ))}
                    </select>

                    <button className="button" onClick={handleGuardar}>Guardar Cambios</button>
                </div>
            )}
        </div>
    );
}

// Estilos CSS (se colocan al final del archivo JS)
const style = `
    .container {
        font-family: 'Arial', sans-serif;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f8f9fa;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .header {
        text-align: center;
        color: #2f4f4f; /* Verde oscuro */
        margin-bottom: 20px;
    }

    .label {
        font-weight: bold;
        margin-top: 10px;
        display: block;
        color: #2f4f4f; /* Verde oscuro */
    }

    .select {
        width: 100%;
        padding: 8px;
        margin-bottom: 10px;
        border-radius: 4px;
        border: 1px solid #ccc;
    }

    .form {
        margin-top: 20px;
        padding: 15px;
        background-color: #fff;
        border-radius: 5px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    }

    .input {
        width: 100%;
        padding: 8px;
        border-radius: 4px;
        border: 1px solid #ccc;
        margin-bottom: 10px;
    }

    .button {
        width: 100%;
        padding: 10px;
        background-color: #28a745;
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    .button:hover {
        background-color: #218838;
    }
`;

// Inyectamos los estilos en el documento
const styleTag = document.createElement("style");
styleTag.innerHTML = style;
document.head.appendChild(styleTag);
