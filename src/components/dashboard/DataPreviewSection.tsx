import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy,
  Users,
  Clock,
  Target,
  TrendingUp,
  Calendar
} from "lucide-react";
import { MatchData } from "@/services/integrations";

interface DataPreviewSectionProps {
  matchData: MatchData[];
}

export const DataPreviewSection = ({ matchData }: DataPreviewSectionProps) => {
  if (matchData.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-card to-muted/50">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum dado importado ainda</p>
            <p className="text-sm">Use a aba de API GRID para importar dados</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalMatches = matchData.length;
  const wins = matchData.filter(match => match.winner === 'Blue').length;
  const winRate = Math.round((wins / totalMatches) * 100);
  
  const scrimMatches = matchData.filter(match => match.type === 'scrim').length;
  const championshipMatches = matchData.filter(match => match.type === 'championship').length;

  // Analyze champion picks
  const championPicks = matchData.reduce((acc, match) => {
    [...match.blueSide, ...match.redSide].forEach(champ => {
      if (champ) {
        acc[champ] = (acc[champ] || 0) + 1;
      }
    });
    return acc;
  }, {} as Record<string, number>);

  const topChampions = Object.entries(championPicks)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Preview dos Dados
        </h2>
        <Badge variant="outline" className="text-sm">
          {totalMatches} partidas carregadas
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-card to-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Partidas</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMatches}</div>
            <p className="text-xs text-muted-foreground">
              {scrimMatches} scrims, {championshipMatches} campeonato
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Vitória</CardTitle>
            <Trophy className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{winRate}%</div>
            <Progress value={winRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vitórias</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wins}</div>
            <p className="text-xs text-muted-foreground">
              de {totalMatches} partidas
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duração Média</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(matchData.reduce((acc, match) => acc + match.duration, 0) / totalMatches)}min
            </div>
            <p className="text-xs text-muted-foreground">
              tempo de jogo
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-card to-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Champions Mais Usados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topChampions.map(([champion, count], index) => (
                <div key={champion} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="w-6 h-6 text-xs">
                      {index + 1}
                    </Badge>
                    <span className="text-sm font-medium">{champion}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={(count / totalMatches) * 100} className="w-16 h-2" />
                    <span className="text-sm w-8">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-accent" />
              Partidas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {matchData.slice(0, 5).map((match, index) => (
                <div key={match.id} className="flex items-center justify-between p-2 rounded bg-muted/20">
                  <div className="flex items-center gap-2">
                    <Badge variant={match.winner === 'Blue' ? 'default' : 'secondary'} className="text-xs">
                      {match.winner === 'Blue' ? 'W' : 'L'}
                    </Badge>
                    <span className="text-sm">{match.team1} vs {match.team2}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {match.type === 'scrim' ? 'Scrim' : 'Camp'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{match.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};