import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Crear.css';

const CrearVeterinario = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [fechaDeContrato, setFechaDeContrato] = useState('');

  const handleVolver = () => {
    navigate('/');
  };

  const limpiarCampos = () => {
    setNombre('');
    setApellidos('');
    setEspecialidad('');
    setFechaDeContrato('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const veterinarioData = {
      Nombre: nombre,
      Apellidos: apellidos,
      Especialidad: especialidad,
      FechaDeContrato: fechaDeContrato
    };
  
    try {
      const response = await fetch('https://localhost:7167/api/Veterinario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(veterinarioData),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
      }

      // Primero intentamos leer como texto
      const responseText = await response.text();
      
      // Intentamos parsear como JSON solo si el texto parece JSON
      try {
        const data = JSON.parse(responseText);
        console.log('Veterinario creado con éxito', data);
      } catch {
        console.log('Respuesta del servidor:', responseText);
      }
      
      alert('¡Veterinario registrado exitosamente!');
      limpiarCampos();
      
    } catch (error) {
      console.error('Error al crear el veterinario:', error.message);
      alert(`Error al crear el veterinario: ${error.message}`);
    }
  };

  return (
    <div className="crear-container">
      <button onClick={handleVolver} className="volver-button">
        &larr; Volver a Veterinarios
      </button>
      
      <form className="veterinario-form" onSubmit={handleSubmit}>
        <h2>Registrar Nuevo Veterinario</h2>
        
        <div className="form-group">
          <label>
            Nombre:
            <input 
              type="text" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
              required 
            />
          </label>
        </div>
        
        <div className="form-group">
          <label>
            Apellidos:
            <input 
              type="text" 
              value={apellidos} 
              onChange={(e) => setApellidos(e.target.value)} 
              required 
            />
          </label>
        </div>
        
        <div className="form-group">
          <label>
            Especialidad:
            <input 
              type="text" 
              value={especialidad} 
              onChange={(e) => setEspecialidad(e.target.value)} 
              required 
            />
          </label>
        </div>
        
        <div className="form-group">
          <label>
            Fecha de Contrato:
            <input 
              type="date" 
              value={fechaDeContrato} 
              onChange={(e) => setFechaDeContrato(e.target.value)} 
              required 
            />
          </label>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-button">
            Registrar Veterinario
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearVeterinario;