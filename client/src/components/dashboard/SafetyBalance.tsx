import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { PlatformMetric } from "@/types/dashboard";

interface SafetyBalanceProps {
  data: PlatformMetric[] | undefined;
  youtubeData?: any[];
  isLoading: boolean;
  error: Error | null;
}

export default function SafetyBalance({ data, youtubeData, isLoading, error }: SafetyBalanceProps) {
  if (error) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-50">Harm & Safety Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-red-400">
            Error loading platform data: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-50">Harm & Safety Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full bg-slate-700" />
        </CardContent>
      </Card>
    );
  }

  const getPlatformInfo = (platform: string) => {
    switch (platform) {
      case 'tiktok':
        return { name: 'TikTok', icon: 'TT', bgColor: 'bg-pink-600' };
      case 'twitter':
        return { name: 'X (Twitter)', icon: 'X', bgColor: 'bg-black' };
      case 'instagram':
        return { name: 'Instagram', icon: 'IG', bgColor: 'bg-gradient-to-br from-purple-500 to-pink-500' };
      case 'youtube':
        return { name: 'YouTube', icon: 'YT', bgColor: 'bg-red-600' };
      case 'reddit':
        return { name: 'Reddit', icon: 'R', bgColor: 'bg-orange-600' };
      case 'x':
        return { name: 'X (Twitter)', icon: 'X', bgColor: 'bg-black' };
      default:
        return { name: platform, icon: platform.slice(0, 2).toUpperCase(), bgColor: 'bg-slate-600' };
    }
  };

  // Calculate YouTube metrics from real data
  const calculateYouTubeMetrics = () => {
    if (!youtubeData || youtubeData.length === 0) {
      return { harmPercentage: 0, safetyPercentage: 0 };
    }

    const harmfulContent = youtubeData.filter(video => 
      video.classification === 'intent' || 
      video.classification === 'challenge' || 
      video.classification === 'promotion' ||
      video.riskScore > 5
    ).length;

    const total = youtubeData.length;
    if (total === 0) return { harmPercentage: 0, safetyPercentage: 0 };

    const harmPercentage = Math.round((harmfulContent / total) * 100);
    const safetyPercentage = 100 - harmPercentage; // Ensure they add up to 100%

    return {
      harmPercentage,
      safetyPercentage
    };
  };

  const youtubeMetrics = calculateYouTubeMetrics();

  // Combine existing data with YouTube metrics
  const enhancedData = data ? [...data] : [];
  
  // Add YouTube metrics if we have data
  if (youtubeData && youtubeData.length > 0) {
    enhancedData.push({
      id: 999,
      platform: 'youtube',
      harmPercentage: youtubeMetrics.harmPercentage,
      safetyPercentage: youtubeMetrics.safetyPercentage,
      timestamp: new Date().toISOString()
    });
  }

  if (!enhancedData || enhancedData.length === 0) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-50">Harm & Safety Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-slate-400 text-center py-8">
            No platform metrics available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-50">Harm & Safety Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {enhancedData.map((metric) => {
            const platformInfo = getPlatformInfo(metric.platform);
            return (
              <div key={metric.id} className="flex items-center justify-between py-3 border-b border-slate-700 last:border-b-0">
                <div className="flex items-center gap-3">
                  <Avatar className={`w-8 h-8 ${platformInfo.bgColor}`}>
                    <AvatarFallback className="text-white text-xs font-bold bg-transparent">
                      {platformInfo.icon}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-slate-200">{platformInfo.name}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-slate-400">Harm</div>
                    <div className="font-semibold text-red-400">{metric.harmPercentage.toFixed(0)}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-slate-400">Safety</div>
                    <div className="font-semibold text-emerald-400">{metric.safetyPercentage.toFixed(0)}%</div>
                  </div>
                  <Avatar className="w-10 h-10 bg-slate-700">
                    <AvatarFallback className="bg-slate-700" />
                  </Avatar>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
