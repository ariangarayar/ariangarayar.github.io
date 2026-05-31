const maquinas = [
  {
    id: "ica-1",
    nombre: "ICA: 1",
    plataforma: "VulnHub",
    dificultad: "Fácil",
    fecha: "30 mayo 2026",
    imagen: "assets/ast4-writeup-cover.png",
    foco: ["MySQL", "SSH", "SUID"],
    resumen:
      "Descubrimiento por ARP, puertos 22/80/3306, revisión de MySQL y escalada con un binario SUID que llama a cat.",
  },
  {
    id: "myexpense",
    nombre: "MyExpense: 1",
    plataforma: "VulnHub",
    dificultad: "Medio",
    fecha: "30 mayo 2026",
    imagen: "assets/ast4-writeup-cover.png",
    foco: ["XSS", "CSRF", "SQLi"],
    resumen:
      "Robo de sesión, activación de usuario con CSRF, abuso del flujo de reportes y SQL injection para obtener credenciales.",
  },
  {
    id: "blog",
    nombre: "Blog",
    plataforma: "TryHackMe",
    dificultad: "Fácil",
    fecha: "30 mayo 2026",
    imagen: "assets/ast4-writeup-cover.png",
    foco: ["WordPress", "WPScan", "SUID"],
    resumen:
      "Enumeración de WordPress, credenciales con WPScan, explotación con wp_crop_rce y root mediante /usr/sbin/checker.",
  },
  {
    id: "easy-peasy",
    nombre: "Easy Peasy",
    plataforma: "TryHackMe",
    dificultad: "Fácil",
    fecha: "30 mayo 2026",
    imagen: "assets/ast4-writeup-cover.png",
    foco: ["Fuzzing", "Hash", "Stego"],
    resumen:
      "Varios puertos web, directorios ocultos, cadenas codificadas, cracking con John, stegseek y escalada con pkexec.",
  },
  {
    id: "source",
    nombre: "Source",
    plataforma: "TryHackMe",
    dificultad: "Fácil",
    fecha: "30 mayo 2026",
    imagen: "assets/ast4-writeup-cover.png",
    foco: ["MiniServ", "Webmin", "Metasploit"],
    resumen:
      "Fingerprinting de MiniServ 1.890, búsqueda del exploit y ejecución del módulo correspondiente para obtener acceso root.",
  },
  {
    id: "basic-pentesting",
    nombre: "Basic Pentesting",
    plataforma: "TryHackMe",
    dificultad: "Fácil",
    fecha: "30 mayo 2026",
    imagen: "assets/ast4-writeup-cover.png",
    foco: ["SMB", "Hydra", "SSH"],
    resumen:
      "Enumeración web y SMB, usuarios Jan/Kay, fuerza bruta con Hydra, llave privada de Kay y passphrase con John.",
  },
  {
    id: "rootme",
    nombre: "RootMe",
    plataforma: "TryHackMe",
    dificultad: "Fácil",
    fecha: "30 mayo 2026",
    imagen: "assets/ast4-writeup-cover.png",
    foco: ["Upload", "Reverse shell", "SUID"],
    resumen:
      "Fuzzing de panel/uploads, bypass de extensión PHP usando PHAR, reverse shell y escalada con Python SUID.",
  },
  {
    id: "startup",
    nombre: "Startup",
    plataforma: "TryHackMe",
    dificultad: "Fácil",
    fecha: "30 mayo 2026",
    imagen: "assets/ast4-writeup-cover.png",
    foco: ["FTP", "PCAP", "Cron"],
    resumen:
      "FTP anónimo, subida de reverse shell, análisis de captura PCAP para obtener contraseña y abuso de script hacia root.",
  },
  {
    id: "chill-hack",
    nombre: "Chill Hack",
    plataforma: "TryHackMe",
    dificultad: "Medio",
    fecha: "30 mayo 2026",
    imagen: "assets/ast4-writeup-cover.png",
    foco: ["Bypass", "MySQL", "Docker"],
    resumen:
      "Consola web restringida, bypass de comandos, credenciales de base de datos, backup oculto y escalada vía Docker.",
  },
  {
    id: "conversor",
    nombre: "Conversor",
    plataforma: "Hack The Box",
    dificultad: "Medio",
    fecha: "30 mayo 2026",
    imagen: "assets/ast4-writeup-cover.png",
    foco: ["XSLT", "Cron", "needrestart"],
    resumen:
      "Análisis del código fuente, abuso de XML/XSLT para crear un script Python ejecutado por cron y root con needrestart.",
  },
];

const estado = {
  filtro: "todas",
  busqueda: new URLSearchParams(window.location.search).get("tag") || "",
};

const postFeed = document.querySelector("#postFeed");
const postSearch = document.querySelector("#postSearch");
const filterButtons = document.querySelectorAll(".filter-btn");
const recentList = document.querySelector("#recentList");

function escapar(valor) {
  return String(valor)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function urlWriteup(maquina) {
  return `writeup.html?id=${encodeURIComponent(maquina.id)}`;
}

function maquinasFiltradas() {
  const busqueda = normalizar(estado.busqueda.trim());

  return maquinas.filter((maquina) => {
    const coincideDificultad =
      estado.filtro === "todas" || maquina.dificultad === estado.filtro;
    const texto = normalizar(
      [
        maquina.nombre,
        maquina.plataforma,
        maquina.dificultad,
        maquina.resumen,
        ...maquina.foco,
      ].join(" "),
    );

    return coincideDificultad && (!busqueda || texto.includes(busqueda));
  });
}

function pintarPosts() {
  const filtradas = maquinasFiltradas();

  postFeed.innerHTML = filtradas.length
    ? filtradas
        .map(
          (maquina) => `
            <article class="feed-card">
              <a class="feed-link" href="${urlWriteup(maquina)}" target="_blank" rel="noreferrer">
                <div class="feed-copy">
                  <div class="post-meta">
                    <time>${escapar(maquina.fecha)}</time>
                    <span>${escapar(maquina.plataforma)}</span>
                    <span class="difficulty-pill" data-difficulty="${escapar(maquina.dificultad)}">${escapar(maquina.dificultad)}</span>
                  </div>
                  <h3>${escapar(maquina.nombre)}</h3>
                  <p>${escapar(maquina.resumen)}</p>
                  <div class="tag-row">
                    ${maquina.foco.map((tag) => `<span>${escapar(tag)}</span>`).join("")}
                  </div>
                </div>
                <figure class="feed-thumb">
                  <img src="${escapar(maquina.imagen)}" alt="Captura de la resolución ${escapar(maquina.nombre)}">
                </figure>
              </a>
            </article>
          `,
        )
        .join("")
    : `<div class="empty-state">No hay resoluciones con ese filtro.</div>`;
}

function pintarRecientes() {
  recentList.innerHTML = maquinas
    .slice(0, 6)
    .map(
      (maquina) => `
        <a href="${urlWriteup(maquina)}" target="_blank" rel="noreferrer">
          ${escapar(maquina.nombre)}
        </a>
      `,
    )
    .join("");
}

postSearch.addEventListener("input", (evento) => {
  estado.busqueda = evento.target.value;
  pintarPosts();
});

filterButtons.forEach((boton) => {
  boton.addEventListener("click", () => {
    estado.filtro = boton.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === boton));
    pintarPosts();
  });
});

postSearch.value = estado.busqueda;
pintarPosts();
pintarRecientes();
