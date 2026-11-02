const dbConnect = require('../lib/dbConnect');
const CustomRequest = require('../models/CustomRequest');

module.exports = async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { customerName, customerEmail, style, productType, description, estimatedPrice, referenceImages } = req.body;

      const newRequest = new CustomRequest({
        customerName,
        customerEmail,
        style,
        productType,
        description,
        estimatedPrice,
        referenceImages: referenceImages || []
      });

      await newRequest.save();
      return res.status(201).json({ success: true, requestId: newRequest._id });
    } catch (error) {
      return res.status(400).json({ error: 'Errore nel salvataggio della richiesta', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
