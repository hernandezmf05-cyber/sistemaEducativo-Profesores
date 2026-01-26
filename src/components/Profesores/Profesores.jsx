import React, { useState, useEffect } from 'react';
import './Profesores.css';

function Profesores({ currentView, currentUser, profesores, cursos, onCreateProfesor, onUpdateProfesor, onDeactivateProfesor, onAssignCursos, setCurrentView }) {
  const [selectedProf, setSelectedProf] = useState(null);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', especialidad: '', foto: '', descripcion: '', hojaDeVidaFile: null, fotoFile: null });
  const [selectedCursos, setSelectedCursos] = useState([]);

  // AGREGADO: URL de avatar por defecto (imagen de usuario genérico)
  const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

  useEffect(() => {
    if (currentView === 'profesores-add') {
      setEditing(null);
      setFormData({ nombre: '', especialidad: '', foto: '', descripcion: '' });
    } else if (currentView === 'profesores-edit' && selectedProf) {
      setFormData({
        nombre: selectedProf.nombre,
        especialidad: selectedProf.especialidad,
        foto: selectedProf.foto,
        descripcion: selectedProf.descripcion,
        hojaDeVidaFile: null, // No cargar archivo existente
        fotoFile: null
      });
    } else if (currentView === 'profesores-assign-courses' && selectedProf) {
      setSelectedCursos(selectedProf.cursos);
    }
  }, [currentView, selectedProf]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (name === 'fotoFile') {
          setFormData({ ...formData, foto: reader.result, fotoFile: file });
        } else if (name === 'hojaDeVidaFile') {
          setFormData({ ...formData, hojaDeVidaFile: file });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCursoChange = (cursoId) => {
    setSelectedCursos(prev => prev.includes(cursoId) ? prev.filter(id => id !== cursoId) : [...prev, cursoId]);
  };

  const handleAdd = () => {
    if (formData.nombre && formData.especialidad) {
      const newProf = {
        nombre: formData.nombre,
        especialidad: formData.especialidad,
        foto: formData.foto,
        descripcion: formData.descripcion,
        hojaDeVidaFile: formData.hojaDeVidaFile,
        fotoFile: formData.fotoFile
      };
      onCreateProfesor(newProf);
      setCurrentView('profesores-list');
    }
  };

  const handleUpdate = () => {
    if (editing && formData.nombre && formData.especialidad) {
      const updatedProf = {
        nombre: formData.nombre,
        especialidad: formData.especialidad,
        foto: formData.foto,
        descripcion: formData.descripcion,
        hojaDeVidaFile: formData.hojaDeVidaFile,
        fotoFile: formData.fotoFile
      };
      onUpdateProfesor(editing, updatedProf);
      setCurrentView('profesores-list');
    }
  };

  const handleDeactivate = (id) => {
    onDeactivateProfesor(id);
  };

  const handleAssign = () => {
    if (selectedProf) {
      onAssignCursos(selectedProf.id, selectedCursos);
      setCurrentView('profesores-list');
    }
  };

  const isAdmin = currentUser && currentUser.userType === 'profesor_admin';
  const activeProfesores = profesores.filter(p => p.estado === 'activo');

  if (currentView === 'profesores-list') {
    const listToShow = isAdmin ? profesores : activeProfesores;
    return (
      <div className="profesores-container">
        <h2>Lista de Profesores</h2>
        <div className="profesores-grid">
          {listToShow.map(prof => (
            <div key={prof.id} className="profesor-card">
              {/* MODIFICADO: Usar defaultAvatar si no hay foto */}
              <img 
                src={prof.foto || defaultAvatar} 
                alt={prof.nombre} 
                className="profesor-foto" 
                onError={(e) => { e.target.src = defaultAvatar; }} // AGREGADO: Si falla la carga, mostrar avatar por defecto
              />
              <h3>{prof.nombre}</h3>
              <p>{prof.especialidad}</p>
              {isAdmin && <p>Estado: {prof.estado}</p>}
              <button onClick={() => { setSelectedProf(prof); setCurrentView('profesores-profile'); }}>Ver Perfil</button>
              {isAdmin && (
                <div>
                  <button onClick={() => setCurrentView('profesores-edit')}>Editar</button>
                  <button onClick={() => { setSelectedProf(prof); setSelectedCursos(prof.cursosAsignados || []); setCurrentView('profesores-assign-courses'); }}>Asignar Cursos</button>
                  <button onClick={() => handleDeactivate(prof.id)}>Desactivar</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (currentView === 'profesores-profile' && selectedProf) {
    const profCursos = cursos.filter(c => (selectedProf.cursosAsignados || []).includes(c.id));
    return (
      <div className="profesores-container">
        <h2>Perfil del Profesor</h2>
        <div className="profesor-profile">
          {/* MODIFICADO: Usar defaultAvatar si no hay foto */}
          <img 
            src={selectedProf.foto || defaultAvatar} 
            alt={selectedProf.nombre} 
            className="profesor-foto-large" 
            onError={(e) => { e.target.src = defaultAvatar; }} // AGREGADO: Si falla la carga, mostrar avatar por defecto
          />
          <h3>{selectedProf.nombre}</h3>
          <div className="profesor-info">
            <div className="info-section">
              <h4>Información Personal</h4>
              <p><strong>Especialidad:</strong> {selectedProf.especialidad}</p>
              <p><strong>Estado:</strong> {selectedProf.estado}</p>
            </div>
            <div className="info-section">
              <h4>Descripción</h4>
              <p>{selectedProf.descripcion}</p>
            </div>
            <div className="info-section">
              <h4>Cursos que Dicta</h4>
              <ul>
                {profCursos.length > 0 ? profCursos.map(c => <li key={c.id}>{c.nombre} - {c.descripcion}</li>) : <li>No tiene cursos asignados</li>}
              </ul>
            </div>
            <div className="info-section">
              <h4>Documentos</h4>
              {selectedProf.hojaDeVidaFile ? (
                <a href={URL.createObjectURL(selectedProf.hojaDeVidaFile)} download={`${selectedProf.nombre}_CV.${selectedProf.hojaDeVidaFile.name.split('.').pop()}`}>
                  <button className="download-cv">Descargar Hoja de Vida</button>
                </a>
              ) : (
                <p>No hay hoja de vida disponible</p>
              )}
            </div>
          </div>
          <button className="back-button" onClick={() => setCurrentView('profesores-list')}>Volver a la Lista</button>
        </div>
      </div>
    );
  }

  if (currentView === 'profesores-add' && isAdmin) {
    return (
      <div className="profesores-container">
        <h2>Agregar Profesor</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }}>
          <input name="nombre" value={formData.nombre} onChange={handleInputChange} placeholder="Nombre" required />
          <input name="especialidad" value={formData.especialidad} onChange={handleInputChange} placeholder="Especialidad" required />
          <input name="foto" value={formData.foto} onChange={handleInputChange} placeholder="URL Foto (opcional)" />
          <label>Foto desde archivo:</label>
          <input type="file" name="fotoFile" accept="image/*" onChange={handleFileChange} />
          {/* AGREGADO: Vista previa de la foto */}
          {formData.foto && (
            <div className="foto-preview">
              <p>Vista previa:</p>
              <img 
                src={formData.foto || defaultAvatar} 
                alt="Vista previa" 
                className="preview-image"
                onError={(e) => { e.target.src = defaultAvatar; }}
              />
            </div>
          )}
          <textarea name="descripcion" value={formData.descripcion} onChange={handleInputChange} placeholder="Descripción" />
          <label>Hoja de Vida:</label>
          <input type="file" name="hojaDeVidaFile" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
          <button type="submit">Agregar</button>
          <button type="button" onClick={() => setCurrentView('profesores-list')}>Cancelar</button>
        </form>
      </div>
    );
  }

  if (currentView === 'profesores-edit' && isAdmin) {
    if (editing) {
      return (
        <div className="profesores-container">
          <h2>Editar Profesor</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
            <input name="nombre" value={formData.nombre} onChange={handleInputChange} placeholder="Nombre" required />
            <input name="especialidad" value={formData.especialidad} onChange={handleInputChange} placeholder="Especialidad" required />
            <input name="foto" value={formData.foto} onChange={handleInputChange} placeholder="URL Foto (opcional)" />
            <label>Foto desde archivo:</label>
            <input type="file" name="fotoFile" accept="image/*" onChange={handleFileChange} />
            {/* AGREGADO: Vista previa de la foto */}
            {formData.foto && (
              <div className="foto-preview">
                <p>Vista previa:</p>
                <img 
                  src={formData.foto || defaultAvatar} 
                  alt="Vista previa" 
                  className="preview-image"
                  onError={(e) => { e.target.src = defaultAvatar; }}
                />
              </div>
            )}
            <textarea name="descripcion" value={formData.descripcion} onChange={handleInputChange} placeholder="Descripción" />
            <label>Hoja de Vida:</label>
            <input type="file" name="hojaDeVidaFile" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
            <button type="submit">Actualizar</button>
            <button type="button" onClick={() => { setEditing(null); }}>Cancelar</button>
          </form>
        </div>
      );
    } else {
      // Selección de profesor a editar
      const sortedProfesores = [...profesores].sort((a, b) => a.nombre.localeCompare(b.nombre));
      return (
        <div className="profesores-container">
          <h2>Seleccionar Profesor para Editar</h2>
          <select 
            value={editing || ''} 
            onChange={(e) => {
              const profId = parseInt(e.target.value);
              if (profId) {
                const prof = profesores.find(p => p.id === profId);
                setEditing(profId);
                setFormData({
                  nombre: prof.nombre,
                  especialidad: prof.especialidad,
                  descripcion: prof.descripcion,
                  foto: prof.foto,
                  fotoFile: null,
                  hojaDeVidaFile: null
                });
              }
            }}
            className="profesor-select"
          >
            <option value="">Selecciona un profesor...</option>
            {sortedProfesores.map(prof => (
              <option key={prof.id} value={prof.id}>
                {prof.nombre} - {prof.especialidad}
              </option>
            ))}
          </select>
          <button onClick={() => setCurrentView('profesores-list')}>Volver</button>
        </div>
      );
    }
  }

  if (currentView === 'profesores-assign-courses' && isAdmin && selectedProf) {
    return (
      <div className="profesores-container">
        <h2>Página en Construcción</h2>
        <p>La funcionalidad de asignar cursos está en desarrollo. Pronto estará disponible.</p>
        <button onClick={() => setCurrentView('profesores-list')}>Volver a la Lista</button>
      </div>
    );
  }

  return <div>Acceso denegado</div>;
}

export default Profesores;