# 🎉 EventHub — Backend

API REST para el Gestor de Eventos. Construida con **Node.js + Express + MongoDB + JWT + Nodemailer**.

## 🚀 Stack Tecnológico

- **Runtime:** Node.js (ESM)
- **Framework:** Express 5
- **Base de datos:** MongoDB (Mongoose)
- **Autenticación:** JWT + bcrypt
- **Email:** Nodemailer (Gmail SMTP)
- **Arquitectura:** Routes → Controllers → Services → Repositories

---

## ⚙️ Instalación local

```bash
# 1. Clonar e instalar
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores reales

# 3. Arrancar en desarrollo
npm run dev

# 4. Producción
npm start
```

---

## 🔑 Variables de entorno (`.env`)

| Variable | Descripción |
|---|---|
| `MONGO_DB_CONNECTION_STRING` | URI de MongoDB Atlas (`mongodb+srv://...`) |
| `MONGO_DB_NAME` | Nombre de la base de datos |
| `PORT` | Puerto del servidor (default: 3001) |
| `MODE` | `development` o `production` |
| `JWT_SECRET` | Secreto para firmar JWTs |
| `GMAIL_USERNAME` | Email de Gmail para envío |
| `GMAIL_PASSWORD` | App Password de Gmail |
| `URL_BACKEND` | URL pública del backend |
| `URL_FRONTEND` | URL pública del frontend (para CORS) |

---

## 📁 Estructura de carpetas

```
src/
├── config/
│   ├── db.js               # Conexión MongoDB
│   ├── environment.config.js
│   └── mailer.config.js
├── models/                 # Esquemas Mongoose
│   ├── user.model.js
│   ├── category.model.js
│   └── event.model.js
├── repositories/           # Acceso a BD
│   ├── user.repository.js
│   ├── category.repository.js
│   └── event.repository.js
├── services/               # Lógica de negocio
│   ├── category.service.js
│   └── event.service.js
├── controllers/            # Manejan req/res
│   ├── auth.controller.js
│   ├── category.controller.js
│   └── event.controller.js
├── routes/                 # Express Router
│   ├── auth.router.js
│   ├── category.router.js
│   └── event.router.js
├── middlewares/
│   └── auth.middleware.js  # Verificación JWT
├── helpers/
│   └── serverError.helper.js
└── main.js                 # Entry point
```

---

## 📡 Endpoints de la API

### 🔐 Autenticación — `/api/auth`

| Método | Ruta | Cuerpo | Auth | Descripción |
|--------|------|--------|------|-------------|
| POST | `/register` | `{name, email, password}` | ❌ | Registra usuario y envía email de verificación |
| GET  | `/verify-email?verification_token=...` | — | ❌ | Activa la cuenta |
| POST | `/login` | `{email, password}` | ❌ | Devuelve `access_token` JWT |
| GET  | `/api/profile` | — | ✅ | Devuelve datos del usuario logueado |

### 🏷️ Categorías — `/api/categories`

| Método | Ruta | Body | Auth | Descripción |
|--------|------|------|------|-------------|
| GET    | `/` | — | ❌ | Lista todas las categorías activas |
| GET    | `/:id` | — | ❌ | Obtiene una categoría por ID |
| POST   | `/` | `{nombre, descripcion?, color?}` | ✅ | Crea una categoría |
| PUT    | `/:id` | `{nombre?, descripcion?, color?}` | ✅ | Actualiza una categoría |
| DELETE | `/:id` | — | ✅ | Soft-delete de una categoría |

### 🎉 Eventos — `/api/events`

| Método | Ruta | Body | Auth | Descripción |
|--------|------|------|------|-------------|
| GET    | `/` | — | ❌ | Lista eventos (`?categoria=id&estado=activo`) |
| GET    | `/:id` | — | ❌ | Detalle de un evento (con populate) |
| POST   | `/` | ver abajo | ✅ | Crea un evento |
| PUT    | `/:id` | ver abajo | ✅ | Actualiza evento (solo creador) |
| DELETE | `/:id` | — | ✅ | Soft-delete (solo creador) |
| GET    | `/me/mis-eventos` | — | ✅ | Eventos creados por el usuario logueado |


---

## 🛡️ Seguridad

- Contraseñas hasheadas con **bcrypt** (salt rounds: 12)
- Tokens JWT con `JWT_SECRET` en cabecera `Authorization: Bearer <token>`
- Email verificado requerido antes de login
- Rutas de escritura protegidas por `authMiddleware`
- CORS configurado para el origen del frontend

---

## 👤 Credenciales de prueba

```
Email:    cuentadeprueba19833@gmail.com
Password: Test123456
(cuenta ya verificada)
```

---

## 📘 Relaciones entre entidades

```
User (1) ──< Event (N)      # un usuario crea muchos eventos
Category (1) ──< Event (N)  # una categoría agrupa muchos eventos
```
