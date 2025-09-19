// ==========================================
// Detección de QR con Html5Qrcode
// ==========================================
function iniciarScanner() {
    const qrReader = new Html5Qrcode("qr-reader");

    qrReader.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        qrCodeMessage => {
            procesarQR(qrCodeMessage);
            qrReader.stop();
            document.getElementById("qr-reader").innerHTML = "<p>QR escaneado ?</p>";
        }
    ).catch(err => {
        console.error("Error al iniciar QR: ", err);
        mostrarToast("No se pudo iniciar la cámara", "red");
    });
}

function procesarQR(qrCodeMessage) {
    const usuario = localStorage.getItem("usuarioActivo");
    if (!usuario) {
        mostrarToast("Debes iniciar sesión", "red");
        window.location.href = "index.html";
        return;
    }

    const key = "user_" + usuario;
    const datos = JSON.parse(localStorage.getItem(key));
    datos.figuritas = datos.figuritas || [];

    let figuritaId = null;
    for (const [clave, id] of Object.entries(codigosQR)) {
        if (qrCodeMessage.includes(clave)) {
            figuritaId = id;
            break;
        }
    }

    if (!figuritaId) {
        mostrarToast("QR inválido", "red");
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

        mostrarToast(`¡Felicitaciones! Obtuviste la ${figuritaId} ??`, "lime");
    } else {
        mostrarToast("Ya tienes esta figurita", "orange");
    }

    if (window.actualizarContador) window.actualizarContador();
}
