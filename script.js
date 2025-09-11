// ==========================================
// Overlay Bienvenida
// ==========================================
function cerrarBienvenida() {
    const overlay = document.getElementById('bienvenida');
    overlay.style.opacity = 0;
    setTimeout(() => {
        overlay.style.display = 'none';
        document.getElementById('login-container').style.display = 'flex';
    }, 1500);
}

// ==========================================
// Registro / Login
// ==========================================
function registrarOLogin() {
    const usuario = document.getElementById('usuario').value.trim();
    const password = document.getElementById('password').value.trim();
    const mensaje = document.getElementById('mensaje');

    if(!usuario || !password){
        mensaje.textContent = "Completa todos los campos";
        mensaje.style.color = "red";
        return;
    }

    const key = 'user_' + usuario;
    const datosGuardados = localStorage.getItem(key);

    if(datosGuardados){
        const userObj = JSON.parse(datosGuardados);
        if(userObj.password === password){
            localStorage.setItem('usuarioActivo', usuario);
            window.location.href = 'album.html';
        } else {
            mensaje.textContent = "Contraseña incorrecta";
            mensaje.style.color = "red";
        }
    } else {
        localStorage.setItem(key, JSON.stringify({usuario, password, figuritas: []}));
        localStorage.setItem('usuarioActivo', usuario);
        window.location.href = 'album.html';
    }
}

// ==========================================
// Álbum de Figuritas
// ==========================================
const figuritasDisponibles = [
  {id:1,img:"https://i.ibb.co/2W5CjJ2/fig1.png"},
  {id:2,img:"https://i.ibb.co/L9b9p0n/fig2.png"},
  {id:3,img:"https://i.ibb.co/0rZt6pz/fig3.png"},
  {id:4,img:"https://i.ibb.co/1Xf5NfD/fig4.png"},
  {id:5,img:"https://i.ibb.co/v3sNw5G/fig5.png"}
];

function mostrarAlbum(){
    const usuario = localStorage.getItem('usuarioActivo');
    if(!usuario){ alert("Debes iniciar sesión"); window.location.href='index.html'; return; }

    const datos = JSON.parse(localStorage.getItem('user_' + usuario));
    const album = document.getElementById('album');
    album.innerHTML = '';

    figuritasDisponibles.forEach(f=>{
        const div = document.createElement('div');
        div.classList.add('figurita');
        if(datos.figuritas.includes(f.id)) div.classList.add('coleccionada');
        div.innerHTML = `<img src="${f.img}" alt="Figurita ${f.id}"><p>Figurita ${f.id}</p>`;
        album.appendChild(div);
    });

    // Contador
    document.getElementById('contador').textContent = `Figuritas coleccionadas: ${datos.figuritas.length}/5`;

    // Barra de progreso
    const porcentaje = (datos.figuritas.length / figuritasDisponibles.length) * 100;
    const barra = document.getElementById('progreso');
    if(barra) barra.style.width = porcentaje + '%';

    // Premio final
    document.getElementById('premio').style.display = (datos.figuritas.length === 5) ? 'block' : 'none';
}

// ==========================================
// Agregar figurita desde QR
// ==========================================
function agregarFiguritaDesdeQR(){
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('figurita'));
    if(!id) return;

    const usuario = localStorage.getItem('usuarioActivo');
    if(!usuario){ alert("Debes iniciar sesión para escanear la figurita."); return; }

    const key = 'user_' + usuario;
    const datos = JSON.parse(localStorage.getItem(key));

    if(!datos.figuritas.includes(id)){
        datos.figuritas.push(id);
        localStorage.setItem(key, JSON.stringify(datos));

        // Animación
        const divFig = document.querySelector(`.figurita:nth-child(${id})`);
        if(divFig) divFig.classList.add('nueva');

        alert(`¡Figurita ${id} agregada a tu colección!`);
    }

    mostrarAlbum();
}

// ==========================================
// Reiniciar álbum
// ==========================================
function reiniciarAlbum(){
    const usuario = localStorage.getItem('usuarioActivo');
    if(!usuario) return;
    const datos = JSON.parse(localStorage.getItem('user_' + usuario));
    datos.figuritas = [];
    localStorage.setItem('user_'+usuario, JSON.stringify(datos));
    mostrarAlbum();
}

// ==========================================
// Evento Enter para login/registro
// ==========================================
document.getElementById('password')?.addEventListener('keypress', function(e){
    if(e.key === 'Enter') registrarOLogin();
});
document.getElementById('usuario')?.addEventListener('keypress', function(e){
    if(e.key === 'Enter') registrarOLogin();
});

// ==========================================
// Inicialización al cargar página de álbum
// ==========================================
window.onload = function(){
    mostrarAlbum();
    agregarFiguritaDesdeQR();
}
