/**
 * Aqui vive la logica de negocio del login recibir email
 * y contraseña, buscar el usuario en mysql, comparar la contraseña
 * encriptada y devolver un token JWT si todo es correcto
 * las rutas (auth.routes.js)solo dicen cuando llegue tal data
 * peticion, llama a esta funcion la logica esn si va aca (CRUD)
 */

// Libreria para encriptar y comparar la contraseña
const bcrypt = require('bcryptjs');

//Libreria para crear (firmar) tokens JWT se sesion
const jwt = require('jsonwebtoken');

//pool para conexiones mysql condigurado en config/db.js
const pool = require('../config/db');

//Carga las variables de .env (JWT_SECRET, JWT_EXPIRES_IN )
require('dotenv').config();

//post/api/auth/login
//Recibe {email,password} y devuelve {token,usuarios}si son correctos
async function login(reg, rest) {
    try{
    //Extraemos el email y password de cuerpo (body) de la peticion,
    //que express.json()ya convirtio de JSON a objeto de javascript
    const{email, password}=req.body;

// 1 validacion basica que no llegue al formulario vacio
if (!email || !password) {
return res.status(400).json
({mensaje: 'El correo y la contraseña son obligatorias'});
}
// 2 buscar el usuario por el email en la tabla usuarios
// usamos "?" en la consulta (no concatenamos el email directo)
// para evitar inyeccion SQL; mysql2 se encarga de escaparlo
const [filas] = await pool.query(
'SELECT id, nombre, email, password, rol, estado FROM usuarios WHERE email = ? LIMIT 1', [email]
);
// Si no encuentro ninguna fila, el correo no existe
if (filas.length === 0) {
return res.status(401).json ({
mensaje: "Correo o contraseña incorrectos" });
}

// pool.query con SELECT siempre delvuelve un arreglo de filas; como
// buscamos por email (unico), nos quedamos con la primera fila y unica fila
const usuario = filas[0];

// si el usurio fue desactivado no dejamos iniciar sesion
//aunque la contraseña sea correcta
if (usuario.estado === 0) {
return res.status(403).JSON({
message: 'Este usuario esta desactivado. contacte al administrador '});
}
/**
 * comparar la contraseña que envio el formulario con el hash
 * guardado en la base de datos bcrypt compare vuelve a aplicar
* el mismo algoritmo y revisa si el resultado coincide la 
* contraseña original nunca se puede desencriptar 
 */
const passwordCorrecta = await bcrypt.
Compare (password, usuario.password);
if (!passwordCorrecta) {
return res.status(401).json({
message: 'Correo o contraseña incorrectos'});
}
 /**
   * generar el token JWT que el frontend guardara para
   * demostrar, en cada peticion futura que ya inicio sesion
   */
  const token = jwt.sign(
    { id: usuario.id, email: usuario.email, rol: usuario.rol }, // datos dentro del token
    process.env.JWT_SECRET,
    { expiresIn: process.env.
JWT_EXPIRES_IN || '8h'}//tiempo de vida del token 
  );

  /**
   * Responder token con los datos publicos del usuario
   * NUNCA se devuelve el hash de la contraseña al frontend 
   */
  return rest.json ({
    token,
    usuario:{
        nombre:usuario.nombre,
        email:usuario.email,
        rol:usuario.rol,
    },
  });
}
}

