// Maps a decorative accent-ink CSS var (used for fills/backgrounds/borders,
// e.g. "var(--terra)") to its text/UI-safe counterpart (e.g. "var(--terra-ui)")
// for the few places data assigns an ink directly to text (section kickers,
// series stat numbers/badges). See tokens.css for why these differ.
const MAP = {
  'var(--terra)': 'var(--terra-ui)',
  'var(--teal)': 'var(--teal-ui)',
  'var(--green)': 'var(--green-ui)',
  'var(--gold)': 'var(--gold-ui)',
  'var(--red)': 'var(--red-ui)'
};

export function inkTextVar(ink) {
  return MAP[ink] ?? ink;
}
