document.addEventListener("DOMContentLoaded", () => {
  const usuarioActivo = localStorage.getItem("usuarioActivo");
  if (!usuarioActivo) {
    window.location.href = "index.html";
    return;
  }

  // Mostrar usuario con emoji usando código HTML
  document.getElementById("usuarioActivo").innerHTML =
    '<span style="color: green;">&#128104;</span> ' + usuarioActivo;

  const key = "user_" + usuarioActivo;
  const datos = JSON.parse(localStorage.getItem(key)) || {};
  datos.figuritas = datos.figuritas || [];

  // Renderizar figuritas
  const cont = document.getElementById("figuritasContainer");
  cont.innerHTML = "";
  figuritasData.forEach(fig => {
    const div = document.createElement("div");
    div.className = "figurita";
    div.id = fig.id;
    div.innerHTML = `<img src="${fig.imgBloqueada}" alt="${fig.nombre}"><span>${fig.nombre}</span>`;
    if (datos.figuritas.includes(fig.id)) {
      div.classList.add("coleccionada");
      div.querySelector("img").src = fig.imgColor;
    }
    cont.appendChild(div);
  });

  actualizarContador();

  // Botón Canjear Premio
  document.getElementById("btnReiniciar").addEventListener("click", () => {
    if (datos.figuritas.length === figuritasData.length) {
      mostrarCelebracionConPremio();
    } else {
      mostrarOverlayMensaje("? Aún no completaste el álbum. ¡Sigue coleccionando figuritas!");
    }
  });

  // Logout
  document.getElementById("btnLogout").addEventListener("click", () => {
    localStorage.removeItem("usuarioActivo");
    window.location.href = "index.html";
  });

  // Tooltip de ayuda
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

  // Función para actualizar el contador
  function actualizarContador() {
    document.getElementById("contador").textContent =
      `${datos.figuritas.length} / ${figuritasData.length} figuritas`;
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

// === Celebración con premio ===
function mostrarCelebracionConPremio() {
  const overlay = document.getElementById("completado-overlay");
  overlay.innerHTML = `
    <h1>&#127881; ¡Felicidades ${localStorage.getItem("usuarioActivo")}! &#127881;</h1>
    <p>¡Completaste tu Álbum!</p>
    <p style="font-size:1.5rem; color:yellow;">Tu premio: <b>CODIGO1234</b></p>
    <canvas id="confeti"></canvas>
    <canvas id="fuegos"></canvas>
    <audio id="musica" src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" autoplay></audio>
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
