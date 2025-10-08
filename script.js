const urlServidor = 'guardar.php';
const chat = document.getElementById('chat');

function actualizar() {
    fetch(urlServidor)
    .then(res => res.json())
    .then(data => {
        chat.innerHTML = "";
        data.forEach(m => {
            chat.innerHTML += `<p>[${m.fecha}] ${m.mensaje}</p>`;
        });
        chat.scrollTop = chat.scrollHeight;
    });
}

// Actualizar cada 2 segundos
setInterval(actualizar, 2000);

function enviar() {
    const mensaje = document.getElementById('mensaje').value;
    if(!mensaje) return;

    const formData = new FormData();
    formData.append('mensaje', mensaje);

    fetch(urlServidor, { method: 'POST', body: formData })
        .then(() => {
            document.getElementById('mensaje').value = '';
            actualizar();
        });
}

// Carga inicial
actualizar();


// Carga inicial
actualizar();

// === Inicialización de usuario y album ===
document.addEventListener("DOMContentLoaded", () => {
  const usuarioActivoKey = localStorage.getItem("usuarioActivo");
  if (!usuarioActivoKey) { window.location.href = "index.html"; return; }

  const key = "user_" + usuarioActivoKey;
  const datos = JSON.parse(localStorage.getItem(key)) || {};
  datos.usuario = usuarioActivoKey;
  datos.figuritas = datos.figuritas || [];
  datos.puntos = datos.puntos || 0;
  localStorage.setItem(key, JSON.stringify(datos));

  // Mostrar avatar y nombre
  const avatarHtml = `<img src="${datos.avatar||'img/default.png'}" style="width:36px;height:36px;border-radius:50%;vertical-align:middle;margin-right:8px">`;
  document.getElementById("usuarioActivo").innerHTML = avatarHtml + '<span style="color: green;">&#128104;</span> ' + usuarioActivoKey;

  // Renderizar figuritas
  const cont = document.getElementById("figuritasContainer");
  cont.innerHTML = "";
  figuritasData.forEach(fig => {
    const div = document.createElement("div");
    div.className = "figurita";
    div.id = fig.id;
    div.innerHTML = `<img src="${fig.imgBloqueada}" alt="${fig.nombre}"><span>${fig.nombre}</span>`;
    if(datos.figuritas.includes(fig.id)) div.querySelector("img").src = fig.imgColor;

    div.addEventListener('click', ()=>{ manejarClickFigurita(fig, datos, key); });
    cont.appendChild(div);
  });

  actualizarContador(datos);

  // Canjear premio
  document.getElementById("btnReiniciar").addEventListener("click", () => {
    if (datos.figuritas.length === figuritasData.length) mostrarCelebracionConPremio();
    else mostrarOverlayMensaje("Aún no completaste el álbum. ¡Sigue coleccionando figuritas!");
  });

  // Logout
  document.getElementById("btnLogout").addEventListener("click", () => {
    localStorage.removeItem("usuarioActivo");
    window.location.href = "index.html";
  });

  // Ayuda tooltip
  const btnAyuda = document.getElementById("btnAyuda");
  const tooltipAyuda = document.getElementById("tooltipAyuda");
  btnAyuda.addEventListener("click", () => {
    tooltipAyuda.style.display = (tooltipAyuda.style.display === 'block') ? 'none' : 'block';
  });
  window.addEventListener('click', (e) => {
    if (!btnAyuda.contains(e.target) && !tooltipAyuda.contains(e.target)) tooltipAyuda.style.display = 'none';
  });

  // Tienda demo: comprar sobre
  const tiendaBtn = document.createElement('button');
  tiendaBtn.textContent = 'Comprar sobre (30 coins)';
  tiendaBtn.style.marginLeft = '10px';
  tiendaBtn.onclick = ()=>{ comprarSobre(datos,key); };
  document.getElementById('barra-superior').appendChild(tiendaBtn);

  // === Perfil Mejorado ===
  inicializarPerfil(datos, key);
  actualizarPerfilesPublicos();
});

// === FUNCIONES PERFIL ===
function inicializarPerfil(usuario,key){
  const btnPerfil = document.getElementById('btnPerfil');
  const panelPerfil = document.getElementById('panel-perfil');
  const btnCerrarPerfil = document.getElementById('btnCerrarPerfil');
  const btnGuardarCambios = document.getElementById('btnGuardarCambios');
  const avatarPreview = document.getElementById('avatar-preview');
  const inputAvatar = document.getElementById('nuevoAvatar');
  const inputNombre = document.getElementById('nuevoNombre');
  const inputClave = document.getElementById('nuevaClave');
  const usuarioActivo = document.getElementById('usuarioActivo');
  const avatarBarra = document.getElementById('avatar-barra');
  const perfilPublicoCheck = document.getElementById('perfilPublicoCheck');
  const perfilBio = document.getElementById('perfilBio');

  btnPerfil.addEventListener('click',()=>{
    panelPerfil.style.display='block';
    inputNombre.value=usuario.nombre||usuario.usuario;
    inputClave.value='';
    avatarPreview.src=usuario.avatar||'img/logo.png';
    perfilPublicoCheck.checked = usuario.publico||false;
    perfilBio.value = usuario.bio||'';
  });

  btnCerrarPerfil.addEventListener('click',()=>panelPerfil.style.display='none');

  inputAvatar.addEventListener('change',(e)=>{
    const file=e.target.files[0];
    if(file){
      const reader=new FileReader();
      reader.onload=()=>avatarPreview.src=reader.result;
      reader.readAsDataURL(file);
    }
  });

  btnGuardarCambios.addEventListener('click',()=>{
    const nuevoNombre = inputNombre.value.trim();
    if(nuevoNombre===''){ alert('El nombre no puede estar vacío'); return; }
    usuario.nombre = nuevoNombre;
    if(inputClave.value.trim()!=='') usuario.clave = inputClave.value;
    usuario.avatar = avatarPreview.src;
    usuario.publico = perfilPublicoCheck.checked;
    usuario.bio = perfilBio.value;

    localStorage.setItem(key,JSON.stringify(usuario));
    mostrarUsuarioPanel(usuario,usuarioActivo,avatarBarra);
    panelPerfil.style.display='none';
    alert('Perfil actualizado correctamente!');
    actualizarPerfilesPublicos();
  });
}

// Actualizar UI de perfil
function mostrarUsuarioPanel(usuario,usuarioActivoElem,avatarBarra){
  usuarioActivoElem.textContent = usuario.nombre;
  avatarBarra.src = usuario.avatar;
}

// === Actualizar contador figuritas ===
function actualizarContador(datos){
  document.getElementById("contador").textContent = `${datos.figuritas.length} / ${figuritasData.length} figuritas`;
}

// === Funciones auxiliares ===
function comprarSobre(datos,key){
  if((datos.coins||0) < 30){ alert('No tenés coins suficientes'); return; }
  datos.coins = (datos.coins||0) - 30;
  const faltantes = figuritasData.map(f=>f.id).filter(id=> !datos.figuritas.includes(id));
  if(faltantes.length === 0){ alert('Ya tenés todo'); return; }
  const ele = faltantes[Math.floor(Math.random()*faltantes.length)];
  datos.figuritas.push(ele);
  localStorage.setItem(key,JSON.stringify(datos));
  alert('Abriste un sobre y obtuviste ' + ele);
  location.reload();
}

function manejarClickFigurita(fig,datos,key){
  if(datos.figuritas.includes(fig.id)){
    const compartir = confirm('Queres ofertar/intercambiar esta figurita a otro usuario?');
    if(compartir){
      const receptor = prompt('Usuario receptor (exacto)');
      if(receptor){
        const keyR = 'user_' + receptor;
        const datosR = JSON.parse(localStorage.getItem(keyR));
        if(!datosR){ alert('Usuario receptor no existe'); return; }
        datos.figuritas = datos.figuritas.filter(f=>f!==fig.id);
        datosR.usuario = receptor;
        datosR.figuritas = datosR.figuritas || [];
        datosR.figuritas.push(fig.id);
        localStorage.setItem('user_' + datos.usuario,JSON.stringify(datos));
        localStorage.setItem(keyR,JSON.stringify(datosR));
        alert('Figurita transferida (demo)');
        location.reload();
      }
    }
  } else {
    let owner = null;
    for(let i=0;i<localStorage.length;i++){
      const k = localStorage.key(i);
      if(k.startsWith('user_')){
        const d = JSON.parse(localStorage.getItem(k));
        if((d.figuritas||[]).includes(fig.id)){ owner=d.usuario||k.replace('user_',''); break; }
      }
    }
    if(owner) window.location.href = 'perfil.html?user=' + encodeURIComponent(owner);
    else alert('Nadie la tiene todavía');
  }
}

// === Overlay mensajes ===
function mostrarOverlayMensaje(msg){
  const overlayMsg = document.getElementById("overlay-msg");
  const overlayMsgText = document.getElementById("overlay-msg-text");
  overlayMsgText.innerHTML = msg;
  overlayMsg.style.display = "block";
}
document.getElementById("overlay-msg-close").addEventListener("click", ()=>{ document.getElementById("overlay-msg").style.display = "none"; });

// === Celebración con premio ===
function mostrarCelebracionConPremio(){
  const overlay = document.getElementById("completado-overlay");
  overlay.innerHTML = `
    <h1>🎉 ¡Felicidades ${localStorage.getItem("usuarioActivo")}! 🎉</h1>
    <p>¡Completaste tu Álbum!</p>
    <p style="font-size:1.2rem;color:yellow;">Tu premio: <b>CODIGO1234</b></p>
    <canvas id="confeti"></canvas>
    <canvas id="fuegos"></canvas>
    <iframe 
      id="musicaYT"
      width="0" height="0" 
      src="https://www.youtube.com/embed/8e1WaWQNXMU?autoplay=1&loop=1&playlist=8e1WaWQNXMU&controls=0&modestbranding=1&rel=0&showinfo=0" 
      frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
    </iframe>
  `;
  overlay.classList.add("visible");
  iniciarConfeti(); iniciarFuegosArtificiales();
  setTimeout(()=>{ overlay.classList.remove("visible"); overlay.innerHTML=''; },20000);
}

// === Confeti y fuegos ===
// (Mismo código que tenías en script.js, sin cambios)
// Carga inicial
actualizar();