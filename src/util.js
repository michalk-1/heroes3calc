import { NUMBER_NAMES } from  './data.js';

export function parseType(name, value) {
  if (NUMBER_NAMES.indexOf(name) !== -1) {
    let result = Number(value);
    result = Number.isNaN(result) ? 0 : result;
    result = result < 0 ? 0 : result;
    if (name === 'damage_reduction') {
      return result > 100 ? 100 : result;
    } else {
      return result;
    }
  } else {
    return value;
  }
}

export function objectMap(obj, func) {
  return Object.assign(...Object.entries(obj).map(func));
}

export function parseObject(obj) {
  return objectMap(obj, ([k, v]) => ({[k]: parseType(k, v)}));
}

export function partial(fn /*, rest args */){
  return fn.bind.apply(fn, Array.apply(null, arguments).slice(1));
}

export function toggleClass(class_name) {
    return class_name === 'attacking' ? 'defending' : 'attacking'
}

export function deepcopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}
