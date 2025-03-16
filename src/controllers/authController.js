import { usuario } from '../models/usuarios.js';
import { transporter } from '../config/mailer.js';
import jwt from 'jsonwebtoken'
import { Sequelize } from 'sequelize';
export const login = async (req, res) => {
    const {correo, username, password } = req.body;
    try {
      const user = await usuario.findOne({
        where: {
          [Sequelize.Op.or]: [{ correo: correo }, { username: username }]
        }
      });
      
      if (!user) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
  
      if (user.password !== password) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
  
      // Generar y enviar el PIN de autenticación
      const pin = Math.floor(1000 + Math.random() * 9000);
      const mailOptions = {
        from: 'laboratorios.emicb@gmail.com',
        to: user.correo,
        subject: 'Código de autenticación',
        text: `Tu código de autenticación es: ${pin}`,
      };
  
      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          console.error('Error al enviar el correo electrónico:', error);
        } else {
          console.log('Correo electrónico enviado:', info.response);
          // Actualizar el PIN del usuario en la base de datos
          try {
            await user.update({ pin });
          } catch (error) {
            console.error('Error al actualizar el PIN del usuario:', error);
          }
        }
      });
  

      return res.status(200).json({ 
        message: 'Se ha enviado un código de autenticación a tu correo electrónico', 
        userId:user.id, 
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
};
  

export const verifyPIN = async (req, res) => {
  const { pin, userId } = req.body;

  try {
    const user = await usuario.findByPk(userId);
    if (!user) {
      return res.status(401).json({ error: 'No se ha iniciado sesión' });
    }

    if (pin === user.pin) {
      await user.update({ pin: null });
      
      const tokenExpiration = 3600;
      const token = jwt.sign({ userId: user.id }, '7mosemestre', {
        expiresIn: tokenExpiration,
      });
      const expirationDate = new Date().getTime() + tokenExpiration * 1000;
      return res.status(200).json({ 
        message: 'Inicio de sesión exitoso',
        userId:user.id,
        token,
        tokenExpiration: expirationDate,
      });
    } else {
      return res.status(401).json({ error: 'PIN de autenticación inválido' });
    }
  } catch (error) {
    console.error('Error al buscar el usuario:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
};


export const refreshToken = (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'No se proporcionó un token' });
  }

  try {    
    const tokenExpiration = 3600;
    const newToken = jwt.sign({ userId }, '7mosemestre', {
      expiresIn: tokenExpiration,
    });

    const expirationDate = new Date().getTime() + tokenExpiration * 1000;

    return res.status(200).json({ 
      message: 'Token actualizado exitosamente',
      newToken,
      tokenExpiration: expirationDate,
    });
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};



