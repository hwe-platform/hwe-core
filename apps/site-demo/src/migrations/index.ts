import * as migration_20260916_121527_initial from './20260916_121527_initial';
import * as migration_20260917_103556_carpetas_media from './20260917_103556_carpetas_media';
import * as migration_20260921_153115_hu009_hero_media_text from './20260921_153115_hu009_hero_media_text';
import * as migration_20260922_162446_hu010_grids from './20260922_162446_hu010_grids';
import * as migration_20260923_102537_hu011_gallery from './20260923_102537_hu011_gallery';

export const migrations = [
  {
    up: migration_20260916_121527_initial.up,
    down: migration_20260916_121527_initial.down,
    name: '20260916_121527_initial',
  },
  {
    up: migration_20260917_103556_carpetas_media.up,
    down: migration_20260917_103556_carpetas_media.down,
    name: '20260917_103556_carpetas_media',
  },
  {
    up: migration_20260921_153115_hu009_hero_media_text.up,
    down: migration_20260921_153115_hu009_hero_media_text.down,
    name: '20260921_153115_hu009_hero_media_text',
  },
  {
    up: migration_20260922_162446_hu010_grids.up,
    down: migration_20260922_162446_hu010_grids.down,
    name: '20260922_162446_hu010_grids',
  },
  {
    up: migration_20260923_102537_hu011_gallery.up,
    down: migration_20260923_102537_hu011_gallery.down,
    name: '20260923_102537_hu011_gallery'
  },
];
