import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {authService} from '../../services/authService';
import Swal from 'sweetalert2';
import '../../styles/Auth.css';

const Login= () => {
  const [formData, setFormData] = useState({
    correo: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.correo || !formData.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Por favor complete todos los campos'
      });
      return;
    }

    setLoading(true);

    try {
      // Intentar iniciar sesión
      const result = await authService.Login(formData.correo, formData.password);
      
      if (result.success) {
        // Login exitoso
        login(result.user);
        
        Swal.fire({
          icon: 'success',
          title: '¡Bienvenido!',
          text: result.message,
          timer: 2000,
          showConfirmButton: false
        });
        
        navigate('/dashboard');
      } else {
        // Error en login
        Swal.fire({
          icon: 'error',
          title: 'Error de autenticación',
          text: result.message
        });
      }
    } catch (error) {
      console.error('Error en login:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error inesperado'
      });
    } finally {
      setLoading(false);
    }
  };

  // Datos de prueba para facilitar el testing
  const fillTestData = () => {
    setFormData({
      correo: 'jaime@example.com',
      password: 'hashed_password'
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>PixelHub S.A.S</h1>
          <h2>Gestión de Suscripciones</h2>
          <p>Ingresa a tu cuenta para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="correo">Correo electrónico</label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Botón de datos de prueba para facilitar testing */}
        <div className="test-data-section">
          <button 
            type="button" 
            onClick={fillTestData}
            className="test-button"
          >
            Llenar datos de prueba
          </button>
          <small>
            Correo: jaime@example.com<br />
            Contraseña: hashed_password
          </small>
        </div>

        <div className="login-footer">
          <p>&copy; 2025 PixelHub S.A.S - Gestión de Suscripciones Digitales</p>
        </div>
      </div>
    </div>
  );
};

export default Login;