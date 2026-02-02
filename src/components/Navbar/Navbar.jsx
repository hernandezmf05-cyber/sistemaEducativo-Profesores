import React, { useState, useEffect } from 'react'; // Importamos React y hooks para manejar estado y efectos

import './Navbar.css'; // Estilos específicos de la barra de navegación

function Navbar({ query, setQuery, setCurrentView, toggleDarkMode, isDark, currentUser, handleLogout }) {
  // Función Navbar que recibe props para búsqueda, navegación, modo oscuro, usuario actual y logout
  const [localQuery, setLocalQuery] = useState(query || '');

  useEffect(() => {
    setLocalQuery(query || '');
  }, [query]);

  // Debounce: actualiza `setQuery` en App después de 300ms
  useEffect(() => {
    const t = setTimeout(() => setQuery(localQuery), 300);
    return () => clearTimeout(t);
  }, [localQuery, setQuery]);

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
            value={localQuery} // Valor controlado localmente para debounce
            onChange={(e) => setLocalQuery(e.target.value)} // Actualiza estado local
            onKeyDown={(e) => { if (e.key === 'Enter') setCurrentView('profesores-list'); }}
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