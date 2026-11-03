import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  app.use(express.json());

  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey: apiKey || '' });

  // API endpoint for AI household management & payroll assistant
  app.post('/api/ai/assistant', async (req, res) => {
    try {
      const { prompt, context } = req.body;
      if (!apiKey) {
        return res.status(400).json({ error: 'GEMINI_API_KEY is not configured in environment secrets.' });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `You are MaidEase AI, an expert household staff and payroll assistant. 
Here is the current context about the household staff, attendance, advances, and payments:
${JSON.stringify(context, null, 2)}

User request/question: ${prompt}

Provide a helpful, precise, and professional response in markdown format. Give actionable payroll calculations, attendance insights, or drafted leave/salary messages if requested.`
              }
            ]
          }
        ]
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error('Gemini API error:', error);
      res.status(500).json({ error: error.message || 'Failed to generate AI response' });
    }
  });

  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`MaidEase server running on http://localhost:${port}`);
  });
}

startServer();
