/**
 * contexto global de autenticacion permite que cualquier
 * componente de la app (sidebar, navbar, paginas protegidas y demas)
 * sepa si hay un usuario logueado quien es y pueda cerrar sesion
 * sin tener que pasar esa info "a mano" del componente en
 * componente (eso se llama "prop drilling" y el context lo evita)
 */

// createContext: crea el contexto; useContext: lo consume; useEffect:
// codigo que corre en momentos especificos del ciclo de vida; useState:
// estado local del componente
import { createContext, useContext, useEffect, useState } from "react";

// Funcion que llama al backend para validar email/password
import { iniciarSesion } from "../api/authService";

// 1) creamos el contexto (una especie de caja compartida)
const AuthContext = createContext(null);

// 2) componente proveedor: envuelve la app y le da acceso
// // Hijos acceso al valor de autenticacion actual
export function AuthProvider({ children }) {
    // //Guardar datos publicos del usuario logueado (o null si no hay sesion)
    const [usuario, setUsuario] = useState(null);
    // cargando: true mientras revisamos si ya había una sesion guardada
// en el localStorage (por ejemplo al recargar la pag :v)
const [cargando, setCargando] = useState(true);
//useEffect con arreglo vacio [] -> se ejecuta UNA sola vez,
//Justo cuando la app arranca
useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    const tokenGuardado = localStorage.getItem('token');
     // si en el localStorage hay usuario y token de una
        // sesion anterior,
        // restauramos esa sesion sin obligar a volver a
        // hacer login
        if (usuarioGuardado && tokenGuardado){
        setUsuario(JSON.parse(usuarioGuardado));
        }
})

}
