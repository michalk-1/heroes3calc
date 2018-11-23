import { REGEX_NUMBER } from './util.js';

function verifyIsNumber(obj, name) {
  if (!REGEX_NUMBER.test(obj[name])) {
    throw TypeError(name + " is not a number (" + String(obj[name]) + ").");
  }
}

function nonNegative(value) {
  return value < 0 ? 0 : value;
}

function nanToZero(value) {
  return Number.isNaN(value) ? 0 : value;
}

export function calcLosses(army, damage) {
  verifyIsNumber({damage: damage}, 'damage');
  verifyIsNumber(army, 'amount');
  verifyIsNumber(army, 'health');
  army = {
    amount: Number(army.amount),
    health: Number(army.health),
  };
  damage = Number(damage);
  const total_health = calcTotalHealth(army);
  const remaining = Math.ceil(nonNegative((total_health - damage) / army.health));
  const losses = army.amount - remaining;
  return nanToZero(losses);
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
  verifyIsNumber(attacking, 'additional_attack');
  verifyIsNumber(attacking, 'attack');
  verifyIsNumber(attacking, 'amount');
  verifyIsNumber(attacking, base_damage_name);
  verifyIsNumber(defending, 'additional_defense');
  verifyIsNumber(defending, 'defense');
  verifyIsNumber(defending, 'damage_reduction');
  const attacking_attack = Number(attacking.attack);
  const attacking_additional_attack = Number(attacking.additional_attack);
  const attacking_amount = Number(attacking.amount);
  const attacking_base_damage = Number(attacking[base_damage_name]);
  const defending_defense = Number(defending.defense);
  const defending_additional_defense = Number(defending.additional_defense);
  const defending_damage_reduction = Number(defending.damage_reduction);

  let mod = 1 + modifier(attacking_attack + attacking_additional_attack,
                         defending_defense + defending_additional_defense);
  mod = mod > 8.0 ? 8.0 : mod;
  mod = mod < 0.01 ? 0.01 : mod;

  let result = attacking_amount * attacking_base_damage;
  result *= mod;
  result *= 1 - defending_damage_reduction / 100;
  return nanToZero(Math.round(result));
}

export function calcTotalHealth(defending)
{
  verifyIsNumber(defending, 'amount');
  verifyIsNumber(defending, 'health');
  defending = {
    amount: Number(defending.amount),
    health: Number(defending.health),
  };
  const result = defending.health * defending.amount;
  return nanToZero(result);
}
