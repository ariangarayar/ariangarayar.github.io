const resoluciones = window.ast4Writeups || {};

function escapar(valor) {
  return String(valor)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function crearId(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizar(texto) {
  return texto
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

function tituloSeccion(linea) {
  const clave = normalizar(linea);
  const mapa = {
    conexion: "Conexión",
    reconocimiento: "Reconocimiento",
    explotacion: "Explotación",
    "explotacion 1": "Explotación 1",
    "explotacion 2": "Explotación 2",
    "explotacion 3": "Explotación 3",
    "escala de privilegios": "Escalada de privilegios",
    "escala de privlegios": "Escalada de privilegios",
    "escala de privlegio": "Escalada de privilegios",
  };

  return mapa[clave] || null;
}

function esPaso(linea) {
  return /^\d+\s*\.?\s*-\s*/.test(linea.trim());
}

function esComando(linea) {
  const texto = linea.trim();

  if (!texto) return false;
  if (/^(sudo|nmap|ping|mysql|show|select|use\s|wpscan|whatweb|msfdb|msfconsole|set\s|run$|shell$|script\s|find\s|strings\s|export\s|chmod\s|echo\s|hydra\s|john\s|ssh\s|ftp\s|put\s|nc\s|wget\s|docker\s|cat\s|ls\s|cd\s|whoami$|id$|python|python3|ffuf|wfuzz|gobuster|dirb|curl|sqlmap|stegseek|zip2john|ssh2john|nano\s)/i.test(texto)) {
    return true;
  }

  if (/^(\/|\.\/|http:\/\/|https:\/\/)/i.test(texto)) return true;
  if (/[;&|]{1,2}/.test(texto) && /\s/.test(texto)) return true;

  return false;
}

function parsearTextoNotion(texto, titulo) {
  const lineas = texto
    .split(/\r?\n/)
    .map((linea) => linea.trim())
    .filter(Boolean);

  if (normalizar(lineas[0] || "") === normalizar(titulo)) {
    lineas.shift();
  }

  const secciones = [];
  let seccionActual = null;
  let pasoActual = null;

  function cerrarPaso() {
    if (pasoActual && seccionActual) {
      seccionActual.pasos.push(pasoActual);
    }
    pasoActual = null;
  }

  function abrirSeccion(tituloSeccionActual) {
    cerrarPaso();
    seccionActual = {
      id: crearId(tituloSeccionActual),
      titulo: tituloSeccionActual,
      intro: [],
      pasos: [],
    };
    secciones.push(seccionActual);
  }

  lineas.forEach((linea) => {
    const nuevaSeccion = tituloSeccion(linea);

    if (nuevaSeccion) {
      abrirSeccion(nuevaSeccion);
      return;
    }

    if (!seccionActual) {
      abrirSeccion("Notas iniciales");
    }

    if (esPaso(linea)) {
      cerrarPaso();
      pasoActual = {
        titulo: linea,
        lineas: [],
      };
      return;
    }

    if (pasoActual) {
      pasoActual.lineas.push(linea);
    } else {
      seccionActual.intro.push(linea);
    }
  });

  cerrarPaso();
  return secciones;
}

function contarPasos(secciones) {
  return secciones.reduce((total, seccion) => total + seccion.pasos.length, 0);
}

function imagenesParaPaso(imagenes, totalPasos, indicePaso, cursor) {
  if (!totalPasos || !imagenes.length) return { imagenesPaso: [], siguienteCursor: cursor };

  const limite = Math.round(((indicePaso + 1) * imagenes.length) / totalPasos);
  return {
    imagenesPaso: imagenes.slice(cursor, limite),
    siguienteCursor: limite,
  };
}

function renderLineas(lineas) {
  const partes = [];
  let bloqueCodigo = [];

  function cerrarCodigo() {
    if (!bloqueCodigo.length) return;
    partes.push(`<pre class="notion-code"><code>${bloqueCodigo.map(escapar).join("\n")}</code></pre>`);
    bloqueCodigo = [];
  }

  lineas.forEach((linea) => {
    if (esComando(linea)) {
      bloqueCodigo.push(linea);
      return;
    }

    cerrarCodigo();
    partes.push(`<p>${escapar(linea)}</p>`);
  });

  cerrarCodigo();
  return partes.join("");
}

function renderImagenes(imagenes, titulo, pasoTitulo) {
  return imagenes
    .map(
      (src, indice) => `
        <figure class="article-image">
          <img src="${escapar(src)}" alt="Captura ${indice + 1} de ${escapar(titulo)}">
          <figcaption>${escapar(pasoTitulo)}</figcaption>
        </figure>
      `,
    )
    .join("");
}

const parametros = new URLSearchParams(window.location.search);
const actual = resoluciones[parametros.get("id")] || resoluciones["ica-1"];
const secciones = parsearTextoNotion(actual.texto, actual.titulo);
const totalPasos = contarPasos(secciones);
let indicePasoGlobal = 0;
let cursorImagen = 0;

document.title = `Ast4 | ${actual.titulo}`;
document.querySelector("#writeupPlatform").textContent = actual.plataforma;
document.querySelector("#writeupTitle").textContent = actual.titulo;
document.querySelector("#writeupSummary").textContent = actual.resumen;
document.querySelector("#writeupScenario").textContent =
  "Resolución documentada paso por paso, manteniendo el orden de escritura, comandos y capturas técnicas.";
document.querySelector("#writeupCategory").textContent = `${actual.plataforma} / Laboratorio`;
document.querySelector("#writeupDifficulty").textContent = actual.dificultad;
document.querySelector("#writeupDifficulty").dataset.difficulty = actual.dificultad;
document.querySelector("#writeupFocus").textContent = actual.foco.join(" / ");

document.querySelector("#solutionFlow").innerHTML = secciones
  .map((seccion, indiceSeccion) => {
    const seccionId = `${indiceSeccion + 1}-${seccion.id}`;
    const pasos = seccion.pasos
      .map((paso, indicePasoSeccion) => {
        const imagenesAsignadas = imagenesParaPaso(
          actual.imagenes,
          totalPasos,
          indicePasoGlobal,
          cursorImagen,
        );
        const numero = String(indicePasoSeccion + 1).padStart(2, "0");
        const pasoId = crearId(`${seccionId}-${paso.titulo}`);

        cursorImagen = imagenesAsignadas.siguienteCursor;
        indicePasoGlobal += 1;

        return `
          <article class="notion-step" id="${escapar(pasoId)}">
            <h3>
              <span>${numero}</span>
              ${escapar(paso.titulo)}
            </h3>
            <div class="notion-step-body">
              ${renderLineas(paso.lineas)}
              ${renderImagenes(imagenesAsignadas.imagenesPaso, actual.titulo, paso.titulo)}
            </div>
          </article>
        `;
      })
      .join("");

    return `
      <details class="solution-section" id="${escapar(seccionId)}">
        <summary>
          <h2>${escapar(seccion.titulo)}</h2>
          <span class="section-count">${seccion.pasos.length} ${seccion.pasos.length === 1 ? "paso" : "pasos"}</span>
        </summary>
        <div class="solution-section-body">
          ${seccion.intro.length ? `<div class="section-intro">${renderLineas(seccion.intro)}</div>` : ""}
          <div class="notion-steps">
            ${pasos}
          </div>
        </div>
      </details>
    `;
  })
  .join("");

if (cursorImagen < actual.imagenes.length) {
  document.querySelector("#solutionFlow").insertAdjacentHTML(
    "beforeend",
    `
      <details class="solution-section" id="capturas-extra">
        <summary>
          <h2>Capturas adicionales</h2>
          <span class="section-count">${actual.imagenes.length - cursorImagen} capturas</span>
        </summary>
        <div class="solution-section-body">
          ${renderImagenes(actual.imagenes.slice(cursorImagen), actual.titulo, "Captura adicional")}
        </div>
      </details>
    `,
  );
}

document.querySelector("#contentsNav").innerHTML = [
  { id: "escenario", titulo: "Escenario" },
  ...secciones.map((seccion, indice) => ({ id: `${indice + 1}-${seccion.id}`, titulo: seccion.titulo })),
]
  .map((item) => `<a href="#${escapar(item.id)}">${escapar(item.titulo)}</a>`)
  .join("");

function abrirSeccionDesdeHash() {
  const id = decodeURIComponent(window.location.hash.slice(1));
  const seccion = id ? document.getElementById(id) : null;

  if (seccion?.matches("details.solution-section")) {
    seccion.open = true;
  }
}

document.querySelector("#contentsNav").addEventListener("click", (evento) => {
  const enlace = evento.target.closest("a");
  const destino = enlace ? document.querySelector(enlace.getAttribute("href")) : null;

  if (destino?.matches("details.solution-section")) {
    destino.open = true;
  }
});

window.addEventListener("hashchange", abrirSeccionDesdeHash);
abrirSeccionDesdeHash();

document.querySelector("#writeupTags").innerHTML = actual.foco
  .map((tag) => `<span>${escapar(tag)}</span>`)
  .join("");
