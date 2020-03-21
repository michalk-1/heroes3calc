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

export const SKELETON = {
  ai_value: '60',
  attack: '5',
  cost: '60 Gold',
  defense: '4',
  growth: '12',
  health: '6',
  image: 'data:image/png;base64,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',
  level: '1',
  maximum_damage: '3',
  minimum_damage: '1',
  name: 'Skeleton',
  special: 'Undead',
  speed: '4',
  town: 'Necropolis',
};

export const SKELETON_WARRIOR = {
  ai_value: '85',
  attack: '6',
  cost: '70 Gold',
  defense: '6',
  growth: '12',
  health: '6',
  image: 'data:image/png;base64,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',
  level: '1+',
  maximum_damage: '3',
  minimum_damage: '1',
  name: 'Skeleton Warrior',
  special: 'Undead',
  speed: '5',
  town: 'Necropolis',
};

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

export const NAMES = Object.assign(
  ...Object.entries(TITLES).map(([k, v]) => ({[v]: k}))
);
