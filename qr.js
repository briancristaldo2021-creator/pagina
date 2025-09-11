const codigosQR = {
    "fig1": 1,
    "fig2": 2,
    "fig3": 3,
    "fig4": 4,
    "fig5": 5
};

document.getElementById("btnScanQR").addEventListener("click", () => {
    iniciarScanner();
});

function iniciarScanner() {
    const qrReader = new Html5Qrcode("qr-reader");

    qrReader.start(
        { facingMode: { ideal: "environment" } }, // intenta usar trasera
        { fps: 10, qrbox: 250 },
        qrCodeMessage => {
            procesarQR(qrCodeMessage);
            qrReader.stop();
            document.getElementById('qr-reader').innerHTML = "<p>QR escaneado ✔</p>";
        },
        errorMessage => {
            // ignorar errores de lectura momentánea
        }
    ).catch(err => {
        // Si falla la trasera, usa la frontal
        qrReader.start(
            { facingMode: "user" },
            { fps:10, qrbox:250 },
            qrCodeMessage => {
                procesarQR(qrCodeMessage);
                qrReader.stop();
                document.getElementById('qr-reader').innerHTML = "<p>QR escaneado ✔</p>";
            }
        ).catch(e => alert("No se pudo acceder a la cámara. Usa celular o revisa permisos."));
    });
}

function procesarQR(qrCodeMessage) {
    const usuario = localStorage.getItem('usuarioActivo');
    if (!usuario) { alert("Debes iniciar sesión."); return; }

    const datos = JSON.parse(localStorage.getItem('user_' + usuario));
    let figuritaId = null;

    for (const [clave, id] of Object.entries(codigosQR)) {
        if (qrCodeMessage.includes(clave)) {
            figuritaId = id;
            break;
        }
    }

    if (!figuritaId) { alert("QR inválido ❌"); return; }

    if (!datos.figuritas.includes(figuritaId)) {
        datos.figuritas.push(figuritaId);
        localStorage.setItem('user_' + usuario, JSON.stringify(datos));
        alert(`¡Felicitaciones! Obtuviste la figurita ${figuritaId} 🎉`);
    } else {
        alert("Ya tienes esta figurita 📌");
    }

    mostrarAlbum(); // actualizar álbum
}
