import React, { useState, useEffect } from 'react';

const SubscriptionForm = ({ subscription, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    servicio: '',
    costo: '',
    moneda: 'COP',
    fechaInicio: '',
    fechaRenovacion: '',
    frecuencia: 'mensual',
    estado: 'activa',
    notas: '',
    categoria: 'Entretenimiento'
  });

  // Categorías disponibles
  const categorias = [
    'Entretenimiento',
    'Música',
    'Productividad',
    'Educación',
    'Salud',
    'Deportes',
    'Noticias',
    'Gaming',
    'Cloud',
    'Diseño'
  ];

  // Llenar formulario si es edición
  useEffect(() => {
    if (subscription) {
      setFormData({
        servicio: subscription.servicio || '',
        costo: subscription.costo || '',
        moneda: subscription.moneda || 'COP',
        fechaInicio: subscription.fechaInicio || '',
        fechaRenovacion: subscription.fechaRenovacion || '',
        frecuencia: subscription.frecuencia || 'mensual',
        estado: subscription.estado || 'activa',
        notas: subscription.notas || '',
        categoria: subscription.categoria || 'Entretenimiento'
      });
    }
  }, [subscription]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.servicio.trim() || !formData.costo || !formData.fechaInicio || !formData.fechaRenovacion) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    // Convertir costo a número
    const dataToSubmit = {
      ...formData,
      costo: parseFloat(formData.costo)
    };

    onSubmit(dataToSubmit);
  };

  // Calcular fecha de renovación automáticamente
  const calculateRenewalDate = (startDate, frequency) => {
    if (!startDate) return '';
    
    const start = new Date(startDate);
    let renewal = new Date(start);
    
    switch (frequency) {
      case 'mensual':
        renewal.setMonth(renewal.getMonth() + 1);
        break;
      case 'trimestral':
        renewal.setMonth(renewal.getMonth() + 3);
        break;
      case 'semestral':
        renewal.setMonth(renewal.getMonth() + 6);
        break;
      case 'anual':
        renewal.setFullYear(renewal.getFullYear() + 1);
        break;
      default:
        renewal.setMonth(renewal.getMonth() + 1);
    }
    
    return renewal.toISOString().split('T')[0];
  };

  // Auto-calcular fecha de renovación cuando cambian fecha inicio o frecuencia
  useEffect(() => {
    if (formData.fechaInicio && formData.frecuencia) {
      const newRenewalDate = calculateRenewalDate(formData.fechaInicio, formData.frecuencia);
      setFormData(prev => ({
        ...prev,
        fechaRenovacion: newRenewalDate
      }));
    }
  }, [formData.fechaInicio, formData.frecuencia]);

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <div className="form-header">
          <h2>
            {subscription ? 'Editar Suscripción' : 'Nueva Suscripción'}
          </h2>
          <button 
            className="close-btn"
            onClick={onCancel}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="subscription-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="servicio">Nombre del Servicio *</label>
              <input
                type="text"
                id="servicio"
                name="servicio"
                value={formData.servicio}
                onChange={handleChange}
                placeholder="ej: Netflix, Spotify..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="categoria">Categoría *</label>
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                required
              >
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="costo">Costo *</label>
              <input
                type="number"
                id="costo"
                name="costo"
                value={formData.costo}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="100"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="moneda">Moneda</label>
              <select
                id="moneda"
                name="moneda"
                value={formData.moneda}
                onChange={handleChange}
              >
                <option value="COP">COP</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="frecuencia">Frecuencia *</label>
              <select
                id="frecuencia"
                name="frecuencia"
                value={formData.frecuencia}
                onChange={handleChange}
                required
              >
                <option value="mensual">Mensual</option>
                <option value="trimestral">Trimestral</option>
                <option value="semestral">Semestral</option>
                <option value="anual">Anual</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fechaInicio">Fecha de Inicio *</label>
              <input
                type="date"
                id="fechaInicio"
                name="fechaInicio"
                value={formData.fechaInicio}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="fechaRenovacion">Fecha de Renovación *</label>
              <input
                type="date"
                id="fechaRenovacion"
                name="fechaRenovacion"
                value={formData.fechaRenovacion}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="estado">Estado</label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
              >
                <option value="activa">Activa</option>
                <option value="inactiva">Inactiva</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notas">Notas (opcional)</label>
            <textarea
              id="notas"
              name="notas"
              value={formData.notas}
              onChange={handleChange}
              placeholder="Plan familiar, compartido, etc..."
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={onCancel}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="submit-btn"
            >
              {subscription ? 'Actualizar' : 'Agregar'} Suscripción
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubscriptionForm;