import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Crear.css';

const CrearConsulta = () => {
  const navigate = useNavigate();
  const [consulta, setConsulta] = useState({
    fecha: '',
    hora: '',
    diagnóstico: '',
    tratamiento: '',
    idVeterinario: '',
    idMascota: ''
  });
  const [veterinarios, setVeterinarios] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vetsResponse, mascotasResponse] = await Promise.all([
          fetch('https://localhost:7167/api/Veterinario'),
          fetch('https://localhost:7167/api/Mascota')
        ]);

        if (!vetsResponse.ok) throw new Error('Error al cargar veterinarios');
        if (!mascotasResponse.ok) throw new Error('Error al cargar mascotas');

        const [vetsData, mascotasData] = await Promise.all([
          vetsResponse.json(),
          mascotasResponse.json()
        ]);

        setVeterinarios(vetsData);
        setMascotas(mascotasData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleVolver = () => navigate('/');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConsulta(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!consulta.idVeterinario || !consulta.idMascota) {
      alert('Debe seleccionar tanto un veterinario como una mascota');
      return;
    }

    try {
      // Formatear fecha y hora correctamente
      const fechaHoraISO = `${consulta.fecha}T${consulta.hora}:00`;
      
      const consultaData = {
        idConsulta: 0,
        fecha: consulta.fecha,
        hora: fechaHoraISO,
        idVeterinario: Number(consulta.idVeterinario),
        veterinario: {
          idVeterinario: 0,
          nombre: "string",
          apellidos: "string",
          especialidad: "string",
          fechaDeContrato: "2025-04-01"
        },
        idMascota: Number(consulta.idMascota),
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
        diagnóstico: consulta.diagnóstico,
        tratamiento: consulta.tratamiento
      };

      console.log("Datos a enviar:", JSON.stringify(consultaData, null, 2));

      const response = await fetch('https://localhost:7167/api/Consulta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(consultaData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error del servidor:", errorData);
        throw new Error(errorData.title || errorData.message || 'Error al crear consulta');
      }

      const result = await response.json();
      alert(result.mensaje || 'Consulta creada exitosamente');
      
      // No limpiamos los campos automáticamente
      // Permanecemos en el formulario para permitir múltiples registros
    } catch (error) {
      console.error('Error al crear consulta:', error);
      alert(`Error al crear consulta: ${error.message}`);
    }
  };

  if (loading) return <div className="loading">Cargando datos...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="crear-container">
      <button onClick={handleVolver} className="volver-button">
        &larr; Volver a Consultas
      </button>
      
      <form className="consulta-form" onSubmit={handleSubmit}>
        <h2>Registrar Nueva Consulta</h2>
        
        <div className="form-row">
          <div className="form-group">
            <label>
              Fecha*:
              <input
                type="date"
                name="fecha"
                value={consulta.fecha}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          
          <div className="form-group">
            <label>
              Hora*:
              <input
                type="time"
                name="hora"
                value={consulta.hora}
                onChange={handleChange}
                required
              />
            </label>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>
              Veterinario*:
              <select
                name="idVeterinario"
                value={consulta.idVeterinario}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un veterinario</option>
                {veterinarios.map(vet => {
                  const vetId = vet.idVeterinario || vet.IdVeterinario;
                  const vetNombre = vet.nombre || vet.Nombre;
                  const vetApellidos = vet.apellidos || vet.Apellidos;
                  const vetEspecialidad = vet.especialidad || vet.Especialidad;
                  return (
                    <option key={vetId} value={vetId}>
                      {vetNombre} {vetApellidos} ({vetEspecialidad})
                    </option>
                  );
                })}
              </select>
            </label>
          </div>
          
          <div className="form-group">
            <label>
              Mascota*:
              <select
                name="idMascota"
                value={consulta.idMascota}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una mascota</option>
                {mascotas.map(masc => {
                  const mascId = masc.idMascota || masc.IdMascota;
                  const mascNombre = masc.nombre || masc.Nombre;
                  const mascEspecie = masc.especie || masc.Especie;
                  const mascPropietario = masc.propietario?.nombre || masc.Propietario?.Nombre || 'Sin propietario';
                  return (
                    <option key={mascId} value={mascId}>
                      {mascNombre} ({mascEspecie}) - Dueño: {mascPropietario}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>
        </div>
        
        <div className="form-group">
          <label>
            Diagnóstico*:
            <textarea
              name="diagnóstico"
              value={consulta.diagnóstico}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Ingrese el diagnóstico de la consulta"
            />
          </label>
        </div>
        
        <div className="form-group">
          <label>
            Tratamiento*:
            <textarea
              name="tratamiento"
              value={consulta.tratamiento}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Ingrese el tratamiento recomendado"
            />
          </label>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-button">
            Registrar Consulta
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearConsulta;