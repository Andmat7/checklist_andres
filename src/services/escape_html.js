const replacements = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escape_html(text) {
  return text.replace(/[&<>"']/g, (character) => replacements[character]);
}
