const express = require('express');
const fetch = require('node-fetch');

const app = express();

// GET endpoint যা query parameters থেকে ডেটা নেবে
app.get('/api/chat', async (req, res) => {
  try {
    const grokUrl = 'https://grok.com/rest/app-chat/conversations/new';
    
    // URL থেকে message এবং modelName প্যারামিটারগুলো গ্রহণ করা হচ্ছে
    const { message, modelName = "grok-3" } = req.query;

    if (!message) {
      return res.status(400).json({ error: 'Message parameter is required.' });
    }

    // Grok API-তে পাঠানোর জন্য Headers
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Content-Type': 'application/json',
      'origin': 'https://grok.com',
      'referer': 'https://grok.com/',
      'accept-language': 'en-US,en;q=0.9',
      'priority': 'u=1, i'
    };

    // Grok API-এর জন্য POST request body তৈরি
    const requestBody = {
      "temporary": false,
      "modelName": modelName,
      "message": message,
      "fileAttachments": [],
      "imageAttachments": [],
      "disableSearch": false,
      "enableImageGeneration": true,
      "returnImageBytes": false,
      "returnRawGrokInXaiRequest": false,
      "enableImageStreaming": true,
      "imageGenerationCount": 2,
      "forceConcise": false,
      "toolOverrides": {},
      "enableSideBySide": false,
      "sendFinalMetadata": true,
      "isReasoning": false,
      "webpageUrls": [],
      "disableTextFollowUps": true,
      "responseMetadata": {
        "requestModelDetails": {
          "modelId": modelName
        }
      },
      "disableMemory": false,
      "forceSideBySide": false,
      "modelMode": "MODEL_MODE_AUTO",
      "isAsyncChat": false
    };

    // Grok API-তে POST request পাঠানো
    const response = await fetch(grokUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    // Grok থেকে প্রাপ্ত response ক্লায়েন্টকে ফেরত পাঠানো
    res.status(response.status).json(data);

  } catch (error) {
    console.error('Error forwarding request:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

module.exports = app;
