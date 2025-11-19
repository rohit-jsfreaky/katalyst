import { Composio } from '@composio/core';

let composioInstance: Composio | null = null;

export const getComposioInstance = (): Composio => {
  if (!composioInstance) {
    const apiKey = process.env.COMPOSIO_API_KEY;
    if (!apiKey) {
      throw new Error('COMPOSIO_API_KEY is not set in environment variables');
    }
    composioInstance = new Composio(apiKey);
  }
  return composioInstance;
};

