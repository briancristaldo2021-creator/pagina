document.addEventListener("DOMContentLoaded", () => {
  // Overlay de mensajes
  function mostrarOverlayMensaje(msg){
      const overlayMsg = document.getElementById("overlay-msg");
      const overlayMsgText = document.getElementById("overlay-msg-text");
      overlayMsgText.innerHTML = msg;
      overlayMsg.style.display = "block";
  }

  document.getElementById("overlay-msg-close").addEventListener("click", ()=>{
      document.getElementById("overlay-msg").style.display = "none";
  });

  // Iniciar escaneo QR
  function iniciarScanner() {
      Html5Qrcode.getCameras().then(cameras => {
          if(cameras && cameras.length){
              const qrReader = new Html5Qrcode("qr-reader");
              qrReader.start(
                  { facingMode: "environment" },
                  { fps: 10, qrbox: 250 },
                  qrCodeMessage => {
                      procesarQR(qrCodeMessage);
                      qrReader.stop();
                      document.getElementById('qr-reader').innerHTML = "<p>QR escaneado &#9989;</p>";
                  },
                  errorMessage => { console.warn("Error de escaneo: ", errorMessage); }
              ).catch(err=>{
                  console.error("Error al iniciar QR: ", err);
                  mostrarOverlayMensaje("No se pudo iniciar la c�mara. Revisa permisos o usa otro dispositivo.");
              });
          } else {
              mostrarOverlayMensaje("No se detecta c�mara en tu dispositivo.");
          }
      }).catch(err=>{
          console.error("Error al buscar c�maras: ", err);
          mostrarOverlayMensaje("No se pudo acceder a la c�mara. Revisa permisos del navegador.");
      });
  }

  // Procesar resultado del QR
  function procesarQR(qrCodeMessage) {
      const usuario = localStorage.getItem("usuarioActivo");
      if (!usuario) {
          mostrarOverlayMensaje("Debes iniciar sesi�n");
          window.location.href = "index.html";
          return;
      }

      const key = "user_" + usuario;
      const datos = JSON.parse(localStorage.getItem(key)) || {};
      datos.figuritas = datos.figuritas || [];

      let figuritaId = null;
      for (const [clave, id] of Object.entries(codigosQR)) {
          if (qrCodeMessage.includes(clave)) {
              figuritaId = id;
              break;
          }
      }

      if (!figuritaId) {
          mostrarOverlayMensaje("QR inv�lido");
          return;
      }

      if (!datos.figuritas.includes(figuritaId)) {
          datos.figuritas.push(figuritaId);
          localStorage.setItem(key, JSON.stringify(datos));

          const elem = document.getElementById(figuritaId);
          if (elem) {
              elem.classList.add("coleccionada");
              const fig = figuritasData.find(f => f.id === figuritaId);
              if (fig) elem.querySelector("img").src = fig.imgColor;
          }

          mostrarOverlayMensaje(`�Felicitaciones! Obtuviste la ${figuritaId} &#127881;`);
      } else {
          mostrarOverlayMensaje("Ya tienes esta figurita");
      }

      if (window.actualizarContador) window.actualizarContador();
  }

  // Exponer funciones al global si es necesario
  window.iniciarScanner = iniciarScanner;
  window.procesarQR = procesarQR;
});
