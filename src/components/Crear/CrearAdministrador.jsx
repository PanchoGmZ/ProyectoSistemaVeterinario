import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Crear.css';

const CrearAdministrador = () => {
  const navigate = useNavigate();
  const [administrador, setAdministrador] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    contraseña: '', // Cambiado de 'contrasena' a 'contraseña'
    estado: true
  });
  const [loading, setLoading] = useState(false);

  const limpiarCampos = () => {
    setAdministrador({
      nombre: '',
      correo: '',
      telefono: '',
      contraseña: '', // Cambiado de 'contrasena' a 'contraseña'
      estado: true
    });
  };

  const handleVolver = () => navigate('/');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAdministrador(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!administrador.nombre || !administrador.correo || !administrador.contraseña) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(administrador.correo)) {
      alert('Por favor ingrese un correo electrónico válido');
      return;
    }

    try {
      setLoading(true);
      
      const adminData = {
        nombre: administrador.nombre,
        correo: administrador.correo,
        telefono: administrador.telefono || null,
        contraseña: administrador.contraseña, // Cambiado de 'contrasena' a 'contraseña'
        estado: administrador.estado
      };

      console.log("Enviando datos:", adminData);

      const response = await fetch('https://localhost:7167/api/Administrador', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error del servidor:", errorData);
        
        // Mostrar errores de validación específicos si existen
        if (errorData.errors) {
          const validationErrors = Object.values(errorData.errors).flat().join('\n');
          throw new Error(validationErrors);
        }
        
        throw new Error(errorData.title || errorData.message || 'Error al crear administrador');
      }

      const result = await response.json();
      alert(result.mensaje || 'Administrador creado exitosamente');
      limpiarCampos();
      
    } catch (error) {
      console.error('Error completo:', error);
      alert(`Error al crear administrador:\n${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crear-container">
      <button onClick={handleVolver} className="volver-button">
        &larr; Volver a Administradores
      </button>
      
      <form className="administrador-form" onSubmit={handleSubmit}>
        <h2>Registrar Nuevo Administrador</h2>
        
        <div className="form-group">
          <label>Nombre Completo*:
            <input
              type="text"
              name="nombre"
              value={administrador.nombre}
              onChange={handleChange}
              required
              minLength="3"
              maxLength="100"
              placeholder="Ej: Juan Pérez"
            />
          </label>
        </div>
        
        <div className="form-group">
          <label>Correo Electrónico*:
            <input
              type="email"
              name="correo"
              value={administrador.correo}
              onChange={handleChange}
              required
              placeholder="Ej: admin@veterinaria.com"
            />
          </label>
        </div>
        
        <div className="form-group">
          <label>Contraseña*:
            <input
              type="password"
              name="contraseña" // Cambiado de 'contrasena' a 'contraseña'
              value={administrador.contraseña} // Cambiado de 'contrasena' a 'contraseña'
              onChange={handleChange}
              required
              minLength="6"
              placeholder="Mínimo 6 caracteres"
            />
          </label>
        </div>
        
        <div className="form-group">
          <label>Teléfono:
            <input
              type="tel"
              name="telefono"
              value={administrador.telefono}
              onChange={handleChange}
              placeholder="Opcional"
              maxLength="15"
            />
          </label>
        </div>
        
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="estado"
              checked={administrador.estado}
              onChange={handleChange}
            />
            Activo
          </label>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrar Administrador'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearAdministrador;