import React from 'react';
import SubscriptionCard from './SuscriptionCard';

const SubscriptionList = ({ subscriptions, onEdit, onDelete }) => {
  if (subscriptions.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📱</div>
        <h3>No tienes suscripciones</h3>
        <p>Agrega tu primera suscripción para comenzar a gestionar tus servicios digitales.</p>
      </div>
    );
  }

  return (
    <div className="subscriptions-container">
      <div className="subscriptions-grid">
        {subscriptions.map(subscription => (
          <SubscriptionCard
            key={subscription.id}
            subscription={subscription}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
      
      <div className="subscriptions-summary">
        <p>Mostrando {subscriptions.length} suscripción{subscriptions.length !== 1 ? 'es' : ''}</p>
      </div>
    </div>
  );
};

export default SubscriptionList;