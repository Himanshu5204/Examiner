//RAG Retrieval-Augmented Generation data retrieval from llm who generates where
// we augment the input with relevant context

//Pdf load
//import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import dotenv from 'dotenv';
import path from 'path';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import fs from 'fs';

async function indexDocument() {
  dotenv.config({ path: path.resolve('../.env') });

  const PDF_PATH = '../upload/ML_Syllabus.pdf';

  if (!fs.existsSync(PDF_PATH)) {
    console.error('PDF file not found at', PDF_PATH);
    process.exit(1);
  }

  const pdfLoader = new PDFLoader(PDF_PATH);
  const rawDocs = await pdfLoader.load();
  //console.log(rawDocs.length,"pages"); //4 pages
  console.log('PDF loaded');

  //chunking - divided into small parts also do by loops
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 3000, //1-1000 , 800-1800 , 1600-2600 for content not lost
    chunkOverlap: 200
  });
  const chunkedDocs = await textSplitter.splitDocuments(rawDocs);
  console.log(chunkedDocs.length, 'chunks'); //227 chunks
  console.log('chunking completed');


  try {
    //data converts into Vector - Embedding model
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      model: 'text-embedding-004' // more reliable for Gemini API
    });
    console.log('Embedding model configured');

    // Prepare array of strings for embedding
    const texts = chunkedDocs.map(doc => doc.pageContent);
    if (texts.length > 100) {
      throw new Error('PDF too large or too fragmented for free API quota.');
    }
    console.log('Texts to embed:', texts);
    const vectors = await embeddings.embedDocuments(texts);
    console.log('Embedding result:', vectors);

    if (!vectors.length) {
      throw new Error('No embeddings returned. Check input text and API quota.');
    }
    if (!vectors[0] || !Array.isArray(vectors[0])) {
      throw new Error('Embedding API did not return a valid vector array.');
    }
    // Accept any non-empty vector length (for Gemini, 768 or 1536 or 1024 are possible)
    if (vectors[0].length < 100) {
      throw new Error(`Embedding dimension too small: got ${vectors[0].length}`);
    }
    console.log('First embedding dimension:', vectors[0].length);

    //Database configure connectivity - Pinecone for data store
    const pinecone = new Pinecone();
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);
    console.log('Pinecone index configured');

    //langchain (chunking,embedding,database)
    await PineconeStore.fromDocuments(chunkedDocs, embeddings, {
      pineconeIndex,
      maxConcurrency: 5 //5-5 store together
    });
    console.log('Data stored successfully');
  } catch (err) {
    if (err.status === 429) {
      console.error('Quota exceeded for Gemini API embeddings. Please upgrade your plan or wait for quota reset.');
      process.exit(1);
    } else {
      console.error('Error generating embeddings:', err);
      process.exit(1);
    }
  }
}

indexDocument();