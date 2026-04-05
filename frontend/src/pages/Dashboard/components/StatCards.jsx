import { Card, CardContent } from "@/components/ui/card";
import { Video, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StatCards({ videos }) {
  const total = videos.length;
  const ready = videos.filter((v) => v.processingStatus === "ready").length;
  const processing = videos.filter(
    (v) =>
      v.processingStatus === "processing" || v.processingStatus === "analyzed",
  ).length;
  const flagged = videos.filter(
    (v) => v.sensitivityStatus === "flagged",
  ).length;

  const stats = [
    {
      title: "Total Videos",
      value: total,
      icon: Video,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10 dark:bg-blue-500/20",
    },
    {
      title: "Ready",
      value: ready,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10 dark:bg-green-500/20",
    },
    {
      title: "Processing",
      value: processing,
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10 dark:bg-yellow-500/20",
    },
    {
      title: "Flagged",
      value: flagged,
      icon: AlertTriangle,
      color: "text-red-500",
      bgColor: "bg-red-500/10 dark:bg-red-500/20",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            className="border-border/50 shadow-sm transition-shadow hover:shadow-md"
          >
            <CardContent className="px-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <div className="text-xl font-bold">{stat.value}</div>
              </div>
              <div
                className={cn(
                  "p-2.5 flex items-center justify-center rounded-lg",
                  stat.bgColor,
                )}
              >
                <Icon className={cn("w-4 h-4", stat.color)} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
