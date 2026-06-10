'use strict';

/*!TABS*/
const Tabs = {
  _current:  null,
  _revealed: false,

  _peek() { return window.innerHeight - 44; },
  _top()  { return window.innerHeight * 0.08; },

  open(id) {
    const next = document.getElementById(`modal-${id}`);
    if (!next) return;

    const prev = this._current;

    if (prev === next) {
      this.close();
      return;
    }

    if (prev) {
      gsap.to(prev, {
        y: this._peek(),
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
          prev.classList.remove('is-open');
          prev.setAttribute('aria-hidden', 'true');
        },
      });
    }

    this._current = next;
    next.classList.add('is-open');
    next.setAttribute('aria-hidden', 'false');
    gsap.to(next, { y: this._top(), duration: 0.72, ease: 'power3.out' });
  },

  close() {
    const el = this._current;
    if (!el) return;
    this._current = null;

    gsap.to(el, {
      y: this._peek(),
      duration: 0.65,
      ease: 'power3.inOut',
      onComplete: () => {
        el.classList.remove('is-open');
        el.setAttribute('aria-hidden', 'true');
      },
    });
  },

  revealPeek(openId) {
    if (this._revealed) return;
    this._revealed = true;

    const peek = this._peek();
    document.querySelectorAll('.tab-modal').forEach((m, i) => {
      if (m.id === `modal-${openId}`) return;
      gsap.to(m, { y: peek, duration: 0.65, ease: 'power3.out', delay: 0.05 * i });
    });
  },

  init() {
    gsap.set('.tab-modal', { y: window.innerHeight + 10 });

    document.querySelectorAll('.tab-modal').forEach(modal => {
      modal.addEventListener('click', () => {
        if (!modal.classList.contains('is-open')) {
          this.open(modal.id.replace('modal-', ''));
        }
      });
    });

    document.querySelectorAll('.tab-modal__notch').forEach(notch => {
      notch.addEventListener('click', e => {
        e.stopPropagation();
        this.open(notch.closest('.tab-modal').id.replace('modal-', ''));
      });
    });

    document.querySelectorAll('.tab-modal__close').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        this.close();
      });
    });

    document.getElementById('hero')?.addEventListener('click', () => this.close());
  },
};
