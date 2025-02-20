-- Check if table exists and create it if not
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  project_name VARCHAR(255) NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  producer VARCHAR(255) NOT NULL,
  creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'New',
  total_project_cost DECIMAL(12,2) DEFAULT 0,
  total_expenses DECIMAL(12,2) DEFAULT 0,
  total_bonuses DECIMAL(12,2) DEFAULT 0,
  net_profit DECIMAL(12,2) DEFAULT 0,
  profitability INTEGER DEFAULT 0,
  final_profit DECIMAL(12,2) DEFAULT 0,
  estimate_json JSONB
);

-- Add columns if they don't exist
DO $$
BEGIN
  -- Check for status column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='projects' AND column_name='status') THEN
    ALTER TABLE projects ADD COLUMN status VARCHAR(50) DEFAULT 'New';
  END IF;

  -- Check for total_project_cost column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='projects' AND column_name='total_project_cost') THEN
    ALTER TABLE projects ADD COLUMN total_project_cost DECIMAL(12,2) DEFAULT 0;
  END IF;

  -- Check for total_expenses column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='projects' AND column_name='total_expenses') THEN
    ALTER TABLE projects ADD COLUMN total_expenses DECIMAL(12,2) DEFAULT 0;
  END IF;

  -- Check for total_bonuses column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='projects' AND column_name='total_bonuses') THEN
    ALTER TABLE projects ADD COLUMN total_bonuses DECIMAL(12,2) DEFAULT 0;
  END IF;

  -- Check for net_profit column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='projects' AND column_name='net_profit') THEN
    ALTER TABLE projects ADD COLUMN net_profit DECIMAL(12,2) DEFAULT 0;
  END IF;

  -- Check for profitability column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='projects' AND column_name='profitability') THEN
    ALTER TABLE projects ADD COLUMN profitability INTEGER DEFAULT 0;
  END IF;

  -- Check for final_profit column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='projects' AND column_name='final_profit') THEN
    ALTER TABLE projects ADD COLUMN final_profit DECIMAL(12,2) DEFAULT 0;
  END IF;

  -- Check for estimate_json column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='projects' AND column_name='estimate_json') THEN
    ALTER TABLE projects ADD COLUMN estimate_json JSONB;
  END IF;
END $$;