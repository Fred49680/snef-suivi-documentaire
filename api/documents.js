import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { method } = req;
  const { affaireId, docId } = req.query;

  try {
    if (method === 'GET') {
      // Lister documents d'une affaire
      if (!affaireId) {
        return res.status(400).json({ error: 'affaireId requis' });
      }

      const docs = await kv.hgetall(`affaire:${affaireId}:documents`) || {};
      return res.status(200).json(docs);
    }

    if (method === 'POST') {
      // Créer un document
      if (!affaireId) {
        return res.status(400).json({ error: 'affaireId requis' });
      }

      const { num, title, heuresPrevues } = req.body;

      if (!num || !title) {
        return res.status(400).json({ error: 'Champs obligatoires manquants' });
      }

      const doc = {
        num,
        title,
        heuresPrevues: parseFloat(heuresPrevues) || 0,
        heuresRéelles: 0,
        avancement: 0,
        statut: 'notstarted',
        creerPar: 'Admin',
        dateCreation: new Date().toISOString(),
        historique: []
      };

      await kv.hset(`affaire:${affaireId}:documents`, { [num]: JSON.stringify(doc) });
      return res.status(201).json(doc);
    }

    if (method === 'PUT' && docId) {
      // Mettre à jour un document
      if (!affaireId) {
        return res.status(400).json({ error: 'affaireId requis' });
      }

      const { heuresRéelles, avancement, statut, comment } = req.body;

      const docsRaw = await kv.hget(`affaire:${affaireId}:documents`, docId);
      if (!docsRaw) {
        return res.status(404).json({ error: 'Document non trouvé' });
      }

      const doc = JSON.parse(docsRaw);
      doc.heuresRéelles = parseFloat(heuresRéelles) || doc.heuresRéelles;
      doc.avancement = parseInt(avancement) || doc.avancement;
      doc.statut = statut || doc.statut;
      doc.dateMAJ = new Date().toISOString();
      doc.majPar = 'Admin';

      // Ajouter à l'historique
      if (!doc.historique) doc.historique = [];
      doc.historique.push({
        action: `Avancement: ${doc.avancement}% | Heures: ${doc.heuresRéelles}h | Statut: ${doc.statut}`,
        auteur: 'Admin',
        timestamp: new Date().toISOString(),
        comment: comment || ''
      });

      await kv.hset(`affaire:${affaireId}:documents`, { [docId]: JSON.stringify(doc) });
      return res.status(200).json(doc);
    }

    if (method === 'DELETE' && docId) {
      // Supprimer un document
      if (!affaireId) {
        return res.status(400).json({ error: 'affaireId requis' });
      }

      await kv.hdel(`affaire:${affaireId}:documents`, docId);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Méthode non autorisée' });
  } catch (error) {
    console.error('Erreur documents:', error);
    return res.status(500).json({ error: error.message });
  }
}
