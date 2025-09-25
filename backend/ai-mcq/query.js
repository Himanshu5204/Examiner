//Phase 2: Query Resolving phase
import dotenv from 'dotenv';
import path from 'path';
import readlineSync from 'readline-sync';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenAI } from '@google/genai';
 
dotenv.config({ path: path.resolve('../.env') });
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); //{apikey:""} new changes {}
const History = [];


async function generateMCQs(mcqCount) {
 
  //const queries = await transformQuery(userProblem); //find que meaning first

  //converts this question into vector embedding
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: 'text-embedding-004'
  });
  //query vector / questionVector
  //const queryVector = await embeddings.embedQuery(queries);
  //console.log('Question converted to vector');

  //Database connected - pinecone
  const pinecone = new Pinecone();
  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

  const searchResults = await pineconeIndex.query({
    topK: 10, //10 result fetch
    vector: Array(1536).fill(0), //queryVector,
    includeMetadata: true
  });
  console.log('Search results fetched from Pinecone', searchResults);
  console.log("Search Results:", searchResults.matches.length);

  // top 10 documents : 10 metadata text needed that is part of 10 documents

  // create the context for llm
  const context = searchResults.matches
    .map((match) => match.metadata.text) //take only text
    .join('\n\n---\n\n');
  //console.log('Context created for LLM:', context);

  //Gemini model
  History.push({
    role: 'user',
    parts: [{ text: `Generate ${mcqCount} MCQs from the syllabus context` }]
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

  //console.log('\n');
  console.log(response.text);
}

//2nd llm to make context meaning full like (1st que + ans + 2nd que)
// async function transformQuery(question) {
//   History.push({
//     role: 'user',
//     parts: [{ text: question }]
//   });

//   const response = await ai.models.generateContent({
//     model: 'gemini-2.0-flash',
//     contents: History,
//     config: {
//       systemInstruction: `You are a query rewriting expert. Based on the provided chat history, rephrase the "Follow Up user Question"
//        into a complete, standalone question that can be understood without the chat history.
//     Only output the rewritten question and nothing else.
//       `
//     }
//   });

//   History.pop();

//   return response.text;
// }

async function main() {
  //const userProblem = readlineSync.question('Enter topic or question --> ');
  const mcqCount = parseInt(readlineSync.question('How many MCQs to generate? --> '), 10);
  //await generateMCQs(userProblem, mcqCount);
  await generateMCQs(mcqCount);
  main(); // loop again
}

main();

//it assume as two different questions but actually related no history check ,

//what is quick sort -->context:vector db answer
//explain it in detail --> context:vector db answer

// so solution 2nd llm previous que + model answer + new que
// reply what is quick sort in depth. (relavant query together,meaning ful together)
// next time we give this proper context
