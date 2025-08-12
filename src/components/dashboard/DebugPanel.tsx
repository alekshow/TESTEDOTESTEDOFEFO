import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Bug, 
  ChevronDown, 
  ChevronRight,
  Key,
  Database
} from "lucide-react";

interface DebugPanelProps {
  gridApiKey: string;
}

export const DebugPanel = ({ gridApiKey }: DebugPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const debugInfo = {
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
                }}
                variant="outline"
                size="sm"
              >
                🔍 Log Debug Info
              </Button>
              
              <Button 
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify({
                    debugInfo
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