import express from 'express';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

// Récupérer le projet
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .single();

    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(404).json({ error: 'Projet non trouvé', details: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error('Erreur serveur:', err);
    res.status(500).json({ error: err.message, stack: process.env.NODE_ENV === 'production' ? undefined : err.stack });
  }
});

// Créer/Mettre à jour le projet
router.post('/', async (req, res) => {
  try {
    const { data: existing } = await supabase
      .from('projects')
      .select('id')
      .single();

    let result;
    if (existing) {
      result = await supabase
        .from('projects')
        .update(req.body)
        .eq('id', existing.id)
        .select();
    } else {
      result = await supabase
        .from('projects')
        .insert([req.body])
        .select();
    }

    if (result.error) {
      return res.status(400).json({ error: result.error.message });
    }

    res.json(result.data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
