import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { InteractionsChart } from "@/components/dashboard/InteractionsChart";
import { InteractionsTable } from "@/components/dashboard/InteractionsTable";
import { WebhookInfo } from "@/components/dashboard/WebhookInfo";
import { MessageSquare, Users, Hash, TrendingUp } from "lucide-react";
import { toast } from "sonner";

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

const Index = () => {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);

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

  const totalInteractions = interactions.length;
  const instagramInteractions = interactions.filter(i => i.platform === 'instagram').length;
  const whatsappInteractions = interactions.filter(i => i.platform === 'whatsapp').length;
  const whatsappJoins = interactions.filter(i => i.platform === 'whatsapp' && i.event_type === 'group_join').length;
  const whatsappLeaves = interactions.filter(i => i.platform === 'whatsapp' && i.event_type === 'group_leave').length;
  const uniqueKeywords = new Set(interactions.filter(i => i.keyword).map(i => i.keyword)).size;
  const uniqueUsers = new Set(
    interactions.map(i => i.platform === 'instagram' ? i.instagram_username : i.phone_number)
  ).size;

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
            Dashboard Instagram
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Acompanhe suas interações em tempo real
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 space-y-8">
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
          <InteractionsTable interactions={interactions} />
        </div>
      </main>
    </div>
  );
};

export default Index;
