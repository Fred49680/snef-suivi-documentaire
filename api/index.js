import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from '../supabaseClient.js';
import projectRoutes from './project.js';
import documentRoutes from './documents.js';
import observationRoutes from './observations.js';
import authRoutes from './auth.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    supabaseUrl: process.env.SUPABASE_URL ? '✅ Configuré' : '❌ Manquant',
    supabaseKey: process.env.SUPABASE_KEY ? '✅ Configuré' : '❌ Manquant'
  });
});

// Diagnostic Supabase
app.get('/api/diagnose', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('count')
      .limit(1);

    if (error) {
      return res.status(400).json({
        error: 'Erreur Supabase',
        message: error.message,
        code: error.code
      });
    }

    res.json({
      status: 'Supabase connecté ✅',
      tablesAccessibles: true
    });
  } catch (err) {
    res.status(500).json({
      error: 'Erreur de connexion',
      message: err.message
    });
  }
});

// Routes
app.use('/api/project', projectRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/observations', observationRoutes);
app.use('/api/auth', authRoutes);

export default app;
