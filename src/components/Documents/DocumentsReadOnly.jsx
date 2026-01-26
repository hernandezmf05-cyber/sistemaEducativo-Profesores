import React from 'react';
import './Documents.css';

function DocumentsReadOnly({ documents }) {
  return (
    <div className="documents">
      <h2>Módulo de Consulta - Documentos Psicológicos</h2>
      <p className="readonly-notice">Vista de solo lectura - No puedes modificar los documentos</p>
      <ul className="document-list">
        {documents.map(doc => (
          <li key={doc.id}>
            <h3>{doc.title}</h3>
            <p>{doc.content}</p>
            {doc.pdfFile && <p>Archivo: {doc.pdfFile.name}</p>}
            {doc.pdfFile && (
              <button className="view-pdf" onClick={() => window.open(URL.createObjectURL(doc.pdfFile))}>Ver PDF</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DocumentsReadOnly;