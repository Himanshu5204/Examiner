//if we use Use CommonJS instead of ESM Module in package.json

// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const path = require("path");
// const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");
// const { Pinecone } = require("@pinecone-database/pinecone");
// const { GoogleGenAI } = require("@google/genai");


import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenAI } from '@google/genai';
//import { GoogleGenerativeAI } from "@google/generative-ai";


dotenv.config({ path: path.resolve('../.env') });
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Debug: Print loaded env variables
console.log('Loaded GEMINI_API_KEY:', process.env.GEMINI_API_KEY);
console.log('Loaded PINECONE_INDEX_NAME:', process.env.PINECONE_INDEX_NAME);

if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.length < 20) {
  console.error('❌ GEMINI_API_KEY is missing or looks invalid. Check your .env file!');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); //{apikey:""} new changes {}
//const ai = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });

// 🔹 Function to generate MCQs
async function generateMCQs(mcqCount) {
  // Use the same embedding model and logic as index.js/query.js
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: 'text-embedding-004'
  });

  // Pinecone setup
  const pinecone = new Pinecone();
  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

  // Use the actual MCQ prompt as the query
  const question = `Generate ${mcqCount} MCQs from the syllabus context`;
  const queryVector = await embeddings.embedQuery(question);

  const searchResults = await pineconeIndex.query({
    topK: 3,
    vector: queryVector,
    includeMetadata: true
  });

  const context = searchResults.matches.map((m) => m.metadata.text.split(/\s+/).slice(0, 120).join(' ')).join('\n\n');
  if (!context.trim()) {
    return JSON.stringify([{ error: 'No relevant syllabus content found.' }]);
  }
  
  const result = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [
      {
        role: 'user',
        parts: [{ text: `Context:\n${context}\n\nGenerate ${mcqCount} MCQs.` }]
      }
    ],
    config: {
      systemInstruction: `
        You are an intelligent exam MCQ generator. 
        Task: Generate ${mcqCount} unique, moderate-level MCQs from the given syllabus context.

        Rules:
        - Each question must be based ONLY on the provided context.
        - Provide exactly 4 options (A–D), one correct answer, and a short 2–3 line explanation.
        - Cover different topics to avoid repetition.
        - Keep answers concise (max 2 lines).
        - If no relevant content, reply: "I could not generate a question from the provided syllabus."

        Output format (JSON array):
        [
          {
            "question": "...",
            "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
            "correctAnswer": "B",
            "explanation": "..."
          }
        ]`
    },
    generationConfig: {
      responseMimeType: 'application/json'
    }
  });

  return result.text;
}

// 🔹 API endpoint
app.post('/generate-mcqs', async (req, res) => {
  try {
    const { count } = req.body; // Example: { "count": 5 }
    const mcqCount = parseInt(count) || 5;

    const result = await generateMCQs(mcqCount);

    // Try parsing JSON
    let parsed;
    try {
      parsed = JSON.parse(result);
    } catch (err) {
      console.warn('Invalid JSON, retrying...');

      const retry = await generateMCQs(mcqCount); // recall with same params
      try {
        parsed = JSON.parse(retry);
      } catch (err2) {
        return res.status(500).json({
          error: 'LLM failed twice with invalid JSON',
          raw: retry
        });
      }
    }

    res.json({ mcqs: parsed });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
