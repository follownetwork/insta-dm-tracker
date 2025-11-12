import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { InteractionsChart } from "@/components/dashboard/InteractionsChart";
import { InteractionsTable } from "@/components/dashboard/InteractionsTable";
import { WebhookInfo } from "@/components/dashboard/WebhookInfo";
import { MessageSquare, Users, Hash, TrendingUp, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format, isToday, isYesterday, isSameDay, startOfDay, endOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Interaction {
  id: string;
  platform: string;
  event_type: string;
  instagram_username: string | null;
  full_name: string | null;
  keyword: string | null;
  comment: string | null;
  response: string | null;
  whatsapp_id: string | null;
  group_name: string | null;
  created_at: string;
}

const Index = () => {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    fetchInteractions();
    
    // Setup realtime subscription
    const channel = supabase
      .channel('instagram_interactions')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'instagram_interactions'
        },
        (payload) => {
          console.log('New interaction received:', payload);
          setInteractions(prev => [payload.new as Interaction, ...prev]);
          toast.success("Nova interação registrada!");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchInteractions = async () => {
    try {
      const { data, error } = await supabase
        .from('instagram_interactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInteractions(data || []);
    } catch (error) {
      console.error('Error fetching interactions:', error);
      toast.error("Erro ao carregar interações");
    } finally {
      setLoading(false);
    }
  };

  // Filter interactions by selected date
  const filteredInteractions = selectedDate 
    ? interactions.filter(i => isSameDay(new Date(i.created_at), selectedDate))
    : interactions;

  const totalInteractions = filteredInteractions.length;
  const instagramInteractions = filteredInteractions.filter(i => i.platform === 'instagram').length;
  const whatsappInteractions = filteredInteractions.filter(i => i.platform === 'whatsapp').length;
  const whatsappJoins = filteredInteractions.filter(i => i.platform === 'whatsapp' && i.event_type === 'group_join').length;
  const whatsappLeaves = filteredInteractions.filter(i => i.platform === 'whatsapp' && i.event_type === 'group_leave').length;
  const uniqueKeywords = new Set(filteredInteractions.filter(i => i.keyword).map(i => i.keyword)).size;
  const uniqueUsers = new Set(
    filteredInteractions.map(i => i.platform === 'instagram' ? i.instagram_username : i.whatsapp_id)
  ).size;

  const getDateLabel = () => {
    if (!selectedDate) return "Selecione uma data";
    if (isToday(selectedDate)) return "Hoje";
    if (isYesterday(selectedDate)) return "Ontem";
    return format(selectedDate, "dd 'de' MMMM", { locale: ptBR });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Dashboard Instagram - Arlei Souza
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Acompanhe suas interações em tempo real
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Date Filter */}
        <div className="flex items-center gap-4 animate-fade-in">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {getDateLabel()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          {selectedDate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDate(undefined)}
            >
              Limpar filtro
            </Button>
          )}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
          <MetricCard
            title="Total de Interações"
            value={totalInteractions}
            icon={MessageSquare}
            description={`Instagram: ${instagramInteractions} | WhatsApp: ${whatsappInteractions}`}
          />
          <MetricCard
            title="WhatsApp - Entradas"
            value={whatsappJoins}
            icon={Users}
            description="Pessoas que entraram no grupo"
          />
          <MetricCard
            title="WhatsApp - Saídas"
            value={whatsappLeaves}
            icon={TrendingUp}
            description="Pessoas que saíram do grupo"
          />
          <MetricCard
            title="Usuários Únicos"
            value={uniqueUsers}
            icon={Hash}
            description={`Palavras-chave: ${uniqueKeywords}`}
          />
        </div>

        {/* Webhook Info */}
        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <WebhookInfo />
        </div>

        {/* Chart */}
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <InteractionsChart data={interactions} />
        </div>

        {/* Table */}
        <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <InteractionsTable interactions={filteredInteractions} />
        </div>
      </main>
    </div>
  );
};

export default Index;
