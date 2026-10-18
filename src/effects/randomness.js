export function between(minimum, maximum) {
  return minimum + Math.random() * (maximum - minimum);
}

export function pick(options) {
  return options[Math.floor(Math.random() * options.length)];
}
