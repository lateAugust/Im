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

export function pagination(page: number, page_size: number): string {
  return ` ${Math.max(0, page - 1) * page_size},${page_size}`;
}

export function dataType(v: any): string {
  let type = {
    '[object String]': 'string',
    '[object Number]': 'number',
    '[object Boolean]': 'boolean',
    '[object Symbol]': 'Symbol',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Function]': 'function',
    '[object Date]': 'date',
    '[object Array]': 'array',
    '[object RegExp]': 'regexp',
    '[object Object]': 'object',
    '[object Error]': 'error',
    '[object HTMLDocument]': 'htmlDocument',
    '[object Window]': 'window'
  };
  return type[Object.prototype.toString.call(v)];
}

export function sortReturnString(n1: number, n2: number): string {
  let array: number[] = [n1, n2].sort((a, b) => a - b);
  return array.join(',');
}

export function processUnderlineKey(key: string) {
  return key.split('_');
}

export function processIncludeUnderlineKeyObject<T, C>(array: T[]): C[] {
  let list = [];
  for (let item of array) {
    let obj = {};
    for (let [key, val] of Object.entries(item)) {
      let [prop, props] = processUnderlineKey(key);
      obj[prop] = obj[prop] || {};
      obj[prop][props] = val;
    }
    list.push(obj);
  }
  return list;
}
