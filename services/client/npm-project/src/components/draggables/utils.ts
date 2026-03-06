export function onChangeRotate(e: Event): number {
  const elem = e.target as HTMLInputElement;
  const res = modulo(Number(elem.value), 360);
  elem.value = String(res);
  return res;
}

export function onInputRotate(e: InputEvent, fallback: number): number {
  if (e.data === "-") return fallback;
  const input = e.target as HTMLInputElement;
  if (input.value === "") input.value = "0";
  return Number(input.value) || 0;
}

export function onInputRange(e: InputEvent, max: number): number {
  const elem = e.target as HTMLInputElement;
  const res = Math.min(Math.max(Number(elem.value) || 0, 0), max);
  elem.value = String(res);
  return res;
}

export function modulo(n: number, d: number) {
  return ((n % d) + d) % d;
}
