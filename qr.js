// ==========================================
// Detecci�n de QR con Html5Qrcode
// ==========================================

// Figuritas vinculadas a QR
const codigosQR = {
    "fig1": 1,
    "fig2": 2,
    "fig3": 3,
    "fig4": 4,
    "fig5": 5
};

function iniciarScanner() {
    const qrReader = new Html5Qrcode("qr-reader");

    qrReader.start(
        { facingMode: "environment" }, // c�mara trasera en celular
        { fps: 10, qrbox: 250 },
        qrCodeMessage => {
            procesarQR(qrCodeMessage);
            qrReader.stop();
            document.getElementById('qr-reader').innerHTML = "<p>QR escaneado ?</p>";
        },
        errorMessage => {
            // errores normales de escaneo
        }
    ).catch(err => {
        console.error("Error al iniciar QR: ", err);
        alert("No se pudo iniciar la c�mara ??");
    });
}

function procesarQR(qrCodeMessage) {
    const usuario = localStorage.getItem('usuarioActivo');
    if (!usuario) {
        alert("Debes iniciar sesi�n.");
        window.location.href = "index.html";
        return;
    }

    const datos = JSON.parse(localStorage.getItem('user_' + usuario));
    let figuritaId = null;

    for (const [clave, id] of Object.entries(codigosQR)) {
        if (qrCodeMessage.includes(clave)) {
            figuritaId = id;
            break;
        }
    }

    if (!figuritaId) {
        alert("QR inv�lido ?");
        return;
    }

    if (!datos.figuritas.includes(figuritaId)) {
        datos.figuritas.push(figuritaId);
        localStorage.setItem('user_' + usuario, JSON.stringify(datos));
        alert(`�Felicitaciones! Obtuviste la figurita ${figuritaId} ??`);
    } else {
        alert("Ya tienes esta figurita ??");
    }

    mostrarAlbum();
}
