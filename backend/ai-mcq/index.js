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
    chunkSize: 1500, //1-1000 , 800-1800 , 1600-2600 for content not lost
    chunkOverlap: 200
  });
  const chunkedDocs = await textSplitter.splitDocuments(rawDocs);
  console.log(chunkedDocs.length, 'chunks'); //227 chunks
  console.log('chunking completed');

  try {
    //data converts into Vector - Embedding model
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      model: 'embedding-001' // example: dimension 1024
    });
    console.log('Embedding model configured');

    const vectors = await Promise.all(
      chunkedDocs.map(async (doc) => {
        const embedding = await embeddings.embedQuery(doc.pageContent);
        if (embedding.length !== 1024) {
          throw new Error(`Embedding dimension mismatch: got ${embedding.length}, expected 1024`);
        }
        return embedding;
      })
    );
    console.log('First embedding dimension:', vectors[0].length);
  } catch (err) {
    if (err.status === 429) {
      console.error('Quota exceeded for Gemini API embeddings. Please upgrade your plan or wait for quota reset.');
      process.exit(1);
    } else {
      console.error('Error generating embeddings:', err);
      process.exit(1);
    }
  }
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
}

indexDocument();
