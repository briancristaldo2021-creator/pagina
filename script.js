document.addEventListener("DOMContentLoaded", () => {
  const usuarioActivo = localStorage.getItem("usuarioActivo");
  if (!usuarioActivo) {
    window.location.href = "index.html";
    return;
  }

// Suponiendo que usuarioActivo ya tiene el nombre
document.getElementById("usuarioActivo").innerHTML =
  '<span style="color: green;">ðŸ‘¤</span> ' + usuarioActivo;



  const key = "user_" + usuarioActivo;
  const datos = JSON.parse(localStorage.getItem(key));
  datos.figuritas = datos.figuritas || [];

  // Renderizar figuritas dinámicamente
  const cont = document.getElementById("figuritasContainer");
  cont.innerHTML = "";
  figuritasData.forEach(fig => {
    const div = document.createElement("div");
    div.className = "figurita";
    div.id = fig.id;
    div.innerHTML = `<img src=\"${fig.imgBloqueada}\" alt=\"${fig.nombre}\"><span>${fig.nombre}</span>`;
    if (datos.figuritas.includes(fig.id)) {
      div.classList.add("coleccionada");
      div.querySelector("img").src = fig.imgColor;
    }
    cont.appendChild(div);
  });

  actualizarContador();

  // Botón reiniciar
  document.getElementById("btnReiniciar").addEventListener("click", () => {
    datos.figuritas = [];
    localStorage.setItem(key, JSON.stringify(datos));
    document.querySelectorAll(".figurita").forEach(f => {
      f.classList.remove("coleccionada");
      const fig = figuritasData.find(x => x.id === f.id);
      if(fig) f.querySelector("img").src = fig.imgBloqueada;
    });
    actualizarContador();
  });

  // Botón logout
  document.getElementById("btnLogout").addEventListener("click", () => {
    localStorage.removeItem("usuarioActivo");
    window.location.href = "index.html";
  });

  function actualizarContador() {
    document.getElementById("contador").textContent = `${datos.figuritas.length} / ${figuritasData.length} figuritas`;
    if (datos.figuritas.length === figuritasData.length) mostrarCompletado();
  }

  window.actualizarContador = actualizarContador;
});

// Toast (notificación)
function mostrarToast(msg, color = "#00ffff") {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.style.color = color;
  toast.classList.add("visible");
  setTimeout(() => toast.classList.remove("visible"), 3000);
}

// Overlay de álbum completado
function mostrarCompletado() {
  const overlay = document.getElementById("completado-overlay");
  overlay.classList.add("visible");
  setTimeout(() => overlay.classList.remove("visible"), 6000);
}
// Mostrar y ocultar el tooltip
const btnAyuda = document.getElementById('btnAyuda');
const tooltipAyuda = document.getElementById('tooltipAyuda');

btnAyuda.addEventListener('click', () => {
    tooltipAyuda.style.display = (tooltipAyuda.style.display === 'block') ? 'none' : 'block';
});

// Cerrar tooltip si se hace clic fuera
window.addEventListener('click', (e) => {
    if (!btnAyuda.contains(e.target) && !tooltipAyuda.contains(e.target)) {
        tooltipAyuda.style.display = 'none';
    }
});
