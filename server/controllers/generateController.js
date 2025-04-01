const axios = require('axios');
const Chatbot = require('../models/Chatbot'); // Import MongoDB model for messages

const allowedCategories = [
  'electrician',
  'plumber',
  'technician',
  'cleaner',
  'mechanic',
  'carpenter',
  'babysitter'
];

const generateContent = async (req, res) => {
  const { question } = req.body;
  const apiKey = process.env.REACT_APP_GENERATIVE_LANGUAGE_API_KEY;

  const lowerCaseQuestion = question.toLowerCase();

  // Handle greetings
  if (['hi', 'hello', 'hey'].includes(lowerCaseQuestion)) {
    return res.json({ answer: "Hello! How can I help you with local services?" });
  }

  // Check if the question is related to service providers
  const isRelated = allowedCategories.some((category) =>
    lowerCaseQuestion.includes(category)
  );

  if (!isRelated) {
    return res.json({ answer: "I don't know." });
  }

  try {
    const response = await axios({
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      method: 'post',
      data: {
        contents: [{ parts: [{ text: question }] }],
      },
    });

    const aiResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "I don't know.";

    // Save user message and bot response to MongoDB
    await Chatbot.create({
      content: question,
      sender: 'user',
      timestamp: new Date(),
    });
    
    await Chatbot.create({
      content: aiResponse,
      sender: 'bot',
      timestamp: new Date(),
    });

    // Send the AI response to the frontend
    res.json({ answer: aiResponse });
  } catch (error) {
    console.error(
      'Error generating content:',
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: 'Something went wrong. Please try again!' });
  }
};

module.exports = { generateContent };
