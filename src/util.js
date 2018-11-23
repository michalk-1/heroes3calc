import { NUMBER_NAMES } from  './data.js';

export const REGEX_NUMBER = /^\+?(0*)((0|[1-9]\d*)(\.\d*)?)$/;

export function parseType(name, value, previous_value) {
  if (NUMBER_NAMES.indexOf(name) !== -1) {
    return parseNumber(value, previous_value);
  } else {
    return value;
  }
}

function parseNumber(value, previous_value) {
  value = String(value);
  const re = value.match(REGEX_NUMBER);
  if (re === null) {
    if (previous_value === undefined) return '0';
    else return previous_value;
  }
  return re[2];
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
