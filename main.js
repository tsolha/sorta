'use strict';

const App = {
  async init() {
    try {
      State.data = await Utils.loadJSON('./data/data.json');
    } catch (err) {
      console.error('SORTA: failed to load data.json', err);
      return;
    }

    Pills.init();
    Tabs.init();

    const heroCta = document.querySelector('.hero__cta');
    document.getElementById('build-brief-btn')
      ?.addEventListener('click', () => {
        heroCta?.classList.add('is-hidden');
        Tabs.open('filters');
      });

    document.getElementById('generate-btn')
      ?.addEventListener('click', () => Brief.generate());

    document.getElementById('print-guidelines-btn')
      ?.addEventListener('click', () => Guidelines.open());

    Look.apply('default');
    Font.render(State.data.fonts.Minimalistic[0]);

    HeroAnimations.init();
  },
};

document.addEventListener('DOMContentLoaded', () => App.init());
