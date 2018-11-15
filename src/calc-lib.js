function verifyIsNumber(obj, name) {
  if (typeof obj[name] !== 'number') {
    throw TypeError(name + " is not a number.");
  }
}

export function calcAverage(obj) {
  verifyIsNumber(obj, 'min');
  verifyIsNumber(obj, 'max');
  return 0.5 * (obj.min + obj.max);
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
  const result = attacking.amount * attacking[base_damage_name];
  let mod = 1 + modifier(attacking.attack + attacking.additional_attack, defending.defense + defending.additional_defense);
  mod = mod > 8.0 ? 8.0 : mod;
  mod = mod < 0.01 ? 0.01 : mod;
  return Math.round(result * mod);
}

export function calcTotalHealth(defending)
{
  verifyIsNumber(defending, 'amount');
  verifyIsNumber(defending, 'health');
  return defending.health * defending.amount;
}
