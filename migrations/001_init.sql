-- Créer la table des projets
CREATE TABLE IF NOT EXISTS projects (
  id BIGINT PRIMARY KEY DEFAULT 1,
  name TEXT DEFAULT 'Nouveau Projet Nucléaire',
  ref TEXT,
  accountNumber TEXT,
  startDate TEXT,
  endDate TEXT,
  manager TEXT,
  surveillance TEXT DEFAULT '1',
  globalHours TEXT,
  clientName TEXT,
  clientContact TEXT,
  clientEmail TEXT,
  clientPhone TEXT,
  clientAddress TEXT,
  password TEXT DEFAULT 'snef2024',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Créer la table des documents
CREATE TABLE IF NOT EXISTS documents (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
  indice TEXT,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'En cours',
  redacteur TEXT,
  redacteur_date TEXT,
  controleur TEXT,
  controleur_date TEXT,
  verificateur TEXT,
  verificateur_date TEXT,
  inputData JSONB DEFAULT '[]'::jsonb,
  advData JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Créer la table des observations
CREATE TABLE IF NOT EXISTS observations (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
  document_id BIGINT REFERENCES documents(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'Ouvert',
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Créer la table des questions
CREATE TABLE IF NOT EXISTS questions (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
  document_id BIGINT REFERENCES documents(id) ON DELETE CASCADE,
  question TEXT,
  answer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes pour performance
CREATE INDEX IF NOT EXISTS idx_documents_project ON documents(project_id);
CREATE INDEX IF NOT EXISTS idx_observations_project ON observations(project_id);
CREATE INDEX IF NOT EXISTS idx_observations_document ON observations(document_id);
CREATE INDEX IF NOT EXISTS idx_questions_project ON questions(project_id);
CREATE INDEX IF NOT EXISTS idx_questions_document ON questions(document_id);
