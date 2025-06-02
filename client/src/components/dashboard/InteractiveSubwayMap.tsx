import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, AlertTriangle, Clock, TrendingUp } from "lucide-react";
import { useState } from "react";

interface InteractiveSubwayMapProps {
  riskData?: any;
  isLoading?: boolean;
  error?: Error | null;
}

export default function InteractiveSubwayMap({ riskData, isLoading, error }: InteractiveSubwayMapProps) {
  const [selectedStation, setSelectedStation] = useState<any>(null);

  // Use real NYC subway stations from the API
  const stations = riskData?.stations || [];

  if (error) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-50 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-400" />
            NYC Subway Risk Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-red-400">
            Error loading subway data: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-50 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-400" />
            NYC Subway Risk Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-slate-700 rounded-lg animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  // Group stations by borough for better organization
  const stationsByBorough = stations.reduce((acc: any, station: any) => {
    if (!acc[station.borough]) acc[station.borough] = [];
    acc[station.borough].push(station);
    return acc;
  }, {});

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#22c55e';
      default: return '#64748b';
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-50 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-400" />
          NYC Subway Risk Monitor
          <Badge variant="outline" className="text-xs ml-auto">
            {stations.length} Stations Monitored
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 flex flex-col">
          {/* Real NYC Subway Network Visualization */}
          <div className="bg-slate-900 rounded-lg p-4 flex-1 relative overflow-y-auto">
            
            {/* NYC Subway Map Background */}
            <div className="absolute inset-0 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                
                {/* Manhattan Stations */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-slate-300 mb-3">Manhattan</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {stationsByBorough.Manhattan?.map((station: any) => (
                      <div
                        key={station.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedStation?.id === station.id 
                            ? 'border-blue-400 bg-blue-900/20' 
                            : 'border-slate-600 bg-slate-700/30 hover:bg-slate-700/50'
                        }`}
                        onClick={() => setSelectedStation(station)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-slate-200 text-sm">{station.name}</span>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: getRiskColor(station.riskLevel) }}
                            />
                            <Badge 
                              variant="outline" 
                              className="text-xs"
                              style={{ 
                                borderColor: getRiskColor(station.riskLevel), 
                                color: getRiskColor(station.riskLevel) 
                              }}
                            >
                              {station.riskLevel}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>Lines: {station.lines?.join(', ')}</span>
                          <span>{station.incidentCount} incidents</span>
                        </div>
                        
                        {station.lastIncident && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                            <Clock className="h-3 w-3" />
                            <span>Last: {station.lastIncident}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Brooklyn & Queens Stations */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-slate-300 mb-3">Brooklyn & Queens</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {[...stationsByBorough.Brooklyn || [], ...stationsByBorough.Queens || []].map((station: any) => (
                      <div
                        key={station.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedStation?.id === station.id 
                            ? 'border-blue-400 bg-blue-900/20' 
                            : 'border-slate-600 bg-slate-700/30 hover:bg-slate-700/50'
                        }`}
                        onClick={() => setSelectedStation(station)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-slate-200 text-sm">{station.name}</span>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: getRiskColor(station.riskLevel) }}
                            />
                            <Badge 
                              variant="outline" 
                              className="text-xs"
                              style={{ 
                                borderColor: getRiskColor(station.riskLevel), 
                                color: getRiskColor(station.riskLevel) 
                              }}
                            >
                              {station.riskLevel}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>{station.borough} - Lines: {station.lines?.join(', ')}</span>
                          <span>{station.incidentCount} incidents</span>
                        </div>
                        
                        {station.lastIncident && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                            <Clock className="h-3 w-3" />
                            <span>Last: {station.lastIncident}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Station Details */}
          {selectedStation && (
            <div className="mt-4 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-slate-200">{selectedStation.name}</h4>
                <Badge 
                  variant="outline"
                  style={{ 
                    borderColor: getRiskColor(selectedStation.riskLevel), 
                    color: getRiskColor(selectedStation.riskLevel) 
                  }}
                >
                  {selectedStation.riskLevel} Risk
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Borough:</span>
                  <span className="ml-2 text-slate-200">{selectedStation.borough}</span>
                </div>
                <div>
                  <span className="text-slate-400">Lines:</span>
                  <span className="ml-2 text-slate-200">{selectedStation.lines?.join(', ')}</span>
                </div>
                <div>
                  <span className="text-slate-400">Incidents:</span>
                  <span className="ml-2 text-slate-200">{selectedStation.incidentCount}</span>
                </div>
                <div>
                  <span className="text-slate-400">Last Incident:</span>
                  <span className="ml-2 text-slate-200">{selectedStation.lastIncident}</span>
                </div>
              </div>
              
              {selectedStation.trends && (
                <div className="mt-3 flex items-center gap-2">
                  <TrendingUp 
                    className={`h-4 w-4 ${
                      selectedStation.trends.direction === 'up' ? 'text-red-400' :
                      selectedStation.trends.direction === 'down' ? 'text-green-400' : 'text-yellow-400'
                    }`} 
                  />
                  <span className="text-xs text-slate-400">
                    Risk trend: {selectedStation.trends.direction} {selectedStation.trends.percentage}%
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Risk Level Summary */}
          <div className="mt-4 grid grid-cols-4 gap-2">
            {['critical', 'high', 'medium', 'low'].map(level => {
              const count = stations.filter((s: any) => s.riskLevel === level).length;
              return (
                <div key={level} className="text-center p-2 rounded-lg bg-slate-700/30">
                  <div 
                    className="w-4 h-4 rounded-full mx-auto mb-1"
                    style={{ backgroundColor: getRiskColor(level) }}
                  />
                  <div className="text-xs text-slate-400 capitalize">{level}</div>
                  <div className="text-sm font-semibold text-slate-200">{count}</div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}