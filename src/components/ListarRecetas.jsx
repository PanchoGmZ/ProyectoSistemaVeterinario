import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

export function ListarRecetas() {
    const [recetas, setRecetas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecetas = async () => {
            try {
                const response = await fetch('https://localhost:7167/api/Receta?include=consulta,medicamento');
                
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                
                const data = await response.json();
                setRecetas(data);
            } catch (error) {
                console.error('Error al obtener recetas:', error);
                setError(error.message);
            } finally {
                setCargando(false);
            }
        };

        fetchRecetas();
    }, []);

    const handleCrearReceta = () => {
        navigate("/crear-receta");
    };

    const handleEditar = (idReceta) => {
        navigate(`/editar-receta/${idReceta}`);
    };

    const handleEliminar = async (idReceta) => {
        if (window.confirm('¿Estás seguro de eliminar esta receta?')) {
            try {
                const response = await fetch(`https://localhost:7167/api/Receta/${idReceta}`, {
                    method: 'DELETE'
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error al eliminar receta');
                }
                
                setRecetas(prevRecetas => 
                    prevRecetas.filter(receta => 
                        (receta.idReceta || receta.IdReceta) !== idReceta
                    )
                );
                
                alert('Receta eliminada correctamente');
                
            } catch (error) {
                console.error('Error al eliminar:', error);
                alert(error.message || 'No se pudo eliminar la receta');
            }
        }
    };

    const generarPDF = (receta) => {
        // Obtener la información necesaria de la receta
        const idReceta = receta.idReceta || receta.IdReceta;
        const idConsulta = receta.consulta?.idConsulta || receta.Consulta?.IdConsulta || 'N/A';
        const medicamento = receta.medicamento?.nombre || receta.Medicamento?.Nombre || 'N/A';
        const dosis = receta.dosis || receta.Dosis;
        const indicaciones = receta.indicaciones || receta.Indicaciones || '-';
        const fechaPrescripcion = formatFecha(receta.fechaPrescripcion || receta.FechaPrescripcion);
        
        // Crear un nuevo documento PDF
        const doc = new jsPDF();
        
        // Configurar el título y la información general
        doc.setFontSize(18);
        doc.text("Receta Médica", 105, 20, { align: "center" });
        
        doc.setFontSize(12);
        doc.text(`Fecha: ${fechaPrescripcion}`, 20, 40);
        doc.text(`ID Receta: ${idReceta}`, 20, 50);
        doc.text(`Consulta #: ${idConsulta}`, 20, 60);
        
        // Información del medicamento y dosis
        doc.setFontSize(14);
        doc.text("Información de la prescripción:", 20, 80);
        
        doc.setFontSize(12);
        doc.text(`Medicamento: ${medicamento}`, 30, 90);
        doc.text(`Dosis: ${dosis}`, 30, 100);
        
        // Indicaciones
        doc.setFontSize(14);
        doc.text("Indicaciones:", 20, 120);
        
        doc.setFontSize(12);
        // Si las indicaciones son largas, dividirlas en varias líneas
        const splitIndicaciones = doc.splitTextToSize(indicaciones, 170);
        doc.text(splitIndicaciones, 30, 130);
        
        // Guardar el documento
        doc.save(`Receta_${idReceta}_${fechaPrescripcion.replace(/\//g, '-')}.pdf`);
    };

    const formatFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-MX');
    };

    if (cargando) {
        return <div className="loading">Cargando recetas...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    if (recetas.length === 0) {
        return (
            <div>
                <button 
                    onClick={handleCrearReceta}
                    className="create-button"
                >
                    ➕ Crear Receta
                </button>
                <div className="empty">No hay recetas registradas</div>
            </div>
        );
    }

    return (
        <div className="table-container">
            <button 
                onClick={handleCrearReceta}
                className="create-button"
            >
                ➕ Crear Receta
            </button>
            
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Consulta</th>
                        <th>Medicamento</th>
                        <th>Dosis</th>
                        <th>Indicaciones</th>
                        <th>Fecha Prescripción</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {recetas.map((receta) => (
                        <tr key={receta.idReceta || receta.IdReceta}>
                            <td>{receta.idReceta || receta.IdReceta}</td>
                            <td>Consulta #{receta.consulta?.idConsulta || receta.Consulta?.IdConsulta || 'N/A'}</td>
                            <td>{receta.medicamento?.nombre || receta.Medicamento?.Nombre || 'N/A'}</td>
                            <td>{receta.dosis || receta.Dosis}</td>
                            <td className="truncate-text">{receta.indicaciones || receta.Indicaciones || '-'}</td>
                            <td>{formatFecha(receta.fechaPrescripcion || receta.FechaPrescripcion)}</td>
                            <td className="actions-cell">
                                <button 
                                    onClick={() => handleEditar(receta.idReceta || receta.IdReceta)}
                                    className="action-button edit-button"
                                >
                                    ✏️ Editar
                                </button>
                                <button 
                                    onClick={() => handleEliminar(receta.idReceta || receta.IdReceta)}
                                    className="action-button delete-button"
                                >
                                    🗑️ Eliminar
                                </button>
                                <button 
                                    onClick={() => generarPDF(receta)}
                                    className="action-button pdf-button"
                                >
                                    📄 PDF
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}