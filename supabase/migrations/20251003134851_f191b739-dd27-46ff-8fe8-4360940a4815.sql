-- Rename phone_number to whatsapp_id since it's an ID, not a phone number
ALTER TABLE instagram_interactions 
RENAME COLUMN phone_number TO whatsapp_id;

COMMENT ON COLUMN instagram_interactions.whatsapp_id IS 'WhatsApp contact ID (not the phone number)';