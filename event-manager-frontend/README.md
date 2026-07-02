# 🎉 EventHub — Frontend

Interfaz web del Gestor de Eventos. Construida con **React + Vite**.

## 🚀 Stack

- **React 18** (con Vite)
- **React Router DOM** v6
- **Axios** para consumo de la API
- **CSS vanilla** con design system propio (dark mode + glassmorphism)
- Responsive: 320px → 2000px

---

## ⚙️ Instalación local

```bash
npm install
npm run dev
# → http://localhost:5173
```

Crear `.env` en la raíz del frontend:
```
VITE_API_URL=http://localhost:3001/api
```

---

## 📄 Páginas y rutas

| Ruta | Página | Auth |
|------|--------|------|
| `/` | Listado de todos los eventos (filtros) | ❌ |
| `/events/:id` | Detalle de evento | ❌ |
| `/login` | Inicio de sesión | ❌ |
| `/register` | Registro con verificación de email | ❌ |
| `/my-events` | Mis eventos (CRUD completo) | ✅ |
| `/categories` | Gestión de categorías | ✅ |

---

## 🔐 Flujo de autenticación

1. Usuario se registra → recibe email con link de verificación
2. Hace clic en el link → cuenta activada
3. Inicia sesión → recibe JWT
4. JWT se guarda en `localStorage` y se envía en cada request protegida
5. Al cerrar sesión se limpia localStorage

---

## 🎨 Design System

- **Tipografía:** Inter (Google Fonts)
- **Paleta:** Dark mode con `#0f0f1a` base, `#6366f1` primary (indigo)
- **Efectos:** glassmorphism en auth, hover glow en cards
- **Animaciones:** slideUp en modales, hover translateY en cards

---

## 🌐 Variables de entorno

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL base del backend |
