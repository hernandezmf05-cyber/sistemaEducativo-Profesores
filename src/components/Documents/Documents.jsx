import React, { useState } from 'react';
import './Documents.css';

function Documents({ documents, onCreate, onUpdate, onDelete }) {
  const [newDoc, setNewDoc] = useState({ title: '', content: '', pdfFile: null });
  const [editing, setEditing] = useState(null);

  const handleCreate = () => {
    if (newDoc.title && newDoc.content) {
      onCreate(newDoc);
      setNewDoc({ title: '', content: '', pdfFile: null });
    }
  };

  const handleEdit = (id) => {
    const doc = documents.find(d => d.id === id);
    setNewDoc({ title: doc.title, content: doc.content, pdfFile: doc.pdfFile });
    setEditing(id);
  };

  const handleUpdate = () => {
    onUpdate(editing, newDoc);
    setNewDoc({ title: '', content: '', pdfFile: null });
    setEditing(null);
  };

  const handleDelete = (id) => {
    onDelete(id);
  };

  return (
    <div className="documents">
      <h2>Módulo CRUD - Documentos Psicológicos</h2>
      <div className="form">
        <input
          type="text"
          placeholder="Título"
          value={newDoc.title}
          onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
        />
        <textarea
          placeholder="Contenido"
          value={newDoc.content}
          onChange={(e) => setNewDoc({ ...newDoc, content: e.target.value })}
        />
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setNewDoc({ ...newDoc, pdfFile: e.target.files[0] })}
        />
        {editing ? (
          <button onClick={handleUpdate}>Actualizar</button>
        ) : (
          <button onClick={handleCreate}>Crear</button>
        )}
      </div>
      <ul className="document-list">
        {documents.map(doc => (
          <li key={doc.id}>
            <h3>{doc.title}</h3>
            <p>{doc.content}</p>
            {doc.pdfFile && <p>Archivo: {doc.pdfFile.name}</p>}
            <button onClick={() => handleEdit(doc.id)}>Editar</button>
            <button onClick={() => handleDelete(doc.id)}>Eliminar</button>
            {doc.pdfFile && (
              <button className="view-pdf" onClick={() => window.open(URL.createObjectURL(doc.pdfFile))}>Ver PDF</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Documents;