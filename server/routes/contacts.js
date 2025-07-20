const express = require('express');
const router  = express.Router();
const Sequence = require('../models/sequence');
const Contact = require('../models/contact');

router.get('/', async (req, res) => {
  await Contact.find()
    .populate('group')
    .then(contacts => res.status(200).json({message: 'Fetched contacts successfully', contacts}))
    .catch(error => res.status(500).json({message: 'Error deleting contacts', error: error}));
});

router.post('/', async (req, res) => {
  try {
    // Get next sequence value
    const sequence = await Sequence.findOne();
    const newId = sequence.maxContactId + 1;

    // Update sequence
    await Sequence.updateOne({}, { $set: { maxContactId: newId } });

    const contact = new Contact({
      id: newId.toString(),
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      imageUrl: req.body.imageUrl,
      group: req.body.group || []
    });

    const savedContact = await contact.save();
    const populatedContact = await Contact.findById(savedContact._id)
      .populate('group')
      .exec();

    res.status(201).json({
      message: 'Contact created successfully',
      contacts: [populatedContact]
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating contact', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const contact = await Contact.findOne({ id: req.params.id });
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    const updatedContact = await Contact.findOneAndUpdate(
      { id: req.params.id },
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        imageUrl: req.body.imageUrl,
        group: req.body.group || []
      },
      { new: true }
    ).populate('group');

    res.status(200).json({
      message: 'Contact updated successfully',
      contacts: [updatedContact]
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating contact', error: error.message });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    await Contact.deleteOne({ id: req.params.id });
    res.status(200).json({
      message: 'Contact deleted successfully',
      contacts: []
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contact', error: error.message });
  }
});

module.exports = router;
