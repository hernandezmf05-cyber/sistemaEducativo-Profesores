# Clase React (versión `class`) y especificaciones técnicas

## Pasos que seguí

- Analicé `src/App.jsx` y los componentes en `src/components` para identificar imports y mecanismos de navegación.
- Convertí la lógica principal a una `class` React equivalente (incluyo el código completo más abajo).
- Documenté las importaciones, estados, handlers y los métodos usados para la navegación entre vistas.

---

## 1) Clase React (App) — Código (class component)

```jsx
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar/Navbar.jsx';
import Documents from './components/Documents/Documents.jsx';
import DocumentsReadOnly from './components/Documents/DocumentsReadOnly.jsx';
import Login from './components/Login/Login.jsx';
import Profesores from './components/Profesores/Profesores.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      currentView: 'home',
      isDark: false,
      documents: [
        { id: 1, title: 'Documento 1', content: 'Contenido psicológico 1', pdfFile: null },
        { id: 2, title: 'Documento 2', content: 'Contenido psicológico 2', pdfFile: null },
      ],
      profesores: [
        { id: 1, nombre: 'Juan Pérez', especialidad: 'Matemáticas', foto: 'https://via.placeholder.com/150', cursosAsignados: [1,2], descripcion: 'Experiencia...', estado: 'activo', hojaDeVida: null, fotoFile: null },
        { id: 2, nombre: 'María García', especialidad: 'Física', foto: 'https://via.placeholder.com/150', cursosAsignados: [3], descripcion: 'Especialista...', estado: 'activo', hojaDeVida: null, fotoFile: null },
      ],
      cursos: [
        { id: 1, nombre: 'Álgebra Lineal', descripcion: 'Curso básico' },
        { id: 2, nombre: 'Cálculo Diferencial', descripcion: 'Introducción al cálculo' },
        { id: 3, nombre: 'Física Mecánica', descripcion: 'Principios de la mecánica' },
      ],
      query: '',
      currentUser: null,
    };
  }

  componentDidMount() {
    // Aplicar modo oscuro si corresponde
    document.body.className = this.state.isDark ? 'dark' : '';
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isDark !== this.state.isDark) {
      document.body.className = this.state.isDark ? 'dark' : '';
    }
  }

  handleLoginSuccess = (user) => {
    this.setState({ currentUser: user }, () => {
      if (user.userType && user.userType.includes('profesor')) {
        this.setState({ currentView: 'profesores-list' });
      } else if (user.userType === 'usuario') {
        this.setState({ currentView: 'documents-readonly' });
      } else {
        this.setState({ currentView: 'documents-crud' });
      }
    });
  }

  handleLogout = () => {
    this.setState({ currentUser: null, currentView: 'home' });
  }

  toggleDarkMode = () => {
    this.setState((s) => ({ isDark: !s.isDark }));
  }

  setQuery = (q) => this.setState({ query: q });

  setCurrentView = (view) => this.setState({ currentView: view });

  // Document handlers
  handleCreate = (newDoc) => {
    this.setState((s) => ({ documents: [...s.documents, { id: Date.now(), ...newDoc }] }));
  }

  handleUpdate = (id, updatedDoc) => {
    this.setState((s) => ({ documents: s.documents.map(d => d.id === id ? { ...d, ...updatedDoc } : d) }));
  }

  handleDelete = (id) => {
    this.setState((s) => ({ documents: s.documents.filter(d => d.id !== id) }));
  }

  // Profesores handlers
  handleCreateProfesor = (newProf) => {
    this.setState((s) => ({ profesores: [...s.profesores, { id: Date.now(), ...newProf, estado: 'activo' }] }));
  }

  handleUpdateProfesor = (id, updatedProf) => {
    this.setState((s) => ({ profesores: s.profesores.map(p => p.id === id ? { ...p, ...updatedProf } : p) }));
  }

  handleDeactivateProfesor = (id) => {
    this.setState((s) => ({ profesores: s.profesores.map(p => p.id === id ? { ...p, estado: 'inactivo' } : p) }));
  }

  handleAssignCursos = (profId, cursosIds) => {
    this.setState((s) => ({ profesores: s.profesores.map(p => p.id === profId ? { ...p, cursos: cursosIds } : p) }));
  }

  render() {
    const { currentView, isDark, documents, profesores, cursos, query, currentUser } = this.state;
    const filteredProfesores = profesores.filter(prof =>
      prof.nombre.toLowerCase().includes(query.toLowerCase()) ||
      (prof.especialidad || '').toLowerCase().includes(query.toLowerCase()) ||
      (prof.descripcion || '').toLowerCase().includes(query.toLowerCase())
    );

    return (
      <div className="App">
        <Navbar
          query={query}
          setQuery={this.setQuery}
          setCurrentView={this.setCurrentView}
          toggleDarkMode={this.toggleDarkMode}
          isDark={isDark}
          currentUser={currentUser}
          handleLogout={this.handleLogout}
        />

        {currentView === 'home' && (
          <header className="App-header">
            <h1>Sistema de Gestión de Profesores</h1>
            <p>Bienvenido al sistema.</p>
          </header>
        )}

        {currentView === 'documents-crud' && (
          <Documents documents={documents} onCreate={this.handleCreate} onUpdate={this.handleUpdate} onDelete={this.handleDelete} />
        )}

        {currentView === 'documents-readonly' && (
          <DocumentsReadOnly documents={documents} />
        )}

        {currentView === 'login' && (
          <Login setCurrentView={this.setCurrentView} onLoginSuccess={this.handleLoginSuccess} usersDatabase={[]} />
        )}

        {currentView.startsWith('profesores-') && (
          <Profesores
            currentView={currentView}
            currentUser={currentUser}
            profesores={filteredProfesores}
            cursos={cursos}
            onCreateProfesor={this.handleCreateProfesor}
            onUpdateProfesor={this.handleUpdateProfesor}
            onDeactivateProfesor={this.handleDeactivateProfesor}
            onAssignCursos={this.handleAssignCursos}
            setCurrentView={this.setCurrentView}
            query={query}
            setQuery={this.setQuery}
          />
        )}
      </div>
    );
  }
}

export default App;
```

> Nota: el código de arriba es una traducción fiel de la lógica existente en `src/App.jsx` pero implementada como `class`.

---

## 2) Especificaciones técnicas importantes

- Lenguajes y herramientas:
  - React (JSX), CSS.
  - No se utiliza React Router: la navegación entre vistas se implementa mediante el estado `currentView` en `App.jsx`.
  - Manejo de archivos (subida/descarga) con `FileReader` y `URL.createObjectURL` en componentes (`Profesores`, `Documents`).

- Archivos clave analizados:
  - `src/App.jsx` — lógica principal, estado y handlers.
  - `src/components/Navbar/Navbar.jsx` — botones que llaman `setCurrentView(...)` para cambiar vista.
  - `src/components/Login/Login.jsx` — formularios y llamada a `onLoginSuccess(user)`.
  - `src/components/Documents/*.jsx` — CRUD de documentos y vista solo lectura.
  - `src/components/Profesores/Profesores.jsx` — gestión avanzada de profesores, archivos y asignación de cursos.

- Módulos importados entre sí (resumen):
  - `App.jsx` importa: `Navbar`, `Documents`, `DocumentsReadOnly`, `Login`, `Profesores`, además de `React`, `App.css`, `logo.svg`.
  - Cada componente importa su propio CSS (por ejemplo `Navbar.css`, `Login.css`, `Documents.css`, `Profesores.css`).

- Estado central y responsabilidades (en `App`):
  - `count`: contador simple (UI).
  - `currentView`: controla la vista renderizada.
  - `isDark`: modo oscuro — aplicado al `document.body.className`.
  - `documents`: lista de documentos (CRUD).
  - `profesores`: lista de profesores y sus metadatos.
  - `cursos`: catálogo de cursos.
  - `query`: texto de búsqueda compartido.
  - `currentUser`: usuario autenticado.

- Handlers principales (implementados en `App`):
  - `handleLoginSuccess(user)` — setea `currentUser` y redirige por tipo de usuario.
  - `handleLogout()` — limpia `currentUser` y vuelve a `home`.
  - `toggleDarkMode()` — alterna `isDark`.
  - `handleCreate` / `handleUpdate` / `handleDelete` — CRUD de documentos.
  - `handleCreateProfesor` / `handleUpdateProfesor` / `handleDeactivateProfesor` / `handleAssignCursos` — gestión de profesores.

- Mecanismos de navegación detectados (mapeo y métodos usados):
  - Navegación basada en estado:
    - `setCurrentView('home')` — desde `Navbar` y botones "Volver al Inicio".
    - `setCurrentView('login')` — desde `Navbar` botón Login.
    - `setCurrentView('profesores-list')`, `'profesores-add'`, `'profesores-edit'`, `'profesores-assign-courses'`, `'profesores-profile'` — invocados desde `Navbar` y `Profesores`.
    - `setCurrentView('documents-crud')` / `setCurrentView('documents-readonly')` — seleccionados según `currentUser` o botones.
  - Botones que realizan navegación:
    - `Navbar` — botones `<button onClick={() => setCurrentView('...')}>`.
    - `Login` — `setCurrentView('home')` en botón "Volver al Inicio" y `onLoginSuccess(user)` al loguearse.
    - `Profesores` — `setCurrentView('profesores-profile')`, `setCurrentView('profesores-edit')`, etc. en botones dentro de cada tarjeta de profesor.
  - No hay rutas URL ni historial del navegador gestionado; por tanto, la navegación no actualiza la barra de direcciones.

- Interacciones de archivo y descarga:
  - `Profesores` usa `FileReader` para leer imágenes y `URL.createObjectURL` para descargas de CV.
  - `Documents` muestra PDF (si existe) y usa `window.open(URL.createObjectURL(file))` para abrir PDFs.

---

## 3) Recomendaciones y notas de migración a `react-router` (opcional)

- Si desea tener URLs por vista (por ejemplo `/login`, `/profesores/123`), migrar a `react-router-dom` v6:
  - Instalar: `npm install react-router-dom`
  - Reemplazar `currentView` por `Routes` y `Route` en `App`.
  - Usar `useNavigate()` en componentes funcionales o `withRouter`/wrappers para class components.

---

## 4) Comandos útiles para ejecutar el proyecto (asumiendo setup típico Create React App)

```bash
npm install
npm start
# o
yarn
yarn start
```

---

## 5) Entrega

- Archivo creado: `REACT_CLASS_SPEC.md` (este documento).

Si quieres, puedo:
- 1) Convertir todos los componentes funcionales actuales a `class` (si deseas homogeneizar),
- 2) Migrar la navegación a `react-router-dom` y actualizar botones para usar rutas, o
- 3) Añadir ejemplos de pruebas unitarias para los handlers críticos.

Dime cuál de estas siguientes acciones prefieres y la realizo ahora.
