/**
 * Routes: host + /api/events
 */
const { Router } = require('express')
const { validarCampos } = require('../middlewares/validar-campos')
const { validarJWT } = require('../middlewares/validar-jwt')
const {
  crearEvento,
  getEventos,
  actualizarEvento,
  eliminarEvento,
} = require('../controllers/events')
const { check } = require('express-validator')
const { isDate } = require('../helpers/isDate')
const router = Router()

router.use(validarJWT)

router.get('/', getEventos)
router.post(
  '/',
  [
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatoria').custom(isDate),
    check('end', 'Fecha de finalización es obligatoria').custom(isDate),
    validarCampos,
  ],
  crearEvento
)
router.put(
  '/:id',
  [
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatoria').custom(isDate),
    check('end', 'Fecha de finalización es obligatoria').custom(isDate),
    validarCampos,
  ],
  actualizarEvento
)
router.delete('/:id', eliminarEvento)

module.exports = router
