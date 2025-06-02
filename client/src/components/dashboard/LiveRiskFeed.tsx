import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { RiskFeedItem } from "@/types/dashboard";

interface LiveRiskFeedProps {
  data: RiskFeedItem[] | undefined;
  isLoading: boolean;
  error: Error | null;
  onRiskItemSelect?: (item: RiskFeedItem) => void;
}

export default function LiveRiskFeed({ data, isLoading, error, onRiskItemSelect }: LiveRiskFeedProps) {
  if (error) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-50">Live Risk Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-red-400">
            Error loading risk feed: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-50">Live Risk Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-slate-400 mb-3">Streaming mentions from social platforms</div>
          <div className="space-y-3 h-80">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-16 w-full bg-slate-700 rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'intent':
        return 'bg-blue-500';
      case 'location':
        return 'bg-emerald-500';
      case 'warning':
        return 'bg-amber-500';
      default:
        return 'bg-slate-500';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const feedTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - feedTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return feedTime.toLocaleDateString();
  };

  if (!data || data.length === 0) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-50">Live Risk Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-slate-400 mb-3">Streaming mentions from social platforms</div>
          <div className="h-80 flex items-center justify-center text-slate-400">
            No risk feed items available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-50">Live Risk Feed</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-slate-400 mb-4">Streaming mentions from social platforms</div>
        <ScrollArea className="h-80">
          <div className="space-y-3 pr-3">
            {data.map((item) => (
              <div 
                key={item.id} 
                className="bg-slate-700/30 rounded p-3 cursor-pointer hover:bg-slate-700/50 transition-colors"
                onClick={() => onRiskItemSelect?.(item)}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${getClassificationColor(item.classification)}`} />
                    <span className="text-sm font-medium text-slate-300">
                      "{item.content}"
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {formatTimestamp(item.timestamp)}
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <span className="capitalize">{item.classification} based</span>
                  <span className="text-slate-500">•</span>
                  <span className="capitalize">{item.platform}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
