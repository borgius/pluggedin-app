-- Conditional column additions to avoid conflicts
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'notifications' AND column_name = 'severity'
    ) THEN
        ALTER TABLE "notifications" ADD COLUMN "severity" text;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'notifications' AND column_name = 'completed'
    ) THEN
        ALTER TABLE "notifications" ADD COLUMN "completed" boolean DEFAULT false NOT NULL;
    END IF;
END $$;