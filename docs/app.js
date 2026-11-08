// Language toggle (Arabic ⇄ English), live download links from the latest release, InstaPay copy.
(function () {
  const html = document.documentElement;
  const nodes = [...document.querySelectorAll("[data-en]")];
  nodes.forEach((n) => (n.dataset.ar = n.innerHTML));
  const titles = { ar: document.title, en: "Screenmo — Capture · Edit · Share" };

  function setLang(l) {
    html.lang = l;
    html.dir = l === "ar" ? "rtl" : "ltr";
    nodes.forEach((n) => (n.innerHTML = l === "ar" ? n.dataset.ar : n.dataset.en));
    document.getElementById("lang").textContent = l === "ar" ? "EN" : "عربي";
    document.title = titles[l];
    try { localStorage.setItem("smo-lang", l); } catch (e) {}
  }
  let saved = null;
  try { saved = localStorage.getItem("smo-lang"); } catch (e) {}
  // Arabic by default; English only when the visitor picked it (or ?lang=en)
  const q = new URLSearchParams(location.search).get("lang");
  if ((q || saved) === "en") setLang("en");
  document.getElementById("lang").onclick = () => setLang(html.lang === "ar" ? "en" : "ar");

  document.getElementById("yr").textContent = new Date().getFullYear();

  document.querySelectorAll(".copy").forEach((b) => {
    b.onclick = async () => {
      try { await navigator.clipboard.writeText(b.dataset.num); } catch (err) {}
      b.textContent = html.lang === "ar" ? "تم ✓" : "Copied ✓";
      setTimeout(() => (b.innerHTML = html.lang === "ar" ? b.dataset.ar : b.dataset.en), 1600);
    };
  });

  // newest public release → direct download links
  fetch("https://api.github.com/repos/iegy/smo/releases/latest")
    .then((r) => (r.ok ? r.json() : null))
    .then((rel) => {
      if (!rel || !rel.assets) return;
      document.getElementById("ver").textContent = (rel.tag_name || "").replace(/^v/, "");
      const find = (re) => rel.assets.find((a) => re.test(a.name));
      const setup = find(/-setup\.exe$/), port = find(/portable\.zip$/), ext = find(/extension\.zip$/);
      if (setup) {
        document.getElementById("dlSetup").href = setup.browser_download_url;
        document.getElementById("heroDl").href = setup.browser_download_url;
      }
      if (port) document.getElementById("dlPortable").href = port.browser_download_url;
      if (ext) document.getElementById("dlExt").href = ext.browser_download_url;
    })
    .catch(() => {});
})();
