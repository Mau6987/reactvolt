import { usuario } from "../models/usuarios.js";

// Obtener todos los usuarios
export const getUsuarios = async (req, res) => {
    try {
        const usuarios = await usuario.findAll();
        const formatoUsuarios = usuarios.map((usuario) => {
            // Se omiten los campos cuando el rol es 'entrenador' o 'tecnico'
            const usuarioData = {
                id: usuario.id,
                nombre: usuario.nombre,
                username: usuario.username,
                correo: usuario.correo,
                rol: usuario.rol,
                password: usuario.password,
            };

            if (usuario.rol !== 'entrenador' && usuario.rol !== 'tecnico') {
                // Agregar solo si no es 'entrenador' o 'tecnico'
                usuarioData.altura = usuario.altura;
                usuarioData.posicion = usuario.posicion;
                usuarioData.fecha_nacimiento = usuario.fecha_nacimiento;
            }

            return usuarioData;
        });

        res.status(200).json(formatoUsuarios);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al obtener los usuarios" });
    }
};

// Obtener un solo usuario
export const getUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const unUsuario = await usuario.findOne({ where: { id } });

        if (!unUsuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const formatoUsuario = {
            nombre: unUsuario.nombre,
            username: unUsuario.username,
            correo: unUsuario.correo,
            rol: unUsuario.rol,
            password: unUsuario.password,
        };

        if (unUsuario.rol !== 'entrenador' && unUsuario.rol !== 'tecnico') {
            formatoUsuario.altura = unUsuario.altura;
            formatoUsuario.posicion = unUsuario.posicion;
            formatoUsuario.fecha_nacimiento = unUsuario.fecha_nacimiento;
        }

        res.status(200).json(formatoUsuario);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al obtener el usuario' });
    }
};

// Crear un nuevo usuario
export const createUsuario = async (req, res) => {
    try {
        const { nombre, username, correo, password, rol, altura, posicion, fecha_nacimiento } = req.body;

        if (rol === 'entrenador' || rol === 'tecnico') {
            // Si el rol es entrenador o tecnico, no pedimos los campos de altura, posicion y fecha_nacimiento
            const nuevoUsuario = await usuario.create({
                nombre,
                username,
                correo,
                password,
                rol,
            });
            res.status(201).json(nuevoUsuario);
        } else {
            // Si el rol es otro, pedimos los campos completos
            const nuevoUsuario = await usuario.create({
                nombre,
                username,
                correo,
                password,
                rol,
                altura,
                posicion,
                fecha_nacimiento,
            });
            res.status(201).json(nuevoUsuario);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al crear el usuario' });
    }
};

// Actualizar un usuario
export const updateUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, username, correo, password, rol, altura, posicion, fecha_nacimiento } = req.body;

        const usuarioExistente = await usuario.findByPk(id);

        if (!usuarioExistente) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        usuarioExistente.nombre = nombre;
        usuarioExistente.username = username;
        usuarioExistente.correo = correo;
        usuarioExistente.password = password;
        usuarioExistente.rol = rol;

        if (rol !== 'entrenador' && rol !== 'tecnico') {
            usuarioExistente.altura = altura;
            usuarioExistente.posicion = posicion;
            usuarioExistente.fecha_nacimiento = fecha_nacimiento;
        }

        await usuarioExistente.save();

        res.status(200).json(usuarioExistente);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
};

// Eliminar un usuario
export const deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioExistente = await usuario.findByPk(id);

        if (!usuarioExistente) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        await usuarioExistente.destroy();
        res.status(200).json({ message: "Usuario eliminado exitosamente" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al eliminar el usuario" });
    }
};
