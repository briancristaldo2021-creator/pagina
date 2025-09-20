document.addEventListener("DOMContentLoaded", () => {
    const usuarioActivo = localStorage.getItem("usuarioActivo");
    if (!usuarioActivo) {
        window.location.href = "index.html";
        return;
    }

    document.getElementById("usuarioActivo").innerHTML =
        '<span style="color: green;">??</span> ' + usuarioActivo;

    const key = "user_" + usuarioActivo;
    const datos = JSON.parse(localStorage.getItem(key)) || {};
    datos.figuritas = datos.figuritas || [];

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

    const btnPremio = document.getElementById("btnReiniciar");
    btnPremio.addEventListener("click", () => {
        if (datos.figuritas.length === figuritasData.length) {
            mostrarCelebracionMaxima();
        } else {
            mostrarToast("Aún no completaste el álbum, ¡sigue buscando los QR! ??", "orange");
        }
    });

    function actualizarContador() {
        document.getElementById("contador").textContent = 
            `${datos.figuritas.length} / ${figuritasData.length} figuritas`;
    }

    window.actualizarContador = actualizarContador;

    // ===============================
    // Overlay Super Festejo
    // ===============================
    function mostrarCelebracionMaxima() {
        const overlay = document.getElementById("completado-overlay");
        overlay.innerHTML = `
            <h1>?? ¡FELICIDADES! ??</h1>
            <p>¡Completaste tu Álbum!</p>
            <p style="font-size:2rem; color:yellow;">Tu premio: <b>CODIGO1234</b></p>
            <canvas id="confeti"></canvas>
            <canvas id="fuegos"></canvas>
            <audio id="musica" src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" autoplay></audio>
        `;
        overlay.classList.add("visible");
        iniciarConfeti();
        iniciarFuegosArtificiales();

        setTimeout(() => {
            overlay.classList.remove("visible");
            overlay.innerHTML = '';
        }, 25000);
    }

    // -------------------------------
    // Confeti
    function iniciarConfeti() {
        const canvas = document.getElementById("confeti");
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext("2d");

        const confeti = [];
        for (let i = 0; i < 200; i++) {
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

    // -------------------------------

    // Fuegos artificiales
    function iniciarFuegosArtificiales() {
        const canvas = document.getElementById("fuegos");
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext("2d");

        const cohetes = [];

        function crearCohete() {
            cohetes.push({
                x: Math.random() * canvas.width,
                y: canvas.height,
                vx: Math.random() * 4 - 2,
                vy: -(Math.random() * 8 + 6),
                color: `hsl(${Math.random() * 360},100%,50%)`,
                exploded: false,
                particles: []
            });
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (Math.random() < 0.05) crearCohete();

            cohetes.forEach(c => {
                if (!c.exploded) {
                    c.x += c.vx;
                    c.y += c.vy;
                    ctx.beginPath();
                    ctx.arc(c.x, c.y, 3, 0, Math.PI * 2);
                    ctx.fillStyle = c.color;
                    ctx.fill();

                    if (c.vy >= 0) {
                        c.exploded = true;
                        for (let i = 0; i < 50; i++) {
                            c.particles.push({
                                x: c.x,
                                y: c.y,
                                vx: Math.random() * 6 - 3,
                                vy: Math.random() * 6 - 3,
                                color: `hsl(${Math.random() * 360},100%,50%)`,
                                life: 60
                            });
                        }
                    } else c.vy += 0.2;
                } else {
                    c.particles.forEach(p => {
                        p.x += p.vx;
                        p.y += p.vy;
                        p.vy += 0.1;
                        p.life--;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, 2, 0, Math.PI*2);
                        ctx.fillStyle = p.color;
                        ctx.fill();
                    });
                    c.particles = c.particles.filter(p => p.life > 0);
                }
            });

            requestAnimationFrame(draw);
        }

        draw();
    }

    // -------------------------------
    // Botón logout
    document.getElementById("btnLogout").addEventListener("click", () => {
        localStorage.removeItem("usuarioActivo");
        window.location.href = "index.html";
    });

    // Toast
    function mostrarToast(msg, color = "#00ffff") {
        const toast = document.getElementById("toast");
        toast.textContent = msg;
        toast.style.color = color;
        toast.classList.add("visible");
        setTimeout(() => toast.classList.remove("visible"), 3000);
    }

    // Tooltip ayuda
    const btnAyuda = document.getElementById('btnAyuda');
    const tooltipAyuda = document.getElementById('tooltipAyuda');

    btnAyuda.addEventListener('click', () => {
        tooltipAyuda.style.display = (tooltipAyuda.style.display === 'block') ? 'none' : 'block';
    });

    window.addEventListener('click', (e) => {
        if (!btnAyuda.contains(e.target) && !tooltipAyuda.contains(e.target)) {
            tooltipAyuda.style.display = 'none';
        }
    });
});
