import React, { useState } from 'react'; // Importamos React y useState para manejar estado
import './Login.css'; // Estilos del componente de login

function Login({ setCurrentView, onLoginSuccess, usersDatabase }) { // Componente Login que recibe función para cambiar vista, callback de login exitoso y base de datos de usuarios
  // Estado para el tipo de formulario actual (login, register, unsubscribe)
  const [formType, setFormType] = useState('login');
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'profesor_normal' // Valor por defecto para tipo de profesor
  });

  // Función para manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // Actualiza el estado correspondiente
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Previene recarga de página
    if (formType === 'login') {
      // Validar credenciales contra la base de datos
      const user = usersDatabase.find(u => u.email === formData.email && u.password === formData.password);
      if (user) {
        console.log('Login exitoso:', user);
        onLoginSuccess(user); // Llamar callback con usuario encontrado
      } else {
        alert('Credenciales incorrectas. Inténtalo de nuevo.');
      }
    } else if (formType === 'register') {
      console.log('Register:', formData); // Log de datos de registro
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      setFormType('login'); // Cambiar a formulario de login
    } else if (formType === 'unsubscribe') {
      console.log('Unsubscribe:', formData.email); // Log de email para baja
      alert('Solicitud de baja procesada.');
      setCurrentView('home'); // Volver al inicio
    }
    // Aquí se implementaría la lógica real de autenticación/registro/baja
  };

  return (
    <div className="login-container"> {/* Contenedor principal con fondo gradiente */}
      <div className="login-card"> {/* Tarjeta del formulario con efectos visuales */}
        <h2 className="login-title"> {/* Título dinámico según el tipo de formulario */}
          {formType === 'login' && 'Iniciar Sesión'}
          {formType === 'register' && 'Registrarse'}
          {formType === 'unsubscribe' && 'Darse de Baja'}
        </h2>
        <form onSubmit={handleSubmit} className="login-form"> {/* Formulario con manejo de envío */}
          {/* Campos condicionales según el tipo de formulario */}
          {formType === 'register' && ( /* Campo nombre solo para registro */
            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
          )}
          {formType === 'register' && ( /* Campo tipo de usuario solo para registro */
            <div className="form-group">
              <label htmlFor="userType">Tipo de Usuario</label>
              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleInputChange}
                required
              >
                <option value="profesor_normal">Profesor Normal</option>
                <option value="profesor_avanzado">Profesor Avanzado</option>
                <option value="profesor_admin">Admin</option>
              </select>
            </div>
          )}
          {/* Campo email para login, registro y darse de baja */}
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          {/* Campo contraseña solo para login y registro */}
          {formType !== 'unsubscribe' && (
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
          )}
          {/* Campo solo para darse de baja */}
          {formType === 'unsubscribe' && (
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          )}
          <button type="submit" className="submit-btn"> {/* Botón de envío dinámico */}
            {formType === 'login' && 'Iniciar Sesión'}
            {formType === 'register' && 'Registrarse'}
            {formType === 'unsubscribe' && 'Darse de Baja'}
          </button>
        </form>
        <div className="form-switch"> {/* Contenedor para botones de cambio de formulario */}
          {/* Botones condicionales para cambiar entre tipos de formulario */}
          {formType !== 'login' && (
            <button onClick={() => setFormType('login')} className="switch-btn">
              ¿Ya tienes cuenta? Inicia Sesión
            </button>
          )}
          {formType !== 'register' && (
            <button onClick={() => setFormType('register')} className="switch-btn">
              ¿No tienes cuenta? Regístrate
            </button>
          )}
          {formType !== 'unsubscribe' && (
            <button onClick={() => setFormType('unsubscribe')} className="switch-btn">
              Darse de Baja
            </button>
          )}
        </div>
        <button onClick={() => setCurrentView('home')} className="back-btn"> {/* Botón para volver al inicio */}
          Volver al Inicio
        </button>
      </div>
    </div>
  );
}

export default Login; // Exportamos el componente