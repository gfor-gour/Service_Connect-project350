const axios = require("axios");
const Chatbot = require("../models/Chatbot");
const { v4: uuidv4 } = require("uuid");
const stringSimilarity = require("string-similarity");

const allowedCategories = ["electrician", "plumber", "technician", "cleaner", "mechanic", "carpenter", "babysitter"];

const generateContent = async (req, res) => {
  const { question, category, description, sessionId } = req.body;
  const apiKey = process.env.REACT_APP_GENERATIVE_LANGUAGE_API_KEY;

  const currentSessionId = sessionId || uuidv4();
  const lowerCaseQuestion = question.toLowerCase();

  // Handle greetings
  if (
    ["hi", "hello", "hey", "good morning", "good afternoon", "good evening"].some((greeting) =>
      lowerCaseQuestion.includes(greeting)
    )
  ) {
    const greetingResponse =
      "Hello! I'm your local services assistant. I can help you find information about electricians, plumbers, technicians, cleaners, mechanics, carpenters, and babysitters. How can I assist you today?";

    await saveMessages(currentSessionId, question, greetingResponse, category, description);

    return res.json({
      answer: greetingResponse,
      sessionId: currentSessionId,
      suggestions: ["Find an electrician", "Need a plumber", "Looking for a cleaner", "Find a babysitter"],
    });
  }

  // Determine the best-matched category from question using fuzzy match
  const fuzzyCategory = extractCategoryWithFuzzyMatch(lowerCaseQuestion);

  const isValidCategory = category && allowedCategories.includes(category.toLowerCase());

  if (!fuzzyCategory && !isValidCategory) {
    const restrictedResponse =
      "I can only help with local services like electricians, plumbers, technicians, cleaners, mechanics, carpenters, and babysitters. Please ask about one of these services or use the detailed form to specify your needs.";

    await saveMessages(currentSessionId, question, restrictedResponse, category, description);

    return res.json({
      answer: restrictedResponse,
      sessionId: currentSessionId,
      suggestions: allowedCategories.map((cat) => `Find a ${cat}`),
    });
  }

  try {
    let enhancedPrompt = question;

    const effectiveCategory = fuzzyCategory || category;

    if (effectiveCategory && description) {
      enhancedPrompt = `I need help with ${effectiveCategory} services. ${description}. ${question || "Please provide helpful information and recommendations."}`;
    }

    const contextualPrompt = `You are a helpful assistant specializing in local services. The user is asking about: ${enhancedPrompt}

Please provide helpful, practical advice including:
- What to look for when hiring this type of service provider
- Typical cost ranges and pricing factors
- Important questions to ask potential providers
- Red flags to watch out for
- General tips specific to this service

Keep the response informative but concise (2-3 paragraphs maximum).`;

    const response = await axios({
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      method: "post",
      data: {
        contents: [{ parts: [{ text: contextualPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      },
    });

    const aiResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "I do not know.";

    const suggestions = generateSuggestions(effectiveCategory);

    await saveMessages(currentSessionId, question, aiResponse, effectiveCategory, description);

    res.json({
      answer: aiResponse,
      sessionId: currentSessionId,
      suggestions,
    });
  } catch (error) {
    console.error("Error generating content:", error.response ? error.response.data : error.message);

    const errorResponse = "Something went wrong. Please try again!";
    await saveMessages(currentSessionId, question, errorResponse, category, description);

    res.status(500).json({
      error: errorResponse,
      sessionId: currentSessionId,
    });
  }
};

// Save messages
const saveMessages = async (sessionId, userMessage, botResponse, category, description) => {
  try {
    await Chatbot.create({
      content: userMessage,
      sender: "user",
      category,
      description,
      sessionId,
      timestamp: new Date(),
    });

    await Chatbot.create({
      content: botResponse,
      sender: "bot",
      sessionId,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Error saving messages:", error);
  }
};

// Generate suggestions
const generateSuggestions = (category) => {
  const suggestionMap = {
    electrician: [
      "How much does electrical work cost?",
      "What questions should I ask an electrician?",
      "Emergency electrical services",
      "Electrical safety tips",
    ],
    plumber: [
      "Plumbing emergency services",
      "How to choose a good plumber?",
      "Average plumbing costs",
      "Preventive plumbing maintenance",
    ],
    cleaner: [
      "House cleaning service rates",
      "What to expect from cleaning services?",
      "Deep cleaning vs regular cleaning",
      "Cleaning service checklist",
    ],
    technician: [
      "IT support services",
      "Appliance repair costs",
      "Finding reliable technicians",
      "Warranty and service guarantees",
    ],
    mechanic: [
      "Auto repair estimates",
      "How to find a trustworthy mechanic?",
      "Car maintenance schedules",
      "Understanding repair quotes",
    ],
    carpenter: [
      "Custom carpentry costs",
      "Furniture repair services",
      "Home renovation projects",
      "Woodworking consultations",
    ],
    babysitter: [
      "Babysitting rates in my area",
      "Background check requirements",
      "Finding certified babysitters",
      "Babysitting safety guidelines",
    ],
  };

  return (
    suggestionMap[category] || [
      "Tell me more about local services",
      "How do I verify service providers?",
      "What are typical service costs?",
      "Safety tips for hiring services",
    ]
  );
};

// Extract best-match category using fuzzy matching
const extractCategoryWithFuzzyMatch = (input) => {
  const matches = stringSimilarity.findBestMatch(input, allowedCategories);
  if (matches.bestMatch.rating > 0.5) {
    return matches.bestMatch.target;
  }
  return null;
};

// Get chat history
const getChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    if (!sessionId) return res.status(400).json({ error: "Session ID is required" });

    const messages = await Chatbot.find({ sessionId }).sort({ timestamp: 1 }).limit(100);
    res.json({ messages });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
};

// Clear chat history
const clearChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: "Session ID is required" });

    await Chatbot.deleteMany({ sessionId });
    res.json({ message: "Chat history cleared successfully" });
  } catch (error) {
    console.error("Error clearing chat history:", error);
    res.status(500).json({ error: "Failed to clear chat history" });
  }
};

module.exports = {
  generateContent,
  getChatHistory,
  clearChatHistory,
};
