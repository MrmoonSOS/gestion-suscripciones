const API_BASE_URL = 'https://api-prueba-uno.onrender.com';

// Servicio de autenticación
export const authService = {
  // Función para iniciar sesión
  async Login(correo, password) {
    try {
      // Obtener todos los usuarios
      const response = await fetch(`${API_BASE_URL}/usuarios`);
      
      if (!response.ok) {
        throw new Error('Error al conectar con el servidor');
      }

      const usuarios = await response.json();
      
      // Buscar usuario por correo y contraseña
      const usuario = usuarios.find(u => 
        u.correo === correo && u.password === password
      );

      if (usuario) {
        // Remover la contraseña del objeto usuario antes de devolverlo
        const { password: _, ...usuarioSinPassword } = usuario;
        return {
          success: true,
          user: usuarioSinPassword,
          message: 'Inicio de sesión exitoso'
        };
      } else {
        return {
          success: false,
          message: 'Correo o contraseña incorrectos'
        };
      }
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        message: 'Error de conexión. Intente nuevamente.'
      };
    }
  },

  // Función para registro (opcional)
  async register(nombre, correo, password) {
    try {
      // Verificar si el usuario ya existe
      const response = await fetch(`${API_BASE_URL}/usuarios`);
      
      if (!response.ok) {
        throw new Error('Error al conectar con el servidor');
      }

      const usuarios = await response.json();
      const usuarioExistente = usuarios.find(u => u.correo === correo);

      if (usuarioExistente) {
        return {
          success: false,
          message: 'Ya existe un usuario con este correo'
        };
      }

      // Crear nuevo usuario
      const nuevoUsuario = {
        nombre,
        correo,
        password, // En producción se debería hashear
        fechaRegistro: new Date().toISOString()
      };

      const createResponse = await fetch(`${API_BASE_URL}/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoUsuario)
      });

      if (!createResponse.ok) {
        throw new Error('Error al crear el usuario');
      }

      const usuarioCreado = await createResponse.json();
      
      // Remover la contraseña del objeto usuario antes de devolverlo
      const { password: _, ...usuarioSinPassword } = usuarioCreado;
      
      return {
        success: true,
        user: usuarioSinPassword,
        message: 'Usuario registrado exitosamente'
      };
    } catch (error) {
      console.error('Error en registro:', error);
      return {
        success: false,
        message: 'Error de conexión. Intente nuevamente.'
      };
    }
  }
};