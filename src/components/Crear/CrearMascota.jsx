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
  const [imagePreview, setImagePreview] = useState(null);
  const [localImage, setLocalImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar propietarios al montar el componente
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

  // Limpiar campos del formulario
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
    setImagePreview(null);
    setLocalImage(null);
  };

  // Manejar cambio en campos de texto/número/select
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMascota(prev => ({
      ...prev,
      [name]: name === 'edad' ? Number(value) : value
    }));
  };

  // Manejar cambio en selección de propietario
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

  // Manejar selección de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Por favor selecciona una imagen válida (JPEG, PNG, GIF o WEBP)');
      return;
    }

    // Validar tamaño (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen es demasiado grande. El tamaño máximo permitido es 2MB.');
      return;
    }

    // Guardar archivo para posible envío
    setLocalImage(file);

    // Crear previsualización
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Guardar imagen en localStorage
  const guardarImagenLocalmente = (mascotaId, imageFile) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const mascotasConImagen = JSON.parse(localStorage.getItem('mascotasImagenes')) || {};
        mascotasConImagen[mascotaId] = event.target.result;
        localStorage.setItem('mascotasImagenes', JSON.stringify(mascotasConImagen));
        resolve();
      };
      reader.readAsDataURL(imageFile);
    });
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!mascota.idPropietario) {
      alert('Debe seleccionar un propietario');
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Crear la mascota en el backend
      const mascotaData = {
        nombre: mascota.nombre,
        especie: mascota.especie,
        raza: mascota.raza,
        edad: mascota.edad,
        genero: mascota.genero,
        idPropietario: mascota.idPropietario,
        propietario: mascota.propietario
      };

      const response = await fetch('https://localhost:7167/api/Mascota', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mascotaData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.title || errorData.message || 'Error al crear mascota');
      }

      const result = await response.json();
      const mascotaId = result.id;

      // 2. Guardar imagen localmente si existe
      if (localImage) {
        await guardarImagenLocalmente(mascotaId, localImage);
      }

      alert(result.mensaje || 'Mascota creada exitosamente');
      limpiarCampos();
      navigate('/mascotas');
    } catch (error) {
      console.error('Error al crear mascota:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Cargando propietarios...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="crear-container">
      <button onClick={() => navigate('/')} className="volver-button">
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
              pattern="[A-Za-zÁ-ú\s]+"
              title="Solo letras y espacios"
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
        
        <div className="form-group">
          <label>
            Imagen de la mascota (solo local):
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isSubmitting}
            />
          </label>
          {imagePreview && (
            <div className="image-preview">
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{ maxWidth: '200px', maxHeight: '200px' }}
              />
            </div>
          )}
          <small className="image-note">
            La imagen se guardará solo en este navegador
          </small>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : 'Registrar Mascota'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearMascota;