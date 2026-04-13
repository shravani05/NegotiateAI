require('dotenv').config();
const express = require('express');
const cors = require('cors');
const scenarioRouter = require('./router/scenarioRouter');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use('/api', scenarioRouter);

app.listen(PORT, () => {
  console.log(`NegotiateAI backend running on port ${PORT}`);
  console.log(`Model: ${process.env.BEDROCK_MODEL_ID || 'anthropic.claude-opus-4-6-v1:0'}`);
  console.log(`Region: ${process.env.AWS_REGION || 'us-east-1'}`);
});
