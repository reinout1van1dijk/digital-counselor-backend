# Digital Counselor Backend

This is the backend server for the Digital Counselor application. It handles secure communication with the OpenAI API and provides endpoints for chat and audio transcription.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with the following variables:
```
OPENAI_API_KEY=your_api_key_here
PORT=3001
```

3. Start the server:
```bash
npm start
```

For development:
```bash
npm run dev
```

## API Endpoints

### POST /api/chat
Handles chat messages and generates counselor responses using OpenAI's GPT-4.

Request body:
```json
{
  "messages": [
    {
      "role": "user",
      "content": "message content"
    }
  ]
}
```

Response:
```json
{
  "response": "counselor's response"
}
```
