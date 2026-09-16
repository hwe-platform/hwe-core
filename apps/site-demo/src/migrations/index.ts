import * as migration_20260916_111813_initial from './20260916_111813_initial';

export const migrations = [
  {
    up: migration_20260916_111813_initial.up,
    down: migration_20260916_111813_initial.down,
    name: '20260916_111813_initial',
  },
];
