import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_accommodations_blocks_media_text_ctas_variant" AS ENUM('primary', 'secondary', 'outline', 'ghost');
  CREATE TYPE "public"."enum_accommodations_blocks_media_text_ctas_icon" AS ENUM('arrowRight', 'chevronRight', 'calendar', 'phone', 'mail');
  CREATE TYPE "public"."enum_accommodations_blocks_media_text_media" AS ENUM('image', 'embed', 'carousel');
  CREATE TYPE "public"."enum_accommodations_blocks_media_text_align" AS ENUM('start', 'center');
  CREATE TYPE "public"."enum_accommodations_blocks_media_text_ratio" AS ENUM('portrait', 'landscape', 'square');
  CREATE TYPE "public"."enum_accommodations_blocks_media_text_background" AS ENUM('default', 'muted', 'none');
  CREATE TYPE "public"."enum_accommodations_blocks_cta_links_icon" AS ENUM('arrowRight', 'chevronRight', 'calendar', 'phone', 'mail');
  CREATE TYPE "public"."enum_pages_blocks_media_text_ctas_variant" AS ENUM('primary', 'secondary', 'outline', 'ghost');
  CREATE TYPE "public"."enum_pages_blocks_media_text_ctas_icon" AS ENUM('arrowRight', 'chevronRight', 'calendar', 'phone', 'mail');
  CREATE TYPE "public"."enum_pages_blocks_media_text_media" AS ENUM('image', 'embed', 'carousel');
  CREATE TYPE "public"."enum_pages_blocks_media_text_align" AS ENUM('start', 'center');
  CREATE TYPE "public"."enum_pages_blocks_media_text_ratio" AS ENUM('portrait', 'landscape', 'square');
  CREATE TYPE "public"."enum_pages_blocks_media_text_background" AS ENUM('default', 'muted', 'none');
  CREATE TYPE "public"."enum_pages_blocks_cta_links_icon" AS ENUM('arrowRight', 'chevronRight', 'calendar', 'phone', 'mail');
  CREATE TYPE "public"."enum_pages_hero_title_mode" AS ENUM('text', 'logo');
  CREATE TYPE "public"."enum_pages_hero_align" AS ENUM('left', 'center');
  ALTER TYPE "public"."enum_accommodations_equipment_icon" ADD VALUE 'arrowRight' BEFORE 'star';
  ALTER TYPE "public"."enum_accommodations_equipment_icon" ADD VALUE 'help';
  ALTER TYPE "public"."enum_accommodations_equipment_icon" ADD VALUE 'video';
  ALTER TYPE "public"."enum_accommodations_equipment_icon" ADD VALUE 'user';
  ALTER TYPE "public"."enum_accommodations_equipment_icon" ADD VALUE 'train';
  ALTER TYPE "public"."enum_accommodations_equipment_icon" ADD VALUE 'plane';
  ALTER TYPE "public"."enum_accommodations_features_icon" ADD VALUE 'arrowRight' BEFORE 'star';
  ALTER TYPE "public"."enum_accommodations_features_icon" ADD VALUE 'help';
  ALTER TYPE "public"."enum_accommodations_features_icon" ADD VALUE 'video';
  ALTER TYPE "public"."enum_accommodations_features_icon" ADD VALUE 'user';
  ALTER TYPE "public"."enum_accommodations_features_icon" ADD VALUE 'train';
  ALTER TYPE "public"."enum_accommodations_features_icon" ADD VALUE 'plane';
  ALTER TYPE "public"."enum_accommodations_blocks_icon_grid_items_icon" ADD VALUE 'arrowRight' BEFORE 'star';
  ALTER TYPE "public"."enum_accommodations_blocks_icon_grid_items_icon" ADD VALUE 'help';
  ALTER TYPE "public"."enum_accommodations_blocks_icon_grid_items_icon" ADD VALUE 'video';
  ALTER TYPE "public"."enum_accommodations_blocks_icon_grid_items_icon" ADD VALUE 'user';
  ALTER TYPE "public"."enum_accommodations_blocks_icon_grid_items_icon" ADD VALUE 'train';
  ALTER TYPE "public"."enum_accommodations_blocks_icon_grid_items_icon" ADD VALUE 'plane';
  ALTER TYPE "public"."enum_entities_features_icon" ADD VALUE 'arrowRight' BEFORE 'star';
  ALTER TYPE "public"."enum_entities_features_icon" ADD VALUE 'help';
  ALTER TYPE "public"."enum_entities_features_icon" ADD VALUE 'video';
  ALTER TYPE "public"."enum_entities_features_icon" ADD VALUE 'user';
  ALTER TYPE "public"."enum_entities_features_icon" ADD VALUE 'train';
  ALTER TYPE "public"."enum_entities_features_icon" ADD VALUE 'plane';
  ALTER TYPE "public"."enum_entities_icon" ADD VALUE 'arrowRight' BEFORE 'star';
  ALTER TYPE "public"."enum_entities_icon" ADD VALUE 'help';
  ALTER TYPE "public"."enum_entities_icon" ADD VALUE 'video';
  ALTER TYPE "public"."enum_entities_icon" ADD VALUE 'user';
  ALTER TYPE "public"."enum_entities_icon" ADD VALUE 'train';
  ALTER TYPE "public"."enum_entities_icon" ADD VALUE 'plane';
  ALTER TYPE "public"."enum_pages_blocks_icon_grid_items_icon" ADD VALUE 'arrowRight' BEFORE 'star';
  ALTER TYPE "public"."enum_pages_blocks_icon_grid_items_icon" ADD VALUE 'help';
  ALTER TYPE "public"."enum_pages_blocks_icon_grid_items_icon" ADD VALUE 'video';
  ALTER TYPE "public"."enum_pages_blocks_icon_grid_items_icon" ADD VALUE 'user';
  ALTER TYPE "public"."enum_pages_blocks_icon_grid_items_icon" ADD VALUE 'train';
  ALTER TYPE "public"."enum_pages_blocks_icon_grid_items_icon" ADD VALUE 'plane';
  ALTER TYPE "public"."enum_header_top_bar_links_icon" ADD VALUE 'mail' BEFORE 'video';
  CREATE TABLE "accommodations_blocks_media_text_ctas" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL,
  	"variant" "enum_accommodations_blocks_media_text_ctas_variant" DEFAULT 'primary',
  	"icon" "enum_accommodations_blocks_media_text_ctas_icon"
  );
  
  CREATE TABLE "accommodations_blocks_media_text_ctas_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_media_text_ctas" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL,
  	"variant" "enum_pages_blocks_media_text_ctas_variant" DEFAULT 'primary',
  	"icon" "enum_pages_blocks_media_text_ctas_icon"
  );
  
  CREATE TABLE "pages_blocks_media_text_ctas_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "accommodations_blocks_media_text" ALTER COLUMN "image_id" DROP NOT NULL;
  ALTER TABLE "accommodations_blocks_media_text_locales" ALTER COLUMN "content" DROP NOT NULL;
  ALTER TABLE "pages_blocks_media_text" ALTER COLUMN "image_id" DROP NOT NULL;
  ALTER TABLE "pages_blocks_media_text_locales" ALTER COLUMN "content" DROP NOT NULL;
  ALTER TABLE "accommodations_blocks_media_text" ADD COLUMN "media" "enum_accommodations_blocks_media_text_media" DEFAULT 'image' NOT NULL;
  ALTER TABLE "accommodations_blocks_media_text" ADD COLUMN "embed_url" varchar;
  ALTER TABLE "accommodations_blocks_media_text" ADD COLUMN "split" numeric DEFAULT 6;
  ALTER TABLE "accommodations_blocks_media_text" ADD COLUMN "reverse" boolean DEFAULT false;
  ALTER TABLE "accommodations_blocks_media_text" ADD COLUMN "eyebrow_rule" boolean DEFAULT false;
  ALTER TABLE "accommodations_blocks_media_text" ADD COLUMN "align" "enum_accommodations_blocks_media_text_align" DEFAULT 'center';
  ALTER TABLE "accommodations_blocks_media_text" ADD COLUMN "ratio" "enum_accommodations_blocks_media_text_ratio" DEFAULT 'landscape';
  ALTER TABLE "accommodations_blocks_media_text" ADD COLUMN "background" "enum_accommodations_blocks_media_text_background" DEFAULT 'default';
  ALTER TABLE "accommodations_blocks_media_text" ADD COLUMN "slot_id" varchar;
  ALTER TABLE "accommodations_blocks_media_text_locales" ADD COLUMN "title_accent" varchar;
  ALTER TABLE "accommodations_blocks_cta_links" ADD COLUMN "icon" "enum_accommodations_blocks_cta_links_icon";
  ALTER TABLE "pages_blocks_media_text" ADD COLUMN "media" "enum_pages_blocks_media_text_media" DEFAULT 'image' NOT NULL;
  ALTER TABLE "pages_blocks_media_text" ADD COLUMN "embed_url" varchar;
  ALTER TABLE "pages_blocks_media_text" ADD COLUMN "split" numeric DEFAULT 6;
  ALTER TABLE "pages_blocks_media_text" ADD COLUMN "reverse" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_media_text" ADD COLUMN "eyebrow_rule" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_media_text" ADD COLUMN "align" "enum_pages_blocks_media_text_align" DEFAULT 'center';
  ALTER TABLE "pages_blocks_media_text" ADD COLUMN "ratio" "enum_pages_blocks_media_text_ratio" DEFAULT 'landscape';
  ALTER TABLE "pages_blocks_media_text" ADD COLUMN "background" "enum_pages_blocks_media_text_background" DEFAULT 'default';
  ALTER TABLE "pages_blocks_media_text" ADD COLUMN "slot_id" varchar;
  ALTER TABLE "pages_blocks_media_text_locales" ADD COLUMN "title_accent" varchar;
  ALTER TABLE "pages_blocks_cta_links" ADD COLUMN "icon" "enum_pages_blocks_cta_links_icon";
  ALTER TABLE "pages" ADD COLUMN "hero_title_mode" "enum_pages_hero_title_mode" DEFAULT 'text';
  ALTER TABLE "pages" ADD COLUMN "hero_align" "enum_pages_hero_align" DEFAULT 'left';
  ALTER TABLE "pages_locales" ADD COLUMN "hero_eyebrow" varchar;
  ALTER TABLE "accommodations_blocks_media_text_ctas" ADD CONSTRAINT "accommodations_blocks_media_text_ctas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accommodations_blocks_media_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accommodations_blocks_media_text_ctas_locales" ADD CONSTRAINT "accommodations_blocks_media_text_ctas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accommodations_blocks_media_text_ctas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_text_ctas" ADD CONSTRAINT "pages_blocks_media_text_ctas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_media_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_text_ctas_locales" ADD CONSTRAINT "pages_blocks_media_text_ctas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_media_text_ctas"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "accommodations_blocks_media_text_ctas_order_idx" ON "accommodations_blocks_media_text_ctas" USING btree ("_order");
  CREATE INDEX "accommodations_blocks_media_text_ctas_parent_id_idx" ON "accommodations_blocks_media_text_ctas" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "accommodations_blocks_media_text_ctas_locales_locale_parent_" ON "accommodations_blocks_media_text_ctas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_media_text_ctas_order_idx" ON "pages_blocks_media_text_ctas" USING btree ("_order");
  CREATE INDEX "pages_blocks_media_text_ctas_parent_id_idx" ON "pages_blocks_media_text_ctas" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_media_text_ctas_locales_locale_parent_id_unique" ON "pages_blocks_media_text_ctas_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "accommodations_blocks_media_text" DROP COLUMN "image_position";
  ALTER TABLE "accommodations_blocks_media_text" DROP COLUMN "link_url";
  ALTER TABLE "accommodations_blocks_media_text" DROP COLUMN "link_variant";
  ALTER TABLE "accommodations_blocks_media_text_locales" DROP COLUMN "link_label";
  ALTER TABLE "pages_blocks_media_text" DROP COLUMN "image_position";
  ALTER TABLE "pages_blocks_media_text" DROP COLUMN "link_url";
  ALTER TABLE "pages_blocks_media_text" DROP COLUMN "link_variant";
  ALTER TABLE "pages_blocks_media_text_locales" DROP COLUMN "link_label";
  DROP TYPE "public"."enum_accommodations_blocks_media_text_image_position";
  DROP TYPE "public"."enum_accommodations_blocks_media_text_link_variant";
  DROP TYPE "public"."enum_pages_blocks_media_text_image_position";
  DROP TYPE "public"."enum_pages_blocks_media_text_link_variant";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_accommodations_blocks_media_text_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_accommodations_blocks_media_text_link_variant" AS ENUM('primary', 'secondary', 'outline', 'ghost');
  CREATE TYPE "public"."enum_pages_blocks_media_text_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_media_text_link_variant" AS ENUM('primary', 'secondary', 'outline', 'ghost');
  ALTER TABLE "accommodations_blocks_media_text_ctas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "accommodations_blocks_media_text_ctas_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_media_text_ctas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_media_text_ctas_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "accommodations_blocks_media_text_ctas" CASCADE;
  DROP TABLE "accommodations_blocks_media_text_ctas_locales" CASCADE;
  DROP TABLE "pages_blocks_media_text_ctas" CASCADE;
  DROP TABLE "pages_blocks_media_text_ctas_locales" CASCADE;
  ALTER TABLE "accommodations_equipment" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_accommodations_equipment_icon";
  CREATE TYPE "public"."enum_accommodations_equipment_icon" AS ENUM('utensils', 'bed', 'waves', 'mapPin', 'wifi', 'car', 'users', 'calendar', 'phone', 'mail', 'check', 'x', 'chevronRight', 'chevronLeft', 'chevronDown', 'star', 'heart', 'menu', 'search', 'pawPrint');
  ALTER TABLE "accommodations_equipment" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_accommodations_equipment_icon" USING "icon"::"public"."enum_accommodations_equipment_icon";
  ALTER TABLE "accommodations_features" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_accommodations_features_icon";
  CREATE TYPE "public"."enum_accommodations_features_icon" AS ENUM('utensils', 'bed', 'waves', 'mapPin', 'wifi', 'car', 'users', 'calendar', 'phone', 'mail', 'check', 'x', 'chevronRight', 'chevronLeft', 'chevronDown', 'star', 'heart', 'menu', 'search', 'pawPrint');
  ALTER TABLE "accommodations_features" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_accommodations_features_icon" USING "icon"::"public"."enum_accommodations_features_icon";
  ALTER TABLE "accommodations_blocks_icon_grid_items" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_accommodations_blocks_icon_grid_items_icon";
  CREATE TYPE "public"."enum_accommodations_blocks_icon_grid_items_icon" AS ENUM('utensils', 'bed', 'waves', 'mapPin', 'wifi', 'car', 'users', 'calendar', 'phone', 'mail', 'check', 'x', 'chevronRight', 'chevronLeft', 'chevronDown', 'star', 'heart', 'menu', 'search', 'pawPrint');
  ALTER TABLE "accommodations_blocks_icon_grid_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_accommodations_blocks_icon_grid_items_icon" USING "icon"::"public"."enum_accommodations_blocks_icon_grid_items_icon";
  ALTER TABLE "entities_features" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_entities_features_icon";
  CREATE TYPE "public"."enum_entities_features_icon" AS ENUM('utensils', 'bed', 'waves', 'mapPin', 'wifi', 'car', 'users', 'calendar', 'phone', 'mail', 'check', 'x', 'chevronRight', 'chevronLeft', 'chevronDown', 'star', 'heart', 'menu', 'search', 'pawPrint');
  ALTER TABLE "entities_features" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_entities_features_icon" USING "icon"::"public"."enum_entities_features_icon";
  ALTER TABLE "entities" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_entities_icon";
  CREATE TYPE "public"."enum_entities_icon" AS ENUM('utensils', 'bed', 'waves', 'mapPin', 'wifi', 'car', 'users', 'calendar', 'phone', 'mail', 'check', 'x', 'chevronRight', 'chevronLeft', 'chevronDown', 'star', 'heart', 'menu', 'search', 'pawPrint');
  ALTER TABLE "entities" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_entities_icon" USING "icon"::"public"."enum_entities_icon";
  ALTER TABLE "pages_blocks_icon_grid_items" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_pages_blocks_icon_grid_items_icon";
  CREATE TYPE "public"."enum_pages_blocks_icon_grid_items_icon" AS ENUM('utensils', 'bed', 'waves', 'mapPin', 'wifi', 'car', 'users', 'calendar', 'phone', 'mail', 'check', 'x', 'chevronRight', 'chevronLeft', 'chevronDown', 'star', 'heart', 'menu', 'search', 'pawPrint');
  ALTER TABLE "pages_blocks_icon_grid_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_pages_blocks_icon_grid_items_icon" USING "icon"::"public"."enum_pages_blocks_icon_grid_items_icon";
  ALTER TABLE "header_top_bar_links" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_header_top_bar_links_icon";
  CREATE TYPE "public"."enum_header_top_bar_links_icon" AS ENUM('help', 'phone', 'video', 'user', 'custom');
  ALTER TABLE "header_top_bar_links" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_header_top_bar_links_icon" USING "icon"::"public"."enum_header_top_bar_links_icon";
  ALTER TABLE "accommodations_blocks_media_text" ALTER COLUMN "image_id" SET NOT NULL;
  ALTER TABLE "accommodations_blocks_media_text_locales" ALTER COLUMN "content" SET NOT NULL;
  ALTER TABLE "pages_blocks_media_text" ALTER COLUMN "image_id" SET NOT NULL;
  ALTER TABLE "pages_blocks_media_text_locales" ALTER COLUMN "content" SET NOT NULL;
  ALTER TABLE "accommodations_blocks_media_text" ADD COLUMN "image_position" "enum_accommodations_blocks_media_text_image_position" DEFAULT 'left';
  ALTER TABLE "accommodations_blocks_media_text" ADD COLUMN "link_url" varchar NOT NULL;
  ALTER TABLE "accommodations_blocks_media_text" ADD COLUMN "link_variant" "enum_accommodations_blocks_media_text_link_variant" DEFAULT 'primary';
  ALTER TABLE "accommodations_blocks_media_text_locales" ADD COLUMN "link_label" varchar NOT NULL;
  ALTER TABLE "pages_blocks_media_text" ADD COLUMN "image_position" "enum_pages_blocks_media_text_image_position" DEFAULT 'left';
  ALTER TABLE "pages_blocks_media_text" ADD COLUMN "link_url" varchar NOT NULL;
  ALTER TABLE "pages_blocks_media_text" ADD COLUMN "link_variant" "enum_pages_blocks_media_text_link_variant" DEFAULT 'primary';
  ALTER TABLE "pages_blocks_media_text_locales" ADD COLUMN "link_label" varchar NOT NULL;
  ALTER TABLE "accommodations_blocks_media_text" DROP COLUMN "media";
  ALTER TABLE "accommodations_blocks_media_text" DROP COLUMN "embed_url";
  ALTER TABLE "accommodations_blocks_media_text" DROP COLUMN "split";
  ALTER TABLE "accommodations_blocks_media_text" DROP COLUMN "reverse";
  ALTER TABLE "accommodations_blocks_media_text" DROP COLUMN "eyebrow_rule";
  ALTER TABLE "accommodations_blocks_media_text" DROP COLUMN "align";
  ALTER TABLE "accommodations_blocks_media_text" DROP COLUMN "ratio";
  ALTER TABLE "accommodations_blocks_media_text" DROP COLUMN "background";
  ALTER TABLE "accommodations_blocks_media_text" DROP COLUMN "slot_id";
  ALTER TABLE "accommodations_blocks_media_text_locales" DROP COLUMN "title_accent";
  ALTER TABLE "accommodations_blocks_cta_links" DROP COLUMN "icon";
  ALTER TABLE "pages_blocks_media_text" DROP COLUMN "media";
  ALTER TABLE "pages_blocks_media_text" DROP COLUMN "embed_url";
  ALTER TABLE "pages_blocks_media_text" DROP COLUMN "split";
  ALTER TABLE "pages_blocks_media_text" DROP COLUMN "reverse";
  ALTER TABLE "pages_blocks_media_text" DROP COLUMN "eyebrow_rule";
  ALTER TABLE "pages_blocks_media_text" DROP COLUMN "align";
  ALTER TABLE "pages_blocks_media_text" DROP COLUMN "ratio";
  ALTER TABLE "pages_blocks_media_text" DROP COLUMN "background";
  ALTER TABLE "pages_blocks_media_text" DROP COLUMN "slot_id";
  ALTER TABLE "pages_blocks_media_text_locales" DROP COLUMN "title_accent";
  ALTER TABLE "pages_blocks_cta_links" DROP COLUMN "icon";
  ALTER TABLE "pages" DROP COLUMN "hero_title_mode";
  ALTER TABLE "pages" DROP COLUMN "hero_align";
  ALTER TABLE "pages_locales" DROP COLUMN "hero_eyebrow";
  DROP TYPE "public"."enum_accommodations_blocks_media_text_ctas_variant";
  DROP TYPE "public"."enum_accommodations_blocks_media_text_ctas_icon";
  DROP TYPE "public"."enum_accommodations_blocks_media_text_media";
  DROP TYPE "public"."enum_accommodations_blocks_media_text_align";
  DROP TYPE "public"."enum_accommodations_blocks_media_text_ratio";
  DROP TYPE "public"."enum_accommodations_blocks_media_text_background";
  DROP TYPE "public"."enum_accommodations_blocks_cta_links_icon";
  DROP TYPE "public"."enum_pages_blocks_media_text_ctas_variant";
  DROP TYPE "public"."enum_pages_blocks_media_text_ctas_icon";
  DROP TYPE "public"."enum_pages_blocks_media_text_media";
  DROP TYPE "public"."enum_pages_blocks_media_text_align";
  DROP TYPE "public"."enum_pages_blocks_media_text_ratio";
  DROP TYPE "public"."enum_pages_blocks_media_text_background";
  DROP TYPE "public"."enum_pages_blocks_cta_links_icon";
  DROP TYPE "public"."enum_pages_hero_title_mode";
  DROP TYPE "public"."enum_pages_hero_align";`)
}
