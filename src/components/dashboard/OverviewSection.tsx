import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Users,
  Calendar,
  Zap
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ElementType;
  trend?: "up" | "down" | "neutral";
}

const StatCard = ({ title, value, change, icon: Icon, trend = "neutral" }: StatCardProps) => (
  <Card className="bg-gradient-to-br from-card to-muted/50 border-border/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-5 w-5 text-primary" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      {change && (
        <Badge 
          variant={trend === "up" ? "default" : trend === "down" ? "destructive" : "secondary"}
          className="mt-1 text-xs"
        >
          {change}
        </Badge>
      )}
    </CardContent>
  </Card>
);

export const OverviewSection = () => {
  const recentMatches = [
    { opponent: "Team Alpha", result: "Victory", score: "2-1", date: "2024-01-15", type: "Championship" },
    { opponent: "Beta Esports", result: "Victory", score: "2-0", date: "2024-01-14", type: "Training" },
    { opponent: "Gamma Squad", result: "Defeat", score: "1-2", date: "2024-01-13", type: "Championship" },
    { opponent: "Delta Force", result: "Victory", score: "2-1", date: "2024-01-12", type: "Training" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Dashboard Overview
        </h2>
        <Badge variant="outline" className="text-sm">
          <Calendar className="w-4 h-4 mr-1" />
          Last 30 days
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Win Rate"
          value="78%"
          change="+12% vs last month"
          icon={Trophy}
          trend="up"
        />
        <StatCard
          title="Avg KDA"
          value="2.4"
          change="+0.3 vs last month"
          icon={Target}
          trend="up"
        />
        <StatCard
          title="First Blood %"
          value="65%"
          change="+5% vs last month"
          icon={Zap}
          trend="up"
        />
        <StatCard
          title="Matches Analyzed"
          value="47"
          change="12 this week"
          icon={TrendingUp}
          trend="neutral"
        />
      </div>

      {/* Performance Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-card to-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Draft Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Blue Side Win Rate</span>
                <span className="text-primary font-medium">72%</span>
              </div>
              <Progress value={72} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Red Side Win Rate</span>
                <span className="text-accent font-medium">68%</span>
              </div>
              <Progress value={68} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>First Pick Win Rate</span>
                <span className="text-gold font-medium">75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Team Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Avg Game Duration</span>
                <Badge variant="secondary">28:45</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Baron Control</span>
                <Badge variant="default">82%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Dragon Control</span>
                <Badge variant="default">76%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Tower First Blood</span>
                <Badge variant="default">71%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Matches */}
      <Card className="bg-gradient-to-br from-card to-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Recent Matches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentMatches.map((match, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    match.result === "Victory" ? "bg-success" : "bg-destructive"
                  }`} />
                  <div>
                    <div className="font-medium">{match.opponent}</div>
                    <div className="text-sm text-muted-foreground">{match.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={match.type === "Championship" ? "default" : "secondary"}>
                    {match.type}
                  </Badge>
                  <Badge 
                    variant={match.result === "Victory" ? "default" : "destructive"}
                    className="min-w-[60px]"
                  >
                    {match.score}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};