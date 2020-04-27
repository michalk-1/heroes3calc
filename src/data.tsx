export const TOWNS = [
  'Castle',
  'Rampart',
  'Tower',
  'Inferno',
  'Necropolis',
  'Dungeon',
  'Stronghold',
  'Fortress',
  'Conflux',
  'Cove',
  'Neutral',
];

export const HEROES = {
  knight: {
    air_magic: 3,
    earth_magic: 2,
    fire_magic: 1,
    water_magic: 4,
    earth_lvl4: 0.20,
  },
  ranger: {
    air_magic: 1,
    earth_magic: 3,
    fire_magic: 0,
    water_magic: 3,
    earth_lvl4: 0.42,
  },
  demoniac: {
    air_magic: 2,
    earth_magic: 3,
    fire_magic: 4,
    water_magic: 1,
    earth_lvl4: 0.30,
  },
  death_knight: {
    air_magic: 2,
    earth_magic: 4,
    fire_magic: 1,
    water_magic: 3,
    earth_lvl4: 0.40,
  },
  overlord: {
    air_magic: 1,
    earth_magic: 3,
    fire_magic: 2,
    water_magic: 0,
    earth_lvl4: 0.50,
  },
  barbarian: {
    air_magic: 3,
    earth_magic: 3,
    fire_magic: 2,
    water_magic: 0,
    earth_lvl4: 0.38,
  },
  beastmaster: {
    air_magic: 1,
    earth_magic: 3,
    fire_magic: 0,
    water_magic: 2,
    earth_lvl4: 0.50,
  },
  planeswalker: {
    air_magic: 2,
    earth_magic: 3,
    fire_magic: 3,
    water_magic: 2,
    earth_lvl4: 0.30,
  },
  captain: {
    air_magic: 3,
    earth_magic: 4,
    fire_magic: 2,
    water_magic: 2,
    earth_lvl4: 0.36,
  },
};

export const TITLES = {
  additional_attack: 'Additional Attack',
  additional_defense: 'Additional Defense',
  ai_value: 'AI Value',
  amount: 'Number',
  attack: 'Attack',
  attacking: 'Attacking',
  cost: 'Cost',
  damage_reduction: 'Damage Reduction [%]',
  defending: 'Defending',
  defense: 'Defense',
  growth: 'Growth',
  health: 'Health',
  level: 'Level',
  maximum_damage: 'Maximum Damage',
  minimum_damage: 'Minimum Damage',
  name: 'Name',
  special: 'Special',
  speed: 'Speed',
  town: 'Town',
};

export const NUMBER_NAMES = [
  'additional_attack',
  'additional_defense',
  'ai_value',
  'amount',
  'attack',
  'damage_reduction',
  'defense',
  'growth',
  'health',
  'maximum_damage',
  'minimum_damage',
  'speed',
];

export const STRING_NAMES = [
  'cost',
  'level',
  'name',
  'special',
];

export const FEATURE_TYPES = {
  attacking: 'attacking',
  defending: 'defending',
}

export const NAMES = Object.assign(
  {}, ...Object.entries(TITLES).map(([k, v]) => ({[v]: k}))
);
