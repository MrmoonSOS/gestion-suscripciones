import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import Header from '../../components/Layout/Hearder.jsx';
import SubscriptionList from './SuscriptionList';
import SubscriptionForm from './SuscriptionForm';
import SearchBar from './SearchBar';
import { subscriptionService } from '../../services/subscriptioinService.js';
import Swal from 'sweetalert2'; // Asegúrate de tener este archivo CSS

const Dashboard = () => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar suscripciones al montar el componente
  useEffect(() => {
    loadSubscriptions();
  }, [user]);

  // Filtrar suscripciones cuando cambie el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSubscriptions(subscriptions);
    } else {
      const filtered = subscriptions.filter(sub =>
        sub.servicio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.notas.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSubscriptions(filtered);
    }
  }, [searchTerm, subscriptions]);

  // Función para cargar suscripciones
  const loadSubscriptions = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const result = await subscriptionService.getUserSubscriptions(user.id);
      
      if (result.success) {
        setSubscriptions(result.data);
        setFilteredSubscriptions(result.data);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result.message
        });
      }
    } catch (error) {
      console.error('Error al cargar suscripciones:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al cargar las suscripciones'
      });
    } finally {
      setLoading(false);
    }
  };

  // Función para agregar nueva suscripción
  const handleAddSubscription = async (subscriptionData) => {
    try {
      const dataWithUserId = {
        ...subscriptionData,
        usuarioId: user.id
      };

      const result = await subscriptionService.createSubscription(dataWithUserId);
      
      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: result.message,
          timer: 2000,
          showConfirmButton: false
        });
        
        await loadSubscriptions();
        setShowForm(false);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result.message
        });
      }
    } catch (error) {
      console.error('Error al agregar suscripción:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al agregar la suscripción'
      });
    }
  };

  // Función para editar suscripción
  const handleEditSubscription = async (subscriptionData) => {
    try {
      const result = await subscriptionService.updateSubscription(
        editingSubscription.id, 
        subscriptionData
      );
      
      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: result.message,
          timer: 2000,
          showConfirmButton: false
        });
        
        await loadSubscriptions();
        setShowForm(false);
        setEditingSubscription(null);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result.message
        });
      }
    } catch (error) {
      console.error('Error al editar suscripción:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al editar la suscripción'
      });
    }
  };

  // Función para eliminar suscripción
  const handleDeleteSubscription = async (subscriptionId) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const deleteResult = await subscriptionService.deleteSubscription(subscriptionId);
        
        if (deleteResult.success) {
          Swal.fire({
            icon: 'success',
            title: '¡Eliminado!',
            text: deleteResult.message,
            timer: 2000,
            showConfirmButton: false
          });
          
          await loadSubscriptions();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: deleteResult.message
          });
        }
      } catch (error) {
        console.error('Error al eliminar suscripción:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al eliminar la suscripción'
        });
      }
    }
  };

  // Función para abrir formulario de edición
  const openEditForm = (subscription) => {
    setEditingSubscription(subscription);
    setShowForm(true);
  };

  // Función para cerrar formulario
  const closeForm = () => {
    setShowForm(false);
    setEditingSubscription(null);
  };

  // Calcular estadísticas
  const totalSubscriptions = subscriptions.length;
  const totalCost = subscriptions.reduce((sum, sub) => sum + sub.costo, 0);
  const activeSubscriptions = subscriptions.filter(sub => sub.estado === 'activa').length;

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
            <h3>Total Suscripciones</h3>
            <p className="stat-number">{totalSubscriptions}</p>
          </div>
          <div className="stat-card">
            <h3>Suscripciones Activas</h3>
            <p className="stat-number">{activeSubscriptions}</p>
          </div>
          <div className="stat-card">
            <h3>Gasto Total Mensual</h3>
            <p className="stat-number">${totalCost.toLocaleString()} COP</p>
          </div>
        </div>

        {/* Barra de búsqueda y botón agregar */}
        <div className="dashboard-controls">
          <SearchBar 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          <button 
            className="add-button"
            onClick={() => setShowForm(true)}
          >
            + Agregar Suscripción
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
  );
};

export default Dashboard;