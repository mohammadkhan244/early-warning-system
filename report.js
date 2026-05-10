// ── Favicon radar (runs before DOM ready) ─────────
(function () {
  var canvas = document.createElement('canvas');
  canvas.width = 64; canvas.height = 64;
  var ctx = canvas.getContext('2d');
  var cx = 32, cy = 32, r = 28, angle = 0;
  var dots = [
    { a: 0.8, d: 0.55 }, { a: 1.4, d: 0.75 }, { a: 2.1, d: 0.45 },
    { a: 3.5, d: 0.65 }, { a: 4.2, d: 0.80 }, { a: 5.1, d: 0.50 }
  ];
  function drawFavicon() {
    ctx.clearRect(0, 0, 64, 64);
    ctx.fillStyle = '#0a0a0a';
    ctx.beginPath(); ctx.arc(cx, cy, 32, 0, Math.PI * 2); ctx.fill();
    [0.35, 0.65, 1].forEach(function (s) {
      ctx.beginPath(); ctx.arc(cx, cy, r * s, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(184,115,51,0.2)'; ctx.lineWidth = 0.8; ctx.stroke();
    });
    ctx.strokeStyle = 'rgba(184,115,51,0.12)'; ctx.lineWidth = 0.6;
    ctx.beginPath(); ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy); ctx.stroke();
    dots.forEach(function (dot) {
      var delta = angle - dot.a; if (delta < 0) delta += Math.PI * 2;
      var decay = 1 - delta / (Math.PI * 2);
      if (decay > 0.02) {
        ctx.beginPath();
        ctx.arc(cx + Math.cos(dot.a) * r * dot.d, cy + Math.sin(dot.a) * r * dot.d, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(184,115,51,' + (decay * 0.9) + ')'; ctx.fill();
      }
    });
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(angle);
    var g = ctx.createLinearGradient(0, 0, r, 0);
    g.addColorStop(0, 'rgba(184,115,51,0.7)'); g.addColorStop(1, 'rgba(184,115,51,0)');
    ctx.strokeStyle = g; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(r, 0); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, angle - 0.6, angle); ctx.closePath();
    ctx.fillStyle = 'rgba(184,115,51,0.06)'; ctx.fill(); ctx.restore();
    ctx.beginPath(); ctx.arc(cx, cy, 2, 0, Math.PI * 2); ctx.fillStyle = '#b87333'; ctx.fill();
    angle = (angle + 0.06) % (Math.PI * 2);
    var link = document.getElementById('favicon-link');
    if (link) link.href = canvas.toDataURL('image/png');
  }
  setInterval(drawFavicon, 50); drawFavicon();
}());

// ── Page logic ────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {

  // Loading radar canvas
  (function () {
    var canvas = document.getElementById('radar-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var cx = 40, cy = 40, r = 32, angle = 0;
    var dots = [
      { a: 0.8, d: 0.55 }, { a: 1.4, d: 0.75 }, { a: 2.1, d: 0.45 },
      { a: 3.5, d: 0.65 }, { a: 4.2, d: 0.80 }, { a: 5.1, d: 0.50 }
    ];
    function draw() {
      ctx.clearRect(0, 0, 80, 80);
      ctx.fillStyle = '#0a0a0a';
      ctx.beginPath(); ctx.arc(cx, cy, 40, 0, Math.PI * 2); ctx.fill();
      [0.35, 0.65, 1].forEach(function (s) {
        ctx.beginPath(); ctx.arc(cx, cy, r * s, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(184,115,51,0.25)'; ctx.lineWidth = 1; ctx.stroke();
      });
      ctx.strokeStyle = 'rgba(184,115,51,0.15)'; ctx.lineWidth = 0.7;
      ctx.beginPath(); ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy); ctx.stroke();
      dots.forEach(function (dot) {
        var delta = angle - dot.a; if (delta < 0) delta += Math.PI * 2;
        var decay = 1 - delta / (Math.PI * 2);
        if (decay > 0.02) {
          ctx.beginPath();
          ctx.arc(cx + Math.cos(dot.a) * r * dot.d, cy + Math.sin(dot.a) * r * dot.d, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(184,115,51,' + (decay * 0.9) + ')'; ctx.fill();
        }
      });
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(angle);
      var g = ctx.createLinearGradient(0, 0, r, 0);
      g.addColorStop(0, 'rgba(184,115,51,0.8)'); g.addColorStop(1, 'rgba(184,115,51,0)');
      ctx.strokeStyle = g; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(r, 0); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, angle - 0.6, angle); ctx.closePath();
      ctx.fillStyle = 'rgba(184,115,51,0.07)'; ctx.fill(); ctx.restore();
      ctx.beginPath(); ctx.arc(cx, cy, 2.5, 0, Math.PI * 2); ctx.fillStyle = '#b87333'; ctx.fill();
      angle = (angle + 0.06) % (Math.PI * 2);
    }
    setInterval(draw, 50); draw();
  }());

  // URL params
  var params    = new URLSearchParams(location.search);
  var sessionId = params.get('session');
  var isPaid    = params.get('paid') === 'true';
  var isAdmin   = params.get('admin') === 'true';

  var reportData = null;

  // ── State management ────────────────────────────
  function showState(id) {
    document.querySelectorAll('.state').forEach(function (el) {
      el.classList.remove('active');
    });
    document.getElementById(id).classList.add('active');
  }

  // ── Helpers ─────────────────────────────────────
  function parseParagraphs(text) {
    return text.split(/\n\n+/).map(function (p) { return p.trim(); }).filter(function (p) { return p.length > 10; });
  }

  function renderFullReport(text) {
    var paras = parseParagraphs(text);
    return paras.map(function (p) {
      if (p.startsWith('## ')) {
        return '<h2 class="report-section-heading">' + esc(p.slice(3)) + '</h2>';
      }
      if (/^\*\*[^*]+\*\*$/.test(p)) {
        return '<p class="report-bold-line">' + esc(p.slice(2, -2)) + '</p>';
      }
      var html = p
        .replace(/\*\*(.+?)\*\*/g, function (_, m) { return '<strong style="color:#f0ece4;">' + esc(m) + '</strong>'; })
        .replace(/\n/g, '<br>');
      return '<p class="report-para">' + html + '</p>';
    }).join('');
  }

  function esc(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function showToast(msg) {
    var t = document.getElementById('share-toast');
    t.textContent = msg;
    t.classList.add('visible');
    setTimeout(function () { t.classList.remove('visible'); }, 2500);
  }

  function downloadReport(text) {
    var blob = new Blob([text], { type: 'text/plain' });
    var url  = URL.createObjectURL(blob);
    var a    = document.createElement('a');
    a.href = url;
    a.download = 'default-narrative-report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ── Render teaser ────────────────────────────────
  function renderTeaser(data) {
    document.getElementById('teaser-narrative-name').textContent = data.narrativeName || '';

    var paras      = parseParagraphs(data.narrativeReport);
    var firstPara  = paras[0] || '';
    var blurParas  = paras.slice(1, 4);

    document.getElementById('teaser-first-para').innerHTML =
      '<p class="report-para">' + firstPara.replace(/\n/g, '<br>') + '</p>';

    document.getElementById('teaser-blurred-paras').innerHTML =
      blurParas.map(function (p) {
        return '<p class="report-para">' + p.replace(/\n/g, '<br>') + '</p>';
      }).join('');

    var successUrl = 'https://early-warning-system-kappa.vercel.app/report?session=' + sessionId + '%26paid=true';
    document.getElementById('stripe-btn').href =
      'https://buy.stripe.com/3cI5kD3EofwM4N41e14wM04?client_reference_id=' + sessionId + '&success_url=' + successUrl;

    showState('state-teaser');
  }

  // ── Render full ──────────────────────────────────
  function renderFull(data) {
    document.getElementById('full-narrative-name').textContent = data.narrativeName || '';
    document.getElementById('full-report-text').innerHTML = renderFullReport(data.narrativeReport);

    document.getElementById('download-btn').addEventListener('click', function () {
      downloadReport(data.narrativeReport);
    });

    document.getElementById('copy-share-btn').addEventListener('click', function () {
      var url = window.location.href;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url)
          .then(function () { showToast('Link copied'); })
          .catch(function () { prompt('Copy link:', url); });
      } else {
        prompt('Copy link:', url);
      }
    });

    if (isAdmin) {
      document.getElementById('admin-badge').style.display = 'block';
    }

    showState('state-full');
  }

  // ── Fetch with retry ─────────────────────────────
  function fetchReport(retriesLeft) {
    fetch('/api/report-fetch?session=' + encodeURIComponent(sessionId))
      .then(function (res) {
        if (res.status === 404) {
          if (retriesLeft > 0) {
            document.getElementById('loading-label').textContent = 'Report is generating — checking again…';
            setTimeout(function () { fetchReport(retriesLeft - 1); }, 5000);
          } else {
            showState('state-error');
          }
          return null;
        }
        if (!res.ok) { showState('state-error'); return null; }
        return res.json();
      })
      .then(function (json) {
        if (!json) return;
        if (!json.success || !json.data) { showState('state-error'); return; }
        reportData = json.data;
        if (isAdmin || isPaid) {
          renderFull(reportData);
        } else {
          renderTeaser(reportData);
        }
      })
      .catch(function () {
        if (retriesLeft > 0) {
          setTimeout(function () { fetchReport(retriesLeft - 1); }, 5000);
        } else {
          showState('state-error');
        }
      });
  }

  // ── Init ─────────────────────────────────────────
  if (!sessionId) {
    showState('state-error');
  } else {
    fetchReport(6);
  }

});
