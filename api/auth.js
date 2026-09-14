import express from 'express';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

// Vérifier le mot de passe
router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;

    const { data, error } = await supabase
      .from('projects')
      .select('password')
      .single();

    if (error) {
      return res.status(401).json({ error: 'Authentification échouée' });
    }

    if (data.password === password) {
      res.json({ authenticated: true });
    } else {
      res.status(401).json({ error: 'Mot de passe incorrect' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mettre à jour le mot de passe
router.post('/change-password', async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const { data } = await supabase
      .from('projects')
      .select('password')
      .single();

    if (data.password !== oldPassword) {
      return res.status(401).json({ error: 'Ancien mot de passe incorrect' });
    }

    const { error } = await supabase
      .from('projects')
      .update({ password: newPassword })
      .select();

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
