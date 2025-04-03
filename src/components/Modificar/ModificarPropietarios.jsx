import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ModificarPropietarios() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [propietario, setPropietario] = useState({
        idPropietario: id, // Inicializamos con el ID de la URL
        nombre: "",
        apellidos: "",
        teléfono: "",
        dirección: ""
    });
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [statusCode, setStatusCode] = useState(null);

    // Obtenemos la URL anterior del state o usamos "/propietarios" como valor predeterminado
    const previousPath = location.state?.from || "/propietarios";

    useEffect(() => {
        const fetchPropietario = async () => {
            console.log("Intentando obtener propietario con ID:", id);
            
            // Lista de posibles URLs para probar
            const urlsToTry = [
                `https://localhost:7167/api/Propietario/${id}`,
                `https://localhost:7167/api/Propietario/GetById/${id}`,
                `https://localhost:7167/api/Propietario/GetById?id=${id}`,
                `https://localhost:7167/api/Propietario/Get?id=${id}`,
                `https://localhost:7167/api/Propietario?id=${id}`
            ];
            
            let success = false;
            
            // Probar cada URL hasta encontrar una que funcione
            for (const url of urlsToTry) {
                try {
                    console.log("Intentando URL:", url);
                    
                    const response = await fetch(url);
                    console.log(`Código de estado para ${url}:`, response.status);
                    setStatusCode(response.status);
                    
                    if (response.ok) {
                        const data = await response.json();
                        console.log("Datos recibidos:", data);
                        setPropietario(data);
                        success = true;
                        console.log("URL exitosa:", url);
                        break; // Salir del bucle si encuentra una URL exitosa
                    }
                } catch (error) {
                    console.log(`Error con URL ${url}:`, error.message);
                    // Continuar con la siguiente URL
                }
            }
            
            if (!success) {
                // En caso de error, aseguramos que al menos el ID esté en el estado
                setPropietario(prev => ({
                    ...prev,
                    idPropietario: id
                }));
                setError(`No se pudo encontrar el propietario con ID ${id}. Intente revisar la documentación de su API.`);
            }
            
            setCargando(false);
        };

        if (id) {
            fetchPropietario();
        } else {
            setError("No se proporcionó un ID válido");
            setCargando(false);
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPropietario((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Aseguramos que el idPropietario esté incluido y coincida con el id de la URL
            const propietarioToUpdate = {
                ...propietario,
                idPropietario: parseInt(id) // Convertimos a número por si acaso
            };
            
            console.log("Enviando datos para actualización:", propietarioToUpdate);
            const url = `https://localhost:7167/api/Propietario/IdPropietario?id=${id}`;
            console.log("URL para actualizar (PUT):", url);
            
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(propietarioToUpdate)
            });
            
            console.log("Respuesta de actualización:", response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error en actualización:", errorText);
                throw new Error(`Error al actualizar el propietario (${response.status}): ${errorText}`);
            }

            alert("Propietario actualizado correctamente");
            // Navegamos a la ruta anterior en lugar de a una ruta fija
            navigate(previousPath);
        } catch (error) {
            console.error("Error completo en actualización:", error);
            alert(`No se pudo actualizar el propietario: ${error.message}`);
        }
    };

    if (cargando) return <div>Cargando...</div>;
    if (error) return (
        <div>
            <h3>Error al cargar el propietario</h3>
            <p>{error}</p>
            {statusCode && <p>Código de estado: {statusCode}</p>}
            <div>
                <p>Posibles soluciones:</p>
                <ol>
                    <li>Verifique que el ID {id} existe en la base de datos</li>
                    <li>Consulte la documentación de su API para conocer la ruta correcta</li>
                    <li>Añada los datos manualmente en el formulario sin cargar datos previos</li>
                </ol>
                <button onClick={() => {
                    setError(null);
                    setPropietario({
                        idPropietario: parseInt(id), // Convertimos a número
                        nombre: "",
                        apellidos: "",
                        teléfono: "",
                        dirección: ""
                    });
                }}>Editar manualmente</button>
                <button onClick={() => navigate(previousPath)}>Volver a la lista</button>
            </div>
        </div>
    );

    return (
        <div>
            <h2>Editar Propietario</h2>
            <p>Editando propietario con ID: {id}</p>
            <form onSubmit={handleSubmit}>
                <div style={{ margin: "10px 0" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>
                        ID del Propietario:
                        <input
                            type="text"
                            name="idPropietario"
                            value={propietario.idPropietario}
                            readOnly // Importante: hacerlo de solo lectura
                            style={{ marginLeft: "10px", padding: "5px", backgroundColor: "#f0f0f0" }}
                        />
                    </label>
                </div>
                <div style={{ margin: "10px 0" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>
                        Nombre:
                        <input
                            type="text"
                            name="nombre"
                            value={propietario.nombre}
                            onChange={handleChange}
                            required
                            style={{ marginLeft: "10px", padding: "5px" }}
                        />
                    </label>
                </div>
                <div style={{ margin: "10px 0" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>
                        Apellidos:
                        <input
                            type="text"
                            name="apellidos"
                            value={propietario.apellidos}
                            onChange={handleChange}
                            required
                            style={{ marginLeft: "10px", padding: "5px" }}
                        />
                    </label>
                </div>
                <div style={{ margin: "10px 0" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>
                        Teléfono:
                        <input
                            type="text"
                            name="teléfono"
                            value={propietario.teléfono}
                            onChange={handleChange}
                            required
                            style={{ marginLeft: "10px", padding: "5px" }}
                        />
                    </label>
                </div>
                <div style={{ margin: "10px 0" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>
                        Dirección:
                        <input
                            type="text"
                            name="dirección"
                            value={propietario.dirección}
                            onChange={handleChange}
                            required
                            style={{ marginLeft: "10px", padding: "5px" }}
                        />
                    </label>
                </div>
                <div style={{ margin: "20px 0" }}>
                    <button 
                        type="submit"
                        style={{ padding: "8px 16px", marginRight: "10px", backgroundColor: "#4CAF50", color: "white", border: "none" }}
                    >
                        Guardar Cambios
                    </button>
                    <button 
                        type="button" 
                        onClick={() => navigate(previousPath)}
                        style={{ padding: "8px 16px", backgroundColor: "#f44336", color: "white", border: "none" }}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}