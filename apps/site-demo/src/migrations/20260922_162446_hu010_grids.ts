import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_accommodations_blocks_icon_grid_ctas_variant" AS ENUM('primary', 'secondary', 'outline', 'ghost', 'link', 'link-underline');
  CREATE TYPE "public"."enum_accommodations_blocks_icon_grid_ctas_icon" AS ENUM('arrowRight', 'chevronRight', 'calendar', 'phone', 'mail');
  CREATE TYPE "public"."enum_accommodations_blocks_icon_grid_heading_tone" AS ENUM('default', 'brand');
  CREATE TYPE "public"."enum_accommodations_blocks_icon_grid_variant" AS ENUM('bare', 'card');
  CREATE TYPE "public"."enum_accommodations_blocks_icon_grid_background" AS ENUM('default', 'muted', 'none');
  CREATE TYPE "public"."enum_accommodations_blocks_card_grid_items_variant" AS ENUM('primary', 'secondary', 'outline', 'ghost', 'link', 'link-underline');
  CREATE TYPE "public"."enum_accommodations_blocks_card_grid_ctas_variant" AS ENUM('primary', 'secondary', 'outline', 'ghost', 'link', 'link-underline');
  CREATE TYPE "public"."enum_accommodations_blocks_card_grid_ctas_icon" AS ENUM('arrowRight', 'chevronRight', 'calendar', 'phone', 'mail');
  CREATE TYPE "public"."enum_accommodations_blocks_card_grid_heading_tone" AS ENUM('default', 'brand');
  CREATE TYPE "public"."enum_accommodations_blocks_card_grid_background" AS ENUM('default', 'muted', 'none');
  CREATE TYPE "public"."enum_accommodations_blocks_card_grid_card" AS ENUM('overlay', 'stacked');
  CREATE TYPE "public"."enum_accommodations_blocks_card_grid_card_size" AS ENUM('default', 'compact');
  CREATE TYPE "public"."enum_accommodations_blocks_card_grid_source" AS ENUM('manual', 'accommodations', 'entities', 'articles');
  CREATE TYPE "public"."enum_accommodations_blocks_blog_heading_tone" AS ENUM('default', 'brand');
  CREATE TYPE "public"."enum_accommodations_blocks_blog_background" AS ENUM('default', 'muted', 'none');
  CREATE TYPE "public"."enum_accommodations_blocks_blog_source" AS ENUM('latest', 'featured', 'byCategory');
  CREATE TYPE "public"."enum_pages_blocks_icon_grid_ctas_variant" AS ENUM('primary', 'secondary', 'outline', 'ghost', 'link', 'link-underline');
  CREATE TYPE "public"."enum_pages_blocks_icon_grid_ctas_icon" AS ENUM('arrowRight', 'chevronRight', 'calendar', 'phone', 'mail');
  CREATE TYPE "public"."enum_pages_blocks_icon_grid_heading_tone" AS ENUM('default', 'brand');
  CREATE TYPE "public"."enum_pages_blocks_icon_grid_variant" AS ENUM('bare', 'card');
  CREATE TYPE "public"."enum_pages_blocks_icon_grid_background" AS ENUM('default', 'muted', 'none');
  CREATE TYPE "public"."enum_pages_blocks_card_grid_items_variant" AS ENUM('primary', 'secondary', 'outline', 'ghost', 'link', 'link-underline');
  CREATE TYPE "public"."enum_pages_blocks_card_grid_ctas_variant" AS ENUM('primary', 'secondary', 'outline', 'ghost', 'link', 'link-underline');
  CREATE TYPE "public"."enum_pages_blocks_card_grid_ctas_icon" AS ENUM('arrowRight', 'chevronRight', 'calendar', 'phone', 'mail');
  CREATE TYPE "public"."enum_pages_blocks_card_grid_heading_tone" AS ENUM('default', 'brand');
  CREATE TYPE "public"."enum_pages_blocks_card_grid_background" AS ENUM('default', 'muted', 'none');
  CREATE TYPE "public"."enum_pages_blocks_card_grid_card" AS ENUM('overlay', 'stacked');
  CREATE TYPE "public"."enum_pages_blocks_card_grid_card_size" AS ENUM('default', 'compact');
  CREATE TYPE "public"."enum_pages_blocks_card_grid_source" AS ENUM('manual', 'accommodations', 'entities', 'articles');
  CREATE TYPE "public"."enum_pages_blocks_blog_heading_tone" AS ENUM('default', 'brand');
  CREATE TYPE "public"."enum_pages_blocks_blog_background" AS ENUM('default', 'muted', 'none');
  CREATE TYPE "public"."enum_pages_blocks_blog_source" AS ENUM('latest', 'featured', 'byCategory');
  ALTER TYPE "public"."enum_accommodations_equipment_icon" ADD VALUE 'treePine';
  ALTER TYPE "public"."enum_accommodations_equipment_icon" ADD VALUE 'leaf';
  ALTER TYPE "public"."enum_accommodations_equipment_icon" ADD VALUE 'flame';
  ALTER TYPE "public"."enum_accommodations_equipment_icon" ADD VALUE 'bike';
  ALTER TYPE "public"."enum_accommodations_equipment_icon" ADD VALUE 'shoppingBag';
  ALTER TYPE "public"."enum_accommodations_equipment_icon" ADD VALUE 'refreshCcw';
  ALTER TYPE "public"."enum_accommodations_equipment_icon" ADD VALUE 'clock';
  ALTER TYPE "public"."enum_accommodations_equipment_icon" ADD VALUE 'accessibility';
  ALTER TYPE "public"."enum_accommodations_equipment_icon" ADD VALUE 'eauChauffee';
  ALTER TYPE "public"."enum_accommodations_equipment_icon" ADD VALUE 'espritFamilial';
  ALTER TYPE "public"."enum_accommodations_equipment_icon" ADD VALUE 'animationsEte';
  ALTER TYPE "public"."enum_accommodations_features_icon" ADD VALUE 'treePine';
  ALTER TYPE "public"."enum_accommodations_features_icon" ADD VALUE 'leaf';
  ALTER TYPE "public"."enum_accommodations_features_icon" ADD VALUE 'flame';
  ALTER TYPE "public"."enum_accommodations_features_icon" ADD VALUE 'bike';
  ALTER TYPE "public"."enum_accommodations_features_icon" ADD VALUE 'shoppingBag';
  ALTER TYPE "public"."enum_accommodations_features_icon" ADD VALUE 'refreshCcw';
  ALTER TYPE "public"."enum_accommodations_features_icon" ADD VALUE 'clock';
  ALTER TYPE "public"."enum_accommodations_features_icon" ADD VALUE 'accessibility';
  ALTER TYPE "public"."enum_accommodations_features_icon" ADD VALUE 'eauChauffee';
  ALTER TYPE "public"."enum_accommodations_features_icon" ADD VALUE 'espritFamilial';
  ALTER TYPE "public"."enum_accommodations_features_icon" ADD VALUE 'animationsEte';
  ALTER TYPE "public"."enum_accommodations_blocks_media_text_ctas_variant" ADD VALUE 'link';
  ALTER TYPE "public"."enum_accommodations_blocks_media_text_ctas_variant" ADD VALUE 'link-underline';
  ALTER TYPE "public"."enum_accommodations_blocks_icon_grid_items_icon" ADD VALUE 'treePine';
  ALTER TYPE "public"."enum_accommodations_blocks_icon_grid_items_icon" ADD VALUE 'leaf';
  ALTER TYPE "public"."enum_accommodations_blocks_icon_grid_items_icon" ADD VALUE 'flame';
  ALTER TYPE "public"."enum_accommodations_blocks_icon_grid_items_icon" ADD VALUE 'bike';
  ALTER TYPE "public"."enum_accommodations_blocks_icon_grid_items_icon" ADD VALUE 'shoppingBag';
  ALTER TYPE "public"."enum_accommodations_blocks_icon_grid_items_icon" ADD VALUE 'refreshCcw';
  ALTER TYPE "public"."enum_accommodations_blocks_icon_grid_items_icon" ADD VALUE 'clock';
  ALTER TYPE "public"."enum_accommodations_blocks_icon_grid_items_icon" ADD VALUE 'accessibility';
  ALTER TYPE "public"."enum_accommodations_blocks_icon_grid_items_icon" ADD VALUE 'eauChauffee';
  ALTER TYPE "public"."enum_accommodations_blocks_icon_grid_items_icon" ADD VALUE 'espritFamilial';
  ALTER TYPE "public"."enum_accommodations_blocks_icon_grid_items_icon" ADD VALUE 'animationsEte';
  ALTER TYPE "public"."enum_accommodations_blocks_cta_links_variant" ADD VALUE 'link';
  ALTER TYPE "public"."enum_accommodations_blocks_cta_links_variant" ADD VALUE 'link-underline';
  ALTER TYPE "public"."enum_entities_features_icon" ADD VALUE 'treePine';
  ALTER TYPE "public"."enum_entities_features_icon" ADD VALUE 'leaf';
  ALTER TYPE "public"."enum_entities_features_icon" ADD VALUE 'flame';
  ALTER TYPE "public"."enum_entities_features_icon" ADD VALUE 'bike';
  ALTER TYPE "public"."enum_entities_features_icon" ADD VALUE 'shoppingBag';
  ALTER TYPE "public"."enum_entities_features_icon" ADD VALUE 'refreshCcw';
  ALTER TYPE "public"."enum_entities_features_icon" ADD VALUE 'clock';
  ALTER TYPE "public"."enum_entities_features_icon" ADD VALUE 'accessibility';
  ALTER TYPE "public"."enum_entities_features_icon" ADD VALUE 'eauChauffee';
  ALTER TYPE "public"."enum_entities_features_icon" ADD VALUE 'espritFamilial';
  ALTER TYPE "public"."enum_entities_features_icon" ADD VALUE 'animationsEte';
  ALTER TYPE "public"."enum_entities_icon" ADD VALUE 'treePine';
  ALTER TYPE "public"."enum_entities_icon" ADD VALUE 'leaf';
  ALTER TYPE "public"."enum_entities_icon" ADD VALUE 'flame';
  ALTER TYPE "public"."enum_entities_icon" ADD VALUE 'bike';
  ALTER TYPE "public"."enum_entities_icon" ADD VALUE 'shoppingBag';
  ALTER TYPE "public"."enum_entities_icon" ADD VALUE 'refreshCcw';
  ALTER TYPE "public"."enum_entities_icon" ADD VALUE 'clock';
  ALTER TYPE "public"."enum_entities_icon" ADD VALUE 'accessibility';
  ALTER TYPE "public"."enum_entities_icon" ADD VALUE 'eauChauffee';
  ALTER TYPE "public"."enum_entities_icon" ADD VALUE 'espritFamilial';
  ALTER TYPE "public"."enum_entities_icon" ADD VALUE 'animationsEte';
  ALTER TYPE "public"."enum_pages_blocks_media_text_ctas_variant" ADD VALUE 'link';
  ALTER TYPE "public"."enum_pages_blocks_media_text_ctas_variant" ADD VALUE 'link-underline';
  ALTER TYPE "public"."enum_pages_blocks_icon_grid_items_icon" ADD VALUE 'treePine';
  ALTER TYPE "public"."enum_pages_blocks_icon_grid_items_icon" ADD VALUE 'leaf';
  ALTER TYPE "public"."enum_pages_blocks_icon_grid_items_icon" ADD VALUE 'flame';
  ALTER TYPE "public"."enum_pages_blocks_icon_grid_items_icon" ADD VALUE 'bike';
  ALTER TYPE "public"."enum_pages_blocks_icon_grid_items_icon" ADD VALUE 'shoppingBag';
  ALTER TYPE "public"."enum_pages_blocks_icon_grid_items_icon" ADD VALUE 'refreshCcw';
  ALTER TYPE "public"."enum_pages_blocks_icon_grid_items_icon" ADD VALUE 'clock';
  ALTER TYPE "public"."enum_pages_blocks_icon_grid_items_icon" ADD VALUE 'accessibility';
  ALTER TYPE "public"."enum_pages_blocks_icon_grid_items_icon" ADD VALUE 'eauChauffee';
  ALTER TYPE "public"."enum_pages_blocks_icon_grid_items_icon" ADD VALUE 'espritFamilial';
  ALTER TYPE "public"."enum_pages_blocks_icon_grid_items_icon" ADD VALUE 'animationsEte';
  ALTER TYPE "public"."enum_pages_blocks_cta_links_variant" ADD VALUE 'link';
  ALTER TYPE "public"."enum_pages_blocks_cta_links_variant" ADD VALUE 'link-underline';
  CREATE TABLE "accommodations_blocks_icon_grid_ctas" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL,
  	"variant" "enum_accommodations_blocks_icon_grid_ctas_variant" DEFAULT 'primary',
  	"icon" "enum_accommodations_blocks_icon_grid_ctas_icon"
  );
  
  CREATE TABLE "accommodations_blocks_icon_grid_ctas_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "accommodations_blocks_card_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"url" varchar,
  	"date" varchar,
  	"variant" "enum_accommodations_blocks_card_grid_items_variant" DEFAULT 'link'
  );
  
  CREATE TABLE "accommodations_blocks_card_grid_items_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"tag" varchar,
  	"read_more_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "accommodations_blocks_card_grid_ctas" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL,
  	"variant" "enum_accommodations_blocks_card_grid_ctas_variant" DEFAULT 'primary',
  	"icon" "enum_accommodations_blocks_card_grid_ctas_icon"
  );
  
  CREATE TABLE "accommodations_blocks_card_grid_ctas_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "accommodations_blocks_blog" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_tone" "enum_accommodations_blocks_blog_heading_tone" DEFAULT 'default',
  	"background" "enum_accommodations_blocks_blog_background" DEFAULT 'default',
  	"source" "enum_accommodations_blocks_blog_source" DEFAULT 'latest' NOT NULL,
  	"limit" numeric DEFAULT 3,
  	"show_excerpt" boolean DEFAULT false,
  	"show_more_link" boolean DEFAULT false,
  	"show_more_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "accommodations_blocks_blog_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"description" varchar,
  	"category" varchar,
  	"show_more_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "accommodations_numbers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" numeric,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_icon_grid_ctas" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL,
  	"variant" "enum_pages_blocks_icon_grid_ctas_variant" DEFAULT 'primary',
  	"icon" "enum_pages_blocks_icon_grid_ctas_icon"
  );
  
  CREATE TABLE "pages_blocks_icon_grid_ctas_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_card_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"url" varchar,
  	"date" varchar,
  	"variant" "enum_pages_blocks_card_grid_items_variant" DEFAULT 'link'
  );
  
  CREATE TABLE "pages_blocks_card_grid_items_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"tag" varchar,
  	"read_more_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_card_grid_ctas" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL,
  	"variant" "enum_pages_blocks_card_grid_ctas_variant" DEFAULT 'primary',
  	"icon" "enum_pages_blocks_card_grid_ctas_icon"
  );
  
  CREATE TABLE "pages_blocks_card_grid_ctas_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_blog" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_tone" "enum_pages_blocks_blog_heading_tone" DEFAULT 'default',
  	"background" "enum_pages_blocks_blog_background" DEFAULT 'default',
  	"source" "enum_pages_blocks_blog_source" DEFAULT 'latest' NOT NULL,
  	"limit" numeric DEFAULT 3,
  	"show_excerpt" boolean DEFAULT false,
  	"show_more_link" boolean DEFAULT false,
  	"show_more_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_blog_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"description" varchar,
  	"category" varchar,
  	"show_more_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_numbers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" numeric,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL
  );
  
  DROP TABLE "accommodations_blocks_card_grid_cards" CASCADE;
  DROP TABLE "accommodations_blocks_card_grid_cards_locales" CASCADE;
  DROP TABLE "pages_blocks_card_grid_cards" CASCADE;
  DROP TABLE "pages_blocks_card_grid_cards_locales" CASCADE;
  ALTER TABLE "accommodations_blocks_icon_grid" ADD COLUMN "heading_tone" "enum_accommodations_blocks_icon_grid_heading_tone" DEFAULT 'default';
  ALTER TABLE "accommodations_blocks_icon_grid" ADD COLUMN "columns" numeric DEFAULT 3;
  ALTER TABLE "accommodations_blocks_icon_grid" ADD COLUMN "variant" "enum_accommodations_blocks_icon_grid_variant" DEFAULT 'bare';
  ALTER TABLE "accommodations_blocks_icon_grid" ADD COLUMN "background" "enum_accommodations_blocks_icon_grid_background" DEFAULT 'default';
  ALTER TABLE "accommodations_blocks_icon_grid_locales" ADD COLUMN "description" varchar;
  ALTER TABLE "accommodations_blocks_card_grid" ADD COLUMN "heading_tone" "enum_accommodations_blocks_card_grid_heading_tone" DEFAULT 'default';
  ALTER TABLE "accommodations_blocks_card_grid" ADD COLUMN "background" "enum_accommodations_blocks_card_grid_background" DEFAULT 'default';
  ALTER TABLE "accommodations_blocks_card_grid" ADD COLUMN "card" "enum_accommodations_blocks_card_grid_card" DEFAULT 'stacked' NOT NULL;
  ALTER TABLE "accommodations_blocks_card_grid" ADD COLUMN "card_size" "enum_accommodations_blocks_card_grid_card_size" DEFAULT 'default';
  ALTER TABLE "accommodations_blocks_card_grid" ADD COLUMN "columns" numeric DEFAULT 3;
  ALTER TABLE "accommodations_blocks_card_grid" ADD COLUMN "source" "enum_accommodations_blocks_card_grid_source" DEFAULT 'manual';
  ALTER TABLE "accommodations_blocks_card_grid" ADD COLUMN "source_config_category" varchar;
  ALTER TABLE "accommodations_blocks_card_grid" ADD COLUMN "source_config_limit" numeric;
  ALTER TABLE "accommodations_blocks_card_grid" ADD COLUMN "source_config_featured" boolean;
  ALTER TABLE "accommodations_blocks_card_grid_locales" ADD COLUMN "description" varchar;
  ALTER TABLE "pages_blocks_icon_grid" ADD COLUMN "heading_tone" "enum_pages_blocks_icon_grid_heading_tone" DEFAULT 'default';
  ALTER TABLE "pages_blocks_icon_grid" ADD COLUMN "columns" numeric DEFAULT 3;
  ALTER TABLE "pages_blocks_icon_grid" ADD COLUMN "variant" "enum_pages_blocks_icon_grid_variant" DEFAULT 'bare';
  ALTER TABLE "pages_blocks_icon_grid" ADD COLUMN "background" "enum_pages_blocks_icon_grid_background" DEFAULT 'default';
  ALTER TABLE "pages_blocks_icon_grid_locales" ADD COLUMN "description" varchar;
  ALTER TABLE "pages_blocks_card_grid" ADD COLUMN "heading_tone" "enum_pages_blocks_card_grid_heading_tone" DEFAULT 'default';
  ALTER TABLE "pages_blocks_card_grid" ADD COLUMN "background" "enum_pages_blocks_card_grid_background" DEFAULT 'default';
  ALTER TABLE "pages_blocks_card_grid" ADD COLUMN "card" "enum_pages_blocks_card_grid_card" DEFAULT 'stacked' NOT NULL;
  ALTER TABLE "pages_blocks_card_grid" ADD COLUMN "card_size" "enum_pages_blocks_card_grid_card_size" DEFAULT 'default';
  ALTER TABLE "pages_blocks_card_grid" ADD COLUMN "columns" numeric DEFAULT 3;
  ALTER TABLE "pages_blocks_card_grid" ADD COLUMN "source" "enum_pages_blocks_card_grid_source" DEFAULT 'manual';
  ALTER TABLE "pages_blocks_card_grid" ADD COLUMN "source_config_category" varchar;
  ALTER TABLE "pages_blocks_card_grid" ADD COLUMN "source_config_limit" numeric;
  ALTER TABLE "pages_blocks_card_grid" ADD COLUMN "source_config_featured" boolean;
  ALTER TABLE "pages_blocks_card_grid_locales" ADD COLUMN "description" varchar;
  ALTER TABLE "accommodations_blocks_icon_grid_ctas" ADD CONSTRAINT "accommodations_blocks_icon_grid_ctas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accommodations_blocks_icon_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accommodations_blocks_icon_grid_ctas_locales" ADD CONSTRAINT "accommodations_blocks_icon_grid_ctas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accommodations_blocks_icon_grid_ctas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accommodations_blocks_card_grid_items" ADD CONSTRAINT "accommodations_blocks_card_grid_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "accommodations_blocks_card_grid_items" ADD CONSTRAINT "accommodations_blocks_card_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accommodations_blocks_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accommodations_blocks_card_grid_items_locales" ADD CONSTRAINT "accommodations_blocks_card_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accommodations_blocks_card_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accommodations_blocks_card_grid_ctas" ADD CONSTRAINT "accommodations_blocks_card_grid_ctas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accommodations_blocks_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accommodations_blocks_card_grid_ctas_locales" ADD CONSTRAINT "accommodations_blocks_card_grid_ctas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accommodations_blocks_card_grid_ctas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accommodations_blocks_blog" ADD CONSTRAINT "accommodations_blocks_blog_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accommodations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accommodations_blocks_blog_locales" ADD CONSTRAINT "accommodations_blocks_blog_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accommodations_blocks_blog"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accommodations_numbers" ADD CONSTRAINT "accommodations_numbers_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."accommodations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_icon_grid_ctas" ADD CONSTRAINT "pages_blocks_icon_grid_ctas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_icon_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_icon_grid_ctas_locales" ADD CONSTRAINT "pages_blocks_icon_grid_ctas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_icon_grid_ctas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_card_grid_items" ADD CONSTRAINT "pages_blocks_card_grid_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_card_grid_items" ADD CONSTRAINT "pages_blocks_card_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_card_grid_items_locales" ADD CONSTRAINT "pages_blocks_card_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_card_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_card_grid_ctas" ADD CONSTRAINT "pages_blocks_card_grid_ctas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_card_grid_ctas_locales" ADD CONSTRAINT "pages_blocks_card_grid_ctas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_card_grid_ctas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_blog" ADD CONSTRAINT "pages_blocks_blog_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_blog_locales" ADD CONSTRAINT "pages_blocks_blog_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_blog"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_numbers" ADD CONSTRAINT "pages_numbers_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "accommodations_blocks_icon_grid_ctas_order_idx" ON "accommodations_blocks_icon_grid_ctas" USING btree ("_order");
  CREATE INDEX "accommodations_blocks_icon_grid_ctas_parent_id_idx" ON "accommodations_blocks_icon_grid_ctas" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "accommodations_blocks_icon_grid_ctas_locales_locale_parent_i" ON "accommodations_blocks_icon_grid_ctas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "accommodations_blocks_card_grid_items_order_idx" ON "accommodations_blocks_card_grid_items" USING btree ("_order");
  CREATE INDEX "accommodations_blocks_card_grid_items_parent_id_idx" ON "accommodations_blocks_card_grid_items" USING btree ("_parent_id");
  CREATE INDEX "accommodations_blocks_card_grid_items_image_idx" ON "accommodations_blocks_card_grid_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "accommodations_blocks_card_grid_items_locales_locale_parent_" ON "accommodations_blocks_card_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "accommodations_blocks_card_grid_ctas_order_idx" ON "accommodations_blocks_card_grid_ctas" USING btree ("_order");
  CREATE INDEX "accommodations_blocks_card_grid_ctas_parent_id_idx" ON "accommodations_blocks_card_grid_ctas" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "accommodations_blocks_card_grid_ctas_locales_locale_parent_i" ON "accommodations_blocks_card_grid_ctas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "accommodations_blocks_blog_order_idx" ON "accommodations_blocks_blog" USING btree ("_order");
  CREATE INDEX "accommodations_blocks_blog_parent_id_idx" ON "accommodations_blocks_blog" USING btree ("_parent_id");
  CREATE INDEX "accommodations_blocks_blog_path_idx" ON "accommodations_blocks_blog" USING btree ("_path");
  CREATE UNIQUE INDEX "accommodations_blocks_blog_locales_locale_parent_id_unique" ON "accommodations_blocks_blog_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "accommodations_numbers_order_parent_idx" ON "accommodations_numbers" USING btree ("order","parent_id");
  CREATE INDEX "pages_blocks_icon_grid_ctas_order_idx" ON "pages_blocks_icon_grid_ctas" USING btree ("_order");
  CREATE INDEX "pages_blocks_icon_grid_ctas_parent_id_idx" ON "pages_blocks_icon_grid_ctas" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_icon_grid_ctas_locales_locale_parent_id_unique" ON "pages_blocks_icon_grid_ctas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_card_grid_items_order_idx" ON "pages_blocks_card_grid_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_card_grid_items_parent_id_idx" ON "pages_blocks_card_grid_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_card_grid_items_image_idx" ON "pages_blocks_card_grid_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_card_grid_items_locales_locale_parent_id_unique" ON "pages_blocks_card_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_card_grid_ctas_order_idx" ON "pages_blocks_card_grid_ctas" USING btree ("_order");
  CREATE INDEX "pages_blocks_card_grid_ctas_parent_id_idx" ON "pages_blocks_card_grid_ctas" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_card_grid_ctas_locales_locale_parent_id_unique" ON "pages_blocks_card_grid_ctas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_blog_order_idx" ON "pages_blocks_blog" USING btree ("_order");
  CREATE INDEX "pages_blocks_blog_parent_id_idx" ON "pages_blocks_blog" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_blog_path_idx" ON "pages_blocks_blog" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_blog_locales_locale_parent_id_unique" ON "pages_blocks_blog_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_numbers_order_parent_idx" ON "pages_numbers" USING btree ("order","parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "accommodations_blocks_card_grid_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "accommodations_blocks_card_grid_cards_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_card_grid_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "pages_blocks_card_grid_cards_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  DROP TABLE "accommodations_blocks_icon_grid_ctas" CASCADE;
  DROP TABLE "accommodations_blocks_icon_grid_ctas_locales" CASCADE;
  DROP TABLE "accommodations_blocks_card_grid_items" CASCADE;
  DROP TABLE "accommodations_blocks_card_grid_items_locales" CASCADE;
  DROP TABLE "accommodations_blocks_card_grid_ctas" CASCADE;
  DROP TABLE "accommodations_blocks_card_grid_ctas_locales" CASCADE;
  DROP TABLE "accommodations_blocks_blog" CASCADE;
  DROP TABLE "accommodations_blocks_blog_locales" CASCADE;
  DROP TABLE "accommodations_numbers" CASCADE;
  DROP TABLE "pages_blocks_icon_grid_ctas" CASCADE;
  DROP TABLE "pages_blocks_icon_grid_ctas_locales" CASCADE;
  DROP TABLE "pages_blocks_card_grid_items" CASCADE;
  DROP TABLE "pages_blocks_card_grid_items_locales" CASCADE;
  DROP TABLE "pages_blocks_card_grid_ctas" CASCADE;
  DROP TABLE "pages_blocks_card_grid_ctas_locales" CASCADE;
  DROP TABLE "pages_blocks_blog" CASCADE;
  DROP TABLE "pages_blocks_blog_locales" CASCADE;
  DROP TABLE "pages_numbers" CASCADE;
  ALTER TABLE "accommodations_equipment" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_accommodations_equipment_icon";
  CREATE TYPE "public"."enum_accommodations_equipment_icon" AS ENUM('utensils', 'bed', 'waves', 'mapPin', 'wifi', 'car', 'users', 'calendar', 'phone', 'mail', 'check', 'x', 'chevronRight', 'chevronLeft', 'chevronDown', 'arrowRight', 'star', 'heart', 'menu', 'search', 'pawPrint', 'help', 'video', 'user', 'train', 'plane');
  ALTER TABLE "accommodations_equipment" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_accommodations_equipment_icon" USING "icon"::"public"."enum_accommodations_equipment_icon";
  ALTER TABLE "accommodations_features" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_accommodations_features_icon";
  CREATE TYPE "public"."enum_accommodations_features_icon" AS ENUM('utensils', 'bed', 'waves', 'mapPin', 'wifi', 'car', 'users', 'calendar', 'phone', 'mail', 'check', 'x', 'chevronRight', 'chevronLeft', 'chevronDown', 'arrowRight', 'star', 'heart', 'menu', 'search', 'pawPrint', 'help', 'video', 'user', 'train', 'plane');
  ALTER TABLE "accommodations_features" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_accommodations_features_icon" USING "icon"::"public"."enum_accommodations_features_icon";
  ALTER TABLE "accommodations_blocks_media_text_ctas" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "accommodations_blocks_media_text_ctas" ALTER COLUMN "variant" SET DEFAULT 'primary'::text;
  DROP TYPE "public"."enum_accommodations_blocks_media_text_ctas_variant";
  CREATE TYPE "public"."enum_accommodations_blocks_media_text_ctas_variant" AS ENUM('primary', 'secondary', 'outline', 'ghost');
  ALTER TABLE "accommodations_blocks_media_text_ctas" ALTER COLUMN "variant" SET DEFAULT 'primary'::"public"."enum_accommodations_blocks_media_text_ctas_variant";
  ALTER TABLE "accommodations_blocks_media_text_ctas" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_accommodations_blocks_media_text_ctas_variant" USING "variant"::"public"."enum_accommodations_blocks_media_text_ctas_variant";
  ALTER TABLE "accommodations_blocks_icon_grid_items" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_accommodations_blocks_icon_grid_items_icon";
  CREATE TYPE "public"."enum_accommodations_blocks_icon_grid_items_icon" AS ENUM('utensils', 'bed', 'waves', 'mapPin', 'wifi', 'car', 'users', 'calendar', 'phone', 'mail', 'check', 'x', 'chevronRight', 'chevronLeft', 'chevronDown', 'arrowRight', 'star', 'heart', 'menu', 'search', 'pawPrint', 'help', 'video', 'user', 'train', 'plane');
  ALTER TABLE "accommodations_blocks_icon_grid_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_accommodations_blocks_icon_grid_items_icon" USING "icon"::"public"."enum_accommodations_blocks_icon_grid_items_icon";
  ALTER TABLE "accommodations_blocks_cta_links" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "accommodations_blocks_cta_links" ALTER COLUMN "variant" SET DEFAULT 'primary'::text;
  DROP TYPE "public"."enum_accommodations_blocks_cta_links_variant";
  CREATE TYPE "public"."enum_accommodations_blocks_cta_links_variant" AS ENUM('primary', 'secondary', 'outline', 'ghost');
  ALTER TABLE "accommodations_blocks_cta_links" ALTER COLUMN "variant" SET DEFAULT 'primary'::"public"."enum_accommodations_blocks_cta_links_variant";
  ALTER TABLE "accommodations_blocks_cta_links" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_accommodations_blocks_cta_links_variant" USING "variant"::"public"."enum_accommodations_blocks_cta_links_variant";
  ALTER TABLE "entities_features" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_entities_features_icon";
  CREATE TYPE "public"."enum_entities_features_icon" AS ENUM('utensils', 'bed', 'waves', 'mapPin', 'wifi', 'car', 'users', 'calendar', 'phone', 'mail', 'check', 'x', 'chevronRight', 'chevronLeft', 'chevronDown', 'arrowRight', 'star', 'heart', 'menu', 'search', 'pawPrint', 'help', 'video', 'user', 'train', 'plane');
  ALTER TABLE "entities_features" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_entities_features_icon" USING "icon"::"public"."enum_entities_features_icon";
  ALTER TABLE "entities" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_entities_icon";
  CREATE TYPE "public"."enum_entities_icon" AS ENUM('utensils', 'bed', 'waves', 'mapPin', 'wifi', 'car', 'users', 'calendar', 'phone', 'mail', 'check', 'x', 'chevronRight', 'chevronLeft', 'chevronDown', 'arrowRight', 'star', 'heart', 'menu', 'search', 'pawPrint', 'help', 'video', 'user', 'train', 'plane');
  ALTER TABLE "entities" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_entities_icon" USING "icon"::"public"."enum_entities_icon";
  ALTER TABLE "pages_blocks_media_text_ctas" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_media_text_ctas" ALTER COLUMN "variant" SET DEFAULT 'primary'::text;
  DROP TYPE "public"."enum_pages_blocks_media_text_ctas_variant";
  CREATE TYPE "public"."enum_pages_blocks_media_text_ctas_variant" AS ENUM('primary', 'secondary', 'outline', 'ghost');
  ALTER TABLE "pages_blocks_media_text_ctas" ALTER COLUMN "variant" SET DEFAULT 'primary'::"public"."enum_pages_blocks_media_text_ctas_variant";
  ALTER TABLE "pages_blocks_media_text_ctas" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_pages_blocks_media_text_ctas_variant" USING "variant"::"public"."enum_pages_blocks_media_text_ctas_variant";
  ALTER TABLE "pages_blocks_icon_grid_items" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_pages_blocks_icon_grid_items_icon";
  CREATE TYPE "public"."enum_pages_blocks_icon_grid_items_icon" AS ENUM('utensils', 'bed', 'waves', 'mapPin', 'wifi', 'car', 'users', 'calendar', 'phone', 'mail', 'check', 'x', 'chevronRight', 'chevronLeft', 'chevronDown', 'arrowRight', 'star', 'heart', 'menu', 'search', 'pawPrint', 'help', 'video', 'user', 'train', 'plane');
  ALTER TABLE "pages_blocks_icon_grid_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_pages_blocks_icon_grid_items_icon" USING "icon"::"public"."enum_pages_blocks_icon_grid_items_icon";
  ALTER TABLE "pages_blocks_cta_links" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_cta_links" ALTER COLUMN "variant" SET DEFAULT 'primary'::text;
  DROP TYPE "public"."enum_pages_blocks_cta_links_variant";
  CREATE TYPE "public"."enum_pages_blocks_cta_links_variant" AS ENUM('primary', 'secondary', 'outline', 'ghost');
  ALTER TABLE "pages_blocks_cta_links" ALTER COLUMN "variant" SET DEFAULT 'primary'::"public"."enum_pages_blocks_cta_links_variant";
  ALTER TABLE "pages_blocks_cta_links" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_pages_blocks_cta_links_variant" USING "variant"::"public"."enum_pages_blocks_cta_links_variant";
  ALTER TABLE "accommodations_blocks_card_grid_cards" ADD CONSTRAINT "accommodations_blocks_card_grid_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "accommodations_blocks_card_grid_cards" ADD CONSTRAINT "accommodations_blocks_card_grid_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accommodations_blocks_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accommodations_blocks_card_grid_cards_locales" ADD CONSTRAINT "accommodations_blocks_card_grid_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accommodations_blocks_card_grid_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_card_grid_cards" ADD CONSTRAINT "pages_blocks_card_grid_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_card_grid_cards" ADD CONSTRAINT "pages_blocks_card_grid_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_card_grid_cards_locales" ADD CONSTRAINT "pages_blocks_card_grid_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_card_grid_cards"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "accommodations_blocks_card_grid_cards_order_idx" ON "accommodations_blocks_card_grid_cards" USING btree ("_order");
  CREATE INDEX "accommodations_blocks_card_grid_cards_parent_id_idx" ON "accommodations_blocks_card_grid_cards" USING btree ("_parent_id");
  CREATE INDEX "accommodations_blocks_card_grid_cards_image_idx" ON "accommodations_blocks_card_grid_cards" USING btree ("image_id");
  CREATE UNIQUE INDEX "accommodations_blocks_card_grid_cards_locales_locale_parent_" ON "accommodations_blocks_card_grid_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_card_grid_cards_order_idx" ON "pages_blocks_card_grid_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_card_grid_cards_parent_id_idx" ON "pages_blocks_card_grid_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_card_grid_cards_image_idx" ON "pages_blocks_card_grid_cards" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_card_grid_cards_locales_locale_parent_id_unique" ON "pages_blocks_card_grid_cards_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "accommodations_blocks_icon_grid" DROP COLUMN "heading_tone";
  ALTER TABLE "accommodations_blocks_icon_grid" DROP COLUMN "columns";
  ALTER TABLE "accommodations_blocks_icon_grid" DROP COLUMN "variant";
  ALTER TABLE "accommodations_blocks_icon_grid" DROP COLUMN "background";
  ALTER TABLE "accommodations_blocks_icon_grid_locales" DROP COLUMN "description";
  ALTER TABLE "accommodations_blocks_card_grid" DROP COLUMN "heading_tone";
  ALTER TABLE "accommodations_blocks_card_grid" DROP COLUMN "background";
  ALTER TABLE "accommodations_blocks_card_grid" DROP COLUMN "card";
  ALTER TABLE "accommodations_blocks_card_grid" DROP COLUMN "card_size";
  ALTER TABLE "accommodations_blocks_card_grid" DROP COLUMN "columns";
  ALTER TABLE "accommodations_blocks_card_grid" DROP COLUMN "source";
  ALTER TABLE "accommodations_blocks_card_grid" DROP COLUMN "source_config_category";
  ALTER TABLE "accommodations_blocks_card_grid" DROP COLUMN "source_config_limit";
  ALTER TABLE "accommodations_blocks_card_grid" DROP COLUMN "source_config_featured";
  ALTER TABLE "accommodations_blocks_card_grid_locales" DROP COLUMN "description";
  ALTER TABLE "pages_blocks_icon_grid" DROP COLUMN "heading_tone";
  ALTER TABLE "pages_blocks_icon_grid" DROP COLUMN "columns";
  ALTER TABLE "pages_blocks_icon_grid" DROP COLUMN "variant";
  ALTER TABLE "pages_blocks_icon_grid" DROP COLUMN "background";
  ALTER TABLE "pages_blocks_icon_grid_locales" DROP COLUMN "description";
  ALTER TABLE "pages_blocks_card_grid" DROP COLUMN "heading_tone";
  ALTER TABLE "pages_blocks_card_grid" DROP COLUMN "background";
  ALTER TABLE "pages_blocks_card_grid" DROP COLUMN "card";
  ALTER TABLE "pages_blocks_card_grid" DROP COLUMN "card_size";
  ALTER TABLE "pages_blocks_card_grid" DROP COLUMN "columns";
  ALTER TABLE "pages_blocks_card_grid" DROP COLUMN "source";
  ALTER TABLE "pages_blocks_card_grid" DROP COLUMN "source_config_category";
  ALTER TABLE "pages_blocks_card_grid" DROP COLUMN "source_config_limit";
  ALTER TABLE "pages_blocks_card_grid" DROP COLUMN "source_config_featured";
  ALTER TABLE "pages_blocks_card_grid_locales" DROP COLUMN "description";
  DROP TYPE "public"."enum_accommodations_blocks_icon_grid_ctas_variant";
  DROP TYPE "public"."enum_accommodations_blocks_icon_grid_ctas_icon";
  DROP TYPE "public"."enum_accommodations_blocks_icon_grid_heading_tone";
  DROP TYPE "public"."enum_accommodations_blocks_icon_grid_variant";
  DROP TYPE "public"."enum_accommodations_blocks_icon_grid_background";
  DROP TYPE "public"."enum_accommodations_blocks_card_grid_items_variant";
  DROP TYPE "public"."enum_accommodations_blocks_card_grid_ctas_variant";
  DROP TYPE "public"."enum_accommodations_blocks_card_grid_ctas_icon";
  DROP TYPE "public"."enum_accommodations_blocks_card_grid_heading_tone";
  DROP TYPE "public"."enum_accommodations_blocks_card_grid_background";
  DROP TYPE "public"."enum_accommodations_blocks_card_grid_card";
  DROP TYPE "public"."enum_accommodations_blocks_card_grid_card_size";
  DROP TYPE "public"."enum_accommodations_blocks_card_grid_source";
  DROP TYPE "public"."enum_accommodations_blocks_blog_heading_tone";
  DROP TYPE "public"."enum_accommodations_blocks_blog_background";
  DROP TYPE "public"."enum_accommodations_blocks_blog_source";
  DROP TYPE "public"."enum_pages_blocks_icon_grid_ctas_variant";
  DROP TYPE "public"."enum_pages_blocks_icon_grid_ctas_icon";
  DROP TYPE "public"."enum_pages_blocks_icon_grid_heading_tone";
  DROP TYPE "public"."enum_pages_blocks_icon_grid_variant";
  DROP TYPE "public"."enum_pages_blocks_icon_grid_background";
  DROP TYPE "public"."enum_pages_blocks_card_grid_items_variant";
  DROP TYPE "public"."enum_pages_blocks_card_grid_ctas_variant";
  DROP TYPE "public"."enum_pages_blocks_card_grid_ctas_icon";
  DROP TYPE "public"."enum_pages_blocks_card_grid_heading_tone";
  DROP TYPE "public"."enum_pages_blocks_card_grid_background";
  DROP TYPE "public"."enum_pages_blocks_card_grid_card";
  DROP TYPE "public"."enum_pages_blocks_card_grid_card_size";
  DROP TYPE "public"."enum_pages_blocks_card_grid_source";
  DROP TYPE "public"."enum_pages_blocks_blog_heading_tone";
  DROP TYPE "public"."enum_pages_blocks_blog_background";
  DROP TYPE "public"."enum_pages_blocks_blog_source";`)
}
