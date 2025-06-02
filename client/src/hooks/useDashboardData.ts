import { useQuery } from "@tanstack/react-query";
import type { DashboardData } from "@/types/dashboard";

export function useDashboardData() {
  return useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
    refetchInterval: 30000, // Refresh every 30 seconds for real-time updates
  });
}

export function useTrendData() {
  return useQuery({
    queryKey: ["/api/dashboard/trends"],
    refetchInterval: 60000,
  });
}

export function useAlerts() {
  return useQuery({
    queryKey: ["/api/dashboard/alerts"],
    refetchInterval: 10000, // More frequent for alerts
  });
}

export function usePlatformMetrics() {
  return useQuery({
    queryKey: ["/api/dashboard/platforms"],
    refetchInterval: 30000,
  });
}

export function useRiskFeed() {
  return useQuery({
    queryKey: ["/api/dashboard/risk-feed"],
    refetchInterval: 5000, // Very frequent for live feed
  });
}

export function usePlatformInsights() {
  return useQuery({
    queryKey: ["/api/dashboard/insights"],
    refetchInterval: 30000,
  });
}

export function useRiskLocations() {
  return useQuery({
    queryKey: ["/api/dashboard/risk-locations"],
    refetchInterval: 30000,
  });
}

// ML Analytics hooks
export function useMLInsights() {
  return useQuery({
    queryKey: ["/api/analytics/insights"],
    refetchInterval: 60000, // Refresh every minute
  });
}

export function useRiskPredictions() {
  return useQuery({
    queryKey: ["/api/analytics/predictions"],
    refetchInterval: 120000, // Refresh every 2 minutes
  });
}

// Subway map data hook
export function useSubwayMapData() {
  return useQuery({
    queryKey: ["/api/subway/map-data"],
    refetchInterval: 30000, // Refresh every 30 seconds for real-time updates
  });
}

// YouTube subway surfing content hook
export function useYouTubeData() {
  return useQuery({
    queryKey: ["/api/youtube/subway-surfing"],
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });
}

// All NYC subway stations hook
export function useMTAStations() {
  return useQuery({
    queryKey: ["/api/mta/stations"],
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    refetchInterval: 24 * 60 * 60 * 1000, // Refresh daily
  });
}
