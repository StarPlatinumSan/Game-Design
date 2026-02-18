(function () {
  const toc = document.getElementById("toc");
  const sections = Array.from(document.querySelectorAll(".section[id]"));
  const btnPrint = document.getElementById("btnPrint");
  const lastUpdated = document.getElementById("lastUpdated");
  const lastUpdated2 = document.getElementById("lastUpdated2");

  // Date MAJ
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const stamp = `${yyyy}-${mm}-${dd}`;
  if (lastUpdated) lastUpdated.textContent = stamp;
  if (lastUpdated2) lastUpdated2.textContent = stamp;

  // Print
  if (btnPrint) btnPrint.addEventListener("click", () => window.print());

  // TOC
  if (toc && sections.length) {
    const existingTargets = new Set(
      Array.from(toc.querySelectorAll("a[data-target]")).map((a) => a.dataset.target),
    );
    const frag = document.createDocumentFragment();
    sections.forEach((sec) => {
      if (existingTargets.has(sec.id)) return;
      const title = sec.getAttribute("data-title") || sec.querySelector("h2")?.textContent?.trim() || sec.id;
      const a = document.createElement("a");
      a.href = `#${sec.id}`;
      a.textContent = title;
      a.dataset.target = sec.id;
      frag.appendChild(a);
    });
    if (frag.childNodes.length) toc.appendChild(frag);
  }

  // Scroll spy
  const tocLinks = toc ? Array.from(toc.querySelectorAll("a")) : [];
  const byId = new Map(tocLinks.map((a) => [a.dataset.target, a]));
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const link = byId.get(entry.target.id);
        if (!link) return;
        tocLinks.forEach((a) => a.classList.remove("is-active"));
        link.classList.add("is-active");
      });
    },
    { threshold: 0.35 },
  );
  sections.forEach((sec) => obs.observe(sec));

  // Feature filter
  const filterButtons = Array.from(document.querySelectorAll(".segmented__btn"));
  const features = Array.from(document.querySelectorAll(".feature"));

  function applyFilter(tag) {
    features.forEach((f) => {
      const ft = f.getAttribute("data-tag");
      const show = tag === "all" ? true : ft === tag;
      f.style.display = show ? "" : "none";
    });
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      applyFilter(btn.dataset.filter || "all");
    });
  });

  applyFilter("all");
})();
