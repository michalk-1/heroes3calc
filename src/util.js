import { NUMBER_NAMES } from  './data.js';

export const REGEX_NUMBER = /^\+?(0*)((0|[1-9]\d*)(\.\d*)?)$/;

export function parseType(name, value, previous_value) {
  if (NUMBER_NAMES.indexOf(name) !== -1) {
    return parseNumber(name, value, previous_value);
  } else {
    return value;
  }
}

function parseNumber(name, value, previous_value) {
  value = String(value);
  if (value === '') return '0';
  const re = value.match(REGEX_NUMBER);
  if (re === null) {
    if (previous_value === undefined) return '0';
    else return parseNumber(name, previous_value, '0');
  }
  let result = re[2];

  if (name === 'damage_reduction' && Number(result) > 100) {
    return parseNumber(name, previous_value, '0');
  }
  else
    return result;
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
