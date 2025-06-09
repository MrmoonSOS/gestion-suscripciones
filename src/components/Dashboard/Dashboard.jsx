"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useAuth } from "../../context/AuthContext.jsx"
import Header from "../../components/Layout/Hearder.jsx"
import SubscriptionList from "./SuscriptionList"
import SubscriptionForm from "./SuscriptionForm"
import SearchBar from "./SearchBar"
import { subscriptionService } from "../../services/subscriptioinService.js"
import Swal from "sweetalert2"

const Dashboard = () => {
  const { user } = useAuth()
  const [subscriptions, setSubscriptions] = useState([])
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSubscription, setEditingSubscription] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Cargar suscripciones - memoizado para evitar recreaciones innecesarias
  const loadSubscriptions = useCallback(async () => {
    if (!user) return

    setLoading(true)
    try {
      const result = await subscriptionService.getUserSubscriptions(user.id)

      if (result.success) {
        setSubscriptions(result.data)
        setFilteredSubscriptions(result.data)
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message,
          background: "#ffffff",
          borderRadius: "12px",
        })
      }
    } catch (error) {
      console.error("Error al cargar suscripciones:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al cargar las suscripciones",
        background: "#ffffff",
        borderRadius: "12px",
      })
    } finally {
      setLoading(false)
    }
  }, [user])

  // Cargar suscripciones al montar el componente
  useEffect(() => {
    loadSubscriptions()
  }, [loadSubscriptions])

  // Filtrar suscripciones cuando cambie el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredSubscriptions(subscriptions)
    } else {
      const searchTermLower = searchTerm.toLowerCase()
      const filtered = subscriptions.filter(
        (sub) =>
          sub.servicio.toLowerCase().includes(searchTermLower) ||
          sub.categoria.toLowerCase().includes(searchTermLower) ||
          (sub.notas && sub.notas.toLowerCase().includes(searchTermLower)),
      )
      setFilteredSubscriptions(filtered)
    }
  }, [searchTerm, subscriptions])

  // Función para agregar nueva suscripción
  const handleAddSubscription = async (subscriptionData) => {
    try {
      const dataWithUserId = {
        ...subscriptionData,
        usuarioId: user.id,
      }

      const result = await subscriptionService.createSubscription(dataWithUserId)

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: result.message,
          timer: 2000,
          showConfirmButton: false,
          background: "#ffffff",
          borderRadius: "12px",
        })

        await loadSubscriptions()
        setShowForm(false)
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message,
          background: "#ffffff",
          borderRadius: "12px",
        })
      }
    } catch (error) {
      console.error("Error al agregar suscripción:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al agregar la suscripción",
        background: "#ffffff",
        borderRadius: "12px",
      })
    }
  }

  // Función para editar suscripción
  const handleEditSubscription = async (subscriptionData) => {
    try {
      const result = await subscriptionService.updateSubscription(editingSubscription.id, subscriptionData)

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: result.message,
          timer: 2000,
          showConfirmButton: false,
          background: "#ffffff",
          borderRadius: "12px",
        })

        await loadSubscriptions()
        setShowForm(false)
        setEditingSubscription(null)
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message,
          background: "#ffffff",
          borderRadius: "12px",
        })
      }
    } catch (error) {
      console.error("Error al editar suscripción:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al editar la suscripción",
        background: "#ffffff",
        borderRadius: "12px",
      })
    }
  }

  // Función para eliminar suscripción
  const handleDeleteSubscription = async (subscriptionId) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6366f1",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#ffffff",
      borderRadius: "12px",
    })

    if (result.isConfirmed) {
      try {
        const deleteResult = await subscriptionService.deleteSubscription(subscriptionId)

        if (deleteResult.success) {
          Swal.fire({
            icon: "success",
            title: "¡Eliminado!",
            text: deleteResult.message,
            timer: 2000,
            showConfirmButton: false,
            background: "#ffffff",
            borderRadius: "12px",
          })

          await loadSubscriptions()
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: deleteResult.message,
            background: "#ffffff",
            borderRadius: "12px",
          })
        }
      } catch (error) {
        console.error("Error al eliminar suscripción:", error)
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al eliminar la suscripción",
          background: "#ffffff",
          borderRadius: "12px",
        })
      }
    }
  }

  // Función para abrir formulario de edición
  const openEditForm = useCallback((subscription) => {
    setEditingSubscription(subscription)
    setShowForm(true)
  }, [])

  // Función para cerrar formulario
  const closeForm = useCallback(() => {
    setShowForm(false)
    setEditingSubscription(null)
  }, [])

  // Calcular estadísticas - memoizadas para evitar recálculos innecesarios
  const stats = useMemo(() => {
    return {
      totalSubscriptions: subscriptions.length,
      totalCost: subscriptions.reduce((sum, sub) => sum + sub.costo, 0),
      activeSubscriptions: subscriptions.filter((sub) => sub.estado === "activa").length,
    }
  }, [subscriptions])

  return (
    <div className="dashboard">
      <Header />

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Panel de Suscripciones</h1>
          <p>Bienvenido, {user?.nombre}</p>
        </div>

        {/* Estadísticas */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
            </div>
            <div className="stat-content">
              <h3>Total Suscripciones</h3>
              <p className="stat-number">{stats.totalSubscriptions}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon active">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div className="stat-content">
              <h3>Suscripciones Activas</h3>
              <p className="stat-number">{stats.activeSubscriptions}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon cost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <div className="stat-content">
              <h3>Gasto Total Mensual</h3>
              <p className="stat-number">${stats.totalCost.toLocaleString()} COP</p>
            </div>
          </div>
        </div>

        {/* Barra de búsqueda y botón agregar */}
        <div className="dashboard-controls">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <button className="add-button" onClick={() => setShowForm(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="add-icon"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Agregar Suscripción
          </button>
        </div>

        {/* Formulario de suscripción (modal) */}
        {showForm && (
          <SubscriptionForm
            subscription={editingSubscription}
            onSubmit={editingSubscription ? handleEditSubscription : handleAddSubscription}
            onCancel={closeForm}
          />
        )}

        {/* Lista de suscripciones */}
        <div className="subscriptions-section">
          {loading ? (
            <div className="loading">
              <div className="loader"></div>
              <p>Cargando suscripciones...</p>
            </div>
          ) : (
            <SubscriptionList
              subscriptions={filteredSubscriptions}
              onEdit={openEditForm}
              onDelete={handleDeleteSubscription}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
