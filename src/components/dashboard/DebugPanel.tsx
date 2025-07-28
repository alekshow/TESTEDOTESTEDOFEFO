import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Bug, 
  ChevronDown, 
  ChevronRight,
  Globe,
  Key,
  Database,
  AlertTriangle
} from "lucide-react";

interface DebugPanelProps {
  gridApiKey: string;
  user: any;
}

export const DebugPanel = ({ gridApiKey, user }: DebugPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const debugInfo = {
    googleAuth: {
      currentOrigin: window.location.origin,
      redirectUrl: `${window.location.origin}/`,
      userLoggedIn: !!user,
      userEmail: user?.email || 'N/A'
    },
    gridApi: {
      keyLength: gridApiKey.length,
      keyPresent: !!gridApiKey,
      keyPreview: gridApiKey ? `${gridApiKey.substring(0, 8)}...` : 'Não configurada',
      expectedLength: 'Entre 20-50 caracteres'
    },
    environment: {
      hostname: window.location.hostname,
      protocol: window.location.protocol,
      isLocalhost: window.location.hostname === 'localhost',
      isLovableProject: window.location.hostname.includes('lovableproject.com')
    }
  };

  const getUrlConfigGuide = () => {
    const currentUrl = `${window.location.origin}/`;
    const callbackUrl = `https://iuwzrpiipahkfcnknric.supabase.co/auth/v1/callback`;
    
    return {
      currentUrl,
      callbackUrl,
      googleCloudUrls: [currentUrl],
      supabaseUrls: [currentUrl]
    };
  };

  const urlConfig = getUrlConfigGuide();

  return (
    <Card className="bg-gradient-to-br from-card to-muted/50 border-2 border-dashed border-primary/20">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
            <CardTitle className="flex items-center gap-2">
              <Bug className="w-5 h-5 text-primary" />
              Painel de Debug
              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              <Badge variant="outline" className="ml-auto">
                Para desenvolvedores
              </Badge>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Google Auth Debug */}
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-500" />
                Google OAuth Debug
              </h4>
              <div className="bg-muted/30 p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>URL Atual:</span>
                  <Badge variant="outline">{debugInfo.googleAuth.currentOrigin}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Redirect URL:</span>
                  <Badge variant="outline">{debugInfo.googleAuth.redirectUrl}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Usuário Logado:</span>
                  <Badge variant={debugInfo.googleAuth.userLoggedIn ? "default" : "destructive"}>
                    {debugInfo.googleAuth.userLoggedIn ? 'Sim' : 'Não'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Email:</span>
                  <Badge variant="outline">{debugInfo.googleAuth.userEmail}</Badge>
                </div>
              </div>
              
              {/* URLs de Configuração */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="font-semibold text-yellow-800 dark:text-yellow-200">
                    Configuração necessária para resolver redirect_uri_mismatch
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Google Cloud Console:</strong>
                    <div className="mt-1 p-2 bg-white dark:bg-gray-800 rounded border font-mono text-xs">
                      Authorized JavaScript origins: {urlConfig.currentUrl}
                    </div>
                    <div className="mt-1 p-2 bg-white dark:bg-gray-800 rounded border font-mono text-xs">
                      Authorized redirect URIs: {urlConfig.callbackUrl}
                    </div>
                  </div>
                  <div>
                    <strong>Supabase Dashboard:</strong>
                    <div className="mt-1 p-2 bg-white dark:bg-gray-800 rounded border font-mono text-xs">
                      Site URL: {urlConfig.currentUrl}
                    </div>
                    <div className="mt-1 p-2 bg-white dark:bg-gray-800 rounded border font-mono text-xs">
                      Redirect URLs: {urlConfig.currentUrl}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* GRID API Debug */}
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Key className="w-4 h-4 text-green-500" />
                GRID API Debug
              </h4>
              <div className="bg-muted/30 p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>API Key Presente:</span>
                  <Badge variant={debugInfo.gridApi.keyPresent ? "default" : "destructive"}>
                    {debugInfo.gridApi.keyPresent ? 'Sim' : 'Não'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Comprimento:</span>
                  <Badge variant="outline">{debugInfo.gridApi.keyLength} caracteres</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Preview:</span>
                  <Badge variant="outline">{debugInfo.gridApi.keyPreview}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Comprimento Esperado:</span>
                  <Badge variant="outline">{debugInfo.gridApi.expectedLength}</Badge>
                </div>
              </div>
            </div>

            {/* Environment Debug */}
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-500" />
                Environment Debug
              </h4>
              <div className="bg-muted/30 p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Hostname:</span>
                  <Badge variant="outline">{debugInfo.environment.hostname}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Protocol:</span>
                  <Badge variant="outline">{debugInfo.environment.protocol}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Local Development:</span>
                  <Badge variant={debugInfo.environment.isLocalhost ? "default" : "secondary"}>
                    {debugInfo.environment.isLocalhost ? 'Sim' : 'Não'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Lovable Project:</span>
                  <Badge variant={debugInfo.environment.isLovableProject ? "default" : "secondary"}>
                    {debugInfo.environment.isLovableProject ? 'Sim' : 'Não'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Test Buttons */}
            <div className="flex gap-2">
              <Button 
                onClick={() => {
                  console.log('🔍 DEBUG INFO COMPLETO:', debugInfo);
                  console.log('🌐 URL CONFIG:', urlConfig);
                }}
                variant="outline"
                size="sm"
              >
                🔍 Log Debug Info
              </Button>
              
              <Button 
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify({
                    debugInfo,
                    urlConfig
                  }, null, 2));
                  alert('Debug info copiado para clipboard!');
                }}
                variant="outline"
                size="sm"
              >
                📋 Copiar Debug Info
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};