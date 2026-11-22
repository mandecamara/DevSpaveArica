// 1) Crée une clé gratuite sur https://web3forms.com (avec l'e-mail qui doit recevoir les messages) et colle-la ici.
const ACCESS_KEY = "9eb0e8e9-4273-4b1d-87ec-17a7260f2e34";

const menu = document.querySelector(".menu"), links = document.querySelector(".links");
menu.addEventListener("click", () => links.classList.toggle("open"));
links.addEventListener("click", e => { if (e.target.tagName === "A") links.classList.remove("open"); });

const tabs = document.querySelectorAll(".tab"), panels = document.querySelectorAll(".panel");
function show(id) {
  tabs.forEach(t => t.setAttribute("aria-selected", t.dataset.p === id));
  panels.forEach(p => p.classList.toggle("on", p.id === id));
}
tabs.forEach(t => t.addEventListener("click", () => show(t.dataset.p)));
document.querySelectorAll("[data-open]").forEach(a => a.addEventListener("click", () => show(a.dataset.open)));
if (location.hash && document.getElementById(location.hash.slice(1))?.classList.contains("panel")) show(location.hash.slice(1));

document.querySelectorAll("form").forEach(f => {
  f.addEventListener("submit", async e => {
    e.preventDefault();
    const msg = f.querySelector(".msg"), btn = f.querySelector("button[type=submit]");
    if (f.querySelector(".hp input").value) return; // anti-spam
    if (ACCESS_KEY.startsWith("COLLE")) { msg.className = "msg err"; msg.textContent = "Le formulaire n'est pas encore configuré (clé manquante)."; return; }
    const data = new FormData(f);
    data.append("access_key", ACCESS_KEY);
    data.append("from_name", "Site DevSpace Africa");
    btn.disabled = true; btn.textContent = "Envoi en cours...";
    try {
      const r = await fetch("https://api.web3forms.com/submit", { method: "POST", body: data });
      const j = await r.json();
      if (j.success) { f.reset(); msg.className = "msg ok"; msg.textContent = "Merci, votre message a bien été envoyé. Nous vous répondons rapidement."; }
      else throw new Error();
    } catch { msg.className = "msg err"; msg.textContent = "Envoi impossible. Réessayez ou écrivez-nous directement par e-mail."; }
    btn.disabled = false; btn.textContent = "Envoyer";
  });
});
