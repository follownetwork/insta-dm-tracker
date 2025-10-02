-- Create table for Instagram interactions
CREATE TABLE public.instagram_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  instagram_username TEXT NOT NULL,
  full_name TEXT NOT NULL,
  keyword TEXT NOT NULL,
  comment TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable Row Level Security
ALTER TABLE public.instagram_interactions ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (since webhook will be public)
CREATE POLICY "Allow public read access" 
ON public.instagram_interactions 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access" 
ON public.instagram_interactions 
FOR INSERT 
WITH CHECK (true);

-- Create index for better query performance
CREATE INDEX idx_instagram_interactions_created_at ON public.instagram_interactions(created_at DESC);
CREATE INDEX idx_instagram_interactions_keyword ON public.instagram_interactions(keyword);
CREATE INDEX idx_instagram_interactions_username ON public.instagram_interactions(instagram_username);

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.instagram_interactions;