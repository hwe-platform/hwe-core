import * as migration_20260916_121527_initial from './20260916_121527_initial';

export const migrations = [
  {
    up: migration_20260916_121527_initial.up,
    down: migration_20260916_121527_initial.down,
    name: '20260916_121527_initial'
  },
];
