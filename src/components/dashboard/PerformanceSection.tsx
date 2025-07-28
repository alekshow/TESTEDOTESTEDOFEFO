import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Target, 
  Clock,
  Sword,
  Shield,
  Zap,
  Crown,
  BarChart3,
  Users
} from "lucide-react";

interface PlayerStats {
  name: string;
  role: string;
  kda: number;
  csPerMin: number;
  damageShare: number;
  visionScore: number;
  deathTiming: string[];
  goldDiff15: number;
}

interface TeamPerformance {
  firstBlood: number;
  avgGameTime: string;
  baronControl: number;
  dragonControl: number;
  wardScore: number;
  objectives: {
    herald: number;
    baron: number;
    dragons: number;
    towers: number;
  };
}

export const PerformanceSection = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");

  const playerStats: PlayerStats[] = [
    { 
      name: "Player1", 
      role: "Top", 
      kda: 2.8, 
      csPerMin: 8.2, 
      damageShare: 18, 
      visionScore: 1.2,
      deathTiming: ["12:45", "28:30", "35:15"],
      goldDiff15: 450
    },
    { 
      name: "Player2", 
      role: "Jungle", 
      kda: 3.1, 
      csPerMin: 6.8, 
      damageShare: 22, 
      visionScore: 1.8,
      deathTiming: ["15:20", "31:10"],
      goldDiff15: 200
    },
    { 
      name: "Player3", 
      role: "Mid", 
      kda: 3.5, 
      csPerMin: 9.1, 
      damageShare: 28, 
      visionScore: 1.1,
      deathTiming: ["18:45", "29:20", "42:10"],
      goldDiff15: 680
    },
    { 
      name: "Player4", 
      role: "ADC", 
      kda: 4.2, 
      csPerMin: 9.8, 
      damageShare: 32, 
      visionScore: 0.9,
      deathTiming: ["22:15", "38:45"],
      goldDiff15: 520
    },
    { 
      name: "Player5", 
      role: "Support", 
      kda: 1.8, 
      csPerMin: 1.2, 
      damageShare: 8, 
      visionScore: 2.8,
      deathTiming: ["14:30", "26:50", "33:20", "41:15"],
      goldDiff15: -80
    }
  ];

  const teamPerformance: TeamPerformance = {
    firstBlood: 68,
    avgGameTime: "28:45",
    baronControl: 82,
    dragonControl: 76,
    wardScore: 1.65,
    objectives: {
      herald: 71,
      baron: 82,
      dragons: 76,
      towers: 79
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "top": return <Shield className="w-4 h-4 text-blue-400" />;
      case "jungle": return <Target className="w-4 h-4 text-green-400" />;
      case "mid": return <Zap className="w-4 h-4 text-yellow-400" />;
      case "adc": return <Sword className="w-4 h-4 text-red-400" />;
      case "support": return <Crown className="w-4 h-4 text-purple-400" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getKDAColor = (kda: number) => {
    if (kda >= 3.0) return "text-success";
    if (kda >= 2.0) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Performance Analysis
        </h2>
        <div className="flex gap-2">
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Matches</SelectItem>
              <SelectItem value="championship">Championship</SelectItem>
              <SelectItem value="training">Training</SelectItem>
              <SelectItem value="recent">Last 10 games</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="top">Top</SelectItem>
              <SelectItem value="jungle">Jungle</SelectItem>
              <SelectItem value="mid">Mid</SelectItem>
              <SelectItem value="adc">ADC</SelectItem>
              <SelectItem value="support">Support</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="team" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="team">Team Performance</TabsTrigger>
          <TabsTrigger value="players">Individual Stats</TabsTrigger>
          <TabsTrigger value="timing">Death Analysis</TabsTrigger>
          <TabsTrigger value="objectives">Objective Control</TabsTrigger>
        </TabsList>

        <TabsContent value="team" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-card to-muted/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">First Blood %</CardTitle>
                <Zap className="w-4 h-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">{teamPerformance.firstBlood}%</div>
                <Progress value={teamPerformance.firstBlood} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-muted/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Game Time</CardTitle>
                <Clock className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{teamPerformance.avgGameTime}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Optimal tempo control
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-muted/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Baron Control</CardTitle>
                <Crown className="w-4 h-4 text-gold" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gold">{teamPerformance.baronControl}%</div>
                <Progress value={teamPerformance.baronControl} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-muted/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vision Score</CardTitle>
                <Target className="w-4 h-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">{teamPerformance.wardScore}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Per minute average
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-card to-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Objective Control Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Herald</span>
                    <span className="font-medium">{teamPerformance.objectives.herald}%</span>
                  </div>
                  <Progress value={teamPerformance.objectives.herald} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Baron</span>
                    <span className="font-medium">{teamPerformance.objectives.baron}%</span>
                  </div>
                  <Progress value={teamPerformance.objectives.baron} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Dragons</span>
                    <span className="font-medium">{teamPerformance.objectives.dragons}%</span>
                  </div>
                  <Progress value={teamPerformance.objectives.dragons} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Towers</span>
                    <span className="font-medium">{teamPerformance.objectives.towers}%</span>
                  </div>
                  <Progress value={teamPerformance.objectives.towers} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="players" className="space-y-4">
          <Card className="bg-gradient-to-br from-card to-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Individual Player Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {playerStats.map((player, index) => (
                  <div key={index} className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getRoleIcon(player.role)}
                        <div>
                          <div className="font-semibold text-lg">{player.name}</div>
                          <Badge variant="outline" className="text-xs">
                            {player.role}
                          </Badge>
                        </div>
                      </div>
                      <div className={`text-2xl font-bold ${getKDAColor(player.kda)}`}>
                        {player.kda} KDA
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">CS/Min</div>
                        <div className="font-semibold text-primary">{player.csPerMin}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">DMG Share</div>
                        <div className="font-semibold text-accent">{player.damageShare}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Vision Score</div>
                        <div className="font-semibold text-warning">{player.visionScore}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Gold @15</div>
                        <div className={`font-semibold ${player.goldDiff15 >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {player.goldDiff15 >= 0 ? '+' : ''}{player.goldDiff15}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timing" className="space-y-4">
          <Card className="bg-gradient-to-br from-card to-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Death Timing Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {playerStats.map((player, index) => (
                  <div key={index} className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getRoleIcon(player.role)}
                        <span className="font-semibold">{player.name}</span>
                        <Badge variant="outline">{player.role}</Badge>
                      </div>
                      <Badge variant="secondary">
                        {player.deathTiming.length} deaths avg
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Typical death timings:</div>
                      <div className="flex flex-wrap gap-2">
                        {player.deathTiming.map((timing, timingIndex) => (
                          <Badge key={timingIndex} variant="destructive" className="text-xs">
                            {timing}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="objectives" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-gradient-to-br from-card to-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Early Game (0-15min)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">First Blood</span>
                    <div className="flex items-center gap-2">
                      <Progress value={68} className="w-20 h-2" />
                      <span className="text-sm font-medium">68%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Herald Control</span>
                    <div className="flex items-center gap-2">
                      <Progress value={71} className="w-20 h-2" />
                      <span className="text-sm font-medium">71%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">First Tower</span>
                    <div className="flex items-center gap-2">
                      <Progress value={65} className="w-20 h-2" />
                      <span className="text-sm font-medium">65%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-gold" />
                  Late Game (15+ min)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Baron Control</span>
                    <div className="flex items-center gap-2">
                      <Progress value={82} className="w-20 h-2" />
                      <span className="text-sm font-medium">82%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Elder Dragon</span>
                    <div className="flex items-center gap-2">
                      <Progress value={76} className="w-20 h-2" />
                      <span className="text-sm font-medium">76%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Base Control</span>
                    <div className="flex items-center gap-2">
                      <Progress value={79} className="w-20 h-2" />
                      <span className="text-sm font-medium">79%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};