// Registro de usuario
function registrarUsuario(usuario, password) {
    if(localStorage.getItem('user_' + usuario)) return false; // ya existe
    const userObj = {usuario, password};
    localStorage.setItem('user_' + usuario, JSON.stringify(userObj));
    return true;
}

// Login de usuario
function loginUsuario(usuario, password) {
    const datos = localStorage.getItem('user_' + usuario);
    if(!datos) return false; // no existe usuario
    const userObj = JSON.parse(datos);
    if(userObj.password === password) {
        localStorage.setItem('usuarioActivo', usuario);
        return true;
    }
    return false; // contraseña incorrecta
}

// Obtener usuario activo
function obtenerUsuarioActivo() {
    return localStorage.getItem('usuarioActivo');
}

// Cerrar sesión
function logout() {
    localStorage.removeItem('usuarioActivo');
    window.location.href = 'index.html';
}

// Guardar última foto vista en el álbum
function guardarFotoActual(fotoId) {
    const usuario = obtenerUsuarioActivo();
    if(usuario) {
        localStorage.setItem('ultimaFoto_' + usuario, fotoId);
    }
}

// Cargar última foto vista
function cargarUltimaFoto() {
    const usuario = obtenerUsuarioActivo();
    if(usuario) {
        return localStorage.getItem('ultimaFoto_' + usuario);
    }
    return null;
}
