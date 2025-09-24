// script.js mejorado - controla album, avatar, intercambio y tienda demo
document.addEventListener("DOMContentLoaded", () => {
  const usuarioActivo = localStorage.getItem("usuarioActivo");
  if (!usuarioActivo) {
    window.location.href = "index.html";
    return;
  }

  // Mostrar avatar y nombre
  const key = "user_" + usuarioActivo;
  const datos = JSON.parse(localStorage.getItem(key)) || {};
  datos.figuritas = datos.figuritas || [];
  localStorage.setItem(key, JSON.stringify(datos));

  const avatarHtml = `<img src="${datos.avatar||'img/default.png'}" style="width:36px;height:36px;border-radius:50%;vertical-align:middle;margin-right:8px">`;
  document.getElementById("usuarioActivo").innerHTML = avatarHtml + '<span style="color: green;">&#128104;</span> ' + usuarioActivo;

  // Render figuritas
  const cont = document.getElementById("figuritasContainer");
  cont.innerHTML = "";
  figuritasData.forEach(fig => {
    const div = document.createElement("div");
    div.className = "figurita";
    div.id = fig.id;
    div.innerHTML = `<img src="${fig.imgBloqueada}" alt="${fig.nombre}"><span>${fig.nombre}</span>`;
    // si lo tiene
    if (datos.figuritas.includes(fig.id)) {
      div.classList.add("coleccionada");
      div.querySelector("img").src = fig.imgColor;
    }

    // click abre opciones: ver perfil de dueño (si otro), ofrecer/intercambiar si es mio
    div.addEventListener('click', ()=>{
      // si es mio, abrir modal de opciones
      if(datos.figuritas.includes(fig.id)){
        const compartir = confirm('Queres ofertar/intercambiar esta figurita a otro usuario?');
        if(compartir){
          const receptor = prompt('Usuario receptor (exacto)');
          if(receptor){
            const keyR = 'user_' + receptor;
            const datosR = JSON.parse(localStorage.getItem(keyR));
            if(!datosR){ alert('Usuario receptor no existe'); return; }
            // transferencia inmediata (demo)
            datos.figuritas = datos.figuritas.filter(f=>f!==fig.id);
            datosR.figuritas = datosR.figuritas || [];
            datosR.figuritas.push(fig.id);
            localStorage.setItem(key, JSON.stringify(datos));
            localStorage.setItem(keyR, JSON.stringify(datosR));
            alert('Figurita transferida (demo)');
            location.reload();
          }
        }
      } else {
        // mostrar perfil de quien la tiene? busco en usuarios
        let owner = null;
        for(let i=0;i<localStorage.length;i++){
          const k = localStorage.key(i);
          if(k.startsWith('user_')){
            const d = JSON.parse(localStorage.getItem(k));
            if((d.figuritas||[]).includes(fig.id)){ owner = d.usuario; break; }
          }
        }
        if(owner) window.location.href = 'perfil.html?user=' + encodeURIComponent(owner);
        else alert('Nadie la tiene todavía');
      }
    });

    cont.appendChild(div);
  });

  actualizarContador();

  // Canjear premio
  document.getElementById("btnReiniciar").addEventListener("click", () => {
    if (datos.figuritas.length === figuritasData.length) {
      mostrarCelebracionConPremio();
    } else {
      mostrarOverlayMensaje("Aún no completaste el álbum. ¡Sigue coleccionando figuritas!");
    }
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
    if (!btnAyuda.contains(e.target) && !tooltipAyuda.contains(e.target)) {
      tooltipAyuda.style.display = 'none';
    }
  });

  // tienda demo: comprar sobre
  const tiendaBtn = document.createElement('button');
  tiendaBtn.textContent = 'Comprar sobre (30 coins)';
  tiendaBtn.style.marginLeft = '10px';
  tiendaBtn.onclick = ()=>{
    if((datos.coins||0) < 30){ alert('No tenés coins suficientes'); return; }
    datos.coins = (datos.coins||0) - 30;
    // entregar figurita aleatoria que no tenga
    const faltantes = figuritasData.map(f=>f.id).filter(id=> !datos.figuritas.includes(id));
    if(faltantes.length === 0){ alert('Ya tenés todo'); return; }
    const ele = faltantes[Math.floor(Math.random()*faltantes.length)];
    datos.figuritas.push(ele);
    localStorage.setItem(key, JSON.stringify(datos));
    alert('Abriste un sobre y obtuviste ' + ele);
    location.reload();
  };
  document.getElementById('barra-superior').appendChild(tiendaBtn);

  // Exponer actualizarContador
  function actualizarContador() {
    document.getElementById("contador").textContent = `${datos.figuritas.length} / ${figuritasData.length} figuritas`;
  }
  window.actualizarContador = actualizarContador;
});

// === Overlay de mensajes reutilizable ===
function mostrarOverlayMensaje(msg) {
  const overlayMsg = document.getElementById("overlay-msg");
  const overlayMsgText = document.getElementById("overlay-msg-text");
  overlayMsgText.innerHTML = msg;
  overlayMsg.style.display = "block";
}
document.getElementById("overlay-msg-close").addEventListener("click", () => {
  document.getElementById("overlay-msg").style.display = "none";
});

// === Celebración con premio con música de YouTube ===
function mostrarCelebracionConPremio() {
  const overlay = document.getElementById("completado-overlay");
  overlay.innerHTML = `
    <h1>?? ¡Felicidades ${localStorage.getItem("usuarioActivo")}! ??</h1>
    <p>¡Completaste tu Álbum!</p>
    <p style="font-size:1.2rem;color:yellow;">Tu premio: <b>CODIGO1234</b></p>
    <canvas id="confeti"></canvas>
    <canvas id="fuegos"></canvas>

    <!-- Video de YouTube invisible para música -->
    <iframe 
      id="musicaYT"
      width="0" 
      height="0" 
      src="https://www.youtube.com/embed/8e1WaWQNXMU?autoplay=1&loop=1&playlist=8e1WaWQNXMU&controls=0&modestbranding=1&rel=0&showinfo=0" 
      frameborder="0" 
      allow="autoplay; encrypted-media" 
      allowfullscreen>
    </iframe>
  `;

  overlay.classList.add("visible");

  iniciarConfeti();
  iniciarFuegosArtificiales();

  // Ocultar después de 20s
  setTimeout(() => {
    overlay.classList.remove("visible");
    overlay.innerHTML = '';
  }, 20000);
}

// === Confeti animado ===
function iniciarConfeti() {
  const canvas = document.getElementById("confeti");
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext("2d");

  const confeti = [];
  for (let i = 0; i < 150; i++) {
    confeti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * 15 + 5,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      tilt: Math.random() * 10 - 10
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confeti.forEach(c => {
      ctx.beginPath();
      ctx.lineWidth = c.r / 2;
      ctx.strokeStyle = c.color;
      ctx.moveTo(c.x + c.tilt + c.r / 4, c.y);
      ctx.lineTo(c.x + c.tilt, c.y + c.r);
      ctx.stroke();

      c.y += c.d / 2;
      c.x += Math.sin(c.y / 10);

      if (c.y > canvas.height) {
        c.y = -10;
        c.x = Math.random() * canvas.width;
      }
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// === Fuegos artificiales ===
function iniciarFuegosArtificiales() {
  const canvas = document.getElementById("fuegos");
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext("2d");

  const fuegos = [];
  function lanzarFuego() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height / 2;
    const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    for (let i = 0; i < 50; i++) {
      fuegos.push({
        x, y,
        r: Math.random() * 3 + 2,
        dx: (Math.random() - 0.5) * 6,
        dy: (Math.random() - 0.5) * 6,
        color,
        life: 100
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = fuegos.length - 1; i >= 0; i--) {
      const f = fuegos[i];
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = f.color;
      ctx.fill();
      f.x += f.dx;
      f.y += f.dy;
      f.life--;
      if (f.life <= 0) fuegos.splice(i, 1);
    }
    requestAnimationFrame(draw);
  }

  setInterval(lanzarFuego, 1000);
  draw();
}
// ===== Botón Perfiles Públicos =====
const perfilesPublicosContainer = document.getElementById('perfilesPublicos');
const listaPublicos = document.getElementById('listaPublicos');

// Abrir/Cerrar lista de perfiles públicos al hacer click en el título
const tituloPublicos = perfilesPublicosContainer.querySelector('h4');
tituloPublicos.style.cursor = 'pointer';
tituloPublicos.addEventListener('click', () => {
    if(listaPublicos.style.display === 'block'){
        listaPublicos.style.display = 'none';
    } else {
        listaPublicos.style.display = 'block';
        actualizarPerfilesPublicos();
    }
});

// Función para actualizar la lista de perfiles públicos
function actualizarPerfilesPublicos(){
    listaPublicos.innerHTML = '';
    for(let i=0;i<localStorage.length;i++){
        const key = localStorage.key(i);
        if(key.startsWith('user_')){
            const u = JSON.parse(localStorage.getItem(key));
            if(u.publico){
                const div = document.createElement('div');
                div.style.display='flex';
                div.style.alignItems='center';
                div.style.gap='5px';
                div.innerHTML = `<img src="${u.avatar}"><span>${u.nombre}</span>`;
                div.title = u.bio || '';
                
                // Click en perfil público abre modal o alerta con info
                div.addEventListener('click', () => {
                    alert(`Nombre: ${u.nombre}\nBio: ${u.bio || 'Sin bio'}\nPuntos: ${u.puntos || 0}`);
                });

                listaPublicos.appendChild(div);
            }
        }
    }
}

// Inicializamos mostrando los perfiles públicos
actualizarPerfilesPublicos();

