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