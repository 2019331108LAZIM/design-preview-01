// Justified photo grid: rows are packed to a target height and each row is
// then scaled to fill the container's width exactly, so every image keeps
// its own native aspect ratio — no object-fit: cover, no cropped heads or
// clipped edges. Same technique Google Photos/Flickr use for mixed
// portrait/landscape sets. Requires each item's real width/height (already
// known from the image pipeline — see assets/data/images*.json — so nothing
// has to be loaded just to be measured).
//
// The DOM is built once (one element per photo, via renderFigure); resizing
// only rewrites each row wrapper's height and each figure's width — it
// never recreates elements, so a large gallery (150+ photos) stays cheap to
// relayout on every breakpoint/orientation change.

const GAP = 14;

function targetRowHeight(containerWidth) {
  return containerWidth <= 640 ? 200 : 310;
}

// Walks items in order, summing each one's width at the target row height
// until the row would meet/exceed the container width, then closes the row
// and scales its height so the row's total width matches the container
// exactly (this is what makes rows "justified" rather than ragged).
//
// When the item that tips a row over the edge is compared, two candidate
// rows are on the table: with it (scaled down to fit) or without it (the
// row one item shorter, scaled up to fit instead). Whichever lands closer
// to the target height wins. Without this, a narrow container (mobile)
// tends to end up cramming one extra image into a row purely because it
// technically still fits under containerWidth, at the cost of squashing
// every image in that row well below the target height to make room.
function packRows(items, containerWidth, targetHeight) {
  const rows = [];
  let row = [];       // entries for the row currently being built
  let sumWidth = 0;    // sum of (ratio * targetHeight) for `row`

  for (let i = 0; i < items.length; i++) {
    const ratio = items[i].w / items[i].h;
    const w = ratio * targetHeight;
    row.push({ i, ratio });
    sumWidth += w;
    const gapsWith = (row.length - 1) * GAP;
    if (sumWidth + gapsWith < containerWidth) continue;

    const scaleWith = (containerWidth - gapsWith) / sumWidth;
    const heightWith = targetHeight * scaleWith;

    if (row.length > 1) {
      const withoutLast = row.slice(0, -1);
      const sumWithoutLast = sumWidth - w;
      const gapsWithout = (withoutLast.length - 1) * GAP;
      const scaleWithout = (containerWidth - gapsWithout) / sumWithoutLast;
      const heightWithout = targetHeight * scaleWithout;
      if (Math.abs(heightWithout - targetHeight) < Math.abs(heightWith - targetHeight)) {
        rows.push({ entries: withoutLast, height: heightWithout });
        row = [{ i, ratio }];
        sumWidth = w;
        continue;
      }
    }

    rows.push({ entries: row, height: heightWith });
    row = [];
    sumWidth = 0;
  }
  // Leftover row that never reached a full width: left as-is at the target
  // height, left-aligned — stretching a near-empty last row to fill the
  // container looks worse than leaving it short.
  if (row.length) rows.push({ entries: row, height: targetHeight, isLast: true });
  return rows;
}

/**
 * @param {HTMLElement} container
 * @param {Array<{w:number,h:number}>} items - real intrinsic dimensions
 * @param {(item, index) => HTMLElement} renderFigure - builds the (never
 *   rebuilt) element for one photo; this component only ever sets its
 *   width/height, it doesn't touch what's inside.
 * @returns {{ relayout: () => void, disconnect: () => void }}
 */
export function renderJustifiedGallery(container, items, renderFigure) {
  // Sizing lands on the figure as a width + a --jr-ratio custom property
  // (not a height) — CSS applies the ratio via aspect-ratio on the actual
  // image box (see .gallery-item__btn in event.css), so a caption below the
  // image never eats into the image's own packed height. Rows are then
  // free to auto-size to their content instead of forcing every item to a
  // literal row height that includes caption text.
  const figures = items.map((item, i) => {
    const fig = renderFigure(item, i);
    fig.style.flex = 'none';
    return fig;
  });

  function relayout() {
    const containerWidth = container.clientWidth;
    if (!containerWidth || !items.length) return;
    const targetHeight = targetRowHeight(containerWidth);
    const rows = packRows(items, containerWidth, targetHeight);

    container.innerHTML = '';
    for (const row of rows) {
      const rowEl = document.createElement('div');
      rowEl.className = 'justified-row';
      // Purely a layout wrapper — if the container is role="list" (event.js
      // gives its gallery one), this row div sits between the list and its
      // role="listitem" figures, so it must not itself be exposed as an
      // unrelated list item.
      rowEl.setAttribute('role', 'presentation');
      for (const { i, ratio } of row.entries) {
        const fig = figures[i];
        fig.style.width = `${ratio * row.height}px`;
        fig.style.setProperty('--jr-ratio', String(ratio));
        rowEl.appendChild(fig);
      }
      container.appendChild(rowEl);
    }
  }

  relayout();

  // Recompute on resize/orientation change — the packing depends entirely
  // on container width. Debounced via rAF coalescing so a drag-resize
  // doesn't thrash layout on every intermediate pixel.
  let raf = null;
  const ro = new ResizeObserver(() => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(relayout);
  });
  ro.observe(container);

  return { relayout, disconnect: () => ro.disconnect() };
}
