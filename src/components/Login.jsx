import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export function Login() {
    const [correo, setCorreo] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(
                `https://localhost:7167/api/Administrador/Login?correo=${encodeURIComponent(correo)}&contraseña=${encodeURIComponent(contraseña)}`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data || 'Credenciales incorrectas');
            }
            const { IdAdministrador, Nombre, Correo } = data;
            localStorage.setItem('vetAdmin', JSON.stringify({ 
                IdAdministrador, 
                Nombre, 
                Correo 
            }));
            
            navigate('/');
            window.location.reload();

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Iniciar Sesión</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Correo Electrónico</label>
                        <input
                            type="email"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            value={contraseña}
                            onChange={(e) => setContraseña(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Verificando...' : 'Iniciar Sesión'}
                    </button>
                </form>
            </div>
        </div>
    );
}