const express = require('express');
const cors = require('cors');
const dialogflow = require('@google-cloud/dialogflow');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

const projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.PROJECT_ID || 'flutter-ai-playground-2e118';
const languageCode = process.env.DIALOGFLOW_LANGUAGE || 'ar';

const sessionClient = new dialogflow.SessionsClient();

app.get('/', (req, res) => {
  res.send('API is running');
});

app.get('/chat', (req, res) => {
  res.send('Chat API is running. Use POST /chat with JSON body: {"message":"مرحبا"}');
});

app.post('/chat', async (req, res) => {
  try {
    const message = req.body && req.body.message ? String(req.body.message) : 'مرحبا';
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, uuidv4());

    const [response] = await sessionClient.detectIntent({
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode,
        },
      },
    });

    const result = response.queryResult;
    res.json({
      reply: result.fulfillmentText || 'لم أفهم الرسالة.',
      intent: result.intent ? result.intent.displayName : null,
      confidence: result.intentDetectionConfidence || 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
