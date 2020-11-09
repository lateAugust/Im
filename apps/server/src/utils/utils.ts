export function propEmpty(val: any): boolean {
  return (
    /(number|boolean)/gi.test(typeof val) ||
    (!/\[object (undefined|null)]/gi.test(Object.prototype.toString.call(val)) && !!val)
  );
}

export function updateValues(object: object): string {
  let values = ' ';
  for (let [key, val] of Object.entries(object)) {
    val = propEmpty(val) ? val : null;
    val = typeof val === 'string' ? `\'${val}\'` : val;
    values += `${key}=${val},`;
  }
  return values.substr(0, values.length - 1);
}
