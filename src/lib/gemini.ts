import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyCA5SCGLJ4rs-sJctEut95QdQ8UY1XiHeU');

export const getGeminiModel = () => {
  return genAI.getGenerativeModel({ model: 'gemini-pro' });
};