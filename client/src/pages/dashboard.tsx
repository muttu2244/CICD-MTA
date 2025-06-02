import { useDashboardData, useMLInsights, useRiskPredictions, useSubwayMapData, useYouTubeData } from "@/hooks/useDashboardData";
import TrendsChart from "@/components/dashboard/TrendsChart";
import RiskHeatmap from "@/components/dashboard/RiskHeatmap";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import SafetyBalance from "@/components/dashboard/SafetyBalance";
import RealTimeInsights from "@/components/dashboard/RealTimeInsights";
import LiveRiskFeed from "@/components/dashboard/LiveRiskFeed";
import MLInsights from "@/components/dashboard/MLInsights";
import RiskPrediction from "@/components/dashboard/RiskPrediction";
import InteractiveSubwayMap from "@/components/dashboard/InteractiveSubwayMap";
import LiveClock from "@/components/dashboard/LiveClock";
import PostingsSummary from "@/components/dashboard/PostingsSummary";
import { useState } from "react";

export default function Dashboard() {
  const { data, isLoading, error } = useDashboardData();
  const { data: mlInsights, isLoading: mlLoading, error: mlError } = useMLInsights();
  const { data: predictions, isLoading: predLoading, error: predError } = useRiskPredictions();
  const { data: mapData, isLoading: mapLoading, error: mapError } = useSubwayMapData();
  const { data: youtubeData, isLoading: youtubeLoading, error: youtubeError } = useYouTubeData();
  
  const [selectedInsight, setSelectedInsight] = useState<any>(null);
  const [selectedRiskItem, setSelectedRiskItem] = useState<any>(null);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-50">
            MTA Risk Command Center
          </h1>
          <div className="flex items-center space-x-4">
            <LiveClock />
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <div className="container mx-auto p-6 max-w-[95vw]">
        <div className="space-y-10">
          
          {/* First Row - Station Risk Heatmap, Alerts, ML Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5">
              <RiskHeatmap
                data={data?.riskLocations}
                isLoading={isLoading}
                error={error}
              />
            </div>
            <div className="lg:col-span-4">
              <AlertsPanel
                data={data?.alerts}
                isLoading={isLoading}
                error={error}
              />
            </div>
            <div className="lg:col-span-3">
              <MLInsights
                data={mlInsights as any}
                isLoading={mlLoading}
                error={mlError}
              />
            </div>
          </div>

          {/* Second Row - Cross-Platform Trends, Real-Time Insights, Harm & Safety Balance */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5">
              <TrendsChart
                data={data?.trendData}
                isLoading={isLoading}
                error={error}
              />
            </div>
            <div className="lg:col-span-4">
              <RealTimeInsights
                data={data?.platformInsights}
                isLoading={isLoading}
                error={error}
                onInsightSelect={setSelectedInsight}
              />
            </div>
            <div className="lg:col-span-3">
              <SafetyBalance
                data={data?.platformMetrics}
                youtubeData={Array.isArray(youtubeData) ? youtubeData : []}
                isLoading={isLoading}
                error={error}
              />
            </div>
          </div>

          {/* Third Row - Interactive Map, Live Risk Feed, Risk Predictions, Postings Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            <div className="lg:col-span-5">
              <InteractiveSubwayMap
                riskData={mapData}
                isLoading={mapLoading}
                error={mapError}
              />
            </div>
            <div className="lg:col-span-4">
              <LiveRiskFeed
                data={data?.riskFeedItems}
                isLoading={isLoading}
                error={error}
                onRiskItemSelect={setSelectedRiskItem}
              />
            </div>
            <div className="lg:col-span-3">
              <RiskPrediction
                data={predictions as any}
                isLoading={predLoading}
                error={predError}
              />
            </div>
          </div>

          {/* Fourth Row - Postings Summary full width */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 -mt-16">
            <div className="lg:col-span-12">
              <PostingsSummary
                selectedInsight={selectedInsight}
                selectedRiskItem={selectedRiskItem}
                youtubeData={Array.isArray(youtubeData) ? youtubeData : []}
                isLoading={isLoading || youtubeLoading}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
