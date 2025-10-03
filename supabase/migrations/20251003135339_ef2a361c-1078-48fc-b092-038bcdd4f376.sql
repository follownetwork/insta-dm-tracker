-- Make full_name and response nullable since WhatsApp doesn't send them
ALTER TABLE instagram_interactions 
ALTER COLUMN full_name DROP NOT NULL,
ALTER COLUMN response DROP NOT NULL;