import {NUMBER_NAMES} from './data.js';
import Immutable from 'immutable';


export const REGEX_NUMBER = /^\+?(0*)((0|[1-9]\d*)(\.\d*)?)$/;

export function parseType(name, value, previous_value) {
  if (NUMBER_NAMES.indexOf(name) !== -1) {
    return parseNumber(name, value, previous_value);
  } else {
    return value;
  }
}

export function console_log(...args)  {
  // console.log(...args);
}

const hasOwnProperty = Object.prototype.hasOwnProperty;

export function str(mapping) {
  let object = mapping;
  if (Immutable.isMap(mapping)) {
    object = mapping.toJS();
  }
  if (typeof object === "object") {
    for (let key of Object.keys(object)) {
      let value = object[key];
      if (typeof value === 'object' && value !== null && hasOwnProperty.call(object, 'image')) {
        delete object.image;
      }
    }
    if (hasOwnProperty.call(object, 'image')) {
      delete object.image;
    }
    return JSON.stringify(object);
  }
  return String(object);
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
