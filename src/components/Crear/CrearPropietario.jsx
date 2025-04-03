import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Crear.css';

const CrearPropietario = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');

  const handleVolver = () => {
    navigate('/');
  };

  const limpiarCampos = () => {
    setNombre('');
    setApellidos('');
    setTelefono('');
    setDireccion('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const propietarioData = {
      Nombre: nombre,
      Apellidos: apellidos,
      Teléfono: telefono,
      Dirección: direccion
    };
  
    try {
      const response = await fetch('https://localhost:7167/api/Propietario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propietarioData),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
      }

      // Manejo flexible de la respuesta (texto o JSON)
      const responseText = await response.text();
      try {
        const data = JSON.parse(responseText);
        console.log('Propietario creado con éxito', data);
      } catch {
        console.log('Respuesta del servidor:', responseText);
      }
      
      alert('¡Propietario registrado exitosamente!');
      limpiarCampos();
      
    } catch (error) {
      console.error('Error al crear el propietario:', error.message);
      alert(`Error al crear el propietario: ${error.message}`);
    }
  };

  return (
    <div className="crear-container">
      <button onClick={handleVolver} className="volver-button">
        &larr; Volver a Propietarios
      </button>
      
      <form className="propietario-form" onSubmit={handleSubmit}>
        <h2>Registrar Nuevo Propietario</h2>
        
        <div className="form-group">
          <label>
            Nombre*:
            <input 
              type="text" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
              required 
              minLength="2"
              maxLength="50"
            />
          </label>
        </div>
        
        <div className="form-group">
          <label>
            Apellidos*:
            <input 
              type="text" 
              value={apellidos} 
              onChange={(e) => setApellidos(e.target.value)} 
              required 
              minLength="3"
              maxLength="100"
            />
          </label>
        </div>
        
        <div className="form-group">
          <label>
            Teléfono:
            <input 
              type="tel" 
              value={telefono} 
              onChange={(e) => setTelefono(e.target.value)} 
              minLength="8"
              maxLength="20"
            />
          </label>
        </div>
        
        <div className="form-group">
          <label>
            Dirección*:
            <input 
              type="text" 
              value={direccion} 
              onChange={(e) => setDireccion(e.target.value)} 
              required 
              minLength="10"
              maxLength="200"
            />
          </label>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-button">
            Registrar Propietario
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearPropietario;