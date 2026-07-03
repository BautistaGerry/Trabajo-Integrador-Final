import ENVIRONMENT from "../config/environment.config.js";
import mailer_transport from "../config/mailer.config.js";
import ServerError from "../helpers/serverError.helper.js";
import userRepository from "../repositories/user.repository.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

class AuthController {
    async register(req, res) {
        try {
            const { name, email, password } = req.body;

            if (!name || name.length <= 2) {
                throw new ServerError("Nombre debe ser mayor a 2 caracteres", 400)
            }

            if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
                throw new ServerError("Email inválido", 400)
            }

            if (!password || password.length < 6) {
                throw new ServerError("Password debe tener al menos 6 caracteres", 400)
            }

            const existingUser = await userRepository.getByEmail(email);
            if (existingUser) {
                throw new ServerError("El email ya está registrado", 400)
            }

            const hashed_password = await bcrypt.hash(password, 12);

            const newUser = await userRepository.create(name, email, hashed_password);

            const verification_token = jwt.sign(
                {
                    email: email
                },
                ENVIRONMENT.JWT_SECRET
            )

            await mailer_transport.sendMail(
                {
                    to: email,
                    from: ENVIRONMENT.GMAIL_USERNAME,
                    subject: "Verifica tu cuenta en Event Manager",
                    html: `
                        <h1>Bienvenido a Event Manager</h1>
                        <p>Para poder iniciar sesión, por favor <a href='${ENVIRONMENT.URL_BACKEND}/api/auth/verify-email?verification_token=${verification_token}'>haz click aquí</a> y verifica tu cuenta.</p>
                    `
                }
            )

            return res.status(201).json({
                message: "Usuario registrado con éxito",
                ok: true,
                status: 201,
                data: {
                    user: {
                        id: newUser._id,
                        name: newUser.nombre,
                        email: newUser.email
                    }
                }
            });
        } catch (error) {
            if (error instanceof ServerError) {
                return res.status(error.status).json(
                    {
                        message: error.message,
                        ok: false,
                        status: error.status
                    }
                )
            }
            else {
                console.error('Error critico:', error);
                return res.status(500).json({
                    message: "Error interno del servidor",
                    ok: false,
                    status: 500
                });
            }

        }
    }

    async verifyEmail(req, res) {
        try {
            const { verification_token } = req.query;

            if (!verification_token) {
                throw new ServerError("Falta token de verificación", 400);
            }
            const payload = jwt.verify(verification_token, ENVIRONMENT.JWT_SECRET)
            const { email } = payload
            const user = await userRepository.getByEmail(email);

            if (!user) {
                throw new ServerError("Usuario no encontrado", 404);
            }

            if (user.email_verificado) {
                throw new ServerError("Este email ya ha sido verificado", 400);
            }

            await userRepository.updateById(user._id, { email_verificado: true });

            return res.status(200).json({
                ok: true,
                status: 200,
                message: "Email verificado correctamente. ¡Ya puedes usar tu cuenta!"
            });

        }
        catch (error) {
            console.log(error)
            if (
                error instanceof jwt.JsonWebTokenError
                ||
                error instanceof jwt.NotBeforeError
                ||
                error instanceof jwt.TokenExpiredError
            ) {
                return res.status(401).json(
                    {
                        message: "Token invalido",
                        ok: false,
                        status: 401
                    }
                )
            }
            else if (error instanceof ServerError) {
                return res.status(error.status).json(
                    {
                        message: error.message,
                        ok: false,
                        status: error.status
                    }
                )
            }
            else {
                console.error('Error critico:', error);
                return res.status(500).json({
                    message: "Error interno del servidor",
                    ok: false,
                    status: 500
                });
            }

        }
    }

    async login(request, response) {
        try {
            const { email, password } = request.body

            if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
                throw new ServerError("Email inválido", 400)
            }

            if (!password || password.length < 6) {
                throw new ServerError("Contraseña invalida", 400)
            }

            const user_found = await userRepository.getByEmail(email)

            if (!user_found) {
                throw new ServerError("Usuario no registrado", 404)
            }

            if (!user_found.email_verificado) {
                throw new ServerError("Usuario con verificacion de mail pendiente", 401)
            }

            const is_same_password = await bcrypt.compare(password, user_found.password)

            if (!is_same_password) {
                throw new ServerError("Credenciales invalidas", 401)
            }

            const profile_info = {
                nombre: user_found.nombre,
                email: user_found.email,
                id: user_found._id,
                fecha_creacion: user_found.fecha_creacion
            }

            const access_token = jwt.sign(
                profile_info,
                ENVIRONMENT.JWT_SECRET
            )

            return response.status(200).json({
                ok: true,
                status: 200,
                message: 'Usuario autentificado exitosamente',
                data: {
                    access_token
                }
            })
        }
        catch (error) {
            if (error instanceof ServerError) {
                return response.status(error.status).json(
                    {
                        message: error.message,
                        ok: false,
                        status: error.status
                    }
                )
            }
            else {
                console.error('Error critico:', error);
                return response.status(500).json({
                    message: "Error interno del servidor",
                    ok: false,
                    status: 500
                });
            }
        }
    }

    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                throw new ServerError('El email es obligatorio', 400);
            }

            const user = await userRepository.getByEmail(email);
            if (!user) {
                throw new ServerError('Usuario no encontrado', 404);
            }

            // Usamos password actual como parte del secreto, para que el token se invalide solo al cambiar la contraseña
            const reset_token = jwt.sign(
                { email: email, id: user._id },
                ENVIRONMENT.JWT_SECRET + user.password,
                { expiresIn: '15m' }
            );

            await mailer_transport.sendMail({
                to: email,
                from: ENVIRONMENT.GMAIL_USERNAME,
                subject: "Recuperar contraseña - Event Manager",
                html: `
                    <h1>Recuperación de contraseña</h1>
                    <p>Has solicitado restablecer tu contraseña para Event Manager.</p>
                    <p>Haz clic en el siguiente enlace para crear una nueva (tienes 15 minutos):</p>
                    <p><a href="${ENVIRONMENT.URL_FRONTEND}/reset-password?token=${reset_token}&id=${user._id}">Restablecer contraseña</a></p>
                `
            });

            return res.status(200).json({
                ok: true,
                status: 200,
                message: 'Se ha enviado un correo con las instrucciones para restablecer tu contraseña'
            });

        } catch (error) {
            if (error instanceof ServerError) {
                return res.status(error.status).json({ message: error.message, ok: false, status: error.status });
            }
            console.error('Error crítico:', error);
            return res.status(500).json({ message: 'Error interno del servidor', ok: false, status: 500 });
        }
    }

    async resetPassword(req, res) {
        try {
            const { token, id, new_password } = req.body;

            if (!token || !id || !new_password) {
                throw new ServerError('Faltan datos obligatorios', 400);
            }
            if (new_password.length < 6) {
                throw new ServerError('La contraseña debe tener al menos 6 caracteres', 400);
            }
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new ServerError('ID de usuario inválido', 400);
            }

            const user = await userRepository.getById(id);
            if (!user) {
                throw new ServerError('Usuario no encontrado', 404);
            }

            // Verificamos usando el secreto que incluye el password actual
            try {
                jwt.verify(token, ENVIRONMENT.JWT_SECRET + user.password);
            } catch (err) {
                throw new ServerError('Token inválido o expirado', 400);
            }

            const hashed_password = await bcrypt.hash(new_password, 12);
            await userRepository.updateById(user._id, { password: hashed_password });

            return res.status(200).json({
                ok: true,
                status: 200,
                message: 'Contraseña restablecida con éxito'
            });

        } catch (error) {
            if (error instanceof ServerError) {
                return res.status(error.status).json({ message: error.message, ok: false, status: error.status });
            }
            console.error('Error crítico:', error);
            return res.status(500).json({ message: 'Error interno del servidor', ok: false, status: 500 });
        }
    }
}

const authController = new AuthController();

export default authController

