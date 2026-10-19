/* Galeri video - OTOMATIS
   Cara termudah: beri nama video kamu  video1.mp4, video2.mp4, video3.mp4 ...
   lalu taruh di folder  videos/  . Program akan menemukannya sendiri.
   (Opsional) daftar manual & link Instagram ada di videos/videos.js */
(function () {
  const $ = (s) => document.querySelector(s);
  const gallery = $('#gallery'), modal = $('#vmodal'), player = $('#vplayer'), frame = $('#vframe');
  const vtitle = $('#vtitle'), vopen = $('#vopen');

  const IG_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4ZM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4ZM7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 1.8A3.2 3.2 0 0 0 3.8 7v10A3.2 3.2 0 0 0 7 20.2h10a3.2 3.2 0 0 0 3.2-3.2V7A3.2 3.2 0 0 0 17 3.8Z"/></svg>';
  const fmt = (s) => (isFinite(s) ? Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0') : '');
  const enc = (p) => p.split('/').map(encodeURIComponent).join('/');

  const videos = [];       // semua video yang sudah ditemukan
  const seen = new Set();  // cegah dobel
  let current = 0;

  // ---------- status ----------
  const status = document.createElement('div');
  status.className = 'vnone';
  status.textContent = 'Mencari video...';
  gallery.appendChild(status);

  // ---------- Instagram ----------
  function igParse(url) {
    const m = String(url).match(/instagram\.com\/(?:[^\/?#]+\/)?(reels?|p|tv)\/([A-Za-z0-9_-]+)/i);
    if (!m) return null;
    const kind = m[1].toLowerCase().startsWith('reel') ? 'reel' : m[1].toLowerCase();
    const base = 'https://www.instagram.com/' + kind + '/' + m[2] + '/';
    return { page: base, embed: base + 'embed' };
  }

  // ---------- tambah satu video ke galeri ----------
  function add(v) {
    const key = v.type === 'ig' ? v.embed : v.path;
    if (seen.has(key)) return;
    seen.add(key);
    if (status.parentNode) status.remove();
    const i = videos.push(v) - 1;

    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'vcard';
    card.setAttribute('aria-label', 'Putar video: ' + v.title);
    const thumb = document.createElement('div');
    thumb.className = 'vthumb';

    if (v.type === 'ig') {
      thumb.classList.add('ig');
      thumb.innerHTML = IG_ICON + '<span class="vtag">Instagram</span><div class="vplay"><i>▶</i></div>';
    } else {
      let media;
      if (v.poster) {
        media = document.createElement('img');
        media.src = enc(v.poster); media.alt = ''; media.loading = 'lazy';
      } else {
        media = document.createElement('video');
        media.src = enc(v.path) + '#t=0.5';
        media.preload = 'metadata'; media.muted = true; media.playsInline = true;
      }
      const dur = document.createElement('span');
      dur.className = 'vdur';
      dur.textContent = fmt(v.duration);
      const play = document.createElement('div');
      play.className = 'vplay';
      play.innerHTML = '<i>▶</i>';
      thumb.append(media, play, dur);
    }
    const cap = document.createElement('div');
    cap.className = 'vcap';
    cap.textContent = v.title;
    card.append(thumb, cap);
    card.onclick = () => open(i);
    gallery.appendChild(card);
  }

  // ---------- cek apakah file video ada ----------
  function probe(url) {
    return new Promise((resolve) => {
      const el = document.createElement('video');
      let done = false;
      const end = (ok) => {
        if (done) return;
        done = true;
        const d = el.duration;
        el.removeAttribute('src'); el.load();
        resolve(ok ? { duration: d } : null);
      };
      el.preload = 'metadata'; el.muted = true;
      el.onloadedmetadata = () => end(true);
      el.onerror = () => end(false);
      setTimeout(() => end(false), 6000);
      el.src = enc(url);
    });
  }

  // ---------- 1) daftar manual (videos/videos.js) ----------
  const manual = Array.isArray(window.VIDEOS) ? window.VIDEOS : [];
  const auto = Array.isArray(window.VIDEOS_AUTO) ? window.VIDEOS_AUTO : [];
  manual.concat(auto).forEach((v, n) => {
    if (v.instagram) {
      const ig = igParse(v.instagram);
      if (ig) add({ type: 'ig', title: v.title || 'Reel Instagram ' + (n + 1), embed: ig.embed, page: ig.page });
    } else if (v.file) {
      const path = v.file.includes('/') ? v.file : 'videos/' + v.file;
      add({ type: 'mp4', title: v.title || v.file.replace(/\.mp4$/i, ''), path, poster: v.poster ? (v.poster.includes('/') ? v.poster : 'videos/' + v.poster) : null });
    }
  });

  // ---------- 2) cari otomatis: video1.mp4, video2.mp4, ... ----------
  const folders = ['videos', 'vidios', 'video', 'vidio', '.'];
  const prefixes = ['video', 'vidio'];
  const tasks = [];
  folders.forEach((f) => prefixes.forEach((p) => {
    tasks.push((async () => {
      let miss = 0;
      for (let n = 1; n <= 50 && miss < 2; n++) {
        const path = (f === '.' ? '' : f + '/') + p + n + '.mp4';
        const r = await probe(path);
        if (r) { miss = 0; add({ type: 'mp4', title: 'Video ' + n, path, duration: r.duration }); }
        else miss++;
      }
    })());
  }));

  Promise.all(tasks).then(() => {
    if (videos.length) return;
    const onFile = location.protocol === 'file:';
    status.innerHTML =
      '<b>Video belum ditemukan.</b><br><br>' +
      'Ubah nama file video kamu menjadi <code>video1.mp4</code> (video kedua: <code>video2.mp4</code>, dst), ' +
      'lalu taruh di folder <code>videos</code> yang sejajar dengan <code>index.html</code>, lalu refresh (Ctrl+F5).' +
      (onFile ? '<br><br>Tips: jalankan lewat Live Server (klik kanan index.html &gt; Open with Live Server).' : '');
    gallery.appendChild(status);
  });

  // ---------- jendela pemutar ----------
  function stopAll() {
    player.pause();
    player.removeAttribute('src');
    player.load();
    frame.removeAttribute('src');
  }
  function load(i) {
    current = (i + videos.length) % videos.length;
    const v = videos[current];
    stopAll();
    vtitle.textContent = v.title;
    if (v.type === 'ig') {
      player.hidden = true; frame.hidden = false;
      frame.src = v.embed;
      vopen.hidden = false; vopen.href = v.page;
    } else {
      frame.hidden = true; vopen.hidden = true; player.hidden = false;
      player.src = enc(v.path);
      player.play().catch(() => {});
    }
    $('#vprev').hidden = $('#vnext').hidden = videos.length < 2;
  }
  function open(i) { modal.showModal(); load(i); }
  function close() { stopAll(); modal.close(); }

  $('#vclose').onclick = close;
  $('#vprev').onclick = () => load(current - 1);
  $('#vnext').onclick = () => load(current + 1);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  modal.addEventListener('cancel', (e) => { e.preventDefault(); close(); });
  player.addEventListener('ended', () => { if (videos.length > 1) load(current + 1); });
  player.addEventListener('error', () => {
    if (player.getAttribute('src') && typeof toast === 'function')
      toast('Video tidak bisa diputar. Pastikan formatnya MP4 (H.264/AAC).');
  });
})();
