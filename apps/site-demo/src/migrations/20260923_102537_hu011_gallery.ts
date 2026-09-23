import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_accommodations_blocks_gallery_ctas_variant" AS ENUM('primary', 'secondary', 'outline', 'ghost', 'link', 'link-underline');
  CREATE TYPE "public"."enum_accommodations_blocks_gallery_ctas_icon" AS ENUM('arrowRight', 'chevronRight', 'calendar', 'phone', 'mail');
  CREATE TYPE "public"."enum_accommodations_blocks_gallery_background" AS ENUM('default', 'muted', 'none');
  CREATE TYPE "public"."enum_accommodations_blocks_gallery_variant" AS ENUM('slider', 'slider-thumbs', 'grid', 'masonry', 'collage');
  CREATE TYPE "public"."enum_accommodations_blocks_gallery_aspect_ratio" AS ENUM('16/9', '4/3', '3/2', '1/1', 'auto');
  CREATE TYPE "public"."enum_accommodations_blocks_gallery_effect" AS ENUM('slide', 'fade');
  CREATE TYPE "public"."enum_accommodations_blocks_gallery_heading_level" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_gallery_ctas_variant" AS ENUM('primary', 'secondary', 'outline', 'ghost', 'link', 'link-underline');
  CREATE TYPE "public"."enum_pages_blocks_gallery_ctas_icon" AS ENUM('arrowRight', 'chevronRight', 'calendar', 'phone', 'mail');
  CREATE TYPE "public"."enum_pages_blocks_gallery_background" AS ENUM('default', 'muted', 'none');
  CREATE TYPE "public"."enum_pages_blocks_gallery_variant" AS ENUM('slider', 'slider-thumbs', 'grid', 'masonry', 'collage');
  CREATE TYPE "public"."enum_pages_blocks_gallery_aspect_ratio" AS ENUM('16/9', '4/3', '3/2', '1/1', 'auto');
  CREATE TYPE "public"."enum_pages_blocks_gallery_effect" AS ENUM('slide', 'fade');
  CREATE TYPE "public"."enum_pages_blocks_gallery_heading_level" AS ENUM('2', '3', '4');
  CREATE TABLE "accommodations_blocks_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "accommodations_blocks_gallery_images_locales" (
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "accommodations_blocks_gallery_ctas" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL,
  	"variant" "enum_accommodations_blocks_gallery_ctas_variant" DEFAULT 'primary',
  	"icon" "enum_accommodations_blocks_gallery_ctas_icon"
  );
  
  CREATE TABLE "accommodations_blocks_gallery_ctas_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "accommodations_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background" "enum_accommodations_blocks_gallery_background" DEFAULT 'default',
  	"variant" "enum_accommodations_blocks_gallery_variant" DEFAULT 'slider',
  	"columns" numeric DEFAULT 3,
  	"aspect_ratio" "enum_accommodations_blocks_gallery_aspect_ratio" DEFAULT '16/9',
  	"lightbox" boolean DEFAULT true,
  	"autoplay" boolean DEFAULT false,
  	"autoplay_delay" numeric DEFAULT 3000,
  	"loop" boolean DEFAULT true,
  	"show_dots" boolean DEFAULT true,
  	"show_arrows" boolean DEFAULT true,
  	"effect" "enum_accommodations_blocks_gallery_effect" DEFAULT 'slide',
  	"slides_per_view" numeric DEFAULT 1,
  	"heading_level" "enum_accommodations_blocks_gallery_heading_level" DEFAULT '2',
  	"block_name" varchar
  );
  
  CREATE TABLE "accommodations_blocks_gallery_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_blocks_gallery_images_locales" (
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_gallery_ctas" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL,
  	"variant" "enum_pages_blocks_gallery_ctas_variant" DEFAULT 'primary',
  	"icon" "enum_pages_blocks_gallery_ctas_icon"
  );
  
  CREATE TABLE "pages_blocks_gallery_ctas_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background" "enum_pages_blocks_gallery_background" DEFAULT 'default',
  	"variant" "enum_pages_blocks_gallery_variant" DEFAULT 'slider',
  	"columns" numeric DEFAULT 3,
  	"aspect_ratio" "enum_pages_blocks_gallery_aspect_ratio" DEFAULT '16/9',
  	"lightbox" boolean DEFAULT true,
  	"autoplay" boolean DEFAULT false,
  	"autoplay_delay" numeric DEFAULT 3000,
  	"loop" boolean DEFAULT true,
  	"show_dots" boolean DEFAULT true,
  	"show_arrows" boolean DEFAULT true,
  	"effect" "enum_pages_blocks_gallery_effect" DEFAULT 'slide',
  	"slides_per_view" numeric DEFAULT 1,
  	"heading_level" "enum_pages_blocks_gallery_heading_level" DEFAULT '2',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_gallery_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "accommodations_blocks_gallery_images" ADD CONSTRAINT "accommodations_blocks_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "accommodations_blocks_gallery_images" ADD CONSTRAINT "accommodations_blocks_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accommodations_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accommodations_blocks_gallery_images_locales" ADD CONSTRAINT "accommodations_blocks_gallery_images_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accommodations_blocks_gallery_images"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accommodations_blocks_gallery_ctas" ADD CONSTRAINT "accommodations_blocks_gallery_ctas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accommodations_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accommodations_blocks_gallery_ctas_locales" ADD CONSTRAINT "accommodations_blocks_gallery_ctas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accommodations_blocks_gallery_ctas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accommodations_blocks_gallery" ADD CONSTRAINT "accommodations_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accommodations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accommodations_blocks_gallery_locales" ADD CONSTRAINT "accommodations_blocks_gallery_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accommodations_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery_images" ADD CONSTRAINT "pages_blocks_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery_images" ADD CONSTRAINT "pages_blocks_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery_images_locales" ADD CONSTRAINT "pages_blocks_gallery_images_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gallery_images"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery_ctas" ADD CONSTRAINT "pages_blocks_gallery_ctas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery_ctas_locales" ADD CONSTRAINT "pages_blocks_gallery_ctas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gallery_ctas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery" ADD CONSTRAINT "pages_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery_locales" ADD CONSTRAINT "pages_blocks_gallery_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "accommodations_blocks_gallery_images_order_idx" ON "accommodations_blocks_gallery_images" USING btree ("_order");
  CREATE INDEX "accommodations_blocks_gallery_images_parent_id_idx" ON "accommodations_blocks_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "accommodations_blocks_gallery_images_image_idx" ON "accommodations_blocks_gallery_images" USING btree ("image_id");
  CREATE UNIQUE INDEX "accommodations_blocks_gallery_images_locales_locale_parent_i" ON "accommodations_blocks_gallery_images_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "accommodations_blocks_gallery_ctas_order_idx" ON "accommodations_blocks_gallery_ctas" USING btree ("_order");
  CREATE INDEX "accommodations_blocks_gallery_ctas_parent_id_idx" ON "accommodations_blocks_gallery_ctas" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "accommodations_blocks_gallery_ctas_locales_locale_parent_id_" ON "accommodations_blocks_gallery_ctas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "accommodations_blocks_gallery_order_idx" ON "accommodations_blocks_gallery" USING btree ("_order");
  CREATE INDEX "accommodations_blocks_gallery_parent_id_idx" ON "accommodations_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "accommodations_blocks_gallery_path_idx" ON "accommodations_blocks_gallery" USING btree ("_path");
  CREATE UNIQUE INDEX "accommodations_blocks_gallery_locales_locale_parent_id_uniqu" ON "accommodations_blocks_gallery_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_gallery_images_order_idx" ON "pages_blocks_gallery_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_images_parent_id_idx" ON "pages_blocks_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_images_image_idx" ON "pages_blocks_gallery_images" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_gallery_images_locales_locale_parent_id_unique" ON "pages_blocks_gallery_images_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_gallery_ctas_order_idx" ON "pages_blocks_gallery_ctas" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_ctas_parent_id_idx" ON "pages_blocks_gallery_ctas" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_gallery_ctas_locales_locale_parent_id_unique" ON "pages_blocks_gallery_ctas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_gallery_order_idx" ON "pages_blocks_gallery" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_parent_id_idx" ON "pages_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_path_idx" ON "pages_blocks_gallery" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_gallery_locales_locale_parent_id_unique" ON "pages_blocks_gallery_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "accommodations_blocks_gallery_images" CASCADE;
  DROP TABLE "accommodations_blocks_gallery_images_locales" CASCADE;
  DROP TABLE "accommodations_blocks_gallery_ctas" CASCADE;
  DROP TABLE "accommodations_blocks_gallery_ctas_locales" CASCADE;
  DROP TABLE "accommodations_blocks_gallery" CASCADE;
  DROP TABLE "accommodations_blocks_gallery_locales" CASCADE;
  DROP TABLE "pages_blocks_gallery_images" CASCADE;
  DROP TABLE "pages_blocks_gallery_images_locales" CASCADE;
  DROP TABLE "pages_blocks_gallery_ctas" CASCADE;
  DROP TABLE "pages_blocks_gallery_ctas_locales" CASCADE;
  DROP TABLE "pages_blocks_gallery" CASCADE;
  DROP TABLE "pages_blocks_gallery_locales" CASCADE;
  DROP TYPE "public"."enum_accommodations_blocks_gallery_ctas_variant";
  DROP TYPE "public"."enum_accommodations_blocks_gallery_ctas_icon";
  DROP TYPE "public"."enum_accommodations_blocks_gallery_background";
  DROP TYPE "public"."enum_accommodations_blocks_gallery_variant";
  DROP TYPE "public"."enum_accommodations_blocks_gallery_aspect_ratio";
  DROP TYPE "public"."enum_accommodations_blocks_gallery_effect";
  DROP TYPE "public"."enum_accommodations_blocks_gallery_heading_level";
  DROP TYPE "public"."enum_pages_blocks_gallery_ctas_variant";
  DROP TYPE "public"."enum_pages_blocks_gallery_ctas_icon";
  DROP TYPE "public"."enum_pages_blocks_gallery_background";
  DROP TYPE "public"."enum_pages_blocks_gallery_variant";
  DROP TYPE "public"."enum_pages_blocks_gallery_aspect_ratio";
  DROP TYPE "public"."enum_pages_blocks_gallery_effect";
  DROP TYPE "public"."enum_pages_blocks_gallery_heading_level";`)
}
