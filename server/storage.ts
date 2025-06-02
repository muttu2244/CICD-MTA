import 'dotenv/config';
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, desc, and } from "drizzle-orm";
import { 
  users, 
  trendData, 
  alerts, 
  platformMetrics, 
  riskFeedItems, 
  platformInsights, 
  riskLocations,
  type User, 
  type InsertUser,
  type TrendData,
  type InsertTrendData,
  type Alert,
  type InsertAlert,
  type PlatformMetrics,
  type InsertPlatformMetrics,
  type RiskFeedItem,
  type InsertRiskFeedItem,
  type PlatformInsight,
  type InsertPlatformInsight,
  type RiskLocation,
  type InsertRiskLocation
} from "@shared/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getTrendData(): Promise<TrendData[]>;
  getActiveAlerts(): Promise<Alert[]>;
  getPlatformMetrics(): Promise<PlatformMetrics[]>;
  getRecentRiskFeedItems(): Promise<RiskFeedItem[]>;
  getPlatformInsights(): Promise<PlatformInsight[]>;
  getRiskLocations(): Promise<RiskLocation[]>;
  seedSampleData(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getTrendData(): Promise<TrendData[]> {
    const result = await db.select().from(trendData).orderBy(desc(trendData.createdAt)).limit(10);
    return result;
  }

  async getActiveAlerts(): Promise<Alert[]> {
    const result = await db.select().from(alerts).where(eq(alerts.isActive, true)).orderBy(desc(alerts.timestamp));
    return result;
  }

  async getPlatformMetrics(): Promise<PlatformMetrics[]> {
    const result = await db.select().from(platformMetrics).orderBy(desc(platformMetrics.timestamp));
    return result;
  }

  async getRecentRiskFeedItems(): Promise<RiskFeedItem[]> {
    const result = await db.select().from(riskFeedItems).orderBy(desc(riskFeedItems.timestamp)).limit(20);
    return result;
  }

  async getPlatformInsights(): Promise<PlatformInsight[]> {
    const result = await db.select().from(platformInsights).orderBy(desc(platformInsights.timestamp)).limit(10);
    return result;
  }

  async getRiskLocations(): Promise<RiskLocation[]> {
    const result = await db.select().from(riskLocations).orderBy(desc(riskLocations.timestamp));
    return result;
  }

  async seedSampleData(): Promise<void> {
    // Clear existing data
    await db.delete(trendData);
    await db.delete(alerts);
    await db.delete(platformMetrics);
    await db.delete(riskFeedItems);
    await db.delete(platformInsights);
    await db.delete(riskLocations);

    // Insert sample trend data
    await db.insert(trendData).values([
      { date: "Mon", intent: 95, glorification: 110, warnings: 75, incidents: 85, campaigns: 70 },
      { date: "Tue", intent: 100, glorification: 115, warnings: 80, incidents: 90, campaigns: 75 },
      { date: "Wed", intent: 105, glorification: 120, warnings: 85, incidents: 95, campaigns: 80 },
      { date: "Thu", intent: 110, glorification: 125, warnings: 90, incidents: 100, campaigns: 85 },
      { date: "Fri", intent: 115, glorification: 130, warnings: 95, incidents: 105, campaigns: 90 }
    ]);

    // Insert sample alerts
    await db.insert(alerts).values([
      {
        title: "Surge in subway surfing intent on Bedford Avestation",
        type: "critical",
        description: "Multiple concerning posts detected in past 20 min",
        isActive: true
      },
      {
        title: "Drop in safety PSAs week on Instagram despite incident uptick",
        type: "warning",
        description: "Reduced safety messaging while incidents increase",
        isActive: true
      }
    ]);

    // Insert sample platform metrics
    await db.insert(platformMetrics).values([
      { platform: "tiktok", harmPercentage: 40, safetyPercentage: 5 },
      { platform: "twitter", harmPercentage: 20, safetyPercentage: 10 },
      { platform: "instagram", harmPercentage: 25, safetyPercentage: 25 },
      { platform: "youtube", harmPercentage: 15, safetyPercentage: 30 },
      { platform: "reddit", harmPercentage: 18, safetyPercentage: 35 },
      { platform: "x", harmPercentage: 22, safetyPercentage: 12 }
    ]);

    // Insert sample risk feed items
    await db.insert(riskFeedItems).values([
      {
        content: "surf the G tonight!",
        classification: "intent",
        platform: "tiktok",
        metadata: {}
      },
      {
        content: "Let's go Saturday at 5!",
        classification: "location",
        platform: "instagram",
        metadata: {}
      },
      {
        content: "Footage of kids riding the G train roof",
        classification: "warning",
        platform: "twitter",
        metadata: {}
      },
      {
        content: "Anyone know good spots on the L train?",
        classification: "intent",
        platform: "discord",
        metadata: {}
      },
      {
        content: "Saw security at Union Square today",
        classification: "warning",
        platform: "reddit",
        metadata: {}
      },
      {
        content: "Meet at Williamsburg Bridge at 9pm",
        classification: "location",
        platform: "snapchat",
        metadata: {}
      },
      {
        content: "New video showing dangerous train surfing",
        classification: "warning",
        platform: "youtube",
        metadata: {}
      },
      {
        content: "Brooklyn bound J train",
        classification: "location",
        platform: "telegram",
        metadata: {}
      }
    ]);

    // Insert sample platform insights
    await db.insert(platformInsights).values([
      {
        platform: "TikTok",
        content: "3 new glorification posts flagged in past 20 min",
        timeframe: "Feb 2023",
        type: "alert"
      },
      {
        platform: "Instagram",
        content: "50% drop-went | since last hour",
        timeframe: "-50-mo",
        type: "metric"
      },
      {
        platform: "Reddit",
        content: "Increased backlash on subway surfing seen in comments",
        timeframe: "Abechan",
        type: "trend"
      },
      {
        platform: "YouTube",
        content: "15 viral subway surfing videos removed in last 2 hours",
        timeframe: "2 hours ago",
        type: "alert"
      },
      {
        platform: "Twitter",
        content: "Safety campaign engagement up 25% this week",
        timeframe: "This week",
        type: "metric"
      },
      {
        platform: "Discord",
        content: "New private servers detected organizing subway surfing",
        timeframe: "1 hour ago",
        type: "alert"
      },
      {
        platform: "Snapchat",
        content: "Location-based content filtering increased by 40%",
        timeframe: "24 hours",
        type: "trend"
      },
      {
        platform: "TikTok",
        content: "Algorithm changes reducing dangerous content reach",
        timeframe: "This month",
        type: "trend"
      },
      {
        platform: "Instagram",
        content: "Stories containing subway surfing keywords flagged",
        timeframe: "30 min ago",
        type: "alert"
      }
    ]);

    // Insert sample risk locations (NYC MTA areas)
    await db.insert(riskLocations).values([
      {
        name: "Bedford Ave (L)",
        latitude: 40.7167,
        longitude: -73.9568,
        riskLevel: "critical",
        description: "Multiple concerning posts detected near Bedford Avenue L train station"
      },
      {
        name: "Union Square (4/5/6/N/Q/R/W/L)",
        latitude: 40.7359,
        longitude: -73.9911,
        riskLevel: "high",
        description: "Increased surveillance needed at major transit hub"
      },
      {
        name: "Coney Island (D/F/N/Q)",
        latitude: 40.5755,
        longitude: -73.9707,
        riskLevel: "medium",
        description: "Seasonal activity monitoring at terminal station"
      },
      {
        name: "Williamsburg Bridge (J/M/Z)",
        latitude: 40.7081,
        longitude: -73.9571,
        riskLevel: "high",
        description: "Bridge area requires additional safety measures"
      }
    ]);
  }
}

export const storage = new DatabaseStorage();
