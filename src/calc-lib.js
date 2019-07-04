import {REGEX_NUMBER} from './util.js';
import {Map} from 'immutable';

function extractNumber(map, name) {
  return verifyIsNumber(map.get(name), name);
}

function verifyIsNumber(value, name) {
  if (!(typeof value === 'number') && !REGEX_NUMBER.test(value)) {
    throw TypeError(name + " is not a number (" + String(value) + ").");
  }
  return Number(value);
}

export function verify(obj, name, pred) {
  if (!pred(obj))
    throw TypeError("Assertion " + pred.name + " failed for '" + name + "'.");
}

function saturateToZero(value) {
  return value < 0 ? 0 : value;
}

function nanToZero(value) {
  return Number.isNaN(value) ? 0 : value;
}

export function calcTotalHealth(army) {
  verify(army, 'calcTotalHealth.army', Map.isMap);
  const amount = extractNumber(army, 'amount');
  const health = extractNumber(army, 'health');
  const total_health = nanToZero(amount * health);
  return army.withMutations(army => {
    army.set('amount', amount);
    army.set('health', health);
    army.set('total_health', total_health);
  });
}

export function calcAverage(data) {
  return data.set('average', 0.5 * (data.get('minimum') + data.get('maximum')));
}

export function calcLosses(army, damage) {
  verify(army, 'calcLosses.army', Map.isMap);
  verify(damage, 'calcLosses.damages', Map.isMap);
  const amount = army.get('amount');
  const health = army.get('health');
  const total_health = army.get('total_health');

  let losses = damage.map(damage => {
    const lost = amount - Math.ceil(saturateToZero((total_health - damage) / health));
    return nanToZero(lost);
  });

  let remaining = losses.map(lost => amount - lost);
  remaining = remaining.withMutations(x => {
    x.set('minimum', remaining.get('maximum'));
    x.set('maximum', remaining.get('minimum'));
  });

  return army.withMutations(army => {
    army.set('total_health', total_health);
    army.set('losses', losses);
    army.set('remaining', remaining);
    // TODO: calculate health: lost & remaining health (not totals)
  });
}

function modifier(attack, defense) {
  if (attack > defense) {
    return 0.05 * (attack - defense);
  } else if (attack < defense) {
    return 0.025 * (attack - defense);
  } else {
    return 0;
  }
}

export function calcMin(attacking, defending)
{
  return calcDamage(attacking, defending, 'minimum_damage');
}

export function calcMax(attacking, defending)
{
  return calcDamage(attacking, defending, 'maximum_damage');
}

function calcDamage(attacking, defending, base_damage_name)
{
  const attacking_additional_attack = extractNumber(attacking, 'additional_attack');
  const attacking_attack = extractNumber(attacking, 'attack');
  const attacking_amount = extractNumber(attacking, 'amount');
  const attacking_base_damage = extractNumber(attacking, base_damage_name);
  const defending_additional_defense = extractNumber(defending, 'additional_defense');
  const defending_defense = extractNumber(defending, 'defense');
  const defending_damage_reduction = extractNumber(defending, 'damage_reduction');

  let mod = 1 + modifier(attacking_attack + attacking_additional_attack,
                         defending_defense + defending_additional_defense);
  mod = mod > 8.0 ? 8.0 : mod;
  mod = mod < 0.01 ? 0.01 : mod;

  let result = attacking_amount * attacking_base_damage;
  result *= mod;
  result *= 1 - defending_damage_reduction / 100;
  return nanToZero(Math.round(result));
}
