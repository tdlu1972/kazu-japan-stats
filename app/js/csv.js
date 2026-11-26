// CSV downloads made in the browser from the figures on screen: no request leaves the page.

export function csvLink(filename, header, rows) {
  const text = [header, ...rows].map((r) => r.map(cell).join(',')).join('\n');
  return `<a class="btn ghost" download="${filename}" data-csv="${encodeURIComponent(text)}" href="#">Download CSV</a>`;
}

function cell(v) {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// Clicking a CSV link turns its text into a file the browser saves.
export function bindCsv(root) {
  root.addEventListener('click', (event) => {
    const a = event.target.closest('a[data-csv]');
    if (!a) return;
    event.preventDefault();
    const blob = new Blob([decodeURIComponent(a.dataset.csv)], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const tmp = document.createElement('a');
    tmp.href = url;
    tmp.download = a.getAttribute('download');
    tmp.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
}
