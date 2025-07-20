const express = require('express');
const router  = express.Router();
const Sequence = require('../models/sequence');
const Document = require('../models/document');

router.get('/', async (req, res) => {
  await Document.find()
    .then(docs => res.status(200).json({ message: 'Fetched', documents: docs}))
    .catch(error => res.status(500).json({ message: 'Error fetching documents', error: error }));
})

router.post('/', async (req, res) => {
  try {
    // Get next sequence value
    const sequence = await Sequence.findOne();
    const newId = sequence.maxDocumentId + 1;

    // Update sequence
    await Sequence.updateOne({}, { $set: { maxDocumentId: newId } });

    const document = new Document({
      id: newId.toString(),
      name: req.body.name,
      url: req.body.url,
      description: req.body.description
    });

    const savedDocument = await document.save();
    res.status(201).json({
      message: 'Added successfully',
      documents: [savedDocument]  // Match the GET response format
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error adding document',
      error: error.message
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const document = await Document.findOne({ id: req.params.id });
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const updatedDocument = await Document.findOneAndUpdate(
      { id: req.params.id },
      {
        name: req.body.name,
        description: req.body.description,
        url: req.body.url
      },
      { new: true }
    );

    res.status(200).json({
      message: 'Updated successfully',
      documents: [updatedDocument]
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating document', error: error.message });
  }
});
router.delete('/:id', async (req, res) => {
  await Document.deleteOne({ id: req.params.id })
    .then(() => res.status(204).end())
    .catch(error => res.status(500).json({ message: 'Error deleting document', error: error }));
});

module.exports = router;

module.exports = router;
