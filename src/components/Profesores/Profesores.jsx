import React, { useState, useEffect } from 'react';
import './Profesores.css';

function Profesores({ currentView, currentUser, profesores, cursos, onCreateProfesor, onUpdateProfesor, onDeactivateProfesor, onAssignCursos, setCurrentView, query }) {
  const [selectedProf, setSelectedProf] = useState(null);
  const [editing, setEditing] = useState(null);
  
  // ACTUALIZADO: Estructura de formData con campos del backend
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    numeroDocumento: '',
    correoElectronico: '',
    celular: '',
    nivelAcademico: '',
    areasAsignadas: '',
    anosExperiencia: '',
    tipoContrato: '',
    perfilProfesional: '', // Descripción del profesor
    foto: '', // URL
    hojaDeVida: '', // URL
    fotoFile: null, // Archivo de foto
    hojaDeVidaFile: null // Archivo de hoja de vida
  });

  // Avatar por defecto
  const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

  const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const highlightText = (text) => {
    const q = (query || '').trim();
    if (!q || q.length < 3 || !text) return text;
    const parts = text.split(new RegExp(`(${escapeRegExp(q)})`, 'ig'));
    return parts.map((part, i) => (
      part.toLowerCase() === q.toLowerCase() ? <mark key={i}>{part}</mark> : part
    ));
  };

  useEffect(() => {
    if (currentView === 'profesores-add') {
      setEditing(null);
      setFormData({
        nombreCompleto: '',
        numeroDocumento: '',
        correoElectronico: '',
        celular: '',
        nivelAcademico: '',
        areasAsignadas: '',
        anosExperiencia: '',
        tipoContrato: '',
        perfilProfesional: '',
        foto: '',
        hojaDeVida: '',
        fotoFile: null,
        hojaDeVidaFile: null
      });
    } else if (currentView === 'profesores-edit' && selectedProf) {
      setFormData({
        nombreCompleto: selectedProf.nombreCompleto || selectedProf.nombre || '',
        numeroDocumento: selectedProf.numeroDocumento || '',
        correoElectronico: selectedProf.correoElectronico || '',
        celular: selectedProf.celular || '',
        nivelAcademico: selectedProf.nivelAcademico || '',
        areasAsignadas: selectedProf.areasAsignadas || selectedProf.especialidad || '',
        anosExperiencia: selectedProf.anosExperiencia || '',
        tipoContrato: selectedProf.tipoContrato || '',
        perfilProfesional: selectedProf.perfilProfesional || selectedProf.descripcion || '',
        foto: selectedProf.foto || '',
        hojaDeVida: selectedProf.hojaDeVida || '',
        fotoFile: null,
        hojaDeVidaFile: null
      });
    } else if (currentView === 'profesores-assign-courses' && selectedProf) {
      // Vista de asignación de cursos
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

  const handleAdd = () => {
    // Validación de campos requeridos
    if (formData.nombreCompleto && formData.numeroDocumento && formData.correoElectronico) {
      const newProf = {
        nombreCompleto: formData.nombreCompleto,
        numeroDocumento: formData.numeroDocumento,
        correoElectronico: formData.correoElectronico,
        celular: formData.celular,
        nivelAcademico: formData.nivelAcademico,
        areasAsignadas: formData.areasAsignadas,
        anosExperiencia: parseInt(formData.anosExperiencia) || 0,
        tipoContrato: formData.tipoContrato,
        perfilProfesional: formData.perfilProfesional,
        foto: formData.foto,
        hojaDeVida: formData.hojaDeVida,
        fotoFile: formData.fotoFile,
        hojaDeVidaFile: formData.hojaDeVidaFile,
        vigencia: true, // Por defecto activo
        // RETROCOMPATIBILIDAD: Mantener campos antiguos por si acaso
        nombre: formData.nombreCompleto,
        especialidad: formData.areasAsignadas,
        descripcion: formData.perfilProfesional,
        estado: 'activo'
      };
      onCreateProfesor(newProf);
      setCurrentView('profesores-list');
    } else {
      alert('Por favor completa los campos requeridos: Nombre, Documento y Correo');
    }
  };

  const handleUpdate = () => {
    if (editing && formData.nombreCompleto && formData.numeroDocumento && formData.correoElectronico) {
      const updatedProf = {
        nombreCompleto: formData.nombreCompleto,
        numeroDocumento: formData.numeroDocumento,
        correoElectronico: formData.correoElectronico,
        celular: formData.celular,
        nivelAcademico: formData.nivelAcademico,
        areasAsignadas: formData.areasAsignadas,
        anosExperiencia: parseInt(formData.anosExperiencia) || 0,
        tipoContrato: formData.tipoContrato,
        perfilProfesional: formData.perfilProfesional,
        foto: formData.foto,
        hojaDeVida: formData.hojaDeVida,
        fotoFile: formData.fotoFile,
        hojaDeVidaFile: formData.hojaDeVidaFile,
        // RETROCOMPATIBILIDAD
        nombre: formData.nombreCompleto,
        especialidad: formData.areasAsignadas,
        descripcion: formData.perfilProfesional
      };
      onUpdateProfesor(editing, updatedProf);
      setCurrentView('profesores-list');
    } else {
      alert('Por favor completa los campos requeridos: Nombre, Documento y Correo');
    }
  };

  const isAdmin = currentUser && currentUser.userType === 'profesor_admin';
  const activeProfesores = profesores.filter(p => p.estado === 'activo' || p.vigencia === true);

  if (currentView === 'profesores-list') {
    const listToShow = isAdmin ? profesores : activeProfesores;
    return (
      <div className="profesores-container">
        <h2>Lista de Profesores</h2>
        {isAdmin && (
          <button className="add-profesor-btn" onClick={() => setCurrentView('profesores-add')}>
            + Agregar Profesor
          </button>
        )}
        <div className="profesores-grid">
          {listToShow.length === 0 ? (
            <div className="no-results">No se encontraron profesores que cumplan el criterio de búsqueda.</div>
          ) : listToShow.map(prof => (
            <div key={prof.id} className="profesor-card">
              <img 
                src={prof.foto || defaultAvatar} 
                alt={prof.nombreCompleto || prof.nombre} 
                className="profesor-foto" 
                onError={(e) => { e.target.src = defaultAvatar; }}
              />
              <h3>{highlightText(prof.nombreCompleto || prof.nombre)}</h3>
              <p className="profesor-area">{highlightText(prof.areasAsignadas || prof.especialidad)}</p>
              {(prof.anosExperiencia || prof.anosExperiencia === 0) && (
                <p className="profesor-experiencia">{prof.anosExperiencia} años de experiencia</p>
              )}
              {isAdmin && <p className="profesor-estado">Estado: {prof.estado || (prof.vigencia ? 'activo' : 'inactivo')}</p>}
              <button onClick={() => { setSelectedProf(prof); setCurrentView('profesores-profile'); }}>Ver Perfil</button>
              {isAdmin && (
                <div className="admin-actions">
                  <button onClick={() => { setSelectedProf(prof); setEditing(prof.id); setCurrentView('profesores-edit'); }}>Editar</button>
                  <button onClick={() => { setSelectedProf(prof); setCurrentView('profesores-assign-courses'); }}>Asignar Cursos</button>
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
    const isActive = selectedProf.estado === 'activo' || selectedProf.vigencia === true;
    
    return (
      <div className="profesores-container">
        <div className="profesor-profile">
          {/* HEADER CON FOTO Y NOMBRE */}
          <div className="profile-header">
            <div className="profile-header-left">
              <img 
                src={selectedProf.foto || defaultAvatar} 
                alt={selectedProf.nombreCompleto || selectedProf.nombre} 
                className="profesor-foto-large" 
                onError={(e) => { e.target.src = defaultAvatar; }}
              />
            </div>
            <div className="profile-header-right">
              <h3>{highlightText(selectedProf.nombreCompleto || selectedProf.nombre)}</h3>
              <p className="profile-subtitle">{highlightText(selectedProf.areasAsignadas || selectedProf.especialidad || 'Profesor')}</p>
              
              {/* ESTADO CON TOGGLE */}
              <div className="profile-status-row">
                <span className={`profile-status-text ${isActive ? 'status-active' : 'status-inactive'}`}>
                  {isActive ? 'activo' : 'inactivo'}
                </span>
                {isAdmin && (
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const updated = { ...selectedProf, vigencia: checked, estado: checked ? 'activo' : 'inactivo' };
                        if (onUpdateProfesor) onUpdateProfesor(selectedProf.id, updated);
                        setSelectedProf(updated);
                      }}
                    />
                    <span className="slider" />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* CONTENIDO EN GRID RESPONSIVO */}
          <div className="profile-content">
            {/* COLUMNA IZQUIERDA */}
            <div className="profile-column">
              {/* Información Personal */}
              <div className="info-section">
                <h4>Información Personal</h4>
                <p><strong>Documento:</strong> {selectedProf.numeroDocumento || 'No especificado'}</p>
                <p><strong>Correo:</strong> {selectedProf.correoElectronico || 'No especificado'}</p>
                <p><strong>Celular:</strong> {selectedProf.celular || 'No especificado'}</p>
              </div>

              {/* Información Académica */}
              <div className="info-section">
                <h4>Información Académica</h4>
                <p><strong>Nivel:</strong> {selectedProf.nivelAcademico || 'No especificado'}</p>
                <p><strong>Áreas:</strong> {selectedProf.areasAsignadas || selectedProf.especialidad || 'No especificado'}</p>
                <p><strong>Experiencia:</strong> {selectedProf.anosExperiencia || 0} años</p>
              </div>
            </div>

            {/* COLUMNA DERECHA */}
            <div className="profile-column">
              {/* Información Laboral */}
              <div className="info-section">
                <h4>Información Laboral</h4>
                <p><strong>Contrato:</strong> {selectedProf.tipoContrato || 'No especificado'}</p>
              </div>

              {/* Cursos Asignados */}
              <div className="info-section">
                <h4>Cursos que Dicta</h4>
                <ul>
                  {profCursos.length > 0 ? profCursos.map(c => <li key={c.id}>{c.nombre}</li>) : <li>No tiene cursos asignados</li>}
                </ul>
              </div>
            </div>
          </div>

          {/* Documentos - CENTRADO ABAJO */}
          {(selectedProf.hojaDeVidaFile || selectedProf.hojaDeVida) && (
            <div className="profile-content-centered">
              <div className="info-section">
                <h4>Documentos</h4>
                {selectedProf.hojaDeVidaFile ? (
                  <a href={URL.createObjectURL(selectedProf.hojaDeVidaFile)} download={`${selectedProf.nombreCompleto || selectedProf.nombre}_CV.${selectedProf.hojaDeVidaFile.name.split('.').pop()}`}>
                    <button className="download-cv">Descargar CV</button>
                  </a>
                ) : (
                  <a href={selectedProf.hojaDeVida} target="_blank" rel="noopener noreferrer">
                    <button className="download-cv">Ver CV</button>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Perfil Profesional - CENTRADO ABAJO */}
          {(selectedProf.perfilProfesional || selectedProf.descripcion) && (
            <div className="profile-content-centered">
              <div className="info-section full-width">
                <h4>Perfil Profesional</h4>
                <p>{selectedProf.perfilProfesional || selectedProf.descripcion}</p>
              </div>
            </div>
          )}

          {/* FOOTER CON BOTONES */}
          <div className="profile-footer">
            <button className="back-button" onClick={() => setCurrentView('profesores-list')}>Volver</button>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'profesores-add' && isAdmin) {
    return (
      <div className="profesores-container">
        <h2>Agregar Profesor</h2>
        <form className="profesor-form" onSubmit={(e) => { e.preventDefault(); handleAdd(); }}>
          
          {/* Sección: Información Personal */}
          <fieldset>
            <legend>Información Personal</legend>
            
            <div className="form-group">
              <label htmlFor="nombreCompleto">Nombre Completo *</label>
              <input 
                id="nombreCompleto"
                name="nombreCompleto" 
                value={formData.nombreCompleto} 
                onChange={handleInputChange} 
                placeholder="Ej: Juan Pérez García" 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="numeroDocumento">Número de Documento *</label>
              <input 
                id="numeroDocumento"
                name="numeroDocumento" 
                value={formData.numeroDocumento} 
                onChange={handleInputChange} 
                placeholder="Ej: 1234567890" 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="correoElectronico">Correo Electrónico *</label>
              <input 
                id="correoElectronico"
                type="email"
                name="correoElectronico" 
                value={formData.correoElectronico} 
                onChange={handleInputChange} 
                placeholder="Ej: profesor@universidad.edu" 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="celular">Celular</label>
              <input 
                id="celular"
                name="celular" 
                value={formData.celular} 
                onChange={handleInputChange} 
                placeholder="Ej: 3001234567" 
              />
            </div>
          </fieldset>

          {/* Sección: Información Académica */}
          <fieldset>
            <legend>Información Académica</legend>
            
            <div className="form-group">
              <label htmlFor="nivelAcademico">Nivel Académico</label>
              <select 
                id="nivelAcademico"
                name="nivelAcademico" 
                value={formData.nivelAcademico} 
                onChange={handleInputChange}
              >
                <option value="">Seleccionar...</option>
                <option value="Licenciatura">Licenciatura</option>
                <option value="Especialización">Especialización</option>
                <option value="Maestría">Maestría</option>
                <option value="Doctorado">Doctorado</option>
                <option value="Postdoctorado">Postdoctorado</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="areasAsignadas">Áreas Asignadas</label>
              <input 
                id="areasAsignadas"
                name="areasAsignadas" 
                value={formData.areasAsignadas} 
                onChange={handleInputChange} 
                placeholder="Ej: Matemáticas, Física" 
              />
            </div>

            <div className="form-group">
              <label htmlFor="anosExperiencia">Años de Experiencia</label>
              <input 
                id="anosExperiencia"
                type="number"
                name="anosExperiencia" 
                value={formData.anosExperiencia} 
                onChange={handleInputChange} 
                placeholder="Ej: 5" 
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="perfilProfesional">Perfil Profesional</label>
              <textarea 
                id="perfilProfesional"
                name="perfilProfesional" 
                value={formData.perfilProfesional} 
                onChange={handleInputChange} 
                placeholder="Describe tu experiencia, metodología de enseñanza, especialidades y fortalezas como docente..."
                rows="4"
                maxLength="500"
              />
              <small className="char-count">{formData.perfilProfesional.length}/500 caracteres</small>
            </div>
          </fieldset>

          {/* Sección: Información Laboral */}
          <fieldset>
            <legend>Información Laboral</legend>
            
            <div className="form-group">
              <label htmlFor="tipoContrato">Tipo de Contrato</label>
              <select 
                id="tipoContrato"
                name="tipoContrato" 
                value={formData.tipoContrato} 
                onChange={handleInputChange}
              >
                <option value="">Seleccionar...</option>
                <option value="Tiempo Completo">Tiempo Completo</option>
                <option value="Medio Tiempo">Medio Tiempo</option>
                <option value="Cátedra">Cátedra</option>
                <option value="Contrato">Contrato</option>
              </select>
            </div>
          </fieldset>

          {/* Sección: Documentos y Foto */}
          <fieldset>
            <legend>Documentos y Foto</legend>
            
            <div className="form-group">
              <label htmlFor="foto">URL de Foto</label>
              <input 
                id="foto"
                name="foto" 
                value={formData.foto} 
                onChange={handleInputChange} 
                placeholder="https://ejemplo.com/foto.jpg" 
              />
              <small className="help-text">O sube una foto desde tu computadora:</small>
              <input 
                type="file" 
                name="fotoFile" 
                accept="image/*" 
                onChange={handleFileChange}
                className="file-input"
              />
              {formData.foto && (
                <div className="foto-preview">
                  <p>Vista previa:</p>
                  <img 
                    src={formData.foto} 
                    alt="Vista previa" 
                    className="preview-image"
                    onError={(e) => { e.target.src = defaultAvatar; }}
                  />
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="hojaDeVida">URL de Hoja de Vida (CV)</label>
              <input 
                id="hojaDeVida"
                name="hojaDeVida" 
                value={formData.hojaDeVida} 
                onChange={handleInputChange} 
                placeholder="https://ejemplo.com/cv.pdf" 
              />
              <small className="help-text">O sube tu hoja de vida desde tu computadora:</small>
              <input 
                type="file" 
                name="hojaDeVidaFile" 
                accept=".pdf,.doc,.docx" 
                onChange={handleFileChange}
                className="file-input"
              />
              {formData.hojaDeVida && (
                <p className="url-preview">✓ URL ingresada: <a href={formData.hojaDeVida} target="_blank" rel="noopener noreferrer">Ver documento</a></p>
              )}
              {formData.hojaDeVidaFile && (
                <p className="file-preview">✓ Archivo seleccionado: {formData.hojaDeVidaFile.name}</p>
              )}
            </div>
          </fieldset>

          <div className="form-actions">
            <button type="submit" className="btn-submit">Agregar Profesor</button>
            <button type="button" className="btn-cancel" onClick={() => setCurrentView('profesores-list')}>Cancelar</button>
          </div>
        </form>
      </div>
    );
  }

  if (currentView === 'profesores-edit' && isAdmin) {
    if (editing) {
      return (
        <div className="profesores-container">
          <h2>Editar Profesor</h2>
          <form className="profesor-form" onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
            
            {/* Sección: Información Personal */}
            <fieldset>
              <legend>Información Personal</legend>
              
              <div className="form-group">
                <label htmlFor="nombreCompleto">Nombre Completo *</label>
                <input 
                  id="nombreCompleto"
                  name="nombreCompleto" 
                  value={formData.nombreCompleto} 
                  onChange={handleInputChange} 
                  placeholder="Ej: Juan Pérez García" 
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="numeroDocumento">Número de Documento *</label>
                <input 
                  id="numeroDocumento"
                  name="numeroDocumento" 
                  value={formData.numeroDocumento} 
                  onChange={handleInputChange} 
                  placeholder="Ej: 1234567890" 
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="correoElectronico">Correo Electrónico *</label>
                <input 
                  id="correoElectronico"
                  type="email"
                  name="correoElectronico" 
                  value={formData.correoElectronico} 
                  onChange={handleInputChange} 
                  placeholder="Ej: profesor@universidad.edu" 
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="celular">Celular</label>
                <input 
                  id="celular"
                  name="celular" 
                  value={formData.celular} 
                  onChange={handleInputChange} 
                  placeholder="Ej: 3001234567" 
                />
              </div>
            </fieldset>

            {/* Sección: Información Académica */}
            <fieldset>
              <legend>Información Académica</legend>
              
              <div className="form-group">
                <label htmlFor="nivelAcademico">Nivel Académico</label>
                <select 
                  id="nivelAcademico"
                  name="nivelAcademico" 
                  value={formData.nivelAcademico} 
                  onChange={handleInputChange}
                >
                  <option value="">Seleccionar...</option>
                  <option value="Licenciatura">Licenciatura</option>
                  <option value="Especialización">Especialización</option>
                  <option value="Maestría">Maestría</option>
                  <option value="Doctorado">Doctorado</option>
                  <option value="Postdoctorado">Postdoctorado</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="areasAsignadas">Áreas Asignadas</label>
                <input 
                  id="areasAsignadas"
                  name="areasAsignadas" 
                  value={formData.areasAsignadas} 
                  onChange={handleInputChange} 
                  placeholder="Ej: Matemáticas, Física" 
                />
              </div>

              <div className="form-group">
                <label htmlFor="anosExperiencia">Años de Experiencia</label>
                <input 
                  id="anosExperiencia"
                  type="number"
                  name="anosExperiencia" 
                  value={formData.anosExperiencia} 
                  onChange={handleInputChange} 
                  placeholder="Ej: 5" 
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="perfilProfesional">Perfil Profesional</label>
                <textarea 
                  id="perfilProfesional"
                  name="perfilProfesional" 
                  value={formData.perfilProfesional} 
                  onChange={handleInputChange} 
                  placeholder="Describe tu experiencia, metodología de enseñanza, especialidades y fortalezas como docente..."
                  rows="4"
                  maxLength="500"
                />
                <small className="char-count">{formData.perfilProfesional.length}/500 caracteres</small>
              </div>
            </fieldset>

            {/* Sección: Información Laboral */}
            <fieldset>
              <legend>Información Laboral</legend>
              
              <div className="form-group">
                <label htmlFor="tipoContrato">Tipo de Contrato</label>
                <select 
                  id="tipoContrato"
                  name="tipoContrato" 
                  value={formData.tipoContrato} 
                  onChange={handleInputChange}
                >
                  <option value="">Seleccionar...</option>
                  <option value="Tiempo Completo">Tiempo Completo</option>
                  <option value="Medio Tiempo">Medio Tiempo</option>
                  <option value="Cátedra">Cátedra</option>
                  <option value="Contrato">Contrato</option>
                </select>
              </div>
            </fieldset>

            {/* Sección: Documentos y Foto */}
            <fieldset>
              <legend>Documentos y Foto</legend>
              
              <div className="form-group">
                <label htmlFor="foto">URL de Foto</label>
                <input 
                  id="foto"
                  name="foto" 
                  value={formData.foto} 
                  onChange={handleInputChange} 
                  placeholder="https://ejemplo.com/foto.jpg" 
                />
                <small className="help-text">O sube una foto desde tu computadora:</small>
                <input 
                  type="file" 
                  name="fotoFile" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="file-input"
                />
                {formData.foto && (
                  <div className="foto-preview">
                    <p>Vista previa:</p>
                    <img 
                      src={formData.foto} 
                      alt="Vista previa" 
                      className="preview-image"
                      onError={(e) => { e.target.src = defaultAvatar; }}
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="hojaDeVida">URL de Hoja de Vida (CV)</label>
                <input 
                  id="hojaDeVida"
                  name="hojaDeVida" 
                  value={formData.hojaDeVida} 
                  onChange={handleInputChange} 
                  placeholder="https://ejemplo.com/cv.pdf" 
                />
                <small className="help-text">O sube tu hoja de vida desde tu computadora:</small>
                <input 
                  type="file" 
                  name="hojaDeVidaFile" 
                  accept=".pdf,.doc,.docx" 
                  onChange={handleFileChange}
                  className="file-input"
                />
                {formData.hojaDeVida && (
                  <p className="url-preview">✓ URL ingresada: <a href={formData.hojaDeVida} target="_blank" rel="noopener noreferrer">Ver documento</a></p>
                )}
                {formData.hojaDeVidaFile && (
                  <p className="file-preview">✓ Archivo seleccionado: {formData.hojaDeVidaFile.name}</p>
                )}
              </div>
            </fieldset>

            <div className="form-actions">
              <button type="submit" className="btn-submit">Actualizar</button>
              <button type="button" className="btn-cancel" onClick={() => { setEditing(null); setCurrentView('profesores-list'); }}>Cancelar</button>
            </div>
          </form>
        </div>
      );
    } else {
      // Selección de profesor a editar
      const sortedProfesores = [...profesores].sort((a, b) => 
        (a.nombreCompleto || a.nombre).localeCompare(b.nombreCompleto || b.nombre)
      );
      return (
        <div className="profesores-container">
          <h2>Seleccionar Profesor para Editar</h2>
          <select 
            value={editing || ''} 
            onChange={(e) => {
              const profId = parseInt(e.target.value);
              if (profId) {
                const prof = profesores.find(p => p.id === profId);
                setSelectedProf(prof);
                setEditing(profId);
                setFormData({
                  nombreCompleto: prof.nombreCompleto || prof.nombre || '',
                  numeroDocumento: prof.numeroDocumento || '',
                  correoElectronico: prof.correoElectronico || '',
                  celular: prof.celular || '',
                  nivelAcademico: prof.nivelAcademico || '',
                  areasAsignadas: prof.areasAsignadas || prof.especialidad || '',
                  anosExperiencia: prof.anosExperiencia || '',
                  tipoContrato: prof.tipoContrato || '',
                  perfilProfesional: prof.perfilProfesional || prof.descripcion || '',
                  foto: prof.foto || '',
                  hojaDeVida: prof.hojaDeVida || '',
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
                {prof.nombreCompleto || prof.nombre} - {prof.areasAsignadas || prof.especialidad}
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