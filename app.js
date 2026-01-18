/*
  Simple, local, static landing page app.
  - No build or server required
  - Edit the `links` array to add/remove shortcuts
*/

const LINKS_KEY = 'shortcut_links_v1';

const defaultLinks = [
  { name: 'Google', url: 'https://www.google.com', meta: 'Search' },
  { name: 'YouTube', url: 'https://www.youtube.com', meta: 'Video' },
  { name: 'GitHub', url: 'https://github.com', meta: 'Code' },
  { name: 'Twitter', url: 'https://twitter.com', meta: 'Social' },
  { name: 'Docs', url: 'https://docs.google.com', meta: 'Docs' },
  { name: 'Inbox', url: 'https://mail.google.com', meta: 'Mail' }
];

const app = {
  links: loadLinks(),
  init() {
    this.cache();
    this.render();
    this.bind();
  },
  cache() {
    this.$links = document.getElementById('links');
    this.$search = document.getElementById('search');
    this.$edit = document.getElementById('editBtn');
    this.$title = document.getElementById('title');
    this.$subtitle = document.getElementById('subtitle');
    this.$avatar = document.getElementById('avatar');
  },
  bind() {
    this.$search.addEventListener('input', e => this.render(e.target.value));
    this.$edit.addEventListener('click', () => {
      const txt = prompt('Edit links as JSON array (name,url,meta)', JSON.stringify(this.links, null, 2));
      if (!txt) return;
      try {
        const arr = JSON.parse(txt);
        if (Array.isArray(arr)) {
          this.links = arr;
          saveLinks(this.links);
          this.render(this.$search.value);
        } else alert('Harus array JSON');
      } catch (err) {
        alert('JSON tidak valid: ' + err.message);
      }
    });

    // keyboard quick open (1..9)
    window.addEventListener('keydown', (e) => {
      if (e.key >= '1' && e.key <= '9') {
        const idx = Number(e.key) - 1;
        if (this.links[idx]) openLink(this.links[idx].url);
      }
    });

    // support middle-click / long-press handled by normal anchor
  },
  render(filter = '') {
    const q = filter.trim().toLowerCase();
    this.$links.innerHTML = '';

    const list = this.links.filter(l => {
      if (!q) return true;
      return (l.name + ' ' + (l.meta||'') + ' ' + (l.url||'')).toLowerCase().includes(q);
    });

    if (list.length === 0) {
      this.$links.innerHTML = `<div class="item" style="cursor:default">
        <div class="info"><div class="name">Tidak ada hasil</div><div class="meta">Coba kata kunci lain</div></div>
      </div>`;
      return;
    }

    list.forEach((l, i) => {
      const a = document.createElement('a');
      a.className = 'item';
      a.href = l.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.innerHTML = `
        <div class="icon">${(l.name||'')[0] || '•'}</div>
        <div class="info">
          <div class="name">${escapeHtml(l.name)}</div>
          <div class="meta">${escapeHtml(l.meta || l.url)}</div>
        </div>
      `;
      a.addEventListener('click', (ev) => {
        // keep default behavior; allow quick analytics or hints here if needed
      });
      this.$links.appendChild(a);
    });
  }
};

function loadLinks(){
  try {
    const raw = localStorage.getItem(LINKS_KEY);
    if (raw) return JSON.parse(raw);
  } catch(_) {}
  saveLinks(defaultLinks);
  return defaultLinks;
}

function saveLinks(arr){
  try { localStorage.setItem(LINKS_KEY, JSON.stringify(arr)); } catch(_) {}
}

function openLink(url){
  window.open(url, '_blank', 'noopener');
}

function escapeHtml(s){
  return String(s || '').replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}

document.addEventListener('DOMContentLoaded', () => app.init());