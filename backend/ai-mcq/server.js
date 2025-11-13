const express = require('express');
const multer = require('multer');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { PDFLoader } = require('@langchain/community/document_loaders/fs/pdf');
const { RecursiveCharacterTextSplitter } = require('@langchain/textsplitters');
const { GoogleGenerativeAIEmbeddings } = require('@langchain/google-genai');
const { Pinecone } = require('@pinecone-database/pinecone');
const { PineconeStore } = require('@langchain/pinecone');
const { GoogleGenAI } = require('@google/genai');

dotenv.config({ path: path.resolve('../.env') });
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

//configuration
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const pinecone = new Pinecone();
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

//Upload route
router.post('/upload', upload.single('file'), async (req, res) => {

  try {
    const pdfPath = req.file.path;
    console.log(`Uploaded: ${pdfPath}`);

    // Load + chunk PDF
    const pdfLoader = new PDFLoader(pdfPath);
    const rawDocs = await pdfLoader.load();

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 2000,
      chunkOverlap: 200
    });

    const chunks = await splitter.splitDocuments(rawDocs);
    console.log(`PDF chunked into ${chunks.length} parts.`);

    // Convert to embeddings
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      model: 'text-embedding-004'
    });

    await PineconeStore.fromDocuments(chunks, embeddings, { pineconeIndex });
    console.log('Stored in Pinecone');

    //remove file from server side
    fs.unlinkSync(pdfPath);
    res.status(200).json({ message: 'PDF processed and stored successfully!' });

  } catch (err) {
    console.error('Error processing PDF:', err);
    res.status(500).json({ error: err.message });
  }

});

//Generate MCQs route
router.post('/generate', async (req, res) => {

  try {
    const { count } = req.body;
    const mcqCount = parseInt(count) || 5;

    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      model: 'text-embedding-004'
    });

    const question = `Generate ${mcqCount} MCQs from syllabus context`;
    const queryVector = await embeddings.embedQuery(question);

    const results = await pineconeIndex.query({
      topK: 5,
      vector: queryVector,
      includeMetadata: true
    });

    const context = results.matches
      .map((m) => m.metadata.text)
      .join('\n\n---\n\n');

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Context:\n${context}\n\nGenerate ${mcqCount} unique MCQs. Each should have:
              1. Question
              2. Four options (A, B, C, D)
              3. Correct answer
              4. One-line explanation
              Return JSON array format like:
              [
                {
                  "question": "What is Java?",
                  "options": {"A":"...", "B":"...", "C":"...", "D":"..."},
                  "answer": "A",
                  "explanation": "..."
                }
              ]`
            }
          ]
        }
      ],
      generationConfig: { responseMimeType: 'application/json' }
    });

    let text = response.text.trim();
    text = text.replace(/```json|```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.warn('Model output invalid JSON, returning raw text');
      return res.json({ raw: text });
    }

    //Convert to frontend-friendly format
    const formatted = parsed.map((item) => ({
      questionText: item.question,
      options: Object.values(item.options),
      correctAnswer: item.options[item.answer],
      explanation: item.explanation || ''
    }));

    res.status(200).json({ mcqs: formatted });
  } catch (err) {
    console.error('Error generating MCQs:', err);
    res.status(500).json({ error: err.message });
  }

});

module.exports = router;