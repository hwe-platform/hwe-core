import * as migration_20260916_121527_initial from './20260916_121527_initial';
import * as migration_20260917_103556_carpetas_media from './20260917_103556_carpetas_media';

export const migrations = [
  {
    up: migration_20260916_121527_initial.up,
    down: migration_20260916_121527_initial.down,
    name: '20260916_121527_initial',
  },
  {
    up: migration_20260917_103556_carpetas_media.up,
    down: migration_20260917_103556_carpetas_media.down,
    name: '20260917_103556_carpetas_media'
  },
];
