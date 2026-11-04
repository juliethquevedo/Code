/**
 * Define las URLs (endpoints) relacionadas con autenticacion
 * las conecta con su funcion controladora correspondiente
 */

//framework del servidor
const express = require('express');
//Router in mini servidor de rutas que
//despues se montan en server.js
//con una app.use(api/auth), authRoutes
const router = express.Router();

//Funciones controladas con la logica real de cada endpoint
const { login, register } = require('../controllers/auth.controllers');
//middleware que protege rutas exigiendo un token jwt valido
const verifyToken = require('../middlewares/verifyToken');
//post /api/auth/login = iniciar sesion (ruta publica)
router.post('/login', login);

//GET api/auth/perfil = devuelve los datos de usuario logueado
//ruta protegida pasa primero por el verificarToken
router.get('/perfil', verifyToken,perfil) ;

module.exports = router;