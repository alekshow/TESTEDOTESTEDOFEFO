import { useState, useEffect } from "react";
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
import { useAuth } from "@/hooks/useAuth";
import { GoogleSheetsService, GridApiService, MatchData } from "@/services/integrations";
import { DataPreviewSection } from "./DataPreviewSection";
import { DebugPanel } from "./DebugPanel";

interface ImportLog {
  timestamp: string;
  type: "success" | "error" | "info";
  message: string;
}

export const ImportDataSection = () => {
  const [sheetsId, setSheetsId] = useState("1k-PQDvIYat-8rpQW3dHv9XVx5JA2rblDHp2xMCYfiAc");
  const [importing, setImporting] = useState(false);
  const [matchData, setMatchData] = useState<MatchData[]>([]);
  const [logs, setLogs] = useState<ImportLog[]>([
    { timestamp: "2024-01-15 14:30", type: "success", message: "Sistema iniciado" },
  ]);
  const { toast } = useToast();
  const { user, loading, signInWithGoogle, signOut, isConfigured } = useAuth();
  const [gridApiKey, setGridApiKey] = useState(localStorage.getItem('gridApiKey') || '');

  // Save API key to localStorage when it changes
  useEffect(() => {
    if (gridApiKey) {
      localStorage.setItem('gridApiKey', gridApiKey);
    } else {
      localStorage.removeItem('gridApiKey');
    }
  }, [gridApiKey]);

  const addLog = (type: "success" | "error" | "info", message: string) => {
    const newLog: ImportLog = {
      timestamp: new Date().toLocaleString("pt-BR"),
      type,
      message
    };
    setLogs(prev => [newLog, ...prev.slice(0, 19)]); // Keep last 20 logs
  };

  const handleSheetsImport = async () => {
    if (!isConfigured) {
      toast({
        title: "Supabase necessário",
        description: "Configure o Supabase para usar integrações reais",
        variant: "destructive"
      });
      return;
    }

    setImporting(true);
    addLog("info", "Iniciando importação do Google Sheets...");
    
    try {
      const sheetsService = new GoogleSheetsService();
      const matches = await sheetsService.parseScrimData(sheetsId);
      
      setMatchData(matches);
      addLog("success", `${matches.length} partidas importadas com sucesso`);
      setImporting(false);
      
      toast({
        title: "Importação concluída",
        description: `${matches.length} partidas importadas do Google Sheets`,
      });
    } catch (error: any) {
      addLog("error", `Erro na importação: ${error.message}`);
      setImporting(false);
      toast({
        title: "Erro na importação",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleGridImport = async () => {
    if (!gridApiKey) {
      toast({
        title: "API Key necessária",
        description: "Faça login ou insira sua API key do GRID",
        variant: "destructive"
      });
      return;
    }
    
    setImporting(true);
    addLog("info", "Conectando à API do GRID...");
    
    console.log('🔍 Testando GRID API...')
    console.log('🔑 API Key:', gridApiKey ? `${gridApiKey.substring(0, 8)}...` : 'VAZIA')
    
    try {
      const gridService = new GridApiService(gridApiKey);
      const playerData = await gridService.fetchPlayerData('player1');
      
      addLog("success", `Dados de ${playerData.length} partidas coletados`);
      addLog("success", "KDA e farm processados");
      setImporting(false);
      
      toast({
        title: "Sincronização GRID completa",
        description: "Dados detalhados de performance atualizados",
      });
    } catch (error: any) {
      addLog("error", `Erro GRID API: ${error.message}`);
      setImporting(false);
      toast({
        title: "Erro na sincronização",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleGmailLogin = async () => {
    if (!isConfigured) {
      toast({
        title: "Configuração necessária",
        description: "Configure o Supabase para usar login real com Google",
        variant: "destructive"
      });
      return;
    }

    setImporting(true);
      addLog("info", "Iniciando login com Gmail...");
    
    const { error } = await signInWithGoogle();
    
    if (!error) {
      addLog("success", "Login realizado com sucesso");
    } else {
      addLog("error", `Erro no login: ${error.message}`);
    }
    
    setImporting(false);
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
              {!user ? (
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
                        <p className="text-sm text-muted-foreground">{user?.email || 'Email não disponível'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Configuração Ativa
                    </h4>
                     <div className="space-y-2 text-sm">
                       <div className="flex justify-between">
                         <span>API Key GRID:</span>
                         <Badge variant="secondary">
                           {gridApiKey ? 'Configurada' : 'Não configurada'}
                         </Badge>
                       </div>
                       <div className="flex justify-between">
                         <span>Integração Google:</span>
                         <Badge variant="secondary" className="bg-success text-success-foreground">
                           Ativa
                         </Badge>
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
                    onClick={signOut} 
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
                   Status da API
                 </h4>
                 <div className="space-y-2 text-sm">
                   <div className="flex justify-between">
                     <span>API Key:</span>
                     <Badge variant={gridApiKey ? "default" : "destructive"}>
                       {gridApiKey ? `${gridApiKey.substring(0, 8)}...` : 'Não configurada'}
                     </Badge>
                   </div>
                   <div className="flex justify-between">
                     <span>Comprimento:</span>
                     <Badge variant="outline">{gridApiKey.length} caracteres</Badge>
                   </div>
                 </div>
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

              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    console.log('🧪 Teste da API Key:', {
                      key: gridApiKey ? `${gridApiKey.substring(0, 8)}...` : 'VAZIA',
                      length: gridApiKey.length,
                      valid: gridApiKey.length > 10
                    });
                    toast({
                      title: "API Key testada",
                      description: `Comprimento: ${gridApiKey.length} caracteres. Verifique o console para detalhes.`,
                      variant: gridApiKey.length > 10 ? "default" : "destructive"
                    });
                  }}
                  variant="outline"
                  disabled={!gridApiKey}
                  className="flex-1"
                >
                  🧪 Testar API Key
                </Button>
                
                <Button 
                  onClick={handleGridImport} 
                  disabled={importing || !gridApiKey}
                  className="flex-1"
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
                
                {gridApiKey && (
                  <Button 
                    onClick={() => {
                      setGridApiKey('');
                      toast({
                        title: "API Key removida",
                        description: "Sua API key foi removida com sucesso"
                      });
                    }}
                    variant="outline"
                    size="icon"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                )}
              </div>
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

      {/* Debug Panel */}
      <DebugPanel gridApiKey={gridApiKey} user={user} />

      {/* Preview dos dados importados */}
      <DataPreviewSection matchData={matchData} />
    </div>
  );
};