document.addEventListener("DOMContentLoaded", () => {
  const usuarioActivo = localStorage.getItem("usuarioActivo");
  if (!usuarioActivo) {
    window.location.href = "index.html";
    return;
  }

  // Mostrar usuario activo
  document.getElementById("usuarioActivo").textContent = "👤 " + usuarioActivo;

  const key = "user_" + usuarioActivo;
  const datos = JSON.parse(localStorage.getItem(key));
  const figuritas = datos.figuritas || [];

  // Marcar figuritas desbloqueadas
  figuritas.forEach(id => {
    const elem = document.getElementById(id);
    if (elem) elem.classList.add("desbloqueada");
  });

  actualizarContador();

  // Botón reiniciar
  document.getElementById("btnReiniciar").addEventListener("click", () => {
    datos.figuritas = [];
    localStorage.setItem(key, JSON.stringify(datos));
    document.querySelectorAll(".figurita").forEach(f => f.classList.remove("desbloqueada"));
    actualizarContador();
  });

  // Botón logout
  document.getElementById("btnLogout").addEventListener("click", () => {
    localStorage.removeItem("usuarioActivo");
    window.location.href = "index.html";
  });

  function actualizarContador() {
    document.getElementById("contador").textContent = `${figuritas.length} / 5 figuritas`;
  }
});
