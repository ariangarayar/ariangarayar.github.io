const etiquetas = [
  "Bypass",
  "Cron",
  "CSRF",
  "Docker",
  "FTP",
  "Fuzzing",
  "Hash",
  "Hydra",
  "Metasploit",
  "MiniServ",
  "MySQL",
  "needrestart",
  "PCAP",
  "Reverse shell",
  "SMB",
  "SQLi",
  "SSH",
  "Stego",
  "SUID",
  "Upload",
  "Webmin",
  "WordPress",
  "WPScan",
  "XSLT",
  "XSS",
];

const tagDirectory = document.querySelector("#tagDirectory");
const tagSearch = document.querySelector("#tagSearch");
const tagEmpty = document.querySelector("#tagEmpty");

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

function pintarEtiquetas() {
  const busqueda = normalizar(tagSearch.value.trim());
  const filtradas = etiquetas.filter((etiqueta) => normalizar(etiqueta).includes(busqueda));

  tagDirectory.innerHTML = filtradas
    .map(
      (etiqueta) => `
        <a class="tag-directory-link" href="index.html?tag=${encodeURIComponent(etiqueta)}#writeups">
          <span>${escapar(etiqueta)}</span>
          <small>Ver máquinas</small>
        </a>
      `,
    )
    .join("");

  tagEmpty.hidden = filtradas.length > 0;
}

tagSearch.addEventListener("input", pintarEtiquetas);
pintarEtiquetas();
