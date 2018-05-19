let n = 0;

export function uniqueId() {
  return new Date().getTime();
}

export function uniqueId2() {
  return n++;
}
