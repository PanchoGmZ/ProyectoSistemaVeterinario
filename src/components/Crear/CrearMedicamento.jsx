import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Crear.css';

const CrearMedicamento = () => {
    const navigate = useNavigate();
    const [medicamento, setMedicamento] = useState({
        nombre: '',
        descripcion: '',
        precio: ''
    });
    const [error, setError] = useState(null);

    const limpiarCampos = () => {
        setMedicamento({
            nombre: '',
            descripcion: '',
            precio: ''
        });
    };

    const handleVolver = () => navigate('/');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMedicamento(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const medicamentoData = {
                nombre: medicamento.nombre,
                descripcion: medicamento.descripcion,
                precio: parseFloat(medicamento.precio)
            };

            const response = await fetch('https://localhost:7167/api/Medicamento', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(medicamentoData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.title || errorData.message || 'Error al crear medicamento');
            }

            const result = await response.json();
            alert(result.mensaje || 'Medicamento creado exitosamente');
            limpiarCampos(); // Limpia los campos después de éxito
        } catch (error) {
            console.error('Error al crear medicamento:', error);
            setError(error.message);
        }
    };

    return (
        <div className="crear-container">
            <button onClick={handleVolver} className="volver-button">
                &larr; Volver a Medicamentos
            </button>
            
            <form className="medicamento-form" onSubmit={handleSubmit}>
                <h2>Registrar Nuevo Medicamento</h2>
                
                {error && <div className="error">{error}</div>}
                
                <div className="form-group">
                    <label>
                        Nombre*:
                        <input
                            type="text"
                            name="nombre"
                            value={medicamento.nombre}
                            onChange={handleChange}
                            required
                            minLength="3"
                            maxLength="100"
                        />
                    </label>
                </div>
                
                <div className="form-group">
                    <label>
                        Descripción*:
                        <textarea
                            name="descripcion"
                            value={medicamento.descripcion}
                            onChange={handleChange}
                            required
                            minLength="10"
                            maxLength="500"
                            rows="4"
                        />
                    </label>
                </div>
                
                <div className="form-group">
                    <label>
                        Precio* (Bs):
                        <input
                            type="number"
                            name="precio"
                            value={medicamento.precio}
                            onChange={handleChange}
                            required
                            min="0.01"
                            max="10000"
                            step="0.01"
                        />
                    </label>
                </div>
                
                <div className="form-actions">
                    <button type="submit" className="submit-button">
                        Registrar Medicamento
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CrearMedicamento;