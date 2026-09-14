import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import projectRoutes from './project.js';
import documentRoutes from './documents.js';
import observationRoutes from './observations.js';
import authRoutes from './auth.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/project', projectRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/observations', observationRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

export default app;
