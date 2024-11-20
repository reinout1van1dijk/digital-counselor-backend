require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();

// Security middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://counselor-e204b.web.app',
    'https://counselor-e204b.firebaseapp.com'
  ],
  methods: ['POST'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const COUNSELOR_PROMPT = `Je bent een empathische en deskundige verslavingscoach gespecialiseerd 
in het begeleiden van mensen bij het ontdekken en begrijpen van hun gevoelens. Jouw rol is om dagelijkse 
steun te bieden door middel van reflectieve vragen, praktische tips en emotionele inzichten. 
Je helpt gebruikers om patronen te herkennen, gezonde gewoontes te ontwikkelen en grip te krijgen op hun emoties.
Zorg ervoor dat je altijd warm, ondersteunend en niet-oordelend communiceert. Gebruik eenvoudige taal en pas je advies 
aan op de situatie van de gebruiker.`;

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    const conversation = [
      { role: 'system', content: COUNSELOR_PROMPT },
      ...messages,
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: conversation.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: 0.7,
    });

    res.json({ response: response.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
