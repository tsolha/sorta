'use strict';

/*!LOOK — applies theme CSS variables from the selected style */
const Look = {
  apply(style = 'default') {
    const looks =
      State.data.styleLooks[style] ??
      State.data.styleLooks.default;

    const look = Utils.pick(looks);
    State.currentLook = look;

    document.body.style.setProperty('--bg',         look.theme.bg);
    document.body.style.setProperty('--bg-section', look.theme.bgSection);
    document.body.style.setProperty('--text',       look.theme.text);
    document.body.style.setProperty('--text-muted', look.theme.textMuted);
    document.body.style.setProperty('--accent',     look.theme.accent);
    document.body.style.setProperty('--accent2',    look.theme.accent2);

    Palette.render(look.palette);

Logo.update(style);
  },
};

/*!LOGO — fetches, inlines, and animates SVG logos with currentColor */
const Logo = {
  _cache: {},
  _ready: false,

  _slug(style) {
    return style.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  },

  async _fetchSVG(slug) {
    if (this._cache[slug]) return this._cache[slug];
    const res = await fetch(`./data/logos/${slug}.svg`);
    if (!res.ok) throw new Error();
    const text = await res.text();
    this._cache[slug] = text;
    return text;
  },

  _buildSVG(svgText, source) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, 'image/svg+xml');
    const svg = doc.querySelector('svg');
    if (!svg) return null;

    /* Patch <style> blocks: fill/stroke colours → currentColor */
    svg.querySelectorAll('style').forEach(styleEl => {
      styleEl.textContent = styleEl.textContent
        .replace(/(fill\s*:\s*)(?!none\b)([^;}"]+)/gi,   '$1currentColor')
        .replace(/(stroke\s*:\s*)(?!none\b)([^;}"]+)/gi, '$1currentColor');
    });

    /* Patch presentation attributes */
    [svg, ...svg.querySelectorAll('*')].forEach(el => {
      if (el.getAttribute('fill')   && el.getAttribute('fill')   !== 'none') el.setAttribute('fill',   'currentColor');
      if (el.getAttribute('stroke') && el.getAttribute('stroke') !== 'none') el.setAttribute('stroke', 'currentColor');
    });

    source.classList.forEach(cls => svg.classList.add(cls));
    if (source.id) svg.id = source.id;
    svg.setAttribute('aria-label', source.getAttribute('alt') || source.getAttribute('aria-label') || 'SORTA logo');
    svg.setAttribute('role', 'img');
    return svg;
  },

  _makeNext(svgText, slug, source) {
    if (svgText) {
      const svg = this._buildSVG(svgText, source);
      if (svg) return svg;
    }
    const img = document.createElement('img');
    source.classList.forEach(cls => img.classList.add(cls));
    if (source.id) img.id = source.id;
    img.alt = source.getAttribute('alt') || source.getAttribute('aria-label') || 'SORTA logo';
    img.src = `./data/logos/${slug}.png`;
    img.onerror = async () => {
      try {
        const fallback = await this._fetchSVG('default');
        const svg = this._buildSVG(fallback, img);
        if (svg) img.replaceWith(svg);
      } catch { /* nothing to show */ }
    };
    return img;
  },

  async update(style = 'default') {
    const slug = this._slug(style);
    const svgTextPromise = this._fetchSVG(slug).catch(() => null);
    const current = [...document.querySelectorAll('.logo')];

    /* Erase out: sweep left → right (skip on very first render) */
    if (this._ready && current.length) {
      await new Promise(resolve =>
        gsap.to(current, {
          clipPath: 'inset(0% 0% 0% 100%)',
          duration: 0.38,
          ease: 'power2.in',
          onComplete: resolve,
        })
      );
    }

    const svgText = await svgTextPromise;

    /* Swap elements */
    current.forEach(el => {
      const next = this._makeNext(svgText, slug, el);
      el.replaceWith(next);
    });

    /* Draw in: sweep left → right */
    const incoming = [...document.querySelectorAll('.logo')];
    if (this._ready) {
      gsap.fromTo(incoming,
        { clipPath: 'inset(0% 100% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 0.5,
          ease: 'power2.out',
          onComplete: () => gsap.set(incoming, { clearProps: 'clipPath' }),
        }
      );
    }

    this._ready = true;
  },
};
