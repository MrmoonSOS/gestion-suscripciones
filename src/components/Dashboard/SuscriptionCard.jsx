"use client"

import React, { useMemo } from "react"

const SubscriptionCard = ({ subscription, onEdit, onDelete }) => {
  // Función para formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Calcular días hasta renovación y clase CSS - memoizado
  const renewalInfo = useMemo(() => {
    const today = new Date()
    const renewal = new Date(subscription.fechaRenovacion)
    const diffTime = renewal - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    let renewalClass
    if (diffDays < 0) renewalClass = "expired"
    else if (diffDays <= 7) renewalClass = "urgent"
    else if (diffDays <= 30) renewalClass = "warning"
    else renewalClass = "normal"

    return { days: diffDays, class: renewalClass }
  }, [subscription.fechaRenovacion])

  // Obtener emoji según categoría - memoizado
  const categoryEmoji = useMemo(() => {
    const emojis = {
      Entretenimiento: "🎬",
      Música: "🎵",
      Productividad: "⚡",
      Educación: "📚",
      Salud: "💊",
      Deportes: "⚽",
      Noticias: "📰",
      Gaming: "🎮",
      Cloud: "☁️",
      Diseño: "🎨",
    }
    return emojis[subscription.categoria] || "📱"
  }, [subscription.categoria])

  return (
    <div className={`subscription-card ${subscription.estado}`}>
      <div className="card-header">
        <div className="service-info">
          <div className="service-icon">{categoryEmoji}</div>
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
            aria-label="Editar suscripción"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button
            className="delete-btn"
            onClick={() => onDelete(subscription.id)}
            title="Eliminar suscripción"
            aria-label="Eliminar suscripción"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </div>

      <div className="card-body">
        <div className="cost-info">
          <span className="cost-amount">
            ${subscription.costo.toLocaleString()} {subscription.moneda}
          </span>
          <span className="cost-frequency">/{subscription.frecuencia}</span>
        </div>

        <div className="renewal-info">
          <div className={`renewal-badge ${renewalInfo.class}`}>
            {renewalInfo.days < 0
              ? `Expiró hace ${Math.abs(renewalInfo.days)} días`
              : renewalInfo.days === 0
                ? "Expira hoy"
                : `${renewalInfo.days} días para renovar`}
          </div>
          <span className="renewal-date">Renovación: {formatDate(subscription.fechaRenovacion)}</span>
        </div>

        {subscription.notas && (
          <div className="subscription-notes">
            <small>{subscription.notas}</small>
          </div>
        )}

        <div className="subscription-status">
          <span className={`status-badge ${subscription.estado}`}>
            {subscription.estado === "activa" ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="status-icon"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Activa
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="status-icon"
                >
                  <rect x="6" y="4" width="4" height="16"></rect>
                  <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
                Inactiva
              </>
            )}
          </span>
          <span className="start-date">Desde: {formatDate(subscription.fechaInicio)}</span>
        </div>
      </div>
    </div>
  )
}

export default React.memo(SubscriptionCard)