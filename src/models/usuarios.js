import { DataTypes } from "sequelize";
import { bd } from "../database/database.js";

export const usuario  = bd.define('usuario', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  altura: {
    type: DataTypes.FLOAT, // para la altura, usaremos un tipo de dato flotante
    allowNull: true, // Permitimos que la altura pueda ser nula
  },
  fecha_nacimiento: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  usuario: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Asegurar que el nombre de usuario sea único
  },
  contrasena: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  posicion: {
    type: DataTypes.ENUM('punta', 'central', 'armador', 'libero', 'nexo'),
    allowNull: true, // Permitimos que la posición pueda ser nula
  },
  rol: {
    type: DataTypes.ENUM('entrenador', 'jugador', 'tecnico'),
    allowNull: false,
  },
}, {
  tableName: 'usuarios', // Aseguramos que la tabla se llame 'usuarios'
  timestamps:  false, // para mantener las marcas de tiempo como createdAt y updatedAt
});

