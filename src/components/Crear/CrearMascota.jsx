import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Crear.css';

const CrearMascota = () => {
  const navigate = useNavigate();
  const [mascota, setMascota] = useState({
    nombre: '',
    especie: '',
    raza: '',
    edad: 0,
    genero: 'Macho',
    idPropietario: '',
    propietario: null
  });
  const [propietarios, setPropietarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPropietarios = async () => {
      try {
        const response = await fetch('https://localhost:7167/api/Propietario');
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const data = await response.json();
        setPropietarios(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPropietarios();
  }, []);

  const limpiarCampos = () => {
    setMascota({
      nombre: '',
      especie: '',
      raza: '',
      edad: 0,
      genero: 'Macho',
      idPropietario: '',
      propietario: null
    });
  };

  const handleVolver = () => navigate('/');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMascota(prev => ({
      ...prev,
      [name]: name === 'edad' ? Number(value) : value
    }));
  };

  const handlePropietarioChange = (e) => {
    const selectedId = Number(e.target.value);
    const selectedPropietario = propietarios.find(p => 
      p.idPropietario === selectedId || p.IdPropietario === selectedId
    );

    setMascota(prev => ({
      ...prev,
      idPropietario: selectedId,
      propietario: selectedPropietario ? {
        idPropietario: selectedPropietario.idPropietario || selectedPropietario.IdPropietario,
        nombre: selectedPropietario.nombre || selectedPropietario.Nombre,
        apellidos: selectedPropietario.apellidos || selectedPropietario.Apellidos,
        teléfono: selectedPropietario.teléfono || selectedPropietario.Teléfono || '',
        dirección: selectedPropietario.dirección || selectedPropietario.Dirección || ''
      } : null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!mascota.idPropietario) {
      alert('Debe seleccionar un propietario');
      return;
    }

    try {
      const mascotaData = {
        nombre: mascota.nombre,
        especie: mascota.especie,
        raza: mascota.raza,
        edad: mascota.edad,
        genero: mascota.genero,
        idPropietario: mascota.idPropietario,
        propietario: mascota.propietario
      };

      console.log("Enviando datos:", mascotaData);

      const response = await fetch('https://localhost:7167/api/Mascota', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mascotaData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error del servidor:", errorData);
        throw new Error(errorData.title || errorData.message || 'Error al crear mascota');
      }

      const result = await response.json();
      alert(result.mensaje || 'Mascota creada exitosamente');
      limpiarCampos(); // Limpia los campos después de éxito
      // Opcional: navigate('/mascotas'); si prefieres redirigir
    } catch (error) {
      console.error('Error completo:', error);
      alert(`Error al crear mascota: ${error.message}`);
    }
  };

  if (loading) return <div className="loading">Cargando propietarios...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="crear-container">
      <button onClick={handleVolver} className="volver-button">
        &larr; Volver a Mascotas
      </button>
      
      <form className="mascota-form" onSubmit={handleSubmit}>
        <h2>Registrar Nueva Mascota</h2>
        
        <div className="form-group">
          <label>
            Nombre*:
            <input
              type="text"
              name="nombre"
              value={mascota.nombre}
              onChange={handleChange}
              required
              minLength="2"
              maxLength="50"
            />
          </label>
        </div>
        
        <div className="form-group">
          <label>
            Especie*:
            <input
              type="text"
              name="especie"
              value={mascota.especie}
              onChange={handleChange}
              required
              minLength="3"
              maxLength="50"
            />
          </label>
        </div>
        
        <div className="form-group">
          <label>
            Raza*:
            <input
              type="text"
              name="raza"
              value={mascota.raza}
              onChange={handleChange}
              required
              minLength="3"
              maxLength="50"
            />
          </label>
        </div>
        
        <div className="form-group">
          <label>
            Edad*:
            <input
              type="number"
              name="edad"
              value={mascota.edad}
              onChange={handleChange}
              required
              min="0"
              max="50"
            />
          </label>
        </div>
        
        <div className="form-group">
          <label>
            Género*:
            <select
              name="genero"
              value={mascota.genero}
              onChange={handleChange}
              required
            >
              <option value="Macho">Macho</option>
              <option value="Hembra">Hembra</option>
            </select>
          </label>
        </div>
        
        <div className="form-group">
          <label>
            Propietario*:
            <select
              name="idPropietario"
              value={mascota.idPropietario || ''}
              onChange={handlePropietarioChange}
              required
            >
              <option value="">Seleccione un propietario</option>
              {propietarios.map(prop => {
                const propId = prop.idPropietario || prop.IdPropietario;
                const propNombre = prop.nombre || prop.Nombre;
                const propApellidos = prop.apellidos || prop.Apellidos;
                return (
                  <option key={propId} value={propId}>
                    {propNombre} {propApellidos}
                  </option>
                );
              })}
            </select>
          </label>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-button">
            Registrar Mascota
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearMascota;