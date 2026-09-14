import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { method } = req;
  const { id } = req.query;

  try {
    if (method === 'GET') {
      // Lister toutes les affaires
      const affaires = await kv.hgetall('affaires') || {};
      return res.status(200).json(affaires);
    }

    if (method === 'POST') {
      // Créer une affaire
      const { num, nom, client, manager, start, end } = req.body;

      if (!num || !nom) {
        return res.status(400).json({ error: 'Champs obligatoires manquants' });
      }

      const affaireId = num.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const affaire = {
        id: affaireId,
        num,
        nom,
        client,
        manager,
        start,
        end,
        dateCreation: new Date().toISOString()
      };

      await kv.hset('affaires', { [affaireId]: JSON.stringify(affaire) });
      await kv.hset(`affaire:${affaireId}:documents`, {});

      return res.status(201).json(affaire);
    }

    if (method === 'DELETE' && id) {
      // Supprimer une affaire
      await kv.hdel('affaires', id);
      await kv.del(`affaire:${id}:documents`);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Méthode non autorisée' });
  } catch (error) {
    console.error('Erreur affaires:', error);
    return res.status(500).json({ error: error.message });
  }
}
