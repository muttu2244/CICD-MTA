import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import type { RiskLocation } from "@/types/dashboard";
import { useMTAStations } from "@/hooks/useDashboardData";

interface MTAStationRisk {
  id: string;
  name: string;
  risk: 'low' | 'medium' | 'high' | 'critical';
  incidents: number;
  riskScore: number;
}

interface RiskHeatmapProps {
  data: RiskLocation[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

export default function RiskHeatmap({ data, isLoading, error }: RiskHeatmapProps) {
  const { data: mtaStations, isLoading: mtaLoading, error: mtaError } = useMTAStations();
  if (error) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-50">Station Risk Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-red-400">
            Error loading risk data: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading || mtaLoading) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-50">Station Risk Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full bg-slate-700" />
        </CardContent>
      </Card>
    );
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'rgb(239, 68, 68)'; // Red
      case 'high': return 'rgb(249, 115, 22)';     // Orange
      case 'medium': return 'rgb(234, 179, 8)';   // Amber
      case 'low': return 'rgb(34, 197, 94)';      // Green
      default: return 'rgba(100, 116, 139, 0.5)';
    }
  };

  // Use real MTA station data with proper typing and sort by risk level
  const stationHeatmapData: MTAStationRisk[] = Array.isArray(mtaStations) ? 
    mtaStations.sort((a: MTAStationRisk, b: MTAStationRisk) => {
      const riskOrder: Record<string, number> = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
      const aOrder = riskOrder[a.risk] ?? 4;
      const bOrder = riskOrder[b.risk] ?? 4;
      if (aOrder !== bOrder) return aOrder - bOrder;
      // If same risk level, sort by incidents (highest first)
      return b.incidents - a.incidents;
    }) : [];

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-50 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-red-400" />
          Station Risk Heatmap
          <Badge variant="outline" className="text-xs ml-auto">
            {stationHeatmapData.length} Stations
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 flex flex-col">
          {/* Scrollable Station Heatmap */}
          <div className="flex-1 overflow-y-auto pr-2 mb-4">
            <div className="grid grid-cols-4 gap-2">
              {stationHeatmapData.map((station, index) => (
                <div
                  key={`${station.name}-${index}`}
                  className="relative group cursor-pointer transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: getRiskColor(station.risk)
                  }}
                >
                  <div className="aspect-[3/2] rounded-sm flex items-center justify-center p-1">
                    <span className="text-xs font-bold text-white text-center leading-tight drop-shadow-lg" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                      {station.name}
                    </span>
                  </div>
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 whitespace-nowrap">
                    <div className="font-semibold">{station.name}</div>
                    <div className="text-slate-300">Risk: {station.risk}</div>
                    <div className="text-slate-300">{station.incidents} incidents</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fixed Risk Statistics at Bottom */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { level: 'critical', count: stationHeatmapData.filter(s => s.risk === 'critical').length, color: 'rgb(239, 68, 68)' },
              { level: 'high', count: stationHeatmapData.filter(s => s.risk === 'high').length, color: 'rgb(249, 115, 22)' },
              { level: 'medium', count: stationHeatmapData.filter(s => s.risk === 'medium').length, color: 'rgb(234, 179, 8)' },
              { level: 'low', count: stationHeatmapData.filter(s => s.risk === 'low').length, color: 'rgb(34, 197, 94)' }
            ].map(stat => (
              <div key={stat.level} className="text-center p-2 rounded-lg bg-slate-700/30">
                <div 
                  className="w-4 h-4 rounded mx-auto mb-1"
                  style={{ backgroundColor: stat.color }}
                />
                <div className="text-xs text-slate-400 capitalize">{stat.level}</div>
                <div className="text-sm font-semibold text-slate-200">{stat.count}</div>
              </div>
            ))}
          </div>

          {/* Risk Level Legend */}
          <div className="flex items-center justify-center gap-6 pt-3 border-t border-slate-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#ef4444' }} />
              <span className="text-xs text-slate-400">Critical Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#f97316' }} />
              <span className="text-xs text-slate-400">High Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#eab308' }} />
              <span className="text-xs text-slate-400">Medium Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#22c55e' }} />
              <span className="text-xs text-slate-400">Low Risk</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}