import React from 'react'; // Importamos React para crear componentes

import './Navbar.css'; // Estilos específicos de la barra de navegación

function Navbar({ query, setQuery, setCurrentView, toggleDarkMode, isDark }) {
  // Función Navbar que recibe props para búsqueda, navegación y modo oscuro
  console.log('Navbar rendered'); // Log para debugging
  return (
    <nav className="navbar"> {/* Elemento de navegación principal */}
      <h2>¿Tu prospecto es psicopata o narcisista?</h2> {/* Título de la aplicación */}
      <ul className="nav-menu"> {/* Lista de elementos de navegación */}
        <li><button onClick={() => setCurrentView('home')}>Home</button></li> {/* Botón para ir a la vista de inicio */}
        <li><button onClick={() => setCurrentView('documents')}>Documents</button></li> {/* Botón para ir a la vista de documentos */}
        <li><button>Test</button></li> {/* Botón de prueba (sin funcionalidad) */}
      </ul>
      <div className="navbar-right"> {/* Contenedor para elementos del lado derecho */}
        <button onClick={toggleDarkMode} className="theme-toggle"> {/* Botón para alternar modo oscuro */}
          {isDark ? '☀️' : '🌙'} {/* Icono de sol o luna según el modo */}
        </button>
        <div className="search-box"> {/* Contenedor de la caja de búsqueda */}
          <input
            type="text"
            placeholder="Buscar documentos de orden psicológico..." // Placeholder descriptivo
            value={query} // Valor controlado por el estado
            onChange={(e) => setQuery(e.target.value)} // Actualiza el estado de búsqueda
            className="search-input" // Clase CSS para estilos
          />
          <button className="search-button"> {/* Botón de búsqueda (sin funcionalidad específica) */}
            Buscar
          </button>
        </div>
        <button className="login-button" onClick={() => setCurrentView('login')}> {/* Botón para ir al login */}
          Login
        </button>
      </div>
    </nav>
  );
}

export default Navbar; // Exportamos el componente para usarlo en App.jsx