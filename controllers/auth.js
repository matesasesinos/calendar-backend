const { response } = require('express')
const bcrypt = require('bcryptjs')
const Usuario = require('../models/Usuario')
const { generarJWT } = require('../helpers/jwt')

const loginUsuario = async (req, res = response) => {
  const { email, password } = req.body

  try {
    let usuario = await Usuario.findOne({ email })
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: 'El usuario no esta registrado.',
      })
    }

    //password
    const validPassword = bcrypt.compareSync(password, usuario.password)
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'La contraseña no es correcta.',
      })
    }

    //token
    const token = await generarJWT(usuario.id, usuario.name)

    res.json({
      ok: true,
      uid: usuario.id,
      email: usuario.email,
      token,
      msg: 'Token generado',
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Error desconocido',
    })
  }
}
const crearUsuario = async (req, res = response) => {
  const { email, password } = req.body
  try {
    let usuario = await Usuario.findOne({ email })

    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: 'Un usuario existe con ese correo',
      })
    }

    usuario = new Usuario(req.body)
    // Encriptar contraseña
    const salt = bcrypt.genSaltSync()
    usuario.password = bcrypt.hashSync(password, salt)

    await usuario.save()

    //token
    const token = await generarJWT(usuario.id, usuario.name)

    res.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token,
      message: 'Usuario creado correctamente',
    })
  } catch (eerror) {
    console.log(eerror)
    res.status(500).json({
      ok: false,
      msg: 'Error desconocido',
    })
  }
}
const revalidarToken = async (req, res = response) => {
  const { uid, name } = req

  //generar JWT
  const token = await generarJWT(uid, name)

  res.json({
    ok: true,
    token,
  })
}

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken,
}
