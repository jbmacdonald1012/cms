const express = require('express');
const router  = express.Router();
const Sequence = require('../models/sequence');
const Message = require('../models/message');
const Contact = require('../models/contact');

router.get('/', async (req, res) => {
  try {
    const messages = await Message.find()
      .populate('sender')
      .exec();

    // Transform the response to match the expected format
    const transformedMessages = messages.map(message => ({
      id: message.id,
      subject: message.subject,
      msgText: message.msgText,
      sender: message.sender,  // This will now be the populated contact
      _id: message._id
    }));

    res.status(200).json({
      messages: transformedMessages
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error });
  }
});

router.post('/', async (req, res) => {
  try {
    const { subject, msgText, sender } = req.body;
    console.log('Received message data:', { subject, msgText, sender });

    // Get next sequence value
    const sequence = await Sequence.findOne();
    const newId = sequence.maxMessageId + 1;

    // Update sequence
    await Sequence.updateOne({}, { $set: { maxMessageId: newId } });

    // Find contact
    const contact = await Contact.findOne({ name: sender });
    console.log('Found contact:', contact);

    if (!contact) {
      console.log('No contact found for sender name:', sender);
      return res.status(404).json({
        message: 'Sender contact not found',
        requestedSender: sender
      });
    }

    const message = new Message({
      id: newId.toString(),
      subject,
      msgText,
      sender: contact._id
    });

    const savedMessage = await message.save();

    // Populate the sender details before sending response
    const populatedMessage = await Message.findById(savedMessage._id)
      .populate('sender')
      .exec();

    console.log('Saved message:', populatedMessage);
    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ message: 'Error saving message', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  await Message.findOne({ id: req.params.id })
    .then(message => {
      message.subject = req.body.subject;
      message.msgText = req.body.msgText;
      return message.updateOne({ id: req.params.id }, message);
    })
    .then(() => res.status(204).json.end())
    .catch(error => res.status(500).json({message: 'Error deleting message', error: error}));
});

router.delete('/:id', async (req, res) => {
  await Message.deleteOne({ id: req.params.id })
    .then(() => res.status(204).json.end())
    .catch(error => res.status(500).json({message: 'Error deleting message', error: error}));
});

module.exports = router;
