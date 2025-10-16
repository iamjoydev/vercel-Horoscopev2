/* lightweight embed that fetches /api/horoscope and renders simple html */
(async function(){
  const endpoint = window.__HORO_ENDPOINT__ || "/api/horoscope";
  try {
    const r = await fetch(endpoint);
    if (!r.ok) { document.body.insertAdjacentHTML("afterbegin","<div>Horoscope load failed</div>"); return; }
    const data = await r.json();
    const container = document.createElement("div");
    container.style.maxWidth="700px";
    container.style.margin="12px auto";
    container.style.padding="12px";
    container.style.background="#fff";
    container.style.border="1px solid #eee";
    container.innerHTML = `<h3>à¦°à¦¾à¦¶à¦¿à¦«à¦² â€” ${data.date}</h3><pre>${JSON.stringify(data, null, 2)}</pre>`;
    document.body.insertBefore(container, document.body.firstChild);
  } catch (e) {
    console.warn(e);
  }
})();