'use strict';

/*!PILLS — builds style/type filter buttons in the filters modal */
const Pills = {
  init() {
    const { styles, types } = State.data;
    this._buildGroup('style-pills', styles, 'style', Pills._onStylePick);
    this._buildGroup('type-pills',  types,  'type',  Pills._onTypePick);
  },

  _buildGroup(containerId, items, groupName, handler) {
    const container = document.getElementById(containerId);
    if (!container) return;

    items.forEach(value => {
      const btn = document.createElement('button');
      btn.className     = 'pill';
      btn.dataset.group = groupName;
      btn.dataset.value = value;
      btn.textContent   = value;

      btn.addEventListener('click', () => {
        container
          .querySelectorAll('.pill')
          .forEach(p => p.classList.remove('is-active'));
        btn.classList.add('is-active');
        handler(value);
      });

      container.appendChild(btn);
    });
  },

  _onStylePick(value) {
    State.selectedStyle = value;
  },

  _onTypePick(value) {
    State.selectedType = value;
  },
};

/*!BRIEF — generates brief copy and triggers all downstream updates */
const Brief = {
  _animateVar(id, text) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('is-updating');
    setTimeout(() => {
      el.textContent = text;
      el.classList.remove('is-updating');
    }, 220);
  },

  generate() {
    HeroAnimations.stop();
    const d     = State.data;
    const style = State.selectedStyle || 'default';
    RefPhotos.background(style);
    const type  = State.selectedType  || Utils.pick(d.types);

    const fontList = d.fonts[style] ?? d.fonts.Minimalistic;
    Look.apply(style);
    Font.render(Utils.pick(fontList));

    const project      = d.projectNames[type] ?? d.projectNames.default;
    const business     = Utils.pick(d.businesses[style] ?? d.businesses.default);
    RefPhotos.render(business);
    const aesthetic    = Utils.pick(d.aesthetics[style] ?? d.aesthetics.default ?? d.aesthetics.Minimalistic);
    const delivList    = d.deliverables[type] ?? d.deliverables.default;
    const deliverables = Utils.pickMany(delivList, 3).join(', ');

    this._animateVar('bv-project',      project);
    this._animateVar('bv-business',     business);
    this._animateVar('bv-aesthetic',    aesthetic);
    this._animateVar('bv-deliverables', deliverables);

    /* Update the hero "anything" → "a [business]" with correct article and new theme text color */
    const anythingEl = document.getElementById('hero-anything');
    if (anythingEl) {
      const article = 'aeiou'.includes(business[0].toLowerCase()) ? 'an' : 'a';
      const textColor = getComputedStyle(document.body).getPropertyValue('--text').trim();
      anythingEl.classList.add('is-updating');
      setTimeout(() => {
        anythingEl.textContent = article + ' ' + business;
        anythingEl.classList.remove('is-updating');
        gsap.to(anythingEl, {
          color: textColor,
          duration: 0.6,
          ease: 'power2.out',
        });
      }, 250);
    }

    State.briefGenerated = true;

    const btn = document.getElementById('generate-btn');
    if (btn) btn.textContent = 'Regenerate Brief';

    Tabs.revealPeek('brief');
    Tabs.open('brief');
  },
};

/*!REFERENCE PHOTOS*/
const RefPhotos = {
  positions: [
    { x: 9,  y: 18, r: -10 },
    { x: 23, y: 66, r: 8 },
    { x: 69, y: 17, r: 11 },
    { x: 82, y: 58, r: -7 },
    { x: 49, y: 72, r: 5 },
  ],

  /* On narrow screens photos are ~180px wide on a ~390px canvas.
     Negative / >77% x values put roughly half the photo off-screen. */
  mobilePositions: [
    { x: -30, y: 18,  r: 22 },
    { x: 82,  y: 62,  r: 15  },
    { x: -14, y: 60,  r: -5  },
    { x: 68,  y: -10,   r: 13  },
    { x: 16,  y: 85,  r: 4   },
  ],

  slug(text) {
    return text
      .toLowerCase()
      .replaceAll('&', 'and')
      .replaceAll("'", '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  },

  render(business) {
    const board = document.getElementById('hero-ref-board');
    if (!board) return;

    board.innerHTML = '';

    const slug = this.slug(business);
    const positions = window.innerWidth <= 600 ? this.mobilePositions : this.positions;

    positions.forEach((pos, i) => {
      const img = document.createElement('img');

      img.className = 'ref-photo';
      const extensions = ['png', 'jpg', 'jpeg'];

      let extIndex = 0;

      const tryLoad = () => {
        if (extIndex >= extensions.length) return;
        img.src = `./data/bg-pictures/${slug}-${i + 1}.${extensions[extIndex]}`;
        img.onerror = () => { extIndex++; tryLoad(); };
      };

      tryLoad();
      img.alt = `${business} reference ${i + 1}`;
      img.draggable = false;

      img.style.left = `${pos.x}%`;
      img.style.top  = `${pos.y}%`;

      board.appendChild(img);

      gsap.set(img, { rotate: pos.r, scale: 0.92, opacity: 0 });
      gsap.to(img,  { scale: 1, opacity: 1, duration: 0.45, delay: i * 0.06, ease: 'power3.out' });

      this.makeDraggable(img, pos.r);
    });
  },

  makeDraggable(el, startRotation) {
    let moveX = 0, moveY = 0, startX = 0, startY = 0;

    el.addEventListener('pointerdown', e => {
      e.stopPropagation();
      el.classList.add('is-dragging');
      el.setPointerCapture(e.pointerId);
      startX = e.clientX - moveX;
      startY = e.clientY - moveY;
      gsap.to(el, { rotate: 0, scale: 1.06, duration: 0.25, ease: 'power3.out' });
    });

    el.addEventListener('pointermove', e => {
      if (!el.classList.contains('is-dragging')) return;
      moveX = e.clientX - startX;
      moveY = e.clientY - startY;
      gsap.set(el, { x: moveX, y: moveY });
    });

    el.addEventListener('pointerup', e => {
      e.stopPropagation();
      el.classList.remove('is-dragging');
      gsap.to(el, { rotate: startRotation * 0.35, scale: 1, duration: 0.4, ease: 'power3.out' });
    });
  },

  background(style) {
    const bg = document.getElementById('hero-corkboard');
    if (!bg) return;

    const slug = this.slug(style || 'default');

    bg.style.backgroundImage = `
      linear-gradient(
        color-mix(in srgb, var(--bg) 68%, transparent),
        color-mix(in srgb, var(--bg) 68%, transparent)
      ),
      url("./data/bg-pictures/bg-${slug}.jpg")
    `;
  },
};

/*!PALETTE — renders colour swatches with RAL/RGB/HSB data */
const Palette = {
  ral: [
    ['RAL 1000','#CDBA88'],['RAL 1001','#D0B084'],['RAL 1002','#D2AA6D'],['RAL 1003','#F9A800'],
    ['RAL 1004','#E49E00'],['RAL 1011','#AF8050'],['RAL 1013','#E9E0D2'],['RAL 1014','#DF9B69'],
    ['RAL 1015','#EADEBD'],['RAL 1016','#F0E000'],['RAL 1017','#F5A100'],['RAL 1018','#F6E000'],
    ['RAL 1019','#9E9764'],['RAL 1021','#F3DA0B'],['RAL 1023','#FAD201'],['RAL 1024','#AEA04B'],
    ['RAL 1028','#F4A300'],['RAL 1032','#E0A500'],['RAL 1033','#F39500'],['RAL 1034','#F3B963'],
    ['RAL 2000','#ED760E'],['RAL 2001','#C93C20'],['RAL 2002','#CB2821'],['RAL 2003','#FF7514'],
    ['RAL 2004','#F44611'],['RAL 2008','#F75E25'],['RAL 2009','#F54021'],['RAL 2011','#FF7000'],
    ['RAL 3000','#AF2B1E'],['RAL 3001','#A52019'],['RAL 3002','#A2231D'],['RAL 3003','#9B111E'],
    ['RAL 3004','#75151E'],['RAL 3005','#5E2129'],['RAL 3007','#412227'],['RAL 3009','#642424'],
    ['RAL 3011','#781F19'],['RAL 3012','#C1876B'],['RAL 3013','#A12312'],['RAL 3014','#D36E70'],
    ['RAL 3015','#EA899A'],['RAL 3016','#B32821'],['RAL 3017','#E63244'],['RAL 3018','#D53032'],
    ['RAL 3020','#CC0605'],['RAL 3022','#D95030'],['RAL 3027','#C51D34'],['RAL 3031','#B32428'],
    ['RAL 4001','#6D3F5B'],['RAL 4002','#922B3E'],['RAL 4003','#DE4C8A'],['RAL 4004','#641C34'],
    ['RAL 4005','#6C4675'],['RAL 4006','#A03472'],['RAL 4007','#4A192C'],['RAL 4008','#924E7D'],
    ['RAL 4009','#A18594'],['RAL 4010','#CF3476'],
    ['RAL 5000','#354D73'],['RAL 5001','#1F3438'],['RAL 5002','#20214F'],['RAL 5003','#1D1E33'],
    ['RAL 5005','#1E2460'],['RAL 5007','#3E5F8A'],['RAL 5009','#025669'],['RAL 5010','#0E294B'],
    ['RAL 5012','#3B83BD'],['RAL 5013','#1E213D'],['RAL 5014','#606E8C'],['RAL 5015','#2271B3'],
    ['RAL 5017','#063971'],['RAL 5018','#3F888F'],['RAL 5021','#256D7B'],['RAL 5022','#252850'],
    ['RAL 5023','#49678D'],['RAL 5024','#5D9B9B'],
    ['RAL 6000','#316650'],['RAL 6001','#287233'],['RAL 6002','#2D572C'],['RAL 6003','#424632'],
    ['RAL 6005','#2F4538'],['RAL 6007','#343B29'],['RAL 6009','#31372B'],['RAL 6010','#35682D'],
    ['RAL 6011','#587246'],['RAL 6013','#6C7156'],['RAL 6016','#1E5945'],['RAL 6017','#4C9141'],
    ['RAL 6018','#57A639'],['RAL 6019','#BDECB6'],['RAL 6021','#89AC76'],['RAL 6024','#308446'],
    ['RAL 6025','#3D642D'],['RAL 6027','#84C3BE'],['RAL 6029','#20603D'],['RAL 6032','#317F43'],
    ['RAL 6033','#497E76'],['RAL 6034','#7FB5B5'],['RAL 6037','#008F39'],
    ['RAL 7000','#7E8B92'],['RAL 7001','#8F999F'],['RAL 7002','#817F68'],['RAL 7003','#7A7B6D'],
    ['RAL 7004','#9EA0A1'],['RAL 7005','#6C7059'],['RAL 7006','#756F61'],['RAL 7011','#434B4D'],
    ['RAL 7012','#4E5754'],['RAL 7015','#434750'],['RAL 7016','#293133'],['RAL 7021','#23282B'],
    ['RAL 7023','#686C5E'],['RAL 7024','#474A51'],['RAL 7030','#8B8C7A'],['RAL 7031','#474B4E'],
    ['RAL 7032','#B8B799'],['RAL 7033','#7D8471'],['RAL 7035','#D7D7D7'],['RAL 7037','#7D7F7D'],
    ['RAL 7038','#B5B8B1'],['RAL 7040','#9DA1AA'],['RAL 7042','#8D948D'],['RAL 7043','#4E5452'],
    ['RAL 7044','#CAC4B0'],['RAL 7045','#909090'],['RAL 7047','#D0D0D0'],
    ['RAL 8000','#826C34'],['RAL 8001','#955F20'],['RAL 8002','#6C3B2A'],['RAL 8003','#734222'],
    ['RAL 8004','#8E402A'],['RAL 8007','#59351F'],['RAL 8008','#6F4F28'],['RAL 8011','#53422E'],
    ['RAL 8016','#4C2F27'],['RAL 8017','#45322E'],['RAL 8019','#403A3A'],['RAL 8023','#A65E2E'],
    ['RAL 8024','#79553D'],['RAL 8025','#755C48'],['RAL 8028','#4E3B31'],
    ['RAL 9001','#FDF4E3'],['RAL 9002','#E7EBDA'],['RAL 9003','#F4F4F4'],['RAL 9004','#282828'],
    ['RAL 9005','#0A0A0A'],['RAL 9006','#A5A5A5'],['RAL 9007','#8F8F8F'],['RAL 9010','#FFFFFF'],
    ['RAL 9011','#1C1C1C'],['RAL 9016','#F6F6F6'],['RAL 9017','#1E1E1E'],['RAL 9018','#D7D7D0'],
  ],

  hexToRGB(hex) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `${r} / ${g} / ${b}`;
  },

  hexToHSB(hex) {
    const r=parseInt(hex.slice(1,3),16)/255, g=parseInt(hex.slice(3,5),16)/255, b=parseInt(hex.slice(5,7),16)/255;
    const max=Math.max(r,g,b), min=Math.min(r,g,b), d=max-min;
    let h=0;
    if(d){ if(max===r) h=((g-b)/d)%6; else if(max===g) h=(b-r)/d+2; else h=(r-g)/d+4; h=Math.round(h*60); if(h<0)h+=360; }
    return `${h}° / ${max===0?0:Math.round(d/max*100)}% / ${Math.round(max*100)}%`;
  },

  hexToRAL(hex) {
    const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
    let best=this.ral[0], bestD=Infinity;
    for(const [name,rh] of this.ral){
      const d=(r-parseInt(rh.slice(1,3),16))**2+(g-parseInt(rh.slice(3,5),16))**2+(b-parseInt(rh.slice(5,7),16))**2;
      if(d<bestD){ bestD=d; best=[name,rh]; }
    }
    return best[0];
  },

  render(swatches) {
    const grid = document.getElementById('palette-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const isMobile = window.innerWidth < 768;

    const roleLabels = ['Main Color', 'Contrast', 'Accent 01', 'Accent 02', 'Background'];

    swatches.forEach(({ hex, name }, idx) => {
      const wrap = document.createElement('div');
      wrap.className = 'swatch';
      const bg = getComputedStyle(document.body).getPropertyValue('--bg').trim().toLowerCase();
      if (bg === hex.toLowerCase()) wrap.classList.add('swatch--stroke');

      wrap.innerHTML = `
        <div class="swatch__circle" style="background:${hex};"></div>
        <div class="swatch__label">${roleLabels[idx] ?? 'Color'}</div>
        <div class="swatch__name">${name}</div>
        <div class="swatch__hex">${hex}</div>
        <div class="swatch__overlay">
          <div class="swatch__overlay-row"><span>RGB</span><span>${this.hexToRGB(hex)}</span></div>
          <div class="swatch__overlay-row"><span>HSB</span><span>${this.hexToHSB(hex)}</span></div>
          <div class="swatch__overlay-row"><span>RAL</span><span>${this.hexToRAL(hex)}</span></div>
        </div>
      `;

      const hexEl = wrap.querySelector('.swatch__hex');

      wrap.addEventListener('click', () => {
        const done = () => {
          wrap.classList.add('is-copied');
          hexEl.textContent = 'Copied!';
          setTimeout(() => {
            wrap.classList.remove('is-copied');
            hexEl.textContent = hex;
          }, 1200);
        };
        (navigator.clipboard?.writeText(hex) ?? Promise.reject())
          .then(done)
          .catch(() => {
            try {
              const ta = Object.assign(document.createElement('textarea'), { value: hex });
              Object.assign(ta.style, { position: 'fixed', opacity: '0', pointerEvents: 'none' });
              document.body.appendChild(ta);
              ta.select();
              document.execCommand('copy');
              ta.remove();
            } catch (_) {}
            done();
          });
      });

      if (isMobile) {
        wrap.addEventListener('click', e => {
          e.stopPropagation();
          const active = wrap.classList.contains('is-info');
          grid.querySelectorAll('.swatch.is-info').forEach(s => s.classList.remove('is-info'));
          if (!active) wrap.classList.add('is-info');
        });
      }

      grid.appendChild(wrap);
    });

    if (isMobile) {
      document.addEventListener('click', () => {
        grid.querySelectorAll('.swatch.is-info').forEach(s => s.classList.remove('is-info'));
      });
    }
  },
};

/*!GUIDELINES — opens a printable brand guidelines document in a new tab */
const Guidelines = {
  open() {
    if (!State.currentLook) return;

    const cs        = getComputedStyle(document.body);
    const bg        = cs.getPropertyValue('--bg').trim();
    const bgSection = cs.getPropertyValue('--bg-section').trim();
    const col       = cs.getPropertyValue('--text').trim();
    const accent    = cs.getPropertyValue('--accent').trim();

    const g = id => document.getElementById(id)?.textContent?.trim() ?? '';
    const business    = g('bv-business');
    const project     = g('bv-project');
    const aesthetic   = g('bv-aesthetic');
    const deliverables = g('bv-deliverables');
    const fontName    = g('font-name');
    const fontDesc    = g('font-description');

    const rawFamily  = cs.getPropertyValue('--theme-font').trim().replace(/'/g, '');
    const fontFamily = rawFamily.split(',')[0].trim();
    const fontWeight = cs.getPropertyValue('--theme-font-weight').trim() || '700';

    const palette    = State.currentLook.palette ?? [];
    const roleLabels = ['Main Color', 'Contrast', 'Accent 01', 'Accent 02', 'Background'];

    const contrast = hex => {
      const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
      return (r*299 + g*587 + b*114) / 1000 > 128 ? '#1a1a1a' : '#ffffff';
    };

    const paletteRows = palette.map(({ hex, name }, idx) => `
      <div class="pr">
        <div class="ps" style="background:${hex};color:${contrast(hex)}">${hex}</div>
        <div class="pm">
          <p class="pr-role">${roleLabels[idx] ?? ''}</p>
          <p class="pr-name">${name}</p>
          <p class="pr-val">RGB &nbsp;${Palette.hexToRGB(hex)}</p>
          <p class="pr-val">HSB &nbsp;${Palette.hexToHSB(hex)}</p>
          <p class="pr-val">${Palette.hexToRAL(hex)}</p>
        </div>
      </div>`).join('');

    const gFontSlug = fontFamily.replace(/\s+/g, '+');
    const gFontURL  = `https://fonts.googleapis.com/css2?family=${gFontSlug}:ital,wght@0,400;0,700;1,400;1,700&display=swap`;

    const base     = window.location.href.replace(/[^/]*$/, '');
    const logoSlug = Logo._slug(State.selectedStyle || 'default');
    const logoSrc  = `${base}data/logos/${logoSlug}.svg`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${business} — Brand Guidelines</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<link href="${gFontURL}" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:${bg};color:${col};font-family:'Inter',sans-serif;font-size:13px;line-height:1.6;padding:64px 80px;max-width:880px;margin:0 auto}
h1{font-family:'${fontFamily}',serif;font-size:clamp(42px,6vw,68px);font-weight:${fontWeight};line-height:1.05;letter-spacing:-0.025em;margin-bottom:6px}
.hd{margin-bottom:72px}
.hd-label{font-size:10px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;opacity:.35;margin-bottom:14px}
.hd-sub{font-size:14px;opacity:.55;margin-top:10px;font-style:italic}
section{margin-bottom:64px}
.sl{font-size:9.5px;font-weight:600;letter-spacing:0.22em;text-transform:uppercase;opacity:.3;padding-bottom:14px;border-bottom:1px solid ${col}22;margin-bottom:24px}
.brief-copy{font-size:18px;font-weight:400;line-height:1.55;max-width:580px}
.brief-copy em{font-family:'${fontFamily}',serif;font-style:italic;font-weight:${fontWeight};color:${accent}}
.pg{display:flex;flex-direction:column;gap:12px}
.pr{display:flex;align-items:stretch;gap:20px}
.ps{width:96px;min-height:72px;flex-shrink:0;display:flex;align-items:flex-end;padding:7px 9px;font-family:'Space Mono',monospace;font-size:9px;font-weight:700;letter-spacing:0.05em}
.pm{display:flex;flex-direction:column;justify-content:center;gap:2px}
.pr-role{font-size:9px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;opacity:.35}
.pr-name{font-size:14px;font-weight:500;margin-top:2px}
.pr-val{font-family:'Space Mono',monospace;font-size:10px;opacity:.5}
.ts{font-family:'${fontFamily}',serif;font-weight:${fontWeight};font-size:clamp(38px,5vw,56px);line-height:1.1;letter-spacing:-0.02em;margin-bottom:14px}
.ta{font-family:'${fontFamily}',serif;font-weight:${fontWeight};font-size:13px;line-height:2;opacity:.6;letter-spacing:0.05em;margin-bottom:20px}
.tn{font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase}
.td{font-size:12px;opacity:.55;margin-top:4px;max-width:480px;line-height:1.6}
footer{margin-top:80px;padding-top:20px;border-top:1px solid ${col}22;font-size:9px;opacity:.3;letter-spacing:0.12em;text-transform:uppercase}
.pbtn{position:fixed;top:20px;right:20px;padding:10px 26px;background:${accent};color:#fff;font-family:'Inter',sans-serif;font-size:10px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;border:none;cursor:pointer;z-index:100}
@page{margin:0}
@media print{.pbtn{display:none}section{page-break-inside:avoid}body{padding:50px}.ps{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style>
</head>
<body>
<button class="pbtn" onclick="window.print()">Print / Save PDF</button>

<header class="hd">
  <p class="hd-label">Brand Guidelines</p>
  <h1>${business}</h1>
  <p class="hd-sub">${aesthetic}</p>
</header>

<section>
  <p class="sl">The Brief</p>
  <p class="brief-copy">
    We would like to develop <em>${project}</em> for our <em>${business}</em>
    that reflects <em>${aesthetic}</em>. This project should include
    <em>${deliverables}</em>. The final outcome should be cohesive, of high-quality
    and match our guidelines.
  </p>
</section>

<section>
  <p class="sl">Colour Palette</p>
  <div class="pg">${paletteRows}</div>
</section>

<section>
  <p class="sl">Typography</p>
  <p class="ts">Aa Bb Cc Dd Ee Ff</p>
  <p class="ta">ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>abcdefghijklmnopqrstuvwxyz<br>0123456789 &nbsp;!@#\$%&amp;?.,;:'"</p>
  <p class="tn">${fontName}</p>
  ${fontDesc ? `<p class="td">${fontDesc}</p>` : ''}
</section>

<footer>
  <img src="${logoSrc}" alt="SORTA" style="height:28px;display:block;margin-bottom:10px">
  Generated with SORTA — Your Dream Client
</footer>
</body>
</html>`;

    const win = window.open('', '_blank');
    if (!win) { alert('Allow pop-ups for this site to open the guidelines.'); return; }
    win.document.write(html);
    win.document.close();
  },
};

/*!FONT — renders the font specimen in the fonts modal */
const Font = {
  render({ name, family, weight, description }) {
    const specimen = document.getElementById('font-specimen');
    const fontName = document.getElementById('font-name');
    const fontDesc = document.getElementById('font-description');
    const glyphs   = document.getElementById('font-glyphs');
    if (!specimen || !fontName) return;

    specimen.style.fontFamily = family;
    specimen.style.fontWeight = weight ?? '700';
    fontName.textContent      = name;

    if (glyphs)   glyphs.style.fontFamily    = family;
    if (fontDesc) fontDesc.textContent        = description ?? '';

    document.body.style.setProperty('--theme-font',        family);
    document.body.style.setProperty('--theme-font-weight', weight ?? '700');
  },
};
