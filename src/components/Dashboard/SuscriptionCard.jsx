import React from 'react';

const SubscriptionCard = ({ subscription, onEdit, onDelete }) => {
  // Función para formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Función para calcular días hasta renovación
  const getDaysUntilRenewal = (renewalDate) => {
    const today = new Date();
    const renewal = new Date(renewalDate);
    const diffTime = renewal - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Obtener clase CSS según días hasta renovación
  const getRenewalClass = (days) => {
    if (days < 0) return 'expired';
    if (days <= 7) return 'urgent';
    if (days <= 30) return 'warning';
    return 'normal';
  };

  // Obtener emoji según categoría
  const getCategoryEmoji = (categoria) => {
    const emojis = {
      'Entretenimiento': '🎬',
      'Música': '🎵',
      'Productividad': '⚡',
      'Educación': '📚',
      'Salud': '💊',
      'Deportes': '⚽',
      'Noticias': '📰',
      'Gaming': '🎮',
      'Cloud': '☁️',
      'Diseño': '🎨'
    };
    return emojis[categoria] || '📱';
  };

  const daysUntilRenewal = getDaysUntilRenewal(subscription.fechaRenovacion);
  const renewalClass = getRenewalClass(daysUntilRenewal);

  return (
    <div className={`subscription-card ${subscription.estado}`}>
      <div className="card-header">
        <div className="service-info">
          <div className="service-icon">
            {getCategoryEmoji(subscription.categoria)}
          </div>
          <div className="service-details">
            <h3 className="service-name">{subscription.servicio}</h3>
            <span className="service-category">{subscription.categoria}</span>
          </div>
        </div>
        
        <div className="card-actions">
          <button 
            className="edit-btn"
            onClick={() => onEdit(subscription)}
            title="Editar suscripción"
          >
            ✏️
          </button>
          <button 
            className="delete-btn"
            onClick={() => onDelete(subscription.id)}
            title="Eliminar suscripción"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="card-body">
        <div className="cost-info">
          <span className="cost-amount">
            ${subscription.costo.toLocaleString()} {subscription.moneda}
          </span>
          <span className="cost-frequency">
            /{subscription.frecuencia}
          </span>
        </div>

        <div className="renewal-info">
          <div className={`renewal-badge ${renewalClass}`}>
            {daysUntilRenewal < 0 
              ? `Expiró hace ${Math.abs(daysUntilRenewal)} días`
              : daysUntilRenewal === 0 
                ? 'Expira hoy'
                : `${daysUntilRenewal} días para renovar`
            }
          </div>
          <span className="renewal-date">
            Renovación: {formatDate(subscription.fechaRenovacion)}
          </span>
        </div>

        {subscription.notas && (
          <div className="subscription-notes">
            <small>{subscription.notas}</small>
          </div>
        )}

        <div className="subscription-status">
          <span className={`status-badge ${subscription.estado}`}>
            {subscription.estado === 'activa' ? '✅ Activa' : '⏸️ Inactiva'}
          </span>
          <span className="start-date">
            Desde: {formatDate(subscription.fechaInicio)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCard;