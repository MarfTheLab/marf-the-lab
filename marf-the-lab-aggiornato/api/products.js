const dbConnect = require('../lib/dbConnect');
const Product = require('../models/Product');

module.exports = async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const products = await Product.find({ isSoldOut: false });
      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json({ error: 'Errore nel recupero dei prodotti' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
