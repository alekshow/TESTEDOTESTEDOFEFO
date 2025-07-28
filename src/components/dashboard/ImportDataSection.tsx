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
  Settings,
  Mail,
  User,
  Shield
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isMasterAccount, setIsMasterAccount] = useState(false);
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

  // Master account API key
  const MASTER_API_KEY = "W1is4qaPMP6ZbyivKK6Fl8gww53476vXI8M4NSFp";

  const handleGmailLogin = async () => {
    setImporting(true);
    addLog("info", "Iniciando login com Gmail...");
    
    // Simulate Gmail OAuth login
    setTimeout(() => {
      setIsLoggedIn(true);
      setUserEmail("master@grid.com");
      setIsMasterAccount(true);
      setGridApiKey(MASTER_API_KEY);
      addLog("success", "Login realizado com sucesso");
      addLog("info", "Conta master configurada para coleta de dados");
      setImporting(false);
      toast({
        title: "Login realizado",
        description: "Conta master configurada com API key GRID",
      });
    }, 2000);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail("");
    setIsMasterAccount(false);
    setGridApiKey("");
    addLog("info", "Logout realizado");
    toast({
      title: "Logout realizado",
      description: "Sessão encerrada com sucesso",
    });
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

      <Tabs defaultValue="login" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="login">Login Gmail</TabsTrigger>
          <TabsTrigger value="sheets">Google Sheets</TabsTrigger>
          <TabsTrigger value="grid">API GRID</TabsTrigger>
          <TabsTrigger value="status">Status dos Dados</TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="space-y-4">
          <Card className="bg-gradient-to-br from-card to-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Login Gmail
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isLoggedIn ? (
                <div className="text-center space-y-4">
                  <div className="bg-muted/30 p-6 rounded-lg border border-border/50">
                    <Mail className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-lg font-semibold mb-2">Faça login com sua conta Gmail</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Conecte-se para configurar a conta master de coleta de dados
                    </p>
                  </div>
                  
                  <Button 
                    onClick={handleGmailLogin} 
                    disabled={importing}
                    className="w-full"
                    size="lg"
                  >
                    {importing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Conectando...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Entrar com Gmail
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-3 mb-3">
                      <User className="w-5 h-5 text-primary" />
                      <div>
                        <h4 className="font-semibold text-primary">Conectado como</h4>
                        <p className="text-sm text-muted-foreground">{userEmail}</p>
                      </div>
                    </div>
                    {isMasterAccount && (
                      <div className="flex items-center gap-2 mt-2">
                        <Shield className="w-4 h-4 text-accent" />
                        <Badge variant="default" className="bg-accent text-accent-foreground">
                          Conta Master
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Configuração Ativa
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>API Key GRID:</span>
                        <Badge variant="secondary">Configurada</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Coleta automática:</span>
                        <Badge variant="secondary">Ativada</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <Badge variant="secondary" className="bg-success text-success-foreground">
                          Online
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handleLogout} 
                    variant="outline"
                    className="w-full"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Fazer Logout
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

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