// Number and text formatting shared by every view.

const nf = new Map();
function formatter(digits) {
  if (!nf.has(digits)) {
    nf.set(digits, new Intl.NumberFormat('en-GB', { minimumFractionDigits: digits, maximumFractionDigits: digits }));
  }
  return nf.get(digits);
}

export function num(value, digits = 0, signed = false) {
  const text = formatter(digits).format(value);
  return signed && value > 0 ? `+${text}` : text;
}

export function value(ind, v) {
  return num(v, ind.digits, ind.signed);
}

// The change from the previous observation, as text and a direction for colouring.
export function change(ind, now, before) {
  const diff = now[1] - before[1];
  const pts = ind.unit.startsWith('%');
  const text = `${diff > 0 ? '+' : diff < 0 ? '−' : '±'}${num(Math.abs(diff), ind.digits)}${pts ? ' pts' : ''}`;
  return { text, dir: diff > 0 ? 'up' : diff < 0 ? 'down' : 'flat', since: before[0] };
}

export function esc(text) {
  return String(text).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
}
