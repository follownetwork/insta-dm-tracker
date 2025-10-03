import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const WebhookInfo = () => {
  const [copied, setCopied] = useState(false);
  const webhookUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/instagram-webhook`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    toast.success("URL copiada para a área de transferência!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border/50">
      <h3 className="text-lg font-semibold mb-2 text-foreground">URL do Webhook</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Configure esta URL no seu fluxo do n8n para enviar dados automaticamente
      </p>
      <div className="flex items-center gap-2">
        <code className="flex-1 px-4 py-3 bg-background rounded-lg text-sm font-mono text-foreground border border-border/50">
          {webhookUrl}
        </code>
        <Button
          onClick={copyToClipboard}
          variant="outline"
          size="icon"
          className="shrink-0 hover:bg-primary/10 hover:text-primary hover:border-primary/50"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>
      <div className="mt-4 space-y-4">
        <div className="p-4 bg-muted/30 rounded-lg">
          <p className="text-sm font-medium text-foreground mb-2">Instagram:</p>
          <pre className="text-xs text-muted-foreground overflow-x-auto">
{`{
  "platform": "instagram",
  "event_type": "comment",
  "instagram_username": "usuario123",
  "full_name": "Nome Completo",
  "keyword": "PALAVRA",
  "comment": "Texto do comentário",
  "response": "Mensagem enviada"
}`}
          </pre>
        </div>

        <div className="p-4 bg-muted/30 rounded-lg">
          <p className="text-sm font-medium text-foreground mb-2">WhatsApp:</p>
          <pre className="text-xs text-muted-foreground overflow-x-auto">
{`{
  "platform": "whatsapp",
  "event_type": "group_join",
  "whatsapp_id": "5511999999999@c.us",
  "full_name": "Nome Completo",
  "group_name": "Nome do Grupo",
  "response": "Mensagem de boas-vindas"
}`}
          </pre>
          <p className="text-xs text-muted-foreground mt-2">
            event_type: "group_join" ou "group_leave"
          </p>
        </div>
      </div>
    </Card>
  );
};
