import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Crear.css';

const CrearHistorialMedico = () => {
  const navigate = useNavigate();
  const [historial, setHistorial] = useState({
    idHistorial: 0,
    fecha: new Date().toISOString().split('T')[0],
    descripcion: '',
    idMascota: '',
    mascota: {
      idMascota: 0,
      nombre: '',
      especie: '',
      raza: '',
      edad: 0,
      genero: 'Macho',
      idPropietario: 0,
      propietario: {
        idPropietario: 0,
        nombre: '',
        apellidos: '',
        teléfono: '',
        dirección: ''
      }
    }
  });
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMascotas = async () => {
      try {
        const response = await fetch('https://localhost:7167/api/Mascota');
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const data = await response.json();
        setMascotas(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMascotas();
  }, []);

  const limpiarCampos = () => {
    setHistorial({
      idHistorial: 0,
      fecha: new Date().toISOString().split('T')[0],
      descripcion: '',
      idMascota: '',
      mascota: {
        idMascota: 0,
        nombre: '',
        especie: '',
        raza: '',
        edad: 0,
        genero: 'Macho',
        idPropietario: 0,
        propietario: {
          idPropietario: 0,
          nombre: '',
          apellidos: '',
          teléfono: '',
          dirección: ''
        }
      }
    });
  };

  const handleVolver = () => navigate('/');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHistorial(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMascotaChange = (e) => {
    const selectedId = Number(e.target.value);
    const selectedMascota = mascotas.find(m => 
      (m.idMascota || m.IdMascota) === selectedId
    );

    if (selectedMascota) {
      const propietario = selectedMascota.propietario || selectedMascota.Propietario || {};
      
      setHistorial(prev => ({
        ...prev,
        idMascota: selectedId,
        mascota: {
          idMascota: selectedMascota.idMascota || selectedMascota.IdMascota,
          nombre: selectedMascota.nombre || selectedMascota.Nombre,
          especie: selectedMascota.especie || selectedMascota.Especie,
          raza: selectedMascota.raza || selectedMascota.Raza,
          edad: selectedMascota.edad || selectedMascota.Edad || 0,
          genero: selectedMascota.genero || selectedMascota.Genero || "Macho",
          idPropietario: selectedMascota.idPropietario || selectedMascota.IdPropietario || 0,
          propietario: {
            idPropietario: propietario.idPropietario || propietario.IdPropietario || 0,
            nombre: propietario.nombre || propietario.Nombre || '',
            apellidos: propietario.apellidos || propietario.Apellidos || '',
            teléfono: propietario.teléfono || propietario.Teléfono || '',
            dirección: propietario.dirección || propietario.Dirección || ''
          }
        }
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!historial.idMascota) {
      alert('Debe seleccionar una mascota');
      return;
    }

    if (new Date(historial.fecha) > new Date()) {
      alert('La fecha no puede ser futura');
      return;
    }

    if (historial.descripcion.length < 10) {
      alert('La descripción debe tener al menos 10 caracteres');
      return;
    }

    try {
      const historialData = {
        idHistorial: 0,
        idMascota: historial.idMascota,
        mascota: {
          idMascota: historial.mascota.idMascota,
          nombre: historial.mascota.nombre,
          especie: historial.mascota.especie,
          raza: historial.mascota.raza,
          edad: historial.mascota.edad,
          genero: historial.mascota.genero,
          idPropietario: historial.mascota.idPropietario,
          propietario: {
            idPropietario: historial.mascota.propietario.idPropietario,
            nombre: historial.mascota.propietario.nombre,
            apellidos: historial.mascota.propietario.apellidos,
            teléfono: historial.mascota.propietario.teléfono,
            dirección: historial.mascota.propietario.dirección
          }
        },
        fecha: historial.fecha,
        descripcion: historial.descripcion
      };

      console.log("Enviando datos:", historialData);

      const response = await fetch('https://localhost:7167/api/HistorialMedico', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(historialData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error del servidor:", errorData);
        
        if (errorData.errors) {
          const validationErrors = Object.values(errorData.errors).flat().join('\n');
          throw new Error(validationErrors);
        }
        
        throw new Error(errorData.title || errorData.message || 'Error al crear historial médico');
      }

      const result = await response.json();
      alert(result.mensaje || 'Historial médico creado exitosamente');
      limpiarCampos();
    } catch (error) {
      console.error('Error completo:', error);
      alert(`Error al crear historial médico:\n${error.message}`);
    }
  };

  if (loading) return <div className="loading">Cargando mascotas...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="crear-container">
      <button onClick={handleVolver} className="volver-button">
        &larr; Volver a Historial Médico
      </button>
      
      <form className="mascota-form" onSubmit={handleSubmit}>
        <h2>Registrar Nuevo Historial Médico</h2>
        
        <div className="form-group">
          <label>
            Fecha*:
            <input
              type="date"
              name="fecha"
              value={historial.fecha}
              onChange={handleChange}
              required
              max={new Date().toISOString().split('T')[0]}
            />
          </label>
        </div>
        
        <div className="form-group">
          <label>
            Descripción*:
            <textarea
              name="descripcion"
              value={historial.descripcion}
              onChange={handleChange}
              required
              minLength="10"
              maxLength="500"
              rows="5"
              placeholder="Ingrese los detalles del historial médico (mínimo 10 caracteres)"
            />
          </label>
        </div>
        
        <div className="form-group">
          <label>
            Mascota*:
            <select
              name="idMascota"
              value={historial.idMascota || ''}
              onChange={handleMascotaChange}
              required
            >
              <option value="">Seleccione una mascota</option>
              {mascotas.map(mascota => {
                const mascotaId = mascota.idMascota || mascota.IdMascota;
                const mascotaNombre = mascota.nombre || mascota.Nombre;
                const propietario = mascota.propietario || mascota.Propietario || {};
                const propietarioNombre = propietario.nombre || propietario.Nombre || 'Sin propietario';
                
                return (
                  <option key={mascotaId} value={mascotaId}>
                    {mascotaNombre} (Propietario: {propietarioNombre})
                  </option>
                );
              })}
            </select>
          </label>
        </div>
        
        {historial.idMascota && (
          <div className="mascota-info">
            <h3>Información de la Mascota Seleccionada</h3>
            <p><strong>Nombre:</strong> {historial.mascota.nombre}</p>
            <p><strong>Especie:</strong> {historial.mascota.especie}</p>
            <p><strong>Raza:</strong> {historial.mascota.raza}</p>
            <p><strong>Edad:</strong> {historial.mascota.edad}</p>
            <p><strong>Género:</strong> {historial.mascota.genero}</p>
            {historial.mascota.propietario.nombre && (
              <>
                <p><strong>Propietario:</strong> {historial.mascota.propietario.nombre} {historial.mascota.propietario.apellidos}</p>
                <p><strong>Teléfono:</strong> {historial.mascota.propietario.teléfono}</p>
              </>
            )}
          </div>
        )}
        
        <div className="form-actions">
          <button type="submit" className="submit-button">
            Registrar Historial Médico
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearHistorialMedico;