import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parsing using express built-in middleware
app.use(express.json());

// Proxy endpoint for Anthropic to prevent browser CORS issues
app.post("/api/anthropic", async (req, res) => {
  const apiKey = req.headers["x-api-key"] || req.headers["cf-api-key"] || req.body.apiKey;
  
  if (!apiKey) {
    return res.status(401).json({ 
      error: "Sua chave de API da Anthropic não foi fornecida. Por favor preencha no formulário/configuração." 
    });
  }

  // Remove API Key from body if it was sent there to avoid sending it to Anthropic
  const bodyCopy = { ...req.body };
  delete bodyCopy.apiKey;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey as string,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(bodyCopy),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorJson;
      try {
        errorJson = JSON.parse(errorText);
      } catch (e) {
        errorJson = { error: { message: errorText } };
      }
      return res.status(response.status).json(errorJson);
    }

    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    console.error("Erro na chamada de proxy da Anthropic:", error);
    return res.status(500).json({ error: { message: error.message || "Erro de conexão com Anthropic." } });
  }
});

// Alternative: Free Gemini AI proxy to generate fallback output if Anthropic is unavailable
app.post("/api/gemini", async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ 
      error: "A chave GEMINI_API_KEY não está configurada no servidor (.env)." 
    });
  }

  const { systemPrompt, userMessage, responseType } = req.body;
  if (!userMessage) {
    return res.status(400).json({ error: "userMessage é obrigatório." });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Call Gemini 3.5 Flash
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: systemPrompt || "Você é um consultor comercial B2B especialista.",
        responseMimeType: "application/json",
        temperature: 0.7,
      },
      contents: [userMessage],
    });

    let responseText = response.text;
    if (!responseText) {
      throw new Error("Resposta vazia da API do Gemini.");
    }

    // Clean potential markdown formatting safely
    let cleanedText = responseText.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.substring(7);
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.substring(3);
    }
    if (cleanedText.endsWith("```")) {
      cleanedText = cleanedText.substring(0, cleanedText.length - 3);
    }
    cleanedText = cleanedText.trim();

    try {
      const parsedData = JSON.parse(cleanedText);
      return res.json(parsedData);
    } catch (parseError: any) {
      console.error("Erro ao analisar JSON limpo:", cleanedText);
      // Fallback: return as text if JSON parse fails to prevent total failure
      return res.json({ text: responseText, error: "JSON invalido", raw: cleanedText });
    }
  } catch (error: any) {
    console.error("Erro de geração no Gemini:", error);
    return res.status(500).json({ error: error.message || "Erro interno de processamento de IA." });
  }
});

// Configure Vite middleware or static files
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[CF Sales Backend] Running on http://localhost:${PORT}`);
  });
}

initServer().catch((err) => {
  console.error("Erro ao inicializar o servidor Express", err);
});
