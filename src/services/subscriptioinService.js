const API_BASE_URL = 'https://api-prueba-uno.onrender.com';

// Servicio para gestión de suscripciones
export const subscriptionService = {
  // Obtener todas las suscripciones de un usuario
  async getUserSubscriptions(usuarioId) {
    try {
      const response = await fetch(`${API_BASE_URL}/suscripciones`);
      
      if (!response.ok) {
        throw new Error('Error al obtener suscripciones');
      }

      const suscripciones = await response.json();
      
      // Filtrar suscripciones por usuario
      const suscripcionesUsuario = suscripciones.filter(
        sub => sub.usuarioId == usuarioId
      );

      return {
        success: true,
        data: suscripcionesUsuario
      };
    } catch (error) {
      console.error('Error al obtener suscripciones:', error);
      return {
        success: false,
        message: 'Error al cargar las suscripciones'
      };
    }
  },

  // Crear nueva suscripción
  async createSubscription(suscripcionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/suscripciones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(suscripcionData)
      });

      if (!response.ok) {
        throw new Error('Error al crear suscripción');
      }

      const nuevaSuscripcion = await response.json();
      
      return {
        success: true,
        data: nuevaSuscripcion,
        message: 'Suscripción creada exitosamente'
      };
    } catch (error) {
      console.error('Error al crear suscripción:', error);
      return {
        success: false,
        message: 'Error al crear la suscripción'
      };
    }
  },

  // Actualizar suscripción
  async updateSubscription(id, suscripcionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/suscripciones/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(suscripcionData)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar suscripción');
      }

      const suscripcionActualizada = await response.json();
      
      return {
        success: true,
        data: suscripcionActualizada,
        message: 'Suscripción actualizada exitosamente'
      };
    } catch (error) {
      console.error('Error al actualizar suscripción:', error);
      return {
        success: false,
        message: 'Error al actualizar la suscripción'
      };
    }
  },

  // Eliminar suscripción
  async deleteSubscription(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/suscripciones/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Error al eliminar suscripción');
      }

      return {
        success: true,
        message: 'Suscripción eliminada exitosamente'
      };
    } catch (error) {
      console.error('Error al eliminar suscripción:', error);
      return {
        success: false,
        message: 'Error al eliminar la suscripción'
      };
    }
  },

  // Buscar suscripciones por término
  async searchSubscriptions(usuarioId, searchTerm) {
    try {
      const result = await this.getUserSubscriptions(usuarioId);
      
      if (!result.success) {
        return result;
      }

      const filteredSubscriptions = result.data.filter(sub =>
        sub.servicio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.notas.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return {
        success: true,
        data: filteredSubscriptions
      };
    } catch (error) {
      console.error('Error en búsqueda:', error);
      return {
        success: false,
        message: 'Error en la búsqueda'
      };
    }
  }
};