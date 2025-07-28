import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  TrendingUp, 
  Shield, 
  Sword,
  Crown,
  Zap,
  BarChart3
} from "lucide-react";

interface ChampionPickData {
  champion: string;
  pickRate: number;
  winRate: number;
  banRate: number;
  priority: "S" | "A" | "B" | "C";
  role: string;
}

interface DraftPhaseData {
  phase: string;
  blueAction: string;
  redAction: string;
  reasoning: string;
  success: boolean;
}

export const DraftAnalysisSection = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");

  const topChampions: ChampionPickData[] = [
    { champion: "Jinx", pickRate: 45, winRate: 72, banRate: 23, priority: "S", role: "ADC" },
    { champion: "K'Sante", pickRate: 38, winRate: 68, banRate: 41, priority: "S", role: "Top" },
    { champion: "Graves", pickRate: 42, winRate: 65, banRate: 18, priority: "A", role: "Jungle" },
    { champion: "Azir", pickRate: 35, winRate: 71, banRate: 32, priority: "S", role: "Mid" },
    { champion: "Nautilus", pickRate: 48, winRate: 63, banRate: 15, priority: "A", role: "Support" },
  ];

  const draftPhases: DraftPhaseData[] = [
    { phase: "Ban 1", blueAction: "Aatrox", redAction: "K'Sante", reasoning: "Remove power picks", success: true },
    { phase: "Pick 1", blueAction: "Jinx", redAction: "Graves + Nautilus", reasoning: "Secure priority ADC", success: true },
    { phase: "Ban 2", blueAction: "Azir", redAction: "Orianna", reasoning: "Mid lane control", success: false },
    { phase: "Pick 2", blueAction: "Gnar + Sejuani", redAction: "Syndra", reasoning: "Engage comp setup", success: true },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "S": return "bg-gold text-gold-foreground";
      case "A": return "bg-primary text-primary-foreground";
      case "B": return "bg-secondary text-secondary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Draft Analysis
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

      <Tabs defaultValue="champions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="champions">Champion Priority</TabsTrigger>
          <TabsTrigger value="phases">Draft Phases</TabsTrigger>
          <TabsTrigger value="patterns">Pick Patterns</TabsTrigger>
          <TabsTrigger value="responses">Counter Responses</TabsTrigger>
        </TabsList>

        <TabsContent value="champions" className="space-y-4">
          <Card className="bg-gradient-to-br from-card to-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-gold" />
                Champion Priority Tier List
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topChampions.map((champ, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <span className="text-lg font-bold text-primary-foreground">
                          {champ.champion.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-lg">{champ.champion}</div>
                        <Badge variant="outline" className="text-xs">
                          {champ.role}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <Badge className={getPriorityColor(champ.priority)}>
                        Tier {champ.priority}
                      </Badge>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Pick Rate</div>
                        <div className="font-semibold text-primary">{champ.pickRate}%</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Win Rate</div>
                        <div className="font-semibold text-success">{champ.winRate}%</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Ban Rate</div>
                        <div className="font-semibold text-destructive">{champ.banRate}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="phases" className="space-y-4">
          <Card className="bg-gradient-to-br from-card to-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Draft Phase Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {draftPhases.map((phase, index) => (
                  <div key={index} className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className="font-semibold">
                        {phase.phase}
                      </Badge>
                      <div className={`w-3 h-3 rounded-full ${
                        phase.success ? "bg-success" : "bg-warning"
                      }`} />
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Blue Side</div>
                        <Badge variant="default" className="bg-blue-600">
                          {phase.blueAction}
                        </Badge>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Red Side</div>
                        <Badge variant="default" className="bg-red-600">
                          {phase.redAction}
                        </Badge>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Result</div>
                        <Badge variant={phase.success ? "default" : "secondary"}>
                          {phase.success ? "Success" : "Needs Review"}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <strong>Reasoning:</strong> {phase.reasoning}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-gradient-to-br from-card to-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  First Pick Patterns
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">ADC First Pick</span>
                    <div className="flex items-center gap-2">
                      <Progress value={65} className="w-20 h-2" />
                      <span className="text-sm font-medium">65%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Jungle First Pick</span>
                    <div className="flex items-center gap-2">
                      <Progress value={25} className="w-20 h-2" />
                      <span className="text-sm font-medium">25%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Support First Pick</span>
                    <div className="flex items-center gap-2">
                      <Progress value={10} className="w-20 h-2" />
                      <span className="text-sm font-medium">10%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Ban Priority
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Target Bans</span>
                    <div className="flex items-center gap-2">
                      <Progress value={80} className="w-20 h-2" />
                      <span className="text-sm font-medium">80%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Power Picks</span>
                    <div className="flex items-center gap-2">
                      <Progress value={15} className="w-20 h-2" />
                      <span className="text-sm font-medium">15%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Comfort Picks</span>
                    <div className="flex items-center gap-2">
                      <Progress value={5} className="w-20 h-2" />
                      <span className="text-sm font-medium">5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="responses" className="space-y-4">
          <Card className="bg-gradient-to-br from-card to-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sword className="w-5 h-5 text-primary" />
                Counter Pick Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Enemy picks Jinx</span>
                    <Badge variant="default">Response Rate: 85%</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    <strong>Our Response:</strong> Dive comp with Nautilus + Graves
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">Success Rate: 78%</Badge>
                    <Badge variant="outline">Used 12 times</Badge>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Enemy picks K'Sante</span>
                    <Badge variant="default">Response Rate: 72%</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    <strong>Our Response:</strong> Scaling comp with Azir + Jinx
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">Success Rate: 67%</Badge>
                    <Badge variant="outline">Used 8 times</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};