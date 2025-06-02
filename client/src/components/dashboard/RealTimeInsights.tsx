import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { PlatformInsight } from "@/types/dashboard";

interface RealTimeInsightsProps {
  data: PlatformInsight[] | undefined;
  isLoading: boolean;
  error: Error | null;
  onInsightSelect?: (insight: PlatformInsight) => void;
}

export default function RealTimeInsights({ data, isLoading, error, onInsightSelect }: RealTimeInsightsProps) {
  if (error) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-50">Real-Time Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-red-400">
            Error loading insights: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-50">Real-Time Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full bg-slate-700" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-50">Real-Time Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-slate-400">
            No insights available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-50">Real-Time Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-4 pr-3">
            {data.map((insight) => (
              <div 
                key={insight.id} 
                className="bg-slate-700/50 rounded-lg p-4 cursor-pointer hover:bg-slate-700/70 transition-colors"
                onClick={() => onInsightSelect?.(insight)}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-slate-200">{insight.platform}</span>
                  <span className="text-sm text-slate-400">
                    {insight.timeframe || new Date(insight.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    insight.type === 'alert' ? 'bg-red-500' :
                    insight.type === 'trend' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                  <span className="text-sm text-slate-300">{insight.content}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
