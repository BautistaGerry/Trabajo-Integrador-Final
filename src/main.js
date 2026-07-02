import ENVIRONMENT from "./config/environment.config.js";
import connectMongoDB from "./config/mongodb.config.js";
import express from "express";
import cors from "cors";
import dns from 'dns';
import authRouter from "./routes/auth.router.js";
import categoryRouter from "./routes/category.router.js";
import eventRouter from "./routes/event.router.js";
import authMiddleware from "./middlewares/auth.middleware.js";

if (ENVIRONMENT.MODE === 'development') {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
}

// Conexión MongoDB delegada al middleware
const app = express();
const PORT = ENVIRONMENT.PORT || 3001;

app.use(cors({
    origin: ENVIRONMENT.URL_FRONTEND || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// DB connection middleware for Serverless
app.use(async (req, res, next) => {
    await connectMongoDB();
    next();
});

app.get('/', (req, res) => {
    res.json({
        ok: true,
        status: 200,
        message: 'Event Manager API — REST. Estado en /api/health',
        repo: 'https://github.com/BautistaGerry/Trabajo-Integrador-Final'
    });
});

app.get('/api/health', (req, res) => {
    res.json({ ok: true, status: 200, message: 'API funcionando correctamente' });
});

app.use('/api/auth', authRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/events', eventRouter);

app.get(
    '/api/profile',
    authMiddleware,
    (request, response) => {
        return response.json({
            ok: true,
            status: 200,
            message: "Estás autenticado",
            data: { user: request.user }
        });
    }
);

app.use((req, res) => {
    res.status(404).json({ ok: false, status: 404, message: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
    console.error('Error no controlado:', err);
    res.status(500).json({ ok: false, status: 500, message: 'Error interno del servidor' });
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL_ENV) {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
}
export default app;