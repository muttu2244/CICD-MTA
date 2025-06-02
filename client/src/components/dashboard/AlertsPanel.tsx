import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import type { Alert } from "@/types/dashboard";

interface AlertsPanelProps {
  data: Alert[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

export default function AlertsPanel({ data, isLoading, error }: AlertsPanelProps) {
  if (error) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-50">Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-red-400">
            Error loading alerts: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-50">Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full bg-slate-700" />
        </CardContent>
      </Card>
    );
  }

  const activeAlerts = data?.filter(alert => alert.isActive) || [];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-400" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-amber-400" />;
      default:
        return <Info className="h-5 w-5 text-blue-400" />;
    }
  };

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'critical':
        return "bg-red-900/30 border-red-700";
      case 'warning':
        return "bg-amber-900/30 border-amber-700";
      default:
        return "bg-blue-900/30 border-blue-700";
    }
  };

  const getAlertTextColor = (type: string) => {
    switch (type) {
      case 'critical':
        return "text-red-300";
      case 'warning':
        return "text-amber-300";
      default:
        return "text-blue-300";
    }
  };

  if (activeAlerts.length === 0) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-50">Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-slate-400 text-center py-8">
            No active alerts
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-50">Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border ${getAlertStyles(alert.type)}`}
            >
              <div className="flex items-start gap-3">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <div className={`font-medium ${getAlertTextColor(alert.type)}`}>
                    {alert.title}
                  </div>
                  {alert.description && (
                    <div className="text-slate-400 text-sm mt-1">
                      {alert.description}
                    </div>
                  )}
                  <div className="text-slate-500 text-xs mt-2">
                    {new Date(alert.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
