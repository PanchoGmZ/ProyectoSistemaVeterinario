import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

export function ListarHistorialMedico() {
    const [historiales, setHistoriales] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistoriales = async () => {
            try {
                const response = await fetch('https://localhost:7167/api/HistorialMedico');

                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }

                const data = await response.json();
                setHistoriales(data);
            } catch (error) {
                console.error('Error al obtener historiales médicos:', error);
                setError(error.message);
            } finally {
                setCargando(false);
            }
        };

        fetchHistoriales();
    }, []);

    const handleCrearHistorial = () => {
        navigate("/crear-historial");
    };

    const handleEliminar = async (idHistorial) => {
        if (window.confirm('¿Estás seguro de eliminar este historial médico?')) {
            try {
                const response = await fetch(`https://localhost:7167/api/HistorialMedico/IdHistorial?id=${idHistorial}`, {
                    method: 'DELETE'
                });

                if (response.status === 204) {
                    setHistoriales(prev => prev.filter(h =>
                        (h.idHistorial || h.IdHistorial) !== idHistorial
                    ));
                    alert('Historial médico eliminado correctamente');
                    return;
                }

                const responseData = await response.json();

                if (!response.ok) {
                    throw new Error(responseData.message || 'Error al eliminar historial médico');
                }

                setHistoriales(prev => prev.filter(h =>
                    (h.idHistorial || h.IdHistorial) !== idHistorial
                ));

                alert(responseData.mensaje || 'Historial médico eliminado correctamente');
            } catch (error) {
                console.error('Error al eliminar:', error);
                alert(error.message || 'No se pudo eliminar el historial médico');
            }
        }
    };

    const formatFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-MX');
    };

    // Generar PDF individual
    const generarPDFIndividual = (historial) => {
        const pdf = new jsPDF();
        pdf.setFontSize(16);
        pdf.text("Historial Médico", 20, 20);

        pdf.setFontSize(12);
        pdf.text(`ID: ${historial.idHistorial || historial.IdHistorial}`, 20, 40);
        pdf.text(`Mascota: ${historial.mascota?.nombre || historial.Mascota?.Nombre || 'N/A'}`, 20, 50);
        pdf.text(`Propietario: ${historial.mascota?.propietario?.nombre || historial.Mascota?.Propietario?.Nombre || 'N/A'}`, 20, 60);
        pdf.text(`Fecha: ${formatFecha(historial.fecha || historial.Fecha)}`, 20, 70);
        pdf.text("Descripción:", 20, 80);
        pdf.text(historial.descripcion || historial.Descripcion, 20, 90, { maxWidth: 170 });

        pdf.save(`Historial_${historial.idHistorial || historial.IdHistorial}.pdf`);
    };

    if (cargando) {
        return <div className="loading">Cargando historiales médicos...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="table-container">
            <button onClick={handleCrearHistorial} className="create-button">
                ➕ Crear Historial Médico
            </button>

            {historiales.length === 0 ? (
                <div className="empty">No hay historiales médicos registrados</div>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Mascota</th>
                            <th>Propietario</th>
                            <th>Fecha</th>
                            <th>Descripción</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historiales.map((historial) => {
                            const historialId = historial.idHistorial || historial.IdHistorial;
                            return (
                                <tr key={historialId}>
                                    <td>{historialId}</td>
                                    <td>{historial.mascota?.nombre || historial.Mascota?.Nombre || 'N/A'}</td>
                                    <td>{historial.mascota?.propietario?.nombre || historial.Mascota?.Propietario?.Nombre || 'N/A'}</td>
                                    <td>{formatFecha(historial.fecha || historial.Fecha)}</td>
                                    <td className="truncate-text">{historial.descripcion || historial.Descripcion}</td>
                                    <td className="actions-cell">
                                        <button 
                                            onClick={() => handleEliminar(historialId)}
                                            className="action-button delete-button"
                                        >
                                            🗑️ Eliminar
                                        </button>
                                        <button 
                                            onClick={() => generarPDFIndividual(historial)}
                                            className="action-button pdf-button"
                                        >
                                            📄 Generar PDF
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
