import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Clock, MapPin, TrendingUp, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

interface PostingDetail {
  id: string;
  platform: string;
  content: string;
  timestamp: string;
  location?: string;
  classification: 'intent' | 'location' | 'warning' | 'safe';
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
  riskScore: number;
  keywords: string[];
}

interface PostingsSummaryProps {
  selectedInsight?: any;
  selectedRiskItem?: any;
  youtubeData?: any[];
  isLoading?: boolean;
}

export default function PostingsSummary({ selectedInsight, selectedRiskItem, youtubeData, isLoading }: PostingsSummaryProps) {
  const [postings, setPostings] = useState<PostingDetail[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedInsight || selectedRiskItem || youtubeData?.length) {
      setLoading(true);
      
      // Generate postings from YouTube data and selections
      const generatePostings = () => {
        let allPostings: PostingDetail[] = [];

        // Add YouTube data if available
        if (youtubeData?.length) {
          const youtubePostings = youtubeData.slice(0, 3).map((video: any, index: number) => ({
            id: `youtube_${video.id || index}`,
            platform: "YouTube",
            content: video.title || video.content || '',
            timestamp: new Date(video.timestamp).toLocaleString(),
            location: "NYC Subway System",
            classification: video.classification || 'safe' as const,
            engagement: {
              likes: video.engagement?.likes || 0,
              shares: Math.floor((video.engagement?.views || 0) * 0.01),
              comments: video.engagement?.comments || 0
            },
            riskScore: video.riskScore || 0,
            keywords: video.keywords || []
          }));
          allPostings = [...allPostings, ...youtubePostings];
        }

        return allPostings;
      };

      setTimeout(() => {
        const postingsFromData = generatePostings();
        const additionalPostings: PostingDetail[] = [
          {
            id: "post_001",
            platform: "TikTok",
            content: "Just saw someone subway surfing on the 4 train near Union Square. This is getting out of hand...",
            timestamp: "2 hours ago",
            location: "Union Square-14th St",
            classification: "intent",
            engagement: { likes: 245, shares: 67, comments: 89 },
            riskScore: 8.5,
            keywords: ["subway surfing", "4 train", "Union Square"]
          },
          {
            id: "post_002", 
            platform: "X (Twitter)",
            content: "PSA: Increased NYPD presence at Times Square station after recent incidents. Stay safe everyone.",
            timestamp: "4 hours ago",
            location: "Times Square-42nd St",
            classification: "warning",
            engagement: { likes: 892, shares: 234, comments: 156 },
            riskScore: 6.2,
            keywords: ["NYPD", "Times Square", "safety"]
          },
          {
            id: "post_003",
            platform: "Instagram",
            content: "Caught this crazy subway surfer on video! The adrenaline rush must be insane #subwaysurfing #nyc",
            timestamp: "6 hours ago", 
            location: "Herald Square-34th St",
            classification: "intent",
            engagement: { likes: 1245, shares: 345, comments: 267 },
            riskScore: 9.1,
            keywords: ["subway surfer", "video", "adrenaline"]
          },
          {
            id: "post_004",
            platform: "Reddit",
            content: "Witnessed an accident at Atlantic Ave today. Please don't try subway surfing, it's not worth it.",
            timestamp: "8 hours ago",
            location: "Atlantic Ave-Barclays",
            classification: "warning",
            engagement: { likes: 567, shares: 89, comments: 123 },
            riskScore: 7.3,
            keywords: ["accident", "Atlantic Ave", "subway surfing"]
          },
          {
            id: "post_005",
            platform: "YouTube",
            content: "Safety campaign video: Why subway surfing is dangerous. Real stories from first responders.",
            timestamp: "12 hours ago",
            classification: "safe",
            engagement: { likes: 2340, shares: 890, comments: 445 },
            riskScore: 2.1,
            keywords: ["safety campaign", "first responders", "dangerous"]
          }
        ];
        
        // Combine YouTube data with additional postings
        const combinedPostings = [...postingsFromData, ...additionalPostings];
        setPostings(combinedPostings);
        setLoading(false);
      }, 1000);
    } else {
      setPostings([]);
    }
  }, [selectedInsight, selectedRiskItem, youtubeData]);

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'intent': return 'text-red-400 border-red-400';
      case 'location': return 'text-orange-400 border-orange-400';
      case 'warning': return 'text-yellow-400 border-yellow-400';
      case 'safe': return 'text-green-400 border-green-400';
      default: return 'text-slate-400 border-slate-400';
    }
  };

  const getPlatformIcon = (platform: string) => {
    // Use generic icon for all platforms
    return <FileText className="h-4 w-4" />;
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 8) return 'text-red-400';
    if (score >= 6) return 'text-orange-400';
    if (score >= 4) return 'text-yellow-400';
    return 'text-green-400';
  };

  if (!selectedInsight && !selectedRiskItem) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-50 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-400" />
            Postings Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto mb-3 text-slate-600" />
              <p>Select an item from Real-Time Insights or Live Risk Feed</p>
              <p className="text-sm mt-1">to view related postings</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading || isLoading) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-50 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-400" />
            Postings Summary
            <Badge variant="outline" className="text-xs ml-auto">Loading...</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 w-full bg-slate-700" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-50 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-400" />
          Postings Summary
          <Badge variant="outline" className="text-xs ml-auto">
            {postings.length} Postings
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 overflow-y-auto space-y-3 pr-2">
          {postings.map((posting) => (
            <div
              key={posting.id}
              className="p-4 rounded-lg bg-slate-700/30 border border-slate-600 hover:bg-slate-700/50 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getPlatformIcon(posting.platform)}
                  <span className="text-sm font-medium text-slate-300">{posting.platform}</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getClassificationColor(posting.classification)}`}
                  >
                    {posting.classification}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold ${getRiskScoreColor(posting.riskScore)}`}>
                    Risk: {posting.riskScore}
                  </span>
                  <Clock className="h-3 w-3 text-slate-500" />
                  <span className="text-xs text-slate-500">{posting.timestamp}</span>
                </div>
              </div>

              <p className="text-sm text-slate-200 mb-3 leading-relaxed">
                {posting.content}
              </p>

              {posting.location && (
                <div className="flex items-center gap-1 mb-2">
                  <MapPin className="h-3 w-3 text-slate-500" />
                  <span className="text-xs text-slate-400">{posting.location}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>👍 {posting.engagement.likes}</span>
                  <span>🔄 {posting.engagement.shares}</span>
                  <span>💬 {posting.engagement.comments}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {posting.keywords.slice(0, 2).map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="text-xs px-2 py-0">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}