import Message from '../models/Message.js';

export const getMessages = async (req, res) => {
  try {
    const { userId1, userId2 } = req.query; 
    
    if (!userId1 || !userId2) {
      return res.status(400).json({ message: 'Missing userId1 or userId2' });
    }

    const messages = await Message.find({
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 }
      ]
    }).sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllMessages = async (req, res) => {
  try {
     const messages = await Message.find({}).populate('senderId', 'name role').populate('receiverId', 'name role').sort({ createdAt: 1 });
     res.json(messages);
  } catch (error) {
     res.status(500).json({ message: error.message });
  }
}

export const saveMessage = async (data) => {
  try {
    const { senderId, receiverId, message } = data;
    const newMessage = await Message.create({ senderId, receiverId, message });
    return await newMessage.populate('senderId', 'name role');
  } catch (error) {
    console.error('Error saving message:', error);
    return null;
  }
};
