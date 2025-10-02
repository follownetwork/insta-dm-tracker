-- Add new columns to track WhatsApp interactions
ALTER TABLE instagram_interactions 
ADD COLUMN platform text NOT NULL DEFAULT 'instagram',
ADD COLUMN event_type text NOT NULL DEFAULT 'comment',
ADD COLUMN phone_number text,
ADD COLUMN group_name text;

-- Add check constraints
ALTER TABLE instagram_interactions
ADD CONSTRAINT platform_check CHECK (platform IN ('instagram', 'whatsapp'));

ALTER TABLE instagram_interactions
ADD CONSTRAINT event_type_check CHECK (event_type IN ('comment', 'dm_sent', 'group_join', 'group_leave'));

-- Make instagram-specific fields nullable for whatsapp events
ALTER TABLE instagram_interactions
ALTER COLUMN keyword DROP NOT NULL,
ALTER COLUMN comment DROP NOT NULL,
ALTER COLUMN instagram_username DROP NOT NULL;