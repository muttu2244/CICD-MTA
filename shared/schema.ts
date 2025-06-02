import { pgTable, text, serial, integer, boolean, timestamp, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const trendData = pgTable("trend_data", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(),
  intent: integer("intent").notNull(),
  glorification: integer("glorification").notNull(),
  warnings: integer("warnings").notNull(),
  incidents: integer("incidents").notNull(),
  campaigns: integer("campaigns").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(), // 'critical' | 'warning' | 'info'
  description: text("description"),
  timestamp: timestamp("timestamp").defaultNow(),
  isActive: boolean("is_active").default(true),
});

export const platformMetrics = pgTable("platform_metrics", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull(), // 'tiktok' | 'twitter' | 'instagram' | 'youtube' | 'reddit' | 'x'
  harmPercentage: real("harm_percentage").notNull(),
  safetyPercentage: real("safety_percentage").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const riskFeedItems = pgTable("risk_feed_items", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  classification: text("classification").notNull(), // 'intent' | 'location' | 'warning'
  platform: text("platform").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  metadata: jsonb("metadata"),
});

export const platformInsights = pgTable("platform_insights", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull(),
  content: text("content").notNull(),
  timeframe: text("timeframe"),
  timestamp: timestamp("timestamp").defaultNow(),
  type: text("type").notNull(), // 'metric' | 'trend' | 'alert'
});

export const riskLocations = pgTable("risk_locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  riskLevel: text("risk_level").notNull(), // 'low' | 'medium' | 'high' | 'critical'
  description: text("description"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Zod schemas
export const insertTrendDataSchema = createInsertSchema(trendData).omit({
  id: true,
  createdAt: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  timestamp: true,
});

export const insertPlatformMetricsSchema = createInsertSchema(platformMetrics).omit({
  id: true,
  timestamp: true,
});

export const insertRiskFeedItemSchema = createInsertSchema(riskFeedItems).omit({
  id: true,
  timestamp: true,
});

export const insertPlatformInsightSchema = createInsertSchema(platformInsights).omit({
  id: true,
  timestamp: true,
});

export const insertRiskLocationSchema = createInsertSchema(riskLocations).omit({
  id: true,
  timestamp: true,
});

// Types
export type InsertTrendData = z.infer<typeof insertTrendDataSchema>;
export type TrendData = typeof trendData.$inferSelect;

export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alerts.$inferSelect;

export type InsertPlatformMetrics = z.infer<typeof insertPlatformMetricsSchema>;
export type PlatformMetrics = typeof platformMetrics.$inferSelect;

export type InsertRiskFeedItem = z.infer<typeof insertRiskFeedItemSchema>;
export type RiskFeedItem = typeof riskFeedItems.$inferSelect;

export type InsertPlatformInsight = z.infer<typeof insertPlatformInsightSchema>;
export type PlatformInsight = typeof platformInsights.$inferSelect;

export type InsertRiskLocation = z.infer<typeof insertRiskLocationSchema>;
export type RiskLocation = typeof riskLocations.$inferSelect;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});
