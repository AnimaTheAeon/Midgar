// Box of X: opening a page from home zooms into the big orb until it fills
// the window and flares lime, then the page fades in out of the glow. BACK
// plays it in reverse. Same timing as Jenova, Lifestream, Turks and Materia.

const ZOOM_MS = 500;
const REVEAL_MS = 350;
const EASE_IN = 'cubic-bezier(.32, 0, .67, 0)';
const EASE_OUT = 'cubic-bezier(.33, 1, .68, 1)';

let busy = false;
let pendingOut = false;

function calm() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function glowLayer(): HTMLElement {
  let glow = document.getElementById('boxofx-zoom');

  if (!glow) {
    glow = document.createElement('div');
    glow.id = 'boxofx-zoom';
    Object.assign(glow.style, {
      position: 'fixed',
      inset: '0',
      background: '#aaec3c',
      opacity: '0',
      pointerEvents: 'none',
      zIndex: '9999',
    });
    document.body.appendChild(glow);
  }

  return glow;
}

// How much the orb must grow to cover the window from its center.
function coverScale(orb: HTMLElement) {
  const box = orb.getBoundingClientRect();
  const cx = box.left + box.width / 2;
  const cy = box.top + box.height / 2;
  const corners = [
    [0, 0],
    [window.innerWidth, 0],
    [0, window.innerHeight],
    [window.innerWidth, window.innerHeight],
  ];
  const reach = Math.max(
    ...corners.map(([x, y]) => Math.hypot(x - cx, y - cy))
  );

  return (reach * 1.15) / (box.width / 2 || 1);
}

function stop(element: Element) {
  element.getAnimations().forEach((a) => a.cancel());
}

/** The big orb on the home screen (marked with data-big-orb). */
export function findOrb() {
  return document.querySelector<HTMLElement>('[data-big-orb]');
}

/** Zoom into the orb, then `open` the page, then fade it in. */
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
  const glow = glowLayer();
  const scale = coverScale(orb);

  orb.style.zIndex = '40';
  orb.animate([{ scale: '1' }, { scale: String(scale) }], {
    duration: ZOOM_MS,
    easing: EASE_IN,
    fill: 'forwards',
  });
  glow
    .animate([{ opacity: 0 }, { opacity: 0, offset: 0.55 }, { opacity: 1 }], {
      duration: ZOOM_MS,
      easing: 'ease-in',
      fill: 'forwards',
    })
    .finished.then(() => {
      stop(orb);
      orb.style.zIndex = '';
      open();
      stop(glow);

      return glow.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: REVEAL_MS,
        easing: 'ease-out',
        fill: 'forwards',
      }).finished;
    })
    .finally(() => {
      busy = false;
    });
}

/**
 * BACK: the page sinks into the glow, then `goHome` shows the home screen.
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
  const glow = glowLayer();

  stop(glow);
  glow
    .animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: REVEAL_MS,
      easing: 'ease-in',
      fill: 'forwards',
    })
    .finished.then(goHome, goHome);
}

/** After sinkIntoGlow's goHome: the orb shrinks back from full-window. */
export function zoomOutOfOrb() {
  if (!pendingOut) {
    return;
  }

  pendingOut = false;
  const glow = glowLayer();
  const orb = findOrb();

  if (orb) {
    const scale = coverScale(orb);

    orb.style.zIndex = '40';
    orb
      .animate([{ scale: String(scale) }, { scale: '1' }], {
        duration: ZOOM_MS,
        easing: EASE_OUT,
      })
      .finished.finally(() => {
        orb.style.zIndex = '';
      });
  }

  stop(glow);
  glow
    .animate([{ opacity: 1 }, { opacity: 0, offset: 0.45 }, { opacity: 0 }], {
      duration: ZOOM_MS,
      easing: 'ease-out',
      fill: 'forwards',
    })
    .finished.finally(() => {
      busy = false;
    });
}
