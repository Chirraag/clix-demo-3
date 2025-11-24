const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export type Language = 'hindi' | 'english';

interface CallResponse {
  callId: string;
  joinUrl: string;
  participantToken?: string;
  serverUrl?: string;
  roomName?: string;
}

export async function createCall(language: Language): Promise<CallResponse> {
  const apiUrl = `${API_URL}/api/create-call`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ language }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create call: ${error}`);
  }

  const data = await response.json();
  console.log('Call data received:', data);
  return {
    callId: data.callId,
    joinUrl: data.joinUrl,
    participantToken: data.participantToken,
    serverUrl: data.serverUrl,
    roomName: data.roomName,
  };
}

export function connectWebSocket(joinUrl: string): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(joinUrl);
    ws.binaryType = 'arraybuffer';

    ws.onopen = () => {
      console.log('WebSocket connected');
      resolve(ws);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      reject(error);
    };
  });
}
