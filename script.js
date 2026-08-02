(function () {
  "use strict";

  // ---------- Helpers ----------
  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return document.querySelectorAll(sel); }
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function load(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  }
  function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // ---------- View counter ----------
  let views = parseInt(localStorage.getItem("gt_views") || "4821", 10);
  views += Math.floor(Math.random() * 4) + 1;
  localStorage.setItem("gt_views", views);
  $("#viewCounter").textContent = views.toLocaleString() + " views";

  // ---------- Navigation highlight ----------
  const navItems = $$(".nav-item");
  const sections = $$(".section, .hero");

  function updateNav() {
    let current = "top";
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 90) {
        current = sec.id || "top";
      }
    });
    navItems.forEach(item => {
      const href = item.getAttribute("href").slice(1);
      item.classList.toggle("active", href === current);
    });
  }
  window.addEventListener("scroll", updateNav, { passive: true });
  updateNav();

  // ---------- Ratings ----------
  $$(".rating-card").forEach(card => {
    const key = card.dataset.key;
    const starsEl = card.querySelector(".stars");
    const scoreEl = card.querySelector(".score");

    // restore previous rating if any
    const saved = localStorage.getItem("gt_rating_" + key);
    if (saved) {
      const r = parseInt(saved, 10);
      starsEl.textContent = "★".repeat(r) + "☆".repeat(5 - r);
      starsEl.dataset.value = r;
    }

    starsEl.addEventListener("click", e => {
      const rect = starsEl.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      const rating = Math.min(5, Math.max(1, Math.ceil(ratio * 5)));
      starsEl.textContent = "★".repeat(rating) + "☆".repeat(5 - rating);
      starsEl.dataset.value = rating;
      localStorage.setItem("gt_rating_" + key, rating);

      // simple moving average display
      const prev = parseFloat(scoreEl.textContent) || 4.5;
      const next = ((prev * 12 + rating) / 13).toFixed(1);
      scoreEl.textContent = next;
    });
  });

  // ---------- Degradation Log ----------
  const logList = $("#logList");
  const logForm = $("#logForm");
  const logInput = $("#logInput");

  function renderLogs() {
    const logs = load("gt_logs", [
      { date: "2026-08-02", text: "Site created. George has permanently exposed himself. First public entry." }
    ]);
    logList.innerHTML = logs.map(l => `
      <div class="entry">
        <span class="date">${escapeHtml(l.date)}</span>
        <p>${escapeHtml(l.text)}</p>
      </div>
    `).join("");
  }
  renderLogs();

  logForm.addEventListener("submit", e => {
    e.preventDefault();
    const text = logInput.value.trim();
    if (!text) return;
    const logs = load("gt_logs", []);
    logs.unshift({ date: new Date().toISOString().slice(0, 10), text });
    save("gt_logs", logs.slice(0, 40));
    logInput.value = "";
    renderLogs();
  });

  // ---------- Tasks ----------
  const taskList = $("#taskList");
  const taskForm = $("#taskForm");
  const taskInput = $("#taskInput");

  function renderTasks() {
    const tasks = load("gt_tasks", [
      "Wear pink panties under normal clothes for a full day and report back.",
      "Post a new locked photo within 48 hours."
    ]);
    taskList.innerHTML = tasks.map((t, i) => `
      <li data-index="${i}">
        <span>${escapeHtml(t)}</span>
        <button type="button" class="done">Mark Done</button>
      </li>
    `).join("");

    taskList.querySelectorAll(".done").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.parentElement.dataset.index, 10);
        const tasks = load("gt_tasks", []);
        tasks.splice(idx, 1);
        save("gt_tasks", tasks);
        renderTasks();
      });
    });
  }
  renderTasks();

  taskForm.addEventListener("submit", e => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (!text) return;
    const tasks = load("gt_tasks", []);
    tasks.unshift(text);
    save("gt_tasks", tasks.slice(0, 30));
    taskInput.value = "";
    renderTasks();
  });

  // ---------- Confessions ----------
  const confessionList = $("#confessionList");
  const confessionForm = $("#confessionForm");
  const confessionInput = $("#confessionInput");

  function renderConfessions() {
    const confs = load("gt_confessions", [
      { date: "2026-08-02", text: "I get hard just thinking about strangers looking at my locked cage and ruined makeup." }
    ]);
    confessionList.innerHTML = confs.map(c => `
      <div class="confession">
        <p>"${escapeHtml(c.text)}"</p>
        <span class="meta">— George, ${escapeHtml(c.date)}</span>
      </div>
    `).join("");
  }
  renderConfessions();

  confessionForm.addEventListener("submit", e => {
    e.preventDefault();
    const text = confessionInput.value.trim();
    if (!text) return;
    const confs = load("gt_confessions", []);
    confs.unshift({ date: new Date().toISOString().slice(0, 10), text });
    save("gt_confessions", confs.slice(0, 30));
    confessionInput.value = "";
    renderConfessions();
  });

  // ---------- Chastity ----------
  const lockText = $("#lockText");
  const lockMeta = $("#lockMeta");
  const chastityForm = $("#chastityForm");
  const lockSelect = $("#lockSelect");

  function updateLockUI() {
    const last = localStorage.getItem("gt_last_unlock");
    if (last) {
      const d = new Date(last);
      lockMeta.textContent = "Last unlock: " + d.toLocaleDateString() + " " + d.toLocaleTimeString();
    } else {
      lockMeta.textContent = "Last unlock: never recorded";
    }
  }
  updateLockUI();

  chastityForm.addEventListener("submit", e => {
    e.preventDefault();
    if (lockSelect.value === "unlocked") {
      localStorage.setItem("gt_last_unlock", new Date().toISOString());
      lockText.textContent = "Unlocked today – timer reset";
    } else {
      lockText.textContent = "Currently locked";
    }
    updateLockUI();
  });

  // ---------- Copy buttons ----------
  $("#copyLink").addEventListener("click", () => {
    navigator.clipboard.writeText($("#siteUrl").textContent).then(() => {
      $("#copyLink").textContent = "Copied!";
      setTimeout(() => { $("#copyLink").textContent = "Copy Link"; }, 1800);
    });
  });

  $("#copyBanner").addEventListener("click", () => {
    navigator.clipboard.writeText($("#bannerCode").value).then(() => {
      $("#copyBanner").textContent = "Copied!";
      setTimeout(() => { $("#copyBanner").textContent = "Copy Banner Code"; }, 1800);
    });
  });
})();
