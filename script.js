// Simple functional layer using localStorage for demo purposes
// Real multi-user features would need a backend (Netlify Functions, Supabase, etc.)

document.addEventListener('DOMContentLoaded', () => {
  // View counter (local only for now)
  let views = parseInt(localStorage.getItem('gt_views') || '4821', 10);
  views += Math.floor(Math.random() * 3) + 1;
  localStorage.setItem('gt_views', views);
  document.getElementById('view-count').textContent = `Views: ${views.toLocaleString()}`;

  // Smooth nav highlighting
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section, .hero');

  function highlightNav() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (scrollY >= top) current = sec.getAttribute('id') || 'home';
    });
    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }
  window.addEventListener('scroll', highlightNav);
  highlightNav();

  // Ratings (local)
  document.querySelectorAll('.stars').forEach(starEl => {
    starEl.addEventListener('click', (e) => {
      const category = starEl.dataset.category;
      // Simple 1-5 based on click position approx
      const rect = starEl.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const rating = Math.min(5, Math.max(1, Math.ceil((x / rect.width) * 5)));
      starEl.textContent = '★'.repeat(rating) + '☆'.repeat(5 - rating);
      const scoreEl = document.getElementById(`score-${category}`) || document.getElementById('hole-score');
      if (scoreEl) {
        // Fake average update
        const current = parseFloat(scoreEl.textContent) || 4.5;
        const newAvg = ((current * 10 + rating) / 11).toFixed(1);
        scoreEl.textContent = newAvg;
      }
      localStorage.setItem(`gt_rating_${category}`, rating);
    });
  });

  // Degradation Log
  const logForm = document.getElementById('log-form');
  const logList = document.getElementById('log-entries');
  logForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = document.getElementById('log-text').value.trim();
    if (!text) return;
    const date = new Date().toISOString().slice(0, 10);
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `<span class="log-date">${date}</span><p>${escapeHtml(text)}</p>`;
    logList.prepend(entry);
    document.getElementById('log-text').value = '';
    // Persist simple
    const logs = JSON.parse(localStorage.getItem('gt_logs') || '[]');
    logs.unshift({ date, text });
    localStorage.setItem('gt_logs', JSON.stringify(logs.slice(0, 50)));
  });

  // Load saved logs
  try {
    const savedLogs = JSON.parse(localStorage.getItem('gt_logs') || '[]');
    savedLogs.forEach(l => {
      const entry = document.createElement('div');
      entry.className = 'log-entry';
      entry.innerHTML = `<span class="log-date">${l.date}</span><p>${escapeHtml(l.text)}</p>`;
      logList.appendChild(entry);
    });
  } catch {}

  // Tasks
  const taskForm = document.getElementById('task-form');
  const taskList = document.getElementById('task-list');
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = document.getElementById('task-input').value.trim();
    if (!text) return;
    const li = document.createElement('li');
    li.innerHTML = `${escapeHtml(text)} <button class="done-btn">Mark Done</button>`;
    taskList.prepend(li);
    document.getElementById('task-input').value = '';
    li.querySelector('.done-btn').addEventListener('click', () => li.remove());
  });

  // Existing done buttons
  document.querySelectorAll('.done-btn').forEach(btn => {
    btn.addEventListener('click', () => btn.parentElement.remove());
  });

  // Confessions
  const confForm = document.getElementById('confession-form');
  const confList = document.getElementById('confession-list');
  confForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = document.getElementById('confession-text').value.trim();
    if (!text) return;
    const div = document.createElement('div');
    div.className = 'confession';
    div.innerHTML = `<p>"${escapeHtml(text)}"</p><span class="meta">— George, ${new Date().toISOString().slice(0,10)}</span>`;
    confList.prepend(div);
    document.getElementById('confession-text').value = '';
  });

  // Chastity
  document.getElementById('chastity-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const val = document.getElementById('lock-select').value;
    const statusEl = document.getElementById('lock-days');
    if (val === 'unlocked') {
      statusEl.textContent = 'Unlocked today – reset timer';
      localStorage.setItem('gt_last_unlock', new Date().toISOString());
    } else {
      statusEl.textContent = 'Currently locked';
    }
  });

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
});
