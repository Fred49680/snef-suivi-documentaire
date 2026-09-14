import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import projectRoutes from './api/project.js';
import documentRoutes from './api/documents.js';
import observationRoutes from './api/observations.js';
import authRoutes from './api/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/project', projectRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/observations', observationRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur SNEF sur http://localhost:${PORT}`);
});
