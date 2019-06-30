import { REGEX_NUMBER } from './util.js';
import { memoize, Immutable, isImmutable } from './immutable-lib.js';

function verifyIsNumber(obj, name) {
  if (!REGEX_NUMBER.test(obj[name])) {
    throw TypeError(name + " is not a number (" + String(obj[name]) + ").");
  }
}

function verifyIsImmutable(obj, name) {
  if (!isImmutable(obj))
    throw TypeError("Expected an immutable object in '" + name + "'.");
}

function nonNegative(value) {
  return value < 0 ? 0 : value;
}

function nanToZero(value) {
  return Number.isNaN(value) ? 0 : value;
}

export function calcTotalHealth(army)
{
  verifyIsNumber(army, 'amount');
  verifyIsNumber(army, 'health');
  army = Immutable.set(army, 'amount', Number(army.amount));
  army = Immutable.set(army, 'health', Number(army.health));
  return Immutable.set(army, 'total_health', nanToZero(army.amount * army.health));
}

export function calcLosses(army, damage_string) {
  verifyIsNumber({damage: damage_string}, 'damage');
  verifyIsImmutable(army, 'calcLosses.army');
  const damage = Number(damage_string);
  army = calcTotalHealth(army);
  const remaining = Math.ceil(nonNegative((army.total_health - damage) / army.health));
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

export function stateUpdate(attacking, defending) {
  const minimum_damage = calcMin(attacking, defending);
  const maximum_damage = calcMax(attacking, defending);
  const average_damage = 0.5 * (minimum_damage + maximum_damage);
  const defending_minimum_losses = calcLosses(defending, minimum_damage);
  const defending_average_losses = calcLosses(defending, average_damage);
  const defending_maximum_losses = calcLosses(defending, maximum_damage);
  const defending_minimum_units_left = defending.amount - defending_maximum_losses;
  const defending_average_units_left = defending.amount - defending_average_losses;
  const defending_maximum_units_left = defending.amount - defending_minimum_losses;
  const defending_minimum_damage = calcMin(Object.assign({}, defending, {amount: defending_minimum_units_left}), attacking);
  const defending_maximum_damage = calcMax(Object.assign({}, defending, {amount: defending_maximum_units_left}), attacking);
  const defending_average_damage = 0.5 * (defending_minimum_damage + defending_maximum_damage);
  const minimum_losses = calcLosses(attacking, defending_minimum_damage);
  const average_losses = calcLosses(attacking, defending_average_damage);
  const maximum_losses = calcLosses(attacking, defending_maximum_damage);
  const minimum_units_left = attacking.amount - maximum_losses;
  const average_units_left = attacking.amount - average_losses;
  const maximum_units_left = attacking.amount - minimum_losses;
  return {
    attacking: attacking,
    defending: defending,
    minimum_damage: minimum_damage,
    average_damage: average_damage,
    maximum_damage: maximum_damage,
    minimum_losses: minimum_losses,
    average_losses: average_losses,
    maximum_losses: maximum_losses,
    minimum_units_left: minimum_units_left,
    average_units_left: average_units_left,
    maximum_units_left: maximum_units_left,
    defending_minimum_damage: defending_minimum_damage,
    defending_average_damage: defending_average_damage,
    defending_maximum_damage: defending_maximum_damage,
    defending_minimum_losses: defending_minimum_losses,
    defending_average_losses: defending_average_losses,
    defending_maximum_losses: defending_maximum_losses,
    defending_minimum_units_left: defending_minimum_units_left,
    defending_average_units_left: defending_average_units_left,
    defending_maximum_units_left: defending_maximum_units_left,
  };
}
