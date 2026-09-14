import express from 'express';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

// Récupérer toutes les observations
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('observations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Créer une observation
router.post('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('observations')
      .insert([req.body])
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supprimer une observation
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('observations')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
