/** A plain file download works on every phone and desktop, with no account or server behind it. */
export function download_json(data, file_name) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = file_name;
  link.click();
  // Some browsers start reading the file after click() returns, so the URL is freed a moment later.
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}
