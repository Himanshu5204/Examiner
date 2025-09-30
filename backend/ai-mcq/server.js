import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenAI } from '@google/genai';

dotenv.config({ path: path.resolve('../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const History = [];

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
    topK: 10,
    vector: queryVector,
    includeMetadata: true
  });

  const context = searchResults.matches.map((match) => match.metadata.text).join('\n\n---\n\n');

  History.push({
    role: 'user',
    parts: [{ text: question }]
  });

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: History,
    config: {
      systemInstruction: `You are an intelligent exam question generator. 
                You will be given a subject syllabus in the form of context. 
                Your task is to generate **unique, moderate-level exam questions** from this syllabus. 
                For each question, also generate a **one-line answer**,4 different options in which one would be 
                the correct answer**. 

                For each MCQ:
                    - Provide the question.  
                    - Give exactly 4 answer options (labeled A, B, C, D).  
                    - Mark the correct option clearly.  
                    - Provide a short explanation or proof (2–3 lines) that justifies the correct answer.  
                    - Ensure the questions cover different topics within the syllabus to avoid repetition.
                    - - Generate a total of **${mcqCount} MCQs**.

                Guidelines:
                - Questions must directly come from the provided syllabus/context. 
                - Do not create questions outside the syllabus. 
                - Avoid repetition of questions. 
                - Keep the question difficulty at a moderate level (neither too easy nor too hard). 
                - Ensure answers are short (one-line or two-liner maximum). 
                - Maintain clarity, accuracy, and relevance.
                - If no relevant content is found in the context, respond with:  
                **"I could not generate a question from the provided syllabus."**

                Example format:
                    Q1: Which of the following best describes supervised learning?  
                    A) Learning without labeled data  
                    B) Learning using labeled input-output pairs  
                    C) Learning through trial and error  
                    D) Learning by clustering similar data  

                    Correct Answer: B) Learning using labeled input-output pairs  

                    Proof: In supervised learning, models are trained on labeled data where both input and correct output are provided, enabling the model to learn mappings.

                and so on.

      Context: ${context}
      `
    }
  });

  History.push({
    role: 'model',
    parts: [{ text: response.text }]
  });

  return response.text;
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
      return res.status(500).json({
        error: 'LLM did not return valid JSON',
        raw: result
      });
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
