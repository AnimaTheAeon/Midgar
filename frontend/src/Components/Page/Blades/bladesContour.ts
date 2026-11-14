// Moves a row right by dx and narrows it by the same amount, so its right
// end stays where it was instead of running past the blade's edge.
function shiftRow(el: HTMLElement, dx: number) {
  el.style.translate = dx ? `${dx}px 0` : '';
  el.style.maxWidth = dx ? `calc(100% - ${dx}px)` : '';
}

// Blades: rows follow the open blade's curved left edge. Each row shifts
// right by how far the curve comes in at its height (the most it comes in
// over the row's span), so nothing runs into the curve near the top and
// bottom. Re-run on scroll, resize and page changes.
export default function bladesContour(
  stage: HTMLElement,
  bodySel: string,
  panelSel: string
) {
  let queued = false;
  let shifted = new Set<HTMLElement>();
  const visible = (e: Element) => {
    const r = e.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  // Children, looking through display: contents wrappers (they have no box).
  const kidsOf = (el: Element): HTMLElement[] =>
    [...el.children].flatMap((c) => {
      if (getComputedStyle(c).display === 'contents') {
        return kidsOf(c);
      }

      return visible(c) ? [c as HTMLElement] : [];
    });
  const pick = (el: HTMLElement, out: HTMLElement[]) => {
    if (!visible(el)) return;
    const h = el.getBoundingClientRect().height;
    const kids = kidsOf(el);
    const t0 = kids.length ? kids[0].getBoundingClientRect().top : 0;
    const stacked =
      kids.length > 1 &&
      kids.some((k) => Math.abs(k.getBoundingClientRect().top - t0) > 4);
    if (h > 90 && (stacked || kids.length === 1))
      kids.forEach((k) => pick(k, out));
    else if (h > 90 && kids.length > 1) {
      // Side-by-side columns: only the leftmost one meets the curve.
      const left = kids.reduce((a, b) =>
        b.getBoundingClientRect().left < a.getBoundingClientRect().left ? b : a
      );
      pick(left, out);
    } else out.push(el);
  };
  const run = () => {
    queued = false;
    const open = stage.querySelector<HTMLElement>(bodySel);
    const panel = open && open.closest<HTMLElement>(panelSel);
    const next = new Set<HTMLElement>();
    if (open && panel) {
      const pr = panel.getBoundingClientRect();
      const br = open.getBoundingClientRect();
      const r =
        parseFloat(getComputedStyle(stage).getPropertyValue('--r')) || 44;
      const mid = pr.top + pr.height / 2;
      const half = pr.height / 2;
      const arc = (y: number) => {
        const d = Math.max(-1, Math.min(1, (y - mid) / half));
        return r * (1 - Math.sqrt(1 - d * d));
      };
      const rows: HTMLElement[] = [];
      kidsOf(open).forEach((c) => pick(c, rows));
      for (const el of rows) {
        shiftRow(el, 0);
        const er = el.getBoundingClientRect();
        const top = Math.max(er.top, br.top);
        const bot = Math.min(er.bottom, br.bottom);
        const dx = bot > top ? Math.round(Math.max(arc(top), arc(bot))) : 0;
        if (dx > 0) {
          shiftRow(el, dx);
          next.add(el);
        }
      }
    }
    shifted.forEach((el) => {
      if (!next.has(el)) shiftRow(el, 0);
    });
    shifted = next;
  };
  const queue = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(run);
    }
  };
  stage.addEventListener('scroll', queue, true);
  addEventListener('resize', queue);
  stage.addEventListener('transitionend', queue);
  const mo = new MutationObserver(queue);
  mo.observe(stage, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'hidden', 'open'],
  });
  queue();
  return {
    refresh: queue,
    stop: () => {
      mo.disconnect();
      stage.removeEventListener('scroll', queue, true);
      removeEventListener('resize', queue);
      stage.removeEventListener('transitionend', queue);
      shifted.forEach((el) => {
        shiftRow(el, 0);
      });
      shifted.clear();
    },
  };
}
