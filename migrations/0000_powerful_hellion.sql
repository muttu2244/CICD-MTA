CREATE TABLE "alerts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"type" text NOT NULL,
	"description" text,
	"timestamp" timestamp DEFAULT now(),
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "platform_insights" (
	"id" serial PRIMARY KEY NOT NULL,
	"platform" text NOT NULL,
	"content" text NOT NULL,
	"timeframe" text,
	"timestamp" timestamp DEFAULT now(),
	"type" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "platform_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"platform" text NOT NULL,
	"harm_percentage" real NOT NULL,
	"safety_percentage" real NOT NULL,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "risk_feed_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"classification" text NOT NULL,
	"platform" text NOT NULL,
	"timestamp" timestamp DEFAULT now(),
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "risk_locations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"latitude" real NOT NULL,
	"longitude" real NOT NULL,
	"risk_level" text NOT NULL,
	"description" text,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trend_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" text NOT NULL,
	"intent" integer NOT NULL,
	"glorification" integer NOT NULL,
	"warnings" integer NOT NULL,
	"incidents" integer NOT NULL,
	"campaigns" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
