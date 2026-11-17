// Xbox: opening a page from home, the big orb drifts a little closer while
// everything eases into a dark veil, then the page fades in out of it. BACK
// plays it in reverse. No bright flashes: the user wants slow, gentle fades
// only. Same as Lifestream, Turks, Jenova and Materia.

const ZOOM_MS = 600;
const REVEAL_MS = 500;
const VEIL = 0.96;

let busy = false;
let pendingOut = false;

function calm() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function veilLayer(): HTMLElement {
  let veil = document.getElementById('boxofx-zoom');

  if (!veil) {
    veil = document.createElement('div');
    veil.id = 'boxofx-zoom';
    Object.assign(veil.style, {
      position: 'fixed',
      inset: '0',
      background: 'rgb(3, 18, 3)',
      opacity: '0',
      pointerEvents: 'none',
      zIndex: '9999',
    });
    document.body.appendChild(veil);
  }

  return veil;
}

function stop(element: Element) {
  element.getAnimations().forEach((a) => a.cancel());
}

function fade(from: number, to: number, ms: number) {
  const veil = veilLayer();

  stop(veil);

  return veil.animate([{ opacity: from }, { opacity: to }], {
    duration: ms,
    easing: 'ease-in-out',
    fill: 'forwards',
  }).finished;
}

/** The big orb on the home screen (marked with data-big-orb). */
export function findOrb() {
  return document.querySelector<HTMLElement>('[data-big-orb]');
}

/** Ease into the dark, then `open` the page, then fade it in. */
export function zoomIntoOrb(open: () => void) {
  if (busy) {
    return;
  }

  const orb = findOrb();

  if (!orb || calm()) {
    open();
    return;
  }

  busy = true;
  orb.animate([{ scale: '1' }, { scale: '1.6' }], {
    duration: ZOOM_MS,
    easing: 'ease-in-out',
    fill: 'forwards',
  });
  fade(0, VEIL, ZOOM_MS)
    .then(() => {
      stop(orb);
      open();

      return fade(VEIL, 0, REVEAL_MS);
    })
    .finally(() => {
      busy = false;
    });
}

/**
 * BACK: the page fades into the dark, then `goHome` shows the home screen.
 * Call zoomOutOfOrb() once the home screen (and its orb) is on screen.
 */
export function sinkIntoGlow(goHome: () => void) {
  if (busy) {
    return;
  }

  if (calm()) {
    goHome();
    return;
  }

  busy = true;
  pendingOut = true;
  fade(0, VEIL, REVEAL_MS).then(goHome, goHome);
}

/** After sinkIntoGlow's goHome: the orb settles back and the dark lifts. */
export function zoomOutOfOrb() {
  if (!pendingOut) {
    return;
  }

  pendingOut = false;
  const orb = findOrb();

  if (orb) {
    orb.animate([{ scale: '1.6' }, { scale: '1' }], {
      duration: ZOOM_MS,
      easing: 'ease-in-out',
    });
  }

  fade(VEIL, 0, ZOOM_MS).finally(() => {
    busy = false;
  });
}

/** Page bar: a short soft fade between pages. */
export function softSwitch(open: () => void) {
  if (busy || calm()) {
    open();
    return;
  }

  busy = true;
  fade(0, 0.7, 200)
    .then(() => {
      open();

      return fade(0.7, 0, 300);
    })
    .finally(() => {
      busy = false;
    });
}
