export interface TrendDataPoint {
  date: string;
  intent: number;
  glorification: number;
  warnings: number;
  incidents: number;
  campaigns: number;
}

export interface Alert {
  id: number;
  title: string;
  type: 'critical' | 'warning' | 'info';
  description?: string;
  timestamp: string;
  isActive: boolean;
}

export interface PlatformMetric {
  id: number;
  platform: 'tiktok' | 'twitter' | 'instagram' | 'youtube';
  harmPercentage: number;
  safetyPercentage: number;
  timestamp: string;
}

export interface RiskFeedItem {
  id: number;
  content: string;
  classification: 'intent' | 'location' | 'warning';
  platform: string;
  timestamp: string;
  metadata?: any;
}

export interface PlatformInsight {
  id: number;
  platform: string;
  content: string;
  timeframe?: string;
  timestamp: string;
  type: 'metric' | 'trend' | 'alert';
}

export interface RiskLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  description?: string;
  timestamp: string;
}

export interface DashboardData {
  trendData: TrendDataPoint[];
  alerts: Alert[];
  platformMetrics: PlatformMetric[];
  riskFeedItems: RiskFeedItem[];
  platformInsights: PlatformInsight[];
  riskLocations: RiskLocation[];
}
