import {REGEX_NUMBER} from './util';

export function extractNumber(map, name) {
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

export function calcModifier(attack, defense) {
  let result;
  if (attack > defense) {
    result = 1 + 0.05 * (attack - defense);
  } else if (attack < defense) {
    result = 1 + 0.025 * (attack - defense);
  } else {
    result = 1;
  }
  result = result > 8.0 ? 8.0 : result;
  result = result < 0.01 ? 0.01 : result;
  return result;
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
  const attacking_number = extractNumber(attacking, 'amount');
  const attacking_base_damage = extractNumber(attacking, base_damage_name);
  const defending_additional_defense = extractNumber(defending, 'additional_defense');
  const defending_defense = extractNumber(defending, 'defense');
  const defending_damage_reduction = extractNumber(defending, 'damage_reduction');
  const total_attack = attacking_attack + attacking_additional_attack;
  const total_defense = defending_defense + defending_additional_defense;
  const modifier = calcModifier(total_attack, total_defense);
  let result;
  result = attacking_number * attacking_base_damage;
  result *= modifier;
  result *= 1 - defending_damage_reduction / 100;
  return nanToZero(Math.round(result));
}

function sanitizeResult(additional_attack) {
  const additional_attack_1 = Math.ceil(additional_attack);
  const additional_attack_2 = additional_attack_1 < 0 ? 0 : additional_attack_1;
  const additional_attack_3 = Number.isNaN(additional_attack_2) ? 0 : additional_attack_2;
  return additional_attack_3;
}

export function optimizeAttackingAttack(attacking_avg, defending_th) {
  const a_attack = extractNumber(attacking_avg, 'attack');
  const a_damage = extractNumber(attacking_avg.get('damage'), 'average');
  const a_number = extractNumber(attacking_avg, 'amount');
  const d_additional_defense = extractNumber(defending_th, 'additional_defense');
  const d_defense = extractNumber(defending_th, 'defense');
  const d_reduction = 1 - extractNumber(defending_th, 'damage_reduction') / 100;
  const d_total_health = extractNumber(defending_th, 'total_health');
  const d_total_defense = d_defense + d_additional_defense;
  const calcAdditionalAttack = (multiplier, modifier_cap) => {
    let a_attack_opt;
    a_attack_opt = d_total_health
    a_attack_opt += a_damage * a_number * d_reduction * (d_total_defense * multiplier - 1);
    a_attack_opt /= a_damage * a_number * d_reduction * multiplier;
    const additional_attack_1 = a_attack_opt - a_attack;
    const additional_attack_2 = sanitizeResult(additional_attack_1);
    const modifier = 1 + multiplier * (a_attack + additional_attack_2 - d_total_defense);
    if (modifier < 0.01 || 8.0 < modifier) {
      let total_attack_alt;
      total_attack_alt = (multiplier * d_total_defense + modifier_cap - 1);
      total_attack_alt /= multiplier;
      return sanitizeResult(total_attack_alt - a_attack);
    } else {
      return additional_attack_2;
    }
  }
  const a_multiplier = 0.05;
  const a_modifier_cap = 8.0;
  const additional_attack = calcAdditionalAttack(a_multiplier, a_modifier_cap);
  if (additional_attack + a_attack < d_total_defense) {
    const d_modifier_cap = 0.01;
    const d_multiplier = 0.025;
    return calcAdditionalAttack(d_multiplier, d_modifier_cap);
  } else {
    return additional_attack;
  }
}

export function optimizeAttackingNumber(attacking_avg, defending_th) {
  const a_attack = extractNumber(attacking_avg, 'attack');
  const a_damage = extractNumber(attacking_avg.get('damage'), 'average');
  const a_additional_attack = extractNumber(attacking_avg, 'additional_attack');
  const d_additional_defense = extractNumber(defending_th, 'additional_defense');
  const d_defense = extractNumber(defending_th, 'defense');
  const d_reduction = 1 - extractNumber(defending_th, 'damage_reduction') / 100;
  const d_total_health = extractNumber(defending_th, 'total_health');
  const a_total_attack = a_attack + a_additional_attack;
  const d_total_defense = d_defense + d_additional_defense;
  const modifier = calcModifier(a_total_attack, d_total_defense);
  const number = d_total_health / (modifier * a_damage * d_reduction);
  const number_1 = Math.ceil(number);
  const number_2 = Number.isNaN(number_1) ? 0 : number_1;
  return number_2;
}
