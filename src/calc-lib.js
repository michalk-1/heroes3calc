
function verifyIsNumber(obj, name) {
  if (typeof obj[name] !== 'number') {
    throw TypeError(name + " is not a number.");
  }
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
  verifyIsNumber(defending, 'additional_defense');
  verifyIsNumber(defending, 'attack');
  verifyIsNumber(defending, 'defense');
  verifyIsNumber(attacking, 'amount');
  verifyIsNumber(attacking, base_damage_name);
  const result = attacking.amount * attacking[base_damage_name];
  let mod = 1 + modifier(attacking.attack + attacking.additional_attack, defending.defense + defending.additional_defense);
  mod = mod > 8.0 ? 8.0 : mod;
  mod = mod < 0.01 ? 0.01 : mod;
  return Math.round(result * mod);
}

export function totalHealth(defending)
{
  verifyIsNumber(defending, 'amount');
  verifyIsNumber(defending, 'health');
  return defending.health * defending.amount;
}
