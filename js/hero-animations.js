const HeroAnimations = {
  images: [
    '1.jpg',
    'architecture-studio-1.png', 'architecture-studio-2.png', 'architecture-studio-3.png', 'architecture-studio-4.png', 'architecture-studio-5.png',
    'art-gallery-1.jpg', 'art-gallery-2.jpg', 'art-gallery-3.jpg', 'art-gallery-4.jpg', 'art-gallery-5.jpg',
    'bakery-1.jpg', 'bakery-2.jpg', 'bakery-3.jpg', 'bakery-4.jpg', 'bakery-5.jpg',
    'children-toy-brand-1.jpg', 'children-toy-brand-2.jpg', 'children-toy-brand-3.jpg', 'children-toy-brand-4.jpg', 'children-toy-brand-5.jpg',
    'creative-studio-1.png', 'creative-studio-2.png', 'creative-studio-3.png', 'creative-studio-4.png', 'creative-studio-5.png',
    'editorial-magazine-1.jpg', 'editorial-magazine-2.jpg', 'editorial-magazine-3.jpg', 'editorial-magazine-4.jpg', 'editorial-magazine-5.jpg',
    'fine-jewellery-house-1.jpg', 'fine-jewellery-house-2.jpg', 'fine-jewellery-house-3.jpg', 'fine-jewellery-house-4.jpg', 'elegant-fine-jewellery-house-5.jpg',
    'energy-drink-1.jpg', 'energy-drink-2.jpg', 'energy-drink-3.jpg', 'energy-drink-4.jpg', 'energy-drink-5.jpg',
    'fashion-label-1.png', 'fashion-label-2.png', 'fashion-label-3.png', 'fashion-label-4.png', 'fashion-label-5.png',
    'haute-couture-atelier-1.jpg', 'haute-couture-atelier-2.jpg', 'haute-couture-atelier-3.jpg', 'haute-couture-atelier-4.jpg', 'haute-couture-atelier-5.jpg',
    'heritage-watchmaker-1.jpg', 'heritage-watchmaker-2.jpg', 'heritage-watchmaker-3.jpg', 'heritage-watchmaker-4.jpg', 'heritage-watchmaker-5.jpg',
    'illustration-studio-1.png', 'illustration-studio-2.png', 'illustration-studio-3.png', 'illustration-studio-4.png', 'illustration-studio-5.png',
    'indie-music-band-1.jpg', 'indie-music-band-2.jpg', 'indie-music-band-3.jpg', 'indie-music-band-4.jpg', 'indie-music-band-5.jpg',
    'luxury-hotel-1.jpg', 'luxury-hotel-2.jpg', 'luxury-hotel-3.jpg', 'luxury-hotel-4.jpg', 'luxury-hotel-5.jpg',
    'luxury-perfume-brand-1.jpg', 'luxury-perfume-brand-2.jpg', 'luxury-perfume-brand-3.jpg', 'luxury-perfume-brand-4.jpg', 'luxury-perfume-brand-5.jpg',
    'maximalist-interiors-studio-1.jpg', 'maximalist-interiors-studio-2.jpg', 'maximalist-interiors-studio-3.jpg', 'maximalist-interiors-studio-4.jpg', 'maximalist-interiors-studio-5.jpg',
    'occult-bookshop-1.jpg', 'occult-bookshop-2.jpg', 'occult-bookshop-3.jpg', 'occult-bookshop-4.jpg', 'occult-bookshop-5.jpg',
    'pet-care-brand-1.jpg', 'pet-care-brand-2.jpg', 'pet-care-brand-3.jpg', 'pet-care-brand-4.jpg', 'pet-care-brand-5.jpg',
    'political-campaign-1.jpg', 'political-campaign-2.jpg', 'political-campaign-3.jpg', 'political-campaign-4.jpg', 'political-campaign-5.jpg',
    'premium-wine-estate-1.jpg', 'premium-wine-estate-2.jpg', 'premium-wine-estate-3.jpg', 'premium-wine-estate-4.jpg', 'premium-wine-estate-5.jpg',
    'private-members-club-1.jpg', 'private-members-club-2.jpg', 'private-members-club-3.jpg', 'private-members-club-4.jpg', 'private-members-club-5.jpg',
    'scandinavian-furniture-brand-1.jpg', 'scandinavian-furniture-brand-2.jpg', 'scandinavian-furniture-brand-3.jpg', 'scandinavian-furniture-brand-4.jpg', 'scandinavian-furniture-brand-5.jpg',
    'sport-car-brand-1.png', 'sport-car-brand-2.jpg', 'sport-car-brand-3.png', 'sport-car-brand-4.png', 'sport-car-brand-5.png',
    'sports-brand-1.jpg', 'sports-brand-2.jpg', 'sports-brand-3.jpg', 'sports-brand-4.jpg', 'sports-brand-5.jpg',
    'stationery-company-1.jpg', 'stationery-company-2.jpg', 'stationery-company-3.jpg', 'stationery-company-4.jpg', 'stationery-company-5.jpg',
    'streetwear-brand-1.png', 'streetwear-brand-2.png', 'streetwear-brand-3.png', 'streetwear-brand-4.png', 'streetwear-brand-5.png',
    'tattoo-parlour-1.jpg', 'tattoo-parlour-2.jpg', 'tattoo-parlour-3.jpg', 'tattoo-parlour-4.jpg', 'tattoo-parlour-5.jpg',
    'tech-startup-1.png', 'tech-startup-2.png', 'tech-startup-3.png', 'tech-startup-4.png', 'tech-startup-5.png',
    'theme-park-1.jpg', 'theme-park-2.jpg', 'theme-park-3.jpg', 'theme-park-4.jpg', 'theme-park-5.jpg',
    'underground-nightclub-1.jpg', 'underground-nightclub-2.jpg', 'underground-nightclub-3.jpg', 'underground-nightclub-4.jpg', 'underground-nightclub-5.jpg',
    'vintage-clothing-store-1.jpg', 'vintage-clothing-store-2.jpg', 'vintage-clothing-store-3.jpg', 'vintage-clothing-store-4.jpg', 'vintage-clothing-store-5.jpg',
    'vinyl-record-shop-1.png', 'vinyl-record-shop-2.png', 'vinyl-record-shop-3.png', 'vinyl-record-shop-4.png', 'vinyl-record-shop-5.png',
    'wellness-brand-1.jpg', 'wellness-brand-2.jpg', 'wellness-brand-3.jpg', 'wellness-brand-4.jpg', 'wellness-brand-5.jpg',
  ],

  isActive: true,
  isMobile: window.innerWidth < 768,
  businessIndex: 0,
  anythingLoopInterval: null,

  init() {
    this.setupHeroBgText();
    this.setupCursorGlow();
    this.setupOrbit();
    this.setupAnythingAnimation();
  },

  setupCursorGlow() {
    const hero = document.getElementById('hero');
    if (!hero) return;

    const glow = document.createElement('div');
    glow.id = 'hero-cursor-glow';
    const bgText = document.getElementById('hero-bg-text');
    hero.insertBefore(glow, bgText ? bgText.nextSibling : hero.firstChild);

    const onMove = (e) => {
      if (!this.isActive) return;
      const rect = hero.getBoundingClientRect();
      glow.style.setProperty('--glow-x', (e.clientX - rect.left).toFixed(1) + 'px');
      glow.style.setProperty('--glow-y', (e.clientY - rect.top).toFixed(1) + 'px');
      if (!glow.classList.contains('is-active')) glow.classList.add('is-active');
    };

    const onLeave = () => glow.classList.remove('is-active');

    hero.addEventListener('mousemove', onMove);
    hero.addEventListener('mouseleave', onLeave);
    this._glowCleanup = () => {
      hero.removeEventListener('mousemove', onMove);
      hero.removeEventListener('mouseleave', onLeave);
    };
  },

  setupHeroBgText() {
    const hero = document.getElementById('hero');
    if (!hero) return;

    const phrases = [
      "I would love to design a packaging someday...",
      "I never worked with print but I'd love to",
      "I want to test my skills in the field I don't normally do",
      "Data Visualization is my passion — I want more projects like it",
      "I have some inspiration I don't know where to spend",
      "I keep redesigning logos in my head on my commute",
      "There's a font I've been saving for the right project",
      "I need a client who just lets me experiment",
      "I've been hoarding colour palettes I never get to use",
      "I dream of a project with no brief and full creative freedom",
      "Sometimes I pick projects just for the aesthetic",
      "I want to design a book cover at least once",
      "My portfolio needs more variety and I know it",
      "I wish someone would hire me just for the typography",
      "I have a folder of abandoned concepts I'm still proud of",
      "Some of my best ideas never made it past a napkin",
      "I need to stop saying no to weird briefs",
      "I want to design something that ends up in a museum someday",
      "I secretly open Behance for inspiration and end up there for hours",
      "I want a project where the client trusts me completely",
    ];

    const wrap = document.createElement('div');
    wrap.id = 'hero-bg-text';
    hero.insertBefore(wrap, hero.firstChild);

    const ROW_COUNT = 55;

    for (let i = 0; i < ROW_COUNT; i++) {
      const line = document.createElement('p');
      line.className = 'hbt-line ' + (i % 2 === 0 ? 'hbt-line--body' : 'hbt-line--display');

      let text = '';
      let pi = (i * 3) % phrases.length;
      while (text.length < 600) {
        text += phrases[pi % phrases.length] + '   ·   ';
        pi++;
      }
      line.textContent = text;
      wrap.appendChild(line);
    }
  },

  setupOrbit() {
    const hero = document.getElementById('hero');
    if (!hero) return;

    const N = 14;

    const orbitEl = document.createElement('div');
    orbitEl.id = 'hero-orbit';
    hero.appendChild(orbitEl);

    const shuffled = [...this.images].sort(() => Math.random() - 0.5);
    const items = Array.from({ length: N }, (_, i) => {
      const el = document.createElement('img');
      el.src = `./data/bg-pictures/${shuffled[i % shuffled.length]}`;
      el.className = 'orbit-img';
      el.draggable = false;
      orbitEl.appendChild(el);
      return { el, baseAngle: (i / N) * Math.PI * 2 };
    });

    this._orbitState = { val: 0, target: 0 };

    const tick = () => {
      if (!this.isActive) return;

      const W  = hero.offsetWidth;
      const H  = hero.offsetHeight;
      const cx = W * 0.5;
      const cy = H * 0.46;
      const R       = W < 768
        ? Math.min(W * 0.72, H * 0.55)
        : Math.min(W * 0.50, H * 0.65);
      const PERSP   = R * 2.2;
      const SIN_TILT = W < 768
        ? Math.sin(52 * Math.PI / 180)
        : Math.sin(32 * Math.PI / 180);

      items.forEach(item => {
        const t    = item.baseAngle + this._orbitState.val;
        const sinT = Math.sin(t);
        const cosT = Math.cos(t);

        const z3d  = R * sinT;
        const x3d  = R * cosT;
        const y3d  = z3d * SIN_TILT;

        const scale   = PERSP / (PERSP - z3d);
        const screenX = cx + x3d * scale;
        const screenY = cy + y3d * scale;

        const imgW = item.el.offsetWidth  || 90;
        const imgH = item.el.offsetHeight || 135;

        const opacity = Math.max(0, 0.05 + 0.95 * ((sinT + 1) / 2));
        const zIdx    = Math.round(10 + sinT * 4);

        item.el.style.transform = `translate(${(screenX - imgW * 0.5).toFixed(1)}px,${(screenY - imgH * 0.5).toFixed(1)}px) scale(${scale.toFixed(4)})`;
        item.el.style.opacity   = opacity.toFixed(3);
        item.el.style.zIndex    = String(zIdx);
      });

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  },

  orbitStep() {
    if (!this._orbitState) return;
    const step = (Math.PI * 2) / 14;
    this._orbitState.target += step;
    gsap.to(this._orbitState, {
      val: this._orbitState.target,
      duration: 0.25,
      ease: 'power4.out',
      overwrite: true,
    });
  },

  setupMobileFloatingImages() {
    const interval = setInterval(() => {
      if (!this.isActive) {
        clearInterval(interval);
        return;
      }

      const randomX = Math.random() * window.innerWidth;
      const randomY = Math.random() * window.innerHeight;
      this.createTraceImage(randomX, randomY);
    }, 600);
  },

  createTraceImage(x, y) {
    const img = document.createElement('img');
    const randomImage = this.images[Math.floor(Math.random() * this.images.length)];

    img.src = `./data/bg-pictures/${randomImage}`;
    img.className = 'cursor-trace-image';
    img.style.position = 'fixed';
    img.style.left = `${x}px`;
    img.style.top = `${y}px`;
    img.style.pointerEvents = 'none';
    img.style.zIndex = '5';

    document.body.appendChild(img);

    gsap.set(img, {
      xPercent: -50,
      yPercent: -50,
      scale: 0.8,
      opacity: 0.85,
      rotation: Math.random() * 20 - 10,
    });

    gsap.to(img, {
      opacity: 0,
      scale: 0.4,
      duration: 2.2,
      ease: 'power2.out',
      onComplete: () => img.remove(),
    });
  },

  setupAnythingAnimation() {
    const anythingEl = document.getElementById('hero-anything');
    if (!anythingEl || !State.data) return;

    const accentColor = getComputedStyle(document.body).getPropertyValue('--accent').trim();

    gsap.to(anythingEl, {
      duration: 0.5,
      color: accentColor,
      ease: 'power2.out',
      onComplete: () => {
        this.startAnythingLoop(anythingEl, accentColor);
      },
    });
  },

  startAnythingLoop(el, accentColor) {
    const businesses = State.data.businesses.default || ['anything'];
    this.businessIndex = 0;

    const loopCycle = () => {
      if (!this.isActive) return;

      const business = businesses[this.businessIndex % businesses.length];
      this.businessIndex++;

      this.orbitStep();
      this.typewriterEffect(el, business, accentColor, loopCycle);
    };

    loopCycle();
  },

  typewriterEffect(el, text, accentColor, callback) {
    el.classList.add('is-updating');
    setTimeout(() => {
      el.textContent = '';
      el.classList.remove('is-updating');

      let index = 0;
      const chars = text.split('');

      const typeChar = () => {
        if (!this.isActive || index >= chars.length) return;

        el.textContent += chars[index];
        index++;

        if (this.isActive && index < chars.length) {
          gsap.delayedCall(0.06, typeChar);
        } else if (index === chars.length && this.isActive) {
          gsap.delayedCall(1.8, callback);
        }
      };

      typeChar();
    }, 100);
  },

  stop() {
    this.isActive = false;
    if (this._glowCleanup) { this._glowCleanup(); this._glowCleanup = null; }
    document.querySelectorAll('.orbit-img').forEach(img => {
      gsap.to(img, { opacity: 0, duration: 0.5, ease: 'power2.out' });
    });
    const bgText = document.getElementById('hero-bg-text');
    if (bgText) gsap.to(bgText, { opacity: 0, duration: 0.6, ease: 'power2.out' });
    const glowEl = document.getElementById('hero-cursor-glow');
    if (glowEl) gsap.to(glowEl, { opacity: 0, duration: 0.6, ease: 'power2.out' });
  },
};