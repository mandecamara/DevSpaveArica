// Affiche le prochain événement et les sessions passées depuis events.json
const fr = d => new Date(d + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt) e.textContent = txt; return e; };

fetch("events.json", { cache: "no-store" }).then(r => r.json()).then(data => {
  const box = document.getElementById("live-box"), past = document.getElementById("passes");
  const today = new Date().toISOString().slice(0, 10);
  const n = data.prochain;
  const upcoming = n && n.titre && n.date >= today;
  const archive = [...(data.passes || [])];
  if (n && n.titre && n.date < today) archive.unshift(n);
  box.innerHTML = "";
  if (upcoming) {
    const left = el("div");
    left.append(el("div", "tag", "Prochaine session"), el("h3", "", n.titre), el("p", "", n.description || ""), el("br"));
    if (n.lien && !n.lien.startsWith("REMPLACER")) { const a = el("a", "btn", "S'inscrire gratuitement"); a.href = n.lien; a.target = "_blank"; a.rel = "noopener"; left.append(a); }
    const ul = el("ul");
    [["Date", fr(n.date)], ["Heure", n.debut && n.fin ? n.debut.replace(":", "h") + " à " + n.fin.replace(":", "h") + " (Conakry, GMT)" : ""], ["Lieu", n.lieu], ["Accès", "gratuit"]].forEach(([k, v]) => { if (!v) return; const li = el("li"); li.append(el("b", "", k), document.createTextNode(" : " + v)); ul.append(li); });
    box.append(left, ul);
  } else {
    const left = el("div");
    left.append(el("div", "tag", "Prochaine session"), el("h3", "", "Prochaine date bientôt annoncée"), el("p", "", "Rejoignez le groupe WhatsApp pour être prévenu(e) en premier."), el("br"));
    const a = el("a", "btn", "Rejoindre la communauté"); a.href = "#rejoindre"; left.append(a);
    box.append(left);
    box.style.gridTemplateColumns = "1fr";
  }
  if (upcoming) {
    const ld = { "@context": "https://schema.org", "@type": "Event", name: "DevSpace Live : " + n.titre, description: n.description,
      startDate: n.date + "T" + (n.debut || "20:30") + ":00+00:00", endDate: n.date + "T" + (n.fin || "21:30") + ":00+00:00",
      eventStatus: "https://schema.org/EventScheduled", eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
      location: { "@type": "VirtualLocation", url: location.origin + "/" }, isAccessibleForFree: true, inLanguage: "fr",
      organizer: { "@type": "Organization", name: "DevSpace Africa", url: location.origin + "/" },
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock", url: n.lien && !n.lien.startsWith("REMPLACER") ? n.lien : location.origin + "/" } };
    const s = document.createElement("script"); s.type = "application/ld+json"; s.textContent = JSON.stringify(ld); document.head.append(s);
  }
  if (archive.length) {
    past.append(el("h3", "", "Sessions précédentes"));
    const g = el("div", "grid");
    archive.forEach(p => { const c = el("div", "card"); c.append(el("h3", "", p.titre), el("p", "", fr(p.date) + (p.description ? " · " + p.description : ""))); if (p.slug) { const a = el("a", "", "Lire le résumé"); a.href = "live/" + p.slug + ".html"; a.style.cssText = "display:inline-block;margin-top:10px;font-weight:600"; c.append(a); } g.append(c); });
    past.append(g);
  }
}).catch(() => { document.getElementById("live-box").textContent = "Programme indisponible pour le moment."; });
