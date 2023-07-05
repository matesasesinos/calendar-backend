const Evento = require('../models/Evento')

const getEventos = async (req, res) => {
  const eventos = await Evento.find().populate('user', 'name')
  return res.json({
    ok: true,
    eventos,
  })
}

const crearEvento = async (req, res) => {
  const evento = new Evento(req.body)
  try {
    evento.user = req.uid
    const eventoGuardado = await evento.save()

    return res.json({
      ok: true,
      evento: eventoGuardado,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}

const actualizarEvento = async (req, res) => {
  const eventoId = req.params.id
  const uid = req.uid

  try {
    const evento = await Evento.findById(eventoId)

    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe el evento',
      })
    }

    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: 'No es tu evento, no podes editarlo',
      })
    }

    const nuevoEvento = {
      ...req.body,
      user: uid,
    }

    const eventoActualizado = await Evento.findByIdAndUpdate(
      eventoId,
      nuevoEvento,
      { new: true }
    )

    return res.json({
      ok: true,
      eventoActualizado,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}

const eliminarEvento = async (req, res) => {
  const eventoId = req.params.id
  try {
    if(!eventoId) {
      return res.status(400).json({
        ok: false,
        msg: 'Falta el id del evento a eliminar'
      })
    }

    const evento = await Evento.findById(eventoId)

    if(!evento) {
      return res.status(404).json({
        ok: false,
        msg: 'No se encontro el evento'
      })
    }

    if(evento.user.toString() !== req.uid) {
      return res.status(401).json({
        ok: false,
        msg: 'No tiene privilegio de eliminar este evento'
      })
    }

    const borrarEvento = await Evento.findByIdAndDelete(eventoId)

    if(!borrarEvento) {
      return res.status(400).json({
        ok: false,
        msg: 'No se pudo eliminar el evento'
      })
    }

    return res.json({
      ok: true,
      msg: `El evento ${evento.title} se elimino correctamente.`,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}

module.exports = {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
}
