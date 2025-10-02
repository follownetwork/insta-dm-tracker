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
  instagram_username: string;
  full_name: string;
  keyword: string;
  comment: string;
  response: string;
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
              <TableHead className="text-muted-foreground font-semibold">Usuário</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Nome</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Palavra-chave</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Comentário</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {interactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Nenhuma interação registrada ainda
                </TableCell>
              </TableRow>
            ) : (
              interactions.map((interaction) => (
                <TableRow 
                  key={interaction.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-medium text-foreground">
                    @{interaction.instagram_username}
                  </TableCell>
                  <TableCell className="text-foreground">{interaction.full_name}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className="bg-primary/10 text-primary border-primary/30"
                    >
                      {interaction.keyword}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">
                    {interaction.comment}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(interaction.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
