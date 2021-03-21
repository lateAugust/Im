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

export function formatRawData<T, C>(array: T[]): C[] {
  let list = [];
  for (let item of array) {
    let obj = {};
    for (let [key, val] of Object.entries(item)) {
      let keys = processUnderlineKey(key);
      let prop = keys[0];
      keys.splice(0, 1); // 删除第一个, 其他的为了防止pin_yin这种, 按照原字段名返回
      let props = keys.join('_');
      obj[prop] = obj[prop] || {};
      obj[prop][props] = val;
    }
    list.push(obj);
  }
  return list;
}

export function transferToString(data: any): string {
  return JSON.stringify(data);
}

export function transferToObject<T>(data: string): T {
  return JSON.parse(data);
}

export function leftJoinOn(repository: string, field: string, id: number): string {
  return `${repository}.public_id = CONCAT(${field} , ',' , ${id}) OR ${repository}.public_id = CONCAT(${id}, ',' , ${field})`;
}

export function wherePublicId(fields: [string, string], id: number): string {
  return `IF(${fields[0]} > ${fields[1]}, CONCAT(${fields[0]}, ',', ${fields[1]}), CONCAT(${fields[1]}, ',', ${fields[0]})) = public_id`;
}
