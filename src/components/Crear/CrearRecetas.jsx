import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Crear.css';

const CrearReceta = () => {
  const navigate = useNavigate();
  const [receta, setReceta] = useState({
    idConsulta: '',
    idMedicamento: '',
    dosis: '',
    indicaciones: '',
    fechaPrescripcion: new Date().toISOString().split('T')[0]
  });
  const [consultas, setConsultas] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [consultasResponse, medicamentosResponse] = await Promise.all([
          fetch('https://localhost:7167/api/Consulta'),
          fetch('https://localhost:7167/api/Medicamento')
        ]);

        if (!consultasResponse.ok) throw new Error('Error al cargar consultas');
        if (!medicamentosResponse.ok) throw new Error('Error al cargar medicamentos');

        const [consultasData, medicamentosData] = await Promise.all([
          consultasResponse.json(),
          medicamentosResponse.json()
        ]);

        setConsultas(consultasData);
        setMedicamentos(medicamentosData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleVolver = () => navigate('/recetas');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReceta(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!receta.idConsulta || !receta.idMedicamento) {
      alert('Debe seleccionar tanto una consulta como un medicamento');
      return;
    }

    try {
      // Estructura simplificada según el ejemplo que funciona
      const recetaData = {
        idReceta: 0,
        idConsulta: Number(receta.idConsulta),
        consulta: {
          idConsulta: 0,
          fecha: "2025-04-01",
          hora: "2025-03-28T15:30:00",
          idVeterinario: 0,
          veterinario: {
            idVeterinario: 0,
            nombre: "string",
            apellidos: "string",
            especialidad: "string",
            fechaDeContrato: "2025-04-01"
          },
          idMascota: 0,
          mascota: {
            idMascota: 0,
            nombre: "string",
            especie: "string",
            raza: "string",
            edad: 50,
            genero: "string",
            idPropietario: 0,
            propietario: {
              idPropietario: 0,
              nombre: "string",
              apellidos: "string",
              teléfono: "stringst",
              dirección: "stringstri"
            }
          },
          diagnóstico: "stringstri",
          tratamiento: "stringstri"
        },
        idMedicamento: Number(receta.idMedicamento),
        medicamento: {
          idMedicamento: 0,
          nombre: "string",
          descripcion: "stringstri",
          precio: 10000
        },
        dosis: receta.dosis || "string",
        indicaciones: receta.indicaciones || "string",
        fechaPrescripcion: receta.fechaPrescripcion
      };

      console.log("Datos a enviar:", JSON.stringify(recetaData, null, 2));

      const response = await fetch('https://localhost:7167/api/Receta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recetaData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error del servidor:", errorData);
        throw new Error(errorData.title || errorData.message || 'Error al crear receta');
      }

      const result = await response.json();
      alert(result.mensaje || 'Receta creada exitosamente');
      
    } catch (error) {
      console.error('Error al crear receta:', error);
      alert(`Error al crear receta: ${error.message}`);
    }
  };

  if (loading) return <div className="loading">Cargando datos...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="crear-container">
      <button onClick={handleVolver} className="volver-button">
        &larr; Volver a Recetas
      </button>
      
      <form className="receta-form" onSubmit={handleSubmit}>
        <h2>Registrar Nueva Receta</h2>
        
        <div className="form-row">
          <div className="form-group">
            <label>
              Consulta*:
              <select
                name="idConsulta"
                value={receta.idConsulta}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una consulta</option>
                {consultas.map(consulta => {
                  const consultaId = consulta.idConsulta || consulta.IdConsulta;
                  const mascotaNombre = consulta.mascota?.nombre || consulta.Mascota?.Nombre || 'N/A';
                  return (
                    <option key={consultaId} value={consultaId}>
                      Consulta #{consultaId} - Mascota: {mascotaNombre}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>
          
          <div className="form-group">
            <label>
              Medicamento*:
              <select
                name="idMedicamento"
                value={receta.idMedicamento}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un medicamento</option>
                {medicamentos.map(med => {
                  const medId = med.idMedicamento || med.IdMedicamento;
                  const medNombre = med.nombre || med.Nombre;
                  return (
                    <option key={medId} value={medId}>
                      {medNombre}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>
              Dosis*:
              <input
                type="text"
                name="dosis"
                value={receta.dosis}
                onChange={handleChange}
                required
                placeholder="Ej: 1 tableta cada 8 horas"
              />
            </label>
          </div>
          
          <div className="form-group">
            <label>
              Fecha Prescripción*:
              <input
                type="date"
                name="fechaPrescripcion"
                value={receta.fechaPrescripcion}
                onChange={handleChange}
                required
              />
            </label>
          </div>
        </div>
        
        <div className="form-group">
          <label>
            Indicaciones*:
          <textarea
            name="indicaciones"
            value={receta.indicaciones}
            onChange={handleChange}
            rows="4"
            required
            placeholder="Instrucciones detalladas para el uso del medicamento"
            className="large-textarea"
          />
          </label>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-button">
            Registrar Receta
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearReceta;