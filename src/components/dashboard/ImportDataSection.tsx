import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { 
  Upload, 
  FileSpreadsheet, 
  Database,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Download,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImportLog {
  timestamp: string;
  type: "success" | "error" | "info";
  message: string;
}

export const ImportDataSection = () => {
  const [sheetsId, setSheetsId] = useState("1k-PQDvIYat-8rpQW3dHv9XVx5JA2rblDHp2xMCYfiAc");
  const [gridApiKey, setGridApiKey] = useState("");
  const [importing, setImporting] = useState(false);
  const [logs, setLogs] = useState<ImportLog[]>([
    { timestamp: "2024-01-15 14:30", type: "success", message: "Planilha conectada com sucesso" },
    { timestamp: "2024-01-15 14:28", type: "info", message: "Processando aba SCRIM 15/01..." },
    { timestamp: "2024-01-15 14:27", type: "success", message: "6 jogos encontrados na aba" },
  ]);
  const { toast } = useToast();

  const addLog = (type: "success" | "error" | "info", message: string) => {
    const newLog: ImportLog = {
      timestamp: new Date().toLocaleString("pt-BR"),
      type,
      message
    };
    setLogs(prev => [newLog, ...prev.slice(0, 19)]); // Keep last 20 logs
  };

  const handleSheetsImport = async () => {
    setImporting(true);
    addLog("info", "Iniciando importação do Google Sheets...");
    
    // Simulate the import process
    setTimeout(() => {
      addLog("info", "Verificando abas com padrão SCRIM...");
    }, 1000);
    
    setTimeout(() => {
      addLog("success", "Encontradas 5 abas de treino");
      addLog("info", "Processando jogos: Blue vs Red sides...");
    }, 2000);
    
    setTimeout(() => {
      addLog("success", "Dados de draft coletados: 30 partidas");
      addLog("success", "Winrates calculados por adversário");
      setImporting(false);
      toast({
        title: "Importação concluída",
        description: "30 partidas importadas com sucesso do Google Sheets",
      });
    }, 4000);
  };

  const handleGridImport = async () => {
    if (!gridApiKey) {
      toast({
        title: "API Key necessária",
        description: "Insira sua API key do GRID para importar dados",
        variant: "destructive"
      });
      return;
    }
    
    setImporting(true);
    addLog("info", "Conectando à API do GRID...");
    
    setTimeout(() => {
      addLog("success", "Conectado à API do GRID");
      addLog("info", "Coletando dados de partidas recentes...");
    }, 1500);
    
    setTimeout(() => {
      addLog("success", "Farm data coletado para 15 partidas");
      addLog("success", "KDA e timing de mortes processados");
      addLog("success", "Dados de objetivos sincronizados");
      setImporting(false);
      toast({
        title: "Sincronização GRID completa",
        description: "Dados detalhados de performance atualizados",
      });
    }, 3500);
  };

  const currentData = {
    totalMatches: 47,
    scrimMatches: 30,
    championshipMatches: 17,
    lastImport: "2024-01-15 14:30",
    winrateData: [
      { team: "Team Alpha", winrate: 75, matches: 8 },
      { team: "Beta Esports", winrate: 60, matches: 5 },
      { team: "Gamma Squad", winrate: 45, matches: 12 },
      { team: "Delta Force", winrate: 80, matches: 6 },
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Importação de Dados
        </h2>
        <Badge variant="outline" className="text-sm">
          Última sincronização: {currentData.lastImport}
        </Badge>
      </div>

      <Tabs defaultValue="sheets" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sheets">Google Sheets</TabsTrigger>
          <TabsTrigger value="grid">API GRID</TabsTrigger>
          <TabsTrigger value="status">Status dos Dados</TabsTrigger>
        </TabsList>

        <TabsContent value="sheets" className="space-y-4">
          <Card className="bg-gradient-to-br from-card to-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-success" />
                Configuração Google Sheets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sheets-id">ID da Planilha</Label>
                <Input
                  id="sheets-id"
                  value={sheetsId}
                  onChange={(e) => setSheetsId(e.target.value)}
                  placeholder="1k-PQDvIYat-8rpQW3dHv9XVx5JA2rblDHp2xMCYfiAc"
                />
                <p className="text-sm text-muted-foreground">
                  ID extraído da URL da planilha Google Sheets
                </p>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Estrutura Detectada
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Padrão de abas:</span>
                    <Badge variant="secondary">SCRIM DD/MM</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Jogos por aba:</span>
                    <Badge variant="secondary">6 máximo</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Posições Blue/Red:</span>
                    <Badge variant="secondary">F/G, K/L, P/Q, U/V, Z/AA, AE/AF</Badge>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleSheetsImport} 
                disabled={importing || !sheetsId}
                className="w-full"
              >
                {importing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Importando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Importar do Google Sheets
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grid" className="space-y-4">
          <Card className="bg-gradient-to-br from-card to-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                Configuração API GRID
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="grid-api">API Key GRID</Label>
                <Input
                  id="grid-api"
                  type="password"
                  value={gridApiKey}
                  onChange={(e) => setGridApiKey(e.target.value)}
                  placeholder="Insira sua API key do GRID"
                />
                <p className="text-sm text-muted-foreground">
                  Usada para coletar dados detalhados de farm, KDA e timings
                </p>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Dados Coletados
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <Badge variant="outline">Farm por minuto</Badge>
                  <Badge variant="outline">KDA detalhado</Badge>
                  <Badge variant="outline">Timing de mortes</Badge>
                  <Badge variant="outline">Controle de objetivos</Badge>
                  <Badge variant="outline">Posicionamento</Badge>
                  <Badge variant="outline">Damage breakdown</Badge>
                </div>
              </div>

              <Button 
                onClick={handleGridImport} 
                disabled={importing || !gridApiKey}
                className="w-full"
              >
                {importing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sincronizando...
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4 mr-2" />
                    Sincronizar com GRID
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-gradient-to-br from-card to-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  Dados Atuais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total de Partidas</span>
                    <Badge variant="default">{currentData.totalMatches}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Scrimmages</span>
                    <Badge variant="secondary">{currentData.scrimMatches}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Campeonatos</span>
                    <Badge variant="secondary">{currentData.championshipMatches}</Badge>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50">
                  <h4 className="font-semibold mb-3">Winrate por Adversário</h4>
                  <div className="space-y-2">
                    {currentData.winrateData.map((team, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{team.team}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={team.winrate} className="w-16 h-2" />
                          <span className="text-sm font-medium w-12">{team.winrate}%</span>
                          <Badge variant="outline" className="text-xs">
                            {team.matches}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-primary" />
                  Logs de Importação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {logs.map((log, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 rounded bg-muted/20">
                      <div className="flex-shrink-0 mt-0.5">
                        {log.type === "success" && <CheckCircle className="w-4 h-4 text-success" />}
                        {log.type === "error" && <AlertCircle className="w-4 h-4 text-destructive" />}
                        {log.type === "info" && <RefreshCw className="w-4 h-4 text-primary" />}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-muted-foreground">{log.timestamp}</div>
                        <div className="text-sm">{log.message}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};