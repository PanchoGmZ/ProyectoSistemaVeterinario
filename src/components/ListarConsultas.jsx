import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

export function ListarConsultas() {
  const [consultas, setConsultas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://localhost:7167/api/Consulta');
        if (!response.ok) throw new Error('Error al cargar consultas');
        const data = await response.json();
        setConsultas(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };
    fetchData();
  }, []);

  const handleCrearConsulta = () => {
    navigate("/crear-consulta");
  };

  const handleEditar = (idConsulta) => {
    navigate(`/editar-consulta/${idConsulta}`);
  };

  const handleEliminar = async (idConsulta) => {
    if (window.confirm('¿Estás seguro de eliminar esta consulta?')) {
      try {
        const response = await fetch(`https://localhost:7167/api/Consulta/idConsulta?id=${idConsulta}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al eliminar consulta');
        }
        
        setConsultas(prevConsultas => 
          prevConsultas.filter(consulta => 
            (consulta.idConsulta || consulta.IdConsulta) !== idConsulta
          )
        );
        
        alert('Consulta eliminada correctamente');
        
      } catch (error) {
        console.error('Error al eliminar:', error);
        alert(error.message || 'No se pudo eliminar la consulta');
      }
    }
  };
  
  const formatFechaHora = (fecha, hora) => {
    const fechaObj = new Date(fecha);
    const horaObj = new Date(hora);
    return `
      ${fechaObj.toLocaleDateString()} 
      ${horaObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    `;
  };

  // Función para generar PDF de todas las consultas
  const generarPDF = () => {
    const doc = new jsPDF();
    
    // Configuración de estilos
    const fontSizeHeader = 12;
    const fontSizeContent = 10;
    const lineHeight = 7;
    const marginLeft = 15;
    const marginTop = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Título del documento
    doc.setFontSize(18);
    doc.text("Listado de Consultas Veterinarias", marginLeft, marginTop);
    
    // Fecha de generación
    doc.setFontSize(fontSizeContent);
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, marginLeft, marginTop + 10);
    
    // Encabezados de columna
    const headers = ["ID", "Fecha y Hora", "Veterinario", "Mascota", "Diagnóstico", "Tratamiento"];
    
    // Ancho de cada columna (ajustar según necesidad)
    const colWidths = [15, 35, 30, 30, 40, 40];
    const totalWidth = colWidths.reduce((a, b) => a + b, 0);
    
    // Posición inicial de la tabla
    let y = marginTop + 20;
    let startX = marginLeft;
    
    // Función para agregar una nueva página
    const addNewPage = () => {
      doc.addPage();
      y = marginTop;
      
      // Encabezado en nueva página
      doc.setFontSize(fontSizeHeader);
      doc.setFont(undefined, 'bold');
      
      let x = startX;
      headers.forEach((header, i) => {
        doc.text(header, x, y);
        x += colWidths[i];
      });
      
      doc.setFont(undefined, 'normal');
      doc.setFontSize(fontSizeContent);
      y += lineHeight;
      
      // Línea bajo encabezados
      doc.line(startX, y - 2, startX + totalWidth, y - 2);
    };
    
    // Dibujar encabezados
    doc.setFontSize(fontSizeHeader);
    doc.setFont(undefined, 'bold');
    
    let x = startX;
    headers.forEach((header, i) => {
      doc.text(header, x, y);
      x += colWidths[i];
    });
    
    doc.setFont(undefined, 'normal');
    doc.setFontSize(fontSizeContent);
    y += lineHeight;
    
    // Línea bajo encabezados
    doc.line(startX, y - 2, startX + totalWidth, y - 2);
    
    // Función para manejar texto largo
    const getLines = (text, maxWidth) => {
      if (!text) return [""];
      return doc.splitTextToSize(text.toString(), maxWidth);
    };
    
    // Dibujar filas de datos
    consultas.forEach((c, index) => {
      const fechaHora = formatFechaHora(c.fecha || c.Fecha, c.hora || c.Hora).trim();
      const veterinario = c.veterinario?.nombre || c.Veterinario?.Nombre || 'N/A';
      const mascota = c.mascota?.nombre || c.Mascota?.Nombre || 'N/A';
      const diagnostico = c.diagnóstico || c.Diagnóstico || '';
      const tratamiento = c.tratamiento || c.Tratamiento || '';
      
      // Calcular la altura necesaria para esta fila
      const diagLines = getLines(diagnostico, colWidths[4] - 2);
      const tratLines = getLines(tratamiento, colWidths[5] - 2);
      const maxLines = Math.max(1, diagLines.length, tratLines.length);
      const rowHeight = maxLines * (lineHeight - 2);
      
      // Verificar si necesitamos una nueva página
      if (y + rowHeight > doc.internal.pageSize.getHeight() - 20) {
        addNewPage();
      }
      
      // Alternar color de fondo para cada fila
      if (index % 2 === 0) {
        doc.setFillColor(240, 240, 240);
        doc.rect(startX, y - 5, totalWidth, rowHeight + 3, 'F');
      }
      
      // Dibujar valores de la fila
      x = startX;
      
      // ID
      doc.text((c.idConsulta || c.IdConsulta).toString(), x, y);
      x += colWidths[0];
      
      // Fecha y Hora
      doc.text(fechaHora, x, y);
      x += colWidths[1];
      
      // Veterinario
      doc.text(veterinario, x, y);
      x += colWidths[2];
      
      // Mascota
      doc.text(mascota, x, y);
      x += colWidths[3];
      
      // Diagnóstico
      doc.text(diagLines, x, y);
      x += colWidths[4];
      
      // Tratamiento
      doc.text(tratLines, x, y);
      
      // Actualizar posición vertical para la siguiente fila
      y += rowHeight;
      
      // Agregar línea divisoria entre filas
      doc.setDrawColor(200, 200, 200);
      doc.line(startX, y, startX + totalWidth, y);
      doc.setDrawColor(0, 0, 0);
      
      y += 3; // Espacio entre filas
    });
    
    // Numeración de páginas
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Página ${i} de ${totalPages}`, pageWidth - 40, doc.internal.pageSize.getHeight() - 10);
    }
    
    // Guardar el PDF
    doc.save("listado-consultas.pdf");
  };

  // Nueva función para generar PDF de una consulta individual
  const generarPDFIndividual = (idConsulta) => {
    // Buscar la consulta específica
    const consulta = consultas.find(c => 
      (c.idConsulta || c.IdConsulta) === idConsulta
    );
    
    if (!consulta) {
      alert("No se encontró la consulta");
      return;
    }
    
    const doc = new jsPDF();
    const marginLeft = 20;
    let y = 20;
    const lineHeight = 10;
    
    // Título
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text(`Consulta Veterinaria #${idConsulta}`, marginLeft, y);
    y += 15;
    
    // Función para añadir secciones
    const addSection = (title, content) => {
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(title, marginLeft, y);
      y += lineHeight;
      
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      
      // Si el contenido es un array, asumimos que son líneas ya divididas
      if (Array.isArray(content)) {
        content.forEach(line => {
          doc.text(line, marginLeft, y);
          y += lineHeight - 2;
        });
      } else {
        // Si es string, lo manejamos como texto que puede necesitar división
        const lines = doc.splitTextToSize(content || "N/A", 170);
        lines.forEach(line => {
          doc.text(line, marginLeft, y);
          y += lineHeight - 2;
        });
      }
      
      y += 5; // Espacio adicional después de cada sección
    };
    
    // Fecha y hora
    const fechaObj = new Date(consulta.fecha || consulta.Fecha);
    const horaObj = new Date(consulta.hora || consulta.Hora);
    const fechaFormateada = fechaObj.toLocaleDateString();
    const horaFormateada = horaObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    addSection("Fecha:", fechaFormateada);
    addSection("Hora:", horaFormateada);
    
    // Veterinario
    const nombreVeterinario = consulta.veterinario?.nombre || consulta.Veterinario?.Nombre || 'N/A';
    addSection("Veterinario:", nombreVeterinario);
    
    // Mascota
    const nombreMascota = consulta.mascota?.nombre || consulta.Mascota?.Nombre || 'N/A';
    addSection("Mascota:", nombreMascota);
    
    // Diagnóstico
    const diagnostico = consulta.diagnóstico || consulta.Diagnóstico || 'N/A';
    addSection("Diagnóstico:", diagnostico);
    
    // Tratamiento
    const tratamiento = consulta.tratamiento || consulta.Tratamiento || 'N/A';
    addSection("Tratamiento:", tratamiento);
    
    // Guardar el PDF
    doc.save(`consulta-${idConsulta}.pdf`);
  };

  if (cargando) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  
  if (consultas.length === 0) {
    return (
      <div>
        <button 
          onClick={handleCrearConsulta}
          className="create-button"
        >
          ➕ Crear Consulta
        </button>
        <div className="empty">No hay consultas registradas</div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <div className="button-container">
        <button 
          onClick={handleCrearConsulta}
          className="create-button"
        >
          ➕ Crear Consulta
        </button>
        
        <button 
          onClick={generarPDF}
          className="pdf-button"
        >
          📄 Generar PDF de todas las consultas
        </button>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha y Hora</th>
            <th>Veterinario</th>
            <th>Mascota</th>
            <th>Diagnóstico</th>
            <th>Tratamiento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {consultas.map((c) => (
            <tr key={c.idConsulta || c.IdConsulta}>
              <td>{c.idConsulta || c.IdConsulta}</td>
              <td>{formatFechaHora(c.fecha || c.Fecha, c.hora || c.Hora)}</td>
              <td>{c.veterinario?.nombre || c.Veterinario?.Nombre || 'N/A'}</td>
              <td>{c.mascota?.nombre || c.Mascota?.Nombre || 'N/A'}</td>
              <td className="truncate-text">{c.diagnóstico || c.Diagnóstico}</td>
              <td className="truncate-text">{c.tratamiento || c.Tratamiento}</td>
              <td className="actions-cell">
  
                <button 
                  onClick={() => handleEliminar(c.idConsulta || c.IdConsulta)}
                  className="action-button delete-button"
                >
                  🗑️ Eliminar
                </button>
                <button 
                  onClick={() => generarPDFIndividual(c.idConsulta || c.IdConsulta)}
                  className="action-button pdf-single-button"
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