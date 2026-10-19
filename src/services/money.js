const pesos = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

export function format_price(amount) {
  return pesos.format(amount);
}
