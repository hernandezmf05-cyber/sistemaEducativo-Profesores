import React from 'react'; // Importamos React para crear componentes

import './Navbar.css'; // Estilos específicos de la barra de navegación

function Navbar({ query, setQuery, setCurrentView, toggleDarkMode, isDark, currentUser, handleLogout }) {
  // Función Navbar que recibe props para búsqueda, navegación, modo oscuro, usuario actual y logout
  console.log('Navbar rendered'); // Log para debugging
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="/logo.png" alt="Sura company logo for teacher management system navigation header" className="logo" /> {/* Logo de Sura */}
        <h2>Sistema de Gestión de Profesores</h2> {/* Título de la aplicación */}
      </div>
      <ul className="nav-menu"> {/* Lista de elementos de navegación */}
        <li><button onClick={() => setCurrentView('home')}>Inicio</button></li> {/* Botón para ir a la vista de inicio */}
        <li><button onClick={() => setCurrentView('profesores-list')}>Profesores</button></li> {/* Botón para ver lista de profesores */}
        {currentUser && currentUser.userType.includes('profesor') && (
          <li className="dropdown">
            <button className="dropbtn">Gestión Profesores</button>
            <div className="dropdown-content">
              <button onClick={() => setCurrentView('profesores-add')}>Agregar Profesor</button>
              {(currentUser.userType === 'profesor_admin') && (
                <button onClick={() => setCurrentView('profesores-edit')}>Editar Profesores</button>
              )}
              {(currentUser.userType === 'profesor_admin') && (
                <button onClick={() => setCurrentView('profesores-assign-courses')}>Asignar Cursos</button>
              )}
            </div>
          </li>
        )}
      </ul>
      <div className="navbar-right"> {/* Contenedor para elementos del lado derecho */}
        <div className="search-box"> {/* Contenedor de la caja de búsqueda */}
          <input
            type="text"
            placeholder="Buscar profesores..." // Placeholder descriptivo
            value={query} // Valor controlado por el estado
            onChange={(e) => setQuery(e.target.value)} // Actualiza el estado de búsqueda
            className="search-input" // Clase CSS para estilos
          />
          <button className="search-button" onClick={() => setCurrentView('profesores-list')}> {/* Botón de búsqueda */}
            Buscar
          </button>
        </div>
        <button onClick={toggleDarkMode} className="theme-toggle"> {/* Botón para alternar modo oscuro */}
          {isDark ? '☀️' : '🌙'} {/* Icono de sol o luna según el modo */}
        </button>
        {currentUser ? (
          <div className="user-info">
            <span className="user-name">Hola, {currentUser.name}</span>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <button className="login-button" onClick={() => setCurrentView('login')}> {/* Botón para ir al login */}
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar; // Exportamos el componente para usarlo en App.jsx