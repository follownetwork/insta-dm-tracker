import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Interaction {
  id: string;
  platform: string;
  event_type: string;
  instagram_username: string | null;
  full_name: string;
  keyword: string | null;
  comment: string | null;
  response: string;
  phone_number: string | null;
  group_name: string | null;
  created_at: string;
}

interface InteractionsTableProps {
  interactions: Interaction[];
}

export const InteractionsTable = ({ interactions }: InteractionsTableProps) => {
  return (
    <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border/50">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Interações Recentes</h3>
      <div className="rounded-md border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/50">
              <TableHead className="text-muted-foreground font-semibold">Plataforma</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Tipo</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Contato</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Nome</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Detalhes</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {interactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  Nenhuma interação registrada ainda
                </TableCell>
              </TableRow>
            ) : (
              interactions.map((interaction) => {
                const eventTypeLabels = {
                  'comment': 'Comentário',
                  'dm_sent': 'DM Enviada',
                  'group_join': 'Entrou no Grupo',
                  'group_leave': 'Saiu do Grupo'
                };

                return (
                  <TableRow 
                    key={interaction.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={
                          interaction.platform === 'instagram' 
                            ? "bg-primary/10 text-primary border-primary/30"
                            : "bg-secondary/10 text-secondary border-secondary/30"
                        }
                      >
                        {interaction.platform === 'instagram' ? 'Instagram' : 'WhatsApp'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {eventTypeLabels[interaction.event_type as keyof typeof eventTypeLabels]}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {interaction.platform === 'instagram' 
                        ? `@${interaction.instagram_username}` 
                        : interaction.phone_number}
                    </TableCell>
                    <TableCell className="text-foreground">{interaction.full_name}</TableCell>
                    <TableCell className="max-w-xs">
                      {interaction.platform === 'instagram' ? (
                        <div className="space-y-1">
                          {interaction.keyword && (
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs">
                              {interaction.keyword}
                            </Badge>
                          )}
                          {interaction.comment && (
                            <p className="text-xs text-muted-foreground truncate">{interaction.comment}</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">{interaction.group_name}</p>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(interaction.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
