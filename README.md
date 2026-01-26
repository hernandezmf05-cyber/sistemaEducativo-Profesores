# 📋 Document Management App - Credenciales de Prueba

## 🔐 Credenciales de Usuario de Prueba

Esta aplicación incluye un sistema de autenticación con control de acceso basado en roles. A continuación se detallan las credenciales de prueba disponibles:

### 👑 **Administrador** (Acceso Completo CRUD)
- **Email:** `admin@example.com`
- **Contraseña:** `admin123`
- **Rol:** Administrador
- **Permisos:** Crear, leer, actualizar y eliminar documentos

### 🔧 **Usuario Avanzado** (Acceso Completo CRUD)
- **Email:** `advanced@example.com`
- **Contraseña:** `advanced123`
- **Rol:** Usuario Avanzado
- **Permisos:** Crear, leer, actualizar y eliminar documentos

### 👤 **Usuario Normal** (Solo Lectura)
- **Email:** `normal@example.com`
- **Contraseña:** `normal123`
- **Rol:** Usuario
- **Permisos:** Solo lectura de documentos (no puede modificar)

## ⚠️ **Salvedad Importante**

**IMPORTANTE:** Estas credenciales son únicamente para fines de desarrollo y pruebas. En un entorno de producción, implemente:

1. **Autenticación segura** con hash de contraseñas (bcrypt, Argon2)
2. **Base de datos real** (PostgreSQL, MySQL, MongoDB)
3. **Validación de entrada** robusta
4. **Protección contra ataques** (CSRF, XSS, SQL Injection)
5. **Gestión de sesiones** segura
6. **Auditoría de acceso** y logs de seguridad

## 🚀 **Cómo Usar**

1. Inicia la aplicación con `npm start`
2. Haz clic en "Login" en la barra de navegación
3. Usa cualquiera de las credenciales de prueba arriba
4. Dependiendo del rol, tendrás acceso a diferentes funcionalidades:
   - **Usuario Normal:** Vista de solo lectura de documentos
   - **Usuario Avanzado/Administrador:** Panel completo CRUD

## 📁 **Estructura del Proyecto**

```
src/
├── components/
│   ├── Login/           # Módulo de autenticación
│   ├── Navbar/          # Barra de navegación
│   ├── Documents/       # CRUD de documentos
│   └── DocumentsReadOnly/ # Vista de solo lectura
├── App.jsx              # Componente principal
└── index.js             # Punto de entrada
```

## 🛡️ **Características de Seguridad Implementadas**

- ✅ Validación de credenciales contra base de datos simulada
- ✅ Control de acceso basado en roles
- ✅ Redirección automática según permisos
- ✅ Gestión de estado de sesión
- ✅ Logout seguro

## 🔧 **Tecnologías Utilizadas**

- React 18 con Hooks
- CSS Variables para temas dinámicos
- Estado basado en navegación (sin React Router)
- In-memory database simulation

---

**Nota:** Este proyecto es una demostración de conceptos de autenticación y control de acceso. No debe usarse en producción sin implementar medidas de seguridad adicionales.</content>
<parameter name="filePath">c:\ProyectosSura\barradenavega\README.md