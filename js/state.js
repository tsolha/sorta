'use strict';

/*!STATE */
const State = {
  data:           null,
  selectedStyle:  null,
  selectedType:   null,
  currentLook:    null,
  briefGenerated: false,
};

/*!UTILS */
const Utils = {
  pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },
  pickMany(arr, n) {
    return [...arr]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(n, arr.length));
  },
  async loadJSON(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
    return res.json();
  },
};
